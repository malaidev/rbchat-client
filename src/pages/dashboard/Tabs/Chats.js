import React, { Component } from 'react';
import { Input, InputGroupAddon, InputGroup, Media, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

//simplebar
import SimpleBar from "simplebar-react";

//actions
import { setconversationNameInOpenChat, setActiveRoom } from "../../../redux/actions"

class Chats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchChat : "",
      rooms: props.chatdata.rooms
    }
    this.handleChange = this.handleChange.bind(this);
    this.openRoom = this.openRoom.bind(this);
  }

  componentDidMount() {
    var li = document.getElementById("room" + this.props.active_room);
    if(li){
      li.classList.add("active");
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        rooms : this.props.chatdata.rooms
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.chatdata.rooms !== nextProps.chatdata.rooms) {
      this.setState({
        rooms: nextProps.chatdata.rooms,
      });
    }
  }

  handleChange(e)  {
    this.setState({ searchChat : e.target.value });
    var search = e.target.value.toLowerCase();
    let rooms = this.state.rooms;
    let filteredArray = [];
        
    //find room name from array
    for (let i = 0; i < rooms.length; i++) {
      if(rooms[i].name.toLowerCase().includes(search))
        filteredArray.push(rooms[i]);
    }

    //set filtered items to state
    this.setState({ rooms : filteredArray })

    //if input value is blanck then assign whole recent chatlist to array
    if(search === "") this.setState({ rooms : this.props.chatdata.rooms })
  }

  openRoom(e, room) {

    e.preventDefault();

    //find index of current room in array
    var index = this.props.chatdata.rooms.indexOf(room);

    // set activeRoom 
    this.props.setActiveRoom(index);

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

    //removes unread badge if user clicks
    var unread = document.getElementById("unRead" + room.room_id);
    if(unread) {
      unread.style.display="none";
    }
  }
    
  render() {
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
                <Input type="text" value={this.state.searchChat} onChange={(e) => this.handleChange(e)} className="form-control bg-light" placeholder="Search messages or users" />
              </InputGroup> 
            </div>
            {/* Search Box */}
          </div> 

          {/* Start chat-message-list  */}
          <div className="px-2">
            <h5 className="mb-3 px-3 font-size-16">Recent</h5>
            <SimpleBar style={{ maxHeight: "100%" }} className="chat-message-list">
              <ul className="list-unstyled chat-list chat-user-list" id="chat-list">
                {
                  this.state.rooms.map((room, key) =>
                    <li key={key} id={"room" + key} className={room.unRead ? "unread" : room.isTyping ?  "typing" : key === this.props.active_room ? "active" : ""}>
                      <Link to="#" onClick={(e) => this.openRoom(e, room)}>
                        <Media>
                          {
                            room.profilePicture ?
                              <div className={"chat-user-img " + room.status +" align-self-center mr-3"}>
                                <img src={room.profilePicture} className="rounded-circle avatar-xs" alt="chatvia" />
                                {
                                  room.status &&  <span className="user-status"></span>
                                }
                              </div>
                            :
                              <div className={"chat-user-img " + room.status +" align-self-center mr-3"}>
                                <div className="avatar-xs">
                                  <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                    {room.room_name.charAt(0)}
                                  </span>
                                </div>
                                {
                                  room.status &&  <span className="user-status"></span>
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
                                    room.messages && (room.messages.length > 0 && room.messages[(room.messages).length - 1].isImageMessage === true) ? <i className="ri-image-fill align-middle mr-1"></i> : null
                                  }
                                  {
                                    room.messages && (room.messages.length > 0  && room.messages[(room.messages).length - 1].isFileMessage === true) ? <i className="ri-file-text-fill align-middle mr-1"></i> : null
                                  }
                                  {room.messages && room.messages.length > 0 ?  room.messages[(room.messages).length - 1].content : null}
                                                                    </>
                              }                         
                            </p>
                          </Media>
                          <div className="font-size-11">{room.messages && room.messages.length > 0 ?  room.messages[(room.messages).length - 1].time : null}</div>
                          {room.unRead === 0 ? null :
                            <div className="unread-message" id={"unRead" + room.room_id}>
                              <span className="badge badge-soft-danger badge-pill">{room.messages && room.messages.length > 0 ? room.unRead >= 20 ? room.unRead + "+" : room.unRead  : ""}</span>
                            </div>
                          } 
                        </Media>
                      </Link>
                    </li>
                  )
                }
              </ul>
              </SimpleBar>
                                
          </div>
          {/* End chat-message-list */}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { active_room } = state.Chat;
  return { active_room };
};

export default connect(mapStateToProps, { setconversationNameInOpenChat, setActiveRoom })(Chats);