import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom"; //
import firebase from "firebase/app";
import "firebase/firestore";
import "./mypage.css";
import { AuthContext } from "../../AuthProvider";

const MyPage = () => {
  const { currentUser, isAdmin } = useContext(AuthContext);
  const emailHandle = currentUser.email.split("@")[0];
  const [selectedClub, setSelectedClub] = useState("");
  const [selectedAuth, setSelectedAuth] = useState("");
  console.log(emailHandle);
  const [clubDetails, setClubDetails] = useState([]);

  const [clubs, setClubs] = useState([]);

  const userDocRef = firebase.firestore().collection("Users").doc(emailHandle);

  const handleClubChange = (e) => {
    setSelectedClub(e.target.value);
  };

  const handleAuthChange = (e) => {
    setSelectedAuth(e.target.value);
  };

  const handleSubmit = () => {
    console.log("handleSubmit called");
    console.log(`Selected Club: ${selectedClub}`);
    console.log(`Selected Auth: ${selectedAuth}`);

    // Call handleCreateRequest only if the selected club name and permissions are not empty strings
    if (selectedClub && selectedAuth) {
      handleCreateRequest();
    } else {
      alert("Please select club name and authority.");
    }
  };

  const handleCreateRequest = async () => {
    try {
      const clubName = selectedClub;
      const requestData = {
        confirm_flag: false,
        confirmed_timestamp: null,
        current_role: "0",
        request_club_leader: selectedAuth,
        request_role: "1",
        request_timestamp: new Date().toString(),
      };

    
      const userRequestDocRef = firebase
        .firestore()
        .collection("RequestAuthority")
        .doc(emailHandle);
      const requestInfoDocRef = userRequestDocRef
        .collection("RequestInfo")
        .doc(clubName);

      
      const userRequestDoc = await userRequestDocRef.get();
      const requestInfoDoc = await requestInfoDocRef.get();

     
      await firebase.firestore().runTransaction(async (transaction) => {
        
        if (!userRequestDoc.exists) {
          transaction.set(userRequestDocRef, {});
        }
        if (!requestInfoDoc.exists) {
          transaction.set(requestInfoDocRef, requestData);
        }
      });

      
      alert("Requested.");
    } catch (error) {
      
      console.error("Error writing to Firestore:", error);
      alert(" Try again.");
    }
  };

  useEffect(() => {
    const fetchJoinedClubs = async () => {
      try {
        const querySnapshot = await userDocRef.collection("JoinClub").get();

        let joinedClubIds = [];
        querySnapshot.forEach((doc) => {
          joinedClubIds.push(doc.id);
        });

        setClubs(joinedClubIds);
      } catch (error) {
        console.log("Error getting JoinClub subcollection:", error);
      }
    };

    fetchJoinedClubs();
  }, [currentUser]);

  useEffect(() => {
    const fetchClubDetails = async () => {
      const clubInfoCollection = firebase.firestore().collection("ClubInfo");
      const clubDetailsArray = [];

      for (const clubId of clubs) {
        try {
          const clubDoc = await clubInfoCollection.doc(clubId).get();

          if (clubDoc.exists) {
            clubDetailsArray.push(clubDoc.data());
          }
        } catch (error) {
          console.log(`Error getting club detail for ID ${clubId}:`, error);
        }
      }

      setClubDetails(clubDetailsArray);
    };

    if (clubs.length > 0) {
      fetchClubDetails();
    }
  }, [clubs]);

  const [clubEvents, setClubEvents] = useState([]);

  useEffect(() => {
    const fetchClubEvents = async () => {
      const eventsCollection = firebase.firestore().collection("Events");
      let allEvents = [];

      for (const clubId of clubs) {
        try {
          const clubEventsSnapshot = await eventsCollection
            .doc(clubId)
            .collection("ClubEvents")
            .get();

          clubEventsSnapshot.forEach((eventDoc) => {
            let eventData = eventDoc.data();
            eventData.id = eventDoc.id; 
            allEvents.push(eventData);
          });
        } catch (error) {
          console.log(`Error getting events for club ID ${clubId}:`, error);
        }
      }

      setClubEvents(allEvents);
    };

    if (clubs.length > 0) {
      fetchClubEvents();
    }
  }, [clubs]);

  function truncateString(str, num) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }

  return (
    <div className="container-my-page">
      <div className="left-info-section">
        <div className="profileBox">
          <img src={currentUser.photoURL} alt="Profile" />{" "}
        </div>
        <div className="quicklinks">
          <div className="quickButton">
            <div className="quickText">
              <a
                className="no-underline"
                href="https://docs.google.com/presentation/d/1Csovb_eIFyEeOnl7Bwid9tbmJ0H7Hq99DdmM2yjCFwo/edit?usp=sharing"
                role="button"
                target="_blank"
                rel="noopener noreferrer"
              >
                General Club Officer Handbook
              </a>
            </div>
            <div className="right-icon-section">
              <img
                src="/img/caret-right-fill-blue.svg"
                className="arrow-icon"
                alt ="arrow icon"
              />
            </div>
          </div>

          <div className="quickButton">
            <div className="quickText ">
              <a
                className="no-underline"
                href="https://docs.google.com/document/d/1SsspDl9OuRsLZxANOP7HirVBuO6vnIrFyHRtMg1DObw/edit?usp=sharing"
                role="button"
                target="_blank"
                rel="noopener noreferrer"
              >
                FINANCE GUIDE
              </a>
            </div>
            <div className="right-icon-section">
              <img
                src="/img/caret-right-fill-blue.svg"
                className="arrow-icon"
                alt ="arrow icon"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="right-info-section">
        <div className="request-my-authority-section">
          <div className="welcomeBox">Welcome {emailHandle}.</div>
          <div className="authBox">
            <div className="authTitle">
              Get your authorization. Select club name & position.
            </div>
            <div className="select-auth-section">
              <div className="select-box-section">
                {clubDetails.length > 0 ? (
                  <select
                    name="clubSelect"
                    id="club-select"
                    onChange={handleClubChange}
                  >
                    <option value="" disabled selected>
                      Select your club
                    </option>
                    {clubDetails.map((club) => (
                      <option key={club.club_name} value={club.club_name}>
                        {club.club_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>You have not joined any clubs yet.</p>
                )}

                <select
                  name="authNameSelect"
                  id="position-select"
                  onChange={handleAuthChange}
                >
                  <option value="" disabled selected>
                    Select your position
                  </option>
                  <option value="president">President</option>
                  <option value="vice-president">Vice President</option>
                  <option value="sponsor">Sponsor</option>
                  <option value="officer">Officer</option>
                </select>
              </div>

              <div
                className="submitButton"
                type="button"
                onClick={handleSubmit}
              >
                Submit
              </div>
            </div>
          </div>
        </div>
        <div className="my-club-info-section">
          <div className="my-clubs-section">
            <div className="clubTitle">My Clubs</div>
            {isAdmin &&(<div type="button" className="adminButton">
              
                <Link to={`/admin`} className="no-underline">
                  Manage My Clubs
                </Link>
              
            </div>)}
            {clubDetails.length > 0 ? (
              <div className="clubList">
                {clubDetails.map((club) => (
                  <div key={club.club_name} className="eachClub">
                    <div className="clubNameTitle">{club.club_name}</div>
                    <div className="clubDesc">
                      Description: {club.description}{" "}
                    </div>
                    <p>
                      <div className="clubDesc">Hashtags: {club.hash_tag}</div>
                    </p>
                    <div type="button" className="adminButton">
                      <Link
                        to={`/clubDetail/${club.club_name}`}
                        className="no-underline"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>You have not joined any clubs yet.</p>
            )}
          </div>

          <div className="club-events-section">
            {/* upcoming Event 가져오기 */}
            <div className="myEventText">Club Events</div>
            {clubEvents.length > 0 ? (
              <table className="eventTable">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Time</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {clubEvents.map((event) => (
                    <tr key={event.id}>
                      <td>{event.event_name}</td>
                      <td>
                        <img
                          src="/img/Icon_date.svg"
                          className="sub-info-icon"
                          alt ="arrow icon"
                        />
                        {event.end_date}
                      </td>
                      <td>
                        <img
                          src="/img/locationIcon.svg"
                          className="sub-info-icon"
                          alt ="arrow icon"
                        />
                        {event.location}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No events available for the clubs you've joined.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
