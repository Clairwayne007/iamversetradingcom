import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className, size = "md" }: LogoProps) => {
  const sizes = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("flex items-center justify-center rounded-full bg-primary", sizes[size], size === "sm" ? "w-6" : size === "md" ? "w-8" : "w-10")}>
        <span className="text-primary-foreground font-bold text-sm">IA</span>
      </div>
      <span className="font-bold text-foreground">
        IAMVERSE<span className="text-primary">.com</span>
      </span>
    </div>
  );
};
