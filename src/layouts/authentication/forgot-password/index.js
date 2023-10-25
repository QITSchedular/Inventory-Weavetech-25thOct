import React, { useState, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import curved9 from "assets/images/curved-images/curved-6.jpg";
//import { getAuth } from "firebase/auth";
import Switch from "@mui/material/Switch";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  getFirestore,
  setDoc,
  doc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import notify from "devextreme/ui/notify";
//
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
//const auth = getAuth(app);
const db = getFirestore(app);

function ForgotPassword() {
  const [passwordType, setPasswordType] = useState("password");
  const [rememberMe, setRememberMe] = useState(false);
  const handleTogglePassword = (e) => {
    if (passwordType === "password") {
      setPasswordType("text");
      setRememberMe(!rememberMe);
      return 0;
    } else {
      setPasswordType("password");
      setRememberMe(!rememberMe);
    }
  };
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [headerList, setHeaderList] = useState([]);
  const [userEmployeeCode, setUserEmployeeCode] = useState("");
  //
  const [updatedId, setUpdatedId] = useState("");
  //
  useLayoutEffect(() => {
    //Real time Updates
    const unsub = onSnapshot(
      collection(db, "users"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        list.filter((updatedArray) => {
          if (updatedArray.email === email) {
            setUsersList([updatedArray]);
            setUserEmployeeCode(updatedArray.empcode);
            setUpdatedId(updatedArray.uid);
          } else {
            return 0;
          }
        });
      },
      (error) => {
        console.log("error in fetching users", error);
      }
    );
    return () => {
      unsub();
    };
  }, [email]);
  //
  const handleContinue = async () => {
    if (usersList[0] === undefined) {
      notify(
        {
          message: "Please Enter Valid Email Address...!!!",
          width: 320,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1500
      );
    } else {
      setInputDisabled(true);
      setHeaderList([usersList]);
    }
  };
  const handleChangePassword = async () => {
    try {
      const updatedId1 = updatedId;
      const addRefToDoc = doc(db, "users", updatedId1);
      setDoc(
        addRefToDoc,
        {
          password: newPassword,
        },
        {
          merge: true,
        }
      );
      //set the custom empid in new collection
      const empId = userEmployeeCode;
      const addRefToDoc1 = doc(db, "empcode", empId);
      setDoc(
        addRefToDoc1,
        {
          password: newPassword,
        },
        {
          merge: true,
        }
      ).then(() => {
        setHeaderList("");
        setEmail("");
        setNewPassword("");
        notify(
          {
            message: "Success...!!! Password has changed, Please Login.",
            width: 400,
            shading: true,
            position: "bottom center",
            direction: "up-push",
          },
          "success",
          3000
        );
        navigate("/authentication/email-signin");
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <CoverLayout title="Verify OTP" image={curved9}>
      <SoftBox component="form" role="form">
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography
              component="label"
              variant="caption"
              fontWeight="bold"
            >
              Enter Registered Email
            </SoftTypography>
          </SoftBox>
          <SoftInput
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              // console.log('first', e.target.value)
            }}
            disabled={inputDisabled}
          />
        </SoftBox>
        <SoftBox mt={4} mb={4} textAlign="center">
          <SoftButton
            fullWidth
            style={{
              backgroundColor: "#0B2F8A",
              color: "white",
              boxShadow: "0px 8px 24px -2px rgba(11, 47, 138, 0.6)",
              borderRadius: "16px",
            }}
            onClick={handleContinue}
          >
            Continue
          </SoftButton>
        </SoftBox>
        {/* Second component */}
        <div>
          {(() => {
            if (headerList[0] === undefined) {
              return;
            } else {
              return (
                <React.Fragment>
                  <SoftBox mb={2}>
                    <SoftBox mb={1} ml={0.5}>
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                      >
                        Enter New Password
                      </SoftTypography>
                    </SoftBox>
                    <SoftInput
                      type={passwordType}
                      placeholder="Enter New Password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        //console.log('first', e.target.value)
                      }}
                    />
                  </SoftBox>
                  <SoftBox display="flex" alignItems="center">
                    <Switch
                      checked={rememberMe}
                      onChange={handleTogglePassword}
                    />
                    <SoftTypography
                      variant="button"
                      fontWeight="regular"
                      onClick={handleTogglePassword}
                      sx={{ cursor: "pointer", userSelect: "none" }}
                    >
                      &nbsp;&nbsp;Show Password
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox mt={4} mb={1} textAlign="center">
                    <SoftButton
                      fullWidth
                      style={{
                        backgroundColor: "#0B2F8A",
                        color: "white",
                        boxShadow: "0px 8px 24px -2px rgba(11, 47, 138, 0.6)",
                        borderRadius: "16px",
                      }}
                      onClick={handleChangePassword}
                    >
                      Change Password
                    </SoftButton>
                  </SoftBox>
                </React.Fragment>
              );
            }
          })()}
        </div>
        <SoftBox mt={3} textAlign="center">
          <SoftTypography variant="button" color="text" fontWeight="regular">
            Don&apos;t Have an Account?{" "}
            <SoftTypography
              component={Link}
              to="/authentication/sign-up"
              variant="button"
              fontWeight="medium"
              style={{ color: "#0B2F8A" }}
            >
              Register
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={0} textAlign="center">
          <SoftTypography
            component={Link}
            to="/authentication/email-signin"
            variant="button"
            fontWeight="medium"
            style={{ color: "#0B2F8A" }}
          >
            SignIn with Email
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </CoverLayout>
  );
}

export default ForgotPassword;
