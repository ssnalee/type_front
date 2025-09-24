<template>
  <div class="basket_wrap">
    <h2 class="fs-30 mb-30"><img src="@/assets/img/common/cart.png" alt="cart" />장바구니</h2>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th colspan="2">상품명</th>
          <th>가격</th>
          <th>수량</th>
          <th class="pr">
            <input
              class="cart_chkBox"
              type="checkbox"
              value="all"
              id="allCheck"
              v-model="allSelectList"
            />
            <label for="allCheck">all</label>
          </th>
        </tr>
      </thead>
      <tbody>
        <ComnNodata :list="basketInfo" :isTable="true" />
        <tr
          v-for="(item, index) in basketInfo"
          :key="index"
          @click="pdtDetailHandler(item.id)"
        >
          <td>
            <img
              v-lazy="item.product_image"
              :alt="item.product_name"
              class="pd-10"
            />
          </td>
          <td>{{ item.product_name }}</td>
          <td>{{ commonNumber(item.price) }}<span>원</span></td>
          <td>
            <div class="cell flex_center row">
              <span class="mr-20">수량</span>
              <button
                type="button"
                @click.stop="item.count !== 1 && putBasketView(item.count - 1, item.id)"
              >
                -
              </button>
              <label>
                <input type="text" v-model="item.count" readonly />
              </label>
              <button type="button"   @click.stop="putBasketView(item.count + 1, item.id)">+</button>
            </div>
          </td>
          <td class="pr">
            <input
              class="cart_chkBox"
              type="checkbox"
              :value="{ id: item.id, price: item.price, count: item.count }"
              v-model="selectList"
              :id="item.id"
              @click.stop
            />
            <label :for="item.id" @click.stop>{{item.id}}</label>
            <button
              type="button"
              class="del_try_btn"
              @click.stop="delBasketView(item.id)"
            >
              삭제
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="result_area">
      <p>
        총 <strong>{{ selectList.length }}</strong
        >개의 상품금액 =
        <strong>{{ commonNumber(resultInfo.allPrice) }}</strong> 원
        <span>+</span> 배송비
        <strong>{{ commonNumber(resultInfo.delivery) }}</strong> 원
        <span>=</span> 합계
        <strong>{{
          commonNumber(resultInfo.allPrice + resultInfo.delivery)
        }}</strong>
        원
      </p>
    </div>
    <div class="btn-area">
      <button type="button" @click.stop="router.push('/products')">
        &lt; 쇼핑 계속하기
      </button>
      <button type="button" @click.stop="orderHandler">주문하기</button>
    </div>
  </div>
  <modal-alert :isVisible="dialog.isVisible" :isBtn="true" :content="dialog.content"
        @closeDialogHandler="dialog.isVisible=false" />
</template>

<script setup lang="ts">
// import { Basket } from "@/store/user";
import ComnNodata from "@/components/common/ComnNodata.vue";
import ModalAlert from "@/components/modal/ModalAlert.vue";
import { Basket } from "@/store/user";
import { commonNumber } from "@/utils/common";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();
const dialog = ref({
    isVisible: false,
    content: "",
})
const fetchStatus = computed(() => store.state.user.fetchStatus);
const basketInfo = computed(() => store.state.user.basketInfo );
const selectList = ref<{ id: number; price: number; count: number }[]>([]);
// const selectListPrice = ref([]);
const allCheckList = ref<{ id: number; price: number; count: number }[]>([]);
const allSelectList = computed({
  get() {
    return selectList.value.length === allCheckList.value.length;
  },
  set(e) {
    selectList.value = e ? allCheckList.value : [];
  },
});
const resultInfo = reactive({
  allPrice: 0,
  delivery: 3000,
});
// 장바구니 목록 조회 api 호출
const getBasketView = async () : Promise<void> => {
  await store.dispatch("user/getBasket");
  basketInfo.value.forEach((el : Basket) => {
    allCheckList.value.push({
      id:el.id, 
      price:el.price, 
      count:el.count
    });
  });
};
// 장바구니 수정 api 호출
const putBasketView = async (count : number, id : number) => {
  await store.dispatch("user/addBasket", {
    productId : id,
    count : count,
  });
  if(fetchStatus.value !== 200){
    dialog.value.content = "에러발생";
    dialog.value.isVisible = true;
  }
  getBasketView();
};

// 장바구니 삭제 api 호출
const delBasketView = async (id : number) : Promise<void> => {
  await store.dispatch("user/delBasket", id);
  await getBasketView();
};

//리스트 클릭시 프로덕트 상세페이지로
const pdtDetailHandler  = (id : number) =>{
  router.push(`/products/detail/${id}`)
}
const orderHandler = () => {
  dialog.value.isVisible = true;
  dialog.value.content = "아직 준비중인 서비스입니다.";
}

onMounted(async ()=>{
await getBasketView();
})
watch(()=>selectList.value, () => {
  let price = 0;
  selectList.value.forEach((el) => {
    price += (el.price * el.count);
  });
  resultInfo.allPrice = price;
  if(resultInfo.allPrice >= 50000 ) resultInfo.delivery = 0;
});
</script>

<style lang="scss" scoped>
$mainColor : #068f9d;
$bgColor : #fff;
.basket_wrap {
  padding: 30px 0;
  h2{
    display: flex;
    align-items: center;
    gap: 10px;
    color:#ff9f03
  }
  .table {
    min-width: auto;
    width: 100%;
    thead {
      background-image: none;
      background-color: #b0d1d4 !important;
      border-top: 2px solid $mainColor;
    }
    tbody {
      border-bottom: 2px solid $mainColor;
      tr {
        &:hover {
          background-color: #eff9fd;
        }
        td {
          vertical-align: middle;
          img {
            width: 100px;
          }
          .cell.flex_center.row {
            align-items: center;
            button {
              background-color: #ff9f03;
              border-radius: 5px;
              padding-bottom: 5px;
              width: 22px;
              height: 22px;
            }
            input {
              border: none;
            }
          }
        }
      }
    }
  }
  .result_area {
    width: 100%;
    background-color: #e2e2e2;
    padding: 20px;
    margin: 20px 0;
    border-radius: 20px;
    p {
      text-align: right;
    }
    span {
      display: inline-flex;
      background-color: #9a9b9c;
      width: 30px;
      height: 30px;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-weight: 700;
      color: #fff;
    }
  }
  .btn-area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    button {
      width: 50%;
      background-color: $mainColor;
      border-radius: 0;
      transition: all 0.2s;
      &:first-child {
        background-color: $bgColor;
        color: $mainColor;
        border: 1px solid $mainColor;
        &:hover{
          color: $bgColor;
          background-color: $mainColor;
        }
      }
    }
  }
}
.pr{
  padding-right: 30px;
}
.del_try_btn{
  position: absolute;
  right: 20px;
  top: 10px;
  text-indent: -9999px;
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 2px;
    background-color: rgb(206, 46, 46);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
}
</style>
