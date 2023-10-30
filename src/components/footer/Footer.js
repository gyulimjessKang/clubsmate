import React, { useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import "./footer.css";

function Footer() {
  const { currentUser } = useContext(AuthContext);

  
  // 로그인 한 사용자에게만 Navbar를 보여줍니다.
  if (currentUser) {
    return (
     <div className=" background">
      <p>© Eagle Council. All rights reserved 2023.</p>
     </div>
    );
  } else {
    // 로그인하지 않은 사용자에게는 아무것도 보여주지 않습니다.
    return null;
  }
}

export default Footer;
