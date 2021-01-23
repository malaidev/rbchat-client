

import config from "./../config";
import io from 'socket.io-client';

var socket = null;

function connectSocket(token) {
  socket = io(config.API_URL, {
    query: 'token=' + token,
    forceNew: true
  });
}

function disconnectSocket() {
  socket.disconnect();
}

function testConnection() {
  const msg = "Test Message";
  return new Promise((resolve, reject) => {
    if (socket == null) reject('Connection Test: No socket.');
    try {
      socket.emit("test", msg, (res) => {
        if (msg == res) resolve();
        else reject("Connection Test: Unexpected response.")
      });
    }
    catch {
      reject("Connection Test: Failed with errors");
    }
    setTimeout(() => reject("Connection Test: Time out"), 3000);
  })
}

export default {
  connectSocket,
  disconnectSocket,
  testConnection
};