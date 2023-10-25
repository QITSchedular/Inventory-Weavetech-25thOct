import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useNavigate } from "react-router-dom";
import SoftButton from "components/SoftButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import LinearProgress from "@mui/material/LinearProgress";
import Footer from "examples/Footer";
import axios from "axios";
import { Button } from "devextreme-react/button";
import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import ValidationGroup from "devextreme-react/validation-group";
import notify from "devextreme/ui/notify";
import "devextreme-react/text-area";
import "devextreme/dist/css/dx.light.css";
import SelectBox from "devextreme-react/select-box";
import Box from "@mui/material/Box";
import { Form, GroupItem } from "devextreme-react/form";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  query,
  collection,
  getDocs,
  where,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import "firebase/database";
import DataGrid, {
  Column,
  MasterDetail,
  Paging,
  FilterRow,
  Scrolling,
  HeaderFilter,
  Editing,
  Sorting,
  Export,
} from "devextreme-react/data-grid";
//Show PDF & Excel Dev Extreme
import { jsPDF } from "jspdf";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import { SeriesAPI, BACKEND_URL } from "../../api.js";
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
const auth = getAuth(app);
const db = getFirestore(app);
const exportFormats = ["pdf", "xlsx"];
//
function LogStatus() {
  const navigate = useNavigate();
  // my codes:
  const [user, setUser] = useState();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userRole, setUserRole] = useState();
  const [usersList, setUsersList] = useState("");
  const [loading, setLoading] = useState(false);
  const [progressLoading, setProgressLoading] = useState(false);
  const [emailCode, setEmailCode] = useState({});
  const [emailId, setEmailId] = useState("");
  const [emailId1, setEmailId1] = useState("");
  const [userLogList, setUserLogList] = useState([]);
  const [userLogList1, setUserLogList1] = useState([]);
  const [userName1, setUserName1] = useState("");
  //PDF Excel Export Coding
  const onExporting = React.useCallback((e) => {
    if (e.format === "xlsx") {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("AddITRLogStatus");
      exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], { type: "application/octet-stream" }),
            "AddITRLogStatus.xlsx"
          );
        });
      });
      e.cancel = true;
    } else if (e.format === "pdf") {
      const doc = new jsPDF();
      exportDataGridToPdf({
        jsPDFDocument: doc,
        component: e.component,
      }).then(() => {
        doc.save("AddITRLogStatus.pdf");
      });
    }
  });
  const ProgressLoader = () => {
    if (progressLoading) {
      return (
        <div
          style={{
            marginTop: "0px",
            marginLeft: "-50px",
            marginRight: "-50px",
          }}
        >
          <div>
            <Box sx={{ width: "100%" }}>
              <LinearProgress color="inherit" />
              <br></br>
              <h6>Loading....</h6>
            </Box>
          </div>
        </div>
      );
    }
  };
  const usersStatus = () => {
    navigate("/weavetech-users");
  };
  const APILogStatus = () => {
    navigate("/log-status-apiLog");
  };
  const FilterLogStatus = () => {
    navigate("/log-status-filterLog");
  };
  const AddITRLogStatus = () => {
    navigate("/log-status-addITRLog");
  };
  //
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
  const fetchUserName = async (id) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", id));
      //const q1 = getAuth()
      const doc = await getDocs(q);
      const userDoc = doc.docs[0].data();
      setUser(userDoc);
      setUserName(userDoc.name);
      setUserEmail(userDoc.email);
      setUserRole(userDoc.role);
    } catch (err) {
      console.log(err);
      notify(
        {
          message: "Some Error in getting your Details",
          width: 500,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1500
      );
    }
  };
  //Fetch User Name
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
      if (currentuser.uid.length > 0) {
        // console.log(currentuser);
        // console.log("2", currentuser);
        setUser(currentuser);
        await fetchUserName(currentuser.uid);
      } else {
        console.log("no such user");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  //Get all users
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "users"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setUsersList(list);

        let filterFunction = list.map((element) => {
          //console.log('first', element.email)
          if (element.email === "") {
            return;
          } else {
            return element.email;
          }
        });
        setEmailCode(filterFunction);
      },
      (error) => {
        console.log("error in fetching users", error);
      }
    );
    return () => {
      unsub();
    };
  }, []);
  //1. Send Filter Log Status
  const handleDisplayUserStatus1 = async () => {
    if (emailId1 === "") {
      setProgressLoading(false);
      notify(
        {
          message: "Please Enter Email Address....",
          width: 290,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        500
      );
    } else {
      var userEmailID = emailId1;
      var userName = userName1;

      let postLogData = {
        userEmailID,
        userName,
      };
      try {
        let response = await axios.post(
          `${BACKEND_URL}/api/Logs/GetUserLog`,
          postLogData
        );
        const APIList1 = response.data;
        //console.log('object', response.data)
        const APIListMessage1 = response.data.statusCode;
        if (APIListMessage1 == 400) {
          notify(
            {
              message: "Sorry...!!! There is no record found for this Filter.",
              width: 440,
              position: "bottom center",
              direction: "up-push",
            },
            "warning",
            2500
          );
        } else {
          setUserLogList1(APIList1);
        }
      } catch (error) {
        console.log("Error in Apply Filter Log Table", error);
        notify(
          {
            message: error,
            width: 500,
            shading: true,
            position: "bottom center",
            direction: "up-push",
          },
          "error",
          1000
        );
      }
    }
  };

  return loading ? (
    <PageLoader1 />
  ) : userRole === "Manager" ? (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3} mb={15}>
        {/* Button */}
        <SoftTypography
          textAlign="center"
          mb={1}
          style={{
            color: "#0B2F8A",
            fontWeight: "700",
            fontSize: "22px",
            lineHeight: "30px",
            letterSpacing: 1,
          }}
        >
          <Button
            width={100}
            text="Go Back"
            type="normal"
            stylingMode="contained"
            onClick={usersStatus}
          />
        </SoftTypography>
        {/* Button1 */}
        <SoftTypography
          textAlign="center"
          mb={1}
          style={{
            color: "#0B2F8A",
            fontWeight: "700",
            fontSize: "22px",
            lineHeight: "30px",
            letterSpacing: 1,
          }}
        >
          <Button
            width={220}
            text="View API Log Status"
            type="normal"
            stylingMode="contained"
            onClick={APILogStatus}
          />
        </SoftTypography>
        {/* Button2 */}
        <SoftTypography
          textAlign="center"
          mb={1}
          style={{
            color: "#0B2F8A",
            fontWeight: "700",
            fontSize: "22px",
            lineHeight: "30px",
            letterSpacing: 1,
          }}
        >
          <Button
            width={220}
            text="View Filter Log Status"
            type="normal"
            stylingMode="contained"
            onClick={FilterLogStatus}
          />
        </SoftTypography>
        {/* Button3 */}
        <SoftTypography
          textAlign="center"
          mb={1}
          style={{
            color: "#0B2F8A",
            fontWeight: "700",
            fontSize: "22px",
            lineHeight: "30px",
            letterSpacing: 1,
          }}
        >
          <Button
            width={220}
            text="View Add ITR Log Status"
            type="normal"
            stylingMode="contained"
            onClick={AddITRLogStatus}
          />
        </SoftTypography>
        {/*
        <SoftBox mb={4} mt={6}>
          <SoftTypography
            textAlign="center"
            mt={4}
            style={{
              color: "#0B2F8A",
              fontWeight: "700",
              fontSize: "23px",
              lineHeight: "20px",
            }}
          >
            Get Users Status
          </SoftTypography>
        </SoftBox>

        <SoftBox py={3} mb={0} textAlign="center">
          <SoftBox ml={2} mr={2} mb={1} mt={0}>
            <Card>
              <SoftBox textAlign="center" mt={3} mb={4} ml={4} mr={4}>
                <ValidationGroup>
                  <Form colCount={1} labelMode="static" labelLocation="left">
                    <GroupItem caption="Select Email Address">
                      <SelectBox
                        dataSource={emailCode}
                        label="Email Id"
                        labelMode="floating"
                        showClearButton={true}
                        value={emailId}
                        onValueChanged={(e) => {
                          setEmailId(e.value);
                        }}
                      ></SelectBox>
                    </GroupItem>
                  </Form>
                </ValidationGroup>
              </SoftBox>
            </Card>
            <ProgressLoader />
            <SoftBox container spacing={1} mt={5}>
              <SoftButton
                onClick={handleDisplayUserStatus}
                variant="contained"
                color="info"
                style={{
                  backgroundColor: "#0B2F8A",
                  boxShadow: " 0px 8px 24px -2px rgba(11, 47, 138, 0.6)",
                }}
              >
                Apply Filter
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </SoftBox>

        <SoftBox ml={2} mr={2} mb={6} mt={1}>
          <Card>
            <SoftBox ml={4} mr={4} mb={4} mt={4}>
              <DataGrid
                dataSource={userLogList}
                keyExpr="id"
                showBorders={true}
                allowColumnResizing={true}
                columnAutoWidth={true}
              >
                <Editing
                  mode="popup"
                  allowUpdating={true}
                  allowDeleting={true}
                  useIcons={true}
                />
                <FilterRow visible={true} />
                <HeaderFilter visible={true} allowSearch={true} />
                <Scrolling columnRenderingMode="virtual"></Scrolling>
                <Paging defaultPageSize={10} />
                <Sorting mode="multiple" />
                <Column
                  dataField="userEmailID"
                  caption="User EmailID"
                  alignment="center"
                  allowEditing={false}
                />
                <Column
                  dataField="userName"
                  caption="User Name"
                  alignment="center"
                  allowEditing={false}
                />
                <Column
                  dataField="loginDate"
                  caption="Login Date"
                  alignment="center"
                  allowEditing={false}
                />
                <Column
                  dataField="loginTime"
                  caption="Login Time"
                  alignment="center"
                  allowEditing={false}
                />
                <Column
                  dataField="logoutDate"
                  caption="Logout Date"
                  alignment="center"
                  allowEditing={false}
                />
                <Column
                  dataField="logoutTime"
                  caption="Logout Time"
                  alignment="center"
                  allowEditing={false}
                />
                <MasterDetail
                  enabled={false}
                  autoExpandAll={false}
                  caption="id"
                  // render={masterDataDetail}
                />
              </DataGrid>
            </SoftBox>
          </Card>
        </SoftBox>
         */}

        {/* Component2 */}
        {/* Last Login */}
        <SoftBox mb={4} mt={4}>
          <SoftTypography
            textAlign="center"
            mt={4}
            style={{
              color: "#0B2F8A",
              fontWeight: "700",
              fontSize: "23px",
              lineHeight: "20px",
            }}
          >
            Last user Login Logout Status
          </SoftTypography>
        </SoftBox>
        {/* Input Fields */}
        <SoftBox py={3} mb={0} textAlign="center">
          <SoftBox ml={2} mr={2} mb={1} mt={0}>
            <Card>
              <SoftBox textAlign="center" mt={3} mb={4} ml={4} mr={4}>
                <ValidationGroup>
                  <Form colCount={1} labelMode="static" labelLocation="left">
                    <GroupItem caption="Select Email Address">
                      <SelectBox
                        dataSource={emailCode}
                        label="Email Id"
                        labelMode="floating"
                        showClearButton={true}
                        value={emailId1}
                        onValueChanged={(e) => {
                          setEmailId1(e.value);
                        }}
                      ></SelectBox>
                      <br />
                    </GroupItem>
                  </Form>
                </ValidationGroup>
              </SoftBox>
            </Card>
            <ProgressLoader />
            <SoftBox container spacing={1} mt={5}>
              <SoftButton
                onClick={handleDisplayUserStatus1}
                variant="contained"
                color="info"
                style={{
                  backgroundColor: "#0B2F8A",
                  boxShadow: " 0px 8px 24px -2px rgba(11, 47, 138, 0.6)",
                }}
              >
                Apply Filter
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </SoftBox>
        {/* Login Logout data Grid */}
        <div>
          {(() => {
            if (userLogList1[0] === undefined) {
              return;
            } else {
              return (
                <SoftBox ml={2} mr={2} mb={6} mt={6}>
                  <Card>
                    <SoftBox ml={4} mr={4} mb={4} mt={4}>
                      <DataGrid
                        dataSource={userLogList1}
                        keyExpr="id"
                        showBorders={true}
                        allowColumnResizing={true}
                        columnAutoWidth={true}
                        onExporting={onExporting}
                      >
                        <Editing
                          mode="popup"
                          //allowUpdating={true}
                          //allowDeleting={true}
                          useIcons={true}
                        />
                        <FilterRow visible={true} />
                        <HeaderFilter visible={true} allowSearch={true} />
                        <Scrolling columnRenderingMode="virtual"></Scrolling>
                        <Paging defaultPageSize={10} />
                        <Sorting mode="multiple" />
                        <Export
                          enabled={true}
                          formats={exportFormats}
                          //allowExportSelectedData={true}
                        />
                        <Column
                          dataField="userEmailID"
                          caption="User EmailID"
                          alignment="center"
                          allowEditing={false}
                        />
                        <Column
                          dataField="userName"
                          caption="User Name"
                          alignment="center"
                          allowEditing={false}
                        />
                        <Column
                          dataField="loginDate"
                          caption="Login Date"
                          alignment="center"
                          allowEditing={false}
                        />
                        <Column
                          dataField="loginTime"
                          caption="Login Time"
                          alignment="center"
                          allowEditing={false}
                        />
                        <Column
                          dataField="logoutDate"
                          caption="Logout Date"
                          alignment="center"
                          allowEditing={false}
                        />
                        <Column
                          dataField="logoutTime"
                          caption="Logout Time"
                          alignment="center"
                          allowEditing={false}
                        />
                        <MasterDetail
                          enabled={false}
                          autoExpandAll={false}
                          caption="id"
                          // render={masterDataDetail}
                        />
                      </DataGrid>
                    </SoftBox>
                  </Card>
                </SoftBox>
              );
            }
          })()}
        </div>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  ) : (
    <div className="divLoader">
      <svg className="svgLoader" viewBox="0 0 100 100" width="9em" height="9em">
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

export default LogStatus;
