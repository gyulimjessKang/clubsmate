// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import PrivateRoute from './PrivateRoute';
import Home from './Home';
import Login from './Login';
import ClubDetail from './components/clubdetail/ClubDetail';
import EventDetail from './components/eventdetail/EventDetail';
import Navbar from './components/navbar/Navbar';  
import Admin from './Admin'
import MyPage from './components/mypage/MyPage';
import Announcement from './components/announcement/Announcement';
import Footer from './components/footer/Footer';
import Feedback from './Feedback';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/clubdetail/:club_name" element={<PrivateRoute><ClubDetail /></PrivateRoute>} />
          <Route path="/eventdetail/:club_name/:event_name" element={<PrivateRoute><EventDetail /></PrivateRoute>} />
          <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
          <Route path="/announcement" element={<PrivateRoute><Announcement /></PrivateRoute>} />
          <Route path="/feedback" element={<PrivateRoute><Feedback /></PrivateRoute>} />

          <Route path="/footer" element={<Footer />} />
          
         </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
