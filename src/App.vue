<script setup lang="ts">
import OrderBook from './components/OrderBook.vue'
import Trade from './components/Trade.vue'
</script>

<template>
  <main>
    <OrderBook />
    <Trade />
  </main>
</template>

<style scoped>
main {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
    sans-serif;
  padding: 2rem;
}
</style>
