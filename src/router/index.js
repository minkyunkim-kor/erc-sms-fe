import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login";
import User from "../views/User";
import Lesson from "../views/users/Lesson";
import Student from "../views/users/Student";
import TestLevel from "../views/users/LevelTest";
import Score from "../views/users/Score";

Vue.use(VueRouter);

const routes = [
  { path: "/login", name: "login", component: Login },
  {
    path: "/users",
    name: "user",
    component: User,
    children: [
      { path: "lesson", name: "lesson", component: Lesson },
      { path: "student", name: "student", component: Student },
      { path: "levelTest", name: "levelTest", component: TestLevel },
      { path: "score", name: "score", component: Score },
    ],
  },
  { path: "*", redirect: "/login" },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
