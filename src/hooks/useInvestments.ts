import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Investment {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  amount_usd: number;
  roi_percent: number;
  duration_days: number;
  start_date: string;
  end_date: string | null;
  earned_amount: number;
  status: "active" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export const useInvestments = () => {
  const { session } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvestments = async () => {
    if (!session) return;

    const { data, error } = await supabase
      .from("investments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching investments:", error);
      return;
    }

    setInvestments(data as Investment[]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInvestments();
  }, [session]);

  const createInvestment = async (
    planId: string,
    planName: string,
    amountUsd: number,
    roiPercent: number,
    durationDays: number
  ): Promise<{ success: boolean; error?: string }> => {
    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    // First, get current balance and check if sufficient
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", session.user.id)
      .single();

    if (profileError || !profile) {
      return { success: false, error: "Failed to fetch profile" };
    }

    if (Number(profile.balance) < amountUsd) {
      return { success: false, error: "Insufficient balance" };
    }

    // Deduct from balance
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ balance: Number(profile.balance) - amountUsd })
      .eq("id", session.user.id);

    if (updateError) {
      return { success: false, error: "Failed to update balance" };
    }

    // Create investment
    const { data, error } = await supabase
      .from("investments")
      .insert({
        user_id: session.user.id,
        plan_id: planId,
        plan_name: planName,
        amount_usd: amountUsd,
        roi_percent: roiPercent,
        duration_days: durationDays,
        end_date: endDate.toISOString(),
        status: "active",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating investment:", error);
      // Rollback balance (best effort)
      await supabase
        .from("profiles")
        .update({ balance: Number(profile.balance) })
        .eq("id", session.user.id);
      return { success: false, error: error.message };
    }

    if (data) {
      setInvestments((prev) => [data as Investment, ...prev]);
    }

    return { success: true };
  };

  const activeInvestments = investments.filter((inv) => inv.status === "active");
  const totalInvested = investments
    .filter((inv) => inv.status === "active")
    .reduce((sum, inv) => sum + Number(inv.amount_usd), 0);
  const totalEarned = investments.reduce((sum, inv) => sum + Number(inv.earned_amount), 0);

  return {
    investments,
    activeInvestments,
    totalInvested,
    totalEarned,
    isLoading,
    createInvestment,
    refetch: fetchInvestments,
  };
};
