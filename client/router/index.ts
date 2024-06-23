import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import ProfileView from "../views/ProfileView.vue";
import SettingsView from "../views/SettingsView.vue";
import RankingView from "@/views/RankingView.vue";
import PRsView from "@/views/PRsView.vue";
import MITRecordsView from "@/views/MITRecordsView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/profile/:username",
      name: "Profile",
      component: ProfileView,
      props: true,
    },
    {
      path: "/ranking",
      name: "Ranking",
      component: RankingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/pr",
      name: "PRs",
      component: PRsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/mit",
      name: "MIT",
      component: MITRecordsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
