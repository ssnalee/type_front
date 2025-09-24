<template>
  <div v-if="props.flag == 1">
    <Carousel v-bind="setting" :breakpoints="breakpoints">
      <Slide class="" v-for="(slide,idx) in transformSliderData" :key="idx">
        <div class="carousel__item">
          <img v-lazy="slide.image || ''" :alt="slide.name" class="slide_img" />
          <div>
            <p>{{ slide.name || slide.product_name }}</p>
          <p class="fs-15 mt-10">{{ slide.count }} 개</p>
          </div>

        </div>
      </Slide>
      <template #addons>
        <Navigation v-if="transformSliderData.length > 8" />
      </template>
    </Carousel>
  </div>

<!-- 여기꺼 배열 바꿔야대 .image로 넣을 수있게 -->
  <div v-if="props.flag == 2" class="slider_area">
    <Carousel v-bind="settings" :wrapAround="lenChk" :mouseDrag="lenChk" :touchDrag="lenChk">
      <!-- -->
      <Slide class="" v-for="(slide, idx) in transformSliderData" :key="idx">
        <div class="carousel__item">
          <img v-lazy="slide.image || ''" :alt="`상품사진 ${idx}`" class="slide_img" />
        </div>
      </Slide>
      <template #addons>
        <Navigation v-if="transformSliderData?.length > 1" />
        <Pagination />
      </template>
    </Carousel>
  </div>

  <div v-if="props.flag == 3">
    <!-- :style="customStyle(slide.backgroundImage)" style -->
    <Carousel v-bind="settings" :wrapAround=true :mouseDrag=true :touchDrag=true>
      <Slide class="" v-for="(slide, idx) in transformSliderData" :key="idx" :style="{ padding: 0 }">
        <div class="carousel__item banner__item" :style="{ backgroundColor: slide.color }">
          <img :src="slide.backgroundImage" :alt="String(idx)" class="slide_img not" />
          <!-- <p>{{ slide.title }}</p> -->
          <!-- <p>{{ slide.content }}</p> -->
        </div>
      </Slide>
      <template #addons>
        <Navigation v-if="transformSliderData.length > 1" />
      </template>
    </Carousel>
  </div>
  <!-- 여기꺼 배열 바꿔야대 .image로 넣을 수있게 -->
  <div v-if="props.flag == 4">
    <Carousel v-bind="settingmain">
      <Slide class="" v-for="(slide,idx) in transformSliderData" :key="idx">
        <div class="carousel__item">
          <img v-lazy="slide.image || ''" :alt="slide.name" class="slide_img" />
          <div>
            <p>{{ slide.name || slide.product_name }}</p>
          <p class="fs-15 mt-10">{{ slide.price }} 원</p>
          </div>

        </div>
      </Slide>
      <template #addons>
        <Navigation v-if="transformSliderData.length > 8" />
      </template>
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import { IImage } from "@/types";
import { computed, defineProps } from "vue";
import { Carousel, Slide, Navigation, Pagination } from "vue3-carousel";


import "vue3-carousel/dist/carousel.css";
const props = defineProps<{
  sliderData: IImage[];
  flag: number;
}>();


const transformSliderData = computed<IImage[]>(()=>{
  return props.sliderData.map((item)=>({
    ...item,
    image : item.image || item.product_image || '',
    name : item.name || item.product_name || 'image',
    count :item.count || 0
  }));
});

const lenChk = computed(() => {
  return transformSliderData.value.length > 1 ? true : false;
});
// const customStyle = (bg) =>{
//   return {'--bg' : bg};
// }
//mypage slide setting
const setting = {
  itemsToShow: 3,
  snapAlign: "start",
};
//product detail page slide setting
const settings = {
  itemsToShow: 1,
  snapAlign: "center",
  autoplay: 5000,
};
//main page second slide setting
const settingmain = {
  itemsToShow: 4,
  snapAlign: "center",
  // autoplay: 5000,
};
const breakpoints = {
  // 500px and up
  500: {
    itemsToShow: 3,
    snapAlign: "start",
  },
  // 700px and up
  700: {
    itemsToShow: 5,
    snapAlign: "start",
  },
  // 1024 and up
  1024: {
    itemsToShow: 5,
    snapAlign: "start",
  },
};
</script>

<style>
/* .carousel__item{
  background : var(--bg);
} */
.carousel__item{
  height: 100%;
}
.slide_img.not{
  aspect-ratio:initial;
}
</style>
