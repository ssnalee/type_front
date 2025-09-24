<template>
    <!-- <div :class="['loader', { 'spinner-wrap' : props.isFixed }]" :style="style">
        loading
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    </div> -->
    <div :class="{'spinner-wrap' : props.isFixed}" :style="style" >
        <span class="loader"></span>
    </div>


</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    style: Object,
    isFixed: {
        type: Boolean,
        default: false 
    },
});

</script>
