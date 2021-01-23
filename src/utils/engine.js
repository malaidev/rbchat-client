import api from '../apis';

function connectSocket(token) {
  api.connectSocket(token);
}

function disconnectSocket() {
  api.disconnectSocket();
}

function testConnection() {
  api.testConnection()
    .then(res => {
      console.log('Connected');
    }).catch(err => {
      console.log(err);
    })
}

function updateAll() {
  api.getAllData()
    .then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
}

function formatChatData(chatdata) {
  const { users, rooms, me } = chatdata;
  var unames = {}, i;
  for (i = 0; i < users.length; i++) {
    const user = users[i];
    unames[user.user_id] = user.user_name;
  }
  for (i = 0; i < rooms.length; i++) {
    if (rooms[i].room_type == 1 && rooms[i].room_name == "__peer2peer") {
      const peer = rooms[i].members.find(member => member.user_id != me.user_id)
      rooms[i].room_name = unames[peer.user_id];
    }
  }
  return { users, rooms, me };
}

export default {
  connectSocket,
  disconnectSocket,
  testConnection,
  updateAll,
  formatChatData
};