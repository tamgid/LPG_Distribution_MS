import React from 'react'
import useConditionalNavigate from './navigationUtils'; 
function AddSale(props) {
  useConditionalNavigate(props.userName === "", "/");
  return (
    <div>
      Hello from Add Sale
    </div>
  )
}

export default AddSale
