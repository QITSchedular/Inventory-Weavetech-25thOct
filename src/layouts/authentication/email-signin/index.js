import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logInWithEmailAndPassword } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import Switch from "@mui/material/Switch";
import { initializeApp } from "firebase/app";
import { getAuth, sendEmailVerification } from "firebase/auth";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import curved9 from "assets/images/curved-images/curved-6.jpg";
import notify from "devextreme/ui/notify";

function SignEmail() {
  //FirebaseConfig Start
  const firebaseConfig = {
    apiKey: "AIzaSyCyAfYeL3UumZtZoOB9HCkAA31XzRU1PC4",
    authDomain: "weave-tech-sap-b1.firebaseapp.com",
    projectId: "weave-tech-sap-b1",
    storageBucket: "weave-tech-sap-b1.appspot.com",
    messagingSenderId: "233950696025",
    appId: "1:233950696025:web:12a7cfec17abdc7ea41748",
    measurementId: "G-EY30M5PFN2",
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  //FirebaseConfig end
  const [passwordType, setPasswordType] = useState("password");
  const [rememberMe, setRememberMe] = useState(false);
  const handleTogglePassword = (e) => {
    if (passwordType === "password") {
      setPasswordType("text");
      setRememberMe(!rememberMe);
      return;
    } else {
      setPasswordType("password");
      setRememberMe(!rememberMe);
    }
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      if (auth.currentUser.emailVerified) {
        navigate("/user-dashboard");
      } else {
        sendEmailVerification(auth.currentUser);
        notify(
          {
            message: "Your Email is Not Verified. Check Inbox.",
            width: 350,
            shading: true,
            position: "bottom center",
            direction: "up-push",
          },
          "error",
          500
        );
        setEmail("");
        setPassword("");
      }
    }
  }, [user, loading]);

  return (
    <CoverLayout
      title="Welcome back"
      description="Enter Email & Password to Sign In"
      image={curved9}
    >
      <SoftBox component="form" role="form">
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography
              component="label"
              variant="caption"
              fontWeight="bold"
            >
              Email
            </SoftTypography>
          </SoftBox>
          <SoftInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </SoftBox>
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography
              component="label"
              variant="caption"
              fontWeight="bold"
            >
              Password
            </SoftTypography>
          </SoftBox>
          <SoftInput
            type={passwordType}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </SoftBox>
        <SoftBox display="flex" alignItems="center">
          <Switch checked={rememberMe} onChange={handleTogglePassword} />
          <SoftTypography
            variant="button"
            fontWeight="regular"
            onClick={handleTogglePassword}
            sx={{ cursor: "pointer", userSelect: "none" }}
          >
            &nbsp;&nbsp;Show Password
          </SoftTypography>
        </SoftBox>

        <SoftBox mt={2.2} mb={1}>
          <SoftTypography>
            <SoftButton
              onClick={() => logInWithEmailAndPassword(email, password)}
              fullWidth
              style={{
                backgroundColor: "#0B2F8A",
                color: "white",
                boxShadow: "0px 8px 24px -2px rgba(11, 47, 138, 0.6)",
                borderRadius: "16px",
              }}
            >
              Sign In
            </SoftButton>
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={2.5} textAlign="center">
          <SoftTypography
            component={Link}
            to="/authentication/qr-signin"
            variant="button"
            style={{ color: "#0B2F8A" }}
            fontWeight="medium"
          >
            Sign In with QR Code
          </SoftTypography>
        </SoftBox>

        <SoftBox mt={0} textAlign="center">
          <SoftTypography variant="button" color="text" fontWeight="regular">
            Don&apos;t have an account?{" "}
            <SoftTypography
              component={Link}
              to="/authentication/sign-up"
              variant="button"
              style={{ color: "#0B2F8A" }}
              fontWeight="medium"
            >
              Register
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
        <SoftBox textAlign="center">
          <SoftTypography
            component={Link}
            to="/authentication/forgot-password"
            variant="button"
            style={{ color: "#0B2F8A" }}
            fontWeight="medium"
          >
            Forgot Password?
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </CoverLayout>
  );
}

export default SignEmail;
