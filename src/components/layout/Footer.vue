<template>
  <!-- footer -->
  <div class="footer_wrap">
    <footer>
      <ul class="footer-list">
        <li>
          <ul class="each-list">
            <li>메뉴</li>
            <li @click="goProduct(1)">ALL</li>
            <li @click="goProduct(2)">고양이</li>
            <li @click="goProduct(3)">강아지</li>
          </ul>
        </li>
        <li class="mlr-50">
          <dl>
            <dt>주소 :</dt>
            <dd>서울, 한국</dd>
          </dl>
          <dl>
            <dt>이메일</dt>
            <dd>97poolbbang@naver.com</dd>
          </dl>
          <dl>
            <dt>전화번호 :</dt>
            <dd>010 - 9954 - 8079</dd>
          </dl>
          <small>Copyrights ⓒ CATTUS</small>
        </li>
        <li>
          <ul class="each-list">
            <li>지원</li>
            <li><router-link to="/icons">아이콘 저작권</router-link></li>
            <li><a href="#">회사 오시는 길</a></li>
            <li><a href="#">고객 센터</a></li>
          </ul>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();

const goProduct = (idx : number) : void => {
  router.push(`/products`);
  store.commit("product/setAnimalTab", idx);
  // store.commit("product/setIsChange", true);
  store.commit("product/setCtgyName", "ALL");
};
</script>

<style lang="scss" scoped></style>
