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
import AppointmentsPage from './Routes/Employee/AppointmentsPage';
import DataEditPage from './Routes/Employee/DataEditPage';
import ProceduresList from "./Components/CrudForms/ProceduresList";
import UserList from "./Components/CrudForms/UserList";
import Spinner from 'react-bootstrap/Spinner';

function App() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axios.get('/auth/login/success')
      .then(response => {
        if (response.data.success) {
          console.log('Logged user: ', response.data.user)
          setUser(response.data.user)
        } else {
          console.log(response.data.message)
        }
      })
      .catch(err => console.log('getUser error: ', err))
      .finally(() => {
        setLoaded(true)
      });
  }, [])

  const logout = async () => {
    window.open("http://localhost:5000/auth/logout", "_self");
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
            <Route path='/profile' element={<ProfilePage user={user}/>}/>
            <Route path='/kosmetika' element={<ReservationPage typeOfService={'cosmetics'} user={user} logout={logout}/>}/>
            <Route path='/kadernictvi' element={<ReservationPage typeOfService={'hair'} user={user} logout={logout}/>}/>
            <Route path='/masaze' element={<ReservationPage typeOfService={'massage'} user={user} logout={logout}/>}/>
            {/* Administration */}
            {/* Todo add isUserLogged to all admin pages*/}
            <Route path='/kosmetika/objednavky' element={<AppointmentsPage typeOfService={'cosmetics'}/>}/>
            <Route path='/kadernictvi/objednavky' element={<AppointmentsPage typeOfService={'hair'}/>}/>
            <Route path='/masaze/objednavky' element={<AppointmentsPage typeOfService={'massage'}/>}/>
            {/* Data edit */}
            <Route path='/admin/procedury' element={<DataEditPage contentForm={<ProceduresList/>}/>}/>
            <Route path='/admin/uzivatele' element={<DataEditPage contentForm={<UserList/>}/>}/>
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
