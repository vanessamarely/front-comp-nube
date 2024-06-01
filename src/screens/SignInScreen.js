import React, { useState } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import { useHistory } from "react-router-dom";

const SignInScreen = () => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const signIn = () => {
    const userPool = new CognitoUserPool({
      UserPoolId: process.env.REACT_APP_USERPOOL_ID,
      ClientId: process.env.REACT_APP_APPCLIENT_ID,
    });

    const authenticationData = {
      Username: username,
      Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        cognitoUser.getUserAttributes(function (err, result) {
          if (err) {
            console.log("err", err);
            return;
          }

          const authenticatedUser = userPool.getCurrentUser();

          authenticatedUser.getSession((err, result2) => {
            if (err) {
              console.log("err", err);
              return;
            }
            const token = result2.idToken?.jwtToken;
            localStorage.setItem("token", token);
            console.log("result", result2);
          });

          history.push("/home");
        });
      },
      onFailure: (err) => {
        console.log("login failed", err);
        setShowMessage(true);
      },
    });
  };

  const signUp = () => {
    history.push("/signup");
  }

  return (
    <div>
      <Form>
        <h1>Sign In</h1>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>

          <Form.Control
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <ButtonGroup aria-label="Sign In">
          <Button className="btn btn-primary" type="button" onClick={signIn}>
            Login
          </Button>
        </ButtonGroup>
        {showMessage && (
          <div className="text-danger">Invalid username or password</div>
        )}
      </Form>
      <hr />
      <div className="informative-text">
        <h3>Don't have an account?</h3>
        <h4>Sign up here:</h4>
        <ButtonGroup aria-label="Sign Up">
          <Button className="btn btn-primary" type="button" onClick={signUp}>
            SignUp
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default SignInScreen;
