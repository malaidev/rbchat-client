import React from 'react';
import { Card, /*Dropdown, DropdownMenu, DropdownItem, DropdownToggle,*/ } from "reactstrap";

//Import components
import CustomCollapse from "../../../components/CustomCollapse";

//i18n
import { useTranslation } from 'react-i18next';

function Profile(props) {

  const {me} = props;
  //const [dropdownOpen, setDropdownOpen] = useState(false);
  // const [isOpen1, setIsOpen1] = useState(true);
  // const [isOpen2, setIsOpen2] = useState(false);
  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();

  // const toggleCollapse1 = () => {
  //   setIsOpen1(!isOpen1);
  //   setIsOpen2(false);
  // };

  // const toggleCollapse2 = () => {
  //   setIsOpen2(!isOpen2);
  //   setIsOpen1(false);
  // };

  //const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <React.Fragment>
      <div>
        <div className="px-4 pt-4">
          {/* <div className="user-chat-nav float-right">
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle tag="a" className="font-size-18 text-muted dropdown-toggle">
                <i className="ri-more-2-fill"></i>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>{t('Edit')}</DropdownItem>
                <DropdownItem>{t('Action')}</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>{t('Another action')}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div> */}
          <h4 className="mb-0">{t('My Profile')}</h4>
        </div>
        {
          me.user_name &&
          <div className="text-center p-4 border-bottom">
            <div className="mb-4">
              {/* <img src={avatar1} className="rounded-circle avatar-lg img-thumbnail" alt="chatvia" /> */}
              {
                me.avatar_url?
                <div className={"chat-user-img align-self-center mr-3"}>
                  <img src={me.avatar_url} className="rounded-circle avatar-lg" alt="chatvia" />
                </div>
                :
                <div className={"chat-user-img align-self-center mr-3"}>
                  <div className="avatar-lg avatar-align-center">
                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                      {me.user_name.charAt(0)}
                    </span>
                  </div>
                </div>
              }
            </div>

            <h5 className="font-size-16 mb-1 text-truncate">{me.user_name}</h5>
            <p className="text-muted text-truncate mb-1"><i className="ri-record-circle-fill font-size-10 text-success mr-1 d-inline-block"></i> {t('Active')}</p>
          </div>
        }
        {/* End profile user  */}        

        {/* Start user-profile-desc */}
        <div className="p-4 user-profile-desc">
          {/* <div className="text-muted">
            <p className="mb-4">You are signed in as a member of RBChat.</p>
          </div> */}

          <div id="profile-user-accordion-1" className="custom-accordion">
            <Card className="shadow-none border mb-2">
              {/* import collaps */}
              <CustomCollapse
                title = "About"
                iconClass = "ri-user-2-line"
                isOpen={true}
                collapsable={false}
                // toggleCollapse={toggleCollapse1}
              >
                  <div>
                    <p className="text-muted mb-1">Name</p>
                    <h5 className="font-size-14">{me.user_name}</h5>
                  </div>

                  <div className="mt-4">
                    <p className="text-muted mb-1">Nickname</p>
                    <h5 className="font-size-14">{me.user_nickname}</h5>
                  </div>

                  <div className="mt-4">
                    <p className="text-muted mb-1">Team</p>
                    <h5 className="font-size-14">team-{me.team_id}</h5>
                  </div>

                  <div className="mt-4">
                    <p className="text-muted mb-1">Scope</p>
                    <h5 className="font-size-14 mb-0">{me.scope}</h5>
                  </div>
              </CustomCollapse>
            </Card>
            {/* End About card  */}

            {/* <Card className="mb-1 shadow-none border">
              <CustomCollapse
                title = "Attached Files"
                iconClass = "ri-attachment-line"
                isOpen={isOpen2}
                toggleCollapse={toggleCollapse2}
              >
                <AttachedFiles files={files} />
              </CustomCollapse>
            </Card> */}
            {/* End Attached Files card  */}
          </div>
          {/* end profile-user-accordion  */}

        </div>
        {/* end user-profile-desc  */}
      </div>
    </React.Fragment>
  );
}

export default Profile;