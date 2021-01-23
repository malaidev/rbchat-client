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

export const setActiveRoom = (userId) => ({
  type: types.ACTIVE_ROOM,
  payload : userId
});
