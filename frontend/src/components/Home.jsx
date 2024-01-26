import React from 'react'
import NavBar from './NavBar'
import SideBar from './SideBar'
import {useEffect} from 'react'
import axios from 'axios'


function Home(props) {
  
  useEffect(() => {
      axios.get('http://localhost:3001/addCookie')
      .then(res => {
          if(res.data.Status === 'Success')
          {
              props.setName(res.data.Name)
          }
      })
      .catch(err => {
          console.log(err)
      })
  })
 
  return (
    <div>
      <NavBar userName={props.userName}/>
      <SideBar userName={props.userName}/>
    </div>
  )
}

export default Home
