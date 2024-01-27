import React from 'react'
import useConditionalNavigate from './navigationUtils'; 

function Accounts(props) {
  useConditionalNavigate(props.userName === "", "/");
  return (
    <div>
      Hello from accounts
    </div>
  )
}

export default Accounts
