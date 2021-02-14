import React, { useState, useEffect, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, CardBody, Button, ModalFooter, /*DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown*/ } from "reactstrap";
import { connect } from "react-redux";

import SimpleBar from "simplebar-react";

import { withRouter } from 'react-router-dom';

//Import Components
import UserProfileSidebar from "../../../components/UserProfileSidebar";
import SelectContact from "../../../components/SelectContact";
import UserHead from "./UserHead";
import ImageList from "./ImageList";
import ChatInput from "./ChatInput";
import FileList from "./FileList";
import TypingView from "./TypingView";

//actions
import { openUserSidebar, updateRooms, setActiveRoom, updateAll, updateWriteAts } from "../../../redux/actions";

import engine from "../../../utils/engine";

import api from '../../../apis';

//i18n
//import { useTranslation } from 'react-i18next';

function UserChat(props) {

  const ref = useRef();

  const [modal, setModal] = useState(false);

  /* intilize t variable for multi language implementation */
  //const { t } = useTranslation();

  const { rooms, users, me } = props.chatdata;

  const isValid = rooms[props.active_room]?true:false;
  const isVirtual = !isValid && props.active_room.toString().includes("virtual");
  var vroom = {};
  var vuser_id = 0;
  if (isVirtual) {
    vuser_id = Number(props.active_room.substring(7));
    vroom = {
      room_name: users[vuser_id].user_name, 
      avatar_url: users[vuser_id].avatar_url,
      isVirtual: true
    };
  }
  //demo conversation messages
  //userType must be required
  const [chatMessages, setChatMessages] = useState(isValid?rooms[props.active_room].messages:[]);
  var maxReadAt = new Date(0);
  var writeAt = isValid&&props.write_ats[props.active_room]?props.write_ats[props.active_room]:new Date(0);
  if (isValid) {
    for (var i in rooms[props.active_room].members) {
      if (Number(i) === me.user_id)
        continue;
      const member = rooms[props.active_room].members[i];
      if (member.read_at && maxReadAt.getTime() < member.read_at.getTime())
        maxReadAt = member.read_at;
    }
  }

  useEffect(() => {
    setChatMessages(isValid?rooms[props.active_room].messages:[]);
  }, [props.active_room, rooms, isValid]);

  useEffect(() => {
    if (isValid)
      api.updateReadAt(props.active_room, new Date());
  }, [props.active_room, isValid])

  useEffect(() => {
    if (ref.current) {
      ref.current.recalculate();
      scrolltoBottom();
    }
  }, [props.active_room, ref.current]);

  useEffect(() => {
    if (ref.current && ref.current.el)
    {
      let offset = ref.current.getScrollElement().scrollHeight - ref.current.getScrollElement().scrollTop;
      if ((offset <= ref.current.el.clientHeight + 200) ||
      (chatMessages[chatMessages.length - 1].from === me.user_id)) {
        scrolltoBottom();
      }
    }
  }, [chatMessages.length]);

  const toggle = () => setModal(!modal);

  const addMessage = (message, type) => {
    var messageObj = null;

    //matches the message type is text, file or image, and create object according to it
    switch (type) {
      case "textMessage":
        messageObj = {
          content: message,
          type: 1,
          time: new Date(),
          from: me.user_id
        }
        break;

      case "fileMessage":
        messageObj = {
          content: 'file',
          fileMessage: message.name,
          fileSize: message.size,
          type: 2,
          time: new Date(),
          from: me.user_id
        }
        break;

      case "imageMessage":
        var imageMessage = [
          { image: message },
        ]

        messageObj = {
          content: 'image',
          imageMessage: imageMessage,
          imageSize: message.size,
          type: 3,
          time: new Date(),
          from: me.user_id
        }
        break;

      default:
        break;
    }

    const newRooms = {...rooms};
    newRooms[props.active_room].messages.push(messageObj);
    //newRooms[props.active_room].isTyping = false;
    props.updateRooms(newRooms);

    //scrolltoBottom();

    api.addNewMessage(props.active_room, messageObj);
    api.updateReadAt(props.active_room, messageObj.time);
  }

  const scrolltoBottom = () => {
    if (ref.current.el) {
      ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
    }
  }

  // const deleteMessage = (id) => {
  //   let messages = chatMessages;

  //   var filtered = messages.filter(function (item) {
  //     return item.id !== id;
  //   });

  //   setChatMessages(filtered);
  // }

  const peerInvite = (vuser_id) => {
    const new_room_for_api = {
      _id: Date.now(),
      room_type: 1,
      room_name: "__peer2peer",
      room_description: "",
      members: [{
        user_id: me.user_id,
        read_at: new Date()
      }, {user_id: vuser_id}],
      messages: [],
    }
    api.addNewRoom(new_room_for_api)
      .then(data => {
        props.setActiveRoom(data.new_room_id);
      })
  }

  const updateReadAt = () => {
    if (isValid)
      api.updateReadAt(props.active_room, new Date());
  }

  const updateTyping = () => {
    if (isValid) {
      new Promise((resolve, reject) => {
        api.updateTyping(props.active_room);
      })
    }
  }

  if (!isValid && !isVirtual)
    return (
      <React.Fragment>
        <div className="user-chat w-100">
        </div>
      </React.Fragment>
    );
  else
  return (
    <React.Fragment>
      <div className="user-chat w-100" onClick={updateReadAt}>

        <div className="d-lg-flex">

          <div className={props.userSidebar ? "w-70" : "w-100"}>

            {/* render user head */}
            <UserHead active_room={isVirtual?vroom:rooms[props.active_room]} chatdata={props.chatdata} />

            {
              isVirtual?
                <div className="peer-invite-pane">
                  <div className="form-box">
                    <div className="desc-box">
                      Click to start a private chat with <span className="peer-name">{vroom.room_name}</span>
                    </div>
                    <div className="button-box">
                      <Button type="button" color="primary" onClick={e => peerInvite(vuser_id)}>Start Chatting</Button>
                    </div>
                  </div>
                </div>
              :<>
                <div className="chat-list-wrapper">
                <SimpleBar
                  style={{ maxHeight: "100%" }}
                  ref={ref}
                  className="chat-conversation p-3 p-lg-4"
                  id="messages">
                  <ul className="list-unstyled mb-0">
                    {
                      chatMessages.map((message, key) => {
                        const cuser = users[message.from];
                        const isMe = (message.from === me.user_id);
                        const time_str = engine.date2str(message.time, "MM/dd hh:mm");
                        const isToday = false;
                        return (
                        isToday ? 
                          <li key={"dayTitle" + key}>
                            <div className="chat-day-title">
                              <span className="title">Today</span>
                            </div>
                          </li> :
                          <li key={key} className={isMe ? "right" : ""}>
                            <div className="conversation-list">
                              {
                                isMe?"":
                                //logic for display user name and profile only once, if current and last messaged sent by same receiver
                                chatMessages[key - 1] && chatMessages[key - 1].from === chatMessages[key].from ?

                                  <div className="chat-avatar">
                                    <div className="blank-div"></div>
                                  </div>
                                  :
                                  <div className="chat-avatar">
                                    {
                                      cuser.avatar_url?
                                        <img src={cuser.avatar_url} alt={cuser.user_name} />:
                                        <div className="chat-user-img align-self-center">
                                          <div className="avatar-xs">
                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                              {cuser.user_name.charAt(0)}
                                            </span>
                                          </div>
                                        </div>
                                    }
                                  </div>
                              }

                              <div className="user-chat-content">
                                {
                                  (isMe || (chatMessages[key - 1] && chatMessages[key - 1].from === chatMessages[key].from)) ? null : <div className="conversation-name">{cuser.user_name}</div>
                                }
                                <div className="ctext-wrap">
                                  <div className="ctext-wrap-content">
                                    {
                                      message.content &&
                                      <p className="mb-0">
                                        {message.content}
                                      </p>
                                    }
                                    {
                                      message.type === 2 &&
                                      // image list component
                                      <ImageList images={message.imageMessage} />
                                    }
                                    {
                                      message.type === 3 &&
                                      //file input component
                                      <FileList fileName={message.fileMessage} fileSize={message.fileSize} />
                                    }

                                    <div className="chat-time mb-0">
                                      <i className="ri-time-line align-middle"></i> <span className="align-middle">{time_str}</span>
                                      {
                                        isMe &&
                                        <div className="msg-check">
                                          <i className={message.time<=maxReadAt?"ri-check-double-line":(message.time<=writeAt?"ri-check-line":null)}></i>
                                        </div>
                                      }
                                    </div>

                                  </div>
                                  {
                                    // <UncontrolledDropdown className="align-self-start">
                                    //   <DropdownToggle tag="a">
                                    //     <i className="ri-more-2-fill"></i>
                                    //   </DropdownToggle>
                                    //   <DropdownMenu>
                                    //     <DropdownItem>{t('Copy')} <i className="ri-file-copy-line float-right text-muted"></i></DropdownItem>
                                    //     <DropdownItem>{t('Save')} <i className="ri-save-line float-right text-muted"></i></DropdownItem>
                                    //     <DropdownItem onClick={toggle}>Forward <i className="ri-chat-forward-line float-right text-muted"></i></DropdownItem>
                                    //     <DropdownItem onClick={() => deleteMessage(message.id)}>Delete <i className="ri-delete-bin-line float-right text-muted"></i></DropdownItem>
                                    //   </DropdownMenu>
                                    // </UncontrolledDropdown>
                                  }

                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })
                    }
                  </ul>
                </SimpleBar>

                <Modal backdrop="static" isOpen={modal} centered toggle={toggle}>
                  <ModalHeader toggle={toggle}>Forward to...</ModalHeader>
                  <ModalBody>
                    <CardBody className="p-2">
                      <SimpleBar style={{ maxHeight: "200px" }}>
                        <SelectContact handleCheck={() => { }} />
                      </SimpleBar>
                      <ModalFooter className="border-0">
                        <Button color="primary">Forward</Button>
                      </ModalFooter>
                    </CardBody>
                  </ModalBody>
                </Modal>
                <TypingView active_room={isVirtual?null:rooms[props.active_room]} chatdata={props.chatdata}  />
                </div>
                <ChatInput onAddMessage={addMessage} onTyping={updateTyping} />
              </>
            }
          </div>

          <UserProfileSidebar activeRoom={isVirtual?vroom:rooms[props.active_room]} />

        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  const { active_room, write_ats } = state.Chat;
  const { userSidebar } = state.Layout;
  return { active_room, write_ats, userSidebar };
};

export default withRouter(connect(mapStateToProps, { openUserSidebar, updateRooms, setActiveRoom, updateAll, updateWriteAts })(UserChat));

