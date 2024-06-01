import React, { useState, useEffect } from "react";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { Col, Row } from "react-bootstrap";

import axiosInstance from "../utils/AxiosInstance";
import Model from "../components/Model";

const HomeScreen = () => {
  const [models, setModels] = useState([]);
  console.log(models);

  useEffect(() => {
    const fetchModels = async () => {
      const { data } = await axiosInstance.get("/models/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(data);
      setModels(data);
    };
    fetchModels();
  }, []);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userPoolId = process.env.REACT_APP_USERPOOL_ID;
      const clientId = process.env.REACT_APP_APPCLIENT_ID;
      const poolData = {
        UserPoolId: userPoolId,
        ClientId: clientId,
      };
      const userPool = new CognitoUserPool(poolData);
      const cognitoUser = userPool.getCurrentUser();

      if (cognitoUser) {
        cognitoUser.getSession((err, session) => {
          if (err) {
            console.log("Error:", err);
            // Redirect to the login screen
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

  return (
    <>
      <h1> Catálogo de Modelos </h1>
      <Row>
        {models?.map((model, index) => (
          <Col key={index} sm={12} md={6} lg={4} xl={3}>
            <Model model={model} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;
