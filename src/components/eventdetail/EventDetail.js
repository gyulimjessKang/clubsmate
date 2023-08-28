import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "./eventdetail.css";
import { useParams } from "react-router-dom";

const EventDetail = () => {
  // clubName을 props로 받음
  const { club_name, event_name } = useParams();
  const [clubData, setClubData] = useState(null);
  const [clubEvents, setClubEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClubData = async () => {
      const firestore = firebase.firestore();
      const clubInfoRef = firestore.collection("ClubInfo").doc(club_name);

      try {
        const clubDataSnapshot = await clubInfoRef.get();
        if (clubDataSnapshot.exists) {
          setClubData(clubDataSnapshot.data());
        } else {
          console.log("*** no clubData.");
          setClubData(null);
        }
      } catch (error) {
        console.log(`Error getting club data for ${club_name}:`, error);
        setClubData(null);
      }
      setIsLoading(false);
    };

    fetchClubData();
  }, [club_name]);

  useEffect(() => {
    const fetchClubEvent = async () => {
      const eventsCollection = firebase.firestore().collection("Events");

      try {
        const eventDoc = await eventsCollection
          .doc(club_name)
          .collection("ClubEvents")
          .doc(event_name)
          .get();

        if (eventDoc.exists) {
          // 해당 이벤트 문서가 있으면 해당 이벤트 정보를 가져와서 setClubEvents로 상태 업데이트
          setClubEvents([eventDoc.data()]);
        } else {
          // 해당 이벤트 문서가 없으면 처리 (예: 에러 메시지 표시 등)
          setClubEvents([]);
        }
      } catch (error) {
        console.log(
          `Error getting event ${event_name} for club ${club_name}:`,
          error
        );
        setClubEvents([]);
      }
    };

    fetchClubEvent();
  }, [club_name, event_name]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const hashTags =
    clubData && clubData.hash_tag ? clubData.hash_tag.split(",") : [];
  const startDate =
    clubEvents && clubEvents.length > 0 ? clubEvents[0].start_date : "None";
  const location =
    clubEvents && clubEvents.length > 0 ? clubEvents[0].location : "None";
  const eventDescription =
    clubEvents && clubEvents.length > 0
      ? clubEvents[0].event_description
      : "None";
  const applyLink =
    clubEvents && clubEvents.length > 0 ? clubEvents[0].apply_link : "";
  const inquiryLink =
    clubEvents && clubEvents.length > 0 ? clubEvents[0].contact_link : "";

  const handleApplyNowClick = () => {
    if (applyLink !== "") {
      const absoluteURL = new URL(applyLink, window.location.origin);
      window.open(absoluteURL.href);
    }
  };

  console.log("clubEvents : ", clubEvents);
  console.log("startDate : ", startDate);

  return (
    <div className="container-event-detail">
      <div className="event-box-section">
        <div className="event-left-info-section">
          <div className="event-logo-section">
            {/* club logo */}
            <img
              src={
                clubData.club_logo === "N/A"
                  ? "/img/clubLogo_v2.png"
                  : clubData.club_logo
              }
              alt={`${clubData.club_name} logo`}
              className="clubLogo"
            />
          </div>
          <div className="event-ask-section">
            {applyLink !== "" && (
              <div className="apply-button" onClick={handleApplyNowClick}>
                <div className="text-section">apply now</div>
                <div className="right-icon-section">
                  <img
                    src="/img/caret-right-fill-white.svg"
                    className="arrow-icon"
                  />
                </div>
              </div>
            )}
            <div className="inquiry-button" onClick={""}>
              <div className="text-section">inquiry</div>
              <div className="right-icon-section">
                <img
                  src="/img/caret-right-fill-blue.svg"
                  className="arrow-icon"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="event-right-description-section">
          <div className="event-right-first-header-section">
            <div className="hashtag-box-section">
              {hashTags.map((tag) => (
                <div key={tag} className="hashtag-box">
                  {tag.trim()} {/* 공백 제거 */}
                </div>
              ))}
            </div>
            <div className="additional-info-section">
              <div className="event-holder-button">{club_name}</div>
              <div className="calendar-button">Add to Calendar</div>
            </div>
          </div>
          <div className="event-right-headline-section">{event_name}</div>
          <div className="event-right-sub-info-section">
            <img src="/img/Icon_date.svg" className="sub-info-icon" />
            <div className="sub-info-datetime-text">{startDate}</div>
            <img src="/img/locationIcon.svg" className="sub-info-icon" />
            <div className="sub-info-location-text">{location}</div>
          </div>
          <div className="event-right-description-text-section">
            {eventDescription}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
