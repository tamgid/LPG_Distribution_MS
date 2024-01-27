import React from 'react'
import NavBar from './NavBar'
import SideBar from './SideBar'
import { useNavigate } from "react-router-dom";
import {useEffect} from 'react'


function Home(props) {
  
  const navigate = useNavigate();

  useEffect(() => {
    if (props.userName === "") {
      navigate("/");
    }
  }, [props.userName, navigate]);
 
  return (
    <div>
      <NavBar userName={props.userName} setName={props.setName}/>
      <SideBar userName={props.userName}/>
    </div>
  )
}

export default Home
