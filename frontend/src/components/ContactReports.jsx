import React from 'react'
import useConditionalNavigate from './navigationUtils'; 

function ContactReports(props) {
  useConditionalNavigate(props.userName === "", "/");
  return (
    <div>
      Hello from Contact Report
    </div>
  )
}

export default ContactReports
