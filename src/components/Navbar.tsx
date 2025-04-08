import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/lib/authService";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSigningOutLoading, setIsSigningOutLoading] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOutLoading(true);
    try {
      await authService.signOut();
      navigate({ to: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOutLoading(false);
    }
  };

  return (
    <header className="mb-4 p-4 flex justify-between items-center border-b border-border h-16">
      <Link to="/" className="font-bold text-lg">
        Uneducated Guess
      </Link>
      {user ? (
        <button
          type="button"
          onClick={handleSignOut}
          className="bg-secondary hover:bg-secondary/70 font-medium py-2 px-6 rounded-md transition-colors cursor-pointer grid [grid-template-areas:'stack']"
        >
          <span
            className={`[grid-area:stack] ${isSigningOutLoading ? "invisible" : "visible"}`}
          >
            Sign Out
          </span>
          <span
            aria-label="Signing you out"
            className={`[grid-area:stack] ${isSigningOutLoading ? "visible" : "invisible"}`}
          >
            ...
          </span>
        </button>
      ) : null}
    </header>
  );
};
