<template>
  <JoinSelect v-if="isJoinSelect == false" @callFn="callFn" />

  <div class="user_wrap" v-if="isJoinSelect == true">
    <!-- email -->
    <div class="user_input">
      <label for="userEmail">이메일</label>
      <input
        type="text"
        id="userEmail"
        v-model.trim="info.email"
        autocomplete="off"
        @keyup.enter="isEmailCheck"
      />
      <button
        type="button"
        class="confirm_btn"
        @click="isEmailCheck"
        v-if="!isCheck.isEm"
      >
        다음
      </button>
    </div>
    <transition name="fade">
      <!-- name -->
      <div class="user_input" v-if="isCheck.isEm">
        <label for="userName">ID</label>
        <input
          type="text"
          id="userName"
          v-model.trim="info.username"
          autocomplete="off"
          @keyup.enter="isNameCheck"
        />
        <button
          type="button"
          class="confirm_btn"
          @click="isNameCheck"
          v-if="!isCheck.isNm"
        >
        다음
        </button>
      </div>
    </transition>
    <transition name="fade">
      <!-- password -->
      <div class="user_input" v-if="isCheck.isNm">
        <label for="userPw">비밀번호</label>
        <input
          type="password"
          @keyup="pwdCheck"
          id="userPw"
          autocomplete="off"
          v-model.trim="info.password"
        />
      </div>
    </transition>
    <transition name="fade">
      <div class="user_input" v-if="isCheck.isNm">
        <label for="userPwChk">비밀번호 확인</label>
        <input
          type="password"
          @keyup="pwdCheck"
          @keyup.enter="isPwCheck"
          id="userPwChk"
          autocomplete="off"
          v-model.trim="info.password_check"
        />
        <img
          v-if="isInput"
          :src="
            chkPw
              ? require('@/assets/img/o.png')
              : require('@/assets/img/x.png')
          "
          :alt="chkPw ? 'Matched' : 'Not Matched'"
        />
      </div>
    </transition>
    <transition name="fade">
      <div class="confirm_box" v-if="isCheck.isNm">
        <p>숫자, 문자, 특수 문자를 포함하여 8자에서 12자 사이의 비밀번호를 입력해 주세요.</p>
        <button type="button" class="btn_type_02" @click="isPwCheck">
          가입하기
        </button>
      </div>
    </transition>
  </div>
  <modal-alert 
    :isVisible="dialog.isVisible"
    :isBtn="true"
    :content="dialog.content"
    @closeDialogHandler="closeDialogHandler"
  />

</template>

<script setup>
import { reactive, toRef, ref } from "vue";
import api from "@/api/apiUser";
import { emailCheck, nameCheck, passwordCheck } from "@/utils/common";
import { useRouter } from "vue-router";
import JoinSelect from "./ViewJoinSelect.vue";
import ModalAlert from "@/components/modal/ModalAlert.vue"; 
const router = useRouter();
const isCheck = reactive({
  isPw: false,
  //   isPwChk: "",
  isNm: false,
  isEm: false,
});
const isJoinSelect = ref(false);
const isInput = toRef(false);
const chkPw = toRef(false);
const info = reactive({
  password: "",
  password_check: "",
  username: "",
  email: "",
});
const dialog = ref({
  isVisible : false,
  content : "",
})
// 회원가입 api 호출
const createUser = async (info) => {
  try {
    const result = await api.joinUser(info);
    if (result.status === "201") {
      dialog.value.content = "가입이 성공적으로 완료되었습니다.";
      dialog.value.isVisible = true;
      router.push("/");
    }
  } catch (error) {
    console.error(error);
  }
};

//회원가입 flag 선택했을 때
const callFn = (flagBool) => {
  if (flagBool) isJoinSelect.value = true;
};

// 이메일 확인
const isEmailCheck = () => {
  if (info.email === "") {
    dialog.value.content = "이메일을 입력해 주세요.";
    dialog.value.isVisible = true;
  } else if (!emailCheck(info.email)) {
    dialog.value.content = "이메일을 잘못 입력했는지 확인해 주세요.";
    dialog.value.isVisible = true;
  } else isCheck.isEm = true;
};

// 이름 확인
const isNameCheck = () => {
  if (isCheck.isEm) {
    if (info.username === "") {
      dialog.value.content = "ID를 입력해 주세요.";
      dialog.value.isVisible = true;
    } else if (!nameCheck(info.username)) {
      dialog.value.content = "ID를 잘못 입력했는지 확인해 주세요.";
      dialog.value.isVisible = true;
    } else isCheck.isNm = true;
  }
};

// 비밀번호 확인
const isPwCheck = () => {
  if (isCheck.isNm) {
    if (info.password === "") {
      dialog.value.content = "비밀번호를 입력해 주세요.";
      dialog.value.isVisible = true;
    } else if (info.password_check === "") {
      dialog.value.content = "비밀번호 확인을 입력해 주세요.";
      dialog.value.isVisible = true;
    } else if (!passwordCheck(info.password, info.password_check)) {
      dialog.value.content = "숫자, 문자, 특수 문자를 포함하여 8자에서 12자 사이의 비밀번호를 입력해 주세요.";
      dialog.value.isVisible = true;
    } else {
      isCheck.isPw = true;
      joinBtn();
    }
  }
};

// 비밀번호 확인 (span)
const pwdCheck = () => {
  if (info.password !== "" && info.password_check !== "") {
    isInput.value = true;
    if (info.password == info.password_check) chkPw.value = true;
    else chkPw.value = false;
  }
};

// 회원가입 버튼 클릭시
const joinBtn = () => {
  isEmailCheck();
  isNameCheck();
  if (isCheck.isEm && isCheck.isNm && isCheck.isPw) {
    createUser(info);
  }
};

const closeDialogHandler = () => {
  dialog.value.isVisible = false;
}
</script>
<style lang="css" scoped>
.confirm_btn{
  border-radius: 6px;
  height: 50px;
  width: 120px;
}
.btn_type_02{
  border-radius: 6px;
  width: 100%;
  max-width: 400px;

}
</style>