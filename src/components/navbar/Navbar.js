import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import firebase from "firebase/app";
import "./Navbar.css";

function Navbar() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigate("/login");
      });
  };

  // 로그인 한 사용자에게만 Navbar를 보여줍니다.
  if (currentUser) {
    return (
      <nav className="fixed-top pt-0">
        <div className="navAlign">
          <a href="/" role="button">
            <img className="logo" src="/img/eagleLogo.svg" alt="clubsmate logo" />
          </a>
          <div className="menu-tab">
            <div className="menu-items">
              <Link to="/" className="nav-item">
                Home
              </Link>
              <Link to="/announcement" className="nav-item">
                Announcements
              </Link>
              <a href="mailto:eaglecouncil@sas.edu.sg" className="nav-item">
                Contact Us
              </a>
            </div>
          </div>

          <div className="user-controls">
            <div className="nav-link-box">
              <Link
                to="/mypage"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                My Page
              </Link>
            </div>
            <div className="nav-link-box" onClick={signOut}>
              Sign Out
            </div>
          </div>
        </div>
      </nav>
    );
  } else {
    // 로그인하지 않은 사용자에게는 아무것도 보여주지 않습니다.
    return null;
  }
}

export default Navbar;
