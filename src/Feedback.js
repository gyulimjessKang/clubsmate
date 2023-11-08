import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // 추가
import firebase from 'firebase/app';
import 'firebase/firestore';
import './styles/feedback.css';

const Feedback = () => {
  const [feedback, setFeedback] = useState({
    username: '',
    date: '',
    content: '',
  });

  const handleChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 폼 제출 로직을 추가하세요. 예: saveFeedback(feedback);
    console.log(feedback);
  };
  
  

  return (
    <div className="container-home">
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">유저 이름:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={feedback.username}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="date">날짜:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={feedback.date}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="content">내용:</label>
        <textarea
          id="content"
          name="content"
          value={feedback.content}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">피드백 제출</button>
    </form>
    </div>
  );
};

export default Feedback;
