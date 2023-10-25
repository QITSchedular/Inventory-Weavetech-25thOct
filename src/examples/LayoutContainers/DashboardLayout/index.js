// react-router-dom components
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
// import bgimage from "assets/images/curved-images/QITLogo.png";
// import weaveTabimage from "assets/images/curved-images/WeaveLogoTab.png";
//import weaveTabimage1 from "assets/images/curved-images/WeaveTabLogo.png";

// Soft UI Dashboard React context
import { useSoftUIController, setLayout } from "context";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { auth, db, logout, storage } from "layouts/authentication/firebase";

import { onAuthStateChanged } from "firebase/auth";
import {
  query,
  collection,
  getDocs,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();
  const [user, setUser] = useState();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [url, setUrl] = useState(null);
  const [userRole, setUserRole] = useState();
  const imageListRef = ref(storage, "AllBGImages");

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  const fetchUserName = async (id) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", id));
      const doc = await getDocs(q);
      const userDoc = doc.docs[0].data();
      // console.log("User Status Details", userDoc);
      //console.log(userDoc.role);
      // setUser(userDoc);
      // setUpdateFlag(false);
      // console.log(userDoc.AoneStatusPrd);
      setUserName(userDoc.name);
      setUserEmail(userDoc.email);
      setUserRole(userDoc.role);
      //setUserPassword(userDoc.password);
      // setUserEmployeeCode(userDoc.empcode);
      // setUserPhone(userDoc.phone);
    } catch (err) {
      console.log(err);
      alert(err);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
      if (currentuser.uid.length > 0) {
        // console.log(currentuser);
        //console.log("2", currentuser);
        setUser(currentuser);
        await fetchUserName(currentuser.uid);
      } else {
        console.log("no such user");
        alert("no such user");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  //Picture
  useEffect(() => {
    listAll(imageListRef)
      .then((response) => {
        const ImageArray = response.items;
        // console.log("ImageArray", ImageArray);
        let filterFunction = ImageArray.filter((element) => {
          let Path = element._location.path;
          // console.log("element", element);
          // console.log("userEmail", userEmail);
          if (Path === `AllBGImages/BGImageof${userEmail}`) {
            //console.log("element", element);
            //console.log("filtered url", Path);
            getDownloadURL(element).then((url) => {
              //console.log("insidesetURL", url);
              setUrl(url);
              //  console.log("urlFinal", url);
            });
            return Path;
          }
        });
      })
      .catch((error) => {
        console.log("error in ImageDownloadUseEffect12", error);
      });
  }, [userEmail, url]);
  return (
    <SoftBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: 3,
        position: "relative",
        [breakpoints.up("xl")]: {
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
      // style={{
      //   backgroundImage: `url(${url})`,
      //   height: "100vh",
      //   //opacity: "50%",
      //   //background: "rgba(0, 0, 0, 0.5)",
      //   //marginTop: "-70px",
      //   //marginLeft: "-70px",
      //   //fontSize: "50px",
      //   // backgroundPosition: "center",
      //   backgroundSize: "cover",
      //   backgroundRepeat: "no-repeat",
      // }}
    >
      {children}
    </SoftBox>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
