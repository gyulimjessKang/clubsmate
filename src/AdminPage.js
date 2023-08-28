import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
// import Modal from "./Modal";
import ReactModal from "react-modal";
import "./styles/AdminPage.css";
import { FaSyncAlt } from "react-icons/fa";

const AdminPage = () => {
  const db = firebase.firestore();

  const { currentUser } = useContext(AuthContext);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [clubInfo, setClubInfo] = useState(null);
  const [isClubModalOpen, setClubModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventInfo, setEventInfo] = useState(null);
  const [events, setEvents] = useState([]);
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementInfo, setAnnouncementInfo] = useState(null); // 이 부분 추가
  const [isAnnouncementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [selectedHashTags, setSelectedHashTags] = useState([]);

  const [isSuperUser, setIsSuperUser] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isRequestApproved, setIsRequestApproved] = useState(false);
  const [approvedRequests, setApprovedRequests] = useState([]);

  const [newClubInfo, setNewClubInfo] = useState({
    club_name: "",
    category: "",
    club_logo: "",
    members: "",
    meeting_frequency: "",
    meeting_date: "",
    location: "",
    sponsor: "",
    mission: "",
    past_activities: "",
    social_media_links: "",
    club_leader: "",
    additional_info: "",
    description: "",
    hash_tag: "",
  });

  const [newAnnouncement, setNewAnnouncement] = useState({
    announcement_description: "",
    announcement_name: "",
    apply_link: "",
    contact_link: "",
    end_date: "",
    manager_name: "",
    start_date: "",
    hash_tag: "",
    location: "",
  });

  const hashTagOptions = [
    "Creativity",
    "Math",
    "Competition",
    "Business Skills",
    "Environmental Issues",
    "Teaching",
    "Gender Equality",
    "Health and Wellness",
    "Culture",
    "Research",
    "Music",
    "Writing",
    "Debate",
    "DEI",
    "Games",
    "Science",
    "Hands-On Experiments",
    "Technology",
  ];

  const handleModalInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "hash_tag") {
      let currentHashTags = newClubInfo.hash_tag
        ? newClubInfo.hash_tag.split(",")
        : [];

      if (event.target.checked) {
        if (currentHashTags.length < 3) {
          currentHashTags.push(value);
        } else {
          alert("You can choose maximum 3 hashtags");
          event.target.checked = false;
          return;
        }
      } else {
        currentHashTags = currentHashTags.filter((tag) => tag !== value);
      }
      setNewClubInfo((prev) => ({
        ...prev,
        hash_tag: currentHashTags.join(", "),
      }));
    } else {
      setNewClubInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleModalCreateClub = async () => {
    try {
      await db
        .collection("ClubInfo")
        .doc(newClubInfo.club_name)
        .set(newClubInfo);
      const email_handle = currentUser.email.split("@")[0];
      await db
        .collection("Users")
        .doc(email_handle)
        .collection("JoinClub")
        .doc(newClubInfo.club_name)
        .set({
          club_leader: "",
          user_role: "1",
        });

      setClubModalOpen(false);
    } catch (error) {
      console.error("Error creating new club: ", error);
    }
  };

  const [newEventInfo, setNewEventInfo] = useState({
    event_name: "",
    start_date: "",
    end_date: "",
    event_description: "",
    club_name: "",
    contact_link: "",
    apply_link: "",
    location: "",
  });

  const handleEventModalInputChange = (event) => {
    setNewEventInfo({
      ...newEventInfo,
      [event.target.name]: event.target.value,
    });
  };

  const handleEventModalCreateEvent = async () => {
    try {
      // Check if the document with the selectedClub ID exists
      const docRef = db.collection("Events").doc(selectedClub);
      const doc = await docRef.get();
      if (!doc.exists) {
        // If the document does not exist, create a new document with the selectedClub ID
        await docRef.set({});
      }

      // Create a new event document inside the 'ClubEvents' collection
      await docRef
        .collection("ClubEvents")
        .doc(newEventInfo.event_name)
        .set(newEventInfo);
      setEventModalOpen(false);
    } catch (error) {
      console.error("Error creating new event: ", error);
    }
  };

  const eventInfoKeysOrder = [
    "event_name",
    "start_date",
    "end_date",
    "event_description",
    "club_name",
    "location",
    "contact_link",
    "apply_link",
  ];

  const eventKeyDisplayNames = {
    event_name: "Event Name",
    start_date: "Start Date",
    end_date: "End Date",
    event_description: "Event Description",
    club_name: "Club Name",
    location: "Location",
    contact_link: "Contact Link",
    apply_link: "Apply Link",
  };

  const clubInfoKeysOrder = [
    "club_name",
    "category",
    "club_logo",
    "members",
    "meeting_frequency",
    "meeting_date",
    "location",
    "sponsor",
    "mission",
    "past_activities",
    "social_media_links",
    "club_leader",
    "additional_info",
    "description",
    "hash_tag",
  ];

  const keyDisplayNames = {
    club_name: "Club Name",
    category: "Category",
    club_logo: "Club Logo",
    members: "Club Members",
    meeting_frequency: "Weekly Meeting Frequency",
    meeting_date: "Weekly Meeting Time",
    location: "Club Location",
    sponsor: "Club Sponsor",
    mission: "Club Mission Statement",
    past_activities: "Club Past Activities",
    social_media_links: "Social Media Links",
    club_leader: "Club Leader",
    additional_info: "Additional Information",
    description: "Club Description",
    hash_tag: "Club Hashtag (You can choose maximum 3 hashtags)",
  };

  useEffect(() => {
    if (currentUser) {
      const email_handle = currentUser.email.split("@")[0];
      firebase
        .firestore()
        .collection("Users")
        .doc(email_handle)
        .get()
        .then((doc) => {
          if (doc.exists && doc.data().isSuperUser) {
            setIsSuperUser(true);
            firebase
              .firestore()
              .collection("ClubInfo")
              .get()
              .then((querySnapshot) => {
                let clubsArray = [];
                querySnapshot.forEach((doc) => {
                  clubsArray.push(doc.id);
                });
                setClubs(clubsArray);
              });
          } else {
            firebase
              .firestore()
              .collection("Users")
              .doc(email_handle)
              .collection("JoinClub")
              .where("user_role", "in", ["1", "2"])
              .get()
              .then((querySnapshot) => {
                let clubsArray = [];
                querySnapshot.forEach((doc) => {
                  clubsArray.push(doc.id);
                });
                setClubs(clubsArray);
              });
          }
        });
    } else {
      setIsSuperUser(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedClub) {
      firebase
        .firestore()
        .collection("ClubInfo")
        .doc(selectedClub)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setClubInfo(doc.data());
          }
        });
    }
  }, [selectedClub]);

  useEffect(() => {
    if (selectedClub) {
      const docRef = db.collection("Events").doc(selectedClub);

      const unsubscribe = docRef
        .collection("ClubEvents")
        .onSnapshot((querySnapshot) => {
          let eventsArray = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (
              data.start_date &&
              typeof data.start_date.toDate === "function"
            ) {
              data.start_date = data.start_date.toDate().toISOString();
            } else {
              data.start_date = "None";
            }
            if (data.end_date && typeof data.end_date.toDate === "function") {
              data.end_date = data.end_date.toDate().toISOString();
            } else {
              data.end_date = "None";
            }
            eventsArray.push({ ...data, id: doc.id });
          });
          setEvents(eventsArray);
        });
      // Clean up the subscription
      return () => unsubscribe();
    }
  }, [selectedClub, db]);

  useEffect(() => {
    if (selectedEvent) {
      const docRef = db.collection("Events").doc(selectedClub);
      docRef
        .collection("ClubEvents")
        .doc(selectedEvent)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setEventInfo(doc.data());
          }
        });
    }
  }, [selectedEvent, selectedClub, db]);

  useEffect(() => {
    // 'Announcements' 컬렉션에 바로 존재하는 문서들 가져오기
    const fetchAnnouncements = async () => {
      try {
        const querySnapshot = await firebase
          .firestore()
          .collection("Announcements")
          .get();
        console.log("querySnapshot: ", querySnapshot);
        const announcementsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAnnouncements(announcementsArray);
      } catch (error) {
        console.error("Error fetching announcements: ", error);
      }
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    // RequestAuthority 컬렉션의 모든 문서들을 가져옵니다.
    const getRequests = async () => {
      try {
        const querySnapshot = await firebase
          .firestore()
          .collection("RequestAuthority")
          .get();
        const requestList = [];

        querySnapshot.forEach((doc) => {
          // 각 문서에서 confirm_flag가 false인 RequestInfo 컬렉션의 문서들을 가져옴
          const requestInfoRef = doc.ref
            .collection("RequestInfo")
            .where("confirm_flag", "==", false);
          requestInfoRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // 가져온 문서들을 requestList에 추가합니다.
              requestList.push({
                emailHandle: doc.ref.parent.parent.id, // userEmail을 AuthorityRequest 컬렉션의 문서 ID로 사용
                clubName: doc.id, // clubName을 RequestInfo 컬렉션의 문서 ID로 사용
                confirmFlag: doc.data().confirm_flag,
                confirmedTimestamp: doc.data().confirmed_timestamp,
                currentRole: doc.data().current_role,
                requestClubLeader: doc.data().request_club_leader,
                requestRole: doc.data().request_role,
                requestTimestamp: doc.data().request_timestamp,
              });
            });
            setRequests(requestList);
          });
        });
      } catch (error) {
        console.error("*** Request error raised:", error);
      }
    };

    getRequests();
  }, []);

  const handleSelectChange = (e) => {
    setSelectedClub(e.target.value);
  };

  const handleInputChange = (e) => {
    setClubInfo({ ...clubInfo, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    if (selectedClub && clubInfo) {
      firebase
        .firestore()
        .collection("ClubInfo")
        .doc(selectedClub)
        .update(clubInfo)
        .then(() => {
          alert("Done.");
          console.log("Document successfully updated!");
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    }
  };

  const handleHashTagChange = (event) => {
    if (event.target.checked) {
      if (selectedHashTags.length < 3) {
        setSelectedHashTags((prev) => [...prev, event.target.value]);
      } else {
        alert("You can choose maximum 3 hashtags");
        event.target.checked = false;
      }
    } else {
      setSelectedHashTags((prev) =>
        prev.filter((tag) => tag !== event.target.value)
      );
    }
  
    if (clubInfo) {
      const updatedHashTags = selectedHashTags.length < 3 ? [...selectedHashTags, event.target.value] : selectedHashTags;
      const updatedClubInfo = { ...clubInfo, hash_tag: updatedHashTags.join(", ") };
      setClubInfo(updatedClubInfo);
      
    }
  };
    
  const handleEventSelectChange = (e) => {
    setSelectedEvent(e.target.value);
    const selectedEvent = events.find((event) => event.id === e.target.value);
    setEventInfo(selectedEvent);
  };

  const handleEventInputChange = (e) => {
    setEventInfo({ ...eventInfo, [e.target.name]: e.target.value });
    console.log("2. eventInfo:", eventInfo);
  };

  const handleEventUpdate = () => {
    if (selectedEvent && eventInfo) {
      const docRef = db.collection("Events").doc(selectedClub);

      docRef
        .collection("ClubEvents")
        .doc(selectedEvent)
        .update(eventInfo)
        .then(() => {
          console.log("Event document successfully updated!");
        })
        .catch((error) => {
          console.error("Error updating event document: ", error);
        });
    }
  };

  const handleAnnouncementModalInputChange = (event) => {
    setNewAnnouncement({
      ...newAnnouncement,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreateAnnouncement = async () => {
    try {
      await db.collection("Announcements").add(newAnnouncement);
      setAnnouncementModalOpen(false);
    } catch (error) {
      console.error("Error creating new announcement: ", error);
    }
  };

  const handleAnnouncementSelectChange = (e) => {
    const announcementId = e.target.value;
    if (announcementId) {
      setSelectedAnnouncement(announcementId);
      const selectedAnnouncement = announcements.find(
        (announcement) => announcement.id === announcementId
      );
      if (selectedAnnouncement) {
        setAnnouncementInfo(selectedAnnouncement);
      }
      setShowUpdateButton(true);
    } else {
      setSelectedAnnouncement(null);
      setAnnouncementInfo(null);
      setShowUpdateButton(false);
    }
  };

  const updateAnnouncementInfo = async () => {
    try {
      if (selectedAnnouncement && announcementInfo) {
        await db
          .collection("Announcements")
          .doc(selectedAnnouncement)
          .update(announcementInfo);
        console.log("Announcement document successfully updated!");
      }
    } catch (error) {
      console.error("Error updating announcement document: ", error);
    }
  };

  const handleAnnouncementInputChange = (event) => {
    const { name, value } = event.target;
    setAnnouncementInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleApproveRequest = async (request) => {
    try {
      // Users 컬렉션에서 Email Handle을 문서 ID로 하는 문서를 찾아서 JoinClub 컬렉션 안에서 Club Name을 문서 ID로 하는 문서를 업데이트시킴
      await firebase
        .firestore()
        .collection("Users")
        .doc(request.emailHandle)
        .collection("JoinClub")
        .doc(request.clubName)
        .update({
          user_role: request.requestRole, // Request User Role 값으로 업데이트
          club_leader: request.requestClubLeader, // Request Club Leader 값으로 업데이트
        });

      // RequestInfo 컬렉션의 해당 문서를 업데이트
      await firebase
        .firestore()
        .collection("RequestAuthority")
        .doc(request.emailHandle)
        .collection("RequestInfo")
        .doc(request.clubName)
        .update({
          confirm_flag: true, // confirm_flag를 true로 업데이트
          confirmed_timestamp: new Date().toString(), // 현재 시간을 문자열로 변환하여 confirmed_timestamp로 업데이트
          current_role: request.requestRole, // Request User Role 값으로 업데이트
        });
      setIsRequestApproved(true);
      setApprovedRequests((prev) => [...prev, request.emailHandle]);
      console.log(">>> Document insertion completed");
    } catch (error) {
      setIsRequestApproved(false);
      console.error("Request Approve 오류:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const querySnapshot = await firebase
        .firestore()
        .collection("RequestAuthority")
        .get();
      const requestList = [];

      querySnapshot.forEach((doc) => {
        const requestInfoRef = doc.ref
          .collection("RequestInfo")
          .where("confirm_flag", "==", false);
        requestInfoRef.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            requestList.push({
              emailHandle: doc.ref.parent.parent.id,
              clubName: doc.id,
              confirmFlag: doc.data().confirm_flag,
              confirmedTimestamp: doc.data().confirmed_timestamp,
              currentRole: doc.data().current_role,
              requestClubLeader: doc.data().request_club_leader,
              requestRole: doc.data().request_role,
              requestTimestamp: doc.data().request_timestamp,
            });
          });
          setRequests(requestList);
          console.log(">>> refresh success");
        });
      });
    } catch (error) {
      console.error("*** Request error raised:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRefreshTable = () => {
    // 새로고침 버튼 클릭 시, 테이블 데이터를 다시 불러와서 테이블 정보를 갱신
    fetchRequests();
  };

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("User signed out successfully.");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  // 인풋 박스의 스타일 동적으로 설정
  const setInputWidth = () => {
    const input = document.getElementById("my-input");
    if (input) {
      input.style.width = "100%"; // 화면 전체 가로 길이로 늘리기
    }
  };

  const handleCreateRequest = async () => {
    try {
      const emailHandle = "maillard.lee"; // 여기에 로그인한 사용자의 이메일에서 '@'을 기준으로 앞에 있는 문자열(email handle)을 가져오는 코드를 추가해야 함.
      const clubName = "Bio Lab"; // 여기에 권한 신청하려는 클럽 이름을 저장
      const requestData = {
        confirm_flag: false,
        confirmed_timestamp: null,
        current_role: "0",
        request_club_leader: "Vice President",
        request_role: "1",
        request_timestamp: new Date().toString(),
      };

      // RequestAuthority 컬렉션 안의 해당 사용자의 문서에 RequestInfo 컬렉션을 추가
      const userRequestDocRef = firebase
        .firestore()
        .collection("RequestAuthority")
        .doc(emailHandle);
      const requestInfoDocRef = userRequestDocRef
        .collection("RequestInfo")
        .doc(clubName);

      // 먼저 문서를 읽어옴
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

      // Users 컬렉션에서 해당 emailHandle을 문서ID로 하는 문서를 가져오기
      const userDocRef = firebase
        .firestore()
        .collection("Users")
        .doc(emailHandle);
      const userDocSnapshot = await userDocRef.get();

      // 해당 문서가 존재하지 않으면 Users 컬렉션과 JoinClub 컬렉션에 문서를 생성
      if (!userDocSnapshot.exists) {
        await userDocRef.set({});
        await userDocRef.collection("JoinClub").doc(clubName).set({
          club_leader: "",
          user_role: "0",
        });
      } else {
        // JoinClub 컬렉션 안에서 해당 clubName을 문서 ID로 하는 문서를 가져오기
        const clubDocRef = userDocRef.collection("JoinClub").doc(clubName);
        const clubDocSnapshot = await clubDocRef.get();

        // 해당 문서가 존재하지 않으면 JoinClub 컬렉션에 문서를 생성
        if (!clubDocSnapshot.exists) {
          await clubDocRef.set({
            club_leader: "",
            user_role: "0",
          });
        }
      }

      console.log(">>> Document insertion completed");
    } catch (error) {
      console.error("*** Request error raised", error);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>SAS Club Manager Admin Page</h1>
        <div className="user-info">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "25px",
            }}
          >
            <h4 style={{ marginRight: "10px" }}>You are logged in as</h4>
            {currentUser.email}
          </div>
        </div>
      </div>

      <div className="club-info-section">
        <h2 className="club-info-header">
          {selectedClub ? `1. Club Info: ${selectedClub}` : "Club Info"}
        </h2>
        <button
          className="create-button"
          onClick={() => setClubModalOpen(true)}
        >
          Create Club
        </button>
        <ReactModal
          className="modal-content"
          isOpen={isClubModalOpen}
          onRequestClose={() => setClubModalOpen(false)}
        >
          <div className="modal-background-box">
            <h2>Create New Club</h2>
            {clubInfoKeysOrder.map((key) => (
              <div
                key={key}
                className={`input-container ${
                  key === "mission" ||
                  key === "past_activities" ||
                  key === "description" ||
                  key === "additional_info"
                    ? "modal-activities"
                    : ""
                }`}
              >
                <p>
                  <label>{keyDisplayNames[key] || key}</label>
                  {key === "hash_tag" ? (
                    hashTagOptions.map((option) => (
                      <div key={option}>
                        <input
                          type="checkbox"
                          name={key}
                          value={option}
                          onChange={handleModalInputChange}
                          checked={(newClubInfo[key] || "")
                            .split(",")
                            .includes(option)}
                        />
                        <label>{option}</label>
                      </div>
                    ))
                  ) : (
                    <textarea
                      className="input-textarea"
                      name={key}
                      value={newClubInfo[key] || ""}
                      onChange={handleModalInputChange}
                      required={key === "club_name"}
                      onFocus={setInputWidth}
                      placeholder={
                        key === "club_name" ? "'Club Name' is required" : ""
                      }
                    />
                  )}
                </p>
              </div>
            ))}
            <div className="modal-buttons">
              <div
                className="modal-create-button"
                onClick={handleModalCreateClub}
                disabled={!newClubInfo.club_name}
              >
                Create Club
              </div>
              <div
                className="modal-cancel-button"
                onClick={() => setClubModalOpen(false)}
              >
                Cancel
              </div>
            </div>
          </div>
        </ReactModal>
        <p>
          <select className="select" onChange={handleSelectChange}>
            <option value="">select club</option>
            {clubs.map((club) => (
              <option key={club} value={club}>
                {club}
              </option>
            ))}
          </select>
        </p>
        {selectedClub &&
          clubInfo &&
          clubInfoKeysOrder.map((key, index) => (
            <div
              key={key}
              className={`input-container ${
                key === "past_activities" || key === "mission"
                  ? "activities"
                  : ""
              }`}
            >
              <p>
                {index + 1}. {keyDisplayNames[key] || key} :{" "}
                {clubInfo[key] || ""}
              </p>

              {key === "hash_tag" ? (
                hashTagOptions.map((option, idx) => (
                  <div key={idx}>
                    <input
                      type="checkbox"
                      name={key}
                      value={option}
                      onChange={handleHashTagChange}
                    />
                    <label>{option}</label>
                  </div>
                ))
              ) : (
                <textarea
                  name={key}
                  value={clubInfo[key] || ""}
                  onChange={handleInputChange}
                  onFocus={setInputWidth}
                />
              )}
            </div>
          ))}
        <p>
          {selectedClub && clubInfo && (
            <button className="update-button" onClick={handleUpdate}>
              Update Club
            </button>
          )}
        </p>
      </div>

      <div className="club-event-section">
        <p>
          <br />
          <h2>
            {selectedClub
              ? `2. Event Info: ${selectedClub}`
              : "Event Info (You must select the club first)"}
          </h2>
        </p>
        <button
          className="create-button"
          onClick={() => setEventModalOpen(true)}
        >
          Create Event
        </button>
        <ReactModal
          className="modal-content"
          isOpen={isEventModalOpen}
          onRequestClose={() => setEventModalOpen(false)}
        >
          <div className="modal-background-box">
            <h2>Create New Event</h2>
            {eventInfoKeysOrder.map((key) => (
              <div
                key={key}
                className={`input-container ${
                  key === "event_description" ? "modal-activities" : ""
                }`}
              >
                <p>
                  <label>{eventKeyDisplayNames[key] || key}</label>
                  <textarea
                    className="input-textarea"
                    name={key}
                    value={newEventInfo[key] || ""}
                    onChange={handleEventModalInputChange}
                    required={key === "event_name"}
                    onFocus={setInputWidth}
                  />
                </p>
              </div>
            ))}
            <div className="modal-buttons">
              <div
                className="modal-create-button"
                onClick={handleEventModalCreateEvent}
                disabled={!newEventInfo["event_name"]}
              >
                Create Event
              </div>
              <div
                className="modal-cancel-button"
                onClick={() => setEventModalOpen(false)}
              >
                Cancel
              </div>
            </div>
          </div>
        </ReactModal>
        <p>
          <select className="select" onChange={handleEventSelectChange}>
            <option value="">select event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.event_name}
              </option>
            ))}
          </select>
        </p>

        {selectedEvent &&
          eventInfo &&
          eventInfoKeysOrder.map((key, index) => (
            <div
              key={key}
              className={`input-container ${
                key === "event_description" ? "activities" : ""
              }`}
            >
              <p>
                {index + 1}. {eventKeyDisplayNames[key] || key} :{" "}
              </p>
              <textarea
                name={key}
                value={eventInfo[key] || ""}
                onChange={handleEventInputChange}
                onFocus={setInputWidth}
              />
            </div>
          ))}
        <p>
          {selectedEvent && eventInfo && (
            <button className="update-button" onClick={handleEventUpdate}>
              Update Event
            </button>
          )}
        </p>
      </div>

      <div className="announcement-section">
        {isSuperUser && (
          <p>
            <br />
            <h2>Announcement Info</h2>
          </p>
        )}
        {isSuperUser && (
          <button
            className="create-button"
            onClick={() => setAnnouncementModalOpen(true)}
          >
            Create Announcement
          </button>
        )}
        {/* Announcement 정보 입력용 모달 창 */}
        <ReactModal
          className="modal-content"
          isOpen={isAnnouncementModalOpen}
          onRequestClose={() => setAnnouncementModalOpen(false)}
        >
          <div className="modal-background-box">
            <h2>Create New Announcement</h2>
            {Object.keys(newAnnouncement).map((key) => (
              <div
                key={key}
                className={`input-container ${
                  key === "announcement_description" ? "modal-activities" : ""
                }`}
              >
                <p>
                  <label>
                    {key === "announcement_name"
                      ? "Announcement Title"
                      : key === "announcement_description"
                      ? "Announcement Description"
                      : key === "contact_link"
                      ? "Contact Link"
                      : key === "end_date"
                      ? "End Date"
                      : key === "start_date"
                      ? "Start Date"
                      : key === "apply_link"
                      ? "Apply Link"
                      : key === "manager_name"
                      ? "Manager Name"
                      : key.replace("_", " ")}
                  </label>
                  <textarea
                    className="input-textarea"
                    name={key}
                    value={newAnnouncement[key]}
                    onChange={handleAnnouncementModalInputChange}
                    required
                    onFocus={setInputWidth}
                  />
                </p>
              </div>
            ))}
            <div className="modal-buttons">
              <div
                className="modal-create-button"
                onClick={handleCreateAnnouncement}
              >
                Create Announcement
              </div>
              <div
                className="modal-cancel-button"
                onClick={() => setAnnouncementModalOpen(false)}
              >
                Cancel
              </div>
            </div>
          </div>
        </ReactModal>
        {isSuperUser && (
          <p>
            <select
              className="select"
              onChange={handleAnnouncementSelectChange}
            >
              <option value="">select announcement</option>
              {announcements.map((announcement) => (
                <option key={announcement.id} value={announcement.id}>
                  {announcement.announcement_name}
                </option>
              ))}
            </select>
          </p>
        )}
        {selectedAnnouncement !== null && announcementInfo !== null && (
          <div>
            <p>Announcement Title: {announcementInfo.announcement_name}</p>
            <textarea
              name="announcement_name"
              value={announcementInfo.announcement_name}
              onChange={handleAnnouncementInputChange}
              onFocus={setInputWidth}
            />
            <p>
              Announcement Description:{" "}
              {announcementInfo.announcement_description}
            </p>
            <textarea
              className="announcement-textarea"
              name="announcement_description"
              value={announcementInfo.announcement_description}
              onChange={handleAnnouncementInputChange}
              onFocus={setInputWidth}
            />
            <p>Start Date: {announcementInfo.start_date}</p>
            <textarea
              name="start_date"
              value={announcementInfo.start_date}
              onChange={handleAnnouncementInputChange}
              onFocus={setInputWidth}
            />
            <p>End Date: {announcementInfo.end_date}</p>
            <textarea
              name="end_date"
              value={announcementInfo.end_date}
              onChange={handleAnnouncementInputChange}
              onFocus={setInputWidth}
            />
            <p>Location: {announcementInfo.location}</p>
            <textarea
              name="location"
              value={announcementInfo.location}
              onChange={handleAnnouncementInputChange}
              onFocus={setInputWidth}
            />
            <p>Manager Name: {announcementInfo.manager_name}</p>
            <textarea
              name="manager_name"
              value={announcementInfo.manager_name}
              onChange={handleAnnouncementInputChange}
              onFocus={setInputWidth}
            />
            <p>Contact Link: {announcementInfo.contact_link}</p>
            <textarea
              name="contact_link"
              value={announcementInfo.contact_link}
              onChange={handleAnnouncementInputChange}
              onFocus={setInputWidth}
            />
            <p>Apply Link: {announcementInfo.apply_link}</p>
            <textarea
              name="apply_link"
              value={announcementInfo.apply_link}
              onChange={handleAnnouncementInputChange}
              onFocus={setInputWidth}
            />
            <p>Hashtag: {announcementInfo.hash_tag}</p>
            <textarea
              name="hash_tag"
              value={announcementInfo.hash_tag}
              onChange={handleAnnouncementInputChange}
              onFocus={setInputWidth}
            />
          </div>
        )}
        <p>
          {showUpdateButton && (
            <button className="update-button" onClick={updateAnnouncementInfo}>
              Update Announcement
            </button>
          )}
        </p>
      </div>

      <div className="user-section">
        {isSuperUser && (
          <p>
            <br />
            <div className="sub-headline-section">
              <h2>User Request Info</h2>
            </div>
          </p>
        )}
        <div className="request-table-section">
          {isSuperUser && (
            <button class="refresh-button" onClick={handleRefreshTable}>
              <FaSyncAlt className="refresh-icon" /> refresh table
            </button>
          )}
          {isSuperUser && (
            <p>
              <table>
                <thead>
                  <tr>
                    <th>Club Name</th>
                    <th>Email</th>
                    <th>Current User Role</th>
                    <th>Request User Role</th>
                    <th>Request Club Leader</th>
                    <th>Request Timestamp</th>
                    <th>Confirm Flag</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => (
                    <tr key={index}>
                      <td>
                        <li>{request.clubName}</li>
                      </td>
                      <td>
                        <li>{request.emailHandle}@sas.com</li>
                      </td>
                      <td>
                        <li>{request.currentRole}</li>
                      </td>
                      <td>
                        <li>{request.requestRole}</li>
                      </td>
                      <td>
                        <li>{request.requestClubLeader}</li>
                      </td>
                      <td>
                        <li>{request.requestTimestamp}</li>
                      </td>
                      <td>
                        <li>{request.confirmFlag.toString()}</li>
                      </td>
                      <td>
                        <button
                          className="table-button"
                          onClick={() => {
                            handleApproveRequest(request);
                          }}
                          disabled={approvedRequests.includes(
                            request.emailHandle
                          )}
                        >
                          {approvedRequests.includes(request.emailHandle)
                            ? "approved"
                            : "approve"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </p>
          )}
        </div>

        {/* 기타 화면 컨텐츠 */}
        {/* <p>
          <button className="update-button" onClick={handleCreateRequest}>
            User Authority Request
          </button>
        </p> */}
      </div>
    </div>
  );
};

export default AdminPage;
