import React, { useState, useEffect } from "react";
import SoftBox from "components/SoftBox";
import axios from "axios";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Link } from "react-router-dom";
import { DropDownBox } from "devextreme-react/drop-down-box";
import DataGrid, {
  Selection,
  Paging,
  FilterRow,
  Scrolling,
} from "devextreme-react/data-grid";
import {
  staticSeriesAPI,
  StaticReportBase64PDF,
  StaticReportBase64Word,
  StaticReportBase64Excel,
} from "./ReportsStaticJSON.js";
import { query, collection, getDocs, where } from "firebase/firestore";
import { auth, db } from "../authentication/firebase";
import { onAuthStateChanged } from "firebase/auth";
import notify from "devextreme/ui/notify";
import RadioGroup from "devextreme-react/radio-group";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { SeriesAPI, BACKEND_URL } from "../../api.js";

function ReportsITRPrintLayout() {
  const [docNumAPIList, setDocNumAPIList] = useState([]);
  const [docNum, setDocNum] = useState([]);
  const [docEntry, setDocEntry] = useState([]);
  const gridColumnsSeries = ["series", "seriesName"];
  const gridColumnsDocNum = ["id", "docNum"];
  const [seriesid, setSeriesid] = useState("");
  const [seriesAPIList, setSeriesAPIList] = useState([]);
  const [headerList, setHeaderList] = useState("");
  const [radioBtnValue, setRadioBtnValue] = useState("PDF");
  const FormatRadioBtn = ["PDF", "Word", "Excel"];
  const [loading, setLoading] = useState(true);
  const [loadIndicatorVisible, setLoadIndicatorVisible] = useState(false);
  // const [getCurrentDateandTime, setGetCurrentDateandTime] = useState(
  //   new Date()
  // );
  const [readOnlyStatus, setReadOnlyStatus] = useState(true);
  //Series
  const [gridBoxValue1, setGridBoxValue1] = useState([1]);
  const [isGridBoxOpened1, setIsGridBoxOpened1] = useState(false);
  //DocNum
  const [gridBoxValue2, setGridBoxValue2] = useState([1]);
  const [isGridBoxOpened2, setIsGridBoxOpened2] = useState(false);
  //user login firebase status
  const [user, setUser] = useState();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userRole, setUserRole] = useState();

  //fetch user name
  const fetchUserName = async (id) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", id));
      const doc = await getDocs(q);
      const userDoc = doc.docs[0].data();
      setUserName(userDoc.name);
      setUserEmail(userDoc.email);
      setUserRole(userDoc.role);
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
  const paragraph = {
    color: "#0B2F8A",
    fontSize: "20px",
    fontWeight: "500",
  };
  const StartButton = () => {
    return (
      <SoftTypography
        mb={5}
        mt={1}
        style={{
          color: "#0B2F8A",
          fontWeight: "700",
          fontSize: "24px",
          lineHeight: "10px",
          letterSpacing: 1,
        }}
      >
        Reports
      </SoftTypography>
    );
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
  //Series API Grid Opened
  const dataGridOnSelectionChanged1 = async (e) => {
    setGridBoxValue1(e.selectedRowKeys);
    setSeriesid(e.selectedRowsData[0].series);
    setReadOnlyStatus(false);
    setIsGridBoxOpened1(false);
    const Series4 = e.selectedRowsData[0].series;
    //Get Document Number
    try {
      let response = await axios.get(
        `${BACKEND_URL}/api/DocNumBySeriess/FillITDocNumBySeries/${Series4}`
      );
      const NewDocNumList = response.data;
      setDocNumAPIList(NewDocNumList);
    } catch (error) {
      console.log("Error in getDocumentNumberBySeries", error);
      notify(
        {
          message: error.response.data.message,
          width: 370,
          //shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1000
      );
    }
  };
  const syncDataGridSelection1 = (e) => {
    setGridBoxValue1(e.value);
  };
  function gridBoxDisplayExpr1(item) {
    return item && `${item.series} -- ${item.seriesName}`;
  }
  const onGridBoxOpened1 = (e) => {
    if (e.name === "opened") {
      setIsGridBoxOpened1(e.value);
    }
    if (e.name === "isActive") {
      setSeriesid("");
    }
  };
  //Doc Num API Grid Opened
  const dataGridOnSelectionChanged2 = async (e) => {
    setGridBoxValue2(e.selectedRowKeys);
    setDocNum(e.selectedRowsData[0].docNum);
    setDocEntry(e.selectedRowsData[0].docEntry);
    setIsGridBoxOpened2(false);
  };
  const syncDataGridSelection2 = (e) => {
    setGridBoxValue2(e.value);
  };
  function gridBoxDisplayExpr2(item) {
    return item && `${item.docNum}`;
  }
  const onGridBoxOpened2 = (e) => {
    if (e.name === "opened") {
      setIsGridBoxOpened2(e.value);
    }
    if (e.name === "isActive") {
      setDocNum("");
      setDocEntry("");
    }
  };
  //useEffect
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/Seriess/GetSeriesByObject/67`)
      .then(function (response) {
        const seriesDataAPI = response.data;
        const NewSeriesDataAPIList = seriesDataAPI;
        if (NewSeriesDataAPIList === undefined || NewSeriesDataAPIList === "") {
          setSeriesAPIList(staticSeriesAPI);
          setLoading(false);
          notify(
            {
              message: "Server API's are not Working....",
              width: 280,
              shading: true,
              position: "bottom center",
              direction: "up-push",
            },
            "error",
            4000
          );
        } else {
          setSeriesAPIList(NewSeriesDataAPIList);
          setLoading(false);
        }
      })
      .catch(function (error) {
        console.log("Series API Error", error);
        setLoading(false);
        //alert("Server Error in Series API. Please try again after Sometime.");
        notify(
          {
            message:
              "Server Error in Series API. Please try again after Sometime....",
            width: 500,
            shading: true,
            position: "bottom center",
            direction: "up-push",
          },
          "error",
          4000
        );
      });
  }, []);
  const handleContinueStatic = async (e) => {
    setLoadIndicatorVisible(true);
    e.preventDefault();
    if (docNum === "" || seriesid === "") {
      notify(
        {
          message: "Please Fill all the Fields",
          width: 300,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1000
      );
      setLoadIndicatorVisible(false);
    } else {
      if (radioBtnValue === "PDF") {
        // console.log("inside PDF1");
        let newBase64 = StaticReportBase64PDF.file.data; //Static API
        setHeaderList(newBase64);
        setLoadIndicatorVisible(false);
      }
      if (radioBtnValue === "Word") {
        //console.log("inside Word1");
        let newBase64 = StaticReportBase64Word.file.data; //Static API
        setHeaderList(newBase64);
        setLoadIndicatorVisible(false);
      }

      if (radioBtnValue === "Excel") {
        // console.log("inside Excel1");
        let newBase64 = StaticReportBase64Excel.file.data; //Static API
        setHeaderList(newBase64);
        setLoadIndicatorVisible(false);
      }
    }
  };
  const PrintReportStatic = async (e) => {
    if (radioBtnValue === "PDF") {
      console.log("inside PDF");
      const linkSource = `data:application/pdf;base64,${headerList}`;
      const downloadLink = document.createElement("a");
      const fileName = "ReportsinPDF.pdf";
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
      setHeaderList("");
    }
    if (radioBtnValue === "Word") {
      console.log("inside Word");
      const linkSource = `data:application/rtf;base64,${headerList}`;
      const downloadLink = document.createElement("a");
      const fileName = "ReportsinWord.rtf";
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
      setHeaderList("");
    }

    if (radioBtnValue === "Excel") {
      console.log("inside Excel");
      const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${headerList}`;
      const downloadLink = document.createElement("a");
      const fileName = "ReportsinExcel.xlsx";
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
      setHeaderList("");
    }
  };

  return loading ? (
    <PageLoader1 />
  ) : userRole === "User" || userRole === "Admin" || userRole === "Manager" ? (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3} mb={65} textAlign="center">
        <StartButton />
        <SoftBox mb={3} textAlign="center">
          <SoftTypography style={paragraph} textAlign="center">
            Inventory Transfer Request Print layout with BarCode
          </SoftTypography>
          <SoftBox style={{ display: "flex", justifyContent: "center" }} mt={6}>
            <RadioGroup
              items={FormatRadioBtn}
              defaultValue={FormatRadioBtn[0]}
              layout="horizontal"
              //value={radioBtnValue}
              onValueChanged={(e) => {
                setRadioBtnValue(e.value);
                console.log(e.value);
              }}
            />
          </SoftBox>
          <SoftBox style={{ display: "flex", justifyContent: "center" }} mt={6}>
            <SoftBox pr={1}>
              <DropDownBox
                label="Series"
                labelMode="floating"
                opened={isGridBoxOpened1}
                wordWrapEnabled={true}
                selectByClick={true}
                deferRendering={false}
                valueExpr="series"
                displayExpr={gridBoxDisplayExpr1}
                dataSource={seriesAPIList}
                value={seriesid}
                showSelectionControls={true}
                applyValueMode="useButtons"
                onValueChanged={syncDataGridSelection1}
                onOptionChanged={onGridBoxOpened1}
                height={40}
              >
                <DataGrid
                  dataSource={seriesAPIList}
                  columns={gridColumnsSeries}
                  wordWrapEnabled={true}
                  hoverStateEnabled={true}
                  height="100%"
                  selectedRowKeys={seriesid}
                  onSelectionChanged={dataGridOnSelectionChanged1}
                >
                  <Selection mode="single" />
                  <Scrolling mode="virtual" />
                  <Paging enabled={true} pageSize={10} />
                  <FilterRow visible={true} />
                </DataGrid>
              </DropDownBox>
            </SoftBox>
            <SoftBox pr={1}>
              <DropDownBox
                label="Document Number"
                labelMode="floating"
                readOnly={readOnlyStatus}
                opened={isGridBoxOpened2}
                wordWrapEnabled={true}
                selectByClick={true}
                deferRendering={false}
                valueExpr="docNum"
                displayExpr={gridBoxDisplayExpr2}
                dataSource={docNumAPIList}
                value={docNum}
                showSelectionControls={true}
                applyValueMode="useButtons"
                onValueChanged={syncDataGridSelection2}
                onOptionChanged={onGridBoxOpened2}
                height={40}
                width={240}
              >
                <DataGrid
                  dataSource={docNumAPIList}
                  columns={gridColumnsDocNum}
                  wordWrapEnabled={true}
                  hoverStateEnabled={true}
                  height="100%"
                  selectedRowKeys={docNum}
                  onSelectionChanged={dataGridOnSelectionChanged2}
                >
                  <Selection mode="single" />
                  <Scrolling columnRenderingMode="virtual"></Scrolling>
                  <Paging defaultPageSize={5} />
                  <FilterRow visible={true} />
                </DataGrid>
              </DropDownBox>
            </SoftBox>
          </SoftBox>
          <SoftButton
            variant="contained"
            color="info"
            style={{
              marginRight: "25px",
              marginTop: "40px",
              backgroundColor: "#0B2F8A",
              boxShadow: " 0px 8px 24px -2px rgba(11, 47, 138, 0.6)",
            }}
            component={Link}
            to="/reports"
          >
            Go Back
          </SoftButton>
          <SoftButton
            variant="contained"
            color="info"
            style={{
              marginTop: "40px",
              backgroundColor: "#0B2F8A",
              boxShadow: " 0px 8px 24px -2px rgba(11, 47, 138, 0.6)",
            }}
            onClick={handleContinueStatic}
          >
            Continue
          </SoftButton>
          <br></br>
          <div style={{ marginTop: "60px" }}>
            <LoadIndicator
              height={80}
              width={80}
              enabled={true}
              visible={loadIndicatorVisible}
            />
          </div>
          <div>
            {(() => {
              if (headerList === "") {
                return;
              } else {
                return (
                  <div
                    style={{
                      marginTop: "-20px",
                    }}
                  >
                    <SoftButton
                      variant="contained"
                      color="info"
                      style={{
                        marginRight: "25px",
                        marginTop: "1px",
                        backgroundColor: "#0B2F8A",
                        boxShadow: " 0px 8px 24px -2px rgba(11, 47, 138, 0.6)",
                      }}
                      onClick={PrintReportStatic}
                    >
                      Print Report
                    </SoftButton>
                  </div>
                );
              }
            })()}
          </div>
        </SoftBox>
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

export default ReportsITRPrintLayout;
