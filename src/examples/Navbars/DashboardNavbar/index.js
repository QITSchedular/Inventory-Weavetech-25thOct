import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";
// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import NotificationItem from "examples/Items/NotificationItem";
import { useNavigate } from "react-router-dom";
import notify from "devextreme/ui/notify";
import { db, logout } from "layouts/authentication/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { query, collection, getDocs, where } from "firebase/firestore";
// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
} from "examples/Navbars/DashboardNavbar/styles";
// Soft UI Dashboard React context
import { initializeApp } from "firebase/app";
import {
  useSoftUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import { getAuth, signOut } from "firebase/auth";
// Images
import home from "assets/images/curved-images/home3.jpg";
import user1 from "assets/images/curved-images/user1.png";
//import password from "assets/images/curved-images/pwd.png";
import help from "assets/images/curved-images/help.png";
import signout from "assets/images/curved-images/signout.jpg";
//import trash from "assets/images/curved-images/trash.png";
import IdleTimer from "../../../IdleTimer";

const firebaseConfig = {
  apiKey: "AIzaSyCyAfYeL3UumZtZoOB9HCkAA31XzRU1PC4",
  authDomain: "weave-tech-sap-b1.firebaseapp.com",
  projectId: "weave-tech-sap-b1",
  storageBucket: "weave-tech-sap-b1.appspot.com",
  messagingSenderId: "233950696025",
  appId: "1:233950696025:web:12a7cfec17abdc7ea41748",
  measurementId: "G-EY30M5PFN2",
};
//
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
//
function DashboardNavbar({ absolute, light, isMini }) {
  const [user, setUser] = useState("");
  const [userName, setUserName] = useState("");
  const [userLogoName, setUserLogoName] = useState("");
  const navigate = useNavigate();
  const [isTimeout, setIsTimeout] = useState(false);
  //
  // useEffect(() => {
  //   const timer = new IdleTimer({
  //     timeout: 1800, //expire after ${30 min} in seconds
  //     onTimeout: () => {
  //       setIsTimeout(true);
  //     },
  //     onExpired: () => {
  //       // do something if expired on load
  //       setIsTimeout(true);
  //     }
  //   });
  //   if(isTimeout){
  //     signOut(auth);
  //     navigate('authentication/email-signin');
  //   }
  //   else{
  //     return;
  //   }
  //   return () => {
  //     timer.cleanUp();
  //   };
  // }, [isTimeout]);

  const fetchUserName = async (id) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", id));
      const doc = await getDocs(q);
      const userDoc = doc.docs[0].data();
      // console.log("1", userDoc);
      // console.log(userDoc);
      setUser(userDoc);
      setUserName(userDoc.name);
      setUserLogoName(userDoc.logoName);
    } catch (err) {
      console.log(err);
      notify(
        {
          message: "Some Error in getting your Details",
          width: 500,
          //shading: true,
          position: "center",
          direction: "up-stack",
        },
        "error",
        1500
      );
    }
  };
  //
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
      if (currentuser.uid.length > 0) {
        setUser(currentuser);
        await fetchUserName(currentuser.uid);
      } else {
        console.log("no such user");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userLogoName]);
  //
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } =
    controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  //
  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(
        dispatch,
        (fixedNavbar && window.scrollY === 0) || !fixedNavbar
      );
    }

    /**
     The event listener that's calling the handleTransparentNavbar function when
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar, userLogoName]);
  //
  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem
        image={<img src={home} alt="home" />}
        title={["Dashboard"]}
        date="View your Dashboard here"
        onClick={handleCloseMenu}
        component={Link}
        to="/user-dashboard"
      />
      <NotificationItem
        image={<img src={user1} alt="person" />}
        title={["Profile Settings"]}
        date="You can Edit your Profile Here"
        onClick={handleCloseMenu}
        component={Link}
        to="/edit-profile"
      />
      <NotificationItem
        image={<img src={help} alt="person" />}
        title={["Help"]}
        date="Any Queries? Click Here..."
        onClick={handleCloseMenu}
        component={Link}
        to="/help"
      />
      <NotificationItem
        image={<img src={signout} alt="person" />}
        title={["Sign Out"]}
        date="You can Sign Out your account Here"
        onClick={logout}
        component={Link}
        to="/authentication/signin"
      />
    </Menu>
  );

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <SoftBox
          color="inherit"
          mb={{ xs: 1, md: 0 }}
          sx={(theme) => navbarRow(theme, { isMini })}
        >
          <SoftTypography
            style={{
              color: "#FF0080",
              fontSize: "23px",
              letterSpacing: 1.5,
              fontWeight: "800",
              fontFamily: "Arial",
            }}
            component={Link}
            to="/user-dashboard"
          >
            <strong>{userLogoName}</strong>
          </SoftTypography>
        </SoftBox>

        {isMini ? null : (
          <SoftBox sx={(theme) => navbarRow(theme, { isMini })}>
            <SoftBox
              color="inherit"
              mb={{ xs: 1, md: 0 }}
              sx={(theme) => navbarRow(theme, { isMini })}
            >
              <SoftBox pr={1} style={{ color: "#0B2F8A", fontSize: "18px" }}>
                <strong>Welcome, {userName}</strong>
              </SoftBox>
            </SoftBox>
            <SoftBox color={light ? "white" : "inherit"}>
              <IconButton sx={navbarIconButton} size="small">
                <Icon
                  sx={({ palette: { dark, white } }) => ({
                    color: light ? white.main : dark.main,
                  })}
                >
                  account_circle
                </Icon>
                <SoftTypography
                  variant="button"
                  fontWeight="medium"
                  color={light ? "white" : "dark"}
                  // onClick={logout}
                  // component={Link}
                  // to='/authentication/email-signin'
                >
                  Settings
                </SoftTypography>
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon className={light ? "text-white" : "text-dark"}>
                  settings
                </Icon>
              </IconButton>
              {renderMenu()}
            </SoftBox>
          </SoftBox>
        )}
      </Toolbar>
    </AppBar>
  );
}
// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};
// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};
export default DashboardNavbar;
