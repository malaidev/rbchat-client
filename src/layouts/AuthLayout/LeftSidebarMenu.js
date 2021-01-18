import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Nav, NavItem, NavLink, UncontrolledTooltip, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from "reactstrap";
import classnames from "classnames";
import { connect } from "react-redux";

import { setActiveTab } from "../../redux/actions";

//Import Images
import logo from "../../assets/images/logo.svg"
import avatar1 from "../../assets/images/users/avatar-1.jpg";

//i18n
import i18n from '../../i18n';

// falgs
import usFlag from "../../assets/images/flags/us.jpg";
import spain from "../../assets/images/flags/spain.jpg";
import germany from "../../assets/images/flags/germany.jpg";
import italy from "../../assets/images/flags/italy.jpg";
import russia from "../../assets/images/flags/russia.jpg";

function LeftSidebarMenu(props) {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpen2, setDropdownOpen2] = useState(false);
    const [dropdownOpenMobile, setDropdownOpenMobile] = useState(false);
    const [ lng, setlng ] = useState("English");


    const toggle = () => setDropdownOpen(!dropdownOpen);
    const toggle2 = () => setDropdownOpen2(!dropdownOpen2);
    const toggleMobile = () => setDropdownOpenMobile(!dropdownOpenMobile);

    const toggleTab = tab => {
        props.setActiveTab(tab)
    }

    const activeTab = props.activeTab;
    
    /* changes language according to clicked language menu item */
    const changeLanguageAction = (lng) => {
        
        /* set the selected language to i18n */
        i18n.changeLanguage(lng);
    
        if(lng === "sp")
            setlng("Spanish");
        else if(lng === "gr")
            setlng("German");
        else if(lng === "rs")
            setlng("Russian");
        else if(lng === "it")
            setlng("Italian");
        else if(lng === "eng")
            setlng("English");
    }

    return (
        <React.Fragment>
            <div className="side-menu flex-lg-column mr-lg-1">
                {/* LOGO */}
                <div className="navbar-brand-box">
                    <Link to="/" className="logo logo-dark">
                        <span className="logo-sm">
                            <img src={logo} alt="logo" height="30" />
                        </span>
                    </Link>

                    <Link to="/" className="logo logo-light">
                        <span className="logo-sm">
                            <img src={logo} alt="logo" height="30" />
                        </span>
                    </Link>
                </div>
                {/* end navbar-brand-box  */}

                {/* Start side-menu nav */}
                <div className="flex-lg-column my-auto">
                    <Nav pills className="side-menu-nav justify-content-center" role="tablist">
                        <NavItem id="profile">
                            <NavLink id="pills-user-tab" className={classnames({ active: activeTab === 'profile' })} onClick={() => { toggleTab('profile'); }}>
                                <i className="ri-user-2-line"></i>
                            </NavLink>
                        </NavItem>
                        <UncontrolledTooltip target="profile" placement="top">
                            Profile
                        </UncontrolledTooltip>
                        <NavItem id="Chats">
                            <NavLink id="pills-chat-tab" className={classnames({ active: activeTab === 'chat' })} onClick={() => { toggleTab('chat'); }}>
                                <i className="ri-message-3-line"></i>
                            </NavLink>
                        </NavItem>
                        <UncontrolledTooltip target="Chats" placement="top">
                        Chats
                        </UncontrolledTooltip>
                        <NavItem id="Groups">
                            <NavLink id="pills-groups-tab" className={classnames({ active: activeTab === 'group' })} onClick={() => { toggleTab('group'); }}>
                                <i className="ri-group-line"></i>
                            </NavLink>
                        </NavItem>
                        <UncontrolledTooltip target="Groups" placement="top">
                        Groups
                        </UncontrolledTooltip>
                        <NavItem id="Contacts">
                            <NavLink id="pills-contacts-tab" className={classnames({ active: activeTab === 'contacts' })} onClick={() => { toggleTab('contacts'); }}>
                                <i className="ri-contacts-line"></i>
                            </NavLink>
                        </NavItem>
                        <UncontrolledTooltip target="Contacts" placement="top">
                        Contacts
                        </UncontrolledTooltip>
                        <NavItem id="Settings">
                            <NavLink id="pills-setting-tab" className={classnames({ active: activeTab === 'settings' })} onClick={() => { toggleTab('settings'); }}>
                                <i className="ri-settings-2-line"></i>
                            </NavLink>
                        </NavItem>
                        <UncontrolledTooltip target="Settings" placement="top">
                            Settings
                        </UncontrolledTooltip>
                        <Dropdown nav isOpen={dropdownOpenMobile} toggle={toggleMobile} className="profile-user-dropdown d-inline-block d-lg-none">
                            <DropdownToggle nav>
                                <img src={avatar1} alt="chatvia" className="profile-user rounded-circle" />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => { toggleTab('profile'); }}>Profile <i className="ri-profile-line float-right text-muted"></i></DropdownItem>
                                <DropdownItem onClick={() => { toggleTab('settings'); }}>Setting <i className="ri-settings-3-line float-right text-muted"></i></DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem href="/logout">Log out <i className="ri-logout-circle-r-line float-right text-muted"></i></DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Nav>
                </div>
                {/* end side-menu nav */}

                <div className="flex-lg-column d-none d-lg-block">
                    <Nav className="side-menu-nav justify-content-center">
                        <Dropdown nav direction="right" isOpen={dropdownOpen2} className="btn-group dropup profile-user-dropdown" toggle={toggle2}>
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
                        </Dropdown>
                        <NavItem>
                            <NavLink id="light-dark" target="_blank" href="//chatvia-light.react.themesbrand.com/">
                                <i className="ri-sun-line theme-mode-icon"></i>
                            </NavLink>
                            <UncontrolledTooltip target="light-dark" placement="right">
                                Dark / Light Mode
                            </UncontrolledTooltip>
                        </NavItem>
                        <Dropdown nav isOpen={dropdownOpen} className="btn-group dropup profile-user-dropdown" toggle={toggle}>
                            <DropdownToggle nav>
                            <img src={avatar1} alt="" className="profile-user rounded-circle" />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => { toggleTab('profile'); }}>Profile <i className="ri-profile-line float-right text-muted"></i></DropdownItem>
                                <DropdownItem onClick={() => { toggleTab('settings'); }}>Setting <i className="ri-settings-3-line float-right text-muted"></i></DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem href="/logout">Log out <i className="ri-logout-circle-r-line float-right text-muted"></i></DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Nav>
                </div>
                {/* Side menu user */}
            </div>
        </React.Fragment>
    );
}

const mapStatetoProps = state => {
    return {
      ...state.Layout
    };
};

export default connect(mapStatetoProps, {
    setActiveTab
})(LeftSidebarMenu);