import React from 'react'
import NavBar from './NavBar'


function ContactUs(props) {
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
