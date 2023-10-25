import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react/button";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import React, { useState, useEffect, useLayoutEffect } from "react";
import Card from "@mui/material/Card";
import notify from "devextreme/ui/notify";
import "devextreme-react/text-area";
import "devextreme/dist/css/dx.light.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
//Show PDF & Excel Dev Extreme
import { jsPDF } from "jspdf";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import {
  query,
  collection,
  getDocs,
  where,
  doc,
  setDoc,
  getFirestore,
  onSnapshot,
  deleteDoc,
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

function WeaveTechUsers() {
  const navigate = useNavigate();
  // my codes:
  const [user, setUser] = useState();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userRole, setUserRole] = useState();
  const [updatedDoc, setUpdatedDoc] = useState();
  const [updatedKeyId, setUpdatedKeyId] = useState();
  const [deletedEmpCode, setDeletedEmpCode] = useState();
  const [deletedKeyId, setDeletedKeyId] = useState();
  const [usersList, setUsersList] = useState("");
  const [loading, setLoading] = useState(false);
  //
  const usersStatus = () => {
    navigate("/log-status");
  };
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
    //Real time Updates
    const unsub = onSnapshot(
      collection(db, "users"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
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
  //PDF Excel Export Coding
  const onExporting = React.useCallback((e) => {
    if (e.format === "xlsx") {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("AllUsers");
      exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], { type: "application/octet-stream" }),
            "AllUsers.xlsx"
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
        doc.save("AllUsers.pdf");
      });
    }
  });
  // Update Document
  useLayoutEffect(() => {
    try {
      const updatedId = updatedKeyId;
      const addRefToDoc = doc(db, "users", updatedId);
      setDoc(
        addRefToDoc,
        {
          uid: updatedDoc.uid,
          AoneStatusPrd: updatedDoc.AoneStatusPrd,
          BtwoStatusGrn: updatedDoc.BtwoStatusGrn,
          CthreeStatusITRManual: updatedDoc.CthreeStatusITRManual,
          DfourStatusITR: updatedDoc.DfourStatusITR,
          EfiveStatusIT: updatedDoc.EfiveStatusIT,
          FsixStatusReports: updatedDoc.FsixStatusReports,
          GsixAReportsITRPrintLayout: updatedDoc.GsixAReportsITRPrintLayout,
          HsixBReportsITRPLwithBarcode: updatedDoc.HsixBReportsITRPLwithBarcode,
          IsixCReportsITLayout: updatedDoc.IsixCReportsITLayout,
          JsixDReportsIssueDC: updatedDoc.JsixDReportsIssueDC,
          name: updatedDoc.name,
          empcode: updatedDoc.empcode,
          role: updatedDoc.role,
          phone: updatedDoc.phone,
          email: updatedDoc.email,
          password: updatedDoc.password,
          logoName: updatedDoc.logoName,
        },
        {
          merge: true,
        }
      ).then(() => console.log("success"));
    } catch (err) {
      console.log(err);
    }
  }, [updatedKeyId, updatedDoc]);
  //Delete Document
  useLayoutEffect(() => {
    const updatedeletedId = deletedKeyId;
    const updatedeletedEmpCode = deletedEmpCode;
    try {
      deleteDoc(doc(db, "users", updatedeletedId));
      deleteDoc(doc(db, "empcode", updatedeletedEmpCode));
      setUsersList(
        usersList.filter((item) => item.updatedeletedId !== updatedeletedId)
      );
    } catch (error) {
      console.log("error in delete doc", error);
    }
  }, [deletedKeyId]);

  return loading ? (
    <PageLoader1 />
  ) : userRole === "Manager" ? (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3} mb={15}>
        {/* Edit firebase users */}
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
            Edit your Users
          </SoftTypography>
        </SoftBox>
        {/* Button */}
        <SoftTypography
          textAlign="center"
          mb={4}
          style={{
            color: "#0B2F8A",
            fontWeight: "700",
            fontSize: "22px",
            lineHeight: "30px",
            letterSpacing: 1,
          }}
        >
          <Button
            width={240}
            text="Edit your Users Log Status"
            type="normal"
            stylingMode="contained"
            onClick={usersStatus}
          />
        </SoftTypography>
        {/* Edit Users */}
        <SoftBox ml={2} mr={2} mb={6} mt={0}>
          <Card>
            <SoftBox ml={4} mr={4} mb={4} mt={4}>
              <DataGrid
                dataSource={usersList}
                keyExpr="id"
                showBorders={true}
                allowColumnResizing={true}
                onRowUpdated={(e) => {
                  setUpdatedDoc(e.data);
                  setUpdatedKeyId(e.key);
                }}
                onRowRemoved={(e) => {
                  setDeletedKeyId(e.key);
                  setDeletedEmpCode(e.data.empcode);
                }}
                columnAutoWidth={true}
                onExporting={onExporting}
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
                <Paging defaultPageSize={8} />
                <Sorting mode="multiple" />
                <Export enabled={true} formats={exportFormats} />
                <Column
                  dataField="id"
                  caption="Id"
                  alignment="center"
                  allowEditing={false}
                  visible={false}
                />
                <Column
                  dataField="CthreeStatusITRManual"
                  caption="Status ITR Manual"
                  alignment="center"
                  visible={false}
                />
                <Column
                  dataField="name"
                  caption="Full Name"
                  alignment="center"
                  allowEditing={false}
                />
                <Column
                  dataField="DfourStatusITR"
                  caption="Status ITR"
                  alignment="center"
                  visible={false}
                />
                <Column
                  dataField="email"
                  caption="Email"
                  alignment="center"
                  allowEditing={false}
                />
                <Column
                  dataField="EfiveStatusIT"
                  caption="Status IT"
                  alignment="center"
                  visible={false}
                />
                <Column
                  dataField="empcode"
                  caption="Emp Code"
                  alignment="center"
                  allowEditing={false}
                />
                <Column
                  dataField="FsixStatusReports"
                  caption="Status Reports"
                  alignment="center"
                  visible={false}
                />
                <Column
                  dataField="phone"
                  caption="Phone"
                  alignment="center"
                  allowEditing={false}
                />
                <Column
                  dataField="GsixAReportsITRPrintLayout"
                  caption="Status Reports-ITR Print Layout"
                  alignment="center"
                  visible={false}
                />
                <Column
                  dataField="role"
                  caption="Role"
                  alignment="center"
                  allowEditing={false}
                />
                <Column
                  dataField="HsixBReportsITRPLwithBarcode"
                  caption="Status Reports-ITR with BarCode"
                  alignment="center"
                  visible={false}
                />
                <Column
                  dataField="uid"
                  caption="UID"
                  alignment="center"
                  allowEditing={false}
                />
                <Column
                  dataField="IsixCReportsITLayout"
                  caption="Status Reports- IT Layout"
                  alignment="center"
                  visible={false}
                />
                <Column
                  dataField="timeStamp"
                  caption="Time Stamp"
                  alignment="center"
                  allowEditing={false}
                  visible={false}
                />
                <Column
                  dataField="AoneStatusPrd"
                  caption="Status PRD"
                  alignment="center"
                  visible={false}
                />
                <Column
                  dataField="JsixDReportsIssueDC"
                  caption="Status Reports-Issue Delivery Challan"
                  alignment="center"
                  visible={false}
                />

                <Column
                  dataField="BtwoStatusGrn"
                  caption="Status GRN"
                  alignment="center"
                  visible={false}
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
        {/* Status Completed */}
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
export default WeaveTechUsers;
