<template>
  <div :class="['nav_btn', { active: isNav }]" @click="isNav = !isNav">
    <span class="line line1"></span>
    <span class="line line2"></span>
    <span class="line line3"></span>
  </div>
  <nav :class="['nav', { active: isNav }]">
    <ul class="nav_bar nv_left">
      <li v-for="item in menuList" :key="item" @click="selectCtgy(item)"
        :class="{ active: item.is_active &&( mainPath == 'products' || mainPath == 'manage' ) }">
        {{ item.label }}
      </li>
    </ul>
    <ul class="nav_bar nv_right">
      <li v-if="!loginSuccess" :class="['diff', { active: mainPath == 'join' }]" @click="isNav = false">
        <router-link to="/join">Sign Up</router-link>
      </li>
      <li v-if="!loginSuccess" :class="['diff', { active: mainPath == 'login' }]" @click="isNav = false">
        <router-link to="/login"><img src="@/assets/img/power_icon.png" class="sm_icon" />Log in</router-link>
      </li>
      <li v-if="loginSuccess && !isSeller && ! isAdmin" :class="{ active: subPath == 'basket' }" @click="isNav = false">
        <router-link to="/user/basket"><img src="@/assets/img/common/cart.png" class="sm_icon" />BASKET</router-link>
      </li>
      <li v-if="loginSuccess && !isSeller && ! isAdmin" :class="{ active: subPath == 'mypage' || subPath == 'profile' }" @click="isNav = false">
        <router-link to="/user/mypage"><img src="@/assets/img/common/mypage.png" class="sm_icon" />MY PAGE</router-link>
      </li>
      <!-- <li v-if="loginSuccess" :class="{ active: mainPath == 'manage' }" @click="isNav = false">
        <router-link to="/manage/products"><img src="@/assets/img/settings_icon.png"
            class="sm_icon" />SETTINGS</router-link>
      </li> -->
      <li v-if="loginSuccess" @click="isNav = false">
        <router-link to="/login"><img src="@/assets/img/power_icon.png" class="sm_icon" />Log Out</router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { IMenu } from "@/store/menuList";
import { getItemWithExpireTime } from "@/utils/common";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();
const route = useRoute();
const mainPath = computed(() => route.path.split("/")[1] );
const subPath = computed(() => route.path.split("/")[2] );
const loginSuccess = computed(() => store.state.user.loginSuccess);
const isAdmin = computed(()=>getItemWithExpireTime("userInfoObj")?.is_admin);
const isSeller = computed(()=>getItemWithExpireTime("userInfoObj")?.is_seller);
const isNav = ref(false);
const userInfo = ref(getItemWithExpireTime("userInfoObj"));
const menuList = computed(() => {
  if (userInfo.value?.is_admin) {
    return store.getters["menuList/adminMenuList"];
  } else if (userInfo.value?.is_seller) {
    return store.getters["menuList/sellerMenuList"];
  } else {
    return store.getters["menuList/userMenuList"];
  }
});
watch(loginSuccess, () => {
  userInfo.value = getItemWithExpireTime("userInfoObj");
});
// 선택한 카테고리 이름 store 저장
const selectCtgy = (item: IMenu) => {
  store.commit("menuList/setActiveMenu", item.key);
  isNav.value = false;
  router.push(item.path || '/products');
};


</script>

<style lang="scss" scoped></style>
