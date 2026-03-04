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

  console.log("[signInWithLINE] Signing in with Supabase...");
  const supabase = getSupabase();

  // LINE is configured as a custom OIDC provider in Supabase;
  // pass the issuer URL as the provider identifier.
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "https://access.line.me" as "google",
    token: idToken,
  });

  if (error) {
    console.error("[signInWithLINE] Supabase auth failed:", error.message);
    return;
  }

  const user = data.user;
  if (!user) {
    console.error("[signInWithLINE] No user returned from Supabase");
    return;
  }

  console.log("[signInWithLINE] Auth success, upserting profile for", user.id);
  const profile = await liff.getProfile();

  const { error: upsertError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      display_name: profile.displayName,
      picture_url: profile.pictureUrl ?? null,
    },
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
