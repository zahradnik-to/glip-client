import React, {useState} from 'react';
import {Form, Button, FloatingLabel} from "react-bootstrap";
import axios from "axios";
import PropTypes from 'prop-types';

LoginForm.propTypes = {
  setToken: PropTypes.func.isRequired
}

function LoginForm({ setToken }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleLogin(event) {
    event.preventDefault()

    axios.post('/user/login', {email: email, password: password}).then( res => {
      setToken(res.data)
      console.log("Token", res.data)
    }).catch(err => {
      console.log(err)
    })
  }

  async function handleRegister(event) {
    event.preventDefault()

    const result = await axios.post('/user/register', {email: email, password: password})
    console.log("Result ", result.data)
  }


  return (
    <>
      <h1>Přihlásit se</h1>
      <Form onSubmit={handleLogin} method='POST'>
        <FloatingLabel controlId="emailLogin" label="Email" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
          />
        </FloatingLabel>
        <FloatingLabel controlId="passwordLogin" label="Heslo" className="mb-3">
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
          />
        </FloatingLabel>
        <Button variant="primary" type="submit">
          Přihlásit se
        </Button>
      </Form>

      <hr/>

      <h1>Registrovat</h1>
      <Form onSubmit={handleRegister} method='POST'>
        <FloatingLabel
          controlId="emailRegister"
          label="Email"
          className="mb-3"
        >
          <Form.Control type="email" placeholder="Email" onChange={e => setEmail(e.target.value)}/>
        </FloatingLabel>
        <FloatingLabel controlId="passwordRegister" label="Heslo" className="mb-3">
          <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
        </FloatingLabel>
        <Button variant="primary" type="submit">
          Registrovat
        </Button>
      </Form>
    </>
  );
}

export default LoginForm;