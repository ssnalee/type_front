<template>
    <div class="pd-20">
        <ul class="tab_cat_02">
            <li v-for="menu in manageMenuList" :key="menu.key" :class="{ active: menu.is_active }" @click="selectAdminTab(menu.key)">
                <router-link :to="menu.path">{{ menu?.label }}</router-link>
            </li>
        </ul>

        <div class="flex_center">
            <Suspense>
                <router-view></router-view>
            </Suspense>
        </div>

    </div>
</template>
<script setup lang="ts">
import { IMenu } from "@/store/menuList";
import { getItemWithExpireTime } from "@/utils/common";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";


const route = useRoute();
const router = useRouter();
const store = useStore();
const subPath = computed(() => route.path.split("/")[2]);
const manageMenuList = computed(()=>{
    if (getItemWithExpireTime("userInfoObj")?.is_admin) {
    return store.getters["menuList/adminMenuList"];
  } else  {
    return store.getters["menuList/sellerMenuList"];
  } 
});
const isAdmin = computed(()=>getItemWithExpireTime("userInfoObj")?.is_admin);
const isSeller = computed(()=>getItemWithExpireTime("userInfoObj")?.is_seller);

const selectAdminTab = (key : number) => {
    store.commit("menuList/setActiveMenu", key);
};

onMounted(()=>{
    if(!isAdmin.value && !isSeller.value) {
        router.push("/");
        return;
    }
    manageMenuList.value.map((item : IMenu)=>{
    const path = `${item.path && item.path.split("/")[2]}`;
    if( path === subPath.value ) selectAdminTab(item.key);
});

});

</script>

<style lang="scss" scoped>
@use '@/assets/scss/pages/manage' as manage;
</style>