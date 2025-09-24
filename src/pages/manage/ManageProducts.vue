<template>
    <div class="pb-20 btn_area_r">
        <button class="btn_type_02" @click="createProduct()">상품 등록</button>
    </div>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Idx</th>
                <th>판매자</th>
                <th>동물</th>
                <th>카테고리</th>
                <th>상품이름</th>
                <th>등록일</th>
                <th>수정일</th>
                <th>수정</th>
            </tr>
        </thead>
        <tbody>
            <ComnNodata :list="displayedPosts" :isTable="true" />
            <tr v-for="product in displayedPosts" :key="product.id">
                <td>{{ product.id }}</td>
                <td>{{ product.user_name }}</td>
                <td>{{ product.animal_category }}</td>
                <td>{{ product.category }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.created_at?.split("T")[0] }}</td>
                <td>
                    {{
                        product.updated_at == null
                            ? "-"
                            : product.updated_at?.split("T")[0]
                    }}
                </td>
                <td @click="modifyProduct(product.id)">
                    <img class="edit_icon" src="@/assets/img/common/edit_icon.png" alt="수정 버튼" />
                </td>
            </tr>
        </tbody>
    </table>
    <PagingView :currentPage="currentPage" :totalPages="totalPages" @changePage="changePage" />
</template>

<script setup lang="ts">
import productApi from "@/api/apiProduct";
import { getItemWithExpireTime, sortData } from "@/utils/common";
import PagingView from "@/components/common/ComnPaging.vue";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { IProductsResult } from "@/types/product";
import ComnNodata from "@/components/common/ComnNodata.vue";
const router = useRouter();
const list = ref<IProductsResult[]>([]);
const currentPage = ref(1); //현재 페이지 번호
const postsperPage = 10; //한 페이지에 보여줄 게시글 갯수
const isAdmin = computed(() => getItemWithExpireTime("userInfoObj")?.is_admin);
const username = computed(() => getItemWithExpireTime("userInfoObj")?.username);
const totalPages = computed(() => {
    //총 페이지 수
    return Math.ceil(list.value.length / postsperPage);
});

// 현재 페이지에 해당하는 게시글 목록을 반환
const displayedPosts = computed<IProductsResult[]>(() => {
    const startIndex = (currentPage.value - 1) * postsperPage;
    const endIndex = startIndex + postsperPage;
    if (!list.value) return [];
    else return list.value.slice(startIndex, endIndex);
});

//상품 정보 전체 조회 api 호출
const getAllProduct = async (): Promise<void> => {
    try {
        const result: IProductsResult[] = await productApi.viewAllProduct(null);
        if (isAdmin.value) {
            list.value = sortData(result);
        } else {
            list.value = result.filter(item => { username.value == item.user_name });
        }

    } catch (error) {
        console.error(error);
    }
};

// 추가하기 이벤트리스너
const createProduct = () => {
    router.push(`products/create`);
};

// 수정하기 이벤트리스너
const modifyProduct = (id: number) => {
    router.push(`products/${id}`);
};

//페이지 변경
const changePage = (page: number) => {
    currentPage.value = page;
};

// created
await getAllProduct();
</script>
<style lang="scss" scoped>
.btn_type_02 {
    box-shadow: none;
    padding: 10px 15px;
    font-family: (--pretend-font) !important;
    font-size: 14px;
    background: rgb(0, 0, 0) !important;
    margin: 0 0 30px 0;
}
</style>