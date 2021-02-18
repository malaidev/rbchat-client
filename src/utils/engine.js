import config from '../config';
import {getLoggedInUser} from '../helpers/authUtils';

function formatMessages(messages) {
  for (var i = 0; i < messages.length; i++)
    messages[i].time = new Date(messages[i].time);
  return messages;
}

function formatRoomData(room, users, me) {
  var i;
  if (room.room_type === 1 && room.room_name === "__peer2peer") {
    const peer = room.members.find(member => member.user_id !== me.user_id)
    room.room_name = users[peer.user_id].user_name;
    room.avatar_url = users[peer.user_id].avatar_url;
    room.peer_id = peer.user_id;
  }
  const messages = room.messages;
  for (i = 0; i < messages.length; i++)
    messages[i].time = new Date(messages[i].time);
  const members = room.members;
  var members_new = {};
  for (i = 0; i < members.length; i++) {
    const member = members[i];
    if (member.read_at) member.read_at = new Date(member.read_at);
    if (member.write_at) member.write_at = new Date(member.write_at);
    members_new[member.user_id] = member;
  }
  room.createdAt = new Date(room.createdAt);
  room.updatedAt = new Date(room.updatedAt);
  room.members = members_new;
  room.unRead = calculateUnreadMessages(room, me.user_id);
  room.typings = [];
  return room;
}

function formatUserInfo(user, uinfo) {
  if (!uinfo) 
    return user;
  
  var status = uinfo.status;
  switch (uinfo.status) {
    case 1: status = "online"; break;
    case 2: status = "offline"; break;
    case 3: status = "away"; break;
    default: status = ""; break;
  }
  return {
    ...user,
    typing_at: uinfo.typing_at,
    last_seen: uinfo.last_seen?new Date(uinfo.last_seen):null,
    status
  };
}

function formatChatData(chatdata) {
  const { users, rooms, me, uinfos } = chatdata;
  var users_new = {}, i;
  for (i = 0; i < users.length; i++) {
    const user = users[i];
    const peer_room = rooms.find(room => 
      (user.user_id !== me.user_id && room.room_type === 1 && room.members.find(member => member.user_id === user.user_id))
    );
    if (peer_room)
      user.peer_room = peer_room._id;
    else
      user.peer_room = "virtual" + user.user_id;
    users_new[user.user_id] = formatUserInfo(user, uinfos[user.user_id]);
  }
  var rooms_new = {};
  var write_ats = {};
  for (i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    rooms_new[room._id] = formatRoomData(room, users_new, me);
    write_ats[room._id] = new Date();
  }
  for (var user_id in uinfos) {
    const uinfo = uinfos[user_id];
    if (uinfo.typing_at)
      rooms_new[uinfo.typing_at].typings.push(Number(user_id));
  }

  return { users: users_new, rooms: rooms_new, me, write_ats };
}

function date2str(x, y) {
  var z = {
      M: x.getMonth() + 1,
      d: x.getDate(),
      h: x.getHours(),
      m: x.getMinutes(),
      s: x.getSeconds()
  };
  y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
      return ((v.length > 1 ? "0" : "") + z[v.slice(-1)]).slice(-2)
  });

  return y.replace(/(y+)/g, function(v) {
      return x.getFullYear().toString().slice(-v.length)
  });
}

function calculateUnreadMessages(room, user_id) {
  const my_member = room.members[user_id];
  if (!my_member.read_at)
    return -1;
  const messages = room.messages;
  let count = 0;
  for (var i = messages.length - 1; i >= 0 ; i--) {
    if (messages[i].from !== user_id && messages[i].time >= my_member.read_at) {
      count++
      if (count > 9)
        return count;
    }
  }
  return count;
}

function addTyping(room, user_id) {
  const typings = room.typings;
  if (typings === null || typings === undefined || typings.length === 0) {
    room.typings = [user_id];
    return;
  }
  if (!typings.includes(user_id))
    room.typings.push(user_id);
}

function removeTyping(room, user_id) {
  const typings = room.typings;
  if (typings === null || typings === undefined || typings.length === 0)
    return;
  let index = typings.indexOf(user_id);
  if (index >= 0)
    room.typings.splice(index, 1);
}

function getDownloadLink(path, name) {
  const user = getLoggedInUser();
  var link = config.API_URL + path;
  if (name) link += "?name=" + name;
  if (user && user.token) link += "&guid=" + user.token;
  return link;
}

export default {
  // connectSocket,
  // disconnectSocket,
  // testConnection,
  
  formatRoomData,
  formatChatData,
  formatUserInfo,
  formatMessages,
  date2str,
  calculateUnreadMessages,
  addTyping,
  removeTyping,
  getDownloadLink
};