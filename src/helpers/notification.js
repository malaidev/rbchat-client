
import icon from '../assets/images/favicon.ico';

export const showNotification = (title, body, onclick = null) => {
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
