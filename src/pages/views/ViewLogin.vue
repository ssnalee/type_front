<template>
  <div class="user_wrap">
    <div class="int-area">
      <input type="text" id="username" required v-model.trim="info.username" autocomplete="off" />
      <label for="username">아이디</label>
    </div>
    <div class="int-area">
      <input type="password" id="userPw" required v-model.trim="info.password" />
      <label for="userPw">비밀번호</label>
    </div>
    <div class="btn-area">
      <button id="Lbtn" type="button" @click="loginCheck">로그인</button>
    </div>
    <div class="caption">
      <span @click="openDialogHandler">비밀번호를 잊으셨나요?</span>
    </div>
  </div>
  <modal-pw :isVisible="dialog.isPwVisible" @closeDialogHandler="closeDialogHandler" width="90%" maxWidth="400px" />
  <modal-alert :isVisible="dialog.isVisible" :isBtn="true" :content="dialog.content" :isOverlay="false"
    @closeDialogHandler="closeDialogHandler" />
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import ModalAlert from "@/components/modal/ModalAlert.vue";
import ModalPw from "@/components/modal/sub/ModalFindPw.vue";

const router = useRouter();
const store = useStore();
let isCheck = reactive({
  isNotNm: false,
  isNotPw: false,
})
let info = reactive({
  password: "",
  username: "",
  grant_type: "",
  scope: "",
  client_id: "",
  client_secret: "",
});

const dialog = ref({
  state: 1,
  isVisible: false,
  isPwVisible: false,
  content: "",
})

const loginSuccess = computed(() => {
  return store.state.user.loginSuccess;
});

if (loginSuccess.value) {
  dialog.value.content = "로그아웃되었습니다.";
  dialog.value.isVisible = true;
  store.commit('user/setLoginStatus', false);
  window.sessionStorage.clear();
}

// 로그인 로직 확인
const loginCheck = async () => {
  if (info.username === "") {
    dialog.value.content = "아이디를 입력해 주세요.";
    dialog.value.isVisible = true;
    isCheck.isNotNm = true;
  } else if (info.password === "") {
    dialog.value.content = "비밀번호를 입력해 주세요.";
    dialog.value.isVisible = true;
    isCheck.isNotNm = false;
    isCheck.isNotPw = true;
  } else {
    const result = await store.dispatch('user/getLoginUser', info);
    if (loginSuccess.value) {
      if (result.is_admin || result.is_seller) {
        router.push('/manage');
      }else{
        router.push('/');
      }
    }else{
      dialog.value.content = "아이디나 비밀번호가 일치하지 않습니다.";
      dialog.value.isVisible = true;
    }
  }
}

const closeDialogHandler = () => {
  dialog.value.isVisible = false;
  dialog.value.isPwVisible = false;
}
const openDialogHandler = () => {
  dialog.value.isPwVisible = true;
}

</script>
