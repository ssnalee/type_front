<template>
  <div class="page_wrap" v-if="props.totalPages > 0">
    <ul class="pagination flex_center row">
            <li class="page-item previous paging_btn" v-if="props.currentPage > 5 && props.currentPage > 1"
                @click="setPage('prevEnd')">
                &laquo;
            </li>
            <li class="page-item previous paging_btn" v-if="props.currentPage > 5 && props.currentPage > 1"
                @click="setPage('prev')">
                &lsaquo;
            </li>
            <li v-for="page in displayedPages" :key="page" @click="setPage(page)" class="page-item"
                :class="{ active: props.currentPage === page }">
                {{ page }}
            </li>
            <li class="page-item next paging_btn" v-if="props.totalPages > 5 && props.currentPage < props.totalPages"
                @click="setPage('next')">
                &rsaquo;
            </li>
            <li class="page-item next paging_btn" v-if="props.totalPages > 5 && props.currentPage < props.totalPages"
                @click="setPage('nextEnd')">
                &raquo;
            </li>
        </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";
const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();
const emit = defineEmits(["changePage"]);
const displayedPages = computed(() => {
    if (props.totalPages <= 5) {
        return Array.from({ length: props.totalPages }, (_, i) => i + 1);
    } else {
        const startPage = Math.max(1, props.currentPage - 2);
        const endPage = Math.min(props.totalPages, startPage + 4);
        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    }
});

const setPage = (str : string | number) => {
    let resultPage;
    if (str == "prev") {
        resultPage = props.currentPage - 5 <= 0 ? 1 : props.currentPage - 5;
    } else if (str == "prevEnd") {
        resultPage = 1;
    } else if (str == "next") {
        resultPage = props.currentPage + 5 > props.totalPages ? props.totalPages : props.currentPage + 5;
    } else if (str == "nextEnd") {
        resultPage = props.totalPages;
    } else {
        resultPage = str;
    }
    emit('changePage',resultPage);
}
</script>

<style lang="scss" scoped></style>
