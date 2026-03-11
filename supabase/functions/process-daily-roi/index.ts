import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get all active investments (not paused, not completed, not cancelled)
    const { data: investments, error: fetchError } = await supabase
      .from("investments")
      .select("*")
      .eq("status", "active");

    if (fetchError) {
      throw new Error(`Failed to fetch investments: ${fetchError.message}`);
    }

    if (!investments || investments.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active investments to process", processed: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let processed = 0;
    let completed = 0;

    for (const inv of investments) {
      const now = new Date();
      const endDate = inv.end_date ? new Date(inv.end_date) : null;

      // Check if investment has expired
      if (endDate && now >= endDate) {
        // Mark as completed
        await supabase
          .from("investments")
          .update({ status: "completed", updated_at: now.toISOString() })
          .eq("id", inv.id);
        completed++;
        continue;
      }

      // Calculate daily ROI: amount * roi_percent / 100
      const dailyEarning = Number(inv.amount_usd) * Number(inv.roi_percent) / 100;
      const currentEarned = Number(inv.earned_amount) || 0;
      const newEarned = currentEarned + dailyEarning;

      // Update earned_amount on the investment
      const { error: updateInvError } = await supabase
        .from("investments")
        .update({
          earned_amount: newEarned,
          updated_at: now.toISOString(),
        })
        .eq("id", inv.id);

      if (updateInvError) {
        console.error(`Failed to update investment ${inv.id}:`, updateInvError);
        continue;
      }

      // Credit daily earning to user's balance
      const { error: creditError } = await supabase.rpc("credit_user_balance", {
        p_user_id: inv.user_id,
        p_amount: dailyEarning,
      });

      if (creditError) {
        console.error(`Failed to credit balance for user ${inv.user_id}:`, creditError);
        continue;
      }

      processed++;
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${processed} investments, completed ${completed}`,
        processed,
        completed,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing daily ROI:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
