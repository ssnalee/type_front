<template>
  <modal-frame :isVisible="props.isVisible" :width="props.width" :hegiht="props.height" :maxWidth="props.maxWidth"
    @closeDialogHandler="closeHandler">
    <div class="modal_title">
      <h4>{{selectTab === 1 ? '아이디 찾기' : '비밀번호 찾기'}}</h4>
      <div class="close_btn" @click="closeHandler">닫기</div>
    </div>
    <div class="modal_body">
      <div class="find_wrap">
        <ul class="tab_cat_01">
          <li :class="{ active: selectTab === 1 }" @click="selectTab = 1">아이디 찾기</li>
          <li :class="{ active: selectTab === 2 }" @click="selectTab = 2">비밀번호 찾기</li>
        </ul>
        <div class="user_input" v-if="selectTab == 2">
          <label for="userName">ID</label>
          <input type="text" id="userName" />
        </div>
        <div class="user_input" >
          <label for="userEmail">EMAIL</label>
          <input type="text" id="userEmail" />
        </div>
        <div class="confirm_box">
          <button type="button" class="confirm_btn" @click="confirmClickHandler">
            확인
          </button>
        </div>
      </div>
    </div>
  </modal-frame>
  <modal-alert 
    :isVisible="dialog.isVisible" 
    :isBtn="true" 
    :content="dialog.content"
    @closeDialogHandler="dialog.isVisible=false" />
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import ModalFrame from '../ModalFrame.vue';
import ModalAlert from "@/components/modal/ModalAlert.vue";
import { ref } from 'vue';
const emit = defineEmits(['closeDialogHandler']);
const props = defineProps({
  isVisible: { type: Boolean },
  width: { type: String },
  height: { type: String },
  maxWidth: { type: String },
});
const dialog = ref({
    isVisible: false,
    content: "",
})
const closeHandler = () => {
  emit('closeDialogHandler');
}
const confirmClickHandler = () =>{
  dialog.value.isVisible = true;
  dialog.value.content = "아직 준비중인 서비스입니다.";
}
const selectTab = ref(1);
</script>