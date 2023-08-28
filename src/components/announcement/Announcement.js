import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "./announcement.css";

const Announcement = () => {
  const [announcementData, setAnnouncementData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Announcements 컬렉션에서 모든 문서 가져오기
    const fetchAnnouncements = async () => {
      const firestore = firebase.firestore();
      const announcementsCollection = firestore.collection("Announcements");

      try {
        const snapshot = await announcementsCollection.get();
        const announcementsData = snapshot.docs.map((doc) => doc.data());
        setAnnouncementData(announcementsData);
      } catch (error) {
        console.log("Error fetching announcements:", error);
        setAnnouncementData([]);
      }
      setIsLoading(false);
    };

    fetchAnnouncements();
  }, []);

  const handleApplyClick = (applyLink) => {
    window.open(applyLink, "_blank");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="container-announcement-detail">
  {announcementData.length === 0 ? (
    <div>No Announcement.</div>
  ) : (
    announcementData.map((announcement, index) => (
      <div className="announcement-description-section" key={index}>
        <div className="announcement-first-header-section">
          <div className="hashtag-box-section">
            {announcement.hash_tag &&
              announcement.hash_tag.split(", ").map((tag, index) => (
                <div key={index} className="hashtag-box">
                  {tag.trim()}
                </div>
              ))}
          </div>
          <div className="additional-info-section">
            <div className="announcement-holder-button">
              <a href="mailto:eaglecouncil@sas.edu.sg" className="nav-item">
                {announcement.manager_name}
              </a>
            </div>
            <div
              className="announcement-apply-button"
              onClick={() => handleApplyClick(announcement.apply_link)}
            >
              apply
            </div>
          </div>
        </div>
        <div className="announcement-headline-section">
          {announcement.announcement_name}
        </div>
        <div className="announcement-sub-info-section">
          <img src="/img/Icon_date.svg" className="sub-info-icon" />
          <div className="sub-info-datetime-text">
            {announcement.start_date}
          </div>
          <img src="/img/locationIcon.svg" className="sub-info-icon" />
          <div className="sub-info-location-text">
            {announcement.location}
          </div>
        </div>
        <div className="announcement-description-text-section">
          {announcement.announcement_description}
        </div>
      </div>
    ))
  )}
</div>

  );
};

export default Announcement;
