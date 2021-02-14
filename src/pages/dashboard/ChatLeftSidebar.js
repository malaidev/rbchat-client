import React from 'react';
import { connect } from "react-redux";

import { TabContent, TabPane } from "reactstrap";

//Import Components
import Profile from "./Tabs/Profile";
import Chats from "./Tabs/Chats";
import Groups from "./Tabs/Groups";
import Contacts from "./Tabs/Contacts";
import Settings from "./Tabs/Settings";

function ChatLeftSidebar(props) {

  const activeTab = props.activeTab;
  return (
    <React.Fragment>
      <div className="chat-leftsidebar mr-lg-1">

        <TabContent activeTab={activeTab}>
          {/* Start Profile tab-pane */}
          <TabPane tabId="profile" id="pills-user">
            {/* profile content  */}
            <Profile me={props.chatdata.me}/>
          </TabPane>
                   {/* End Profile tab-pane  */}

          {/* Start chats tab-pane  */}
          <TabPane tabId="chat" id="pills-chat">
            {/* chats content */}
            <Chats chatdata={props.chatdata}/>
          </TabPane>
          {/* End chats tab-pane */}
                    
          {/* Start groups tab-pane */}
          <TabPane tabId="group" id="pills-groups">
            {/* Groups content */}
            <Groups />
          </TabPane>
          {/* End groups tab-pane */}

          {/* Start contacts tab-pane */}
          <TabPane tabId="contacts" id="pills-contacts">
            {/* Contact content */}
            <Contacts chatdata={props.chatdata}/>
          </TabPane>
          {/* End contacts tab-pane */}
                    
          {/* Start settings tab-pane */}
          <TabPane tabId="settings" id="pills-setting">
            {/* Settings content */}
            <Settings />
          </TabPane>
          {/* End settings tab-pane */}
        </TabContent>
        {/* end tab content */}

        </div>
    </React.Fragment>
  );
}

const mapStateToProps = state => {
  return {
      ...state.Layout
  };
};

export default connect(mapStateToProps, null)(ChatLeftSidebar);