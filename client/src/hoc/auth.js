import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null) {
  // option parameter ref.App.js
  // 1. null => Anybody can access
  // 2. true => only user who logged in can access
  // 3. false => user who logged in can not access
  // adminRouter => only administrator can access
  // = null => set up default is null

  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);
        // before sign-in
        if (!response.payload.isAuth) {
          if (option) {
            props.history.push('/login');
          }
        } else {
          // after sign-in
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push('/');
          } else {
            if (option === false) props.history.push('/');
          }
        }
      });
    }, []);

    return <SpecificComponent />;
  }
  return AuthenticationCheck;
}
