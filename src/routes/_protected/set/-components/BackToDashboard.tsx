import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const BackToDashboardButton = () => {
  return (
    <Button variant="ghost" size="sm" asChild>
      <Link to="/dashboard">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to dashboard
      </Link>
    </Button>
  );
};
