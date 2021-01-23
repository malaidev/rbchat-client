import React, { Component } from 'react';

//Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/";

import { connect } from "react-redux";

import {updateAll} from '../../redux/actions';
import api from '../../apis';
import engine from '../../utils/engine'

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = { }
  }

  componentDidMount() {

    api.getAllData()
      .then(res => {
        console.log(res);
        const chatdata = engine.formatChatData(res);
        console.log(chatdata);
        this.props.updateAll(chatdata);
      })
  }
    
  render() {
        
    return (
      <React.Fragment>
        {/* chat left sidebar */}
        <ChatLeftSidebar chatdata={this.props.chatdata} recentChatList={this.props.messages} />

        {/* user chat */}
        <UserChat chatdata={this.props.chatdata} recentChatList={this.props.messages} />
                
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { rooms, users, messages } = state.Chat;
  const { user } = state.Auth;
  return { chatdata: {rooms, users}, messages, user };
};

export default connect(mapStateToProps, {updateAll})(Index);