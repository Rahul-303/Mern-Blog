import React from 'react'
import {useSelector} from 'react-redux'
import {Outlet, Navigate} from 'react-router-dom'

const PrivateRouteCreator = () => {
    const {currentUser} = useSelector(state => state.user);
  return currentUser ? (currentUser.isCreator ? <Outlet/> : <Navigate to='/'/>): <Navigate to='/sign-in'/>;
}

export default PrivateRouteCreator;
