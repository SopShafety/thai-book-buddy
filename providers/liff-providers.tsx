"use client";

import { Liff } from "@line/liff";
import { createContext, useContext, useEffect, useState } from "react";
import { getSupabase } from "../utils/supabase";

interface LIFFContextValue {
  liff: Liff | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  needsOnboarding: boolean;
  liffError: string | null;
  authError: string | null;
  logout: () => void;
  completeProfile: (age: number, gender: string) => Promise<string | null>;
}

const LIFFContext = createContext<LIFFContextValue>({
  liff: null,
  isLoading: true,
  isLoggedIn: false,
  needsOnboarding: false,
  liffError: null,
  authError: null,
  logout: () => {},
  completeProfile: async () => null,
});

const ONBOARDING_KEY = "onboarding_complete";

async function signInWithLINE(
  liff: Liff
): Promise<{ error: string | null; needsOnboarding: boolean }> {
  const accessToken = liff.getAccessToken();
  if (!accessToken) {
    return {
      error: "No accessToken from LIFF — check that the LIFF app is properly initialized",
      needsOnboarding: false,
    };
  }

  const supabase = getSupabase();

  // Step 1: Edge Function — verify LINE token + get profile
  let res: Response;
  try {
    res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/auth-line`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ accessToken }),
      }
    );
  } catch (err) {
    return { error: `Fetch failed: ${String(err)}`, needsOnboarding: false };
  }

  const edgeData = await res.json();
  if (!res.ok) {
    return {
      error: `Edge function error (${res.status}): ${JSON.stringify(edgeData)}`,
      needsOnboarding: false,
    };
  }

  const { token_hash, display_name, picture_url } = edgeData;

  // Step 2: Exchange token hash for Supabase session
  const { data, error } = await supabase.auth.verifyOtp({ token_hash, type: "email" });
  if (error || !data.user) {
    return {
      error: `verifyOtp failed: ${error?.message ?? "no user returned"}`,
      needsOnboarding: false,
    };
  }

  // Step 3: Upsert profile + check onboarding in parallel
  const [{ error: upsertError }, { data: profile }] = await Promise.all([
    supabase.from("profiles").upsert(
      { id: data.user.id, display_name, picture_url },
      { onConflict: "id", ignoreDuplicates: false }
    ),
    supabase.from("profiles").select("age, gender").eq("id", data.user.id).single(),
  ]);

  if (upsertError) {
    return { error: `Profile upsert failed: ${upsertError.message}`, needsOnboarding: false };
  }

  const needsOnboarding = !profile?.age || !profile?.gender;
  if (needsOnboarding) {
    localStorage.removeItem(ONBOARDING_KEY);
  } else {
    localStorage.setItem(ONBOARDING_KEY, "true");
  }

  return { error: null, needsOnboarding };
}

function LIFFProvider({ children }: { children: React.ReactNode }) {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    import("@line/liff")
      .then((liff) => liff.default)
      .then((liff) => {
        liff
          .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
          .then(async () => {
            setLiffObject(liff);
            setIsLoggedIn(liff.isLoggedIn());

            if (liff.isLoggedIn()) {
              const { error, needsOnboarding } = await signInWithLINE(liff);
              if (error) setAuthError(error);
              setNeedsOnboarding(needsOnboarding);
            }
          })
          .catch((error: Error) => {
            setLiffError(error.toString());
          })
          .finally(() => {
            setIsLoading(false);
          });
      });
  }, []);

  function logout() {
    liffObject?.logout();
    localStorage.removeItem(ONBOARDING_KEY);
    setIsLoggedIn(false);
    setNeedsOnboarding(false);
  }

  async function completeProfile(age: number, gender: string): Promise<string | null> {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return "Not logged in";

    const { error } = await supabase.from("profiles").update({ age, gender }).eq("id", user.id);
    if (error) return error.message;

    localStorage.setItem(ONBOARDING_KEY, "true");
    setNeedsOnboarding(false);
    return null;
  }

  const value: LIFFContextValue = {
    liff: liffObject,
    isLoading,
    isLoggedIn,
    needsOnboarding,
    liffError,
    authError,
    logout,
    completeProfile,
  };
  return <LIFFContext.Provider value={value}>{children}</LIFFContext.Provider>;
}

function useLIFF(): LIFFContextValue {
  const liff = useContext(LIFFContext);
  if (!liff) throw new Error("useLIFF must be used within a LIFFProvider");
  return liff;
}

export { LIFFProvider, useLIFF };
