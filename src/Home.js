import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // 추가
import firebase from 'firebase/app';
import 'firebase/firestore';
import Chat from "./Chat.js";
import './styles/home.css';

const Home = () => {
  const [clubDataList, setClubDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClubData, setFilteredClubData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  
  

  useEffect(() => {
    
    const firestore = firebase.firestore();
    const clubInfoRef = firestore.collection('ClubInfo');
    const categoryRef = firestore.collection('categoryManage');

    clubInfoRef.get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        setClubDataList(data);
        setFilteredClubData(data);
      })
      .catch((error) => {
        console.log('Error getting documents:', error);
      });

    categoryRef.doc("category").get().then((categorydoc) => {
      if (categorydoc.exists) {
        setCategories(Object.keys(categorydoc.data()));
      } else {
        console.log("Can't find the document.");
      }
    })
      .catch((error) => {
        console.log("Data fetch error.", error);
      });
  }, []);

  useEffect(() => {
    // Club data is filtered and updated whenever the search term or selected category changes.
    setFilteredClubData([]);
    const lowerSearchTerm = searchTerm.toLowerCase();
    const lowerSelectedCategory = selectedCategory.toLowerCase();

    const filteredData = clubDataList.filter((club) => {
      // const lowerSearchTerm = searchTerm.toLowerCase();
      const lowerClubName = club.club_name ? club.club_name.toLowerCase() : '';
      const lowerCategory = club.category ? club.category.toLowerCase() : '';
      const lowerMeetingTime = club.meeting_date ? club.meeting_date.toLowerCase() : '';

      // If both the search term and the selected category are unset, all clubs are displayed.
      if (!lowerSearchTerm && !lowerSelectedCategory) {
        return true;
      }

      return (
        (lowerSearchTerm && (lowerClubName.includes(lowerSearchTerm) || lowerCategory.includes(lowerSearchTerm) || lowerMeetingTime.includes(lowerSearchTerm))) ||
        (lowerSelectedCategory && lowerCategory.includes(lowerSelectedCategory))
      );
    });

    setFilteredClubData(filteredData);
    console.log(filteredClubData);
  }, [clubDataList, searchTerm, selectedCategory]);

  const handleSearchTermChange = (event) => {
    setSelectedCategory('');
    setSearchTerm(event.target.value);
    // Initialize selectedCategory when searchTerm changes
  };

  const handleCategoryChange = (event) => {
    setSearchTerm('');
    setSelectedCategory(event.target.value);
    // Initialize searchTerm when selectedCategory changes
  };

  useEffect(() => {
    // fetch data from the 'Announcement' collection
    const firestore = firebase.firestore();
    const announcementRef = firestore.collection('Announcements');

    announcementRef.get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        setAnnouncements(data);
      })
      .catch((error) => {
        console.log('Error getting documents:', error);
      });
  }, []);

  //The maximum length is set to maxLength.
  function truncateString(str) {
    const maxLength = 150;
  
    // If the string is null or "N/A", it is returned as is.
    if (!str || str === "N/A") {
      return str;
    }
  
    // If the length of the string is greater than maxLength, it is truncated and returned.
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    }
  
    // If the above conditions are not met, the original string is returned.
    return str;
  }
  

  return (
    <div className="container-newhome">
      {announcements.length > 0 && (
      <div className="container-announcement">
        {announcements.map((announcement, index) => (
          <div className="announcement-data" key={index}>
            <li>
              <h3 className="announcement-name">
              <Link
              to={`/announcement`}
              className="announcement list page">
              {announcement.announcement_name}
            </Link>
                
              </h3>
              <Link
              to={`/announcement`} className='announcement'>
              <p className="announcement-description">
                {truncateString(announcement.announcement_description)}
              </p>
              </Link>
            </li>
          </div>
        ))}
      </div>
      )}
      
      <div className="container-headline">
        <div className="headline-title">
          SINGAPORE AMERICAN SCHOOL GENERAL CLUBS
        </div>
        <div className="headline-content">
        Browse our comprehensive list of general clubs with up-to-date information.
        </div>
      </div>

      <div className="featured-clubs">
      <div className="featured-clubs-header">
    <h2>Featured Clubs</h2>
  </div>
  <div style={{ display: 'flex' }}>
    {filteredClubData.slice(0, 4).map((club, index) => (
      <div key={index} style={{ border: '1px solid #ccc', padding: '15px', margin: '10px', width: '200px' }}>
        <h3>{club.club_name}</h3>
        <p>Category: {club.category}</p>
        <p>Meeting Time: {club.meeting_date}</p>
        <Link
              to={`/clubDetail/${club.club_name}`}
              className="clubDetailLink"
            >
              Details
            </Link>
      </div>
    ))}
  </div>
</div>
      

      <div className="container-search-and-select-box">
        <div className="search-and-select-box">
          <input
            className="search-club-input"
            type="text"
            placeholder="Search club name"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
          <div className="separator"></div>
          <select
            className="category-select"
            placeholder="Select category"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="" disabled hidden>
              Select Category
            </option>{" "}
            
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="container-club-card">
        {filteredClubData.map((club, index) => (
          <div className="clubCard" key={index}>
            <div className="tagBox">
        
        {club.hash_tag !== "N/A" && club.hash_tag.split(',').slice(0, 3).map((tag, tagIndex) => (
          <div key={tagIndex} className="hashtag-box">
            {tag.trim()}
          </div>
        ))}
      </div>
            
            <div className="clubcard-club-name">{club.club_name}</div>
            <p className="clubcard-club-description-category">{club.category}</p> 
            <p className="clubcard-club-description">{club.meeting_date}</p> 
            
            <Link
              to={`/clubDetail/${club.club_name}`}
              className="clubDetailLink"
            >
              Details
            </Link>
          </div>
        ))}
      </div>

      <Chat />
    </div>
  );
};

export default Home;
