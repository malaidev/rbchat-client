import * as types from './constants';

export const chatUser = () => ({
  type: types.CHAT_USER
});

export const addLoggedinUser = (userData) => ({
  type: types.ADD_LOGGED_USER,
  payload : userData
});

export const createGroup = (groupData) => ({
  type : types.CREATE_GROUP,
  payload : groupData
})

export const updateAll = (chatdata) => ({
  type : types.UPDATE_ALL,
  payload : chatdata
})

export const updateRooms = (rooms) => ({
  type: types.UPDATE_ROOMS,
  payload : rooms
});

export const updateUsers = (users) => ({
  type: types.UPDATE_USERS,
  payload : users
});

export const setActiveRoom = (user_id) => ({
  type: types.ACTIVE_ROOM,
  payload : user_id
});

export const updateWriteAts = (write_ats) => ({
  type: types.UPDATE_WRITE_ATS,
  payload : write_ats
});

export const initChat = () => ({
  type: types.INIT_CHAT
});