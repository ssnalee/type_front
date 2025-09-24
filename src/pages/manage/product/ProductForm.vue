<template>
    <form @submit.prevent="uploadProduct" class="product-form">
        <div class="pdt_input">
            <label for="name">상품명</label>
            <input type="text" id="name" v-model="product.name" required />
        </div>
        <div class="pdt_select">
            <div class="pdt_input">
                <label for="animalCategory">동물 카테고리</label>
                <select id="animalCategory" v-model="product.animal_category" required>
                    <option value="" disabled>카테고리를 선택하세요</option>
                    <option :value="item" v-for="item in animalCategory" :key="item">
                        {{ item }}
                    </option>
                </select>
            </div>
            <div class="pdt_input">
                <label for="category">카테고리</label>
                <select id="category" v-model="product.category" required>
                    <option value="" disabled>카테고리를 선택하세요</option>
                    <option :value="item" v-for="item in category" :key="item">
                        {{ item }}
                    </option>
                </select>
            </div>
        </div>
        <div class="pdt_select">
            <div class="pdt_input">
                <label for="price">가격</label>
                <input type="number" id="price" v-model.trim="product.price" required />
            </div>
            <div class="pdt_input">
                <label for="count">개수</label>
                <input type="number" id="count" v-model.trim="product.count" required />
            </div>
        </div>
        <div class="pdt_input">
            <label for="image">대표 이미지 첨부</label>
            <div class="custom-file">
                <input id="customFile" type="file" accept="image/*" @change="readInputFile" multiple />
            </div>
        </div>
        <div id="imagePreview" ref="imagePreview" class="image_preview">
            <img v-for="url in imageUrls" :key="url" :src="url" style="width:100px" />
        </div>
        <div class="pdt_input diff_input">
            <label for="content">상품 설명</label>
        </div>
        <div style="background:#fff">
            <quill-editor :value="product.content" :options="state.editorOption" @change="onEditorChange($event)">
            </quill-editor>
        </div>

        <div class="flex_center">
            <button type="submit" class="btn_type_02">상품 등록하기</button>
        </div>
    </form>
    <modal-alert 
      :isVisible="dialog.isVisible" 
      :isBtn="true" 
      :content="dialog.content"
      @closeDialogHandler="closeDialogHandler" />
</template>

<script setup lang="ts">
import productApi from "@/api/apiProduct";
import { reactive, ref, computed, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ModalAlert from "@/components/modal/ModalAlert.vue";
import { IProductResult } from "@/types/product";
import { getItemWithExpireTime } from "@/utils/common";

const route = useRoute();
const router = useRouter();
const store = useStore();
const product_id = computed(() => String(route.params.id));
const user_id = computed(()=>getItemWithExpireTime("userInfoObj")?.user_id);
const imageUrls = ref<string[]>([]);
const product = reactive({
    name: "",
    animal_category: "",
    category: "",
    price: 0,
    count: 0,
    content: "",
});

const category = computed(() => store.getters["menuList/category"]);
const animalCategory = computed(() => store.getters["menuList/animalCategory"]);

const dialog = reactive({
    isVisible: false,
    content: "",
});

const state = reactive({
    editorOption: {
        placeholder: "내용을 입력해주세요...",
        modules: {
            toolbar: [
                ["bold", "italic", "underline", "strike"],
                ["blockquote", "code-block"],
                [{ header: 1 }, { header: 2 }],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ script: "sub" }, { script: "super" }],
                [{ indent: "-1" }, { indent: "+1" }],
                [{ direction: "rtl" }],
                [{ size: ["small", false, "large", "huge"] }],
                [{ color: [] }, { background: [] }],
                [{ font: [] }],
                [{ align: [] }],
                ["clean"],
                ["link", "image", "video"],
            ],
        },
    },
});

const onEditorChange = ({ html }: { html: string }) => {
    product.content = html;
};

const getProduct = async () => {
    try {
        const result = await productApi.viewIndividualProduct(product_id.value);
        if (result) {
            const { name, animal_category: animal_category, category, price, content, count } = result;
            Object.assign(product, { name, animal_category, category, price, content, count });
            imageUrls.value = result.image;
        }
    } catch (error) {
        console.error(error);
    }
};

const readInputFile = (e: Event) => {
    imageUrls.value = [];
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (files) {
        Array.from(files).forEach((file) => {
            if (!file.type.startsWith("image/")) {
                dialog.content = "이미지 확장자만 업로드 가능합니다.";
                dialog.isVisible = true;
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    imageUrls.value.push(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        });
    }
};

const uploadProduct = async () => {
    if (imageUrls.value.length === 0) {
        dialog.content = "업로드할 파일을 선택하세요.";
        dialog.isVisible = true;
        return;
    }

    try {
        if (product_id.value && product_id.value !== "create") {
            const updatedData = {
                updated_product: {
                    ...product,
                    image: imageUrls.value,
                } as IProductResult,
            };
            const result = await productApi.editProduct(Number(product_id.value), updatedData);
            if (result) {
                dialog.content = "성공적으로 수정하였습니다.";
                dialog.isVisible = true;
                router.push("/manage/products");
            }
        } else {
            const createData = {
                product_create: {
                    ...product,
                    image: imageUrls.value,
                } as IProductResult,
            };
            const result = await productApi.postProduct(user_id.value,createData);
            if (result) {
                dialog.content = "성공적으로 등록되었습니다.";
                dialog.isVisible = true;
                router.push("/manage/products");
            }
        }
    } catch (error) {
        console.error(error);
    }
};

const closeDialogHandler = () => {
    dialog.isVisible = false;
};

onMounted( async ()=>{
    if (product_id.value && product_id.value !== "create") {
        await nextTick();
        await getProduct();
}
})

</script>

<style lang="scss" scoped>
.ql-toolbar.ql-snow + .ql-container.ql-snow {
    height: 400px;
}
</style>
