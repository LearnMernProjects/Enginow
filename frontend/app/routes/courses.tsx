import type { Route } from "./+types/courses";
// @ts-ignore
import CoursesComponent from "../pages/Courses";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Courses - ELearning" },
    { name: "description", content: "Browse our course catalog" },
  ];
}

export default function Courses() {
  return <CoursesComponent />;
}
