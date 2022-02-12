import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
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
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import cs from 'date-fns/locale/cs';

function App() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  registerLocale('cs', cs)
  setDefaultLocale('cs');

  useEffect(() => {
    axios.get('/auth/login/success', { withCredentials: true })
      .then(response => {
        if (response.data.success) {
          console.log('Logged user: ', response.data.user)
          setUser(response.data.user)
        } else {
          console.log(response.data.message)
        }
      })
      .catch(err => console.error('getUser error: ', err))
      .finally(() => {
        setLoaded(true)
      });
  }, [])

  const logout = async () => {
    axios.get(`/auth/logout`)
      .then(setUser(null))
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
            <Route path='/kosmetika/prehled' element={<AppointmentsPage typeOfService={'cosmetics'} page={'prehled'} user={user}/>}/>
            <Route path='/kosmetika/dovolena' element={<AppointmentsPage typeOfService={'cosmetics'} page={'dovolena'} user={user}/>}/>
            <Route path='/kosmetika/procedury' element={<AppointmentsPage typeOfService={'cosmetics'} page={'procedury'} user={user}/>}/>

            <Route path='/kadernictvi/prehled' element={<AppointmentsPage typeOfService={'hair'} page={'prehled'} user={user}/>}/>
            <Route path='/kadernictvi/dovolena' element={<AppointmentsPage typeOfService={'hair'} page={'dovolena'} user={user}/>}/>
            <Route path='/kadernictvi/procedury' element={<AppointmentsPage typeOfService={'hair'} page={'procedury'} user={user}/>}/>

            <Route path='/masaze/prehled' element={<AppointmentsPage typeOfService={'massage'} page={'prehled'} user={user}/>}/>
            <Route path='/masaze/dovolena' element={<AppointmentsPage typeOfService={'massage'} page={'dovolena'} user={user}/>}/>
            <Route path='/masaze/procedury' element={<AppointmentsPage typeOfService={'massage'} page={'procedury'} user={user}/>}/>
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
