import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { accessToken } = await req.json();

    // Step 1: Verify the access token by calling LINE's Profile API
    const profileRes = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      const detail = await profileRes.json();
      return new Response(
        JSON.stringify({ error: "LINE profile fetch failed", detail }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const lineProfile = await profileRes.json();
    // lineProfile: { userId, displayName, pictureUrl, statusMessage }

    const lineUserId: string = lineProfile.userId;
    const email = `line_${lineUserId}@line-auth.local`;
    const display_name: string | null = lineProfile.displayName ?? null;
    const picture_url: string | null = lineProfile.pictureUrl ?? null;

    // Step 2: Create Supabase admin client
    // SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-injected by Supabase
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Step 3: Create user if they don't exist yet (ignore "already exists" error)
    await adminClient.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { line_user_id: lineUserId, display_name, picture_url },
    });

    // Step 4: Generate a one-time sign-in token for this user
    const { data: linkData, error: linkError } =
      await adminClient.auth.admin.generateLink({
        type: "magiclink",
        email,
      });

    if (linkError || !linkData?.properties?.hashed_token) {
      return new Response(
        JSON.stringify({ error: "Failed to generate token", detail: linkError?.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        token_hash: linkData.properties.hashed_token,
        display_name,
        picture_url,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal error", detail: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
