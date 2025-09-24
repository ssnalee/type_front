<template>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Idx</th>
                <th>아이디</th>
                <th>이메일</th>
                <th>생성일</th>
                <th>수정일</th>
                <th>주소</th>
                <th>전화번호</th>
                <th>활동여부</th>
                <th>수정</th>
                <th>삭제</th>
            </tr>
        </thead>
        <tbody>
            <ComnNodata :list="displayedPosts" :isTable="true" />
            <tr v-for="userInfo in displayedPosts" :key="userInfo.id">
                <td>{{ userInfo.id }}</td>
                <td>{{ userInfo.user_name }}</td>
                <td>{{ userInfo.email }}</td>
                <td>{{ userInfo.created_at.split("T")[0] }}</td>
                <td>{{ userInfo.updated_at.split("T")[0] }}</td>
                <td>
                    {{
                        userInfo.address == null || userInfo.address == "&"
                            ? "-"
                            : userInfo.address.split("&")[0]
                    }}
                </td>
                <td>
                    {{ userInfo.phone_number == "None" ? "-" : userInfo.phone_number }}
                </td>
                <td>{{ userInfo.is_active ? "YES" : "NO" }}</td>
                <td @click="modifyInfo(userInfo.id)">
                    <img class="edit_icon" src="@/assets/img/common/edit_icon.png" alt="수정 버튼" />
                </td>
                <td @click="deleteInfo(userInfo.id)">
                    <img class="edit_icon" src="@/assets/img/common/del_icon.png" alt="삭제 버튼" />
                </td>
            </tr>
        </tbody>
    </table>
    <paging-view 
      :currentPage="currentPage" 
      :totalPages="totalPages" 
      @changePage="changePage" />
    <modal-confirm 
      :isVisible="dialog.isVisible" 
      :content="dialog.content" 
      @closeDialogHandler="closeDialogHandler" />
    <modal-alert 
      :isVisible="dialog.isAlertVisible" 
      :isBtn="true" 
      :content="dialog.content"
      @closeDialogHandler="dialog.isAlertVisible = false" />
</template>

<script setup lang="ts">
// user 정보 조회 api 호출
import api from "@/api/apiUser";
import PagingView from "@/components/common/ComnPaging.vue";
import { IExtendUser } from "@/types/user";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import ModalConfirm from "@/components/modal/ModalConfirm.vue";
import ModalAlert from "@/components/modal/ModalAlert.vue";
import ComnNodata from "@/components/common/ComnNodata.vue";
const store = useStore();
const router = useRouter();
const usersInfo = ref<IExtendUser[]>([]);
const dialog = ref({
    isVisible: false,
    isAlertVisible: false,
    content: "",
})
const deleteId = ref(0);
const currentPage = ref(1); //현재 페이지 번호
const postsperPage = 10; //한 페이지에 보여줄 게시글 갯수
const totalPages = computed(() => {
    //총 페이지 수
    return Math.ceil(usersInfo.value.length / postsperPage);
});
const fetchStatus = computed(() => store.state.user.fetchStatus);

// 현재 페이지에 해당하는 게시글 목록을 반환
const displayedPosts = computed(() => {
    const startIndex = (currentPage.value - 1) * postsperPage;
    const endIndex = startIndex + postsperPage;
    if (!usersInfo.value) return [];
    else return usersInfo.value.slice(startIndex, endIndex);
});

// 모든 회원 정보 전체 api 호출
const getUsersInfo = async () => {
    try {
        const result = await api.getUsers();
        usersInfo.value = result;
    } catch (error) {
        console.error(error);
    }
};

//회원정보 수정 버튼 이벤트리스너
const modifyInfo = (id: number) => {
    window.sessionStorage.setItem("click_idx", String(id));
    router.push("users/profile");
};

//회원정보 삭제 버튼 이벤트리스너
const deleteInfo = (id: number) => {
    deleteId.value = id;
};

//페이지 변경
const changePage = (page: number) => {
    currentPage.value = page;
};
const closeDialogHandler = (key: number) => {
    if (key) {
        store.dispatch("user/delUserInfo", deleteId.value);
        if (fetchStatus.value === 200) dialog.value.content = "성공적으로 삭제하였습니다.";
        else dialog.value.content = "삭제에 실패했습니다. 다시 시도해 주시기 바랍니다.";
        dialog.value.isAlertVisible = true;
        getUsersInfo();
    }
    dialog.value.isVisible = false;
}
// created
getUsersInfo();
</script>

<style lang="scss" scoped></style>