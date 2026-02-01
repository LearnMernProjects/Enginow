import type { Route } from "./+types/admin";
// @ts-ignore
import AdminComponent from "../pages/Admin";
// @ts-ignore
import { PrivateRoute } from "../components/PrivateRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Panel - ELearning" },
    { name: "description", content: "Admin panel" },
  ];
}

export default function Admin() {
  return (
    <PrivateRoute requireAdmin={true}>
      <AdminComponent />
    </PrivateRoute>
  );
}
