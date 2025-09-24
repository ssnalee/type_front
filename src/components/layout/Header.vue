<template>
  <div class="header_wrap">
    <div class="logo_area">
      <h1 @click="homeClickHandler">CATTUS
        <img src="@/assets/img/logo.png" alt="logo" />
        </h1>
      
    </div>
    <Navbar />
  </div>
</template>

<script setup lang="ts">

import { useRouter } from 'vue-router';
import Navbar from './Navbar.vue';
import { computed } from 'vue';
import { getItemWithExpireTime } from '@/utils/common';
const isAdmin = computed(()=>getItemWithExpireTime("userInfoObj")?.is_admin);
const isSeller = computed(()=>getItemWithExpireTime("userInfoObj")?.is_seller);
const router = useRouter();
const homeClickHandler = () => {
  if(isAdmin.value || isSeller.value){
    router.push("/manage");
  }else{
    router.push("/");
  }
}
</script>