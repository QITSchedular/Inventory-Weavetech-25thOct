import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { auth, db } from "../authentication/firebase";
import { onAuthStateChanged } from "firebase/auth";
import notify from "devextreme/ui/notify";
import { query, collection, getDocs, where } from "firebase/firestore";
import { Button } from "devextreme-react/button";
//
function Reports() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userRole, setUserRole] = useState();
  const [GsixAReportsITRPrintLayout, setGSixAReportsITRPrintLayout] =
    useState("");
  const [HsixBReportsITRPLwithBarcode, setHSixBReportsITRPLwithBarcode] =
    useState("");
  const [IsixCReportsITLayout, setISixCReportsITLayout] = useState("");
  const [JsixDReportsIssueDC, setJSixDReportsIssueDC] = useState("");
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
      setGSixAReportsITRPrintLayout(userDoc.GsixAReportsITRPrintLayout);
      setHSixBReportsITRPLwithBarcode(userDoc.HsixBReportsITRPLwithBarcode);
      setISixCReportsITLayout(userDoc.IsixCReportsITLayout);
      setJSixDReportsIssueDC(userDoc.JsixDReportsIssueDC);
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
  }, []);
  const handleReportsITRPL = async (e) => {
    e.preventDefault();
    if (userEmail === "" || userName === "") {
      notify(
        {
          message:
            "Error Getting your Registration Details. Please Register Again...",
          width: 470,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1200
      );
    } else if (GsixAReportsITRPrintLayout === false) {
      notify(
        {
          message:
            "You are not Authorized to use ITR Print Layout. Please Contact Admin",
          width: 470,
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
          message: "Success !!!....Redirected to ITR Print Layout.",
          width: 370,
          position: "bottom center",
          direction: "up-push",
        },
        "success",
        1000
      );
      navigate("/Reports-ITR-Print-Layout");
    }
  };
  const handleReportsITRPLwithBarCode = async (e) => {
    e.preventDefault();
    if (userEmail === "" || userName === "") {
      notify(
        {
          message:
            "Error Getting your Registration Details. Please Register Again...",
          width: 470,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1200
      );
    } else if (HsixBReportsITRPLwithBarcode === false) {
      notify(
        {
          message:
            "You are not Authorized to use ITR Print Layout with BarCode. Please Contact Admin",
          width: 500,
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
          message:
            "Success !!!....Redirected to ITR Print Layout with BarCode.",
          width: 465,
          position: "bottom center",
          direction: "up-push",
        },
        "success",
        1000
      );
      navigate("/Reports-ITR-BarCode");
    }
  };
  const handleReportsITLayout = async (e) => {
    e.preventDefault();
    if (userEmail === "" || userName === "") {
      notify(
        {
          message:
            "Error Getting your Registration Details. Please Register Again...",
          width: 470,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1200
      );
    } else if (IsixCReportsITLayout === false) {
      notify(
        {
          message:
            "You are not Authorized to use IT Layout. Please Contact Admin",
          width: 500,
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
          message: "Success !!!....Redirected to IT Layout",
          width: 330,
          position: "bottom center",
          direction: "up-push",
        },
        "success",
        1000
      );
      navigate("/Reports-IT-Layout");
    }
  };
  const handleReportsIDC = async (e) => {
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
    } else if (JsixDReportsIssueDC === false) {
      notify(
        {
          message:
            "You are not Authorized to use Delivery Challan. Please Contact Admin",
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
          message: "Success !!!....Redirected to Delivery Challan",
          width: 370,
          position: "bottom center",
          direction: "up-push",
        },
        "success",
        1000
      );
      navigate("/Reports-Issue-Delivery-Challan");
    }
  };
  //Button & Navigation Components
  const StartButton = () => {
    return (
      <SoftTypography
        textAlign="center"
        mb={6}
        style={{
          color: "#0B2F8A",
          fontWeight: "700",
          fontSize: "25px",
          lineHeight: "30px",
          letterSpacing: 1,
        }}
      >
        Reports
      </SoftTypography>
    );
  };
  const ITRPLButton = () => {
    return (
      <Grid item xs={12} sm={6} xl={6}>
        <SoftBox style={myStyle} textAlign="center" pt={5} pb={5}>
          <SoftTypography
            // component={Link}
            // to="/Reports-ITR-Print-Layout"
            onClick={handleReportsITRPL}
            style={{ color: "white", cursor: "pointer" }}
          >
            ITR Print Layout
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };
  const ITRPLwithBarcodeButton = () => {
    return (
      <Grid item xs={12} sm={6} xl={6}>
        <SoftBox style={myStyle} textAlign="center" pt={5} pb={5}>
          <SoftTypography
            // component={Link}
            // to="/Reports-ITR-BarCode"
            onClick={handleReportsITRPLwithBarCode}
            style={{ color: "white", cursor: "pointer" }}
          >
            ITR Print Layout with Barcode
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };
  const ITLayoutButton = () => {
    return (
      <Grid item xs={12} sm={6} xl={6}>
        <SoftBox style={myStyle} textAlign="center" pt={5} pb={5}>
          <SoftTypography
            // component={Link}
            // to="/Reports-IT-Layout"
            onClick={handleReportsITLayout}
            style={{ color: "white", cursor: "pointer" }}
          >
            Inventory Transfer Layout
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };
  const IDCButton = () => {
    return (
      <Grid item xs={12} sm={6} xl={6}>
        <SoftBox style={myStyle} textAlign="center" pt={5} pb={5}>
          <SoftTypography
            // component={Link}
            // to="/Reports-Issue-Delivery-Challan"
            onClick={handleReportsIDC}
            style={{ color: "white", cursor: "pointer" }}
          >
            Issue Delivery Challan
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };
  const ITRPLButtonOne = () => {
    return (
      <Grid item xs={12} sm={6} xl={6}>
        <SoftBox
          style={myStyle}
          textAlign="center"
          pt={3}
          pb={3}
          ml={20}
          mr={20}
        >
          <SoftTypography
            // component={Link}
            // to="/Reports-ITR-Print-Layout"
            onClick={handleReportsITRPL}
            style={{ color: "white", cursor: "pointer" }}
          >
            ITR Print Layout
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };
  const ITRPLwithBarcodeButtonOne = () => {
    return (
      <Grid item xs={12} sm={6} xl={6}>
        <SoftBox
          style={myStyle}
          textAlign="center"
          pt={3}
          pb={3}
          ml={20}
          mr={20}
        >
          <SoftTypography
            // component={Link}
            // to="/Reports-ITR-BarCode"
            onClick={handleReportsITRPLwithBarCode}
            style={{ color: "white", cursor: "pointer" }}
          >
            ITR Print Layout with Barcode
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };
  const ITLayoutButtonOne = () => {
    return (
      <Grid item xs={12} sm={6} xl={6}>
        <SoftBox
          style={myStyle}
          textAlign="center"
          pt={3}
          pb={3}
          ml={20}
          mr={20}
        >
          <SoftTypography
            // component={Link}
            // to="/Reports-IT-Layout"
            onClick={handleReportsITLayout}
            style={{ color: "white", cursor: "pointer" }}
          >
            Inventory Transfer Layout
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };
  const IDCButtonOne = () => {
    return (
      <Grid item xs={12} sm={6} xl={6}>
        <SoftBox
          style={myStyle}
          textAlign="center"
          pt={3}
          pb={3}
          ml={20}
          mr={20}
        >
          <SoftTypography
            // component={Link}
            // to="/Reports-Issue-Delivery-Challan"
            onClick={handleReportsIDC}
            style={{ color: "white", cursor: "pointer" }}
          >
            Issue Delivery Challan
          </SoftTypography>
        </SoftBox>
      </Grid>
    );
  };
  const goBack = () => {
    navigate("/user-dashboard");
  };
  const GoBackButton = () => {
    return (
      <SoftTypography
        textAlign="center"
        mb={6}
        style={{
          letterSpacing: 2,
        }}
      >
        <Button
          width={150}
          height={50}
          text="GO BACK"
          type="normal"
          stylingMode="contained"
          onClick={goBack}
        />
      </SoftTypography>
    );
  };
  return userRole === "Manager" ? (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3} mb={52}>
        <StartButton />
        <SoftBox mb={3} mt={10} ml={3} mr={3}>
          <Grid container spacing={12}>
            <ITRPLButton />
            <ITRPLwithBarcodeButton />
          </Grid>
        </SoftBox>
        <SoftBox mb={6} mt={10} ml={3} mr={3}>
          <Grid container spacing={12}>
            <ITLayoutButton />
            <IDCButton />
          </Grid>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  ) : (
    <div>
      {(() => {
        //All items False
        if (
          GsixAReportsITRPrintLayout === false &&
          HsixBReportsITRPLwithBarcode === false &&
          IsixCReportsITLayout === false &&
          JsixDReportsIssueDC === false
        ) {
          return (
            <div>
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
                      width={510}
                      height={250}
                      text="You are not authorized to View Reports. Contact Admin."
                      type="danger"
                      stylingMode="outlined"
                    />
                  </SoftTypography>
                  <SoftTypography
                    textAlign="center"
                    mb={6}
                    style={{
                      letterSpacing: 2,
                    }}
                  >
                    <Button
                      width={150}
                      height={50}
                      text="GO BACK"
                      type="danger"
                      stylingMode="contained"
                      onClick={goBack}
                    />
                  </SoftTypography>
                </SoftBox>
                <Footer />
              </DashboardLayout>
            </div>
          );
        }
        //All items True
        if (
          GsixAReportsITRPrintLayout === true &&
          HsixBReportsITRPLwithBarcode === true &&
          IsixCReportsITLayout === true &&
          JsixDReportsIssueDC === true
        ) {
          return (
            <div>
              <DashboardLayout>
                <DashboardNavbar />
                <SoftBox py={4} mb={50}>
                  <StartButton />
                  <SoftBox mb={3} mt={10} ml={3} mr={3}>
                    <Grid container spacing={12}>
                      <ITRPLButton />
                      <ITRPLwithBarcodeButton />
                    </Grid>
                  </SoftBox>
                  <SoftBox mb={6} mt={10} ml={3} mr={3}>
                    <Grid container spacing={12}>
                      <ITLayoutButton />
                      <IDCButton />
                    </Grid>
                  </SoftBox>
                </SoftBox>
                <Footer />
              </DashboardLayout>
            </div>
          );
        }
        //Third Condition Any one Condition true or many
        if (
          GsixAReportsITRPrintLayout === false ||
          HsixBReportsITRPLwithBarcode === false ||
          IsixCReportsITLayout === false ||
          JsixDReportsIssueDC === false
        ) {
          return (
            <div>
              <DashboardLayout>
                <DashboardNavbar />
                <SoftBox py={4} mb={38}>
                  <StartButton />
                  <div>
                    {(() => {
                      // console.log(GsixAReportsITRPrintLayout);
                      //1
                      if (
                        GsixAReportsITRPrintLayout === true &&
                        HsixBReportsITRPLwithBarcode === false &&
                        IsixCReportsITLayout === false &&
                        JsixDReportsIssueDC === false
                      ) {
                        return (
                          <div>
                            <ITRPLButtonOne />
                            <br />
                            <br />
                            <GoBackButton />
                          </div>
                        );
                      }
                      //2
                      if (
                        GsixAReportsITRPrintLayout === false &&
                        HsixBReportsITRPLwithBarcode === true &&
                        IsixCReportsITLayout === false &&
                        JsixDReportsIssueDC === false
                      ) {
                        return (
                          <div>
                            <ITRPLwithBarcodeButtonOne />
                            <br />
                            <br />
                            <GoBackButton />
                          </div>
                        );
                      }
                      //3
                      if (
                        GsixAReportsITRPrintLayout === false &&
                        HsixBReportsITRPLwithBarcode === false &&
                        IsixCReportsITLayout === true &&
                        JsixDReportsIssueDC === false
                      ) {
                        return (
                          <div>
                            <ITLayoutButtonOne />
                            <br />
                            <br />
                            <GoBackButton />
                          </div>
                        );
                      }
                      //4
                      if (
                        GsixAReportsITRPrintLayout === false &&
                        HsixBReportsITRPLwithBarcode === false &&
                        IsixCReportsITLayout === false &&
                        JsixDReportsIssueDC === true
                      ) {
                        return (
                          <div>
                            <IDCButtonOne />
                            <br />
                            <br />
                            <GoBackButton />
                          </div>
                        );
                      }
                      //1,2
                      if (
                        GsixAReportsITRPrintLayout === true &&
                        HsixBReportsITRPLwithBarcode === true &&
                        IsixCReportsITLayout === false &&
                        JsixDReportsIssueDC === false
                      ) {
                        return (
                          <div>
                            <ITRPLButtonOne />
                            <br />
                            <br />
                            <ITRPLwithBarcodeButtonOne />
                            <br />
                            <br />
                            <GoBackButton />
                          </div>
                        );
                      }
                      //1,3
                      if (
                        GsixAReportsITRPrintLayout === true &&
                        HsixBReportsITRPLwithBarcode === false &&
                        IsixCReportsITLayout === true &&
                        JsixDReportsIssueDC === false
                      ) {
                        return (
                          <div>
                            <ITRPLButtonOne />
                            <br />
                            <br />
                            <ITLayoutButtonOne />
                            <br />
                            <br />
                            <GoBackButton />
                          </div>
                        );
                      }
                      //1,4
                      if (
                        GsixAReportsITRPrintLayout === true &&
                        HsixBReportsITRPLwithBarcode === false &&
                        IsixCReportsITLayout === false &&
                        JsixDReportsIssueDC === true
                      ) {
                        return (
                          <div>
                            <ITRPLButtonOne />
                            <br />
                            <br />
                            <IDCButtonOne />
                            <br />
                            <br />
                            <GoBackButton />
                          </div>
                        );
                      }
                      //2,3
                      if (
                        GsixAReportsITRPrintLayout === false &&
                        HsixBReportsITRPLwithBarcode === true &&
                        IsixCReportsITLayout === true &&
                        JsixDReportsIssueDC === false
                      ) {
                        return (
                          <div>
                            <ITRPLwithBarcodeButtonOne />
                            <br />
                            <br />
                            <ITLayoutButtonOne />
                            <br />
                            <br />
                            <GoBackButton />
                          </div>
                        );
                      }
                      //2,4
                      if (
                        GsixAReportsITRPrintLayout === false &&
                        HsixBReportsITRPLwithBarcode === true &&
                        IsixCReportsITLayout === false &&
                        JsixDReportsIssueDC === true
                      ) {
                        return (
                          <div>
                            <ITRPLwithBarcodeButtonOne />
                            <br />
                            <br />
                            <IDCButtonOne />
                            <br />
                            <br />
                            <GoBackButton />
                          </div>
                        );
                      }
                      //3,4
                      if (
                        GsixAReportsITRPrintLayout === false &&
                        HsixBReportsITRPLwithBarcode === false &&
                        IsixCReportsITLayout === true &&
                        JsixDReportsIssueDC === true
                      ) {
                        return (
                          <div>
                            <ITLayoutButtonOne />
                            <br />
                            <br />
                            <IDCButtonOne />
                            <br />
                            <br />
                            <GoBackButton />
                          </div>
                        );
                      }
                      //1,2,3
                      if (
                        GsixAReportsITRPrintLayout === true &&
                        HsixBReportsITRPLwithBarcode === true &&
                        IsixCReportsITLayout === true &&
                        JsixDReportsIssueDC === false
                      ) {
                        return (
                          <div>
                            <ITRPLButtonOne />
                            <br />
                            <br />
                            <ITRPLwithBarcodeButtonOne />
                            <br />
                            <br />
                            <ITLayoutButtonOne />
                            <br />
                            <br />
                            <GoBackButton />
                          </div>
                        );
                      }
                      //1,2,4
                      if (
                        GsixAReportsITRPrintLayout === true &&
                        HsixBReportsITRPLwithBarcode === true &&
                        IsixCReportsITLayout === false &&
                        JsixDReportsIssueDC === true
                      ) {
                        return (
                          <div>
                            <ITRPLButtonOne />
                            <br />
                            <br />
                            <ITRPLwithBarcodeButtonOne />
                            <br />
                            <br />
                            <IDCButtonOne />
                            <br />
                            <br />
                            <GoBackButton />
                          </div>
                        );
                      }
                      //1,3,4
                      if (
                        GsixAReportsITRPrintLayout === true &&
                        HsixBReportsITRPLwithBarcode === false &&
                        IsixCReportsITLayout === true &&
                        JsixDReportsIssueDC === true
                      ) {
                        return (
                          <div>
                            <ITRPLButtonOne />
                            <br />
                            <br />
                            <ITLayoutButtonOne />
                            <br />
                            <br />
                            <IDCButtonOne />
                            <br />
                            <br />
                            <GoBackButton />
                          </div>
                        );
                      }
                      //2,3,4
                      if (
                        GsixAReportsITRPrintLayout === false &&
                        HsixBReportsITRPLwithBarcode === true &&
                        IsixCReportsITLayout === true &&
                        JsixDReportsIssueDC === true
                      ) {
                        return (
                          <div>
                            <ITRPLwithBarcodeButtonOne />
                            <br />
                            <br />
                            <ITLayoutButtonOne />
                            <br />
                            <br />
                            <IDCButtonOne />
                            <br />
                            <br />
                            <GoBackButton />
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

export default Reports;
