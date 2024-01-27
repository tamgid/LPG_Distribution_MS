import React from 'react'
import useConditionalNavigate from './navigationUtils'; 

function Income(props) {
  useConditionalNavigate(props.userName === "", "/");
  return (
    <div>
      Hello from Income
    </div>
  )
}

export default Income
