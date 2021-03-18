import React, { useState } from 'react';
import { Nav, NavItem, NavLink, UncontrolledTooltip, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from "reactstrap";
import classnames from "classnames";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import isElectron from 'is-electron';

import { setActiveTab } from "../../redux/actions";

//Import Images
import logo from "../../assets/images/logo.svg"
import avatar1 from "../../assets/images/favicon.ico";
import engine from "../../utils/engine";

//i18n
import i18n from '../../i18n';

// flags
// import usFlag from "../../assets/images/flags/us.jpg";
// import spain from "../../assets/images/flags/spain.jpg";
// import germany from "../../assets/images/flags/germany.jpg";
// import italy from "../../assets/images/flags/italy.jpg";
// import russia from "../../assets/images/flags/russia.jpg";

function LeftSidebarMenu(props) {

  const {me} = props;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  //const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const [dropdownOpenMobile, setDropdownOpenMobile] = useState(false);
  //const [ lng, setlng ] = useState("English");

  const toggle = () => setDropdownOpen(!dropdownOpen);
  //const toggle2 = () => setDropdownOpen2(!dropdownOpen2);
  const toggleMobile = () => setDropdownOpenMobile(!dropdownOpenMobile);

  const toggleTab = tab => {
    props.setActiveTab(tab)
  }

  const reload = () => {
    if (isElectron())
      engine.runCommand("reload");
    else
      window.location.reload();
  }

  const activeTab = props.activeTab;
    
  /* changes language according to clicked language menu item */
  // const changeLanguageAction = (lng) => {
        
  //   /* set the selected language to i18n */
  //   i18n.changeLanguage(lng);
    
  //   if(lng === "sp")
  //     setlng("Spanish");
  //   else if(lng === "gr")
  //     setlng("German");
  //   else if(lng === "rs")
  //     setlng("Russian");
  //   else if(lng === "it")
  //     setlng("Italian");
  //   else if(lng === "eng")
  //     setlng("English");
  // }

  return (
    <React.Fragment>
      <div className="side-menu flex-lg-column mr-lg-1">
        {/* LOGO */}
        <div className="navbar-brand-box">
          <span className="logo logo-light">
            <span className="logo-sm">
              <img src={logo} alt="logo" height="30" />
            </span>
          </span>
        </div>
        {/* end navbar-brand-box  */}

        {/* Start side-menu nav */}
        <div className="flex-lg-column my-auto">
          <Nav pills className="side-menu-nav justify-content-center" role="tablist">
            <NavItem id="profile" onClick={() => { toggleTab('profile'); }}>
              <NavLink id="pills-user-tab" className={classnames({ active: activeTab === 'profile' })} onClick={() => { toggleTab('profile'); }}>
                <i className="ri-user-2-line"></i>
              </NavLink>
            </NavItem>
            <UncontrolledTooltip target="profile" placement="top">
              Profile
            </UncontrolledTooltip>
            <NavItem id="Chats" onClick={() => { toggleTab('chat'); }}>
              <NavLink id="pills-chat-tab" className={classnames({ active: activeTab === 'chat' })} onClick={() => { toggleTab('chat'); }}>
                <i className="ri-message-3-line"></i>
              </NavLink>
            </NavItem>
            <UncontrolledTooltip target="Chats" placement="top">
              Chats
            </UncontrolledTooltip>
            {/* <NavItem id="Groups">
              <NavLink id="pills-groups-tab" className={classnames({ active: activeTab === 'group' })} onClick={() => { toggleTab('group'); }}>
                <i className="ri-group-line"></i>
              </NavLink>
            </NavItem>
            <UncontrolledTooltip target="Groups" placement="top">
            Groups
            </UncontrolledTooltip> */}
            <NavItem id="Contacts" onClick={() => { toggleTab('contacts'); }} >
              <NavLink id="pills-contacts-tab" className={classnames({ active: activeTab === 'contacts' })} onClick={() => { toggleTab('contacts'); }}>
                <i className="ri-contacts-line"></i>
              </NavLink>
            </NavItem>
            <UncontrolledTooltip target="Contacts" placement="top">
              Contacts
            </UncontrolledTooltip>
            {/* <NavItem id="Settings">
              <NavLink id="pills-setting-tab" className={classnames({ active: activeTab === 'settings' })} onClick={() => { toggleTab('settings'); }}>
                <i className="ri-settings-2-line"></i>
              </NavLink>
            </NavItem>
            <UncontrolledTooltip target="Settings" placement="top">
              Settings
            </UncontrolledTooltip> */}
            <Dropdown nav isOpen={dropdownOpenMobile} toggle={toggleMobile} onClick={toggleMobile} className="profile-user-dropdown d-inline-block d-lg-none">
              <DropdownToggle nav>
                {/* <img src={avatar1} alt="chatvia" className="profile-user rounded-circle" /> */}
                <div className="avatar-container">
                {
                  me && (me.avatar_url?
                    <div className={"chat-user-img align-self-center avatar-align-center"}>
                      <img src={me.avatar_url} className="rounded-circle avatar-xs" alt="chatvia" />
                    </div>
                    :
                    <div className={"chat-user-img align-self-center avatar-align-center"}>
                      <div className="avatar-xs">
                        <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                          {me.user_name?me.user_name.charAt(0):""}
                        </span>
                      </div>
                    </div>)
                }
                </div>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => { toggleTab('profile'); }}>Profile <i className="ri-profile-line float-right text-muted"></i></DropdownItem>
                {/* <DropdownItem onClick={() => { toggleTab('settings'); }}>Setting <i className="ri-settings-3-line float-right text-muted"></i></DropdownItem> */}
                <DropdownItem divider />
                <DropdownItem tag={Link} to="/logout">Log out <i className="ri-logout-circle-r-line float-right text-muted"></i></DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Nav>
        </div>
        {/* end side-menu nav */}

        <div className="flex-lg-column d-none d-lg-block">
          <Nav className="side-menu-nav justify-content-center">
            {/* <Dropdown nav direction="right" isOpen={dropdownOpen2} className="btn-group dropup profile-user-dropdown" toggle={toggle2}>
              <DropdownToggle nav>
              <i className="ri-global-line"></i>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => changeLanguageAction('eng')} active={lng === "English"}>
                  <img src={usFlag} alt="user" className="mr-1" height="12"/> <span className="align-middle">English</span>
                </DropdownItem>

                <DropdownItem onClick={() => changeLanguageAction('sp')} active={lng === "Spanish"}>
                  <img src={spain} alt="user" className="mr-1" height="12"/> <span className="align-middle">Spanish</span>
                </DropdownItem>

                <DropdownItem onClick={() => changeLanguageAction('gr')} active={lng === "German"}>
                  <img src={germany} alt="user" className="mr-1" height="12"/> <span className="align-middle">German</span>
                </DropdownItem>
                                
                <DropdownItem  onClick={() => changeLanguageAction('it')} active={lng === "Italian"}>
                  <img src={italy} alt="user" className="mr-1" height="12"/> <span className="align-middle">Italian</span>
                </DropdownItem>
                                
                <DropdownItem  onClick={() => changeLanguageAction('gr')} active={lng === "Russian"}>
                  <img src={russia} alt="user" className="mr-1" height="12"/> <span className="align-middle">Russian</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown> */}
            {/* <NavItem>
              <NavLink id="light-dark" target="_blank" href="//chatvia-light.react.themesbrand.com/">
                <i className="ri-sun-line theme-mode-icon"></i>
              </NavLink>
              <UncontrolledTooltip target="light-dark" placement="right">
                Dark / Light Mode
              </UncontrolledTooltip>
            </NavItem> */}
            <NavItem>
              <NavLink id="reload" onClick={() => { reload(); }} >
                <i className="ri-refresh reload-icon"></i>
              </NavLink>
              <UncontrolledTooltip target="reload" placement="right">
                Reload
              </UncontrolledTooltip>
            </NavItem>
            <Dropdown nav isOpen={dropdownOpen} className="btn-group dropup profile-user-dropdown" toggle={toggle}>
              <DropdownToggle nav>
                {/* <img src={avatar1} alt="" className="profile-user rounded-circle" /> */}
                <div className="avatar-container">
                {
                  me && (me.avatar_url?
                    <div className={"chat-user-img align-self-center avatar-align-center"}>
                      <img src={me.avatar_url} className="rounded-circle avatar-xs" alt="chatvia" />
                    </div>
                    :
                    <div className={"chat-user-img align-self-center avatar-align-center"}>
                      <div className="avatar-xs">
                        <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                          {me.user_name?me.user_name.charAt(0):""}
                        </span>
                      </div>
                    </div>)
                }
                </div>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => { toggleTab('profile'); }}>Profile <i className="ri-profile-line float-right text-muted"></i></DropdownItem>
                {/* <DropdownItem onClick={() => { toggleTab('settings'); }}>Setting <i className="ri-settings-3-line float-right text-muted"></i></DropdownItem> */}
                <DropdownItem divider />
                <DropdownItem tag={Link} to="/logout">Log out <i className="ri-logout-circle-r-line float-right text-muted"></i></DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Nav>
        </div>
        {/* Side menu user */}
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = state => {
  const { me } = state.Chat;
  return {
      ...state.Layout,
      me
  };
};

export default connect(mapStateToProps, {
  setActiveTab
})(LeftSidebarMenu);