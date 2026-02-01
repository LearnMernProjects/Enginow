import type { Route } from "./+types/course-detail";
// @ts-ignore
import CourseDetailComponent from "../pages/CourseDetail";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Course Detail - ELearning" },
    { name: "description", content: "View course details" },
  ];
}

export default function CourseDetail() {
  return <CourseDetailComponent />;
}
