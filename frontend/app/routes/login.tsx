import type { Route } from "./+types/login";
// @ts-ignore
import LoginComponent from "../pages/Login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - ELearning" },
    { name: "description", content: "Login to your ELearning account" },
  ];
}

export default function Login() {
  return <LoginComponent />;
}
