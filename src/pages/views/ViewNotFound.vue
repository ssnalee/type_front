<template>
  <div class="flex_center no_wrap">
    <img src="@/assets/img/logo.png" alt="logo" />
    <p class="fb">{{ message }}</p>
    <p v-if="!isNotFoundPage">주소를 잘못 입력했거나, 페이지가 이동되었거나 <br /> 삭제되었을 수 있습니다. <br /> 입력하신 URL을 다시 한 번 확인해 주세요.</p>
    <button @click="navigateToPage">홈으로 가기</button>
  </div>

</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
const isNotFoundPage = route.path.startsWith("/404");
const message = isNotFoundPage 
  ? '접근 권한이 없습니다.'
  : '요청하신 페이지를 찾을 수 없습니다.';

const navigateToPage = () => {
  if (!isNotFoundPage) {
    router.push('/');
  } else {
    router.push('/manage/products');
  }
};
</script>

<style lang="scss" scoped>
.no_wrap {
  height: 50vh;

  img {
    border-radius: 50%;
    border: 1px solid #b4b4b4;
    width: 100px;
    background-color: #fff;
    padding: 10px;
  }

  p {
    margin: 10px;
    line-height: 1.5rem;
    text-align: center;
  }

  button {
    background-color: #fff;
    color: #3a3a3a;
    border: 1px solid #c9c9c9;
    padding: 10px;
    border-radius: 20px;
    font-weight: 700;
  }
}
</style>
