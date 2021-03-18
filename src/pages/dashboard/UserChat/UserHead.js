import React from 'react';
import { Row, Col, Media, /*Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Button, Input*/ } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { openUserSidebar,updateRooms } from "../../../redux/actions";
import engine from '../../../utils/engine';

function UserHead(props) {
  //const [dropdownOpen, setDropdownOpen] = useState(false);
  //const [dropdownOpen1, setDropdownOpen1] = useState(false);

  //const toggle = () => setDropdownOpen(!dropdownOpen);
  //const toggle1 = () => setDropdownOpen1(!dropdownOpen1);

  // const openUserSidebar = (e) => {
  //   e.preventDefault();
  //   props.openUserSidebar();
  // }

  function closeUserChat(e){
    e.preventDefault();
    var userChat = document.getElementsByClassName("user-chat");
    if(userChat) {
      userChat[0].classList.remove("user-chat-show");
    }
  }

  // function deleteMessage()
  // {
  //   let allUsers = props.messages;
  //   let copyallUsers = allUsers;
  //   copyallUsers[props.active_room].messages =  [];
    
  //   props.updateRooms(copyallUsers);
  // }

  return (
    <React.Fragment>
      <div className="p-3 p-lg-4 border-bottom">
        <Row className="align-items-center">
          <Col sm={12} xs={12}>
            <Media className="align-items-center" style={{paddingRight: 40}}>
              <div className="d-block d-lg-none mr-2">
                <Link to="#" onClick={(e) => closeUserChat(e)} className="user-chat-remove text-muted font-size-16 p-2">
                <i className="ri-arrow-left-s-line"></i></Link>
              </div>
              {
                props.active_room.avatar_url ?
                  <div className="mr-3">
                    <img src={props.active_room.avatar_url} className="rounded-circle avatar-xs" alt="chatvia" />
                  </div>
                :   <div className="chat-user-img align-self-center mr-3">
                    <div className="avatar-xs">
                      <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                        {props.active_room.room_name.charAt(0)}
                      </span>
                    </div>
                  </div>
              }
                            
              <Media body className="overflow-hidden">
                <h5 className="font-size-16 mb-0 text-truncate">
                  <span className="text-reset user-profile-show">
                    {props.active_room.room_name}
                  </span> 
                  {(() => {
                    let status = null;
                    const room = props.active_room;
                    if (room.room_type === 1 && room.peer_id !== null && room.peer_id !== undefined)
                      status = props.chatdata.users[room.peer_id].status;
                    switch (status) {
                      case "online":
                        return (
                          <>
                            <i className="ri-record-circle-fill font-size-10 text-success d-inline-block ml-1"></i>
                            <span className="head-user-status">Active</span>
                          </>
                        )
                                            
                      case "away":
                        return (
                          <>
                            <i className="ri-record-circle-fill font-size-10 text-warning d-inline-block ml-1"></i>
                            <span className="head-user-status">Away</span>
                          </>
                        )

                      case "offline":
                      default:
                        return (
                          <>
                            <i className="ri-record-circle-fill font-size-10 text-secondary d-inline-block ml-1"></i>
                            <span className="head-user-status">Offline</span>
                          </>
                        )
                    }
                  })()}                
                </h5>
              </Media>
            </Media>
          </Col>
          {
            // props.active_room.isVirtual?null:
            //   <Col sm={4} xs={4} >
            //     <ul className="list-inline user-chat-nav text-right mb-0">
                                
            //       <li className="list-inline-item">
            //         <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            //           <DropdownToggle color="none" className="btn nav-btn " type="button" >
            //             <i className="ri-search-line"></i>
            //           </DropdownToggle>
            //           <DropdownMenu right className="p-0  dropdown-menu-md">
            //             <div className="search-box p-2">
            //               <Input type="text" className="form-control bg-light border-0" placeholder="Search.." />
            //             </div>
            //           </DropdownMenu>
            //         </Dropdown>
            //       </li>

            //       <li className="list-inline-item d-none d-lg-inline-block">
            //         <Button type="button" color="none" onClick={(e) => openUserSidebar(e)} className="nav-btn user-profile-show">
            //           <i className="ri-user-2-line"></i>
            //         </Button>
            //       </li>

            //       <li className="list-inline-item">
            //         <Dropdown isOpen={dropdownOpen1} toggle={toggle1} >
            //           <DropdownToggle className="btn nav-btn " color="none" type="button" >
            //             <i className="ri-more-fill"></i>
            //           </DropdownToggle>
            //           <DropdownMenu right>
            //             <DropdownItem className="d-block d-lg-none user-profile-show" onClick={(e) => openUserSidebar(e)}>View profile <i className="ri-user-2-line float-right text-muted"></i></DropdownItem>
            //             <DropdownItem>Archive <i className="ri-archive-line float-right text-muted"></i></DropdownItem>
            //             <DropdownItem>Muted <i className="ri-volume-mute-line float-right text-muted"></i></DropdownItem>
            //             <DropdownItem onClick={(e)=>deleteMessage(e)}>Delete <i className="ri-delete-bin-line float-right text-muted"></i></DropdownItem>
            //           </DropdownMenu>
            //         </Dropdown>
            //       </li>
                                
            //     </ul>
            //   </Col>
          }
          
        </Row>
      </div>
    </React.Fragment>
  );
}


const mapStateToProps = (state) => {
  //const {  } = state.Chat;
  return { ...state.Layout, };
};

export default connect(mapStateToProps, { openUserSidebar,updateRooms })(UserHead);