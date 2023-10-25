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
import { formatDate } from "devextreme/localization";
import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import ValidationGroup from "devextreme-react/validation-group";
import notify from "devextreme/ui/notify";
import "devextreme-react/text-area";
import "devextreme/dist/css/dx.light.css";
import DateBox from "devextreme-react/date-box";
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
const moduleList = [
  "Production Order",
  "Goods Receipt Note",
  "ITR Manual",
  "ITR",
  "Inventory Transfer",
  "Reports",
];

const exportFormats = ["pdf", "xlsx"];

function LogStatus() {
  const navigate = useNavigate();
  // my codes:
  const [user, setUser] = useState();
  const [userName, setUserName] = useState();
  const [userEmailOne, setUserEmailOne] = useState();
  const [userRole, setUserRole] = useState();
  const [usersList, setUsersList] = useState("");
  const [loading, setLoading] = useState(false);
  const [fromDateOne, setFromDateOne] = useState("");
  const [toDateTwo, setToDateTwo] = useState("");
  const [module, setModule] = useState("");
  const [progressLoading, setProgressLoading] = useState(false);
  const [apiLogList, setAPILogList] = useState([]);
  const [emailCode, setEmailCode] = useState({});
  const [emailId, setEmailId] = useState("");
  //
  const min1 = new Date(fromDateOne);
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
    navigate("/log-status");
  };
  //PDF Excel Export Coding
  const onExporting = React.useCallback((e) => {
    if (e.format === "xlsx") {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("FilterLogStatus");
      exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], { type: "application/octet-stream" }),
            "FilterLogStatus.xlsx"
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
        doc.save("FilterLogStatus.pdf");
      });
    }
  });

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
      const q1 = getAuth();
      const doc = await getDocs(q);
      const userDoc = doc.docs[0].data();
      //console.log('All Users', q1)
      setUser(userDoc);
      setUserName(userDoc.name);
      setUserEmailOne(userDoc.email);
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
  const handleDisplayFilterLogStatus = async () => {
    if (fromDateOne === "" && toDateTwo === "") {
      setProgressLoading(false);
      notify(
        {
          message: "Please Fill From Date & To Date....",
          width: 310,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        500
      );
    } else {
      var fromDate = formatDate(fromDateOne, "yyyy-MM-dd");
      var toDate = formatDate(toDateTwo, "yyyy-MM-dd");
      var userEmail = emailId;
      let postLogData = {
        fromDate,
        toDate,
        userEmail,
        module,
      };
      try {
        let response = await axios.post(
          `${BACKEND_URL}/api/Logs/GetTransactionWiseFilterLog`,
          postLogData
        );
        const APIList = response.data;
        setAPILogList(APIList);
      } catch (error) {
        console.log("Error in Apply Filter Log Table", error);
      }
    }
  };

  return loading ? (
    <PageLoader1 />
  ) : userRole === "Manager" ? (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3} mb={15}>
        {/* Component1 */}
        <SoftBox mb={4}>
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
            Filter Log Status
          </SoftTypography>
        </SoftBox>
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
        {/* Input Fields */}
        <SoftBox py={3} mb={0} textAlign="center">
          <SoftBox ml={2} mr={2} mb={0} mt={0}>
            <Card>
              <SoftBox textAlign="center" mt={3} mb={4} ml={4} mr={4}>
                <ValidationGroup>
                  <Form colCount={2} labelMode="static" labelLocation="left">
                    <GroupItem caption="Enter the Details">
                      <DateBox
                        label="From Document Date"
                        labelMode="floating"
                        pickerType="calendar"
                        type="date"
                        displayFormat="dd/MM/yyyy"
                        showClearButton={true}
                        defaultValue={fromDateOne}
                        valueChangeEvent="change"
                        onValueChanged={(e) => {
                          setFromDateOne(e.value);
                        }}
                      ></DateBox>
                      <br />
                      <DateBox
                        label="To Document Date"
                        labelMode="floating"
                        displayFormat="dd/MM/yyyy"
                        pickerType="calendar"
                        showClearButton={true}
                        defaultValue={toDateTwo}
                        valueChangeEvent="change"
                        min={min1}
                        onValueChanged={(e) => {
                          setToDateTwo(e.value);
                        }}
                      ></DateBox>
                    </GroupItem>
                    <GroupItem caption="Select the Details">
                      <SelectBox
                        dataSource={moduleList}
                        label="Module List"
                        labelMode="floating"
                        showClearButton={true}
                        value={module}
                        onValueChanged={(e) => {
                          setModule(e.value);
                        }}
                      ></SelectBox>
                      <br />
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
                onClick={handleDisplayFilterLogStatus}
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
        {/* Apply Filter data Grid */}

        <div>
          {(() => {
            if (apiLogList[0] === undefined) {
              return;
            } else {
              return (
                <SoftBox ml={2} mr={2} mb={6} mt={6}>
                  <Card>
                    <SoftBox ml={4} mr={4} mb={4} mt={4}>
                      <DataGrid
                        dataSource={apiLogList}
                        keyExpr="id"
                        showBorders={true}
                        wordWrapEnabled={true}
                        allowColumnResizing={true}
                        columnAutoWidth={true}
                        onExporting={onExporting}
                      >
                        <Editing mode="popup" useIcons={true} />
                        <FilterRow visible={true} />
                        <HeaderFilter visible={true} allowSearch={true} />
                        <Scrolling columnRenderingMode="virtual"></Scrolling>
                        <Paging defaultPageSize={8} />
                        <Sorting mode="multiple" />
                        <Export enabled={true} formats={exportFormats} />
                        <Column
                          dataField="module"
                          caption="Module"
                          alignment="center"
                          allowEditing={false}
                        />
                        <Column
                          dataField="entryDate"
                          caption="Entry Date"
                          alignment="center"
                          allowEditing={false}
                        />
                        <Column
                          dataField="entryTime"
                          caption="Entry Time"
                          alignment="center"
                          allowEditing={false}
                        />
                        <Column
                          dataField="userEmailID"
                          caption="User Email ID"
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
                          dataField="status"
                          caption="Status"
                          alignment="center"
                          allowEditing={false}
                        />
                        <Column
                          dataField="statusMsg"
                          caption="Status Msg"
                          alignment="center"
                          allowEditing={false}
                        />
                        <Column
                          dataField="filter"
                          caption="Filter"
                          alignment="center"
                          allowEditing={false}
                        />
                        <Column
                          dataField="dbName"
                          caption="DB Name"
                          alignment="center"
                          allowEditing={false}
                        />
                        <MasterDetail
                          enabled={false}
                          autoExpandAll={false}
                          caption="id"
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
