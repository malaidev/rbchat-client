import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

//redux store
import { logoutUser, initChat, initLayout } from '../../redux/actions';
import api from '../../apis';

/**
 * Logouts the user
 * @param {*} props 
 */
const Logout = (props) => {
    useEffect(() => {
        props.logoutUser(props.history);
        props.initLayout();
        props.initChat();
        api.disconnectSocket();
    }, [props]);

    return (<React.Fragment></React.Fragment>)
}

export default withRouter(connect(null, { logoutUser, initChat, initLayout })(Logout));