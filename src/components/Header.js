import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useHistory } from "react-router-dom";

import { CognitoUserPool } from "amazon-cognito-identity-js";

const Header = () => {
  const history = useHistory();
  const [auth, setAuth] = useState(false);
  const userPoolId = process.env.REACT_APP_USERPOOL_ID;
  const clientId = process.env.REACT_APP_APPCLIENT_ID;
  const poolData = {
    UserPoolId: userPoolId,
    ClientId: clientId,
  };
  const userPool = new CognitoUserPool(poolData);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const cognitoUser = userPool.getCurrentUser();

      if (cognitoUser) {
        cognitoUser.getSession((err, session) => {
          if (err) {
            console.log("Error:", err);
            setAuth(false);
            // Redirect to the login screen
          } else {
            console.log("User:", cognitoUser);
            setAuth(true);
            // Redirect to the main app screen
          }
        });
      } else {
        console.log("No user found");
        // Redirect to the login screen
      }
    } catch (error) {
      console.log("Error:", error);
      // Redirect to the login screen
    }
  };

  const handleLogout = async () => {
    try {
      const cognitoUser = userPool.getCurrentUser();

      if (cognitoUser) {
        cognitoUser.signOut();
        history.push("/");
        localStorage.clear();
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          {auth ? (
            <LinkContainer to="/home">
              <Navbar.Brand>ML Store</Navbar.Brand>
            </LinkContainer>
          ) : (
            <LinkContainer to="/">
              <Navbar.Brand>ML Store</Navbar.Brand>
            </LinkContainer>
          )}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <LinkContainer to="/about">
                <Nav.Link>Acerca de</Nav.Link>
              </LinkContainer>
              {auth ? (
                <>
                  <LinkContainer to="/home">
                    <Nav.Link>Inicio</Nav.Link>
                  </LinkContainer>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <LinkContainer to="/">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
