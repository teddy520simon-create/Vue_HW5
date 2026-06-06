<template>
  <div class="container">
    <div class="hero">
      <div>
        <span class="eyebrow">✨ 往年價格數據管理系統</span>
        <h1>歷年價格數據管理系統</h1>
        <p class="lede">記錄每次購買的商品價格，幫助你追蹤歷史價格波動，在最划算的時機下手！</p>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="roll one"></div>
        <div class="roll two"></div>
        <div class="roll three"></div>
        <div class="roll-label">歷史數據追蹤</div>
      </div>
    </div>

    <div class="stats">
      <div class="stat">
        <span class="label">記錄總筆數</span>
        <span class="value">{{ statCount }} 筆</span>
        <span class="note">歷史購買記錄</span>
      </div>
      <div class="stat">
        <span class="label">最新一筆價格</span>
        <span class="value">{{ statLatest !== '-' ? `$ ${statLatest}` : '-' }}</span>
        <span class="note">最近一次購買</span>
      </div>
      <div class="stat">
        <span class="label">歷史最高價</span>
        <span class="value">{{ statMax !== '-' ? `$ ${statMax}` : '-' }}</span>
        <span class="note">記錄中的最高價</span>
      </div>
    </div>

    <PriceForm @save="saveData" />
    <PriceSearch @search="handleSearch" />
    <PriceTable :items="filteredData" />

    <div class="footer-note">※ 價格僅供參考，實際以賣場為主</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PriceForm from './components/PriceForm.vue'
import PriceSearch from './components/PriceSearch.vue'
import PriceTable from './components/PriceTable.vue'

const priceData = ref([])
const searchQuery = ref('')

// 統計數據計算
const statCount = computed(() => priceData.value.length)
// 顯示最新一筆的價格（如果是字串範圍，直接顯示字串）
const statLatest = computed(() => priceData.value.length ? priceData.value[0].price : '-')

// 智慧型最高價計算：自動識別數字與「155～185」這種範圍字串，並取最高值進行比較
const statMax = computed(() => {
  if (!priceData.value.length) return '-'
  const numericPrices = priceData.value.map(item => {
    const p = String(item.price)
    if (p.includes('～')) {
      // 遇到範圍字串，拆開並取右邊的最大值（例如 155～185 取 185）
      const highPrice = p.split('～')[1]
      return Number(highPrice) || 0
    }
    return Number(p) || 0
  })
  return Math.max(...numericPrices)
})

// 搜尋過濾後的資料
// 搜尋過濾後的資料
const filteredData = computed(() => {
  if (!searchQuery.value) return priceData.value
  
  const query = searchQuery.value.toUpperCase()
  
  return priceData.value.filter(item => 
    item.name.toUpperCase().includes(query) ||
    item.date.toUpperCase().includes(query) ||
    String(item.price).toUpperCase().includes(query) // ✨ 新增這行：讓價格也能被搜尋
  )
})
// 載入資料 (內建你提供的 2016~2026 歷史資料作為基礎底牌)
// 載入資料 (內建你提供的 2016~2026 歷史資料作為基礎底牌)
async function loadData() {
  // 把預設資料抽出來
  const defaultData = [
    { id: 11, date: '2026年', name: '衛生紙一串 (10~12包) 平均價格', price: '155～185' },
    { id: 10, date: '2025年', name: '衛生紙一串 (10~12包) 平均價格', price: '150～180' },
    { id: 9,  date: '2024年', name: '衛生紙一串 (10~12包) 平均價格', price: '145～175' },
    { id: 8,  date: '2023年', name: '衛生紙一串 (10~12包) 平均價格', price: '140～170' },
    { id: 7,  date: '2022年', name: '衛生紙一串 (10~12包) 平均價格', price: '135～165' },
    { id: 6,  date: '2021年', name: '衛生紙一串 (10~12包) 平均價格', price: '125～155' },
    { id: 5,  date: '2020年', name: '衛生紙一串 (10~12包) 平均價格', price: '120～150' },
    { id: 4,  date: '2019年', name: '衛生紙一串 (10~12包) 平均價格', price: '120～145' },
    { id: 3,  date: '2018年', name: '衛生紙一串 (10~12包) 平均價格 (衛生紙之亂後)', price: '110～140' },
    { id: 2,  date: '2017年', name: '衛生紙一串 (10~12包) 平均價格', price: '95～115' },
    { id: 1,  date: '2016年', name: '衛生紙一串 (10~12包) 平均價格', price: '90～110' }
  ];

  try {
    const res = await fetch('/api/prices')
    if (res.ok) {
      const data = await res.json()
      priceData.value = data.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else {
      priceData.value = defaultData
    }
  } catch (error) {
    console.log('後端尚未連線，載入預設歷史數據')
    // 關鍵修復：網路錯誤時，也要把預設資料塞進去！
    priceData.value = defaultData 
  }
}

// 儲存新資料
async function saveData(payload) {
  try {
    await fetch('/api/prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    // 格式化新輸入的日期顯示
    const formattedDate = payload.date ? `${payload.date}` : '新紀錄'
    priceData.value.unshift({ id: Date.now(), date: formattedDate, name: payload.name, price: payload.price })
  } catch (error) {
    // 後端沒開時的純前端模擬
    const formattedDate = payload.date ? `${payload.date}` : '新紀錄'
    priceData.value.unshift({ id: Date.now(), date: formattedDate, name: payload.name, price: payload.price })
    alert('已於前端暫存，請確認後端是否啟動')
  }
}

function handleSearch(query) {
  searchQuery.value = query
}

onMounted(() => {
  loadData()
})
</script>

<style>
:root {
  --paper: #fffdf8;
  --paper-soft: #f6efe3;
  --ink: #433628;
  --muted: #7d6b58;
  --accent-deep: #8f5b27;
  --border: #ead8c0;
  --shadow: 0 20px 45px rgba(102, 68, 31, 0.12);
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: "Microsoft JhengHei", sans-serif;
  color: var(--ink);
  background:
    radial-gradient(circle at top left, rgba(255, 234, 203, 0.9), transparent 34%),
    radial-gradient(circle at right top, rgba(248, 223, 184, 0.75), transparent 28%),
    linear-gradient(180deg, #fff8ee 0%, #f7efe4 100%);
  min-height: 100vh;
  padding: 24px;
}

.container {
  max-width: 980px;
  margin: auto;
  background: rgba(255, 253, 248, 0.92);
  backdrop-filter: blur(10px);
  padding: 28px;
  border-radius: 28px;
  box-shadow: var(--shadow);
  border: 1px solid rgba(234, 216, 192, 0.9);
}

.hero { display: grid; grid-template-columns: 1.5fr 1fr; gap: 18px; align-items: center; margin-bottom: 22px; }
.eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px; border-radius: 999px; background: #f3e5cf; color: var(--accent-deep); font-weight: 700; font-size: 0.92rem; }
h1 { margin: 14px 0 10px; font-size: clamp(2rem, 4vw, 3.2rem); line-height: 1.06; color: var(--accent-deep); }
.lede { margin: 0; max-width: 44rem; color: var(--muted); font-size: 1.03rem; line-height: 1.75; }
.hero-art { position: relative; min-height: 180px; border-radius: 24px; background: linear-gradient(145deg, #fff7ec, #f5e4ca); border: 1px solid #ead6bb; overflow: hidden; }
.roll { position: absolute; width: 116px; height: 116px; border-radius: 50%; background: radial-gradient(circle at 36% 34%, #fff 0 27%, #efe2cf 28% 53%, #d7bd93 54% 68%, #c79f6e 69% 100%); }
.roll.one { left: 22px; top: 30px; }
.roll.two { right: 24px; top: 18px; transform: scale(0.92); }
.roll.three { left: 108px; bottom: 16px; transform: scale(0.75); }
.roll-label { position: absolute; left: 18px; bottom: 16px; padding: 8px 12px; border-radius: 999px; background: rgba(255,255,255,0.76); color: var(--accent-deep); font-weight: 700; }
.stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 18px 0 24px; }
.stat { background: linear-gradient(180deg, #fffaf2, #f7ead5); border: 1px solid var(--border); border-radius: 18px; padding: 16px; }
.stat .label { display: block; color: var(--muted); font-size: 0.88rem; margin-bottom: 8px; }
.stat .value { display: block; font-size: 1.45rem; font-weight: 800; color: var(--accent-deep); }
.stat .note { display: block; margin-top: 6px; color: var(--muted); font-size: 0.9rem; }
.footer-note { margin-top: 16px; color: var(--muted); font-size: 0.92rem; text-align: right; }

@media (max-width: 760px) {
  body { padding: 14px; }
  .container { padding: 18px; border-radius: 22px; }
  .hero { grid-template-columns: 1fr; }
  .stats { grid-template-columns: 1fr; }
  .hero-art { min-height: 150px; }
}
</style>