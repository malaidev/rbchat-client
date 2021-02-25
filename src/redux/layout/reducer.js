// @flow
import {
	SET_ACTIVE_TAB,
	OPEN_USER_PROFILE_SIDEBAR,
	CLOSE_USER_PROFILE_SIDEBAR,
	SET_CONVERSATION_NAME_IN_OPEN_CHAT,
  OPEN_GLOBAL_MODAL,
  CLOSE_GLOBAL_MODAL,
  INIT_LAYOUT
} from "./constants";

const INIT_STATE = {
	activeTab : "chat",
	userSidebar : false,
	conversationName : "Doris Brown",
  global_modal_body: ""
};

const Layout = (state = INIT_STATE, action) => {
	switch (action.type) {
		case SET_ACTIVE_TAB:
			return {
				...state,
				activeTab: action.payload
			};

		case OPEN_USER_PROFILE_SIDEBAR:
			return {
				...state,
				userSidebar: true
			};

		case CLOSE_USER_PROFILE_SIDEBAR:
			return {
				...state,
				userSidebar: false
			};

		case SET_CONVERSATION_NAME_IN_OPEN_CHAT:
			return {
				...state,
				conversationName: action.payload
			};
      
		case OPEN_GLOBAL_MODAL:
			return {
				...state,
				global_modal_body: action.payload
			};

    case CLOSE_GLOBAL_MODAL:
      return {
        ...state,
        global_modal_body: ""
      };

    case INIT_LAYOUT:
      return INIT_STATE;

		default:
			return state;
	}
};

export default Layout;
