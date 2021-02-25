import React, { useState, useEffect, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, CardBody, Button, ModalFooter, /*DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown*/ } from "reactstrap";
import { connect } from "react-redux";
import ScrollView from "react-inverted-scrollview";
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
import 'simplebar/dist/simplebar.min.css';
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
      api.updateReadAt(props.active_room);
  }, [props.active_room, isValid])

  const toggle = () => setModal(!modal);

  const addMessage = (data, type) => {
    var messageObj = null;

    //matches the message type is text, file or image, and create object according to it
    switch (type) {
      case "textMessage":
        messageObj = {
          content: data,
          type: 1
        }
        break;

      case "fileMessage":
        messageObj = {
          content: data.name,
          size: data.size,
          type: 2
        }
        break;

      case "imageMessage":
        messageObj = {
          content: data.name,
          size: data.size,
          type: 3
        }
        break;

      default:
        break;
    }
    messageObj.id = "tmp" + Date.now();
    messageObj.from = me.user_id;
    messageObj.time = new Date();

    const newRooms = {...rooms};
    newRooms[props.active_room].messages.push({...messageObj, status: "Uploading..."});
    props.updateRooms(newRooms);

    if (type === "textMessage") {
      api.addNewMessage(props.active_room, messageObj);
      api.updateReadAt(props.active_room);
    }
    else if (type === "fileMessage") {
      api.uploadFile(data, messageObj)
        .then(res => {
          if (res.success) {
            if (data.type && data.type.startsWith("image/"))
              messageObj.type = 3;
            const newObj = {
              ...messageObj,
              path: res.path,
            };
            messageObj.status = "";
            api.addNewMessage(props.active_room, newObj);
            api.updateReadAt(props.active_room);
          }
          else {
            messageObj.status = res.message;
            messageObj.error = true;
          }
        })
        .catch(error => {
          console.log(error);
          messageObj.status = "Upload Failed";
          messageObj.error = true;
        });
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
      api.updateReadAt(props.active_room);
  }

  const updateTyping = () => {
    if (isValid) {
      api.updateTyping(props.active_room);
    }
  }

  const onScroll = (info) => {
    if (info.scrollTop === 0) {
      api.getMoreMessages(rooms[props.active_room]);
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
                {/* <SimpleBar
                  style={{ maxHeight: "100%" }}
                  ref={ref}
                  onWheel={onWheel}
                  className="chat-conversation p-3 p-lg-4"
                  id="messages"> */}
                <ScrollView
                  ref={ref}
                  width={'100%'}
                  className="chat-conversation p-3 p-lg-4"
                  onScroll={onScroll}
                >
                  <ul className="list-unstyled mb-0">
                    {
                      chatMessages.map((message, index) => {
                        const cuser = users[message.from];
                        const isMe = (message.from === me.user_id);
                        const time_str = engine.date2str(message.time, "MM/dd hh:mm");
                        const isToday = false;
                        const key = message._id?message._id:("msg"+index);
                        
                        return (
                        isToday ? 
                          <li key={"dayTitle" + index}>
                            <div className="chat-day-title">
                              <span className="title">Today</span>
                            </div>
                          </li> :
                          <li key={key} className={isMe ? "right" : ""} id={key}>
                            <div className="conversation-list">
                              {
                                isMe?"":
                                //logic for display user name and profile only once, if current and last messaged sent by same receiver
                                chatMessages[index - 1] && chatMessages[index - 1].from === chatMessages[index].from ?

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
                                  (isMe || (chatMessages[index - 1] && chatMessages[index - 1].from === chatMessages[index].from)) ? null : <div className="conversation-name">{cuser.user_name}</div>
                                }
                                <div className="ctext-wrap">
                                  <div className="ctext-wrap-content">
                                    {
                                      message.type === 1 && message.content &&
                                      <p className="mb-0">
                                        {message.content}
                                      </p>
                                    }
                                    {
                                      message.type === 2 &&
                                      //file input component
                                      <FileList file={message}/>
                                    }
                                    {
                                      message.type === 3 &&
                                      // image list component
                                      <ImageList file={message} />
                                    }

                                    <div className="chat-time mb-0">
                                      {
                                        (message.type === 2 || message.type === 3) && message.status &&
                                          <span
                                            className="align-middle" 
                                            style={{
                                              marginRight: 20, 
                                              color: message.error?'#FF5555':'auto'
                                            }}
                                          >
                                            {message.status}
                                          </span>
                                      }
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
                </ScrollView>
                {/* </SimpleBar> */}

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

