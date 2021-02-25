
import icon from '../assets/images/favicon.ico';
import config from '../config';

var last_notification = 0;

export const showNotification = (title, body, onclick = null) => {

  let time_now = Date.now();
  if (time_now < last_notification + config.NOTIFICATION_INTERVAL)
    return;
  
  last_notification = time_now;

  const notification = {
    title,
    body,
    icon,
  }
  const myNotification = new window.Notification(notification.title, notification);
  myNotification.onclick = (event) => {
    // event.preventDefault(); // prevent the browser from focusing the Notification's tab
    myNotification.close();
    if (onclick)
      onclick();
    window.focus();
  }
}
