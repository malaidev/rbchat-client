import React, { useState } from 'react';
import { connect } from "react-redux";
import { Button, Card, Media, Badge } from "reactstrap";

//Simple bar
import SimpleBar from "simplebar-react";

//components
import AttachedFiles from "./AttachedFiles";
import CustomCollapse from "./CustomCollapse";

//actions
import { closeUserSidebar } from "../redux/actions";

//i18n
import { useTranslation } from 'react-i18next';

//image
import avatar1 from "../assets/images/favicon.ico";

function UserProfileSidebar(props) {

  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [files] = useState([
    { name : "Admin-A.zip", size : "12.5 MB", thumbnail : "ri-file-text-fill" },
    { name : "Image-1.jpg", size : "4.2 MB", thumbnail : "ri-image-fill" },
    { name : "Image-2.jpg", size : "3.1 MB", thumbnail : "ri-image-fill" },
    { name : "Landing-A.zip", size : "6.7 MB", thumbnail : "ri-file-text-fill" },
  ]);

  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();

  const toggleCollapse1 = () => {
    setIsOpen1(!isOpen1);
    setIsOpen2(false);
    setIsOpen3(false);
  };

  const toggleCollapse2 = () => {
    setIsOpen2(!isOpen2);
    setIsOpen1(false);
    setIsOpen3(false);
  };

  const toggleCollapse3 = () => {
    setIsOpen3(!isOpen3);
    setIsOpen1(false);
    setIsOpen2(false);
  };

  // closes sidebar
  const closeuserSidebar=()=> {
    props.closeUserSidebar();
  }
  // style={{display: props.userSidebar  ? "block" : "none"}}
  return (
    <React.Fragment>
      <div style={{display: (props.userSidebar === true)  ? "block" : "none"}} className="user-profile-sidebar">
        <div className="px-3 px-lg-4 pt-3 pt-lg-4">
          <div className="user-chat-nav text-right">
            <Button color="none" type="button" onClick={closeuserSidebar} className="nav-btn" id="user-profile-hide">
              <i className="ri-close-line"></i>
            </Button>
          </div>
        </div>

        <div className="text-center p-4 border-bottom">

          <div className="mb-4 d-flex justify-content-center">
            {
              props.activeRoom.profilePicture ==="Null" ?
                <div className="avatar-lg">
                  <span className="avatar-title rounded-circle bg-soft-primary text-primary font-size-24">
                    {props.activeRoom.name.charAt(0)}
                  </span>
                </div>
              : <img src={props.activeRoom.profilePicture} className="rounded-circle avatar-lg img-thumbnail" alt="chatvia" />
            }
                            
          </div>

          <h5 className="font-size-16 mb-1 text-truncate">{props.activeRoom.name}</h5>
          <p className="text-muted text-truncate mb-1">
            {(() => {
              switch (props.activeRoom.status) {
                case "online":
                  return (
                    <>
                      <i className="ri-record-circle-fill font-size-10 text-success mr-1"></i>
                    </>
                  )
                                            
                case "away":
                  return (
                    <>
                      <i className="ri-record-circle-fill font-size-10 text-warning mr-1"></i>
                    </>
                  )

                case "offline":
                  return (
                    <>
                      <i className="ri-record-circle-fill font-size-10 text-secondary mr-1"></i>
                    </>
                  )

                default:
                  return;
              }
            })()}
                            
            Active</p>
        </div>
        {/* End profile user */}

        {/* Start user-profile-desc */}
        <SimpleBar style={{ maxHeight: "100%" }} className="p-4 user-profile-desc">
          <div className="text-muted">
            <p className="mb-4">"{t('If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual.')}"</p>
          </div>

          <div id="profile-user-accordion" className="custom-accordion">
            <Card className="shadow-none border mb-2">
              {/* import collaps */}
                <CustomCollapse
                  title = "About"
                  iconClass = "ri-user-2-line"
                  isOpen={isOpen1}
                  toggleCollapse={toggleCollapse1}
                >

                  <div>
                    <p className="text-muted mb-1">{t('Name')}</p>
                    <h5 className="font-size-14">{props.activeRoom.name}</h5>
                  </div>

                  <div className="mt-4">
                    <p className="text-muted mb-1">{t('Email')}</p>
                    <h5 className="font-size-14">{props.activeRoom.email}</h5>
                  </div>

                  <div className="mt-4">
                    <p className="text-muted mb-1">{t('Time')}</p>
                    <h5 className="font-size-14">11:40 AM</h5>
                  </div>

                  <div className="mt-4">
                    <p className="text-muted mb-1">{t('Location')}</p>
                    <h5 className="font-size-14 mb-0">California, USA</h5>
                  </div>
                </CustomCollapse>
            </Card>
            {/* End About card */}

            <Card className="mb-1 shadow-none border">
              {/* import collaps */}
              <CustomCollapse
                  title = "Attached Files"
                  iconClass = "ri-attachment-line"
                  isOpen={isOpen2}
                  toggleCollapse={toggleCollapse2}
                >
                  {/* attached files */}
                  <AttachedFiles files={files} />
                </CustomCollapse>
            </Card>

            {
              props.activeRoom.isGroup === true &&
              <Card className="mb-1 shadow-none border">
                {/* import collaps */}
                <CustomCollapse
                    title = "Members"
                    iconClass = "ri-group-line"
                    isOpen={isOpen3}
                    toggleCollapse={toggleCollapse3}
                  >
                        <Card className="p-2 mb-2">
                          <Media className="align-items-center">
                                  <div className="chat-user-img align-self-center mr-3">
                                        <div className="avatar-xs">
                                          <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                            S
                                          </span>
                                        </div>
                                      </div>
                            <Media body>
                              <div className="text-left">
                                <h5 className="font-size-14 mb-1">{t('Sara Muller')}
                                <Badge color="danger" className="badge-soft-danger float-right">{t('Admin')}</Badge>
                                </h5>
                                {/* <p className="text-muted font-size-13 mb-0">{member.status}</p> */}
                              </div>
                            </Media>
                          </Media>
                        </Card>

                        <Card className="p-2 mb-2">
                          <Media className="align-items-center">
                                  <div className="chat-user-img align-self-center mr-3">
                                        <div className="avatar-xs">
                                          <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                            O
                                          </span>
                                        </div>
                                      </div>
                            <Media body>
                              <div className="text-left">
                                <h5 className="font-size-14 mb-1">{t('Ossie Wilson')}</h5>
                                {/* <p className="text-muted font-size-13 mb-0">{member.status}</p> */}
                              </div>
                            </Media>
                          </Media>
                        </Card>

                        <Card className="p-2 mb-2">
                          <Media className="align-items-center">
                            <div className="chat-avatar">
                                                                
                              <img src={avatar1} className="rounded-circle chat-user-img avatar-xs mr-3" alt="chatvia" />
                            </div>
                            <Media body>
                              <div className="text-left">
                                <h5 className="font-size-14 mb-1">{t('Paul Haynes')}</h5>
                                {/* <p className="text-muted font-size-13 mb-0">{member.status}</p> */}
                              </div>
                            </Media>
                          </Media>
                        </Card>
                  </CustomCollapse>
              </Card>
            }
          </div>
        </SimpleBar>
        {/* end user-profile-desc */}
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  const { messages,active_room } = state.Chat;
  const { userSidebar } = state.Layout;
  return { messages,active_room,userSidebar };
};

export default connect(mapStateToProps, { closeUserSidebar })(UserProfileSidebar);