import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from "./Routes/HomePage";
import { Container } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import ReservationPage from "./Routes/ReservationPage";
import './App.css';
import axios from "axios";
import ProfilePage from "./Routes/ProfilePage";
import TopNav from "./Components/TopNav";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/auth/login/success')
      .then(response => {
        if (response.status === 200) {
          console.log('Logged user: ', response.data.user)
          setUser(response.data.user)
        } else throw new Error("Auth failed")
      })
      .catch(err => console.log("getUser error: ", err));
  }, [])

  return (
    <>
      <TopNav user={user}/>
      <Container className="pt-5">
        <Router>
          <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/profile' element={<ProfilePage user={user}/>}/>
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
