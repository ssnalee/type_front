<template>
    <modal-frame 
      :isVisible="props.isVisible" 
      :width="props.width" 
      :hegiht="props.height" 
      :maxWidth="props.maxWidth"
      :isOverlay="props.isOverlay"
      @closeDialogHandler="closeHandler(0)">
        <div class="modal_title">
            <h4>{{ props.title || 'Alert' }}</h4>
        </div>
        <div class="modal_body modal_comn">
            <p v-html="props.content"></p>
        </div>
        <div class="modal_btn">
            <button @click="closeHandler(1)">확인</button>
            <button @click="closeHandler(0)">취소</button>
        </div>
    </modal-frame>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import ModalFrame from './ModalFrame.vue';
const props = defineProps({
    isVisible: { type: Boolean },
    title: { type: String },
    content: { type: String },
    width: { type: String },
    height: { type: String },
    maxWidth: { type: String },
    isOverlay: {
        type: Boolean,
        default: true,
    }
});
const emit = defineEmits(['closeDialogHandler']);

// 확인 1, 취소 0
const closeHandler = (key : number) => {
    emit('closeDialogHandler',key);
}

</script>

<style lang="scss" scoped></style>