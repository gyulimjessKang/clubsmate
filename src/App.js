// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import PrivateRoute from './PrivateRoute';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import ClubDetail from './components/clubdetail/ClubDetail';
import EventDetail from './components/eventdetail/EventDetail';
import Navbar from './components/navbar/Navbar';  // 경로 확인 필요
import AdminPage from './AdminPage'
import MyPage from './components/mypage/MyPage';
import Announcement from './components/announcement/Announcement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/clubdetail/:club_name" element={<PrivateRoute><ClubDetail /></PrivateRoute>} />
          <Route path="/eventdetail/:club_name/:event_name" element={<PrivateRoute><EventDetail /></PrivateRoute>} />
          <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
          <Route path="/announcement" element={<PrivateRoute><Announcement /></PrivateRoute>} />
          
          {/* <PrivateRoute path="/clubdetail" element={<ClubDetail />} /> 보호된 경로 */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
