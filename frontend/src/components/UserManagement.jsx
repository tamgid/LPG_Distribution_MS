import React from 'react'
import { useNavigate } from "react-router-dom";
import {useEffect} from 'react'

function UserManagement(props) {

  const navigate = useNavigate();

  useEffect(() => {
    if (props.userName === "") {
      navigate("/");
    }
  }, [props.userName, navigate]);
  return (
    <div>
      Hello from User Management
    </div>
  )
}

export default UserManagement
