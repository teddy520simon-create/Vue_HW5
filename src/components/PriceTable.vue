<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>購買日期</th>
          <th>商品名稱</th>
          <th>價格</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id || item.date + item.name">
          <td>{{ item.date }}</td>
          <td>{{ item.name }}</td>
          <td class="price-tag">$ {{ item.price }}</td>
        </tr>
      </tbody>
    </table>

    <div class="empty-state" v-if="items.length === 0">
      目前沒有任何記錄，請在上方新增您的第一筆資料！
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255,255,255,0.78);
  border: 1px solid var(--border);
}

th, td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #efe1cf;
}

th {
  background: linear-gradient(180deg, #d9a15a, #bf7c36);
  color: white;
  font-weight: 800;
}

.price-tag { 
  font-weight: bold; 
  color: #a95e1e; 
}

.empty-state {
  padding: 22px;
  text-align: center;
  color: var(--muted);
  background: #fffaf3;
  border: 1px dashed #e2c9ab;
  border-radius: 18px;
  margin-top: 12px;
}

@media (max-width: 760px) {
  th, td { padding: 12px; }
}
</style>