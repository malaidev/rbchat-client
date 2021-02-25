import * as types from './constants';

const INIT_STATE = {
  messages: [],
  groups : [],
  contacts : [],

  // on data
  rooms: [],
  users: [],
  me: {},
  
  // off data
	active_room : "",
  write_ats: {}

};

const Chat = (state = INIT_STATE, action) => {
  switch (action.type) {
    case types.CHAT_USER:
      return { ...state };
        
    case types.ADD_LOGGED_USER:
      const newUser =  action.payload
      return{
        ...state, messages : [
          ...state.messages, newUser
        ]
      };

    case types.CREATE_GROUP :
      const newGroup =  action.payload
      return {
        ...state, groups : [
          ...state.groups, newGroup
        ]
      };
      
    case types.UPDATE_ALL :
      const chatdata =  action.payload;

      return {
        ...state, 
        ...chatdata
      };      
      
    case types.UPDATE_ROOMS:
      return { 
            	...state,
        rooms : action.payload };

    case types.UPDATE_USERS:
      return { 
              ...state,
        users : action.payload };
    
    case types.ACTIVE_ROOM:
      return { 
              ...state,
        active_room : action.payload };
    
    case types.UPDATE_WRITE_ATS:
      return { 
              ...state,
        write_ats : action.payload };

    case types.INIT_CHAT:
      return INIT_STATE;
        
    default: return { ...state };
  }
}

export default Chat;