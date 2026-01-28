import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = await req.json();
    console.log("NOWPayments webhook received:", JSON.stringify(payload));

    const {
      payment_id,
      invoice_id,
      payment_status,
      pay_amount,
      pay_currency,
      actually_paid,
      price_amount,
    } = payload;

    if (!invoice_id) {
      console.log("No invoice_id in payload");
      return new Response(
        JSON.stringify({ success: true, message: "No invoice_id" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map NOWPayments status to our status
    let status: "waiting" | "confirming" | "confirmed" | "failed" | "expired";
    switch (payment_status) {
      case "waiting":
        status = "waiting";
        break;
      case "confirming":
        status = "confirming";
        break;
      case "confirmed":
      case "finished":
        status = "confirmed";
        break;
      case "failed":
      case "refunded":
        status = "failed";
        break;
      case "expired":
        status = "expired";
        break;
      default:
        status = "waiting";
    }

    // Update deposit record
    const { data: deposit, error: updateError } = await supabase
      .from("deposits")
      .update({
        payment_id: payment_id?.toString(),
        status: status,
        crypto_amount: actually_paid || pay_amount,
      })
      .eq("invoice_id", invoice_id.toString())
      .select()
      .single();

    if (updateError) {
      console.error("Error updating deposit:", updateError);
      throw updateError;
    }

    // If payment confirmed, credit user balance
    if (status === "confirmed" && deposit) {
      const { error: profileError } = await supabase.rpc("credit_user_balance", {
        p_user_id: deposit.user_id,
        p_amount: deposit.amount_usd,
      });

      if (profileError) {
        console.error("Error crediting balance:", profileError);
        // Create the RPC function if it doesn't exist and retry with direct update
        const { error: directError } = await supabase
          .from("profiles")
          .update({
            balance: supabase.rpc("get_balance_plus", {
              user_id: deposit.user_id,
              add_amount: deposit.amount_usd,
            }),
          })
          .eq("id", deposit.user_id);

        if (directError) {
          // Fallback: get current balance and add
          const { data: profile } = await supabase
            .from("profiles")
            .select("balance")
            .eq("id", deposit.user_id)
            .single();

          if (profile) {
            await supabase
              .from("profiles")
              .update({ balance: Number(profile.balance) + Number(deposit.amount_usd) })
              .eq("id", deposit.user_id);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
