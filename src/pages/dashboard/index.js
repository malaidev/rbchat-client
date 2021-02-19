import React, { Component } from 'react';

//Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/";

import { connect } from "react-redux";

import {updateAll, updateRooms, updateUsers, updateWriteAts} from '../../redux/actions';
import api from '../../apis';
import engine from '../../utils/engine'

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = { }
  }

  componentDidMount() {

    if (this.props.user && this.props.user.token)
      api.connectSocket(this.props.user.token);

    // Test socket connection
    setTimeout(() => {
      api.testConnection()
        .then(() => console.log("Connection is okay."))
        .catch(() => console.log("Connection is bad."));
    }, 3000);

    api.getAllData()
      .then(res => {
        console.log("Raw Data", res);
        const chatdata = engine.formatChatData(res);
        console.log("Formatted Data", chatdata);
        this.props.updateAll(chatdata);
      })
      .catch(console.log);

    api.onNewMessage((room_id, message) => {
      message.time = new Date(message.time);
      if (message.from !== this.props.chatdata.me.user_id) {
        let newRooms = {...this.props.chatdata.rooms};
        newRooms[room_id].messages.push(message);
        newRooms[room_id].unRead = engine.calculateUnreadMessages(newRooms[room_id], this.props.chatdata.me.user_id);
        this.props.updateRooms(newRooms);
      }
      else {        
        let newWriteAts = {...this.props.write_ats};
        newWriteAts[room_id] = message.time;
        this.props.updateWriteAts(newWriteAts);

        if (message.id) {
          let newRooms = {...this.props.chatdata.rooms};
          let msg = newRooms[room_id].messages.find(msg => msg.id === message.id);
          if (msg) {
            let index = newRooms[room_id].messages.indexOf(msg);
            newRooms[room_id].messages[index] = message;
            this.props.updateRooms(newRooms);
          }
        }
      }
    });
    
    api.onNewRoom((room) => {
      let newData = {...this.props.chatdata};
      if (room.room_type === 1 && room.room_name === "__peer2peer") {
        const peer = room.members.find(member => member.user_id !== this.props.chatdata.me.user_id);
        newData.users[peer.user_id].peer_room = room._id;
      }
      newData.rooms[room._id] = engine.formatRoomData(room, this.props.chatdata.users, this.props.chatdata.me);
      newData.write_ats = {...this.props.write_ats};
      newData.write_ats[room._id] = new Date();
      this.props.updateAll(newData);
    });

    api.onReadAt((room_id, user_id, time) => {
      let newRooms = {...this.props.chatdata.rooms};
      if (!newRooms[room_id])
        return;
      newRooms[room_id].members[user_id].read_at = new Date(time);
      if (user_id === this.props.chatdata.me.user_id)
        newRooms[room_id].unRead = engine.calculateUnreadMessages(newRooms[room_id], user_id);
      this.props.updateRooms(newRooms);
    });

    api.onTyping((user_id, room_id, is_typing) => {
      let newData = {...this.props.chatdata};
      if (!newData.users[user_id] || !newData.rooms[room_id])
        return;
      if (is_typing) {
        newData.users[user_id].typing_at = room_id;
        engine.addTyping(newData.rooms[room_id], user_id);
      }
      else {
        newData.users[user_id].typing_at = null;
        engine.removeTyping(newData.rooms[room_id], user_id);
      }
      this.props.updateAll(newData);
    });

    api.onUinfo((user_id, uinfo) => {
      let newUsers = {...this.props.chatdata.users};
      if (!newUsers[user_id])
        return;
      
      newUsers[user_id] = engine.formatUserInfo(newUsers[user_id], uinfo);
      this.props.updateUsers(newUsers);
    });

    api.onMoreMessages((room_id, messages) => {
      let newRooms = {...this.props.chatdata.rooms};
      let room = newRooms[room_id];
      if (!room)
        return;
      var real_count = messages.length;
      if (room.messages.length > 0) {
        const last_id = room.messages[0]._id;
        const last = messages.find(message => message._id === last_id);
        if (last)
          real_count = messages.indexOf(last);
      }
      if (real_count > 0) {
        let newMessages = engine.formatMessages(messages.slice(0, real_count));
        room.messages = [...newMessages, ...room.messages];
      }
      this.props.updateRooms(newRooms);
    });
  }
    
  render() {
        
    return (
      <React.Fragment>
        {/* chat left sidebar */}
        <ChatLeftSidebar chatdata={this.props.chatdata} />

        {/* user chat */}
        <UserChat chatdata={this.props.chatdata} />
                
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { rooms, users, me, write_ats } = state.Chat;
  const { user } = state.Auth;
  return { chatdata: {rooms, users, me }, write_ats, user };
};

export default connect(mapStateToProps, {updateAll, updateRooms, updateUsers, updateWriteAts})(Index);