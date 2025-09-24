<template>
  <div class="mypage_wrap">
    <div class="pd-30">
      <div class="cont_area">
        <div class="profile">
          <img src="@/assets/img/profile_icon.png" alt="프로필 아이콘" />
          <h3 class="fc-w ml-5 mr-15 pd-10 fs-30">
            {{ data ? data.user_name : "" }}<span class="fs-15"> 님</span>
          </h3>
          <button class="pd-10 fs-15 bx-shadow" @click="router.push('profile')">
            내정보 수정
          </button>
          <button class="pd-10 fs-15 bx-shadow del_btn" @click="deleteUserInfo">
            회원 탈퇴
          </button>
        </div>
      </div>
    </div>
    <div class="pd-30">
      <div class="cont_area">
        <div class="title_s pd-10">
          <img src="@/assets/img/common/add_cart.png" alt="장바구니" />
          <h4 class="fs-18 mlr-10">장바구니</h4>
          <button @click="router.push('basket')" class="fb" v-if="basketInfo.length > 0">더 보기 +</button>
        </div>
        <SliderView :flag="flag" :sliderData="basketInfo" v-if="basketInfo.length > 0"/>
        <ComnNodata class="pd-30" :list="basketInfo" content="장바구니에 상품을 추가해주세요." />
      </div>
    </div>
    <div class="graient-line"></div>
    <div class="pd-30">
      <div class="cont_area">
        <div class="title_s pd-10">
          <img src="@/assets/img/purchase_icon.png" alt="구매내역" />
          <h4 class="fs-18 mlr-10">구매내역</h4>
          <button @click="isBetaHandler" class="fb" v-if="basketInfo.length > 0">더 보기 +</button>
        </div>
        <SliderView :flag="flag" :sliderData="purchaseData"  v-if="basketInfo.length > 0"/>
        <ComnNodata class="pd-30" :list="basketInfo" content="지금 당장 구매해보세요!" />
      </div>
    </div>
    <div class="graient-line"></div>
    <div class="pd-30">
      <div class="cont_area">
        <div class="title_s pd-10">
          <h4 class="fs-18 mlr-10">주문/배송조회</h4>
          <button @click="isBetaHandler" class="fb">배송 현황</button>
        </div>
        <ul class="delivery_area">
          <li>
            <img src="@/assets/img/delivery/delivery_01.png" alt="주문 접수" />
            <p class="mt-10 text-center">주문 접수</p>
          </li>
          <li class="arrow_r">
            <img src="@/assets/img/delivery/right_arrow.png" alt="오른쪽 화살표" />
          </li>
          <li>
            <img src="@/assets/img/delivery/delivery_02.png" alt="결제 완료" />
            <p class="mt-10 text-center">결제 완료</p>
          </li>
          <li class="arrow_r">
            <img src="@/assets/img/delivery/right_arrow.png" alt="오른쪽 화살표" />
          </li>
          <li>
            <img src="@/assets/img/delivery/delivery_03.png" alt="배송 준비중" />
            <p class="mt-10 text-center">배송 준비중</p>
          </li>
          <li class="arrow_r">
            <img src="@/assets/img/delivery/right_arrow.png" alt="오른쪽 화살표" />
          </li>
          <li>
            <img src="@/assets/img/delivery/delivery_04.png" alt="배송 중" />
            <p class="mt-10 text-center">배송 중</p>
          </li>
          <li class="arrow_r">
            <img src="@/assets/img/delivery/right_arrow.png" alt="오른쪽 화살표" />
          </li>
          <li>
            <img src="@/assets/img/delivery/delivery_m.png" alt="배송 완료" />
            <p class="mt-10 text-center">배송 완료</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <modal-alert 
      :isVisible="dialog.isVisible" 
      :isBtn="true" 
      :content="dialog.content"
      @closeDialogHandler="dialog.isVisible = false" />
  <modal-confirm 
      :isVisible="dialog.isConfirmVisible" 
      :isBtn="true" 
      :content="dialog.content"
      @closeDialogHandler="closeDialogHandler" />
</template>

<script setup lang="ts">
import api from "@/api/apiUser";
import SliderView from "@/components/common/ComnSlider.vue";
import ComnNodata from "@/components/common/ComnNodata.vue";
import ModalAlert from "@/components/modal/ModalAlert.vue";
import ModalConfirm from "@/components/modal/ModalConfirm.vue";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { getItemWithExpireTime } from "@/utils/common";
import { useStore } from "vuex";
import { IExtendInfo, IPurchaseData } from "@/types/user";


const store =useStore();
const router = useRouter();
const dialog = ref({
    isVisible: false,
    isConfirmVisible: false,
    content: "",
})
const data = ref<IExtendInfo | null>(null);
const flag = 1; // slider type
const purchaseData  : IPurchaseData[] = [
  {
    id: 1,
    user_id: 5,
    product_id: 1,
    count: 1,
    purchase_chk: true,
    created_at: "2024-07-09T13:21:56",
    updated_at: null,
    name: "aaaa",
    image: require("@/assets/img/default.png"),
  },
  {
    id: 2,
    user_id: 5,
    product_id: 1,
    count: 1,
    purchase_chk: true,
    created_at: "2024-07-09T13:22:24",
    updated_at: null,
    name: "aaaa",
    image: require("@/assets/img/default.png"),
  },
];
const basketInfo = computed(()=> store.state.user.basketInfo);

// // const imgAdd = (image :any) => {
// //   this.imgSrc = require(image);
// // }
const user_idx = computed(() => {
  return getItemWithExpireTime("userInfoObj")?.user_id;
});

const getUserInfo = async () => {
  try {
    const result = await api.getOnlyUser(user_idx.value);
    data.value = result[0];
  } catch (error) {
    console.error(error);
  }
};
const getBasketView = () => {
  store.dispatch("user/getBasket");
};


const deleteUserInfo = () => {
  dialog.value.isConfirmVisible = true;
  dialog.value.content = "정말 삭제하시겠습니까?";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
}
const closeDialogHandler = (payload : number) => {
  dialog.value.isConfirmVisible = false;
  if(payload === 1){
    store.dispatch('user/delUserInfo',user_idx.value);
    window.sessionStorage.clear();
    store.commit('login/setLoginStatus',false);
    router.push('/');
  }
}

const isBetaHandler = () => {
  dialog.value.content = "아직 준비중인 서비스입니다.";
  dialog.value.isVisible = true;
  // router.push('delivery')
}
getBasketView();
getUserInfo();

</script>