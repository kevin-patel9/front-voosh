// src/App.js
import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Screens/Login";
import Signup from "./Screens/SignUp";
import TaskManagement from "./Screens/Task";
import Navbar from "./components/Navbar";
import "./reset.css";
import { getCookie } from "./common/Apicall";

export const UserAuthContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (getCookie("token")) setIsLoggedIn(isLoggedIn);
  }, [isLoggedIn]);

  return (
    <UserAuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/task" element={<TaskManagement />} />
        </Routes>
      </Router>
    </UserAuthContext.Provider>
  );
}

export default App;
