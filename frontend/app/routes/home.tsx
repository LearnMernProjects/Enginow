import type { Route } from "./+types/home";
import HomeComponent from "../pages/Home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ELearning - Learn New Skills" },
    { name: "description", content: "Learn new skills and advance your career with our comprehensive courses." },
  ];
}

export default function Home() {
  return <HomeComponent />;
}

