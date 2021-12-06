import Layout from "@/layout";

export default {
  path: "/workflow",
  component: Layout,
  redirect: "/workflow/action/list",
  children: [
    {
      path: "action/list",
      component: () => import("@/views/workflow/action/list"),
      name: "ActionList",
    },
    {
      path: "application/list",
      component: () => import("@/views/workflow/application/list"),
      name: "ApplicationList",
    },
  ],
};
