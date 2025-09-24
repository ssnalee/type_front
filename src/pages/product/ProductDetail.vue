<template>
    <div class="detail_wrap">
        <h3 class="pd-20 fs-20">상품 상세정보</h3>
        <div class="flex_center row mb-30">
            <Slider :flag="2" :sliderData="product.image.map(img => ({ image: img }))" />
            <div class="detail_cont">
                <p class="mb-10 category_txt">
                    <span :class="product.animal_category === '강아지' ? 'dog' : 'cat'">#{{ product.animal_category
                        }}</span>
                    <span :class="categoryKey(product.category)">#{{ product.category }}</span> 판매자 :
                    {{ product.user_name }}
                </p>
                <p class="fs-30 mb-10">{{ product.name }}</p>
                <div class="cell_area">
                    <p class="fs-18">판매가 {{ commonNumber(product.price) }} 원</p>
                    <div class="cell flex_center row">
                        <span class="mr-20">수량</span>
                        <button type="button" @click="count == 1 ? count : count--">
                            -
                        </button>
                        <label>
                            <input type="text" v-model="count" readonly />
                        </label>
                        <button type="button" @click="count++">+</button>
                    </div>
                </div>
                <div class="count-area">
                    <p>주문 금액 </p>
                    <p><span class="fs-30 mlr-5">{{ commonNumber(orderCount) }}</span>원</p>
                </div>
                <div class="count-area">
                    <p><span class="plus">+</span>배송비</p>
                    <p v-if="deliveryCount === 0"><span class="del-line">3,000</span><span class="del-gray">></span><span class="fs-30 mlr-5">{{ commonNumber(deliveryCount) }}</span>원</p>
                    <p v-else><span class="fs-30 mlr-5">{{ commonNumber(deliveryCount) }}</span>원</p>
                </div>
                <div class="count-line"></div>
                <div class="count-area">
                    <p>총 금액</p>
                    <p><span class="fb fs-30 mlr-5 txt-strong">{{ commonNumber(orderCount + deliveryCount) }}</span> 원</p>
                </div>
                <div class="btn_wrap">
                    <button type="button" @click="handleAddCart">장바구니</button>
                    <button type="button" @click="handlePurchase">구매하기</button>
                </div>
                <div class="caution_box">
                    <dl>
                        <dt>배송정보</dt>
                        <dd>배송비 3,000원</dd>
                        <dd class="txt-strong">무료배송 조건 50,000원 이상</dd>
                    </dl>
                    <!-- <dl>
                        <dt>혜택</dt>
                        <dd class="txt-strong">신규회원가입 20% APP 쿠폰</dd>
                    </dl> -->
                </div>
            </div>
        </div>
        <div class="detail_info">
            <ul class="tab_cat_03">
                <li v-for="item in detailMenuList" :key="item.key" @click="handleTabClick(item)"
                    :class="{ active: item.is_active }">{{ item.label }}</li>
            </ul>
            <div class="detail_info_wrap ql-editor">
                <div v-html="product.content"></div>
            </div>
        </div>
    </div>
    <modal-confirm 
      :isVisible="dialog.isConfirmVisible" 
      :content="dialog.content" 
      @closeDialogHandler="closeDialogHandler" />
    <modal-alert :isVisible="dialog.isVisible" :isBtn="true" :content="dialog.content"
        @closeDialogHandler="closeDialogHandler" />
</template>
<script setup lang="ts">
import Slider from "@/components/common/ComnSlider.vue";
import ModalAlert from "@/components/modal/ModalAlert.vue";
import ModalConfirm from "@/components/modal/ModalConfirm.vue";
import productApi from "@/api/apiProduct";
import { computed, ref } from "vue";
import { categoryKey, commonNumber, getItemWithExpireTime } from "@/utils/common";
import { IProductResult } from "@/types/product";
import { useStore } from "vuex";
import { IMenu } from "@/store/menuList";
import { useRoute, useRouter } from "vue-router";
const store = useStore();
const route = useRoute();
const router = useRouter();
const dialog = ref({
    isVisible: false,
    isConfirmVisible: false,
    content: "",
})
const productId = computed(() => route.params.id);
const detailMenuList = computed(() => store.getters["menuList/detailMenuList"]);
const product = ref<IProductResult>({
    image: [],
    animal_category: '',
    category: '',
    user_name: '',
    name: '',
    price: 0,
    is_cart: false,
});
const count = ref(1); // 구매갯수
const orderCount = computed(() => product.value.price * count.value);
const deliveryCount = computed(() => (orderCount.value >= 50000 ? 0 : 3000));
const isLogin = computed(()=>{return getItemWithExpireTime("userInfoObj")?.user_id ? true : false})
const fetchStatus = computed(() => store.state.user.fetchStatus);
//상품 정보 개별 조회 api 호출
const getOnlyProduct = async (): Promise<void> => {
    try {
        const result: IProductResult | null = await productApi.viewIndividualProduct(String(productId.value) || "");
        if (result) product.value = result;
    } catch (error) {
        console.error(error);
    }
};

const handleTabClick = (menu: IMenu) => {
    if(!isLogin.value){
        dialog.value.isVisible = true;
        dialog.value.content = "로그인 후 이용가능합니다.";
        return;
    }
    if (menu.is_beta) {
        dialog.value.isVisible = true;
        dialog.value.content = "아직 준비중인 서비스입니다.";
        return;
    }
    store.commit("menuList/setActiveDetailMenu", menu.key);
}

const handleAddCart = async () => {
    //장바구니
    if(isLogin.value){
        if(product.value.is_cart){
            dialog.value.content = "장바구니에 이미 담긴 상품입니다.<br/> 확인하러 가겠습니까?"
            dialog.value.isConfirmVisible = true;
        }else{
            await store.dispatch("user/addBasket", {
                productId : productId.value,
                count : count.value,
            });
            if(fetchStatus.value === 200){
                dialog.value.content = "장바구니에 담았습니다.";
            }else{
              dialog.value.content = "실패하였습니다. 다시 시도해주세요.";
            }
            dialog.value.isVisible = true;
        }
    }else{
        dialog.value.isVisible = true;
        dialog.value.content = "로그인 후 이용가능합니다.";
    }
}
const handlePurchase = () => {
    if(isLogin.value){
        router.push("/user/");
    }else{
        dialog.value.isVisible = true;
        dialog.value.content = "로그인 후 이용가능합니다.";
    }
}
const closeDialogHandler = (payload : null | number) => {
    dialog.value.isVisible = false;
    dialog.value.isConfirmVisible = false;
    if(!isLogin.value){
        router.push("/login");
        return;
    }
    if(dialog.value.isConfirmVisible && payload){
        router.push("/user/");
        return;
    }
    if(fetchStatus.value === 200){
        getOnlyProduct();
    }
}

//created
getOnlyProduct();

</script>

<style lang="scss" scoped></style>