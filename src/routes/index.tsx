import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <main className="text-center flex flex-col gap-8 items-center justify-center min-h-screen">
      <h1 className="font-medium text-2xl">Welcome to Uneducated Guess</h1>
      <div className="flex gap-4">
        <Link
          to="/sign-in"
          className="bg-secondary hover:bg-secondary/70 font-medium py-2 px-6 rounded-md transition-colors"
        >
          Sign In
        </Link>
        <Link
          to="/sign-up"
          className="hover:bg-secondary/20 border border-border font-medium py-2 px-6 rounded-md transition-colors"
        >
          Create Account
        </Link>
      </div>
    </main>
  );
}
