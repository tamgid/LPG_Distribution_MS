import React from 'react'
import NavBar from './NavBar'
import useConditionalNavigate from './navigationUtils'; 


function ContactUs(props) {
  useConditionalNavigate(props.userName === "", "/");
  return (
    <>
    <NavBar userName={props.userName}/>
    <div className='d-flex justify-content-center align-item-center' style={{marginTop: '5rem'}}>
      <p>Hello from Contact Us</p>
    </div>
  </>
  )
}

export default ContactUs
