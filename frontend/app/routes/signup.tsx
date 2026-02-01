import type { Route } from "./+types/signup";
// @ts-ignore
import SignupComponent from "../pages/Signup";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign Up - ELearning" },
    { name: "description", content: "Create your ELearning account" },
  ];
}

export default function Signup() {
  return <SignupComponent />;
}
