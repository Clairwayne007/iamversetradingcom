import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { email, name }: WelcomeEmailRequest = await req.json();

    if (!email) {
      throw new Error("Missing required field: email");
    }

    const userName = name || "there";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "IAMverse <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to IAMverse! 🎉",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Welcome to IAMverse!</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333;">Hi ${userName}! 👋</h2>
              <p>Congratulations! Your account has been successfully created on IAMverse.</p>
              <p>You're now part of our investment community. Here's what you can do:</p>
              <ul style="color: #555;">
                <li>Explore our investment plans</li>
                <li>Track your portfolio performance</li>
                <li>Make secure deposits and withdrawals</li>
                <li>Access real-time market data</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '.lovable.app')}/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Go to Dashboard</a>
              </div>
              <p style="color: #666; font-size: 14px;">If you have any questions, feel free to reach out to our support team.</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">© 2026 IAMverse. All rights reserved.</p>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      // If Resend validation fails (unverified domain), log and return gracefully
      if (response.status === 403 && data?.name === "validation_error") {
        console.log("Resend send blocked (likely unverified domain):", data);
        return new Response(
          JSON.stringify({ success: false, skipped: true, reason: "RESEND_VALIDATION_ERROR", data }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      throw new Error(`Resend API error: ${JSON.stringify(data)}`);
    }

    console.log("Welcome email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in send-welcome-email function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
