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
    const { idToken } = await req.json();

    // Step 1: Verify the LINE idToken with LINE's API
    const params = new URLSearchParams({
      id_token: idToken,
      client_id: Deno.env.get("LINE_CHANNEL_ID")!,
    });

    const verifyRes = await fetch("https://api.line.me/oauth2/v2.1/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const lineData = await verifyRes.json();

    if (!verifyRes.ok) {
      return new Response(
        JSON.stringify({ error: "LINE verification failed", detail: lineData }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const lineUserId: string = lineData.sub;
    const email = `line_${lineUserId}@line-auth.local`;
    const display_name: string | null = lineData.name ?? null;
    const picture_url: string | null = lineData.picture ?? null;

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
