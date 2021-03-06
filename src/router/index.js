import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login";
import User from "../views/User";
import Lesson from "../views/users/Lesson";
import Student from "../views/users/Student";
import StudentSummary from "../views/users/StudentSummary";
import TestLevel from "../views/users/LevelTest";
import Score from "../views/users/Score";
import Bill from "../views/users/Bill";
import BillSummary from "../views/users/BillSummary";
import Report from "../views/users/Report";
import CashReceipt from "../views/users/CashReceipt";
import Unpaid from "../views/users/Unpaid";
import Progress from "../views/users/Progress";
import Account from "../views/users/Account";

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
      { path: "summary", name: "summary", component: StudentSummary },
      { path: "levelTest", name: "levelTest", component: TestLevel },
      { path: "score", name: "score", component: Score },
      { path: "report", name: "report", component: Report },
      { path: "progress", name: "progress", component: Progress },
      { path: "bill", name: "bill", component: Bill },
      { path: "billSummary", name: "billSummary", component: BillSummary },
      { path: "cashReceipt", name: "cashReceipt", component: CashReceipt },
      { path: "unpaid", name: "unpaid", component: Unpaid },
      { path: "account", name: "account", component: Account },
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
