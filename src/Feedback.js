import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import './styles/feedback.css';

const Feedback = () => {
const [feedback, setFeedback] = useState({
username: '', 
content: '',
});

//stores the current date and time
const [currentDateTime, setCurrentDateTime] = useState('');

useEffect(() => {
// If the user is logged in, get their name.
firebase.auth().onAuthStateChanged(user => {
if (user) {
setFeedback({ ...feedback, username: user.displayName });
}
});

// set current date and time
const now = new Date();
setCurrentDateTime(now.toLocaleString()); // ex: '2023/11/11, 12:00:00 PM'
}, []);

const handleChange = (e) => {
setFeedback({ ...feedback, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
e.preventDefault();
try {
// add comment data to the Firebase Firestore
await firebase.firestore().collection('Comments').add({
username: feedback.username,
date: currentDateTime,
content: feedback.content,
});


if (window.confirm('Success')) {
window.location.reload();
}
} catch (error) {
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


