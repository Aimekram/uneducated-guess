import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ context, location }) => {
    // If auth is loaded and user exists, proceed immediately
    if (!context.auth.isAuthLoading && context.auth.user) {
      return;
    }

    // If auth is loaded and no user, redirect immediately
    if (!context.auth.isAuthLoading && !context.auth.user) {
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.pathname },
      });
    }

    // If auth is still loading, wait for it to complete
    if (context.auth.isAuthLoading) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Instead of checking the captured context (which won't have updated),
      // force a redirect to the same route to trigger a fresh check
      throw redirect({
        to: location.pathname,
        search: location.search,
        hash: location.hash,
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
