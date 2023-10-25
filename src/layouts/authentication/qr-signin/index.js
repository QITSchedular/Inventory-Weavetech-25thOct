import { useState, useEffect, useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import curved9 from "assets/images/curved-images/curved-6.jpg";
import { Alert } from "react-bootstrap";
import sound from "assets/mp3/sound-effect.mp3";
import { Html5Qrcode } from "html5-qrcode";
import ScanResults from "./ScanResults";
import notify from "devextreme/ui/notify";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { sendEmailVerification } from "firebase/auth";
import { logInWithEmailAndPasswords } from "../firebase";
//  Firebase Config
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
const db = getFirestore(app);
//
function QRSignIn() {
  const [html5QrCode, setHtml5QrCode] = useState(null);
  const [showStopButton, setShowStopButton] = useState(true);
  const [decodedResults, setDecodedResults] = useState([]);
  const [empcodeList, setEmpcodeList] = useState("");
  const [decodedResult, setDecodedResult] = useState("");
  //firebase
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const id = "reader";
  //
  useEffect(() => {
    const startScanning = async () => {
      try {
        let qrboxFunction = function (viewfinderWidth, viewfinderHeight) {
          let minEdgePercentage = 0.7; // 70%
          let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
          let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
          return {
            width: qrboxSize,
            height: qrboxSize,
          };
        };
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          const cameraId = devices[0].id;
          //console.log('first id', id)
          const qrCode = new Html5Qrcode(id);
          setHtml5QrCode(qrCode);
          await qrCode.clear();
          await qrCode.start(
            { facingMode: "environment" },
            {
              fps: 15,
              qrbox: qrboxFunction,
              aspectRatio: 1.333334,
            },
            async (decodedText, decodedResult) => {
              setDecodedResult(decodedText.split(":")[1].trim());

              const soundEffect = new Audio(sound);
              soundEffect.play();
            }
          );
        }
      } catch (err) {
        console.log("inside UseEffect", err);
      }
    };
    startScanning();
    return () => {
      if (html5QrCode) {
        html5QrCode
          .stop()
          .then(() => {
            console.log("QR code scanner stopped.");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
  }, []);
  useEffect(() => {
    //Real time Updates
    const unsub = onSnapshot(
      collection(db, "empcode"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setEmpcodeList(list);
        const result1 = list.filter((empCodes, index) => {
          if (empCodes.id === decodedResult) {
            setEmail(empCodes.email);
            setPassword(empCodes.password);
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
  }, [decodedResult]);
  //
  useLayoutEffect(() => {
    const unsub = onSnapshot(
      collection(db, "empcode"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setEmpcodeList(list);
        list.filter((empCodes, index) => {
          if (empCodes.id === decodedResult) {
            logInWithEmailAndPasswords(email, password);
            console.log("Success");
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
  }, [decodedResult, email, password]);

  useEffect(() => {
    if (loading) {
      console.log("inside loading");
      return;
    }
    if (user) {
      //console.log("if user", user);
      //console.log("auth.currentUser", auth.currentUser);
      console.log(
        "auth.currentUser.emailVerified",
        auth.currentUser.emailVerified
      );
      if (auth.currentUser.emailVerified) {
        // console.log(
        //   "auth.currentUser.emailVerified",
        //   auth.currentUser.emailVerified
        // );
        handleStopScanning();
        navigate("/user-dashboard");
      } else {
        console.log("inside else1");
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

  const handleStopScanning = () => {
    if (html5QrCode) {
      html5QrCode
        .stop()
        .then(() => {
          console.log("QR code scanner stopped.");
        })
        .catch((err) => {
          console.log(err);
        });
      setShowStopButton(false);
    }
  };

  return (
    <CoverLayout image={curved9}>
      <div className="p-4 box">
        {error && <Alert variant="danger">{error}</Alert>}
        <div
          className="d-flex justify-content-center flex-column m-auto"
          style={{ maxWidth: "600px" }}
        >
          <div
            id={id}
            className=" col-sm mb-2"
            style={{ height: "700px" }}
          ></div>
          {showStopButton && (
            <button className="btn btn-primary" onClick={handleStopScanning}>
              Stop Scanning
            </button>
          )}
          {/* <button className="btn btn-primary" onClick={handleStopScanning}>Stop Scanning</button> */}
          {decodedResults.length > 0 && <ScanResults data={decodedResults} />}
        </div>

        <SoftBox mt={3} textAlign="center">
          <SoftTypography variant="button" color="text" fontWeight="regular">
            Don&apos;t have an account?{" "}
            <SoftTypography
              component={Link}
              to="/authentication/sign-up"
              variant="button"
              style={{ color: "#0B2F8A" }}
              fontWeight="bold"
            >
              Register
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
        <SoftBox textAlign="center">
          <SoftTypography variant="button" color="text" fontWeight="regular">
            <SoftTypography
              component={Link}
              to="/authentication/email-signin"
              variant="button"
              style={{ color: "#0B2F8A" }}
              fontWeight="bold"
            >
              Signin with Email
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
      </div>
    </CoverLayout>
  );
}

export default QRSignIn;
