import React from 'react'
import NavBar from './NavBar'

function About(props) {
  return (
    <>
    <NavBar userName={props.userName}/>
    <div className='d-flex justify-content-center align-item-center' style={{marginTop: '5rem'}}>
      <p>Hello from About</p>
    </div>
  </>
  )
}

export default About
