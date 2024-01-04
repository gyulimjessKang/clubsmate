import React, { useEffect, useState, useContext } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "./clubdetail.css";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";

const ClubDetail = () => {
  const { club_name } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [clubData, setClubData] = useState(null);
  const [clubEvents, setClubEvents] = useState([]);
  const emailHandle = currentUser.email.split("@")[0];
  const userDocRef = firebase.firestore().collection("Users").doc(emailHandle);

  const handleJoin = async () => {
    const joinClubCollectionRef = userDocRef.collection("JoinClub");
    const clubDocRef = joinClubCollectionRef.doc(club_name);
    const clubDocSnapshot = await clubDocRef.get();

    if (!clubDocSnapshot.exists) {
      try {
        await clubDocRef.set({
          club_leader: "",
          user_role: "0",
        });
        alert("Success!");
      } catch (error) {
        console.error("Error writing document: ", error);
        alert("Failed.");
      }

    }
  };

  useEffect(() => {
    const firestore = firebase.firestore();
    const clubInfoRef = firestore.collection("ClubInfo").doc(club_name);
    console.log(club_name);

    clubInfoRef.get().then((querySnapshot) => {
      if (!querySnapshot.empty) {
        setClubData(querySnapshot.data());
        console.log(clubData);
      } else {
      }
    });
  }, [club_name]);

  useEffect(() => {
    const fetchClubEvents = async () => {
      const eventsCollection = firebase.firestore().collection("Events");
      let allEvents = [];

      try {
        const clubEventsSnapshot = await eventsCollection
          .doc(club_name)
          .collection("ClubEvents")
          .get();

        clubEventsSnapshot.forEach((eventDoc) => {
          let eventData = eventDoc.data();
          eventData.id = eventDoc.id;
          allEvents.push(eventData);
        });
      } catch (error) {
        console.log(`Error getting events for club ID ${club_name}:`, error);
      }

      setClubEvents(allEvents);
    };

    fetchClubEvents();
  }, [club_name]);

  console.log(clubEvents);

  if (!clubData) {
    return <div>Loading...</div>;
  }
  let Instagram = null;
  if (
    clubData.social_media_links &&
    clubData.social_media_links.split("@")[0] === "Instagram: "
  ) {
    const sns_links = clubData.social_media_links.split("@")[1];
    console.log(sns_links);
    Instagram = "https://www.instagram.com/" + sns_links;
  }
  const hashTags =
    clubData && clubData.hash_tag ? clubData.hash_tag.split(",") : [];

  return (
    <div className="container-club-detail">
      <div className="left-section">
        <div className="clublogoBox">
          <img
            src={
              clubData.club_logo === "N/A"
                ? "/img/clubLogo.png"
                : clubData.club_logo
            }
            alt={`${clubData.club_name} logo`}
            className="clubLogo"
          />
        </div>
        <div className="linksBox">
          <div className="joinButton" type="button" onClick={handleJoin}>
            <div className="text-section">Join</div>
            <div className="right-icon-section">
              <img
                src="/img/caret-right-fill-white.svg"
                className="arrow-icon"
                alt="arrow icon"
              />
            </div>
          </div>
          {Instagram && (
            <div className="linkButton" type="button">
              <a
                href={Instagram}
                role="button"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline text-section"
              >
                Instagram
              </a>
              <div className="right-icon-section">
                <img
                  src="/img/caret-right-fill-blue.svg"
                  className="arrow-icon"
                  alt ="arrow icom"
                />
              </div>
            </div>
          )}

          <div className="linkButton" type="button">
            <a
              href="mailto:eaglecouncil@sas.edu.sg"
              role="button"
              
              className="no-underline text-section"
            >
              Contact Us
            </a>
            <div className="right-icon-section">
              <img
                src="/img/caret-right-fill-blue.svg"
                className="arrow-icon"
                alt = "arrow icon"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="right-section">
        <div className="informationBox">
          <div className="tagBox">
            {hashTags.map((tag) => (
              <div key={tag} className="hashtag-box">
                {tag.trim()} {/* 공백 제거 */}
              </div>
            ))}
            <div className="categoryBox">
              <div className="category">{clubData.category}</div>
            </div>
          </div>
          <div className="titleBox">{clubData.club_name}</div>
          <div className="memberBox d-flex col">
            <div className="sponsor">Sponsor: {clubData.sponsor}</div>
            <div className="members">
              Officers: {clubData.club_leader}
            </div>
          </div>
          <div className="descBox">
            Club Description: {clubData.description}
          </div>
          <div className="missionBox">Mission: {clubData.mission}</div>
        </div>
        <div className="activityBox">
          <div className="pastBox">
            <div className="pastTitle">Past Activities</div>
            <div className="pastContent">{clubData.past_activities}</div>
          </div>
          <div className="scheduleBox">
            <div className="meetingBox">
              <div className=" d-flex col justify-space-between">
                <div className="subTitle"> Meeting Details</div>
                <div className="calendar-button" type="button">
                  Add to Calendar
                </div>
              </div>
              <div className="meetingDetailBox">
                <div className="d-flex col">
                  <div className="detailTitle">Meeting Frequency</div>
                  <div className="detailContent">
                    {clubData.meeting_frequency}
                  </div>
                </div>
                <div className="d-flex col">
                  <div className="detailTitle">Meeting Time</div>
                  <div className="detailContent">{clubData.meeting_date}</div>
                </div>
                <div className="d-flex col">
                  <div className="detailTitle">Meeting Location</div>
                  <div className="detailContent">{clubData.location}</div>
                </div>
              </div>
            </div>
            <div className="eventBox">
              <div className=" d-flex col justify-space-between">
                <div className="subTitle"> Club Upcoming Events</div>
                <div className="calendar-button" type="button">
                  Add to Calendar
                </div>
              </div>
              <div className="eventDetailBox">
                {clubEvents.length > 0 ? (
                  clubEvents.map((event) => (
                    <div key={event.id} className="individualEvent">
                      <div className="d-flex col">
                        <div className="detailTitle">Event Name</div>
                        <div className="detailContent">{event.event_name}</div>
                      </div>
                      <div className="d-flex col">
                        <div className="detailTitle">Event Date</div>
                        <div className="detailContent">{event.start_date}</div>
                      </div>

                      <div className="d-flex col">
                        <div className="detailTitle">Event Location</div>
                        <div className="detailContent">{event.location}</div>
                      </div>
                      <div className="d-flex col">
                        <div className="detailTitle">Event Description</div>
                        <div className="detailContent">
                          {event.event_Description}
                        </div>
                      </div>
                      <div className="detailLinkBox">
                        <Link
                          className="detailLink"
                          to={`/eventDetail/${clubData.club_name}/${event.event_name}`}
                        >
                          Go to event details {">"}
                        </Link>{" "}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No upcoming events for this club.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetail;
