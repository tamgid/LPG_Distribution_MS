import React,{useEffect} from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

function ContactUs(props) {
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve authentication status from localStorage
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (!isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <>
      <NavBar userName={props.userName} />
      <div
        className="d-flex justify-content-center align-item-center"
        style={{ marginTop: "5rem" }}
      >
        <p>Hello from Contact Us</p>
      </div>
    </>
  );
}

export default ContactUs;
