"use client";

import { Liff } from "@line/liff";
import { createContext, useContext, useEffect, useState } from "react";
import { getSupabase } from "../utils/supabase";

interface LIFFContextValue {
  liff: Liff | null;
  isLoading: boolean;
  liffError: string | null;
}

const LIFFContext = createContext<LIFFContextValue>({
  liff: null,
  isLoading: true,
  liffError: null,
});

async function signInWithLINE(liff: Liff) {
  const idToken = liff.getIDToken();
  if (!idToken) return;

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "kakao", // Supabase uses "kakao" as the OIDC provider name for LINE — see note below
    token: idToken,
  });

  if (error) {
    console.error("Supabase sign-in failed:", error.message);
    return;
  }

  const user = data.user;
  if (!user) return;

  const profile = await liff.getProfile();

  // Upsert profile row — safe to call on every login
  const { error: upsertError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      display_name: profile.displayName,
      picture_url: profile.pictureUrl ?? null,
    },
    { onConflict: "id" }
  );

  if (upsertError) {
    console.error("Profile upsert failed:", upsertError.message);
  }
}

function LIFFProvider({ children }: { children: React.ReactNode }) {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const value: LIFFContextValue = {
    liff: liffObject,
    isLoading,
    liffError: liffError,
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
