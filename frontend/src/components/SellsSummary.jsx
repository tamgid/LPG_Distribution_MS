import React from 'react'
import useConditionalNavigate from './navigationUtils'; 

function SellsSummary(props) {
  useConditionalNavigate(props.userName === "", "/");
  return (
    <div>
      Hello from sell summary
    </div>
  )
}

export default SellsSummary
