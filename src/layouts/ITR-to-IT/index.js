import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import LoadingOverlay from "react-loading-overlay";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import "./index.css";
import Card from "@mui/material/Card";
import axios from "axios";
import React, { useState, useEffect, useLayoutEffect } from "react";
//dev extreme imports
import "devextreme/dist/css/dx.light.css";
import "devextreme-react/text-area";
import { Form, GroupItem } from "devextreme-react/form";
import { DateBox } from "devextreme-react/date-box";
import { TextBox } from "devextreme-react/text-box";
import { formatDate } from "devextreme/localization";
import { ValidationGroup } from "devextreme-react/validation-group";
import { DropDownBox } from "devextreme-react/drop-down-box";
import notify from "devextreme/ui/notify";
import { TextArea } from "devextreme-react/text-area";
import { NumberBox } from "devextreme-react";
import ScrollView from "devextreme-react/scroll-view";
import Validator, { RequiredRule } from "devextreme-react/validator";
import { LoadIndicator } from "devextreme-react/load-indicator";
import DataGrid, {
  Column,
  MasterDetail,
  Selection,
  Paging,
  FilterRow,
  Scrolling,
  HeaderFilter,
  Export,
  Editing,
  Sorting,
  Lookup,
  Toolbar,
  Item,
  Pager,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { staticInitialList1, staticInitialList2 } from "./staticJson.js";
import "./itemWiseWhsDetails.js";
//Show PDF & Excel Dev Extreme
import { jsPDF } from "jspdf";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
//Firebase Imports
import { query, collection, getDocs, where } from "firebase/firestore";
import { auth, db } from "../authentication/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { WarehouseAPI, SeriesAPI, BACKEND_URL } from "../../api.js";
import { TabPanel } from "devextreme-react/tab-panel";
import { Popup, ToolbarItem } from "devextreme-react/popup";
//Coding Starts
const gridColumnsWhs = ["whsCode", "whsName"];
const gridColumnsSeries = ["series", "seriesName"];
const exportFormats = ["pdf", "xlsx"];
const gridPopupItemCode = ["itemCode", "itemName"];
//
const InventoryTransferRequest = () => {
  const [seriesid, setSeriesid] = useState("");
  const [seriesAPIList, setSeriesAPIList] = useState([]);
  const [whsid, setWhsid] = useState(""); //from warehouse
  const [whsAPIList, setwhsAPIList] = useState([]); //from warehouse
  const [whsAPIList1, setwhsAPIList1] = useState([]); //from warehouse
  const [whsAPIList2, setwhsAPIList2] = useState([]); //from warehouse
  const [whsid1, setWhsid1] = useState(""); //to warehouse
  const [whsid2, setWhsid2] = useState(""); //from warehouse master detail
  const [headerList, setHeaderList] = useState([]);
  const [fromDateOne, setFromDateOne] = useState("");
  const [toDateTwo, setToDateTwo] = useState("");
  const [docNumOne, setDocNumOne] = useState("");
  const [docDate1, setDocDate1] = useState("");
  const [dueDate1, setDueDate1] = useState("");
  const [comments1, setComments1] = useState("");
  const [uomStatic, setUomStatic] = useState("");
  const [loading, setLoading] = useState(true);
  const [docNum1, setDocNum1] = useState("");
  const [docEntry1, setDocEntry1] = useState("");
  const [itLinesArray1, setItLinesArray1] = useState([]);
  const [fromWhs1, setFromWhs1] = useState("");
  const [toWhs1, setToWhs1] = useState("");
  const [changeInWhs, setChangeInWhs] = useState("");
  const [changeInItemCode, setChangeInItemCode] = useState("");
  const [changeInLineNum, setChangeInLineNum] = useState("");
  const [changeInDocEntry, setChangeInDocEntry] = useState("");
  //
  const [masterList, setMasterList] = useState([]);
  const [bufferMasterList, setBufferMasterList] = useState([]);
  const [newMasterListAfterLayout, setNewMasterListAfterLayout] = useState([]);
  const [updatedMasterListAsPerWhs, setUpdatedMasterListAsPerWhs] = useState(
    []
  );
  const [secondaryTabItemCode, setSecondaryTabItemCode] = useState(""); //from warehouse
  const [popupMasterList, setPopupMasterList] = useState(""); //from warehouse
  const [popupItemCode, setPopupItemCode] = useState(""); //from warehouse
  const [popupResult, setPopupResult] = useState(""); //from warehouse
  const [masterListPopupResult, setMasterListPopupResult] = useState(""); //from warehouse
  const [refilteredPopupMasterList, setRefilteredPopupMasterList] =
    useState(""); //from warehouse
  const [changeInDocEntry1, setChangeInDocEntry1] = useState("");
  //Loaders UseState
  const [isActiveOverLay, setIsActiveOverLay] = useState(false);
  const [loadIndicatorVisible, setLoadIndicatorVisible] = useState(false);
  const [getCurrentDateandTime, setGetCurrentDateandTime] = useState(
    new Date()
  );
  const [popupVisible, setPopupVisible] = React.useState(false);
  const [popupVisible1, setPopupVisible1] = React.useState(false);
  const [handleDocNum, setHandleDocNum] = React.useState(false);
  const [handleMasterDetail, setHandleMasterDetail] = React.useState(false);
  //Post Filter LogStatus
  const [module, setModule] = useState("ITR");
  const [progressLoading, setProgressLoading] = useState(false);
  //user login firebase status
  const [user, setUser] = useState();
  const [userName, setUserName] = useState();
  const [userEmailID, setUserEmailID] = useState();
  const [userRole, setUserRole] = useState();
  // First Popup
  const showPopup = React.useCallback(() => {
    setPopupItemCode("");
    setPopupResult("");
    setPopupVisible(true);
  }, [setPopupVisible]);
  //
  const hide = React.useCallback(() => {
    setPopupVisible(false);
  }, [setPopupVisible]);
  // Second Popup
  const showPopup1 = React.useCallback(() => {
    setPopupVisible1(true);
  }, [setPopupVisible1]);
  //
  const hide1 = React.useCallback(() => {
    setPopupVisible1(false);
  }, [setPopupVisible1]);

  //fetch user Name
  const fetchUserName = async (id) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", id));
      const doc = await getDocs(q);
      const userDoc = doc.docs[0].data();
      setUserName(userDoc.name);
      setUserEmailID(userDoc.email);
      setUserRole(userDoc.role);
    } catch (err) {
      console.log(err);
      //alert(err);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
      if (currentuser.uid.length > 0) {
        setUser(currentuser);
        await fetchUserName(currentuser.uid);
      } else {
        console.log("no such user");
        //alert("no such user");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  //Page Loaders
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
  const StartButton = () => {
    return (
      <SoftTypography
        mb={1}
        mt={1}
        style={{
          color: "#0B2F8A",
          fontWeight: "700",
          fontSize: "24px",
          lineHeight: "10px",
          letterSpacing: 1,
        }}
      >
        ITR to IT
      </SoftTypography>
    );
  };
  //
  const onExporting = React.useCallback((e) => {
    if (e.format === "xlsx") {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("ITR");
      exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], { type: "application/octet-stream" }),
            "ITRExcel.xlsx"
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
        doc.save("ITRPDF.pdf");
      });
    }
  });
  // Series Grid Box Open code
  const [gridBoxValue1, setGridBoxValue1] = useState([1]);
  const [isGridBoxOpened1, setIsGridBoxOpened1] = useState(false);
  // From Warehouse
  const [gridBoxValue, setGridBoxValue] = useState([1]);
  const [isGridBoxOpened, setIsGridBoxOpened] = useState(false);
  // To Warehouse
  const [gridBoxValue2, setGridBoxValue2] = useState([1]);
  const [isGridBoxOpened2, setIsGridBoxOpened2] = useState(false);
  // From Warehouse master Detail
  const [gridBoxValue3, setGridBoxValue3] = useState([1]);
  const [isGridBoxOpened3, setIsGridBoxOpened3] = useState(false);
  // Popup Item Detail View
  const [gridBoxValue4, setGridBoxValue4] = useState([1]);
  const [isGridBoxOpened4, setIsGridBoxOpened4] = useState(false);
  //Series API Grid Opened
  const dataGridOnSelectionChanged1 = async (e) => {
    setGridBoxValue1(e.selectedRowKeys);
    setSeriesid(e.selectedRowsData[0].series);
    setIsGridBoxOpened1(false);
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
  //From Warehouse API Grid Opened
  const dataGridOnSelectionChanged = (e) => {
    setGridBoxValue(e.selectedRowKeys);
    setWhsid(e.selectedRowsData[0].whsCode);
    setIsGridBoxOpened(false);
  };
  const syncDataGridSelection = (e) => {
    setGridBoxValue(e.value);
  };
  function gridBoxDisplayExpr(item) {
    return item && `${item.whsCode} -- ${item.whsName}`;
  }
  const onGridBoxOpened = (e) => {
    if (e.name === "opened") {
      setIsGridBoxOpened(e.value);
    }
    if (e.name === "isActive") {
      setWhsid("");
    }
  };
  //To Warehouse API Grid Opened
  const dataGridOnSelectionChanged2 = (e) => {
    setGridBoxValue2(e.selectedRowKeys);
    setWhsid1(e.selectedRowsData[0].whsCode);
    setIsGridBoxOpened2(false);
  };
  const syncDataGridSelection2 = (e) => {
    setGridBoxValue2(e.value);
  };
  function gridBoxDisplayExpr2(item) {
    return item && `${item.whsCode} -- ${item.whsName}`;
  }
  const onGridBoxOpened2 = (e) => {
    if (e.name === "opened") {
      setIsGridBoxOpened2(e.value);
    }
    if (e.name === "isActive") {
      setWhsid1("");
    }
  };
  //
  const handleCancel = () => {
    setHeaderList("");
  };
  //UseEffect of Series & Warehouse API
  useEffect(() => {
    const getSeriesAPI = async () => {
      const moduleName = {
        module: "ITR",
      };
      const NewSeriesDataAPIList = await SeriesAPI(moduleName);
      setSeriesAPIList(NewSeriesDataAPIList);
    };
    getSeriesAPI();
  }, []);
  //
  useEffect(() => {
    const getWarehouseAPI = async () => {
      const NewwhsDataAPIList = await WarehouseAPI();
      setwhsAPIList(NewwhsDataAPIList);
      setwhsAPIList1(NewwhsDataAPIList);
    };
    getWarehouseAPI();
    setLoading(false);
  }, []);
  // 1. Send API Log Data
  const handleAPILogStatus = async () => {
    const ApplyFilterDate = formatDate(getCurrentDateandTime, "yyyy-MM-dd");
    const entryDate = ApplyFilterDate;
    const ApplyFilterTime = formatDate(getCurrentDateandTime, "HH:mm");
    const entryTime =
      ApplyFilterTime[0] +
      ApplyFilterTime[1] +
      ApplyFilterTime[3] +
      ApplyFilterTime[4];
    const inputJson = "";
    const dbName = "WEL032023";
    const method = "GET";
    //Series API
    if (seriesid != "") {
      const apiUrl =
        "https://weavetech.onthecloud.in:9090/api/Seriess/GetSeriesByObject/1250000001";
      let postLogData = {
        module,
        entryDate,
        entryTime,
        userEmailID,
        userName,
        inputJson,
        apiUrl,
        method,
        dbName,
      };
      try {
        let response = await axios.post(
          `${BACKEND_URL}/api/Logs/AddAPILog`,
          postLogData
        );
        const LogStatus = response.data.status;
        if (LogStatus === "200") {
          console.log("Success....Series API Log Table Status");
        } else {
          console.log("Failed....Series API Log Table Status");
        }
      } catch (error) {
        console.log("Error in Series API Log Table", error);
      }
    }
    //Warehouse API
    if (whsid != "") {
      const apiUrl = "https://weavetech.onthecloud.in:9090/api/Warehouses/N";
      let postLogData1 = {
        module,
        entryDate,
        entryTime,
        userEmailID,
        userName,
        inputJson,
        apiUrl,
        method,
        dbName,
      };
      try {
        let response = await axios.post(
          `${BACKEND_URL}/api/Logs/AddAPILog`,
          postLogData1
        );
        const LogStatus1 = response.data.status;
        if (LogStatus1 === "200") {
          console.log("Success....Warehouse API Log Table Status");
        } else {
          console.log("Failed....Warehouse API Log Table Status");
        }
      } catch (error) {
        console.log("Error in Warehouse API Log Table", error);
      }
    }
  };
  // 1.1 Send Log Data API Master data Detail
  const handleAPILogStatus1 = async () => {
    const ApplyFilterDate = formatDate(getCurrentDateandTime, "yyyy-MM-dd");
    const entryDate = ApplyFilterDate;
    const ApplyFilterTime = formatDate(getCurrentDateandTime, "HH:mm");
    const entryTime =
      ApplyFilterTime[0] +
      ApplyFilterTime[1] +
      ApplyFilterTime[3] +
      ApplyFilterTime[4];
    const inputJson = "";
    const dbName = "WEL032023";
    const method = "GET";
    //Warehouse1 API
    if (whsid1 != "") {
      const apiUrl = "https://weavetech.onthecloud.in:9090/api/Warehouses/N";
      let postLogData1 = {
        module,
        entryDate,
        entryTime,
        userEmailID,
        userName,
        inputJson,
        apiUrl,
        method,
        dbName,
      };
      try {
        let response = await axios.post(
          `${BACKEND_URL}/api/Logs/AddAPILog`,
          postLogData1
        );
        const LogStatus1 = response.data.status;
        if (LogStatus1 === "200") {
          console.log("Success....Warehouse API Master data Log Table Status");
        } else {
          console.log("Failed....Warehouse API Master data Log Table Status");
        }
      } catch (error) {
        console.log("Error in Warehouse API Master data Log Table", error);
      }
    }
  };
  //All important Functions
  function containsWhitespace(str) {
    return /\s/.test(str);
  }
  const handleITRFilter = async (e) => {
    //setHeaderList(staticInitialList1); //Static API
    e.preventDefault();
    setProgressLoading(true);
    // Log Status
    const ApplyFilterDate = formatDate(getCurrentDateandTime, "yyyy-MM-dd");
    const entryDate = ApplyFilterDate;
    const ApplyFilterTime = formatDate(getCurrentDateandTime, "HH:mm");
    const entryTime =
      ApplyFilterTime[0] +
      ApplyFilterTime[1] +
      ApplyFilterTime[3] +
      ApplyFilterTime[4];
    const dbName = "WEL032023";
    // Log Status Completed
    if (
      fromDateOne === "" &&
      toDateTwo === "" &&
      docNumOne === "" &&
      seriesid === "" &&
      whsid === "" &&
      whsid1 === ""
    ) {
      setProgressLoading(false);
      notify(
        {
          message: "Please fill atleast one Field....",
          width: 300,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        500
      );
    } else {
      if (containsWhitespace(fromDateOne)) {
        var fromDate = formatDate(fromDateOne, "yyyy-MM-dd");
      } else {
        fromDate = fromDateOne.split("/").join("-");
      }
      if (containsWhitespace(toDateTwo)) {
        var toDate = formatDate(toDateTwo, "yyyy-MM-dd");
      } else {
        toDate = toDateTwo.split("/").join("-");
      }
      let fromWhs = whsid1;
      let toWhs = whsid;
      let docNum = docNumOne;
      let series = seriesid;
      //Grooming the API
      if (fromDate === "" || fromDate === undefined || fromDate === null) {
        fromDate = "";
      }
      if (toDate === "" || toDate === undefined || toDate === null) {
        toDate = "";
      }
      if (fromWhs === "" || fromWhs === undefined || fromWhs === null) {
        fromWhs = "";
      }
      if (toWhs === "" || toWhs === undefined || toWhs === null) {
        toWhs = "";
      }
      if (series === "" || series === undefined || series === null) {
        series = 0;
      }
      if (docNum === "" || docNum === null || docNum === undefined) {
        docNum = 0;
      }
      //Grooming the API
      const postData = {
        fromDate,
        toDate,
        fromWhs,
        toWhs,
        series,
        docNum,
      };
      // console.log("first", postData)
      try {
        let response = await axios.post(`${BACKEND_URL}/api/ITRs`, postData);
        const newData = response.data;
        let newList = newData;
        //
        const newList2 = newList.map((element) => {
          const docDate = element.docDate.split(" ")[0];
          //
          const itrDet = element.itrDet.map((element) => {
            const qtyInStock = element.qtyInStock.split(".")[0];
            return { ...element, qtyInStock };
          });
          //
          return { ...element, docDate, itrDet };
        });
        if (newList == undefined) {
          setHeaderList(newList);
          setProgressLoading(false);
          notify(
            {
              message: "Sorry...!!! There is an error in server APIs.",
              width: 320,
              position: "bottom center",
              direction: "up-push",
            },
            "error",
            2500
          );
          // Log Status
          const status = "E";
          const statusMsg = "Returned Undefined";
          const filter = JSON.stringify(postData);
          let postLogData = {
            module,
            entryDate,
            entryTime,
            userEmailID,
            userName,
            dbName,
            status,
            statusMsg,
            filter,
          };
          try {
            let response = await axios.post(
              `${BACKEND_URL}/api/Logs/AddTransactionWiseFilterLog`,
              postLogData
            );
            const PRDApplyFilterLogStatus = response.data.status;
            if (PRDApplyFilterLogStatus === "200") {
              console.log("Success....Apply Filter Log Table Status");
            } else {
              console.log("Failed....Apply Filter Log Table Status");
            }
          } catch (error) {
            console.log("Error in Apply Filter Log Table", error);
          }
          // Log Status Completed
        } else if (
          newList == "" ||
          newList.status == "400" ||
          newList.message == "Data not found"
        ) {
          setHeaderList(newList);
          setProgressLoading(false);
          notify(
            {
              message: "Sorry...!!! There is no record found for this Filter.",
              width: 420,
              position: "bottom center",
              direction: "up-push",
            },
            "warning",
            2500
          );
          // Log Status
          const status = "E";
          const statusMsg = "No record found";
          const filter = JSON.stringify(postData);
          let postLogData = {
            module,
            entryDate,
            entryTime,
            userEmailID,
            userName,
            dbName,
            status,
            statusMsg,
            filter,
          };
          try {
            let response = await axios.post(
              `${BACKEND_URL}/api/Logs/AddTransactionWiseFilterLog`,
              postLogData
            );
            const PRDApplyFilterLogStatus = response.data.status;
            if (PRDApplyFilterLogStatus === "200") {
              console.log("Success....Apply Filter Log Table Status");
            } else {
              console.log("Failed....Apply Filter Log Table Status");
            }
          } catch (error) {
            console.log("Error in Apply Filter Log Table", error);
          }
          // Log Status Completed
        } else {
          setHeaderList(newList2); // Dynamic API
          //setHeaderList(staticInitialList1); //Static API
          setProgressLoading(false);
          notify(
            {
              message: "Success!!!....Your ITR's are here",
              width: 310,
              position: "bottom center",
              direction: "up-push",
            },
            "success",
            1000
          );
          handleAPILogStatus();
          // Log Status
          const status = "S";
          const statusMsg = "Success";
          const filter = JSON.stringify(postData);
          let postLogData = {
            module,
            entryDate,
            entryTime,
            userEmailID,
            userName,
            dbName,
            status,
            statusMsg,
            filter,
          };
          try {
            let response = await axios.post(
              `${BACKEND_URL}/api/Logs/AddTransactionWiseFilterLog`,
              postLogData
            );
            const PRDApplyFilterLogStatus = response.data.status;
            if (PRDApplyFilterLogStatus === "200") {
              console.log("Success....Apply Filter Log Table Status");
            } else {
              console.log("Failed....Apply Filter Log Table Status");
            }
          } catch (error) {
            console.log("Error in Apply Filter Log Table", error);
          }
          // Log Status Completed
        }
      } catch (error) {
        console.log("error in Adding ITR to IT", error);
        setProgressLoading(false);
        if (error.response.data.message == "Data not found") {
          setHeaderList("");
          notify(
            {
              message: "Sorry...!!! There is no record found for this Filter.",
              width: 410,
              position: "bottom center",
              direction: "up-push",
            },
            "warning",
            2500
          );
        } else if (error.response.data.status == "400") {
          setHeaderList("");
          notify(
            {
              message: error.response.data.message,
              width: 500,
              position: "bottom center",
              direction: "up-push",
            },
            "error",
            4000
          );
        } else if (error.response.status == "500") {
          setHeaderList("");
          notify(
            {
              message: error.response.data.message,
              width: 500,
              position: "bottom center",
              direction: "up-push",
            },
            "error",
            4000
          );
        } else {
          setHeaderList("");
          notify(
            {
              message: "Sorry...!!! Some Problem in APIs",
              width: 300,
              position: "bottom center",
              direction: "up-push",
            },
            "error",
            4000
          );
        }
        // Log Status
        const status = "E";
        const statusMsg = `${error}`;
        const inputJson = JSON.stringify(postData);
        let postLogData = {
          module,
          entryDate,
          entryTime,
          userEmailID,
          userName,
          dbName,
          status,
          statusMsg,
          inputJson,
        };
        try {
          let response = await axios.post(
            `${BACKEND_URL}/api/Logs/AddTransactionWiseFilterLog`,
            postLogData
          );
          const PRDApplyFilterLogStatus = response.data.status;
          if (PRDApplyFilterLogStatus === "200") {
            console.log("Success....Apply Filter Log Table Status");
          } else {
            console.log("Failed....Apply Filter Log Table Status");
          }
        } catch (error) {
          console.log("Error in Apply Filter Log Table", error);
        }
        // Log Status Completed
      }
    }
  };
  const handleITRFilter1 = async () => {
    if (containsWhitespace(fromDateOne)) {
      var fromDate = formatDate(fromDateOne, "yyyy-MM-dd");
    } else {
      fromDate = fromDateOne.split("/").join("-");
    }
    if (containsWhitespace(toDateTwo)) {
      var toDate = formatDate(toDateTwo, "yyyy-MM-dd");
    } else {
      toDate = toDateTwo.split("/").join("-");
    }
    let fromWhs = whsid1;
    let toWhs = whsid;
    let docNum = docNumOne;
    let series = seriesid;
    //Grooming the API
    if (fromDate === "" || fromDate === undefined || fromDate === null) {
      fromDate = "string";
    }
    if (toDate === "" || toDate === undefined || toDate === null) {
      toDate = "string";
    }
    if (fromWhs === "" || fromWhs === undefined || fromWhs === null) {
      fromWhs = "";
    }
    if (toWhs === "" || toWhs === undefined || toWhs === null) {
      toWhs = "";
    }
    if (series === "" || series === undefined || series === null) {
      series = 0;
    }
    if (docNum === "" || docNum === null || docNum === undefined) {
      docNum = 0;
    }
    //Grooming the API
    const postData = {
      fromDate,
      toDate,
      fromWhs,
      toWhs,
      series,
      docNum,
    };
    try {
      let response = await axios.post(`${BACKEND_URL}/api/ITRs`, postData);
      const newData = response.data;
      let newList = newData;
      const newList2 = newList.map((element) => {
        const docDate = element.docDate.split(" ")[0];

        const itrDet = element.itrDet.map((element) => {
          const qtyInStock = element.qtyInStock.split(".")[0];
          return { ...element, qtyInStock };
        });
        return { ...element, docDate, itrDet };
      });
      if (newList === "") {
        setHeaderList(newList);
      } else if (newList === undefined) {
        setHeaderList(newList);
      } else {
        setHeaderList(newList2);
      }
    } catch (error) {
      console.log("Error in ITR", error);
    }
  };
  const addIT = async (e) => {
    e.preventDefault();
    setIsActiveOverLay(true);
    //
    const ApplyFilterDate = formatDate(getCurrentDateandTime, "yyyy-MM-dd");
    const entryDate = ApplyFilterDate;
    const ApplyFilterTime = formatDate(getCurrentDateandTime, "HH:mm");
    const entryTime =
      ApplyFilterTime[0] +
      ApplyFilterTime[1] +
      ApplyFilterTime[3] +
      ApplyFilterTime[4];
    const dbName = "WEL032023";
    //
    if (
      docDate1 === "" ||
      dueDate1 === "" ||
      docDate1 === undefined ||
      dueDate1 === undefined
    ) {
      setIsActiveOverLay(false);
      notify(
        {
          message: "Please enter From Doc Date & To Doc Date....",
          width: 400,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1200
      );
    } else {
      if (containsWhitespace(docDate1)) {
        var docDate = formatDate(docDate1, "yyyy-MM-dd");
      } else {
        docDate = docDate1.split("/").join("-");
      }
      if (containsWhitespace(dueDate1)) {
        var dueDate = formatDate(dueDate1, "yyyy-MM-dd");
      } else {
        dueDate = dueDate1.split("/").join("-");
      }
      let itrDocEntry = docEntry1;
      let fromWhsCode = fromWhs1;
      let toWhsCode = toWhs1;
      let comments = comments1;
      let postData1 = {
        itrDocEntry,
        docDate,
        dueDate,
        fromWhsCode,
        toWhsCode,
        comments,
        itLines: itLinesArray1,
      };
      try {
        let response = await axios.post(
          `${BACKEND_URL}/api/ITs/AddIT`,
          postData1
        );
        const AddITRStatus = response.data.status;
        const AddITRMessage = response.data.message;
        if (AddITRStatus == "200") {
          setIsActiveOverLay(false);
          handleAPILogStatus1();
          notify(
            {
              message: `Your ITR with Doc Num ${docNum1} is Added Successfully.`,
              width: 470,
              shading: true,
              position: "bottom center",
              direction: "up-push",
            },
            "success",
            3500
          );
          setDocDate1("");
          setDueDate1("");
          setComments1("");
          setHeaderList("");
          handleITRFilter1();
          //
          const status = "S";
          const resCode = "200";
          const resMsg = "Inserted Successfully";
          const inputJson = JSON.stringify(postData1);
          let docEntry = docEntry1;
          let postLogData = {
            module,
            entryDate,
            entryTime,
            userEmailID,
            userName,
            inputJson,
            status,
            resCode,
            resMsg,
            docEntry,
            dbName,
          };
          try {
            let response = await axios.post(
              `${BACKEND_URL}/api/Logs/AddTransactionLog`,
              postLogData
            );
            const LogStatus = response.data.status;
            if (LogStatus === "200") {
              console.log("Success....Add ITR Log Table Status");
            } else {
              console.log("Failed....Add ITR Log Table Status");
            }
          } catch (error) {
            console.log("Error in Add ITR Log Table", error);
          }
          //
        } else {
          //console.log("Inside Exact else")
          setIsActiveOverLay(false);
          notify(
            {
              message: AddITRMessage,
              width: 500,
              shading: true,
              position: "bottom center",
              direction: "up-push",
            },
            "error",
            5000
          );
          setDocDate1("");
          setDueDate1("");
          setComments1("");
          handleITRFilter1();
          //
          const status = "E";
          const resCode = "400";
          const resMsg = `${AddITRMessage}`;
          let docEntry = docEntry1;
          const inputJson = JSON.stringify(postData1);
          let postLogData = {
            module,
            entryDate,
            entryTime,
            userEmailID,
            userName,
            inputJson,
            status,
            resCode,
            resMsg,
            docEntry,
            dbName,
          };
          try {
            let response = await axios.post(
              `${BACKEND_URL}/api/Logs/AddTransactionLog`,
              postLogData
            );
            //console.log('first', response)
            const LogStatus = response.data.status;
            if (LogStatus === "200") {
              console.log("Success....Add ITR Log Table Status");
            } else {
              console.log("Failed....Add ITR Log Table Status");
            }
          } catch (error) {
            console.log("Error in Add ITR Log Table", error);
          }
          //
        }
      } catch (error) {
        setIsActiveOverLay(false);
        console.log("Error in Add ITR", error);
        if (error.response.data.status == "400") {
          notify(
            {
              message: error.response.data.message,
              width: 500,
              position: "bottom center",
              direction: "up-push",
            },
            "error",
            5000
          );
        } else if (error.response.status == "404") {
          notify(
            {
              message: "Sorry...!!! Some Problem in APIs",
              width: 300,
              position: "bottom center",
              direction: "up-push",
            },
            "error",
            5000
          );
          setDocDate1("");
          setDueDate1("");
          setComments1("");
        } else if (error.response.data == "") {
          notify(
            {
              message: "Sorry...!!! Some Problem in APIs",
              width: 300,
              position: "bottom center",
              direction: "up-push",
            },
            "error",
            5000
          );
          setDocDate1("");
          setDueDate1("");
          setComments1("");
        } else {
          notify(
            {
              message:
                "Sorry...!!! Some Problem in APIs. Please try again later.",
              width: 500,
              position: "bottom center",
              direction: "up-push",
            },
            "error",
            5000
          );
          setDocDate1("");
          setDueDate1("");
          setComments1("");
        }

        const status = "E";
        const resCode = "500";
        const resMsg = `${error}`;
        let docEntry = docEntry1;
        const inputJson = JSON.stringify(postData1);
        let postLogData = {
          module,
          entryDate,
          entryTime,
          userEmailID,
          userName,
          inputJson,
          status,
          resCode,
          resMsg,
          docEntry,
          dbName,
        };
        try {
          let response = await axios.post(
            `${BACKEND_URL}/api/Logs/AddTransactionLog`,
            postLogData
          );
          const LogStatus = response.data.status;
          if (LogStatus === "200") {
            console.log("Success....Add ITR Log Table Status");
          } else {
            console.log("Failed....Add ITR Log Table Status");
          }
        } catch (error) {
          console.log("Error in Add ITR Log Table", error);
        }
      }
    }
  };
  //Master Data Detail Coding Starts
  const state = {
    checkBoxesMode: "always",
  };
  const validateForm = React.useCallback((e) => {
    e.component.validate();
  }, []);
  const min1 = new Date(fromDateOne);
  const precisionFormatMaster = {
    type: "fixedPoint",
    precision: 2,
  };
  //From Warehouse API Grid Opened master Detail
  const dataGridOnSelectionChanged3 = (e) => {
    setGridBoxValue3(e.selectedRowKeys);
    setWhsid2(e.selectedRowsData[0].whsCode);
    setIsGridBoxOpened3(false);
  };
  const syncDataGridSelection3 = (e) => {
    setGridBoxValue3(e.value);
  };
  function gridBoxDisplayExpr3(item) {
    return item && `${item.whsCode} -- ${item.whsName}`;
  }
  const onGridBoxOpened3 = (e) => {
    if (e.name === "opened") {
      setIsGridBoxOpened3(e.value);
    }
    if (e.name === "isActive") {
      setWhsid2("");
    }
  };
  //Popup Item Detail View
  const dataGridOnSelectionChanged4 = (e) => {
    setGridBoxValue4(e.selectedRowKeys);
    setPopupItemCode(e.selectedRowsData[0].itemCode);
    setIsGridBoxOpened4(false);
  };
  const syncDataGridSelection4 = (e) => {
    setGridBoxValue4(e.value);
  };
  function gridBoxDisplayExpr4(item) {
    return item && `${item.itemCode} -- ${item.itemName}`;
  }
  const onGridBoxOpened4 = (e) => {
    if (e.name === "opened") {
      setIsGridBoxOpened4(e.value);
    }
    if (e.name === "isActive") {
      setPopupItemCode("");
      setPopupResult("");
    }
  };
  //
  function gridBoxDisplayExpr18(item) {
    return item && `${item.whsCode}`;
  }
  const handleMasterRefresh2 = async () => {
    setIsActiveOverLay(true);
    if (containsWhitespace(fromDateOne)) {
      var fromDate = formatDate(fromDateOne, "yyyy-MM-dd");
    } else {
      fromDate = fromDateOne.split("/").join("-");
    }
    if (containsWhitespace(toDateTwo)) {
      var toDate = formatDate(toDateTwo, "yyyy-MM-dd");
    } else {
      toDate = toDateTwo.split("/").join("-");
    }
    let fromWhs = whsid1;
    let toWhs = whsid;
    let docNum = docNumOne;
    let series = seriesid;
    //Grooming the API
    if (fromDate === "" || fromDate === undefined || fromDate === null) {
      fromDate = "string";
    }
    if (toDate === "" || toDate === undefined || toDate === null) {
      toDate = "string";
    }
    if (fromWhs === "" || fromWhs === undefined || fromWhs === null) {
      fromWhs = "";
    }
    if (toWhs === "" || toWhs === undefined || toWhs === null) {
      toWhs = "";
    }
    if (series === "" || series === undefined || series === null) {
      series = 0;
    }
    if (docNum === "" || docNum === null || docNum === undefined) {
      docNum = 0;
    }
    //Grooming the API
    const postData = {
      fromDate,
      toDate,
      fromWhs,
      toWhs,
      series,
      docNum,
    };
    try {
      let response = await axios.post(`${BACKEND_URL}/api/ITRs`, postData);
      const newData = response.data;
      let newList = newData;
      const newList3 = newList.filter((element, index) => {
        if (changeInDocEntry === element.docEntry) {
          var updatedHeaderListArray1 = [];
          const docDate = element.docDate.split(" ")[0];
          var itrDet = element.itrDet;
          //console.log("1234", itrDet);
          itrDet = "";
          itrDet = masterList;
          updatedHeaderListArray1.push({
            ...element,
            docDate,
            itrDet,
          });
          newList.splice(index, 1, updatedHeaderListArray1[0]);
          setHeaderList(newList);
          //setIsActiveOverLay(false);
        }
      });
    } catch (error) {
      console.log("Error in ITR", error);
    }
  };
  const handleMasterRefresh3 = async () => {
    setIsActiveOverLay(true);
    if (containsWhitespace(fromDateOne)) {
      var fromDate = formatDate(fromDateOne, "yyyy-MM-dd");
    } else {
      fromDate = fromDateOne.split("/").join("-");
    }
    if (containsWhitespace(toDateTwo)) {
      var toDate = formatDate(toDateTwo, "yyyy-MM-dd");
    } else {
      toDate = toDateTwo.split("/").join("-");
    }
    let fromWhs = whsid1;
    let toWhs = whsid;
    let docNum = docNumOne;
    let series = seriesid;
    //Grooming the API
    if (fromDate === "" || fromDate === undefined || fromDate === null) {
      fromDate = "string";
    }
    if (toDate === "" || toDate === undefined || toDate === null) {
      toDate = "string";
    }
    if (fromWhs === "" || fromWhs === undefined || fromWhs === null) {
      fromWhs = "";
    }
    if (toWhs === "" || toWhs === undefined || toWhs === null) {
      toWhs = "";
    }
    if (series === "" || series === undefined || series === null) {
      series = 0;
    }
    if (docNum === "" || docNum === null || docNum === undefined) {
      docNum = 0;
    }
    //Grooming the API
    const postData = {
      fromDate,
      toDate,
      fromWhs,
      toWhs,
      series,
      docNum,
    };
    try {
      let response = await axios.post(`${BACKEND_URL}/api/ITRs`, postData);
      const newData = response.data;
      let newList = newData;
      const newList3 = newList.filter((element, index) => {
        if (docEntry1 === element.docEntry) {
          if (masterList.length <= element.itrDet.length) {
            var updatedHeaderListArray1 = [];
            const docDate = element.docDate.split(" ")[0];
            var itrDet = element.itrDet;
            console.log("masterList in outside", masterList);
            itrDet = "";
            itrDet = masterList;
            updatedHeaderListArray1.push({
              ...element,
              docDate,
              itrDet,
            });
            newList.splice(index, 1, updatedHeaderListArray1[0]);
            setHeaderList(newList);
            setIsActiveOverLay(false);
          }
        }
      });
    } catch (error) {
      console.log("Error in ITR", error);
    }
  };
  //
  useLayoutEffect(() => {
    const handleRefresh = async () => {
      var newMasterListInLayoutEffect = bufferMasterList;
      try {
        let response = await axios.get(
          `${BACKEND_URL}/api/Items/ItemDet/${changeInItemCode}/${changeInWhs}`
        );

        newMasterListInLayoutEffect.filter((element, index) => {
          if (changeInLineNum === element.id) {
            var updatedMasterListArray = [];
            var availableStock = response.data[0].availableStock;
            var qtyInStock = response.data[0].qtyInStock;
            var id = changeInLineNum;
            var lineNum = changeInLineNum;
            updatedMasterListArray.push({
              ...element,
              id,
              lineNum,
              availableStock,
              qtyInStock,
            });
            newMasterListInLayoutEffect.splice(
              index,
              1,
              updatedMasterListArray[0]
            );
            setMasterList(newMasterListInLayoutEffect);
            setNewMasterListAfterLayout(newMasterListInLayoutEffect);
            handleMasterRefresh2();
            // console.log("masterList", masterList);
            newMasterListInLayoutEffect = "";
            setIsActiveOverLay(false);
          }
        });
      } catch (error) {
        console.log("error", error);
      }
    };
    handleRefresh();
  }, [changeInWhs, changeInItemCode, changeInLineNum]);
  // Secondary Tab
  useLayoutEffect(() => {
    const handleRefresh2 = async () => {
      //setIsActiveOverLay(true);
      let whsAPILength = whsAPIList1.length;
      var updatedMasterListWhsArray3 = [];
      whsAPIList1.map(async (element, index) => {
        try {
          let itemCodeWhs = secondaryTabItemCode;
          let response = await axios.get(
            `${BACKEND_URL}/api/Items/ItemDet/${itemCodeWhs}/${element.whsCode}`
          );
          let locationId = await response.data[0].qtyInStock;
          let id = element.id;
          updatedMasterListWhsArray3.push({
            ...element,
            id,
            locationId,
          });
          setTimeout(() => {
            if (whsAPIList1.length === updatedMasterListWhsArray3.length) {
              //console.log("object", updatedMasterListWhsArray3);
              setwhsAPIList2(updatedMasterListWhsArray3);
              // setIsActiveOverLay(false);
            }
          }, 9000);
        } catch (error) {
          console.log("error", error);
        }
      });
    };
    handleRefresh2();
  }, [secondaryTabItemCode]);
  //
  function PrimaryTab(props) {
    const itLines1 = props.data.itrDet;
    setItLinesArray1(itLines1);
    setDocNum1(props.data.docNum);
    //
    setHandleDocNum(props.data.docNum);
    setHandleMasterDetail(props.data.itrDet);
    //
    setDocEntry1(props.data.docEntry);
    setFromWhs1(props.data.fromWhs);
    setToWhs1(props.data.toWhs);
    setMasterList(props.data.itrDet);
    setBufferMasterList(props.data.itrDet);
    setPopupMasterList(props.data.itrDet);
    setRefilteredPopupMasterList(props.data.itrDet);
    const min = new Date(docDate1);
    const max = new Date(new Date());
    const selectionFilter = ["uomStatic", "=", null];
    const { checkBoxesMode } = state;
    //useState
    const handleUseState = async () => {
      var updatedMasterListWhsArray4 = [];
      handleMasterDetail.map(async (element, index) => {
        const handleItemCode = element.itemCode;
        whsAPIList1.map(async (element, index) => {
          try {
            let response = await axios.get(
              `${BACKEND_URL}/api/Items/ItemDet/${handleItemCode}/${element.whsCode}`
            );
            let locationId = await response.data[0].qtyInStock;
            let id = element.id;
            let whsCode = element.whsCode;
            if (locationId != 0.0 && locationId !== null) {
              // updatedMasterListWhsArray4.push({
              //   ...element,
              //   id,
              //   whsCode,
              //   locationId,
              // });
              console.log(
                "updatedMasterListWhsArray4",
                updatedMasterListWhsArray4
              );
            }
          } catch (error) {
            console.log("error", error);
          }
        });
      });
      // whsAPIList1.map(async (element, index) => {
      //   try {
      //     let itemCodeWhs = popupItemCode;
      //     let response = await axios.get(
      //       `${BACKEND_URL}/api/Items/ItemDet/${itemCodeWhs}/${element.whsCode}`
      //     );
      //     let locationId = await response.data[0].qtyInStock;
      //     let id = element.id;
      //     let whsCode = element.whsCode;
      //     if (locationId != 0.0 && locationId !== null) {
      //       updatedMasterListWhsArray4.push({
      //         ...element,
      //         id,
      //         whsCode,
      //         locationId,
      //       });

      //       setMasterListPopupResult(headerList);
      //       setPopupResult(updatedMasterListWhsArray4);
      //       setwhsAPIList2(updatedMasterListWhsArray4);
      //       setLoadIndicatorVisible(false);
      //     } else {
      //     }
      //   } catch (error) {
      //     console.log("error", error);
      //   }
      // });
    };
    //handleUseState();
    //Select Master Data
    const handleContinue18 = async () => {
      console.log("refilteredPopupMasterList", refilteredPopupMasterList);
      setChangeInDocEntry1(props.data.docEntry);
      // props.data.itrDet = refilteredPopupMasterList;
      // props.data.itrDet = refilteredPopupMasterList;
      //masterList = refilteredPopupMasterList;
      setMasterList(refilteredPopupMasterList);
      console.log("props.data.itrDet", props.data.itrDet);
      handleMasterRefresh3();
      hide1();
    };
    //Update from Whs
    const handleRefresh2 = async () => {
      setIsActiveOverLay(true);
      var newMasterListInLayoutEffect3 = bufferMasterList;
      let actualMasterDataLength = newMasterListInLayoutEffect3.length;
      var updatedMasterListArray3 = [];
      if (whsid2 === "") {
        setIsActiveOverLay(false);
        notify(
          {
            message: "Please Enter From Whs....",
            width: 280,
            position: "bottom center",
            direction: "up-push",
          },
          "error",
          500
        );
      } else {
        newMasterListInLayoutEffect3.map(async (element, index) => {
          try {
            let fromWhs = whsid2;
            let response = await axios.get(
              `${BACKEND_URL}/api/Items/ItemDet/${element.itemCode}/${whsid2}`
            );
            let availableStock = await response.data[0].availableStock;
            let qtyInStock = await response.data[0].qtyInStock.split(".")[0];
            let id = element.id;
            let lineNum = element.lineNum;
            updatedMasterListArray3.push({
              ...element,
              id,
              lineNum,
              fromWhs,
              qtyInStock,
              availableStock,
            });
            if (actualMasterDataLength <= 15) {
              setTimeout(() => {
                if (
                  newMasterListInLayoutEffect3.length ===
                  updatedMasterListArray3.length
                ) {
                  updatedMasterListArray3.sort(function (x, y) {
                    return x.id - y.id;
                  });
                  setUpdatedMasterListAsPerWhs(updatedMasterListArray3);
                  setMasterList(updatedMasterListArray3);
                  props.data.itrDet = updatedMasterListArray3;
                  setIsActiveOverLay(false);
                }
              }, 3000);
            } else if (actualMasterDataLength <= 30) {
              setTimeout(() => {
                if (
                  newMasterListInLayoutEffect3.length ===
                  updatedMasterListArray3.length
                ) {
                  updatedMasterListArray3.sort(function (x, y) {
                    return x.id - y.id;
                  });
                  setUpdatedMasterListAsPerWhs(updatedMasterListArray3);
                  setMasterList(updatedMasterListArray3);
                  props.data.itrDet = updatedMasterListArray3;
                  setIsActiveOverLay(false);
                }
              }, 4500);
            } else if (actualMasterDataLength <= 55) {
              setTimeout(() => {
                if (
                  newMasterListInLayoutEffect3.length ===
                  updatedMasterListArray3.length
                ) {
                  updatedMasterListArray3.sort(function (x, y) {
                    return x.id - y.id;
                  });
                  setUpdatedMasterListAsPerWhs(updatedMasterListArray3);
                  setMasterList(updatedMasterListArray3);
                  props.data.itrDet = updatedMasterListArray3;
                  setIsActiveOverLay(false);
                }
              }, 5500);
            } else {
              setTimeout(() => {
                if (
                  newMasterListInLayoutEffect3.length ===
                  updatedMasterListArray3.length
                ) {
                  updatedMasterListArray3.sort(function (x, y) {
                    return x.id - y.id;
                  });
                  setUpdatedMasterListAsPerWhs(updatedMasterListArray3);
                  setMasterList(updatedMasterListArray3);
                  props.data.itrDet = updatedMasterListArray3;
                  setIsActiveOverLay(false);
                }
              }, 8000);
            }
          } catch (error) {
            console.log("error", error);
            notify(
              {
                message: "Server Error!!! Please Try Again Later.",
                width: 500,
                position: "bottom center",
                direction: "up-push",
              },
              "error",
              5000
            );
          }
        });
      }
    };
    //Item wise Whs Details
    const handleContinue5 = async () => {
      setLoadIndicatorVisible(true);
      var updatedMasterListWhsArray3 = [];
      whsAPIList1.map(async (element, index) => {
        try {
          let itemCodeWhs = popupItemCode;
          let response = await axios.get(
            `${BACKEND_URL}/api/Items/ItemDet/${itemCodeWhs}/${element.whsCode}`
          );
          let locationId = await response.data[0].qtyInStock;
          let id = element.id;
          let whsCode = element.whsCode;
          console.log("object", locationId);
          if (locationId != 0.0 && locationId !== null) {
            updatedMasterListWhsArray3.push({
              ...element,
              id,
              whsCode,
              locationId,
            });
            //console.log("12", updatedMasterListWhsArray3);
            setTimeout(() => {
              // updatedMasterListWhsArray3.sort(function (x, y) {
              //   return x.whsCode - y.whsCode;
              // });
              setMasterListPopupResult(headerList);
              setPopupResult(updatedMasterListWhsArray3);
              setwhsAPIList2(updatedMasterListWhsArray3);
              setLoadIndicatorVisible(false);
            }, 7000);
            if (updatedMasterListWhsArray3 === "") {
              setLoadIndicatorVisible(false);
              notify(
                {
                  message: "Sorry...!!! No Stock found.",
                  width: 310,
                  position: "bottom center",
                  direction: "up-push",
                },
                "error",
                1000
              );
            }
          } else {
            setTimeout(() => {
              if (updatedMasterListWhsArray3 === "") {
                setLoadIndicatorVisible(false);
                notify(
                  {
                    message: "Sorry...!!! No Stock found.",
                    width: 310,
                    position: "bottom center",
                    direction: "up-push",
                  },
                  "error",
                  1000
                );
              }
            }, 15000);
          }
        } catch (error) {
          console.log("error", error);
        }
      });
    };
    //DataGrid Display
    return (
      <React.Fragment>
        <Card>
          <SoftBox ml={2} mr={2} mb={0} mt={1}>
            <SoftTypography
              mb={2}
              mt={4}
              style={{
                color: "#0B2F8A",
                fontWeight: "700",
                fontSize: "21px",
                lineHeight: "10px",
                letterSpacing: 1,
              }}
            >
              ITR Num #{`${props.data.docNum}`}
            </SoftTypography>
            <ValidationGroup>
              <Form colCount={2} formData={props.data}>
                <GroupItem>
                  <TextBox
                    label="Document Number"
                    labelMode="static"
                    readOnly={true}
                    defaultValue={props.data.docNum}
                  ></TextBox>
                  <TextBox
                    label="Doc Date"
                    readOnly={true}
                    labelMode="static"
                    defaultValue={props.data.docDate}
                  ></TextBox>
                  <TextBox
                    label="Card Code"
                    labelMode="static"
                    readOnly={true}
                    defaultValue={props.data.cardCode}
                  ></TextBox>
                  <TextBox
                    label="Card Name"
                    labelMode="static"
                    readOnly={true}
                    defaultValue={props.data.cardName}
                  ></TextBox>
                </GroupItem>
                <GroupItem>
                  <TextBox
                    label="To Warehouse"
                    labelMode="static"
                    readOnly={true}
                    defaultValue={props.data.toWhs}
                  ></TextBox>
                  <DropDownBox
                    label="Update From Warehouse (Optional)"
                    labelMode="floating"
                    dataSource={whsAPIList}
                    opened={isGridBoxOpened3}
                    wordWrapEnabled={true}
                    selectByClick={true}
                    valueExpr="whsCode"
                    displayExpr={gridBoxDisplayExpr3}
                    value={whsid2}
                    showSelectionControls={true}
                    applyValueMode="useButtons"
                    onValueChanged={syncDataGridSelection3}
                    onOptionChanged={onGridBoxOpened3}
                  >
                    <DataGrid
                      dataSource={whsAPIList}
                      columns={gridColumnsWhs}
                      value={whsid2}
                      hoverStateEnabled={true}
                      height="100%"
                      selectedRowKeys={whsid2}
                      onSelectionChanged={dataGridOnSelectionChanged3}
                    >
                      <Selection mode="single" />
                      <Scrolling columnRenderingMode="virtual"></Scrolling>
                      <Paging defaultPageSize={5} />
                      <FilterRow visible={true} />
                    </DataGrid>
                    <Validator>
                      <RequiredRule message="Required" />
                    </Validator>
                  </DropDownBox>
                  <DateBox
                    label="Doc Date"
                    labelMode="floating"
                    displayFormat="dd/MM/yyyy"
                    showClearButton={true}
                    value={docDate1}
                    valueChangeEvent="change"
                    max={max}
                    onValueChanged={(e) => {
                      setDocDate1(e.value);
                      setDueDate1(e.value);
                    }}
                  >
                    <Validator>
                      <RequiredRule message="Required" />
                    </Validator>
                  </DateBox>
                  <DateBox
                    label="Due Date"
                    labelMode="floating"
                    displayFormat="dd/MM/yyyy"
                    showClearButton={true}
                    value={dueDate1}
                    valueChangeEvent="change"
                    min={min}
                    onValueChanged={(e) => {
                      setDueDate1(e.value);
                    }}
                  >
                    <Validator>
                      <RequiredRule message="Required" />
                    </Validator>
                  </DateBox>
                </GroupItem>
                <GroupItem colSpan={2}>
                  <TextArea
                    label="Comments"
                    labelMode="floating"
                    value={comments1}
                    valueChangeEvent="change"
                    onValueChanged={(e) => {
                      setComments1(e.value);
                    }}
                    height={70}
                    editorType="dxTextArea"
                  >
                    <Validator>
                      <RequiredRule message="Required" />
                    </Validator>
                  </TextArea>
                </GroupItem>
              </Form>
            </ValidationGroup>
            <br />
          </SoftBox>
          <Card>
            <SoftBox ml={1} mr={1} mb={5} mt={0}>
              <div>
                <DataGrid
                  // dataSource={props.data.itrDet}
                  dataSource={masterList}
                  keyExpr="id"
                  showBorders={true}
                  allowColumnResizing={true}
                  wordWrapEnabled={true}
                  columnAutoWidth={true}
                  onRowUpdated={(e) => {
                    setChangeInWhs(e.data.fromWhs);
                    setChangeInItemCode(e.data.itemCode);
                    setChangeInLineNum(e.key);
                    setChangeInDocEntry(e.data.docEntry);
                    // handleRefresh();
                  }}
                  onEditingStart={(e) => {
                    //console.log("e.data.itemCode", e.data.itemCode);
                    setSecondaryTabItemCode(e.data.itemCode);
                  }}
                  defaultSelectionFilter={selectionFilter}
                >
                  <Pager visible={true} showInfo={true} allowedPageSizes={5} />
                  <Paging enabled={true} defaultPageSize={5} />
                  <Selection
                    mode="multiple"
                    deferred={true}
                    showCheckBoxesMode={checkBoxesMode}
                  />
                  <Toolbar>
                    {/* Update From Warehouse  */}
                    <Item name="Update From Whs" showText="always" />
                    <Item location="after">
                      <Button
                        onClick={handleRefresh2}
                        icon="refresh"
                        text="Update From Whs"
                      />
                    </Item>
                    {/* Item Wise Whs Details  */}
                    <Item name="Item Wise Whs Details" showText="always" />
                    <Item location="before">
                      <Button
                        onClick={showPopup}
                        icon="find"
                        text="Itemwise Whs Details"
                      />
                    </Item>
                    {/* Select Master Data */}
                    <Item name="Select Master Data" showText="always" />
                    <Item location="left">
                      <Button
                        onClick={showPopup1}
                        icon="home"
                        text="Select Master Data"
                      />
                    </Item>
                  </Toolbar>
                  <FilterRow visible={true} />
                  <HeaderFilter visible={true} allowSearch={true} />
                  <Scrolling columnRenderingMode="virtual"></Scrolling>
                  <Sorting mode="multiple" />
                  <Editing
                    mode="row"
                    //mode="popup"

                    useIcons={true}
                    allowUpdating={true}
                    allowDeleting={true}
                    allowEditing={true}
                  >
                    <Popup
                      title="Master Data Detail"
                      showTitle={true}
                      width={700}
                      height={400}
                    />
                    <Form>
                      <Item itemType="group" colCount={2} colSpan={2}>
                        <Item dataField="itemCode" />
                        <Item dataField="itemName" />
                        <Item dataField="fromWhs" />
                        <Item dataField="qtyInStock" />
                        <Item dataField="availableStock" />
                        <Item dataField="qty" />
                        <Item dataField="toWhs" />
                        <Item dataField="uoM" />
                        <Item dataField="uomName" />
                      </Item>
                    </Form>
                  </Editing>
                  <Column type="buttons" caption="Actions" width={90}>
                    <Button name="edit" />
                    <Button name="delete" />
                    <Button name="refresh" />
                  </Column>
                  <Column
                    dataField="itemCode"
                    caption="Item Code"
                    alignment="center"
                    allowEditing={false}
                  />
                  <Column
                    dataField="itemName"
                    caption="Item Name"
                    alignment="center"
                    allowEditing={false}
                  />
                  <Column
                    dataField="fromWhs"
                    caption="From Whs"
                    alignment="center"
                  >
                    <Lookup
                      dataSource={whsAPIList}
                      valueExpr="whsCode"
                      displayExpr={gridBoxDisplayExpr18}
                      //onOptionChanged={onGridBoxOpened18}
                    />
                    <RequiredRule message="Required" />
                  </Column>
                  <Column
                    dataField="qtyInStock"
                    caption="Qty in Whs"
                    allowEditing={false}
                    alignment="center"
                    dataType="number"
                    format={precisionFormatMaster}
                  ></Column>
                  <Column
                    dataField="availableStock"
                    caption="In Stock"
                    allowEditing={false}
                    alignment="center"
                    dataType="number"
                    format={precisionFormatMaster}
                  ></Column>
                  <Column
                    dataField="qty"
                    caption="Quantity"
                    dataType="number"
                    alignment="center"
                    format={precisionFormatMaster}
                  >
                    <RequiredRule message="Required" />
                  </Column>
                  <Column
                    dataField="toWhs"
                    caption="To Warehouse"
                    alignment="center"
                    allowEditing={false}
                  />
                  <Column
                    dataField="uoM"
                    caption="UOM Code"
                    alignment="center"
                    allowEditing={false}
                    visible={false}
                  />
                  <Column
                    dataField="uomName"
                    caption="UOM Name"
                    allowEditing={false}
                    alignment="center"
                  />

                  <Column
                    dataField={uomStatic}
                    caption="UOM Static"
                    allowEditing={false}
                    alignment="center"
                    visible={false}
                  ></Column>
                </DataGrid>
              </div>
              <SoftBox style={{ display: "flex" }} mt={4}>
                <SoftButton
                  onClick={addIT}
                  variant="contained"
                  color="info"
                  style={{
                    backgroundColor: "#0B2F8A",
                    boxShadow: " 0px 8px 24px -2px rgba(11, 47, 138, 0.6)",
                    marginLeft: "20px",
                  }}
                >
                  Add IT
                </SoftButton>
                <SoftButton
                  onClick={handleCancel}
                  variant="contained"
                  color="info"
                  style={{
                    backgroundColor: "#0B2F8A",
                    boxShadow: " 0px 8px 24px -2px rgba(11, 47, 138, 0.6)",
                    marginLeft: "30px",
                  }}
                >
                  Cancel
                </SoftButton>
                <div>
                  <Popup
                    width={400}
                    height={550}
                    visible={popupVisible}
                    onHiding={hide}
                    hideOnOutsideClick={true}
                    showCloseButton={true}
                    title="Item wise Warehouse Details"
                  >
                    <ScrollView width="100%" height="100%">
                      {/* DropDownBox  */}
                      <SoftBox textAlign="center" mt={1} mb={3} ml={1} mr={1}>
                        <DropDownBox
                          label="Select Item Code -- Item Name"
                          labelMode="floating"
                          // dataSource={popupMasterList}
                          dataSource={masterList}
                          opened={isGridBoxOpened4}
                          wordWrapEnabled={true}
                          selectByClick={true}
                          valueExpr="itemCode"
                          displayExpr={gridBoxDisplayExpr4}
                          value={popupItemCode}
                          showSelectionControls={true}
                          applyValueMode="useButtons"
                          onValueChanged={syncDataGridSelection4}
                          onOptionChanged={onGridBoxOpened4}
                        >
                          <DataGrid
                            //dataSource={popupMasterList}
                            dataSource={masterList}
                            columns={gridPopupItemCode}
                            value={popupItemCode}
                            hoverStateEnabled={true}
                            height="100%"
                            selectedRowKeys={popupItemCode}
                            onSelectionChanged={dataGridOnSelectionChanged4}
                          >
                            <Selection mode="single" />
                            <Scrolling columnRenderingMode="virtual"></Scrolling>
                            <Paging defaultPageSize={3} />
                            <FilterRow visible={true} />
                          </DataGrid>
                          <Validator>
                            <RequiredRule message="Required" />
                          </Validator>
                        </DropDownBox>
                      </SoftBox>
                      {/* Button  */}
                      <SoftBox textAlign="center" mt={3} mb={3} ml={1} mr={1}>
                        <Button
                          text="Show Warehouse Details"
                          type="default"
                          onClick={handleContinue5}
                        />
                      </SoftBox>
                      {/* LoadIndicator  */}
                      <SoftBox textAlign="center" mt={3} mb={3} ml={1} mr={1}>
                        <LoadIndicator
                          height={40}
                          width={40}
                          enabled={true}
                          visible={loadIndicatorVisible}
                        />
                      </SoftBox>
                      {/*DataGrid  */}
                      <div>
                        <SoftBox textAlign="center" mt={3} mb={3} ml={1} mr={1}>
                          <DataGrid
                            dataSource={popupResult}
                            keyExpr="id"
                            showBorders={true}
                            allowColumnResizing={true}
                            columnAutoWidth={true}
                            defaultSelectionFilter={selectionFilter}
                          >
                            <Scrolling columnRenderingMode="virtual"></Scrolling>
                            <FilterRow visible={true} />
                            <HeaderFilter visible={true} allowSearch={true} />
                            <Sorting mode="multiple" />
                            <Column
                              dataField="whsCode"
                              caption="Warehouse"
                              alignment="center"
                              //visible={false}
                            />
                            <Column
                              dataField="locationId"
                              caption="Qty in Stock"
                              alignment="center"
                              //visible={false}
                            />
                          </DataGrid>
                        </SoftBox>
                      </div>
                    </ScrollView>
                  </Popup>
                </div>
                <div>
                  <Popup
                    width={530}
                    height={600}
                    visible={popupVisible1}
                    onHiding={hide1}
                    hideOnOutsideClick={true}
                    showCloseButton={true}
                    title="Select Master Data"
                  >
                    <ScrollView width="100%" height="100%">
                      {/*DataGrid  */}
                      <DataGrid
                        //dataSource={refilteredPopupMasterList}
                        dataSource={masterList}
                        keyExpr="id"
                        showBorders={true}
                        allowColumnResizing={true}
                        wordWrapEnabled={true}
                        columnAutoWidth={true}
                        defaultSelectionFilter={selectionFilter}
                      >
                        <Pager
                          visible={true}
                          showInfo={true}
                          allowedPageSizes={4}
                        />
                        <Paging enabled={true} defaultPageSize={4} />
                        <FilterRow visible={true} />
                        <HeaderFilter visible={true} allowSearch={true} />
                        <Scrolling columnRenderingMode="virtual"></Scrolling>
                        <Sorting mode="multiple" />
                        <Editing
                          mode="batch"
                          //mode="popup"
                          useIcons={true}
                          // allowUpdating={true}
                          allowDeleting={true}
                          //allowEditing={true}
                        />
                        <Column type="buttons" width={60}>
                          <Button name="delete" />
                        </Column>
                        <Column
                          dataField="itemCode"
                          caption="Item Code"
                          alignment="center"
                          allowEditing={false}
                        />
                        <Column
                          dataField="itemName"
                          caption="Item Name"
                          alignment="center"
                          allowEditing={false}
                        />
                        <Column
                          dataField="fromWhs"
                          caption="From Whs"
                          alignment="center"
                          allowEditing={false}
                        />
                        <Column
                          dataField="qtyInStock"
                          caption="Qty In Whs"
                          alignment="center"
                          allowEditing={false}
                        />
                      </DataGrid>
                      {/*Button  */}
                      <SoftBox textAlign="center" mt={0} mb={1} ml={1} mr={1}>
                        <Button
                          text="Apply Master Data"
                          type="default"
                          onClick={handleContinue18}
                        />
                      </SoftBox>
                    </ScrollView>
                  </Popup>
                </div>
              </SoftBox>
            </SoftBox>
          </Card>
        </Card>
      </React.Fragment>
    );
  }

  const dateFormatter = { year: "2-digit", month: "narrow", day: "2-digit" };

  return loading ? (
    <PageLoader1 />
  ) : userRole === "User" || userRole === "Admin" || userRole === "Manager" ? (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3} mb={15} textAlign="center">
        <StartButton />
        <SoftBox ml={2} mr={2} mb={6} mt={6}>
          <Card>
            <SoftBox textAlign="center" mt={3} mb={4} ml={4} mr={4}>
              <ValidationGroup>
                <Form
                  colCount={2}
                  labelMode="floating"
                  labelLocation="left"
                  onContentReady={validateForm}
                >
                  <GroupItem caption="Enter the Details">
                    <DateBox
                      label="From Document Date"
                      labelMode="floating"
                      displayFormat="dd/MM/yyyy"
                      showClearButton={true}
                      value={fromDateOne}
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
                      showClearButton={true}
                      value={toDateTwo}
                      valueChangeEvent="change"
                      min={min1}
                      onValueChanged={(e) => {
                        setToDateTwo(e.value);
                      }}
                    ></DateBox>
                    <br />
                    <NumberBox
                      label="Document Number"
                      labelMode="floating"
                      value={docNumOne}
                      showClearButton={true}
                      showSpinButtons={true}
                      onValueChanged={(e) => {
                        setDocNumOne(e.value);
                        // console.log(e.value);
                      }}
                    ></NumberBox>
                  </GroupItem>
                  <GroupItem caption="Select the Details">
                    <DropDownBox
                      label="Series"
                      labelMode="floating"
                      deferRendering={false}
                      valueExpr="series"
                      dataSource={seriesAPIList}
                      value={seriesid}
                      opened={isGridBoxOpened1}
                      wordWrapEnabled={true}
                      selectByClick={true}
                      showSelectionControls={true}
                      applyValueMode="useButtons"
                      displayExpr={gridBoxDisplayExpr1}
                      onValueChanged={syncDataGridSelection1}
                      onOptionChanged={onGridBoxOpened1}
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
                        <Scrolling columnRenderingMode="virtual"></Scrolling>
                        <Paging defaultPageSize={5} />
                        <FilterRow visible={true} />
                      </DataGrid>
                    </DropDownBox>
                    <br />
                    <DropDownBox
                      label="From Warehouse"
                      labelMode="floating"
                      value={whsid}
                      dataSource={whsAPIList}
                      wordWrapEnabled={true}
                      valueExpr="whsCode"
                      opened={isGridBoxOpened}
                      selectByClick={true}
                      showSelectionControls={true}
                      applyValueMode="useButtons"
                      displayExpr={gridBoxDisplayExpr}
                      onValueChanged={syncDataGridSelection}
                      onOptionChanged={onGridBoxOpened}
                    >
                      <DataGrid
                        dataSource={whsAPIList}
                        columns={gridColumnsWhs}
                        hoverStateEnabled={true}
                        height="100%"
                        selectedRowKeys={whsid}
                        onSelectionChanged={dataGridOnSelectionChanged}
                      >
                        <Selection mode="single" />
                        <Scrolling columnRenderingMode="virtual"></Scrolling>
                        <Paging defaultPageSize={5} />
                        <FilterRow visible={true} />
                      </DataGrid>
                    </DropDownBox>
                    <br />
                    <DropDownBox
                      label="To Warehouse"
                      labelMode="floating"
                      value={whsid1}
                      dataSource={whsAPIList}
                      wordWrapEnabled={true}
                      selectByClick={true}
                      valueExpr="whsCode"
                      opened={isGridBoxOpened2}
                      showSelectionControls={true}
                      applyValueMode="useButtons"
                      displayExpr={gridBoxDisplayExpr2}
                      onValueChanged={syncDataGridSelection2}
                      onOptionChanged={onGridBoxOpened2}
                    >
                      <DataGrid
                        dataSource={whsAPIList}
                        columns={gridColumnsWhs}
                        hoverStateEnabled={true}
                        height="100%"
                        selectedRowKeys={whsid1}
                        onSelectionChanged={dataGridOnSelectionChanged2}
                      >
                        <Selection mode="single" />
                        <Scrolling columnRenderingMode="virtual"></Scrolling>
                        <Paging defaultPageSize={5} />
                        <FilterRow visible={true} />
                      </DataGrid>
                    </DropDownBox>
                  </GroupItem>
                </Form>
              </ValidationGroup>
            </SoftBox>
          </Card>
          <ProgressLoader />
          <SoftBox container spacing={1} mt={5}>
            <SoftButton
              onClick={handleITRFilter}
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
        <div>
          {(() => {
            if (headerList[0] === undefined) {
              return;
            } else {
              return (
                <React.Fragment>
                  <div>
                    <LoadingOverlay
                      active={isActiveOverLay}
                      spinner={true}
                      text="Loading..."
                    >
                      <div>
                        <SoftTypography
                          mb={5}
                          mt={7}
                          ml={3}
                          mr={3}
                          style={{
                            color: "#0B2F8A",
                            fontWeight: "700",
                            fontSize: "24px",
                            lineHeight: "10px",
                            letterSpacing: 1,
                          }}
                        >
                          ITR to IT
                        </SoftTypography>
                        <SoftBox ml={0} mr={0} mb={6} mt={6}>
                          <Card>
                            <SoftBox ml={0.5} mr={0.5} mb={4} mt={4}>
                              <DataGrid
                                dataSource={headerList}
                                keyExpr="id"
                                showBorders={true}
                                allowColumnResizing={true}
                                //columnAutoWidth={true}
                                onExporting={onExporting}
                              >
                                <FilterRow visible={true} />
                                <HeaderFilter
                                  visible={true}
                                  allowSearch={true}
                                />
                                <Scrolling columnRenderingMode="virtual"></Scrolling>
                                <Paging defaultPageSize={10} />
                                <Sorting mode="multiple" />
                                <Export
                                  enabled={true}
                                  formats={exportFormats}
                                />
                                <Column
                                  dataField="docNum"
                                  caption="Doc Num"
                                  alignment="center"
                                />
                                <Column
                                  dataField="docDate"
                                  caption="Doc Date"
                                  format={dateFormatter}
                                  alignment="center"
                                />
                                <Column
                                  dataField="fromWhs"
                                  caption="From Warehouse"
                                  alignment="center"
                                />
                                <Column
                                  dataField="toWhs"
                                  caption="To Warehouse"
                                  alignment="center"
                                />
                                <Column
                                  dataField="cardCode"
                                  caption="Card Code"
                                  alignment="center"
                                />
                                <Column
                                  dataField="cardName"
                                  caption="Card Name"
                                  alignment="center"
                                />
                                <MasterDetail
                                  enabled={true}
                                  autoExpandAll={false}
                                  caption="id"
                                  render={PrimaryTab}
                                  // render={masterDetailView}
                                />
                              </DataGrid>
                            </SoftBox>
                          </Card>
                        </SoftBox>
                      </div>
                    </LoadingOverlay>
                  </div>
                </React.Fragment>
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
};
export default InventoryTransferRequest;
