import React, { Component } from 'react';

//Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/";

import { connect } from "react-redux";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = { }
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
    return { users };
};

export default connect(mapStateToProps, {  })(Index);