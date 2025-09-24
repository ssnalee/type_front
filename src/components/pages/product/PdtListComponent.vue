<template>
  <div>
    <ComnNodata class="mb-30" :list="props.list" height="50vh"/>
    <ul class="list_style"  >
      <li
        class="list_content pr"
        v-for="(item, index) in displayedPosts"
        :key="index"
      >
        <img
          v-lazy="item.thumbnail"
          :alt="item.name"
          class="pd-20"
          @click="clickProduct(item.id)"
         
        />
        <div class="txt_wrap pd-20">
          <div @click="clickProduct(item.id)" class="txt_cursor">
            <p class="mb-10 fb fs-18">{{ item.name }}</p>
            <p class="mb-15 category_txt">
              <span :class="item.animal_category ==='강아지' ? 'dog' : 'cat'">#{{ item.animal_category }}</span> 
              <span :class="categoryKey(item.category)">#{{ item.category }}</span>
            </p>
          </div>
          <div class="txt_flex">
            <p>{{ commonNumber(item.price) }}<span>원</span></p>
            <div v-if="isLogin">
              <button
                type="button"
                class="btn-cart bx-shadow del-cart"
                v-if="item.is_cart"
                @click.stop="delCartBtn(item)"
              >
                <span>Delete CART</span>
              </button>
              <button
                type="button"
                class="btn-cart bx-shadow"
                v-else
                @click.capture="addCartBtn(item)"
              >
                <span>ADD CART +</span>
              </button>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <PagingView
    :currentPage="currentPage"
    :totalPages="totalPages"
    @changePage="changePage"
  />
  <modal-alert 
      :isVisible="dialog.isVisible" 
      :isBtn="true" 
      :content="dialog.content"
      @closeDialogHandler="closeDialogHandler" />
</template>

<script setup lang="ts">
import {
  getItemWithExpireTime,
  commonNumber,
  categoryKey,
} from "@/utils/common";
import PagingView from "@/components/common/ComnPaging.vue";
import ModalAlert from "@/components/modal/ModalAlert.vue";
import { computed, defineProps, defineEmits, ref, watch, nextTick,} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { IProductsResult } from "@/types/product";
// import { Basket } from "@/store/user";
import productApi from "@/api/apiProduct";
import ComnNodata from "@/components/common/ComnNodata.vue";
const store = useStore();
const router = useRouter();
const emit = defineEmits(["fetchItems"]);
const props = defineProps<{
  list: IProductsResult[],
  // tabChange: number,
}>();

const dialog = ref({
    isVisible: false,
    content: "",
});
const currentPage = ref(1); //현재 페이지 번호
const postsperPage = 10; //한 페이지 게시글 갯수 
const totalPages = computed(() => {
  return Math.ceil(props.list.length / postsperPage);
});

const displayedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * postsperPage;
  const endIndex = startIndex + postsperPage;
  if (!props.list) return [];
  else return props.list.slice(startIndex, endIndex);
});
const isLogin = computed(() => {
  const userId = getItemWithExpireTime("userInfoObj")?.user_id;
  if (userId) return true;
  else return false;
});
const animalTab = computed(() => {
  return store.state.product.animalTab;
});
const fetchStatus = computed(() => {
  return store.state.user.fetchStatus;
});
const userId           = computed(() => getItemWithExpireTime("userInfoObj")?.user_id);
const user_idx = computed(() => {
  return getItemWithExpireTime("userInfoObj")?.user_idx;
});
// const arr = ref([...props.list]);

// 장바구니 추가 api 호출
const addCartBtn = async (pdt : IProductsResult) : Promise<void> => {
  const count = 1;
  const addBasketinfo = {
    productId: pdt.id,
    count: count,
  };
  await store.dispatch("user/addBasket", addBasketinfo);
  if(fetchStatus.value === 200){
    dialog.value.content = "장바구니에 담았습니다.";
  }else{
    dialog.value.content = "실패하였습니다. 다시 시도해주세요.";
  }
  dialog.value.isVisible = true;

};
// 장바구니 삭제 api 호출
const delCartBtn = async (pdt : IProductsResult) : Promise<void> => {
  await store.dispatch("user/delBasket", pdt.basket_id);
  if(fetchStatus.value === 200){
    dialog.value.content = "장바구니에서 삭제하였습니다.";
  }else{
    dialog.value.content = "실패하였습니다. 다시 시도해주세요.";
  }
  dialog.value.isVisible = true;
};

// detail page
const clickProduct = (id : number) => {
  router.push(`/products/detail/${id}`);
};

//페이지 변경
const changePage = (page : number) => {
  currentPage.value = page;
};

const closeDialogHandler = async () => {
  if(fetchStatus.value === 200){
    emit("fetchItems");
    await nextTick();
  }
  dialog.value.isVisible = false;
};

// if (user_idx.value) getBasketView();

watch(animalTab, () => {
  changePage(1);
});
</script>
