import Vue from "vue";
import VueRouter from "vue-router";
import { beforeEach, afterEach } from "./permission";
import cmdbRoutes from "./system/cmdb";
import adminRoutes from "./system/admin";
import workflowRoutes from "./system/workflow";
import Layout from "@/layout";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        name: "Dashboard",
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/keyauth/login/index.vue"),
  },
  {
    path: "/profile",
    component: Layout,
    redirect: "/profile/index",
    children: [
      {
        path: "index",
        name: "ProfileIndex",
        component: () => import("../views/keyauth/profile/index.vue"),
      },
      {
        path: "init",
        name: "ProfileInit",
        component: () => import("../views/keyauth/profile/initial.vue"),
      },
    ],
  },
  // cmdb 路由
  cmdbRoutes,
  // admin 路由
  adminRoutes,
  // workflow 路由
  workflowRoutes,
  {
    path: "/404",
    component: () => import("@/views/common/error-page/404"),
  },
  // 如果前面所有路径都没有匹配到页面 就跳转到404页面
  { path: "*", redirect: "/404" },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(beforeEach);
router.afterEach(afterEach);

export default router;
