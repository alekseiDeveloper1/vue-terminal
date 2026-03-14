import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTradeStore = defineStore('trade', () => {
  const apiKey = ref('')
  const secretKey = ref('')

  const placeOrder = async (order: {
    symbol: string
    side: 'BUY' | 'SELL'
    type: 'MARKET'
    quantity: number
  }) => {
    const worker = new Worker(
      new URL('../workers/signature.worker.ts', import.meta.url),
      {
        type: 'module',
      },
    )

    const queryString = `symbol=${order.symbol}&side=${order.side}&type=${order.type}&quantity=${order.quantity}&timestamp=${Date.now()}`

    worker.postMessage({ queryString, secretKey: secretKey.value })

    worker.onmessage = async (event: MessageEvent<string>) => {
      const signature = event.data
      const url = `https://testnet.binance.vision/api/v3/order?${queryString}&signature=${signature}`

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'X-MBX-APIKEY': apiKey.value,
          },
        })

        const data = await response.json()
        console.log('Order placed:', data)
      } catch (error) {
        console.error('Error placing order:', error)
      } finally {
        worker.terminate()
      }
    }
  }

  return {
    apiKey,
    secretKey,
    placeOrder,
  }
})
