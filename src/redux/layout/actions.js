import {
	SET_ACTIVE_TAB,
	OPEN_USER_PROFILE_SIDEBAR,
	CLOSE_USER_PROFILE_SIDEBAR,
	SET_CONVERSATION_NAME_IN_OPEN_CHAT,
  OPEN_GLOBAL_MODAL,
  CLOSE_GLOBAL_MODAL,
  INIT_LAYOUT
} from "./constants";

export const setActiveTab = (tabId) => ({
	type: SET_ACTIVE_TAB,
	payload: tabId
});

export const openUserSidebar = () => ({
	type: OPEN_USER_PROFILE_SIDEBAR
});

export const closeUserSidebar = () => ({
	type: CLOSE_USER_PROFILE_SIDEBAR
});

export const setconversationNameInOpenChat = (conversationName) => ({
	type: SET_CONVERSATION_NAME_IN_OPEN_CHAT,
	payload: conversationName
});

export const openGlobalModal = (body) => ({
	type: OPEN_GLOBAL_MODAL,
  payload: body
});

export const closeGlobalModal = () => ({
	type: CLOSE_GLOBAL_MODAL
});

export const initLayout = () => ({
	type: INIT_LAYOUT
});