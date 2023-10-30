import React, { useEffect, useState, createContext } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const db = firebase.firestore();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        const emailHandle = user.email.split('@')[0];
        db.collection('Users').doc(emailHandle)
          .onSnapshot((doc) => {
            const userDoc = doc.data();
            // check isSuperUser field
            if (userDoc && userDoc.isSuperUser) {
              setIsAdmin(true);
            } else {
              // check JoinClub collection
              db.collection('Users').doc(emailHandle).collection('JoinClub')
                .onSnapshot((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    const clubDoc = doc.data();
                    if (clubDoc.user_role === '1' || clubDoc.user_role === '2') {
                      setIsAdmin(true);
                    }
                  });
                });
            }
          });
      } else {
        setIsAdmin(false);
      }
    });
  }, [db]);


  if(loading){
	  return null;
  }

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, isAdmin, setIsAdmin }}>  {/* isAdmin과 setIsAdmin 제공 */}
      {children}
    </AuthContext.Provider>
  );
};
