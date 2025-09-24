<template>
    <div :class="['modal_overlay', {is_over : props.isOverlay}]" v-if="props.isVisible" @click.self="overlayClickHandler">
        <div class="modal_wrap" 
          :style="{width:defaultWidth, height:defaultHeight, maxWidth:defaultMaxWidth}">
            <slot></slot>                   
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch } from 'vue';
const emit = defineEmits(['closeDialogHandler']);
const props = defineProps({
    isVisible: { type:Boolean },
    width: { type: String },
    height: { type: String },
    maxWidth: { type: String },
    isOverlay: { type: Boolean },
});

const defaultWidth = props.width || 'fit-content';
const defaultHeight = props.height || 'fit-content';
const defaultMaxWidth = props.maxWidth || '100%';

const body: HTMLBodyElement | null = document.querySelector('body');

if (body &&props.isVisible) {
    body.style.overflow = 'hidden';
}
const overlayClickHandler = () => {
    if(props.isOverlay){
        emit('closeDialogHandler');
    }
}
watch(()=>props.isVisible,(value)=>{
    if (body && !value) {
        body.style.overflow = 'auto';
    }
});
</script>

<style lang="scss" scoped></style>