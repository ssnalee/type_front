<template>
    <div class="shop_wrap">
        <ul class="tab_cat_06 pt-20">
            <li v-for="item in menuList" :key="item.key" @click="() => handleMainMenuClick(item)"
                :class="{ active: item.is_active }">
                {{ item.label }}
            </li>
        </ul>
        <ul class="tab_cat_01 pt-20 pb-20 mb-50">
            <li v-for="item in subMenuList" :key="item.key" :class="['submenu',{ active: item.is_active }]"
                @click="() => handleSubMenuClick(item.key)">
                <img v-if="item.image" class="submenu_img" :src="item.image" :alt="item.label" />{{ item.label }}
            </li>
        </ul>
    </div>
    <pdt-list-component v-if="!isFetch" :list="products" @fetchItems="fetchAllProducts" />
    <Spinner v-if="isFetch" :isFixed="true" /> 
</template>

<script setup lang="ts">
import productApi from "@/api/apiProduct";
import Spinner from "@/components/common/ComnSpinner.vue";
import PdtListComponent from "@/components/pages/product/PdtListComponent.vue";
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { getItemWithExpireTime } from "@/utils/common";
import { IProductsResult } from "@/types/product";
import { IMenu } from "@/store/menuList";
import { sortData } from "@/utils/common";

const store  = useStore();
const route  = useRoute();
const router = useRouter();
const isFetch = ref(false);
const originalProducts = ref<IProductsResult[]>([]);
const products         = ref<IProductsResult[]>([]);
const userId           = computed(() => getItemWithExpireTime("userInfoObj")?.user_id);
const currentId        = computed(() => route.params.id);
const menuList         = computed(() => store.getters["menuList/userMenuList"]);
const subMenuList      = computed(() => store.getters["menuList/subMenuList"]);
const activeMenu       = computed(() => store.getters["menuList/activeMenu"]);
const activeSubMenu    = computed(() => store.getters["menuList/activeSubMenu"]);

const result = ref<IProductsResult[]>([]);

// 메인 메뉴 클릭 핸들러
const handleMainMenuClick = (item: IMenu) => {
    store.commit("menuList/setActiveMenu", item.key);
    router.push(item.path || '/products');
};

// 서브 메뉴 클릭 핸들러
const handleSubMenuClick = async (num: number) => {
    if (activeSubMenu.value.key !== num) {
        store.commit("menuList/setActiveSubMenu", num);
    }
    products.value = (activeSubMenu.value.key === 0)
        ? originalProducts.value
        : originalProducts.value.filter(item => item.animal_category === activeSubMenu.value.label);
};

// 상품 정보 전체 조회 API 호출
const sortProducts = async (): Promise<void> => {
    try {
        isFetch.value = true;
        const filteredData = (activeMenu.value?.label === "ALL" || !activeMenu.value)
            ? result.value
            : result.value.filter(item => activeMenu.value.label === item.category);
        originalProducts.value = sortData(filteredData);
        await handleSubMenuClick(activeSubMenu.value.key);
        await nextTick();
        isFetch.value = false;
    } catch (error) {
        await nextTick();
        isFetch.value = false;
        console.error(error);
    }
};
const fetchAllProducts = async () => {
    result.value = await productApi.viewAllProduct(userId.value);
    await sortProducts();
}
watch(currentId, ()=>{
    sortProducts();
});

onMounted(() => {
    store.commit('menuList/setActiveMenu', Number(currentId.value) || 0);
    store.commit('menuList/setActiveSubMenu', 0);
    fetchAllProducts();
});

</script>
