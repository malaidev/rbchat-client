import React from 'react';

function TypingView(props) {

  let typing_str = null;
  if (props.active_room !== null && props.active_room.typings && props.active_room.typings.length > 0) {
    const typings = props.active_room.typings;
    const len = typings.length;
    const {users} = props.chatdata;
    typing_str = "";
    for (var i = 0; i < len; i++) {
      const user_name =  users[typings[i]].user_name;
      if (i === 0)
        typing_str += user_name;
      else if (i === len - 1)
        typing_str += " and " + user_name;
      else
        typing_str += ", " + user_name;
    }
    if (len === 1)
      typing_str += " is typing";
    else
      typing_str += " are typing";
  }
  
  return (
    <React.Fragment>
      <div className="typing-view">
        {
          typing_str &&
          <>
            <span>{typing_str}</span>
            <span className="animate-typing">
              <span className="dot ml-1"></span>
              <span className="dot ml-1"></span>
              <span className="dot ml-1"></span>
            </span>
          </>
        }
        
      </div>
    </React.Fragment>
  );
}

export default TypingView;

