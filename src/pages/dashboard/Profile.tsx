import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Calendar, Shield } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{user?.name}</h3>
                <p className="text-muted-foreground capitalize">{user?.role} Account</p>
              </div>
            </div>

            <div className="grid gap-4">
              <ProfileField icon={Mail} label="Email" value={user?.email || ""} />
              <ProfileField
                icon={Calendar}
                label="Member Since"
                value={new Date(user?.createdAt || "").toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
              <ProfileField
                icon={Shield}
                label="Account Status"
                value="Verified"
                valueClassName="text-success"
              />
            </div>
          </CardContent>
        </Card>

        {/* Account stats */}
        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <StatBox label="Total Invested" value="$5,000" />
              <StatBox label="Total Earnings" value="$750" />
              <StatBox label="Active Plans" value="2" />
              <StatBox label="Total Withdrawals" value="$500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

const ProfileField = ({
  icon: Icon,
  label,
  value,
  valueClassName = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  valueClassName?: string;
}) => (
  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
    <Icon className="h-5 w-5 text-muted-foreground" />
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`font-medium ${valueClassName}`}>{value}</p>
    </div>
  </div>
);

const StatBox = ({ label, value }: { label: string; value: string }) => (
  <div className="p-4 rounded-lg border border-border text-center">
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

export default Profile;
