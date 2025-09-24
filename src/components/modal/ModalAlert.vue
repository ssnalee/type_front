<template>
    <modal-frame 
      :isVisible="props.isVisible" 
      :width="props.width" 
      :hegiht="props.height" 
      :maxWidth="props.maxWidth"
      :isOverlay="props.isOverlay"
      @closeDialogHandler="closeHandler">
        <div class="modal_title">
            <h4>{{ props.title || 'Alert' }}</h4>
            <div v-if="!isBtn" class="close_btn" @click="closeHandler">닫기</div>
        </div>
        <div class="modal_body modal_comn">
            <p v-html="props.content"></p>
        </div>
        <div class="modal_btn" v-if="isBtn">
            <button @click="closeHandler">닫기</button>
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
    isBtn: {
        type: Boolean,
        default: false,
    },
    isOverlay: {
        type: Boolean,
        default: true,
    }
});
const emit = defineEmits(['closeDialogHandler']);

const closeHandler = () => {
    emit('closeDialogHandler');
}

</script>

<style lang="scss" scoped></style>