import { RouteRecordRaw } from "vue-router";
import UserMypage from "@/pages/user/UserMypage.vue";
import user from "@/pages/user/index.vue";
const routes: Array<RouteRecordRaw> = [
  // 메인 페이지
  {
    path: "/",
    name: "MainView",
    component: () => import("@/pages/views/ViewMain.vue"),
    props: true,
  },
  // 로그인 페이지
  {
    path: "/login",
    name: "LoginView",
    component: () => import("@/pages/views/ViewLogin.vue"),
    props: true,
  },
  // 회원가입 페이지
  {
    path: "/join",
    name: "JoinView",
    component: () => import("@/pages/views/ViewJoin.vue"),
    props: true,
  },
  //상품 페이지
  {
    path: "/products",
    component: () => import("@/pages/product/index.vue"),
    children: [
      { path: "", component: () => import("@/pages/product/ProductList.vue") },
      { path: ":id", component: () => import("@/pages/product/ProductList.vue") },
      { path: "detail/:id", component: () => import("@/pages/product/ProductDetail.vue") },
    ],
  },
  //유저 페이지
  {
    path: "/user",
    component: () => import("@/pages/user/index.vue"),
    redirect:"/user/mypage",
    props: true,
    children: [
      { path: "mypage", component: () => import("@/pages/user/UserMypage.vue") },
      { path: "delivery", component: () => import("@/pages/user/UserDelivery.vue") },
      { path: "profile", component: () => import("@/pages/user/UserProfile.vue") },
      { path: "purchase", component: () => import("@/pages/user/UserPurchase.vue") },
      { path: "basket", component: () => import("@/pages/user/UserBasket.vue") },
    ],
  },
  //관리자 페이지
  {
    path: "/manage",
    component: () => import("@/pages/manage/index.vue"),
    redirect:"/manage/products",
    children: [
      { path: "orders", component: () => import("@/pages/manage/ManageOrders.vue") },
      {
        path: "products",
        children: [
          { path: "", component: () => import("@/pages/manage/ManageProducts.vue") },
          { path: ":id", component: () => import("@/pages/manage/product/ProductForm.vue") },
        ],
      },
      {
        path: "users",
        component: () => import("@/pages/manage/ManageUser.vue")
      },
      {
        path: "users/profile",
        component: () => import("@/pages/user/UserProfile.vue"),
      },
    ],
  }, 
  // icon 저작권 페이지
  {
    path: "/icons",
    name: "iconView",
    component: () => import("@/pages/icon/IconCopyright.vue"),
    props: true,
  },
  // 404 페이지
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/pages/views/ViewNotFound.vue"),
  },

];

export default routes;
