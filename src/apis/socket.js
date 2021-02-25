

import config from "./../config";
import io from 'socket.io-client';

var socket = null;
var disconnected = true;

export const connectSocket = (token) => {
  
  if (socket)
    socket.disconnect();

  socket = io(config.API_URL, {
    query: 'token=' + token,
    forceNew: true,
  });
}

export const disconnectSocket = () => {
  if (socket && socket.connected)
    socket.disconnect();
}

export const onSocketDisconnect = (callback) => {
  socket.on('disconnect', function() {
    console.log('Disconnected from server...');

    if (callback && !disconnected) {
      disconnected = true;
      setTimeout(() => {
        if (disconnected)
          callback();
        disconnected = false;
      }, 5000);
    }
  });
}

export const onSocketConnect = (callback) => {
  socket.on('connect', function() {
    console.log('Connected to server...');
    disconnected = false;
    if (callback) callback();
  });
}

function socketEmit(event, data) {
  return new Promise((resolve, reject) => {
    const error_func = (error_msg) => {
      console.log(error_msg);
      reject(error_msg);
    }
    if (socket == null || !socket.connected) error_func("[" + event + "] No socket.");
    try {
      socket.emit(event, data, (res) => {
        if (res.msg === config.SOCKET_SUCCESS) resolve(res.data);
        else error_func("[" + event + "] Unexpected response. msg: " + res.msg);
      });
    }
    catch {
      error_func("[" + event + "] Failed with errors");
    }
  })
}

export const testConnection = () => {
  return socketEmit("test", "Connection Test");
}

export const addNewMessage = (room_id, message) => {
  return socketEmit("msg:up", {room_id, message});
}

export const addNewRoom = (room) => {
  return socketEmit("room:up", {room});
}

export const onNewMessage = (callback) => {
  socket.on('msg:down', (data) => {
    const {room_id, message} = data;
    if (callback)
      callback(room_id, message);
  })
}

export const onNewRoom = (callback) => {
  socket.on('room:down', (data) => {
    const {room} = data;
    if (callback)
      callback(room);
  })
}

export const updateReadAt = (room_id) => {
  return socketEmit("readat:up", {room_id});
}

export const onReadAt = (callback) => {
  socket.on('readat:down', (data) => {
    const {room_id, user_id, time} = data;
    if (callback)
      callback(room_id, user_id, time);
  })
}

export const updateTyping = (room_id) => {
  return socketEmit("typing:up", {room_id});
}

export const onTyping = (callback) => {
  socket.on('typing:down', (data) => {
    const {user_id, room_id, is_typing} = data;
    if (callback)
      callback(user_id, room_id, is_typing);
  })
}

export const onUinfo = (callback) => {
  socket.on('uinfo:down', (data) => {
    const {user_id, uinfo} = data;
    if (callback)
      callback(user_id, uinfo);
  })
}

export const getMoreMessages = (room) => {    
  
  if (!room.msg_count)
    return new Promise((resolve, reject) => {resolve("No more message")});

  return socketEmit("more:up", {
    room_id: room._id,
    position: room.msg_count,
    count: room.msg_count
  });
}

export const onMoreMessages = (callback) => {
  socket.on('more:down', (data) => {
    const {room_id, messages} = data;
    if (callback)
      callback(room_id, messages);
  })
}