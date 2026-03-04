"use client";

import { Liff } from "@line/liff";
import { createContext, useContext, useEffect, useState } from "react";
import { getSupabase } from "../utils/supabase";

interface LIFFContextValue {
  liff: Liff | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  liffError: string | null;
  logout: () => void;
}

const LIFFContext = createContext<LIFFContextValue>({
  liff: null,
  isLoading: true,
  isLoggedIn: false,
  liffError: null,
  logout: () => {},
});

async function signInWithLINE(liff: Liff) {
  const idToken = liff.getIDToken();
  if (!idToken) {
    console.error("[signInWithLINE] No idToken from LIFF");
    return;
  }

  const supabase = getSupabase();

  // Step 1: Send LINE idToken to Edge Function for server-side verification
  console.log("[signInWithLINE] Calling auth-line edge function...");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/auth-line`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ idToken }),
    }
  );

  const edgeData = await res.json();
  if (!res.ok) {
    console.error("[signInWithLINE] Edge function error:", edgeData);
    return;
  }

  const { token_hash, display_name, picture_url } = edgeData;

  // Step 2: Exchange the token hash for a real Supabase session
  console.log("[signInWithLINE] Exchanging token for session...");
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash,
    type: "email",
  });

  if (error || !data.user) {
    console.error("[signInWithLINE] verifyOtp failed:", error?.message);
    return;
  }

  console.log("[signInWithLINE] Session created for", data.user.id);

  // Step 3: Upsert profile — fall back to liff.getProfile() if token had no name/picture
  let finalName = display_name;
  let finalPicture = picture_url;
  if (!finalName) {
    const profile = await liff.getProfile();
    finalName = profile.displayName;
    finalPicture = profile.pictureUrl ?? null;
  }

  const { error: upsertError } = await supabase.from("profiles").upsert(
    { id: data.user.id, display_name: finalName, picture_url: finalPicture },
    { onConflict: "id" }
  );

  if (upsertError) {
    console.error("[signInWithLINE] Profile upsert failed:", upsertError.message);
  } else {
    console.log("[signInWithLINE] Profile upserted successfully");
  }
}

function LIFFProvider({ children }: { children: React.ReactNode }) {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
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
              await signInWithLINE(liff);
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
