import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Common countries list (abbreviated)
const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Australia",
  "Austria",
  "Bangladesh",
  "Belgium",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Denmark",
  "Egypt",
  "Ethiopia",
  "Finland",
  "France",
  "Germany",
  "Ghana",
  "Greece",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Kenya",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Pakistan",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sweden",
  "Switzerland",
  "Thailand",
  "Turkey",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Venezuela",
  "Vietnam",
  "Zambia",
  "Zimbabwe",
];

interface ProfileDetails {
  sex: string | null;
  country: string | null;
  age: number | null;
  occupation: string | null;
}

export const ProfileDetailsForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [details, setDetails] = useState<ProfileDetails>({
    sex: null,
    country: null,
    age: null,
    occupation: null,
  });

  // Fetch existing profile details
  useEffect(() => {
    if (!user?.id) return;

    supabase
      .from("profiles")
      .select("sex, country, age, occupation")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setDetails({
            sex: (data as any).sex ?? null,
            country: (data as any).country ?? null,
            age: (data as any).age ?? null,
            occupation: (data as any).occupation ?? null,
          });
        }
        setLoading(false);
      });
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        sex: details.sex || null,
        country: details.country || null,
        age: details.age ? Number(details.age) : null,
        occupation: details.occupation || null,
      } as any)
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Update Failed",
        description: "Could not save your details. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile Updated",
        description: "Your personal details have been saved.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sex */}
      <div className="space-y-2">
        <Label htmlFor="sex">Sex</Label>
        <Select
          value={details.sex || ""}
          onValueChange={(val) => setDetails((d) => ({ ...d, sex: val || null }))}
        >
          <SelectTrigger id="sex">
            <SelectValue placeholder="Prefer not to say" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Country */}
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select
          value={details.country || ""}
          onValueChange={(val) => setDetails((d) => ({ ...d, country: val || null }))}
        >
          <SelectTrigger id="country">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Age */}
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          min={18}
          max={120}
          placeholder="Your age (optional)"
          value={details.age ?? ""}
          onChange={(e) =>
            setDetails((d) => ({ ...d, age: e.target.value ? Number(e.target.value) : null }))
          }
        />
      </div>

      {/* Occupation */}
      <div className="space-y-2">
        <Label htmlFor="occupation">Occupation</Label>
        <Input
          id="occupation"
          type="text"
          placeholder="Your occupation (optional)"
          value={details.occupation ?? ""}
          onChange={(e) => setDetails((d) => ({ ...d, occupation: e.target.value || null }))}
        />
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Details"
        )}
      </Button>
    </div>
  );
};
