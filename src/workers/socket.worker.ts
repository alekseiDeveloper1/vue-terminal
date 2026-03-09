interface DepthUpdate {
  e: string;
  E: number;
  s: string;
  U: number;
  u: number;
  b: [string, string][];
  a: [string, string][];
}

let socket: WebSocket;
let dataBuffer: DepthUpdate[] = [];

const connect = () => {
  socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@depth');

  socket.onopen = () => {
    console.log('[Worker] WebSocket connection established');
  };

  socket.onmessage = (event) => {
    const message: DepthUpdate = JSON.parse(event.data);
    dataBuffer.push(message);
  };

  socket.onclose = () => {
    console.log('[Worker] WebSocket connection closed. Reconnecting...');
    setTimeout(connect, 1000);
  };

  socket.onerror = (error) => {
    console.error('[Worker] WebSocket error:', error);
    socket.close();
  };
};

connect();

setInterval(() => {
  if (dataBuffer.length > 0) {
    postMessage(dataBuffer);
    dataBuffer = [];
  }
}, 100);
