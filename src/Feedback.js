import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth'; // 인증 모듈 추가
import 'firebase/firestore';
import './styles/feedback.css';

const Feedback = () => {
const [feedback, setFeedback] = useState({
username: '', // 로그인한 사용자의 이름
content: '',
});

// 현재 날짜와 시간을 저장하는 상태
const [currentDateTime, setCurrentDateTime] = useState('');

useEffect(() => {
// 사용자가 로그인한 경우, 이름을 가져옵니다.
firebase.auth().onAuthStateChanged(user => {
if (user) {
setFeedback({ ...feedback, username: user.displayName });
}
});

// 현재 날짜와 시간 설정
const now = new Date();
setCurrentDateTime(now.toLocaleString()); // 예: '2023/11/11, 12:00:00 PM'
}, []);

const handleChange = (e) => {
setFeedback({ ...feedback, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
e.preventDefault();
try {
// Firebase Firestore에 데이터를 추가합니다.
await firebase.firestore().collection('Comments').add({
username: feedback.username,
date: currentDateTime,
content: feedback.content,
});
// 데이터 저장 성공 알림
if (window.confirm('Success')) {
// 사용자가 확인을 누르면 화면 새로고침
window.location.reload();
}
} catch (error) {
// 오류 발생 시 콘솔에 출력
console.error("Error adding document: ", error);
}
};

return (
<div className="container-home">
<div className='feedbackTitle text-center'>
Tell us your thoughts on our service-feedback, words of encouragement, advice, anything is welcome!
</div>

<div>
<div className="feedback_username">Username: {feedback.username}</div>
<div className='feedback_username'>
<p>Current: {currentDateTime}</p>
</div>
</div>

<div className='feedback_username'>
<p>Content</p>
</div>
<form onSubmit={handleSubmit}>
<div className='feedback_content'>
<textarea
id="content"
name="content"
value={feedback.content}
onChange={handleChange}
required
/>
</div>

<div className='buttonbox'>
<button className='submitButton' type="submit">Submit</button>
</div>

</form>

</div>
);
};

export default Feedback;


