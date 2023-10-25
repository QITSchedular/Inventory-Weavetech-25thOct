import { createContext, useContext, useEffect, useState } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../authentication/firebase";
import PropTypes from "prop-types";
import { formatDate } from "devextreme/localization";
import { query, collection, getDocs, where } from "firebase/firestore";
import { db } from "layouts/authentication/firebase";
import axios from "axios";

const userAuthContext = createContext();

function UserAuthContextProvider({ children }) {
  const myURL = new URL("https://weavetech.onthecloud.in:9090");
  const [user, setUser] = useState({});
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [getCurrentDateandTime, setGetCurrentDateandTime] = useState(
    new Date()
  );

  function setUpRecaptha(number) {
    const recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {},
      auth
    );
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth, number, recaptchaVerifier);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setUser(currentuser);
      fetchUserName(
        currentuser.uid,
        currentuser.metadata.creationTime,
        currentuser.metadata.lastSignInTime
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const fetchUserName = async (id, creationTime, lastSignInTime) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", id));
      const doc = await getDocs(q);
      const userDoc = doc.docs[0].data();
      setUser(userDoc);
      setUserName(userDoc.name);
      setUserEmail(userDoc.email);
      const userEmailID = userDoc.email;
      const userName = userDoc.name;
      //User Log
      const ApplyFilterDate = formatDate(getCurrentDateandTime, "yyyy-MM-dd");
      const loginDate = ApplyFilterDate;
      const ApplyFilterTime = formatDate(getCurrentDateandTime, "HH:mm");
      const loginTime =
        ApplyFilterTime[0] +
        ApplyFilterTime[1] +
        ApplyFilterTime[3] +
        ApplyFilterTime[4];
      const logoutDate = "";
      const logoutTime = 0;
      const dbName = "WEL";
      let postLogData = {
        userEmailID,
        userName,
        loginDate,
        loginTime,
        logoutDate,
        logoutTime,
        dbName,
      };
      try {
        let response = await axios.post(
          `${myURL.origin}/api/Logs/AddUser`,
          postLogData
        );
        // console.log("response", response.data.body.status)
        const LogStatus = response.data.status;
        if (LogStatus === "200") {
          console.log("Success Add User API....Log Table Status");
        } else {
          console.log("Failed Add User API....Log Table Status");
        }
      } catch (error) {
        console.log("Error in Add User API Log Table", error);
      }
      //User Log
      let postLogData1 = {
        userEmailID,
        userName,
        loginDate,
        loginTime,
        logoutDate,
        logoutTime,
      };
      try {
        let response = await axios.post(
          `${myURL.origin}/api/Logs/AddUserLog`,
          postLogData1
        );
        const LogStatus1 = response.data.status;
        if (LogStatus1 === "200") {
          console.log("Success Add User Log API....Log Table Status");
        } else {
          console.log("Failed Add User Log API...Log Table Status");
        }
      } catch (error) {
        console.log("Error in Add User Log API Log Table", error);
      }
    } catch (err) {
      console.log(err);
    }
  };
  //
  return (
    <userAuthContext.Provider
      value={{
        user,
        setUpRecaptha,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
UserAuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default UserAuthContextProvider;
