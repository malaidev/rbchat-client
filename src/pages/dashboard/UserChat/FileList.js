import React from 'react';
import { Card, Media, /*UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem*/ } from "reactstrap";

import engine from '../../../utils/engine';

function FileList(props) {

  const {content: name, size, path} = props.file;
  
  const fileSize = Number(size);
  var sizeStr = "";
  if (fileSize < 1024 )
    sizeStr = fileSize + "byte";
  else if (fileSize < 1024 * 1024)
    sizeStr = (fileSize / 1024).toFixed(1) + "KB";
  else if (fileSize < 1024 * 1024 * 1024)
    sizeStr = (fileSize / 1024 / 1024).toFixed(1) + "MB";
  else if (fileSize < 1024 * 1024 * 1024 * 1024)
    sizeStr = (fileSize / 1024 / 1024 / 1024).toFixed(1) + "GB";

  return (
    <React.Fragment>
      <Card className="p-2 mb-2">
        <Media className="align-items-center">
          <div className="avatar-sm mr-3">
            <div className="avatar-title bg-soft-primary text-primary rounded font-size-20">
              <i className="ri-file-text-fill"></i>
            </div>
          </div>
          <Media body>
            <div className="text-left">
              <h5 className="font-size-14 mb-1">{name}</h5>
              <p className="text-muted font-size-13 mb-0">{sizeStr}</p>
            </div>
          </Media>

          <div className="ml-4">
            <ul className="list-inline mb-0 font-size-20">
              {
                path &&
                  <li className="list-inline-item">
                    <a className="text-muted" href={engine.getDownloadLink(path, name)} >
                      <i className="ri-download-2-line"></i>
                    </a>
                  </li>
              }
              {/* <UncontrolledDropdown tag="li" className="list-inline-item">
                <DropdownToggle tag="a" className="dropdown-toggle text-muted">
                  <i className="ri-more-fill"></i>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>{t('Share')} <i className="ri-share-line float-right text-muted"></i></DropdownItem>
                  <DropdownItem>{t('Delete')} <i className="ri-delete-bin-line float-right text-muted"></i></DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown> */}
            </ul>
          </div>
        </Media>
      </Card>
    </React.Fragment>
  );
}

export default FileList;