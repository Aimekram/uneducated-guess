import { authService } from "@/lib/authService";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SignUpForm } from "./-components/SignUpForm";

export const Route = createFileRoute("/(auth)/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const handleSignUp = async ({
    email,
    password,
  }: { email: string; password: string }) => {
    const { error } = await authService.signUp(email, password);

    if (error) {
      throw error;
    }

    // If email confirmation is required in Supabase, show a message
    // Otherwise, navigate to sign-in page or dashboard
    navigate({ to: "/sign-in", search: { message: "sign-up-success" } });
  };

  return <SignUpForm onSubmit={handleSignUp} />;
}
