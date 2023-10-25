import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useNavigate } from "react-router-dom";
import "./index.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useState, useEffect } from "react";
import { auth, db } from "../authentication/firebase";
import notify from "devextreme/ui/notify";
import { Button } from "devextreme-react/button";
import { onAuthStateChanged } from "firebase/auth";
import {
  query,
  collection,
  getDocs,
  where,
  onSnapshot,
} from "firebase/firestore";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../authentication/firebase";
//
function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userRole, setUserRole] = useState();
  const [AoneStatusPrd, setAOneStatusPrd] = useState("");
  const [BtwoStatusGrn, setBTwoStatusGrn] = useState("");
  const [CthreeStatusITRManual, setCThreeStatusITRManual] = useState("");
  const [DfourStatusITR, setDFourStatusITR] = useState("");
  const [EfiveStatusIT, setEFiveStatusIT] = useState("");
  const [FsixStatusReports, setFSixStatusReports] = useState("");

  const [usersList, setUsersList] = useState("");
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState(null);
  const imageListRef = ref(storage, "AllBGImages");

  //Progress Bar Code
  const PageLoader1 = () => {
    if (loading) {
      return (
        <div className="divLoader">
          <svg
            className="svgLoader"
            viewBox="0 0 100 100"
            width="9em"
            height="9em"
          >
            <path
              ng-attr-d="{{config.pathCmd}}"
              ng-attr-fill="{{config.color}}"
              stroke="none"
              d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50"
              fill="#0B2F8A"
              transform="rotate(179.719 50 51)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                calcMode="linear"
                values="0 50 51;360 50 51"
                keyTimes="0;1"
                dur="1s"
                begin="0s"
                repeatCount="indefinite"
              ></animateTransform>
            </path>
          </svg>
        </div>
      );
    }
  };
  //Picture
  useEffect(() => {
    listAll(imageListRef)
      .then((response) => {
        const ImageArray = response.items;
        let filterFunction = ImageArray.filter((element) => {
          let Path = element._location.path;
          if (Path === `AllBGImages/BGImageof${userEmail}`) {
            getDownloadURL(element).then((url) => {
              setUrl(url);
            });
            return Path;
          }
        });
      })
      .catch((error) => {
        console.log("error in ImageDownloadUseEffect12", error);
      });
  }, [userEmail, url]);

  const bgStyle = {
    backgroundImage: `url(${url})`,
    height: "100vh",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };
  const bgStyles = {
    backgroundImage: `url(${url})`,
    height: "100vh",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };
  const myStyle = {
    backgroundColor: "#0B2F8A",
    boxShadow: "0px 8px 24px -2px rgba(11, 47, 138, 0.6)",
    borderRadius: "16px",
    color: "white",
  };
  const fetchUserName = async (id) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", id));
      const doc = await getDocs(q);
      const userDoc = doc.docs[0].data();
      setUserName(userDoc.name);
      setUserEmail(userDoc.email);
      setUserRole(userDoc.role);
      setAOneStatusPrd(userDoc.AoneStatusPrd);
      setBTwoStatusGrn(userDoc.BtwoStatusGrn);
      setCThreeStatusITRManual(userDoc.CthreeStatusITRManual);
      setDFourStatusITR(userDoc.DfourStatusITR);
      setEFiveStatusIT(userDoc.EfiveStatusIT);
      setFSixStatusReports(userDoc.FsixStatusReports);
      setLoading(false);
    } catch (err) {
      console.log(err);
      alert(err);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
      if (currentuser.uid.length > 0) {
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
  }, [userEmail]);
  //Get all users
  useEffect(() => {
    //Real time Updates
    const unsub = onSnapshot(
      collection(db, "users"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        //console.log('list', list)
        setUsersList(list);
      },
      (error) => {
        console.log("error in fetching users", error);
      }
    );
    return () => {
      unsub();
    };
  }, []);

  const usersStatus = () => {
    navigate("/weavetech-users");
  };
  const handleProductionOrder = async (e) => {
    e.preventDefault();
    if (userEmail === "" || userName === "") {
      notify(
        {
          message:
            "Error Getting your Registration Details. Please Register Again",
          width: 460,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1200
      );
    } else if (AoneStatusPrd === false) {
      notify(
        {
          message:
            "You are not Authorized to use Production Order.Please Contact Admin",
          width: 440,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1200
      );
    } else {
      notify(
        {
          message: "Success !!!....Redirected to Production Order.",
          width: 380,
          position: "bottom center",
          direction: "up-push",
        },
        "success",
        1600
      );
      navigate("/Production-Order");
    }
  };
  const handleGRN = async (e) => {
    e.preventDefault();
    if (userEmail === "" || userName === "") {
      notify(
        {
          message:
            "Error Getting your Registration Details. Please Register Again",
          width: 460,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1200
      );
    } else if (BtwoStatusGrn === false) {
      notify(
        {
          message: "You are not Authorized to use GRN.Please Contact Admin",
          width: 440,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1200
      );
    } else {
      notify(
        {
          message: "Success !!!....Redirected to Goods Receipt Note.",
          width: 400,
          position: "bottom center",
          direction: "up-push",
        },
        "success",
        1600
      );
      navigate("/Goods-Receipt");
    }
  };
  const handleITRManual = async (e) => {
    e.preventDefault();
    if (userEmail === "" || userName === "") {
      notify(
        {
          message:
            "Error Getting your Registration Details. Please Register Again",
          width: 460,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1200
      );
    } else if (CthreeStatusITRManual === false) {
      notify(
        {
          message:
            "You are not Authorized to use ITR Manual.Please Contact Admin...",
          width: 460,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1200
      );
    } else {
      notify(
        {
          message: "Success !!!....Redirected to ITR Manual.",
          width: 340,
          position: "bottom center",
          direction: "up-push",
        },
        "success",
        1600
      );
      navigate("/ITR-Manual");
    }
  };
  const handleITR = async (e) => {
    e.preventDefault();
    if (userEmail === "" || userName === "") {
      notify(
        {
          message:
            "Error Getting your Registration Details. Please Register Again",
          width: 460,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1200
      );
    } else if (DfourStatusITR === false) {
      notify(
        {
          message: "You are not Authorized to use ITR.Please Contact Admin",
          width: 440,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1200
      );
    } else {
      notify(
        {
          message: "Success !!!....Redirected to ITR.",
          width: 300,
          position: "bottom center",
          direction: "up-push",
        },
        "success",
        1600
      );
      navigate("/ITR-to-IT");
    }
  };
  const handleIT = async (e) => {
    e.preventDefault();
    if (userEmail === "" || userName === "") {
      notify(
        {
          message:
            "Error Getting your Registration Details. Please Register Again",
          width: 460,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1200
      );
    } else if (EfiveStatusIT === false) {
      notify(
        {
          message:
            "You are not Authorized to use Inventory Transfer.Please Contact Admin",
          width: 440,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1200
      );
    } else {
      notify(
        {
          message: "Success !!!....Redirected to Inventory Transfer",
          width: 380,
          position: "bottom center",
          direction: "up-push",
        },
        "success",
        1600
      );
      navigate("/inventory-transfer");
    }
  };
  const handleReports = async (e) => {
    e.preventDefault();
    if (userEmail === "" || userName === "") {
      notify(
        {
          message:
            "Error Getting your Registration Details. Please Register Again",
          width: 460,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1200
      );
    } else if (FsixStatusReports === false) {
      notify(
        {
          message:
            "You are not Authorized to use Production Order.Please Contact Admin",
          width: 440,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1200
      );
    } else {
      notify(
        {
          message: "Success !!!....Redirected to Reports",
          width: 310,
          position: "bottom center",
          direction: "up-push",
        },
        "success",
        1600
      );
      navigate("/reports");
    }
  };
  //Button Components
  const StartButton = () => {
    return (
      <SoftTypography
        textAlign="center"
        mb={6}
        style={{
          color: "#0B2F8A",
          fontWeight: "700",
          fontSize: "24px",
          lineHeight: "30px",
          fontFamily: "Arial",
          letterSpacing: 1,
        }}
      >
        Start your Inventory Management Journey
      </SoftTypography>
    );
  };
  const PrdButton = () => {
    return (
      <Grid item xs={12} sm={6} xl={4}>
        <SoftBox style={myStyle} textAlign="center" pt={5} pb={5}>
          <SoftTypography
            style={{
              color: "white",
              letterSpacing: 1,
              cursor: "pointer",
            }}
            onClick={handleProductionOrder}
          >
            Production Order
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };
  const GrnButton = () => {
    return (
      <Grid item xs={12} sm={6} xl={4}>
        <SoftBox style={myStyle} textAlign="center" pt={5} pb={5}>
          <SoftTypography
            style={{
              color: "white",
              letterSpacing: 1,
              cursor: "pointer",
            }}
            onClick={handleGRN}
          >
            Goods Receipt Note
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };
  const ITRManualButton = () => {
    return (
      <Grid item xs={12} sm={6} xl={4}>
        <SoftBox style={myStyle} textAlign="center" pt={5} pb={5}>
          <SoftTypography
            style={{
              color: "white",
              letterSpacing: 1,
              cursor: "pointer",
            }}
            onClick={handleITRManual}
          >
            ITR Manual (Job Work)
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };
  const ITRButton = () => {
    return (
      <Grid item xs={12} sm={6} xl={4}>
        <SoftBox style={myStyle} textAlign="center" pt={5} pb={5}>
          <SoftTypography
            style={{
              color: "white",
              letterSpacing: 1,
              cursor: "pointer",
            }}
            onClick={handleITR}
          >
            ITR to IT
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };
  const ITButton = () => {
    return (
      <Grid item xs={12} sm={6} xl={4}>
        <SoftBox style={myStyle} textAlign="center" pt={5} pb={5}>
          <SoftTypography
            style={{
              color: "white",
              letterSpacing: 1,
              cursor: "pointer",
            }}
            onClick={handleIT}
          >
            Inventory Transfer
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };
  const ReportsButton = () => {
    return (
      <Grid item xs={12} sm={6} xl={4}>
        <SoftBox style={myStyle} textAlign="center" pt={5} pb={5}>
          <SoftTypography
            style={{
              color: "white",
              letterSpacing: 1,
              cursor: "pointer",
            }}
            onClick={handleReports}
          >
            ITR Reports
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };
  //Button One
  const PrdButtonOne = () => {
    return (
      <Grid item xs={12} sm={6} xl={4}>
        <SoftBox
          style={myStyle}
          textAlign="center"
          pt={3}
          pb={3}
          ml={20}
          mr={20}
        >
          <SoftTypography
            style={{
              color: "white",
              letterSpacing: 1,
              cursor: "pointer",
            }}
            onClick={handleProductionOrder}
          >
            Production Order
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };
  const GrnButtonOne = () => {
    return (
      <Grid item xs={12} sm={6} xl={4}>
        <SoftBox
          style={myStyle}
          textAlign="center"
          pt={3}
          pb={3}
          ml={20}
          mr={20}
        >
          <SoftTypography
            style={{
              color: "white",
              letterSpacing: 1,
              cursor: "pointer",
            }}
            onClick={handleGRN}
          >
            Goods Receipt Note
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };
  const ITRManualButtonOne = () => {
    return (
      <Grid item xs={12} sm={6} xl={4}>
        <SoftBox
          style={myStyle}
          textAlign="center"
          pt={3}
          pb={3}
          ml={20}
          mr={20}
        >
          <SoftTypography
            style={{
              color: "white",
              letterSpacing: 1,
              cursor: "pointer",
            }}
            onClick={handleITRManual}
          >
            ITR Manual (JobWork)
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };
  const ITRButtonOne = () => {
    return (
      <Grid item xs={12} sm={6} xl={4}>
        <SoftBox
          style={myStyle}
          textAlign="center"
          pt={3}
          pb={3}
          ml={20}
          mr={20}
        >
          <SoftTypography
            style={{
              color: "white",
              letterSpacing: 1,
              cursor: "pointer",
            }}
            onClick={handleITR}
          >
            ITR to IT
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };
  const ITButtonOne = () => {
    return (
      <Grid item xs={12} sm={6} xl={4}>
        <SoftBox
          style={myStyle}
          textAlign="center"
          pt={3}
          pb={3}
          ml={20}
          mr={20}
        >
          <SoftTypography
            style={{
              color: "white",
              letterSpacing: 1,
              cursor: "pointer",
            }}
            onClick={handleIT}
          >
            Inventory Transfer
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };
  const ReportsButtonOne = () => {
    return (
      <Grid item xs={12} sm={6} xl={4}>
        <SoftBox
          style={myStyle}
          textAlign="center"
          pt={3}
          pb={3}
          ml={20}
          mr={20}
        >
          <SoftTypography
            style={{
              color: "white",
              letterSpacing: 1,
              cursor: "pointer",
            }}
            onClick={handleReports}
          >
            ITR Reports
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };

  return loading ? (
    <PageLoader1 />
  ) : userRole === "Manager" ? (
    <div style={bgStyles}>
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox py={4} mb={30}>
          <StartButton />
          <SoftTypography
            textAlign="center"
            mb={6}
            style={{
              color: "#0B2F8A",
              fontWeight: "700",
              fontSize: "22px",
              lineHeight: "30px",
              letterSpacing: 1,
            }}
          >
            <Button
              width={200}
              text="Edit your Users Status"
              type="normal"
              stylingMode="contained"
              onClick={usersStatus}
            />
          </SoftTypography>
          <SoftBox mb={3} mt={10}>
            <Grid container spacing={12}>
              <PrdButton />
              <GrnButton />
              <ITRManualButton />
            </Grid>
          </SoftBox>
          <SoftBox mb={6} mt={10}>
            <Grid container spacing={12}>
              <ITRButton />
              <ITButton />
              <ReportsButton />
            </Grid>
          </SoftBox>
        </SoftBox>
        <Footer />
      </DashboardLayout>
    </div>
  ) : (
    <div>
      {(() => {
        //All items False
        if (
          AoneStatusPrd === false &&
          BtwoStatusGrn === false &&
          CthreeStatusITRManual === false &&
          DfourStatusITR === false &&
          EfiveStatusIT === false &&
          FsixStatusReports === false
        ) {
          return (
            <div style={bgStyle}>
              <DashboardLayout>
                <DashboardNavbar />
                <SoftBox py={4} mb={50}>
                  <StartButton />
                  <SoftTypography
                    textAlign="center"
                    mb={6}
                    style={{
                      letterSpacing: 2,
                    }}
                  >
                    <Button
                      width={500}
                      height={250}
                      text="You are not authorized to any Module. Contact Admin."
                      type="danger"
                      fontSize="20px"
                      stylingMode="outlined"
                      //onClick={this.onClick}
                    />
                  </SoftTypography>
                </SoftBox>
                <Footer />
              </DashboardLayout>
            </div>
          );
        }
        //All items True if Admin
        if (
          userRole === "Admin" &&
          AoneStatusPrd === true &&
          BtwoStatusGrn === true &&
          CthreeStatusITRManual === true &&
          DfourStatusITR === true &&
          EfiveStatusIT === true &&
          FsixStatusReports === true
        ) {
          return (
            <div style={bgStyle}>
              <DashboardLayout>
                <DashboardNavbar />
                <SoftBox py={4} mb={30}>
                  <StartButton />

                  <SoftBox mb={3} mt={10}>
                    <Grid container spacing={12}>
                      <PrdButton />
                      <GrnButton />
                      <ITRManualButton />
                    </Grid>
                  </SoftBox>
                  <SoftBox mb={6} mt={10}>
                    <Grid container spacing={12}>
                      <ITRButton />
                      <ITButton />
                      <ReportsButton />
                    </Grid>
                  </SoftBox>
                </SoftBox>
                <Footer />
              </DashboardLayout>
            </div>
          );
        }
        //All items True if User
        if (
          userRole === "User" &&
          AoneStatusPrd === true &&
          BtwoStatusGrn === true &&
          CthreeStatusITRManual === true &&
          DfourStatusITR === true &&
          EfiveStatusIT === true &&
          FsixStatusReports === true
        ) {
          return (
            <div style={bgStyle}>
              <DashboardLayout>
                <DashboardNavbar />
                <SoftBox py={4} mb={30}>
                  <StartButton />
                  <SoftBox mb={3} mt={10}>
                    <Grid container spacing={12}>
                      <PrdButton />
                      <GrnButton />
                    </Grid>
                  </SoftBox>
                  <SoftBox mb={6} mt={10}>
                    <Grid container spacing={12}>
                      <ITRManualButton />
                      <ITRButton />
                    </Grid>
                  </SoftBox>
                  <SoftBox mb={6} mt={10}>
                    <Grid container spacing={12}>
                      <ITButton />
                      <ReportsButton />
                    </Grid>
                  </SoftBox>
                </SoftBox>
                <Footer />
              </DashboardLayout>
            </div>
          );
        }
        //Third Condition Any one Condition true
        if (
          AoneStatusPrd === false ||
          BtwoStatusGrn === false ||
          CthreeStatusITRManual === false ||
          DfourStatusITR === false ||
          EfiveStatusIT === false ||
          FsixStatusReports === false
        ) {
          return (
            <div style={bgStyle}>
              <DashboardLayout>
                <DashboardNavbar />
                <SoftBox py={4} mb={39}>
                  <StartButton />
                  <div>
                    {(() => {
                      // console.log(GsixAReportsITRPrintLayout);
                      //1
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                          </div>
                        );
                      }
                      //2
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <GrnButtonOne />
                          </div>
                        );
                      }
                      //3
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <ITRManualButtonOne />
                          </div>
                        );
                      }
                      //4
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <ITRButtonOne />
                          </div>
                        );
                      }
                      //5
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <ITButtonOne />
                          </div>
                        );
                      }
                      //6
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //1 2
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <GrnButtonOne />
                          </div>
                        );
                      }
                      //1 3
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                          </div>
                        );
                      }
                      //1 4
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                          </div>
                        );
                      }
                      //1 5
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                          </div>
                        );
                      }
                      //1 6
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //2 3
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                          </div>
                        );
                      }
                      //2 4
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                          </div>
                        );
                      }
                      //2 5
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                          </div>
                        );
                      }

                      //2 6
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //3 4
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                          </div>
                        );
                      }
                      //3 5
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                          </div>
                        );
                      }
                      //3 6
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //4 5
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                          </div>
                        );
                      }
                      //4 6
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //5 6
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <ITButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //1 2 3
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                          </div>
                        );
                      }
                      //1 2 4
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                          </div>
                        );
                      }
                      //1 2 5
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                          </div>
                        );
                      }
                      //1 2 6
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //1 3 4
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                          </div>
                        );
                      }
                      //1 3 5
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                          </div>
                        );
                      }
                      //1 3 6
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //1 4 5
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                          </div>
                        );
                      }
                      //1 4 6
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //1 5 6
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //2 3 4
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                          </div>
                        );
                      }
                      //2 3 5
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                          </div>
                        );
                      }
                      //2 3 6
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //2 4 5
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                          </div>
                        );
                      }
                      //2 4 6
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //2 5 6
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //3 4 5
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                          </div>
                        );
                      }
                      //3 4 6
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //3 5 6
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //4 5 6
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //13 Permutations
                      //1 2 3 4
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                          </div>
                        );
                      }
                      //1 2 3 5
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                          </div>
                        );
                      }
                      //1 2 3 6
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //1 2 4 5
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                          </div>
                        );
                      }
                      //1 2 4 6
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //1 2 5 6
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //1 3 4 5
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                          </div>
                        );
                      }
                      //1 3 4 6
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //1 4 5 6
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //1 3 5 6
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //2 3 4 5
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                          </div>
                        );
                      }
                      //2 3 4 6
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //2 3 5 6
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //2 4 5 6
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //3 4 5 6
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //5 Permutations
                      //1 2 3 4 5
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === false
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                          </div>
                        );
                      }
                      //1 2 3 4 6
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === false &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //1 2 3 5 6
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === false &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //1 3 4 5 6
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === false &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //1 2 4 5 6
                      if (
                        AoneStatusPrd === true &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === false &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <PrdButtonOne />
                            <br />
                            <br />
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                      //2 3 4 5 6
                      if (
                        AoneStatusPrd === false &&
                        BtwoStatusGrn === true &&
                        CthreeStatusITRManual === true &&
                        DfourStatusITR === true &&
                        EfiveStatusIT === true &&
                        FsixStatusReports === true
                      ) {
                        return (
                          <div>
                            <GrnButtonOne />
                            <br />
                            <br />
                            <ITRManualButtonOne />
                            <br />
                            <br />
                            <ITRButtonOne />
                            <br />
                            <br />
                            <ITButtonOne />
                            <br />
                            <br />
                            <ReportsButtonOne />
                          </div>
                        );
                      }
                    })()}
                  </div>
                </SoftBox>
                <Footer />
              </DashboardLayout>
            </div>
          );
        }
      })()}
    </div>
  );
}

export default UserDashboard;
