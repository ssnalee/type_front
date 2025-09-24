<template>
  <div class="layout_wrapper">
    <ComnHeader />
    <div :class="mainPath == '' || subPath == 'mypage' ? 'main_wrap main_wt' : mainPath == 'join' ? 'main_wrap join_bg' :('main_wrap')">
      <router-view></router-view>
    </div>
    <ComnFooter />
  </div>
</template>

<script setup lang="ts">
import "@/assets/scss/comn/_entry.scss";
import ComnHeader from "@/components/layout/Header.vue";
import ComnFooter from "@/components/layout/Footer.vue";
import { useRoute } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { getItemWithExpireTime } from "./utils/common";


const store = useStore();
const route = useRoute();
const mainPath = computed<string>(() => route.path.split("/")[1]);
const subPath = computed<string>(() => route.path.split("/")[2]);
  let userId = ref(getItemWithExpireTime("userInfoObj")?.user_id);

  if (userId.value) {
  store.commit("user/setLoginStatus", true);
}

</script>


<style>
/* #app {
  overflow: auto;
}
#app.hidden {
  overflow: hidden;
} */
</style>