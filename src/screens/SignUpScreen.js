import React, { useState } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import {
  CognitoUserPool,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

const userPool = new CognitoUserPool({
  UserPoolId: process.env.REACT_APP_USERPOOL_ID,
  ClientId: process.env.REACT_APP_APPCLIENT_ID,
});

function SignUpScreen() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const username = email;

  const attributeList = [
    new CognitoUserAttribute({
      Name: "email",
      Value: email,
    }),
  ];

  const signUp = async () => {
    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) {
        console.log(err);
        setShowMessage(false);
        return;
      }
      console.log("call result: ", result);

      const cognitoUser = result.user;
      setShowMessage(true);
    });
  };

  return (
    <div>
      <h1>Sign Up</h1>

      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <ButtonGroup aria-label="Sign Up">
          <Button
            className="btn btn-primary"
            type="button"
            onClick={() => signUp()}
          >
            Sign Up
          </Button>
        </ButtonGroup>
      </Form>

      {showMessage && (
        <div>
          <p className=" text-success">Sign Up Successful!!</p>
          <p className=" text-success">
            Please check your email for verification
          </p>
        </div>
      )}
    </div>
  );
}

export default SignUpScreen;
