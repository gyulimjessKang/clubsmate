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
    // Firestore 데이터 가져오기
    const firestore = firebase.firestore();
    const clubInfoRef = firestore.collection('ClubInfo');
    const categoryRef = firestore.collection('categoryManage');

    clubInfoRef.get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        setClubDataList(data);
        setFilteredClubData(data); // 최초에 모든 동아리 데이터를 보여줍니다.
      })
      .catch((error) => {
        console.log('Error getting documents:', error);
      });

    categoryRef.doc("category").get().then((categorydoc) => {
      if (categorydoc.exists) {
        // 문서가 존재할 경우 문서 데이터를 가져와서 categories 상태 업데이트
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
    // 검색어가 변경될 때마다 동아리 데이터를 필터링하여 업데이트합니다.
    // 검색어 또는 선택된 카테고리가 변경될 때마다 동아리 데이터를 필터링하여 업데이트합니다.
    setFilteredClubData([]);
    const lowerSearchTerm = searchTerm.toLowerCase();
    const lowerSelectedCategory = selectedCategory.toLowerCase();

    const filteredData = clubDataList.filter((club) => {
      // const lowerSearchTerm = searchTerm.toLowerCase();
      const lowerClubName = club.club_name ? club.club_name.toLowerCase() : '';
      const lowerCategory = club.category ? club.category.toLowerCase() : '';
      const lowerMeetingTime = club.meeting_date ? club.meeting_date.toLowerCase() : '';

      // 검색어와 선택된 카테고리가 모두 없는 경우는 모든 동아리를 보여줍니다.
      if (!lowerSearchTerm && !lowerSelectedCategory) {
        return true;
      }

      // 검색어가 club.name 또는 club.category에 포함된 경우에만 필터링합니다.
      // 검색어와 선택된 카테고리 중 하나에 포함된 경우에만 필터링합니다.


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
    // searchTerm이 변경되면 selectedCategory 초기화
  };

  const handleCategoryChange = (event) => {
    setSearchTerm('');
    setSelectedCategory(event.target.value);
    // selectedCategory가 변경되면 searchTerm 초기화
  };

  useEffect(() => {
    // Firestore의 Announcement 콜렉션에서 데이터 가져오기
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

  //문자열 길이 줄이는 함수. 최대 길이는 maxLength로 설정한다.
  function truncateString(str) {
    const maxLength = 150;
  
    // 문자열이 null이거나 "N/A"일 때는 그대로 반환
    if (!str || str === "N/A") {
      return str;
    }
  
    // 문자열의 길이가 maxLength보다 크면 잘라서 반환
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    }
  
    // 위의 조건들에 해당하지 않는 경우 원본 문자열 반환
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
            {/* 기본 텍스트 옵션 */}
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
        {/* club.hash_tag 값이 "N/A"가 아니라면 처리 */}
        {club.hash_tag !== "N/A" && club.hash_tag.split(',').slice(0, 3).map((tag, tagIndex) => (
          <div key={tagIndex} className="hashtag-box">
            {tag.trim()}
          </div>
        ))}
      </div>
            {/* {((club.club_logo)!="N/A") && (
              <img
                src={club.club_logo}
                alt={`${club.club_name} logo`}
                className="clubLogo"
              />
            )} */}
            <div className="clubcard-club-name">{club.club_name}</div>
            <p className="clubcard-club-description-category">{club.category}</p> {/* 클럽 카테고리 */}
            <p className="clubcard-club-description">{club.meeting_date}</p> {/* 클럽 스케쥴 */}
            
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
