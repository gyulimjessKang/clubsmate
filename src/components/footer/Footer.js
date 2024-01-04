import React, { useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import "./footer.css";

function Footer() {
  const { currentUser } = useContext(AuthContext);

  
 
  if (currentUser) {
    return (
     <div className=" background">
      <p>© Eagle Council. All rights reserved 2023.</p>
     </div>
    );
  } else {
    return null;
  }
}

export default Footer;
