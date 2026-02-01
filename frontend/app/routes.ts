import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  route("courses", "routes/courses.tsx"),
  route("courses/:slug", "routes/course-detail.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("admin", "routes/admin.tsx"),
] satisfies RouteConfig;
