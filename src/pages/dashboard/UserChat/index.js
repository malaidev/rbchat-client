import React, { useState, useEffect, useRef } from 'react';
import { DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown, Modal, ModalHeader, ModalBody, CardBody, Button, ModalFooter } from "reactstrap";
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

//actions
import { openUserSidebar, updateRooms } from "../../../redux/actions";

//Import Images
import avatar4 from "../../../assets/images/users/avatar-4.jpg";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

//i18n
import { useTranslation } from 'react-i18next';

function UserChat(props) {

  const ref = useRef();

  const [modal, setModal] = useState(false);

  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();

  const { rooms, users, me } = props.chatdata;
  
  const isValid = (rooms.length > 0 && props.active_room >= 0 && props.active_room < rooms.length);
  //demo conversation messages
  //userType must be required
  const [allRooms] = useState(rooms);
  const [chatMessages, setChatMessages] = useState(isValid?rooms[props.active_room].messages:[]);


  useEffect(() => {
    setChatMessages(isValid?rooms[props.active_room].messages:[]);
    if (ref.current) {
      ref.current.recalculate();
      if (ref.current.el) {
        ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
      }
    }
  }, [props.active_room, props.chatdata]);

  const toggle = () => setModal(!modal);

  const addMessage = (message, type) => {
    var messageObj = null;

    let d = new Date();
    var n = d.getSeconds();

    //matches the message type is text, file or image, and create object according to it
    switch (type) {
      case "textMessage":
        messageObj = {
          id: chatMessages.length + 1,
          message: message,
          time: "00:" + n,
          userType: "sender",
          image: avatar4,
          isFileMessage: false,
          isImageMessage: false
        }
        break;

      case "fileMessage":
        messageObj = {
          id: chatMessages.length + 1,
          message: 'file',
          fileMessage: message.name,
          size: message.size,
          time: "00:" + n,
          userType: "sender",
          image: avatar4,
          isFileMessage: true,
          isImageMessage: false
        }
        break;

      case "imageMessage":
        var imageMessage = [
          { image: message },
        ]

        messageObj = {
          id: chatMessages.length + 1,
          message: 'image',
          imageMessage: imageMessage,
          size: message.size,
          time: "00:" + n,
          userType: "sender",
          image: avatar4,
          isImageMessage: true,
          isFileMessage: false
        }
        break;

      default:
        break;
    }

    //add message object to chat        
    setChatMessages([...chatMessages, messageObj]);

    let newRooms = [...allRooms];
    newRooms[props.active_room].messages = [...chatMessages, messageObj];
    newRooms[props.active_room].isTyping = false;
    props.updateRooms(newRooms);

    scrolltoBottom();
  }

  function scrolltoBottom() {
    if (ref.current.el) {
      ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
    }
  }

  const deleteMessage = (id) => {
    let messages = chatMessages;

    var filtered = messages.filter(function (item) {
      return item.id !== id;
    });

    setChatMessages(filtered);
  }

  if (!isValid)
    return (
      <React.Fragment>
        <div className="user-chat w-100">
        </div>
      </React.Fragment>
    );
  else
  return (
    <React.Fragment>
      <div className="user-chat w-100">

        <div className="d-lg-flex">

          <div className={props.userSidebar ? "w-70" : "w-100"}>

            {/* render user head */}
            <UserHead />

            <SimpleBar
              style={{ maxHeight: "100%" }}
              ref={ref}
              className="chat-conversation p-3 p-lg-4"
              id="messages">
              <ul className="list-unstyled mb-0">
                {
                  chatMessages.map((message, key) =>
                    message.isToday && message.isToday === true ? <li key={"dayTitle" + key}>
                      <div className="chat-day-title">
                        <span className="title">Today</span>
                      </div>
                    </li> :
                      (rooms[props.active_room].isGroup === true) ?
                        <li key={key} className={message.userType === "sender" ? "right" : ""}>
                          <div className="conversation-list">
                            
                            <div className="chat-avatar">
                              {message.userType === "sender" ? <img src={avatar1} alt="chatvia" /> :
                                rooms[props.active_room].profilePicture === "Null" ?
                                  <div className="chat-user-img align-self-center mr-3">
                                    <div className="avatar-xs">
                                      <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                        {message.userName && message.userName.charAt(0)}
                                      </span>
                                    </div>
                                  </div>
                                  : <img src={rooms[props.active_room].profilePicture} alt="chatvia" />
                              }
                            </div>

                            <div className="user-chat-content">
                              <div className="ctext-wrap">
                                <div className="ctext-wrap-content">
                                  {
                                    message.message &&
                                    <p className="mb-0">
                                      {message.message}
                                    </p>
                                  }
                                  {
                                    message.imageMessage &&
                                    // image list component
                                    <ImageList images={message.imageMessage} />
                                  }
                                  {
                                    message.fileMessage &&
                                    //file input component
                                    <FileList fileName={message.fileMessage} fileSize={message.size} />
                                  }
                                  {
                                    message.isTyping &&
                                    <p className="mb-0">
                                      typing
                                      <span className="animate-typing">
                                        <span className="dot ml-1"></span>
                                        <span className="dot ml-1"></span>
                                        <span className="dot ml-1"></span>
                                      </span>
                                    </p>
                                  }
                                  {
                                    !message.isTyping && <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">{message.time}</span></p>
                                  }
                                </div>
                                {
                                  !message.isTyping &&
                                  <UncontrolledDropdown className="align-self-start">
                                    <DropdownToggle tag="a">
                                      <i className="ri-more-2-fill"></i>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                      <DropdownItem>{t('Copy')} <i className="ri-file-copy-line float-right text-muted"></i></DropdownItem>
                                      <DropdownItem>{t('Save')} <i className="ri-save-line float-right text-muted"></i></DropdownItem>
                                      <DropdownItem onClick={toggle}>Forward <i className="ri-chat-forward-line float-right text-muted"></i></DropdownItem>
                                      <DropdownItem onClick={() => deleteMessage(message.id)}>Delete <i className="ri-delete-bin-line float-right text-muted"></i></DropdownItem>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                }

                              </div>
                              {
                                <div className="conversation-name">{message.userType === "sender" ? "Patricia Smith" : message.userName}</div>
                              }
                            </div>
                          </div>
                        </li>
                        :
                        <li key={key} className={message.userType === "sender" ? "right" : ""}>
                          <div className="conversation-list">
                            {
                              //logic for display user name and profile only once, if current and last messaged sent by same receiver
                              chatMessages[key + 1] ? chatMessages[key].userType === chatMessages[key + 1].userType ?

                                <div className="chat-avatar">
                                  <div className="blank-div"></div>
                                </div>
                                :
                                <div className="chat-avatar">
                                  {message.userType === "sender" ? <img src={avatar1} alt="chatvia" /> :
                                    rooms[props.active_room].profilePicture === "Null" ?
                                      <div className="chat-user-img align-self-center mr-3">
                                        <div className="avatar-xs">
                                          <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                            {rooms[props.active_room].name.charAt(0)}
                                          </span>
                                        </div>
                                      </div>
                                      : <img src={rooms[props.active_room].profilePicture} alt="chatvia" />
                                  }
                                </div>
                                : <div className="chat-avatar">
                                  {message.userType === "sender" ? <img src={avatar1} alt="chatvia" /> :
                                    rooms[props.active_room].profilePicture === "Null" ?
                                      <div className="chat-user-img align-self-center mr-3">
                                        <div className="avatar-xs">
                                          <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                            {rooms[props.active_room].name.charAt(0)}
                                          </span>
                                        </div>
                                      </div>
                                      : <img src={rooms[props.active_room].profilePicture} alt="chatvia" />
                                  }
                                </div>
                            }


                            <div className="user-chat-content">
                              <div className="ctext-wrap">
                                <div className="ctext-wrap-content">
                                  {
                                    message.message &&
                                    <p className="mb-0">
                                      {message.message}
                                    </p>
                                  }
                                  {
                                    message.imageMessage &&
                                    // image list component
                                    <ImageList images={message.imageMessage} />
                                  }
                                  {
                                    message.fileMessage &&
                                    //file input component
                                    <FileList fileName={message.fileMessage} fileSize={message.size} />
                                  }
                                  {
                                    message.isTyping &&
                                    <p className="mb-0">
                                      typing
                                      <span className="animate-typing">
                                        <span className="dot ml-1"></span>
                                        <span className="dot ml-1"></span>
                                        <span className="dot ml-1"></span>
                                      </span>
                                    </p>
                                  }
                                  {
                                    !message.isTyping && <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">{message.time}</span></p>
                                  }
                                </div>
                                {
                                  !message.isTyping &&
                                  <UncontrolledDropdown className="align-self-start">
                                    <DropdownToggle tag="a">
                                      <i className="ri-more-2-fill"></i>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                      <DropdownItem>{t('Copy')} <i className="ri-file-copy-line float-right text-muted"></i></DropdownItem>
                                      <DropdownItem>{t('Save')} <i className="ri-save-line float-right text-muted"></i></DropdownItem>
                                      <DropdownItem onClick={toggle}>Forward <i className="ri-chat-forward-line float-right text-muted"></i></DropdownItem>
                                      <DropdownItem onClick={() => deleteMessage(message.id)}>Delete <i className="ri-delete-bin-line float-right text-muted"></i></DropdownItem>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                }

                              </div>
                              {
                                chatMessages[key + 1] ? chatMessages[key].userType === chatMessages[key + 1].userType ? null : <div className="conversation-name">{message.userType === "sender" ? "Patricia Smith" : rooms[props.active_room].name}</div> : <div className="conversation-name">{message.userType === "sender" ? "Admin" : rooms[props.active_room].name}</div>
                              }
                              {/* {
                              <div className="conversation-name">{message.userType === "sender" ? "Admin" : rooms[props.active_room].name}</div>
                              } */}

                            </div>
                          </div>
                        </li>
                  )
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

            <ChatInput onaddMessage={addMessage} />
          </div>

          <UserProfileSidebar activeRoom={rooms[props.active_room]} />

        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  const { active_room } = state.Chat;
  const { userSidebar } = state.Layout;
  return { active_room, userSidebar };
};

export default withRouter(connect(mapStateToProps, { openUserSidebar, updateRooms })(UserChat));

