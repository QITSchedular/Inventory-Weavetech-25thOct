import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import { initializeApp } from "firebase/app";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { registerWithEmailAndPassword } from "../firebase";
import RadioGroup from "devextreme-react/radio-group";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import curved6 from "assets/images/curved-images/curved14.jpg";
import notify from "devextreme/ui/notify";
import firebase from "firebase/compat/app";
import "bootstrap/dist/css/bootstrap.min.css";
import "firebase/compat/auth";
import "firebase/compat/firestore";
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
firebase.initializeApp(firebaseConfig);
//
function SignUp() {
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
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [empcode, setEmpCode] = useState("");
  const [AoneStatusPrd, setAOneStatusPrd] = useState(false);
  const [BtwoStatusGrn, setBTwoStatusGrn] = useState(false);
  const [CthreeStatusITRManual, setCThreeStatusITRManual] = useState(false);
  const [DfourStatusITR, setDFourStatusITR] = useState(false);
  const [EfiveStatusIT, setEFiveStatusIT] = useState(false);
  const [FsixStatusReports, setFSixStatusReports] = useState(false);
  const [GsixAReportsITRPrintLayout, setGSixAReportsITRPrintLayout] =
    useState(false);
  const [HsixBReportsITRPLwithBarcode, setHSixBReportsITRPLwithBarcode] =
    useState(false);
  const [IsixCReportsITLayout, setISixCReportsITLayout] = useState(false);
  const [JsixDReportsIssueDC, setJSixDReportsIssueDC] = useState(false);

  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const FormatRadioBtn = ["User", "Admin"];
  const [radioBtnValue, setRadioBtnValue] = useState("User");
  const [role, setRole] = useState("User");
  const [logoName, setLogoName] = useState("Inventory Distribution");
  //
  const onRegister = () => {
    if (
      role === "" ||
      name === "" ||
      phone === "" ||
      empcode === "" ||
      email === "" ||
      password === ""
    ) {
      notify(
        {
          message: "Please Fill all the Fields....",
          width: 300,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1500
      );
    } else {
      console.log("Im in else");
      registerWithEmailAndPassword(
        name,
        email,
        password,
        empcode,
        role,
        phone,
        AoneStatusPrd,
        BtwoStatusGrn,
        CthreeStatusITRManual,
        DfourStatusITR,
        EfiveStatusIT,
        FsixStatusReports,
        GsixAReportsITRPrintLayout,
        HsixBReportsITRPLwithBarcode,
        IsixCReportsITLayout,
        JsixDReportsIssueDC,
        logoName
      );
      sendEmailVerification(auth.email);
    }
  };
  useEffect(() => {
    if (loading) return;
    if (user) {
      sendEmailVerification(auth.currentUser);
      notify(
        {
          message: "We have sent Verification link to your Email!",
          width: 430,
          position: "bottom center",
          direction: "up-push",
        },
        "success",
        1500
      );
      navigate("/authentication/success");
    }
  }, [user, loading]);

  return (
    <BasicLayout
      title="Welcome!"
      description="Please Register to use Inventory Distribution Features."
      image={curved6}
    >
      <Card>
        <SoftBox mt={3} mb={1} textAlign="center">
          <SoftTypography
            variant="h3"
            fontWeight="bold"
            style={{ color: "#0B2F8A" }}
          >
            Register
          </SoftTypography>
        </SoftBox>
        <SoftBox pt={1} pb={3} px={3}>
          <SoftBox component="form" role="form">
            <SoftBox
              style={{ display: "flex", justifyContent: "center" }}
              mt={1}
            >
              <RadioGroup
                items={FormatRadioBtn}
                defaultValue={FormatRadioBtn[0]}
                layout="horizontal"
                //value={radioBtnValue}
                onValueChanged={(e) => {
                  setRadioBtnValue(e.value);
                  setRole(e.value);
                }}
              />
            </SoftBox>
            <SoftBox>
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
              >
                Full Name
              </SoftTypography>
              <SoftInput
                placeholder="Enter Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </SoftBox>
            <SoftBox>
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
              >
                Phone Number
              </SoftTypography>
              <SoftInput
                type="tel"
                placeholder="Enter Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </SoftBox>
            <SoftBox>
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
              >
                Employee Code
              </SoftTypography>
              <SoftInput
                type="text"
                placeholder="Enter Employee Code"
                value={empcode}
                onChange={(e) => setEmpCode(e.target.value)}
              />
            </SoftBox>
            <SoftBox>
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
              >
                Email Address
              </SoftTypography>
              <SoftInput
                type="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
              >
                Password
              </SoftTypography>
              <SoftInput
                type={passwordType}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </SoftBox>
            <SoftBox display="flex" alignItems="center">
              <Checkbox checked={rememberMe} onChange={handleTogglePassword} />
              <SoftTypography
                variant="button"
                fontWeight="regular"
                onClick={handleTogglePassword}
                sx={{ cursor: "poiner", userSelect: "none" }}
              >
                &nbsp;
              </SoftTypography>
              <SoftTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                textGradient
              >
                Show Password
              </SoftTypography>
            </SoftBox>

            <SoftBox mt={4} mb={1}>
              <SoftTypography>
                <SoftButton
                  fullWidth
                  onClick={onRegister}
                  style={{
                    backgroundColor: "#0B2F8A",
                    color: "white",
                    boxShadow: "0px 8px 24px -2px rgba(11, 47, 138, 0.6)",
                    borderRadius: "16px",
                  }}
                >
                  Continue
                </SoftButton>
              </SoftTypography>
            </SoftBox>

            <SoftBox mt={3} textAlign="center">
              <SoftTypography
                variant="button"
                color="text"
                fontWeight="regular"
              >
                Already have an account?&nbsp;
                <SoftTypography
                  component={Link}
                  to="/authentication/email-signin"
                  variant="button"
                  color="dark"
                  fontWeight="bold"
                  textGradient
                >
                  Sign In
                </SoftTypography>
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Card>
    </BasicLayout>
  );
}

export default SignUp;
