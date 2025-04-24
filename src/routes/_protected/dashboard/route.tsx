import { useAuth } from "@/contexts/AuthContext";
import { createFileRoute } from "@tanstack/react-router";
import { QuestionSetsList } from "./-components/QuestionSetsList";

export const Route = createFileRoute("/_protected/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user?.email || "User"}!
      </h1>

      <QuestionSetsList />
    </div>
  );
}
