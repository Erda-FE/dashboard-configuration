import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const closeLog = true;

let stompClient;
let socket;
let timer;

export function connect(pushListener) {
  socket = new SockJS('/api/ws/msg');
  stompClient = Stomp.over(socket);
  stompClient.heartbeat.outgoing = 20000;
  stompClient.heartbeat.incoming = 10000;
  if (closeLog) {
    stompClient.debug = () => {};
  }
  const connectedCallback = () => {
    clearTimeout(timer);
    stompClient.subscribe('/user/topic/notification', (msg) => {
      const { type, payload } = JSON.parse(msg.body);
      pushListener(type, payload);
    });
  };
  const errorCallback = (error) => {
    stompClient.debug(`received error: ${error}`);
    reconnect(pushListener);
  };
  stompClient.connect({}, connectedCallback, errorCallback);
  socket.onclose = () => {
    reconnect(pushListener);
  };
  socket.onerror = () => {
    reconnect(pushListener);
  };
  return stompClient;
}
function reconnect(pushListener) {
  if (stompClient.connected) {
    console.log('disconnecting...');
    disconnect();
  }
  timer = setTimeout(() => {
    console.log('reconnecting');
    connect(pushListener);
  }, 5000);
}
export function disconnect() {
  if (stompClient !== undefined) {
    stompClient.disconnect();
  }
}
