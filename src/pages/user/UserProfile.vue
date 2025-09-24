<template>
  <div class="profile_wrap">
    <!-- email -->
    <div class="user_input">
      <label for="userEmail">이메일</label>
      <input type="text" id="userEmail" :value="info.email" readonly disabled />
    </div>

    <!-- name -->
    <div class="user_input">
      <label for="userName">아이디</label>
      <input type="text" id="userName" v-model.trim="info.user_name" />
    </div>
    <!-- name -->
    <div class="user_input">
      <label for="userPhone">핸드폰 번호</label>
      <input type="text" id="userPhone" v-model.trim="info.phone_number" />
    </div>
    <!-- name -->
    <div class="input_addr">
      <div class="user_input">
        <label>우편번호</label>
        <input type="text" name="zoneCode" v-model.trim="info.zonecode" readonly @mousedown="$event.preventDefault()"
          @click="addressSearch" />
        <button @click="addressSearch" class="btn_type_01 ml-20">
          주소 검색
        </button>
      </div>
      <div class="user_input">
        <label>주소</label>
        <input type="text" v-model="info.address" readonly @mousedown="$event.preventDefault()"
          @click="addressSearch" />
      </div>
      <div class="user_input">
        <label>상세주소</label>
        <input type="text" name="detailAddr" placeholder="oo동 ,oo호 입력" v-model="info.detail_address" />
      </div>
    </div>
    <div class="user_input radio_area" v-if="mainPath == 'manage'">
      <label>판매자 여부</label>
      <input type="radio" name="isSeller" id="se_true" v-model="info.is_seller" :value="true" />
      <label for="se_true">O</label>
      <input type="radio" name="isSeller" id="se_false" v-model="info.is_seller" :value="false" />
      <label for="se_false">X</label>
    </div>
    <div class="user_input radio_area" v-if="mainPath == 'manage'">
      <label>관리자 여부</label>
      <input type="radio" name="isAdmin" id="ad_true" v-model="info.is_admin" :value="true" />
      <label for="ad_true">O</label>
      <input type="radio" name="isAdmin" id="ad_false" v-model="info.is_admin" :value="false" />
      <label for="ad_false">X</label>
    </div>
    <div class="confirm_box">
      <button type="button" class="confirm_btn" @click="modifyBtn">확인</button>
    </div>
  </div>
  <modal-alert 
      :isVisible="dialog.isVisible" 
      :isBtn="true" 
      :content="dialog.content"
      @closeDialogHandler="closeDialogHandler" />
</template>

<script setup lang="ts">
import api from "@/api/apiUser";
import { reactive, computed, ref, onMounted } from "vue";
import {
  emailCheck,
  getItemWithExpireTime,
  nameCheck,
  phoneCheck,
} from "@/utils/common";
import { useRoute, useRouter } from "vue-router";
import { IProfile, IExtendInfo } from "@/types/user";
import ModalAlert from "@/components/modal/ModalAlert.vue";

const router = useRouter();
const route = useRoute();
const info = reactive<IProfile>({
  user_name: "",
  email: "",
  address: "",
  detail_address: "",
  phone_number: "",
  zonecode: "",
  is_admin: false,
  is_seller: false,
  is_active: true,
});
const dialog = ref({
    isVisible: false,
    content: "",
})
const originInfo = ref<IExtendInfo | null>(null);
const isCheck = ref(false);
const modifyBool = ref(false);
const modifySuccess = ref(false);
const mainPath = computed(() => route.path.split("/")[1]);
const user_idx = computed(() => {
  if (mainPath.value == "manage") {
    return window.sessionStorage.getItem("click_idx");
  } else {
    return getItemWithExpireTime("userInfoObj")?.user_id;
  }
});
// user 정보 조회 api 호출
const getUserInfo = async () : Promise<void> => {
  try {
    const result = await api.getOnlyUser(user_idx.value);
    const data = result[0];
    originInfo.value = result[0];
    const { user_name, email, phone_number, address, is_admin } = data;
    info.user_name = user_name;
    info.email = email;
    info.phone_number = phone_number === 'None' ? "" : phone_number;
    info.is_admin = is_admin;
    
    if (address) {
      const [mainAddr, subAddr] = address.split("&");
      info.address = mainAddr || "";
      info.detail_address = subAddr || "";
    } else {
      info.address = "";
      info.detail_address = "";
    }

  } catch (error) {
    return;
  }
};

// user 정보 수정 api 호출
const putUserInfo = async () : Promise<void> => {
  try {
    if (!info.address) info.address = '';
    if (!info.detail_address) info.detail_address = '';
    if (!info.phone_number) info.phone_number = '';
    const result = await api.putOnlyUser(user_idx.value, info);
    if (result.status === "200") {
      dialog.value.content = "수정이 완료되었습니다.";
      modifySuccess.value = true;
    } else{
      dialog.value.content = result.errorMsg;
    }
    dialog.value.isVisible = true;
  } catch (error : any) {
    if(error.response?.status === 404){
      dialog.value.content = "중복된 아이디입니다. 다시 입력해주세요.";
    }else{
      dialog.value.content = "실패하였습니다. 다시 시도해주세요.";
    }
    dialog.value.isVisible = true;
  } 
};

// 이메일 확인
const isEmailCheck = () => {
  if (info.email === "") {
    dialog.value.content = "이메일을 입력해주세요.";
    dialog.value.isVisible = true;
  } else if (!emailCheck(info.email)) {
    dialog.value.content = "이메일 형식을 확인하세요.";
    dialog.value.isVisible = true;
  } else isNameCheck();
};

// 이름 확인
const isNameCheck = () => {
  if (info.user_name === "") {
    dialog.value.content = "아이디를 입력해주세요.";
    dialog.value.isVisible = true;
  } else if (!nameCheck(info.user_name)) {
    dialog.value.content = "아이디를 확인하세요.";
    dialog.value.isVisible = true;
  } else isPhoneCheck();
};

//핸드폰 번호 확인
const isPhoneCheck = () => {
  if (!phoneCheck(info.phone_number)) {
    dialog.value.content = "핸드폰 번호를 확인하세요.";
    dialog.value.isVisible = true;
  } else isCheck.value = true;
};

// 회원정보 수정 버튼 클릭시
const modifyBtn = () : void => {
  if (originInfo.value) {
    if (
      originInfo.value.user_name == info.user_name &&
      originInfo.value.email == info.email &&
      originInfo.value.phone_number == info.phone_number &&
      originInfo.value.address?.split("&")[0] == info.address &&
      originInfo.value.address?.split("&")[1] == info.detail_address &&
      originInfo.value.is_admin == info.is_admin 
    ) {
      modifyBool.value = false;
    } else modifyBool.value = true;
  }

  if (modifyBool.value) {
    // 이메일, 아이디 필수값
    isEmailCheck();
    if (isCheck.value) putUserInfo();
  } else {
      dialog.value.content = "변경된 사항이 없습니다.";
      dialog.value.isVisible = true;
  }
};
const loadDaumPostcodeScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.daum && window.daum.Postcode) {
      resolve(); 
      return;
    }
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Daum Postcode"));
    document.head.appendChild(script);
  });
};

// 주소 검색 다음 api 사용
const addressSearch = async () => {
  await loadDaumPostcodeScript();
  new window.daum.Postcode({
    oncomplete: (data) => {
      info.zonecode = data.zonecode;
      info.address = data.roadAddress;
      info.detail_address = data.detailAddress;
    },
  }).open();
};

const closeDialogHandler = () => {
    dialog.value.isVisible = false;
    if(modifySuccess.value){
      if (mainPath.value == "manage") router.push("/manage/users");
      else router.push("mypage");
    }
}
onMounted(async ()=>{
  await getUserInfo();
});

</script>
