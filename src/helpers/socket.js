
import config from "./../config";
import io from 'socket.io-client';

var socket = null;

const connect = (token) => {
  socket = io(config.API_URL, {
    query: 'token=' + token,
    forceNew: true
  });
  return socket;
}

const disconnect = () => {
  io.sockets.connected[socket.id].disconnect();
  socket = null;
}

const getSocket = () => {
  return socket;
}

export default { Socket: getSocket, connect, disconnect };