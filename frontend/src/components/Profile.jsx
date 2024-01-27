import React from 'react'
import NavBar from './NavBar'
import useConditionalNavigate from './navigationUtils'; 


function Profile(props) {
  useConditionalNavigate(props.userName === "", "/");
  return (
    <>
      <NavBar userName={props.userName}/>
      <div className='d-flex justify-content-center align-item-center' style={{marginTop: '5rem'}}>
        <p>{`Hi! ${props.userName}. This your profile `}</p>
      </div>
    </>
  )
}

export default Profile
