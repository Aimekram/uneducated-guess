import { useAuth } from "@/contexts/AuthContext";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();

  return (
    <div>
      <p>{`Hello ${user?.email || "World"}!`}</p>
    </div>
  );
}
