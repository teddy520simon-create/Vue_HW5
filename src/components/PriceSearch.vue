<template>
  <input 
    type="text" 
    class="search-box" 
    v-model="searchText"
    @input="onSearch"
    placeholder="輸入關鍵字搜尋商品名稱..." 
  >
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search'])
const searchText = ref('')

function onSearch() {
  emit('search', searchText.value)
}
</script>

<style scoped>
.search-box {
  width: 100%;
  padding: 14px 16px;
  margin: 10px 0 18px 0;
  font-size: 16px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: rgba(255,255,255,0.95);
}
</style>