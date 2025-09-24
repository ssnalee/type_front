<template>
  <!-- <div>메인 페이지입니다.</div> -->
  <div class="main-wrapper">
    <section class="intro">
      <div class="intro_01"></div>
      <div class="intro_02"></div>
    </section>
    <section class="main-banner">
      <!-- <h3>EVENT PRODUCTION</h3> -->
      <ComnSlider :flag="3" :sliderData="bannerData" />
    </section>
    <section class="coupon-section" v-if="!isLogin">
      <h3 class="animate__animated animate__bounce">회원가입하고 특별한 할인 혜택을 받자!! <span
          class="animate__animated animate__flash animate__infinite" @click="router.push('/join')">CLICK</span></h3>
    </section>
    <section v-if="productList.length === 5" class="main-section top-section animate__animated animate__fadeInUp">
      <h3>WEEKLY TOP5</h3>
      <!-- <ComnSlider :flag="4" :sliderData="productList" /> -->
      <ul class="top-list">
        <li v-for="(slide, idx) in productList" :key="idx" @click="slide.is_active = !slide.is_active">
          <transition name="card">
            <img v-if="!slide.is_active" class="toggle-img" :src="slide.product_image || ''" :alt="slide.name" />
            <div v-else class="toggle-info">
              <p>{{ slide.name || slide.product_name }}</p>
              <p class="fs-15 mt-10 mb-10">{{ slide.price }} 원</p>
              <button class="sell-btn" @click.stop="sellItemHandler(slide.id)">구매하러 가기 →</button>
            </div>
          </transition>

        </li>
      </ul>
    </section>
    <!-- :class="{ 'animate__animated animate__fadeInUp': isVisible1 }" -->
    <section class="main-section brand-section">
      <h3 class="mb-50">BRAND STORY</h3>
      <div class="bs-di" ref="section1" :class="['animate__animated',isVisible1 ? 'animate__fadeInUp' : '']" >
        <img src="@/assets/img/banner/brand01.jpg" alt="" />
        <p>우리 애완동물 용품 샵은 사랑하는 반려동물과의 특별한 유대감을 더욱 깊게 해주기 위해 설립되었습니다.<br />애완동물은 단순한 친구가 아니라 가족의 일원이며, 그들의 행복은 우리의 행복입니다.<br />이러한 믿음에서 출발한 우리는 다양한 제품을 통해 반려동물과 주인 간의 소중한 순간을 만들어가고자 합니다.<br />우리의 모든 제품은 반려동물의 편안함과 안전을 최우선으로 고려하여 디자인되었으며, 엄선된 재료와 혁신적인 기술이 결합되어 있습니다.<br />각 제품은 수년간의 연구와 개발을 통해 탄생하였으며, 반려동물의 다양한 필요를 충족시키기 위해 세심하게 만들어졌습니다.<br />또한, 애완동물에 대한 사랑과 이해를 바탕으로 고객님들께 최상의 품질과 서비스를 제공하기 위해 끊임없이 노력하고 있습니다.<br />우리는 고객님들의 목소리에 귀 기울이며, 그들의 요구를 충족시키기 위해 새로운 제품을 지속적으로 개발하고 있습니다.<br /></p>
      </div>
      <div class="bs-di" ref="section2" :class="['animate__animated',isVisible2 ? 'animate__fadeInUp' : '']">
        <p>브랜드는 반려동물과의 행복한 순간을 만들어주는 동반자가 되기를 꿈꿉니다.<br />우리는 고객님들이 우리의 제품을 통해 반려동물과 더 많은 시간을 함께 할 수 있도록 돕고자 하며, 그 과정에서 깊은 유대감을 형성할 수 있도록 지원합니다.<br />또한, 반려동물의 라이프스타일에 맞춘 다양한 제품군을 선보이며, 지속 가능한 소재와 윤리적인 생산 방식을 통해 지구 환경에도 기여하고자 합니다.<br />우리는 고객님과 반려동물이 함께하는 소중한 순간을 더욱 풍요롭게 만들기 위해 노력하고 있으며, 이러한 가치가 우리 브랜드의 근본적인 원동력이 됩니다.<br />우리의 샵은 단순한 쇼핑 공간이 아니라, 반려동물과 함께하는 행복한 삶을 위한 커뮤니티로 자리매김하고자 합니다.<br />이곳에서 고객님들은 서로의 경험을 공유하고, 반려동물에 대한 애정을 나누며, 더 나아가 공동체의 일원으로서 함께 성장해 나갈 수 있습니다.<br />고객님들과 함께 만들어가는 이 여정에서, 사랑하는 반려동물과의 소중한 추억을 더욱 특별하게 만들어드리겠습니다.<br />우리의 목표는 단순히 제품을 판매하는 것을 넘어, 모든 반려동물과 그 주인들이 행복하고 건강하게 살아갈 수 있도록 돕는 것입니다.</p>
        <img src="@/assets/img/banner/brand02.jpg" alt="" />

      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import 'animate.css';
import ComnSlider from "@/components/common/ComnSlider.vue";
import productApi from "@/api/apiProduct";
import { IBanner, IImage } from "@/types";
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { IProductsResult } from "@/types/product";
import { useRouter } from "vue-router";
import { getItemWithExpireTime } from '@/utils/common';

const router = useRouter();
const bannerData: IBanner[] = [
  {
    backgroundImage: require("@/assets/img/banner/banner01.jpg"),
    color: "#dfffcc",
  },
  {
    backgroundImage: require("@/assets/img/banner/banner02.jpg"),
    color: "#fa93be",
  },
  {
    backgroundImage: require("@/assets/img/banner/banner03.jpg"),
    color: "#f693fa",
  },
];
const section1 = ref(null);
const section2 = ref(null);
const isVisible1 = ref(false);
const isVisible2 = ref(false);
const hasAnimated1 = ref(false);
const hasAnimated2 = ref(false); 
const productList = ref<IImage[]>([]);
const isLogin = computed(() => {
  const userId = getItemWithExpireTime("userInfoObj")?.user_id;
  if (userId) return true;
  else return false;
});
const fetchAllProducts = async () => {
  const result = await productApi.viewAllProduct(0);
  const topList = result.slice(0, 5);
  productList.value = topList.map((item) => ({
    price: item.price,
    product_image: item.thumbnail,
    name: item.name,
    animal_category: item.animal_category,
    category: item.category,
    id: item.id,
    is_active: false,
  }))
}
const sellItemHandler = (id = 0) => {
  router.push(`products/detail/${id}`);
}


const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target === section1.value && !hasAnimated1.value) {
        isVisible1.value = true;
        hasAnimated1.value = true; 
      } else if (entry.target === section2.value && !hasAnimated2.value) {
        isVisible2.value = true;
        hasAnimated2.value = true;
      }
    }
  });
});
onMounted(async () => {
  await fetchAllProducts();
  await nextTick();
  if (section1.value) {
    observer.observe(section1.value); 
  }
  if (section2.value) {
    observer.observe(section2.value); 
  }
})
onBeforeUnmount(() => {
  if (section1.value) {
    observer.unobserve(section1.value); 
  }
  if (section2.value) {
    observer.unobserve(section2.value); 
  }
});
</script>

<style lang="scss" scoped>
/* mainpage */

.intro {
  /* display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow: hidden; */
  /* width: 100%;
  height: 100vh;
  margin-top: 200px; */
}

.intro_01 {
  /* width :  1200px;
  height : 500px;
  background-color: rgb(219, 219, 218);
  transform: rotate(45deg); */
}

.intro_02 {
  width: 100%;
  --section-gap: calc(24px);
  --gradient-padding: 30px;
  /* --gradient-title-margin: 100px; */
  --section-angle-sin: 0.212;
  --section-skew-Y: -5deg;
  --transform-origin-x: calc(var(--section-gap) * 0.8);
  will-change: auto;
  transform-origin: var(--transform-origin-x);
  transform: skewY(var(--section-skew-Y));
  background-color: #3d3d3d;
}

h3 {
  max-width: 1200px;
  font-size: 25px;
  color: #616161;
}

.main-banner {
  /* height: 300px; */


  .flex {
    height: 100%;
    max-width: 1400px;
    width: 90%;
    margin: 0 auto;
    justify-content: space-between;

    img {
      height: 100%;
    }
  }

  .text {
    p {
      font-size: 32px;
    }

    span {
      font-size: 16px;
    }
  }
}

.main-section {
  max-width: 1200px;
  margin: 100px auto;
}

.coupon-section {
  margin: 0 auto 100px;
  background-color: rgb(0, 0, 0);
  padding: 20px 0;
  max-width: 100%;

  h3 {
    color: #fff;
    text-align: center;
    margin: 0 auto;

    span {
      color: #f10000;
      cursor: pointer;
    }
  }
}

.top-section {
  position: relative;

  h3 {
    position: absolute;
    top: 85px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }
}

.top-list {
  /* max-width: 1000px; */
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 1fr 1fr;
  gap: 10px;
  width: 100%;

  li {
    background-color: #ffffff;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    transition: all 0.2s;
    height: 200px;
    /* &:hover{
      .toggle-img{
      display: none;
    }
    .toggle-info{
      display: flex;
    } */
    /* } */
  }

  li:nth-child(1) {
    grid-row: 1;
    grid-column: 1 / span 2;
    background-color: #c9fda1;

  }

  li:nth-child(2) {
    grid-row: 1;
    grid-column: 5 / span 2;
    background-color: #c9eaff;
  }

  li:nth-child(3) {
    grid-row: 2;
    grid-column: 1 / span 2;
    background-color: #cdc2ff;
  }

  li:nth-child(4) {
    grid-row: 2;
    grid-column: 3 / span 2;
    background-color: #fce699;
  }

  li:nth-child(5) {
    grid-row: 2;
    grid-column: 5 / span 2;
    background-color: #ffb993;
    /* .toggle-info{
      background-color: #ffb993;
    } */
  }

  img {
    width: 100%;
    height: 100%;
    max-width: 400px;
    aspect-ratio: 1/1;
    cursor: pointer;
  }
}

/* .toggle-img{
  display: none;
} */
.toggle-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 120px;
  background-color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-shadow: 2.8px 2.8px 2.2px rgba(0, 0, 0, 0.2);

  p {
    width: fit-content;
  }
}

.sell-btn {
  text-decoration: underline;

  &:hover {
    scale: 1.5;
  }
}

/* Fade 전환 효과 */
.card-enter-active,
.card-leave-active {
  transition: opacity 0.2s;
  background-color: transparent;
}

.card-enter,
.card-leave-to {
  opacity: 0;
}
.brand-section{
  line-height: 1.5rem;
  .bs-di{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    img{
      width: 60%;
      height: 600px;
    }
    p{
      width: 40%;
      padding: 20px;
    }
  }
}
</style>
