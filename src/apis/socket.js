

import config from "./../config";
import io from 'socket.io-client';

var socket = null;

export const connectSocket = (token) => {
  socket = io(config.API_URL, {
    query: 'token=' + token,
    forceNew: true
  });
}

export const disconnectSocket = () => {
  socket.disconnect();
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

export const updateReadAt = (room_id, time) => {
  return socketEmit("readat:up", {room_id, time});
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
  const count = room.msg_count - room.messages.length;
  if (count === 0)
    return new Promise((resolve, reject) => {resolve("No more message")});

  return socketEmit("more:up", {
    room_id: room._id,
    position: room.messages.length,
    count: count
  });
}

export const onMoreMessages = (callback) => {
  socket.on('more:down', (data) => {
    const {room_id, messages} = data;
    if (callback)
      callback(room_id, messages);
  })
}