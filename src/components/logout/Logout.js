import React from "react";
import { firebase, auth } from "../../firebase"; // 수정된 부분
import "./Logout.css";

const Logout = () => {
  const signOut = () => {
    auth.signOut()
      .then(() => {
        console.log("User signed out");  // 로그아웃한 경우 콘솔에 메시지를 출력합니다.
      })
      .catch((error) => {
        console.log(error.message);  // 에러 메시지를 콘솔에 출력합니다.
      });
  };

  return (
    <>
    <div onClick={signOut} className="signoutButton d-none  d-sm-flex">Sign out</div>
    <div onClick={signOut} className="d-sm-none">
    <i className="fa-solid fa-arrow-right-from-bracket fa-xl"></i>
    </div>
    </>
    
  );
};

export default Logout;
