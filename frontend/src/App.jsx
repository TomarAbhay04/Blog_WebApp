// src/App.jsx
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
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-post"
              element={
                <PrivateRoute>
                  <CreatePost />
                </PrivateRoute>
              }
            />
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <SearchFriends />
                </PrivateRoute>
              }
            />
            <Route
              path="/friends-list"
              element={
                <PrivateRoute>
                  <FriendsList />
                </PrivateRoute>
              }
            />
            <Route
              path="/post/:postId"
              element={
                <PrivateRoute>
                  <PostDetail />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
