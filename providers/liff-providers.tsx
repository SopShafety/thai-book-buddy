"use client";

import { Liff } from "@line/liff";
import { createContext, useContext, useEffect, useState } from "react";
import { getSupabase } from "../utils/supabase";

interface LIFFContextValue {
  liff: Liff | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  liffError: string | null;
  authError: string | null;
  logout: () => void;
}

const LIFFContext = createContext<LIFFContextValue>({
  liff: null,
  isLoading: true,
  isLoggedIn: false,
  liffError: null,
  authError: null,
  logout: () => {},
});

async function signInWithLINE(liff: Liff): Promise<string | null> {
  const accessToken = liff.getAccessToken();
  if (!accessToken) {
    return "No accessToken from LIFF — check that the LIFF app is properly initialized";
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
    return `Fetch failed: ${String(err)}`;
  }

  const edgeData = await res.json();
  if (!res.ok) {
    return `Edge function error (${res.status}): ${JSON.stringify(edgeData)}`;
  }

  const { token_hash, display_name, picture_url } = edgeData;

  // Step 2: Exchange the token hash for a real Supabase session
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash,
    type: "email",
  });

  if (error || !data.user) {
    return `verifyOtp failed: ${error?.message ?? "no user returned"}`;
  }

  // Step 3: Upsert profile — edge function already got name/picture from LINE Profile API
  const finalName = display_name;
  const finalPicture = picture_url;

  const { error: upsertError } = await supabase.from("profiles").upsert(
    { id: data.user.id, display_name: finalName, picture_url: finalPicture },
    { onConflict: "id" }
  );

  if (upsertError) {
    return `Profile upsert failed: ${upsertError.message}`;
  }

  return null; // success
}

function LIFFProvider({ children }: { children: React.ReactNode }) {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    // to avoid `window is not defined` error
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
              const err = await signInWithLINE(liff);
              if (err) setAuthError(err);
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
  }

  const value: LIFFContextValue = {
    liff: liffObject,
    isLoading,
    isLoggedIn,
    liffError,
    authError,
    logout,
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
