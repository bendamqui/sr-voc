import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    redirect: "/lessons",
    component: () => import("@/layouts/DefaultLayout"),
    children: [
      {
        path: "/lessons",
        name: "lessons",
        component: () => import("@/pages/Lessons")
      },
      {
        path: "/lessons/:id",
        name: "lesson",
        component: () => import("@/pages/Lesson"),
        props: true
      },
      {
        path: "/words",
        name: "words",
        component: () => import("@/pages/Words")
      },
      {
        path: "/example",
        name: "example",
        component: () => import("@/pages/Example")
      },
      {
        path: "/sandbox",
        name: "sandbox",
        component: () => import("@/pages/Sandbox")
      }
    ]
  },
  {
    path: "*",
    redirect: "/"
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
