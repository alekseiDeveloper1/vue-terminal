<template>
  <div class="trade-container">
    <h2>Place a Test Order</h2>
    <div class="input-group">
      <label for="apiKey">API Key:</label>
      <input
        id="apiKey"
        v-model="apiKey"
        type="text"
      >
    </div>
    <div class="input-group">
      <label for="secretKey">Secret Key:</label>
      <input
        id="secretKey"
        v-model="secretKey"
        type="password"
      >
    </div>
    <button @click="placeTestOrder">
      Place Test Order
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTradeStore } from '../stores/trade'

const tradeStore = useTradeStore()

const apiKey = ref('')
const secretKey = ref('')

const placeTestOrder = () => {
  tradeStore.apiKey = apiKey.value
  tradeStore.secretKey = secretKey.value

  tradeStore.placeOrder({
    symbol: 'BTCUSDT',
    side: 'BUY',
    type: 'MARKET',
    quantity: 0.001,
  })
}
</script>

<style scoped>
.trade-container {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
}
</style>
