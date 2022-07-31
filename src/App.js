import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Routes/HomePage";
import { Container } from "react-bootstrap";
import React, { useEffect, useState, Children } from "react";
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
import ErrorPage from "./Routes/ErrorPage";

function App() {
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(async () => {
    await login();
    await getServices();
    setLoaded(true);
  }, [])

  const login = async () => {
    try {
      const response = await axios.get('/auth/login/success', { withCredentials: true });
      setUser(response.data.user)
    } catch (e) {
      console.error("Auth error.")
      setUser(null)
    }
  }

  const logout = async () => {
    await axios.get(`/auth/logout`);
    setUser(null);
  };

  const googleAuth = () => {
    window.open('http://localhost:5000/auth/google', '_self');
  }

  const getServices = async () => {
    const services = await axios.get("/role/get?type=staffRole");
    setServices(services.data);
  }

  if (loaded) return (
      <Router>
        <TopNav user={user} googleAuth={googleAuth} logout={logout} services={services}/>
        <Container className="pt-5">
          <Routes>
            <Route path='/' element={<HomePage services={services}/>}/>
            <Route path='/profil' element={<ProfilePage user={user} login={login}/>}/>
            <Route path='/objednavky/seznam' element={<UserOverviewPage user={user} page={'/objednavky/seznam'}/>}/>
            <Route path='/objednavky/kalendar' element={<UserOverviewPage user={user} page={'/objednavky/kalendar'}/>}/>
            <Route path="/error" element={<ErrorPage/>}/>

            <Route path='/admin/uzivatele' element={<DataEditPage contentForm={<UserList/>} user={user}/>}/>

            {Children.toArray(services.map(service =>
              <>
                <Route path={`/${service.name}`} element={<ReservationPage typeOfService={service.name} user={user} logout={logout}/>}/>
                {/* Administration */}
                <Route path={`/${service.name}/prehled`} element={<AdminMenuPage typeOfService={service} page={'prehled'} user={user}/>}/>
                <Route path={`/${service.name}/dovolena`} element={<AdminMenuPage typeOfService={service} page={'dovolena'} user={user}/>}/>
                <Route path={`/${service.name}/procedury`} element={<AdminMenuPage typeOfService={service} page={'procedury'} user={user}/>}/>
              </>))
            }

            {/* Default for non existing pages */}
            <Route path="*" element={<HomePage services={services}/>}/>
          </Routes>
        </Container>
      </Router>
  );
  else return(
    <>
      <TopNav/>
      <Spinner animation="border" role="status">
         <span className="visually-hidden">Loading...</span>
       </Spinner>
    </>
  )

}

export default App;
