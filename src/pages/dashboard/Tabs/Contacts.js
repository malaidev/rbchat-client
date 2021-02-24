import React, { useState, useEffect } from 'react';
import { /*UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,*/
        Media, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon, /*UncontrolledTooltip*/} from 'reactstrap';
import SimpleBar from "simplebar-react";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';
//i18n
import { useTranslation } from 'react-i18next';

import { setActiveRoom } from "../../../redux/actions"

function pad(str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

function sortContacts(users, word = ""){
  var sorted = {};
  word = word.toLocaleLowerCase().trim();
  for (var i in users) {
    let user = users[i];
    if (word) {
      let isUser = user.user_name.toLocaleLowerCase().includes(word);
      let teamstr = "team-" + pad(user.team_id, 3);
      let isTeam = teamstr.includes(word);
      let isNick = user.user_nickname.toLocaleLowerCase().includes(word);
      if (!isUser && !isTeam && !isNick)
        continue;
    }
    let group = user.team_id;
    // if there is no property in accumulator with this letter create it
    if(!sorted[group]) sorted[group] = {group, children: [user]}
    // if there is push current element to children array for that letter
    else sorted[group].children.push(user);
  }

  return Object.values(sorted);
}

function Contacts (props){
  
  const {users, me} = props.chatdata;

  const [modal, setModal] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [contacts, setContacts] = useState(sortContacts(users, searchWord));
  const toggle = () => setModal(!modal);

  const { t } = useTranslation();

  useEffect(() => {
    setContacts(sortContacts(users, searchWord));
  }, [users, searchWord]);
    
  const openPeerRoom = (e, user) => {

    e.preventDefault();
    if (user.user_id === me.user_id)
      return;

    //find index of current room in array
    // var index = this.props.chatdata.rooms.indexOf(room);

    props.setActiveRoom(user.peer_room);

    var chatList = document.getElementById("contact-list");
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

  const handleChange = (e) => {
    setSearchWord(e.target.value);
  }
    
  return (
    <React.Fragment>
    <div>
      <div className="p-4">
        {/* <div className="user-chat-nav float-right">
          <div id="add-contact">
            <Button type="button" color="link" onClick={toggle} className="text-decoration-none text-muted font-size-18 py-0">
              <i className="ri-user-add-line"></i>
            </Button>
          </div>
          <UncontrolledTooltip target="add-contact" placement="bottom">
            Add Contact
          </UncontrolledTooltip>
        </div> */}
        <h4 className="mb-4">Contacts</h4>

        {/* Start Add contact Modal */}
        <Modal isOpen={modal} centered toggle={toggle}>
          <ModalHeader tag="h5" className="font-size-16" toggle={toggle}>
            {t('Add Contacts')}
          </ModalHeader>
          <ModalBody className="p-4">
            <Form>
              <FormGroup className="mb-4">
                <Label htmlFor="addcontactemail-input">{t('Email')}</Label>
                <Input type="email" className="form-control" id="addcontactemail-input" placeholder="Enter Email" />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="addcontact-invitemessage-input">{t('Invatation Message')}</Label>
                <textarea className="form-control" id="addcontact-invitemessage-input" rows="3" placeholder="Enter Message"></textarea>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button type="button" color="link" onClick={toggle}>Close</Button>
            <Button type="button" color="primary">Invite Contact</Button>
          </ModalFooter>
        </Modal>
        {/* End Add contact Modal */}

        <div className="search-box chat-search-box">
          <InputGroup size="lg" className="bg-light rounded-lg">
            <InputGroupAddon addonType="prepend">
              <Button color="link" className="text-decoration-none text-muted pr-1" type="button">
                <i className="ri-search-line search-icon font-size-18"></i>
              </Button>
            </InputGroupAddon>
            <Input type="text" value={searchWord} onChange={(e) => handleChange(e)} className="form-control bg-light " placeholder="Search users..." />
          </InputGroup>
        </div>
        {/* End search-box */}
      </div>
      {/* end p-4 */}

      {/* Start contact lists */}
      <SimpleBar style={{ maxHeight: "100%" }} id="chat-room" className="p-4 chat-message-list chat-group-list">

        {
          contacts.map((contact, key) => 
            <div key={key} className={key+1 === 1 ? "" : "mt-3"}>
              <div className="p-3 font-weight-bold text-gray">
                {"team-" + pad(contact.group, 3)}
              </div>

              <ul className="list-unstyled contact-list">
                {
                  contact.children.map((user, key) => {
                    return (
                    <li key={user.user_id} onClick={e => openPeerRoom(e, user)} className={user.peer_room === props.active_room ? "active" : ""} >
                      <Media className="align-items-center">
                        <div className="chat-user-img align-self-center mr-3">
                          {
                            user.avatar_url?
                            <div className={"chat-user-img " + user.status +" align-self-center mr-3"}>
                              <img src={user.avatar_url} className="rounded-circle avatar-xs" alt="chatvia" />
                              {
                                user.status &&  <span className="user-status"></span>
                              }
                            </div>
                            :
                            <div className={"chat-user-img " + user.status +" align-self-center mr-3"}>
                              <div className="avatar-xs">
                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                  {user.user_name.charAt(0)}
                                </span>
                              </div>
                              {
                                user.status &&  <span className="user-status"></span>
                              }
                            </div>
                          }
                        </div>
                        <Media body>
                          <h5 className="font-size-14 m-0">{user.user_name}
                            {
                              user.user_id===me.user_id?
                                <span className="badge badge-soft-warning badge-pill badge-right">Me</span>
                              :
                              user.peer_room && user.peer_room.toString().charAt(0) !== "v"?
                                <span className="badge badge-soft-success badge-pill badge-right">On chatting</span>
                              : null
                            }
                            
                          </h5>
                        </Media>
                        {/* <UncontrolledDropdown>
                          <DropdownToggle tag="a" className="text-muted">
                          <i className="ri-more-2-fill"></i>
                          </DropdownToggle>
                          <DropdownMenu right>
                            <DropdownItem>{t('Share')} <i className="ri-share-line float-right text-muted"></i></DropdownItem>
                            <DropdownItem>{t('Block')} <i className="ri-forbid-line float-right text-muted"></i></DropdownItem>
                            <DropdownItem>{t('Remove')} <i className="ri-delete-bin-line float-right text-muted"></i></DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown> */}
                      </Media>
                    </li>
                    )}
                  )
                }
              </ul>
          </div>
          )
        }
                        
      </SimpleBar>
      {/* end contact lists */}
    </div>
  </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  const { active_room } = state.Chat;
  return { active_room };
};

export default connect(mapStateToProps, { setActiveRoom })(withTranslation()(Contacts));