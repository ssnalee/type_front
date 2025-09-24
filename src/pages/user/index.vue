<template>
    <div>
    <router-view></router-view>
    </div>
</template>

<script setup lang="ts">
import { getItemWithExpireTime } from "@/utils/common";
import { computed } from "vue";
import { useRouter } from "vue-router";
const userId = computed<string>(() =>  getItemWithExpireTime('userInfoObj')?.user_id );
const router = useRouter();
if(!userId.value) router.push('/login');

</script>

<style lang="scss" scoped>

</style>