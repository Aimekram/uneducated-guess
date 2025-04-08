import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-md mx-auto my-10 flex flex-col gap-4">
      <Outlet />
    </div>
  );
}
