import type { Route } from "./+types/dashboard";
// @ts-ignore
import DashboardComponent from "../pages/Dashboard";
// @ts-ignore
import { PrivateRoute } from "../components/PrivateRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - ELearning" },
    { name: "description", content: "Your learning dashboard" },
  ];
}

export default function Dashboard() {
  return (
    <PrivateRoute>
      <DashboardComponent />
    </PrivateRoute>
  );
}
