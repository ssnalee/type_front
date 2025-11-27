<template>
  <JoinSelect v-if="!isJoinSelect" @callFn="callFn" />

  <div class="user_wrap" v-if="isJoinSelect">

    <!-- STEP 0 : 이메일 -->
    <transition name="fade-slide">
      <div class="user_input" v-if="step === 0">
        <label for="email">이메일</label>
        <input
          id="email"
          type="text"
          v-model.trim="info.email"
          autocomplete="off"
          @keyup.enter="isEmailCheck"
        />
        <button class="confirm_btn" @click="isEmailCheck">다음</button>
      </div>
    </transition>

    <!-- STEP 1 : ID -->
    <transition name="fade-slide">
      <div class="user_input" v-if="step === 1">
        <label for="username">ID</label>
        <input
          id="username"
          type="text"
          v-model.trim="info.username"
          autocomplete="off"
          @keyup.enter="isNameCheck"
        />
        <button class="confirm_btn" @click="isNameCheck">다음</button>
      </div>
    </transition>

    <!-- STEP 2 : 닉네임 -->
    <transition name="fade-slide">
      <div class="user_input" v-if="step === 2">
        <label for="nickname">닉네임</label>
        <input
          id="nickname"
          type="text"
          v-model.trim="info.nickname"
          autocomplete="off"
          @keyup.enter="isNickCheck"
        />
        <button class="confirm_btn" @click="isNickCheck">다음</button>
      </div>
    </transition>

    <!-- STEP 3 : 비밀번호 -->
    <transition name="fade-slide">
      <div v-if="step === 3">
        <div class="user_input">
          <label for="userPw">비밀번호</label>
          <input
            id="userPw"
            type="password"
            v-model.trim="info.password"
            autocomplete="off"
            @keyup="pwdCheck"
          />
        </div>

        <div class="user_input">
          <label for="userPwChk">비밀번호 확인</label>
          <input
            id="userPwChk"
            type="password"
            v-model.trim="info.password_check"
            autocomplete="off"
            @keyup="pwdCheck"
            @keyup.enter="isPwCheck"
          />

          <img
            v-if="isInput"
            :src="chkPw ? require('@/assets/img/o.png') : require('@/assets/img/x.png')"
            :alt="chkPw ? 'Matched' : 'Not Matched'"
          />
        </div>

        <div class="confirm_box">
          <p>숫자, 문자, 특수 문자를 포함하여 8자에서 12자 사이의 비밀번호를 입력해 주세요.</p>
          <button class="btn_type_02" @click="isPwCheck">가입하기</button>
        </div>
      </div>
    </transition>
  </div>

  <ModalAlert
    :isVisible="dialog.isVisible"
    :isBtn="true"
    :content="dialog.content"
    @closeDialogHandler="closeDialogHandler"
  />
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import api from '@/api/apiUser';
import { emailCheck, nameCheck, passwordCheck } from '@/utils/common';
import { useRouter } from 'vue-router';
import JoinSelect from './ViewJoinSelect.vue';
import ModalAlert from '@/components/modal/ModalAlert.vue';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

// step: 0=이메일, 1=ID, 2=닉네임, 3=PW
const step = ref(0);
const isJoinSelect = ref(false);

const info = reactive({
  email: '',
  username: '',
  nickname: '',
  password: '',
  password_check: '',
  is_admin : false,
  is_seller : false,
  is_active : true,
});

const isInput = ref(false);
const chkPw = ref(false);

const dialog = reactive({
  isVisible: false,
  content: '',
});

const joinFlag = computed(()=> store.state.user.joinFlag);
const openDialog = (msg) => {
  dialog.content = msg;
  dialog.isVisible = true;
};
const closeDialogHandler = () => (dialog.isVisible = false);

const callFn = (flag) => {
  if (flag) isJoinSelect.value = true;
};

// 이메일 체크
const isEmailCheck = () => {
  if (!info.email) return openDialog('이메일을 입력해 주세요.');
  if (!emailCheck(info.email)) return openDialog('이메일을 잘못 입력했는지 확인해 주세요.');
  step.value = 1;
};

// ID 체크
const isNameCheck = () => {
  if (!info.username) return openDialog('ID를 입력해 주세요.');
  if (!nameCheck(info.username)) return openDialog('ID를 잘못 입력했는지 확인해 주세요.');
  step.value = 2;
};

// 닉네임 체크
const isNickCheck = () => {
  if (!info.nickname) return openDialog('닉네임을 입력해 주세요.');
  if (info.nickname.length < 2 || info.nickname.length > 12)
    return openDialog('닉네임은 2~12자로 입력해 주세요.');
  step.value = 3;
};

// PW 체크
const isPwCheck = () => {
  if (!info.password) return openDialog('비밀번호를 입력해 주세요.');
  if (!info.password_check) return openDialog('비밀번호 확인을 입력해 주세요.');
  if (!passwordCheck(info.password, info.password_check))
    return openDialog('숫자, 문자, 특수 문자를 포함하여 8~12자의 비밀번호를 입력해 주세요.');

  createUser();
};

// PW 실시간 확인
const pwdCheck = () => {
  if (info.password && info.password_check) {
    isInput.value = true;
    chkPw.value = info.password === info.password_check;
  }
};

// 회원가입 API
const createUser = async () => {
  console.log('info',info);
  try {
    info.is_seller = joinFlag.value ? false : true;
    console.log('info',info);
    const result = await api.joinUser(info);
    if (result.status === '201') {
      openDialog('가입이 성공적으로 완료되었습니다.');
      router.push('/');
    }
  } catch (err) {
    console.error(err);
    openDialog('회원가입 과정에서 오류가 발생했습니다.');
  }
};
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