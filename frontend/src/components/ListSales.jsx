import React from 'react'
import useConditionalNavigate from './navigationUtils'; 
function ListSales(props) {
  useConditionalNavigate(props.userName === "", "/");
  return (
    <div>
      Hello from List Sales
    </div>
  )
}

export default ListSales
