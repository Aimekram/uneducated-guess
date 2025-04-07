import { authService } from "@/lib/authService";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SignInForm } from "./-components/SignInForm";

export const Route = createFileRoute("/(auth)/sign-in")({
  component: () => {
    const navigate = useNavigate();

    const handleSignIn = async ({
      email,
      password,
    }: { email: string; password: string }) => {
      const { error } = await authService.signIn(email, password);

      if (error) {
        throw error;
      }

      navigate({ to: "/" });
    };

    return <SignInForm onSubmit={handleSignIn} />;
  },
});
