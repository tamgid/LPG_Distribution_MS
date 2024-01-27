import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

function Accounts() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (!isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <div>
      Hello from accounts
    </div>
  )
}

export default Accounts
