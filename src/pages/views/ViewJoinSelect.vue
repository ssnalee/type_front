<template>
  <div class="select_wrap">
    <ul class="flex_center">
      <li @click="selectJoinFlag(0)" class="mr-10">
        <img src="@/assets/img/user/seller.png" alt="seller" />
        <p class="text-center fs-18 ff_02">판매 회원(기업)</p>
      </li>
      <li @click="selectJoinFlag(1)" class="ml-10">
        <img src="@/assets/img/user/buyer.png" alt="shopper" />
        <p class="text-center fs-18 ff_02">구매 회원</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { defineEmits } from "vue";
const emit = defineEmits(["callFn"]);

const store = useStore();
const selectJoinFlag = (flag) => {
  if (flag !== null) {
    store.commit("user/setJoinFlag", flag);
    emit("callFn", "true");
  }
};
</script>

<style lang="scss" scoped>
.select_wrap ul{
    height: 50vh;
    flex-direction: row;
    li{
        img{
            max-width: 180px;
            margin-bottom: 20px;
            transition: scale 0.3s;
        }
        border : 1px solid #c9c7c7;
        background-color: #fff;
        border-radius: 5px;
        padding : 20px;
        cursor: pointer;
        &:hover{
          
           img{
            scale: 1.2;
           }
        }
    }
}
</style>
