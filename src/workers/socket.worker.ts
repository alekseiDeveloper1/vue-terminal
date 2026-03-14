const connect = () => {
  const socket = new WebSocket(
    'wss://stream.testnet.binance.vision/ws/btcusdt@kline_1m',
  )

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data)
    console.log(event.data)
    if (msg.e === 'kline' && msg.k) {
      const { t, o, h, l, c } = msg.k

      const candle = {
        time: t / 1000,
        open: parseFloat(o),
        high: parseFloat(h),
        low: parseFloat(l),
        close: parseFloat(c),
      }

      postMessage(candle)
    }
  }

  socket.onclose = () => setTimeout(connect, 2000)
  socket.onerror = (err) => console.error('Worker Socket Error:', err)
}

connect()
