import React, { Component } from 'react';

//Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/";

import { connect } from "react-redux";

import socketClient from 'socket.io-client';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = { }
    }

    async componentDidMount() {
      var socket = await socketClient("http://localhost:8080");
      console.log(socket);
      socket.emit('login', "asdfassd");
    }

    render() {
        
        return (
            <React.Fragment>
                {/* chat left sidebar */}
                <ChatLeftSidebar recentChatList={this.props.users} />

                {/* user chat */}
                <UserChat recentChatList={this.props.users} />
                
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const { users } = state.Chat;
    const { user } = state.Auth;
    return { users, user };
};

export default connect(mapStateToProps, {  })(Index);