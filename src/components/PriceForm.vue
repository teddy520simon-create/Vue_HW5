<template>
  <div class="form-group">
    <input type="date" v-model="formData.date">
    <input type="text" v-model="formData.name" placeholder="商品名稱 (例如：春風衛生紙 110抽8包)">
    <input type="number" v-model="formData.price" placeholder="價格 (元)">
    <button @click="submitForm">新增記錄</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['save'])

const formData = ref({
  date: '',
  name: '',
  price: ''
})

function submitForm() {
  if (!formData.value.date || !formData.value.name || !formData.value.price) {
    alert('請填寫完整日期、商品名稱與價格！')
    return
  }
  
  // 傳遞給父元件 App.vue
  emit('save', { ...formData.value })
  
  // 清空表單
  formData.value.name = ''
  formData.value.price = ''
}
</script>

<style scoped>
.form-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
  background: var(--paper-soft);
  padding: 16px;
  border-radius: 20px;
  border: 1px solid #ead8c2;
}

input {
  flex: 1;
  padding: 13px 14px;
  border: 1px solid var(--border);
  border-radius: 14px;
  min-width: 160px;
  background: rgba(255,255,255,0.9);
  color: var(--ink);
}

button {
  padding: 12px 24px;
  background: linear-gradient(180deg, #d29a57, #b87634);
  color: white;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 800;
}
</style>