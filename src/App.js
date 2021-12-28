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

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/auth/login/success')
      .then(response => {
        if (response.status === 200) {
          console.log('Logged user: ', response.data.user)
          setUser(response.data.user)
        } else throw new Error('Auth failed')
      })
      .catch(err => console.log('getUser error: ', err));
  }, [])

  return (
    <>
      <TopNav user={user}/>
      <Container className="pt-5">
        <Router>
          <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/profile' element={<ProfilePage user={user}/>}/>
            <Route path='/kosmetika' element={<ReservationPage typeOfService={'cosmetics'}/>}/>
            <Route path='/kadernictvi' element={<ReservationPage typeOfService={'hair'}/>}/>
            <Route path='/masaze' element={<ReservationPage typeOfService={'massage'}/>}/>
            {/* Administration */}
            <Route path='/kosmetika/objednavky' element={<AppointmentsPage typeOfService={'cosmetics'}/>}/>
            <Route path='/kadernictvi/objednavky' element={<AppointmentsPage typeOfService={'hair'}/>}/>
            <Route path='/masaze/objednavky' element={<AppointmentsPage typeOfService={'massage'}/>}/>
            {/* Data edit */}
            <Route path='/admin/procedury' element={<DataEditPage contentForm={<ProceduresList/>}/>}/>
          </Routes>
        </Router>
      </Container>
    </>
  );
}

export default App;
