<template>
    <div v-if="props.list.length === 0 && !props.isTable">
        <div class="no_data" v-if="!props.content" :style="{ height: props.height ? props.height : '100%' }">
            <img src="@/assets/img/common/nodata_icon.png" alt="no_data" />
            <p>데이터가 없습니다.</p>
        </div>
        <div class="no_data" v-else>
            <p >{{props.content}}</p>
        </div>
    </div>
    <tr v-else-if="props.list.length === 0 && props.isTable">
        <td colspan="10" class="no_data_table">
            <img src="@/assets/img/common/nodata_icon.png" alt="no_data" />
            <p>데이터가 없습니다.</p>
        </td>
    </tr>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
const props = defineProps<{
    list: any[],
    content?: string,
    height?: string,
    isTable?: boolean,
}>();
</script>

<style lang="scss" scoped>
.no_data {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;

    img {
        width: 50px;
    }
}

.table-bordered .no_data_table {
  font-weight: 700;
  padding: 100px 0;
  img {
    width: 100px;
  }
}
</style>