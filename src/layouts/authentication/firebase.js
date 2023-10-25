import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { getFirestore, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import notify from "devextreme/ui/notify";

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
const storage = getStorage(app);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    if (auth.currentUser.emailVerified) {
      console.log("first", auth);
      return;
    } else {
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
    }
  } catch (err) {
    console.log("error in Login Account", err);
    notify(
      {
        message: "Invalid Email or Password...",
        width: 300,
        position: "bottom center",
        direction: "up-push",
      },
      "error",
      1500
    );
    //alert(err.message);
  }
};
const logInWithEmailAndPasswords = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log("error in Login Account", error);
    // notify(
    //   {
    //     message: "Invalid Email or Password...",
    //     width: 300,
    //     position: "bottom center",
    //     direction: "up-push",
    //   },
    //   "error",
    //   1500
    // );
    //alert(err.message);
  }
};

const registerWithEmailAndPassword = async (
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
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", res.user.uid), {
      uid: user.uid,
      name,
      empcode,
      role,
      phone,
      authProvider: "local",
      timeStamp: serverTimestamp(),
      email,
      password,
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
      logoName,
    });
    //set the custom empid in new collection
    const empId = empcode;
    const addRefToDoc = doc(db, "empcode", empId);

    await setDoc(
      addRefToDoc,
      {
        empcode: empId,
        email: email,
        password: password,
        uid: user.uid,
      },
      {
        merge: true,
      }
    ).then(() => console.log("success"));
    // alert("Document written with ID: ", docRef.id);
  } catch (err) {
    console.log(err);
    //alert(err.message);
    notify(
      {
        message: err.message,
        width: 300,
        shading: true,
        position: "bottom center",
        direction: "up-push",
      },
      "error",
      1500
    );
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    notify(
      {
        message: "We have sent Password reset link to your Email!",
        width: 430,
        position: "bottom center",
        direction: "up-push",
      },
      "success",
      2000
    );
    //alert("We have sent Password reset link to your Email!");
  } catch (err) {
    //console.log(err);
    //alert(err.message);
    notify(
      {
        message: "Please Enter Registered Email...",
        width: 310,
        position: "bottom center",
        direction: "up-push",
      },
      "error",
      1500
    );
  }
};

const sendEmailAddVerification = async (email) => {
  //console.log("4665787789Inside Send Verify email", email);
  try {
    await sendEmailVerification(auth, email);
    notify(
      {
        message: "We have sent Verification link to your Email!",
        width: 430,
        position: "bottom center",
        direction: "up-push",
      },
      "success",
      2000
    );
    //alert("We have sent Password reset link to your Email!");
  } catch (err) {
    //console.log(err);
    //alert(err.message);
    notify(
      {
        message: "Please Enter Correct Credentials...",
        width: 320,
        position: "bottom center",
        direction: "up-push",
      },
      "error",
      1500
    );
  }
};

const logout = () => {
  signOut(auth);
  notify(
    {
      message: "You are Loggedout....",
      width: 270,
      shading: true,
      position: "bottom center",
      direction: "up-push",
    },
    "success",
    1500
  );
};
export {
  auth,
  db,
  logInWithEmailAndPassword,
  logInWithEmailAndPasswords,
  registerWithEmailAndPassword,
  sendPasswordReset,
  sendEmailAddVerification,
  logout,
  storage,
};
