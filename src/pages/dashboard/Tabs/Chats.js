import React, { useState, useEffect } from 'react';
import { Input, InputGroupAddon, InputGroup, Media, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

//simplebar
import SimpleBar from "simplebar-react";
import engine from "../../../utils/engine";

//actions
import { setActiveRoom } from "../../../redux/actions"

const Chats = (props) => {

  const [searchChat, setSearchChat] = useState("");
  const [rooms, setRooms] = useState(props.chatdata.rooms);

  useEffect(() => {
    setRooms(props.chatdata.rooms);
  }, [props.chatdata.rooms]);

  useEffect(() => {
    if (props.active_room && !props.active_room.toString().includes("virtual")) {
      var userChat = document.getElementsByClassName("user-chat");
      if(userChat) {
        userChat[0].classList.add("user-chat-show");
      }
    }
  }, [props.active_room])

  const handleChange = (e) => {
    setSearchChat(e.target.value);
    var search = e.target.value.toLowerCase().trim();
    
    //if input value is blanck then assign whole recent chatlist to array
    if(search === "") {
      setRooms(props.chatdata.rooms);
      return;
    } 

    let rooms = props.chatdata.rooms;
    let filteredRooms = {};
        
    //find room name from array
    for (let i in rooms) {
      if(rooms[i].room_name.toLowerCase().includes(search))
        filteredRooms[i] = rooms[i];
    }

    //set filtered items to state
    setRooms(filteredRooms);
  }

  const openRoom = (e, room) => {

    e.preventDefault();

    //find index of current room in array
    // var index = props.chatdata.rooms.indexOf(room);

    // set activeRoom 
    props.setActiveRoom(room._id);

    var chatList = document.getElementById("chat-list");
    var clickedItem = e.target;
    var currentli = null;

    if(chatList) {
      var li = chatList.getElementsByTagName("li");
      //remove coversation user
      for(var i=0; i<li.length; ++i){
        if(li[i].classList.contains('active')){
          li[i].classList.remove('active');
        }
      }
      //find clicked coversation user
      for(var k=0; k<li.length; ++k){
        if(li[k].contains(clickedItem)) {
          currentli = li[k];
          break;
        } 
      }
    }

    //activation of clicked coversation user
    if(currentli) {
      currentli.classList.add('active');
    }

    var userChat = document.getElementsByClassName("user-chat");
    if(userChat) {
      userChat[0].classList.add("user-chat-show");
    }

  }
    
  const {users, me} = props.chatdata;
  return (
    <React.Fragment>
      <div>
        <div className="px-4 pt-4">
          <h4 className="mb-4">Chats</h4>
          <div className="search-box chat-search-box">
            <InputGroup size="lg" className="mb-3 bg-light rounded-lg">
              <InputGroupAddon addonType="prepend">
                <Button color="link" className="text-muted pr-1 text-decoration-none" type="button">
                  <i className="ri-search-line search-icon font-size-18"></i>
                </Button>
              </InputGroupAddon>
              <Input type="text" value={searchChat} onChange={(e) => handleChange(e)} className="form-control bg-light" placeholder="Search users..." />
            </InputGroup> 
          </div>
          {/* Search Box */}
        </div> 

        {/* Start chat-message-list  */}
        <div className="px-2">
          <h5 className="mb-3 px-3 font-size-16">Recent</h5>
          {
          Object.entries(rooms).length > 0?
          <SimpleBar style={{ maxHeight: "100%" }} className="chat-message-list">
            <ul className="list-unstyled chat-list chat-user-list" id="chat-list">
              {
                Object.entries(rooms).map(([key, room]) => {
                  const messages = room.messages;
                  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : {};
                  const lastTime = lastMessage.time?lastMessage.time:room.updatedAt;
                  const time_str = engine.date2str(lastTime, "MM/dd hh:mm");
                  let unReadStr = room.unRead>0?(room.unRead>9?'9+':room.unRead):(room.unRead<0?'New':null);
                  let className = "";
                  if (room.unRead) className += "unread ";
                  if (room.isTyping) className += "typing ";
                  if (key === props.active_room) className += "active ";
                  let status = null;
                  if (room.room_type === 1 && room.peer_id !== null && room.peer_id !== undefined)
                    status = users[room.peer_id].status;
                  return (
                  <li key={key} id={"room" + key} className={className}>
                    <Link to="#" onClick={(e) => openRoom(e, room)}>
                      <Media>
                        {
                          room.avatar_url ?
                            <div className={"chat-user-img " + status +" align-self-center mr-3"}>
                              <img src={room.avatar_url} className="rounded-circle avatar-xs" alt="chatvia" />
                              {
                                status && <span className="user-status"></span>
                              }
                            </div>
                          :
                            <div className={"chat-user-img " + status +" align-self-center mr-3"}>
                              <div className="avatar-xs">
                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                  {room.room_name.charAt(0)}
                                </span>
                              </div>
                              {
                                status &&  <span className="user-status"></span>
                              }
                            </div>
                        }
                        <Media body className="overflow-hidden">
                          <h5 className="text-truncate font-size-15 mb-1">{room.room_name}</h5>
                          <p className="chat-user-message text-truncate mb-0">
                            {
                              room.isTyping ?
                              <>
                                typing<span className="animate-typing">
                                <span className="dot ml-1"></span>
                                <span className="dot ml-1"></span>
                                <span className="dot ml-1"></span>
                              </span>
                              </>
                              :
                              <>
                                {
                                  (lastMessage.type === 2) ? <i className="ri-image-fill align-middle mr-1"></i> : null
                                }
                                {
                                  (lastMessage.type === 3) ? <i className="ri-file-text-fill align-middle mr-1"></i> : null
                                }
                                { (lastMessage.from === me.user_id?"You: ":(room.room_type===1?"":users[lastMessage.from].user_name+": ")) }
                                { lastMessage.content }
                              </>
                            }                         
                          </p>
                        </Media>
                        <div className="font-size-11">{time_str}</div>
                        {unReadStr ?
                          <div className="unread-message" id={"unRead" + key}>
                            <span className="badge badge-info badge-pill">{unReadStr}</span>
                          </div>
                          :null
                        } 
                      </Media>
                    </Link>
                  </li>
                  );
                })
              }
            </ul>
            </SimpleBar>
          :
          <span className="px-3">No recent chat</span>
          }
                              
        </div>
        {/* End chat-message-list */}
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  const { active_room } = state.Chat;
  return { active_room };
};

export default connect(mapStateToProps, { setActiveRoom })(Chats);