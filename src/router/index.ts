import { createRouter, createWebHistory } from "vue-router";
import { getItemWithExpireTime } from "@/utils/common";
import routes from "./routes";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to,from,next)=>{
  const isAdmin = getItemWithExpireTime("userInfoObj")?.is_admin === true;
  const isSeller = getItemWithExpireTime("userInfoObj")?.is_seller === true;
  if(isAdmin || isSeller) {
    if (to.path.startsWith("/user") || to.path.startsWith("/product") ||  to.path === "/") {
      next("/404");
      return;
    }
  }
  if (!isAdmin && !isSeller) {
    if (to.path.startsWith("/manages")) {
      next("/404");
      return;
    }
  }
  next();
})

export default router;
