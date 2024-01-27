import React from 'react'
import useConditionalNavigate from './navigationUtils'; 

function Expanses(props) {
  useConditionalNavigate(props.userName === "", "/");
  return (
    <div>
      Hello from Expanses
    </div>
  )
}

export default Expanses
