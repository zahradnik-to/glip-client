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
import axios from 'axios';
import ProfilePage from './Routes/ProfilePage';
import TopNav from './Components/TopNav';
import AdminMenuPage from './Routes/Employee/AdminMenuPage';
import DataEditPage from './Routes/Employee/DataEditPage';
import UserList from "./Components/CrudForms/UserList";
import Spinner from 'react-bootstrap/Spinner';
import UserOverviewPage from "./Routes/UserOverviewPage";

function App() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    login()
  }, [])

  const login = () => {
    axios.get('/auth/login/success', { withCredentials: true })
      .then(response => {
        if (response.data.success) {
          setUser(response.data.user)
        }
      })
      .catch(() => console.error("Auth error."))
      .finally(() => {setLoaded(true)});
  }

  const logout = async () => {
    await axios.get(`/auth/logout`);
    setUser(null);
  };

  const googleAuth = () => {
    window.open('http://localhost:5000/auth/google', '_self')
  }

  if (loaded) return (
    <>
      <TopNav user={user} googleAuth={googleAuth} logout={logout}/>
      <Container className="pt-5">
        <Router>
          <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/profil' element={<ProfilePage user={user} login={login}/>}/>
            <Route path='/objednavky/seznam' element={<UserOverviewPage user={user} page={'/objednavky/seznam'}/>}/>
            <Route path='/objednavky/kalendar' element={<UserOverviewPage user={user} page={'/objednavky/kalendar'}/>}/>
            <Route path='/kosmetika' element={<ReservationPage typeOfService={'cosmetics'} user={user} logout={logout}/>}/>
            <Route path='/kadernictvi' element={<ReservationPage typeOfService={'hair'} user={user} logout={logout}/>}/>
            <Route path='/masaze' element={<ReservationPage typeOfService={'massage'} user={user} logout={logout}/>}/>
            {/* Administration */}
            <Route path='/kosmetika/prehled' element={<AdminMenuPage typeOfService={'cosmetics'} page={'prehled'} user={user}/>}/>
            <Route path='/kosmetika/dovolena' element={<AdminMenuPage typeOfService={'cosmetics'} page={'dovolena'} user={user}/>}/>
            <Route path='/kosmetika/procedury' element={<AdminMenuPage typeOfService={'cosmetics'} page={'procedury'} user={user}/>}/>

            <Route path='/kadernictvi/prehled' element={<AdminMenuPage typeOfService={'hair'} page={'prehled'} user={user}/>}/>
            <Route path='/kadernictvi/dovolena' element={<AdminMenuPage typeOfService={'hair'} page={'dovolena'} user={user}/>}/>
            <Route path='/kadernictvi/procedury' element={<AdminMenuPage typeOfService={'hair'} page={'procedury'} user={user}/>}/>

            <Route path='/masaze/prehled' element={<AdminMenuPage typeOfService={'massage'} page={'prehled'} user={user}/>}/>
            <Route path='/masaze/dovolena' element={<AdminMenuPage typeOfService={'massage'} page={'dovolena'} user={user}/>}/>
            <Route path='/masaze/procedury' element={<AdminMenuPage typeOfService={'massage'} page={'procedury'} user={user}/>}/>
            {/* Admin access only */}
            <Route path='/admin/uzivatele' element={<DataEditPage contentForm={<UserList/>} user={user}/>}/>
          </Routes>
        </Router>
      </Container>
    </>
  );
  else return(
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  )

}

export default App;
