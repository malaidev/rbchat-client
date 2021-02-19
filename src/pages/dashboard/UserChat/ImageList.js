import React, { useState } from 'react';
// import { DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { Link } from "react-router-dom";

//lightbox
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import engine from '../../../utils/engine';

function ImageList(props) {
  
  const {content: name, path} = props.file;

  const [isOpen, setisOpen] = useState(false);
  const [currentImage, setcurrentImage] = useState(null);

  const toggleLightbox = (currentImage) => {
    setisOpen(!isOpen);
    setcurrentImage(currentImage);
  }

  const images = [engine.getDownloadLink(path, name)]

  return (
    <React.Fragment>
      <ul className="list-inline message-img  mb-0">
        {/* image list */}
        {
          images.map((image, key) =>
            <li key={key} className="list-inline-item message-img-list">
              <div>
                <Link to="#" onClick={() => toggleLightbox(image)} className="popup-img d-inline-block m-1" title="Project 1">
                  <img src={image} alt="chat" className="rounded border" />
                </Link>
              </div>
              <div className="message-img-link">
                <ul className="list-inline mb-0">
                  <li className="list-inline-item gray-layer">
                    <a href={engine.getDownloadLink(path, name)} >
                      <i className="ri-download-2-line"></i>
                      </a>
                  </li>
                  {/* <UncontrolledDropdown tag="li" className="list-inline-item">
                  <DropdownToggle tag="a">
                    <i className="ri-more-fill"></i>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>{t('Copy')} <i className="ri-file-copy-line float-right text-muted"></i></DropdownItem>
                    <DropdownItem>{t('Save')} <i className="ri-save-line float-right text-muted"></i></DropdownItem>
                    <DropdownItem>{t('Forward')} <i className="ri-chat-forward-line float-right text-muted"></i></DropdownItem>
                    <DropdownItem>{t('Delete')} <i className="ri-delete-bin-line float-right text-muted"></i></DropdownItem>
                  </DropdownMenu>
                  </UncontrolledDropdown> */}
                </ul>
              </div>
            </li>
          )
        }

        {isOpen && (
          <Lightbox
            mainSrc={currentImage}
            onCloseRequest={toggleLightbox}
            imageTitle="Project 1"
          />
        )}
                                                        
      </ul>
    </React.Fragment>
  );
}

export default ImageList;