import Modal from 'react-modal'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from "./Routes/HomePage";
import LoginPage from "./Routes/LoginPage";
import {Container} from "react-bootstrap";
import React from "react";
import UserProfilePage from "./Routes/UserProfilePage";
import useToken from "./Components/Hooks/useToken";
import ReservationPage from "./Routes/ReservationPage";
import './App.css';
import axios from "axios";

Modal.setAppElement('#root')

function App() {
  const {token, setToken} = useToken();

  // Make Axios send token in header
  if (token) {
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    axios.defaults.headers.common['Authorization'] = null;
  }

  return (
    <>
      <Container className="pt-5">
        <Router>
          <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/login' element={<LoginPage setToken={setToken}/>}/>
            <Route path='/profile' element={<UserProfilePage token={token} setToken={setToken}/>}/>
            <Route path='/kosmetika' element={<ReservationPage typeOfService={"cosmetics"}/>}/>
            <Route path='/kadernictvi' element={<ReservationPage typeOfService={"hair"}/>}/>
            <Route path='/masaze' element={<ReservationPage typeOfService={"massage"}/>}/>
          </Routes>
        </Router>
      </Container>
    </>
  );
}

export default App;
