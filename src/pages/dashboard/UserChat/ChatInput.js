import React, { useState } from 'react';
import { Button, Input, Row, Col, UncontrolledTooltip, ButtonDropdown, DropdownToggle, DropdownMenu, Label, Form } from "reactstrap";
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import config from '../../../config';

var last_typing = 0;

function ChatInput(props) {

  const [textMessage, settextMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  //function for text input value change
  const handleChange = e => {
    settextMessage(e.target.value)
    if (props.onTyping) {
      let time_now = Date.now();
      if (time_now >= last_typing + config.TYPING_UPDATE_INTERVAL) {
        last_typing = time_now;
        props.onTyping();
      }
    }
  }

  //function for add emojis
  const addEmoji = e => {
    let emoji = e.native;
    settextMessage(textMessage+emoji)
  };

  //function for file input change
  const handleFileChange = e => {
    if(e.target.files.length !== 0) {
      const file = e.target.files[0];
      
      props.onAddMessage(file, "fileMessage");
    }

  }

  //function for image input change
  const handleKeyPress = e => {
    if(e.charCode === 13){
      onAddMessage(null, textMessage);
    } 
  }

  //function for send data to onAddMessage function(in userChat/index.js component)
  const onAddMessage = (e, textMessage) => {
    if (e)
      e.preventDefault();
    //if text value is not emptry then call onAddMessage function
    if(textMessage !== "") {
      props.onAddMessage(textMessage, "textMessage");
      settextMessage("");
    }
  }

  return (
    <React.Fragment>
      <div className="chat-input">
        <Form onSubmit={(e) => onAddMessage(e, textMessage)} >
          <Row noGutters>
            <Col>
              <div>
                <Input type="text" value={textMessage} onChange={handleChange} onKeyPress={e => handleKeyPress(e)} className="form-control form-control-lg bg-light border-light" placeholder="Enter Message..." />
              </div>
            </Col>
            <Col xs="auto">
              <div className="chat-input-links ml-md-2">
                <ul className="list-inline mb-0">
                  <li className="list-inline-item">
                    <ButtonDropdown className="emoji-dropdown" direction="up" isOpen={isOpen} toggle={toggle}>
                      <DropdownToggle id="emoji" color="link" className="text-decoration-none font-size-16 btn-lg waves-effect">
                        <i className="ri-emotion-happy-line"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-lg-right">
                        <Picker onSelect={addEmoji} />
                      </DropdownMenu>
                    </ButtonDropdown>
                    <UncontrolledTooltip target="emoji" placement="top">
                      Emoji
                    </UncontrolledTooltip>
                  </li>
                  <li className="list-inline-item input-file">
                    <Label id="files" className="btn btn-link text-decoration-none font-size-16 btn-lg waves-effect">
                      <i className="ri-attachment-line"></i>
                    <Input onChange={(e) => handleFileChange(e)} type="file" name="fileInput" size="60" />
                    </Label>   
                    <UncontrolledTooltip target="files" placement="top">
                      Attached File
                    </UncontrolledTooltip>
                  </li>
                  <li className="list-inline-item input-file">
                    <Label id="images" className="mr-1 btn btn-link text-decoration-none font-size-16 btn-lg waves-effect">
                      <i className="ri-image-fill"></i>
                    <Input onChange={(e) => handleFileChange(e)} accept="image/*" type="file" name="fileInput" size="60" />
                    </Label>   
                    <UncontrolledTooltip target="images" placement="top">
                      Images
                    </UncontrolledTooltip>
                  </li>
                  <li className="list-inline-item">
                    <Button type="submit" color="primary" className="font-size-16 btn-lg chat-send waves-effect waves-light">
                      <i className="ri-send-plane-2-fill"></i>
                    </Button>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </React.Fragment>
  );
}

export default ChatInput;