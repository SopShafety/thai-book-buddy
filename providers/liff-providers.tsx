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

// Returns null on success, error string on failure.
// Also returns whether the profile needs onboarding (age/gender missing).
async function signInWithLINE(
  liff: Liff
): Promise<{ error: string | null; needsOnboarding: boolean }> {
  const accessToken = liff.getAccessToken();
  if (!accessToken) {
    return {
      error:
        "No accessToken from LIFF — check that the LIFF app is properly initialized",
      needsOnboarding: false,
    };
  }

  const supabase = getSupabase();

  // Step 1: Send LINE accessToken to Edge Function — it calls LINE's Profile API to verify
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

  // Step 2: Exchange the token hash for a real Supabase session
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash,
    type: "email",
  });

  if (error || !data.user) {
    return {
      error: `verifyOtp failed: ${error?.message ?? "no user returned"}`,
      needsOnboarding: false,
    };
  }

  // Step 3: Upsert base profile (name + picture only — don't overwrite age/gender)
  const { error: upsertError } = await supabase.from("profiles").upsert(
    { id: data.user.id, display_name, picture_url },
    { onConflict: "id", ignoreDuplicates: false }
  );

  if (upsertError) {
    return {
      error: `Profile upsert failed: ${upsertError.message}`,
      needsOnboarding: false,
    };
  }

  // Step 4: Check if age/gender have been collected yet
  const { data: profile } = await supabase
    .from("profiles")
    .select("age, gender")
    .eq("id", data.user.id)
    .single();

  const needsOnboarding = !profile?.age || !profile?.gender;

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
        console.log("LIFF init...");
        liff
          .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
          .then(async () => {
            console.log("LIFF init succeeded.");
            setLiffObject(liff);
            setIsLoggedIn(liff.isLoggedIn());

            if (liff.isLoggedIn()) {
              const { error, needsOnboarding } = await signInWithLINE(liff);
              if (error) setAuthError(error);
              setNeedsOnboarding(needsOnboarding);
            }
          })
          .catch((error: Error) => {
            console.log("LIFF init failed.");
            setLiffError(error.toString());
          })
          .finally(() => {
            setIsLoading(false);
          });
      });
  }, []);

  function logout() {
    liffObject?.logout();
    setIsLoggedIn(false);
    setNeedsOnboarding(false);
  }

  async function completeProfile(
    age: number,
    gender: string
  ): Promise<string | null> {
    const supabase = getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return "Not logged in";

    const { error } = await supabase
      .from("profiles")
      .update({ age, gender })
      .eq("id", user.id);

    if (error) return error.message;
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
  if (!liff) {
    throw new Error("useLIFF must be used within a LIFFProvider");
  }
  return liff;
}

export { LIFFProvider, useLIFF };
