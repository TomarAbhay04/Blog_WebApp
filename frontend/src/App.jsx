import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import FriendsPage from './pages/FriendsPage';
import { AuthProvider } from './context/AuthContext';
import SearchFriends from './components/SearchFriends';
import FriendsList from './components/FriendLists';
import CreatePost from './components/CreatePost';
import PostDetail from './components/PostDetail';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/search" element={<SearchFriends />} />
            <Route path="/friends-list" element={<FriendsList />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/post/:postId" element={<PostDetail />} />
            <Route path="*" element={<h1>Not Found</h1>} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
