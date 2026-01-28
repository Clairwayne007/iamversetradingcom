import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Deposit {
  id: string;
  user_id: string;
  amount_usd: number;
  crypto_currency: string;
  crypto_amount: number | null;
  payment_id: string | null;
  invoice_id: string | null;
  invoice_url: string | null;
  status: "waiting" | "confirming" | "confirmed" | "failed" | "expired";
  created_at: string;
  updated_at: string;
}

export const useDeposits = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDeposits = async () => {
    if (!session) return;

    const { data, error } = await supabase
      .from("deposits")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching deposits:", error);
      return;
    }

    setDeposits(data as Deposit[]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDeposits();
  }, [session]);

  const createDeposit = async (
    amountUsd: number,
    cryptoCurrency: string
  ): Promise<{ success: boolean; invoiceUrl?: string; error?: string }> => {
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    try {
      const response = await supabase.functions.invoke("create-deposit", {
        body: { amount_usd: amountUsd, crypto_currency: cryptoCurrency },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { invoice_url, deposit } = response.data;

      if (deposit) {
        setDeposits((prev) => [deposit as Deposit, ...prev]);
      }

      return { success: true, invoiceUrl: invoice_url };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create deposit";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  const checkDepositStatus = async (depositId: string) => {
    if (!session) return;

    try {
      const response = await supabase.functions.invoke("check-deposit-status", {
        body: { deposit_id: depositId },
      });

      if (response.data?.deposit) {
        setDeposits((prev) =>
          prev.map((d) =>
            d.id === depositId ? (response.data.deposit as Deposit) : d
          )
        );
      }
    } catch (error) {
      console.error("Error checking deposit status:", error);
    }
  };

  return {
    deposits,
    isLoading,
    createDeposit,
    checkDepositStatus,
    refetch: fetchDeposits,
  };
};
