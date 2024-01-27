import React from 'react'
import { useNavigate } from "react-router-dom";
import {useEffect} from 'react'

function Contacts(props) {

  const navigate = useNavigate();

  useEffect(() => {
    if (props.userName === "") {
      navigate("/");
    }
  }, [props.userName, navigate]);
  return (
    <div>
      Hello from contact
    </div>
  )
}

export default Contacts
