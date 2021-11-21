import './App.css';
import Modal from 'react-modal'
import Calendar from "./Components/Calendar";
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

Modal.setAppElement('#root')

function App() {
  const {token, setToken} = useToken();

  return (
    <>
      <Container className="pt-5">
        <Router>
          <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/login' element={<LoginPage setToken={setToken}/>}/>
            <Route path='/calendar' element={<Calendar/>}/>
            <Route path='/profile' element={<UserProfilePage token={token} setToken={setToken}/>}/>
          </Routes>
        </Router>
      </Container>
    </>
  );
}

export default App;
