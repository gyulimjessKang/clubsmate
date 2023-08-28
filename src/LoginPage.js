// LoginPage.js
import React, { useState, useContext } from "react";
import { firebase, auth } from "./firebase";
import './styles/GoogleSignInButton.css';
import './styles/Login.css'
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, setIsAdmin } = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState('');

  const handleIsAdmin = async (email_handle, userDocSnapshot) => {
    if (userDocSnapshot.data().isSuperUser) {
      return true;
    } else {
      const joinClubCollectionSnapshot = await firebase.firestore().collection('Users').doc(email_handle).collection("JoinClub").get();
      if (!joinClubCollectionSnapshot.empty) {
        for (const doc of joinClubCollectionSnapshot.docs) {
          if (doc.data().user_role === '1') {
            return true;
          }
        }
      }
    }
    return false;
  }

  const signInWithGoogle = async () => {
    try {
      const result = await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      console.log(result.user);

      const email = result.user.email;
      const email_handle = email.substring(0, email.lastIndexOf("@"));
      const domain = email.substring(email.lastIndexOf("@") + 1);

      if (domain !== 'sas.edu.sg') {
        await auth.signOut();
        console.log('Only members of the SAS community may access this page. Please log in with sas.edu.sg account!');
        setErrorMsg('Only members of the SAS community may access this page. Please log in with sas.edu.sg account');
      } else {
        const userDocRef = firebase.firestore().collection("Users").doc(email_handle);
        const userDocSnapshot = await userDocRef.get();

        if (!userDocSnapshot.exists) {
          await userDocRef.set({
            email: email,
            isSuperUser: false,
          });
        }

        const isAdminStatus = await handleIsAdmin(email_handle, userDocSnapshot);
        setIsAdmin(isAdminStatus);

        let { from } = location.state || { from: { pathname: "/" } };
        navigate(from);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className=" login-background">
    {/* <div><img src="/img/saslogo.png" /></div> */}
    <div className="Title">
      Welcome to SAS General Club Portal - CLUBSMATE!
    </div>
    <div className="googleLoginButton">
      <button onClick={signInWithGoogle} className="google-btn" type="button">
        <span className="google-icon-wrapper">
          <img className="google-icon"
            src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" />
        </span>
        <span className="google-btn-text">Sign in with Google</span>
      </button>
    </div>
    {errorMsg && <p>{errorMsg}</p>}
  </div>
  );
};

export default LoginPage;