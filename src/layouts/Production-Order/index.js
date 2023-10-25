import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Box from "@mui/material/Box";
import Footer from "examples/Footer";
import "./index.css";
import Card from "@mui/material/Card";
import axios from "axios";
import React, { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import LoadingOverlay from "react-loading-overlay";
//Dev Extreme
import "devextreme/dist/css/dx.light.css";
import "devextreme-react/text-area";
import { Form, GroupItem } from "devextreme-react/form";
import { formatDate } from "devextreme/localization";
import DateBox from "devextreme-react/date-box";
import TextBox from "devextreme-react/text-box";
import Validator, { RequiredRule } from "devextreme-react/validator";
import ValidationGroup from "devextreme-react/validation-group";
import { DropDownBox } from "devextreme-react/drop-down-box";
import DataGrid, {
  Column,
  MasterDetail,
  Selection,
  Paging,
  FilterRow,
  Scrolling,
  HeaderFilter,
  LoadPanel,
  Editing,
  Export,
  Sorting,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import notify from "devextreme/ui/notify";
import TextArea from "devextreme-react/text-area";
import { NumberBox } from "devextreme-react";
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
//Coding Starts
const gridColumnsWhs = ["whsCode", "whsName"];
const gridColumnsSeries = ["series", "seriesName"];
const exportFormats = ["pdf", "xlsx"];
//
const ProductionOrder = () => {
  // Handle Series API
  const [seriesid, setSeriesid] = useState("");
  const [seriesAPIList, setSeriesAPIList] = useState([]);
  // Handle Warehouse API
  const [whsid, setWhsid] = useState(""); //from warehouse
  const [whsAPIList, setwhsAPIList] = useState([]); //from warehouse
  const [whsid1, setWhsid1] = useState(""); //to warehouse Master data Detail
  const [headerList, setHeaderList] = useState([]);
  // Handle Filters
  const [fromDateOne, setFromDateOne] = useState("");
  const [toDateTwo, setToDateTwo] = useState("");
  const [status, setStatus] = useState("");
  // Handle Master data detail
  const [docNumOne, setDocNumOne] = useState("");
  const [docDate1, setDocDate1] = useState("");
  const [dueDate1, setDueDate1] = useState("");
  const [comments1, setComments1] = useState("");
  const [cardCodeTwo, setCardCodeTwo] = useState("");
  const [docEntryTwo, setDocEntryTwo] = useState("");
  const [objectTypeTwo, setObjectTypeTwo] = useState("");
  const [uomStatic, setUomStatic] = useState(""); //  important to always select masterdata grid elements
  const [poLinesArray1, setPoLinesArray1] = useState([]);
  const [docNum1, setDocNum1] = useState("");
  //Loaders
  const [isActiveOverLay, setIsActiveOverLay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progressLoading, setProgressLoading] = useState(false);
  const [columnCount, setColumnCount] = useState(2);
  const [getCurrentDateandTime, setGetCurrentDateandTime] = useState(
    new Date()
  );
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
  //Progress Bar Code
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
        Production Order
      </SoftTypography>
    );
  };
  //PDF Excel Export Coding
  const onExporting = React.useCallback((e) => {
    if (e.format === "xlsx") {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("PrdOrder");
      exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], { type: "application/octet-stream" }),
            "PrdOrderExcel.xlsx"
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
        doc.save("PrdOrderPDF.pdf");
      });
    }
  });
  //user login firebase status
  const [user, setUser] = useState();
  const [userName, setUserName] = useState();
  const [userEmailID, setUserEmailID] = useState();
  const [userRole, setUserRole] = useState();
  const [module, setModule] = useState("Production Order");
  //Function Starts
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
  //
  const [gridBoxValue, setGridBoxValue] = useState([1]);
  const [isGridBoxOpened, setIsGridBoxOpened] = useState(false);
  // Series
  const [gridBoxValue1, setGridBoxValue1] = useState([1]);
  const [isGridBoxOpened1, setIsGridBoxOpened1] = useState(false);
  // Warehouse Master Detail
  const [gridBoxValue2, setGridBoxValue2] = useState([1]);
  const [isGridBoxOpened2, setIsGridBoxOpened2] = useState(false);
  //
  const dataGridOnSelectionChanged1 = (e) => {
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
  //Warehouse API Grid Opened
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
  //Master Detail Warehouse API Grid Opened
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
  const handleCancel = () => {
    setHeaderList("");
  };
  //UseEffect Series & Warehouse
  useEffect(() => {
    const getSeriesAPI = async () => {
      const moduleName = {
        module: "Production Order",
      };
      const NewSeriesDataAPIList = await SeriesAPI(moduleName);
      setSeriesAPIList(NewSeriesDataAPIList);
    };
    getSeriesAPI();
  }, []);
  useEffect(() => {
    const getWarehouseAPI = async () => {
      const NewwhsDataAPIList = await WarehouseAPI();
      setwhsAPIList(NewwhsDataAPIList);
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
      const apiUrl = "${BACKEND_URL}/api/Seriess/GetSeriesByObject/202";
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
        const LogStatus1 = response.data.body.status;
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
        //console.log("first", response)
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
  //Main important Functions
  function containsWhitespace(str) {
    return /\s/.test(str);
  }
  const handleProductionOrderFilter = async (e) => {
    e.preventDefault();
    //Log Status
    const ApplyFilterDate = formatDate(getCurrentDateandTime, "yyyy-MM-dd");
    const entryDate = ApplyFilterDate;
    const ApplyFilterTime = formatDate(getCurrentDateandTime, "HH:mm");
    const entryTime =
      ApplyFilterTime[0] +
      ApplyFilterTime[1] +
      ApplyFilterTime[3] +
      ApplyFilterTime[4];
    const dbName = "WEL032023";
    //Log Status Completed
    setProgressLoading(true);
    //Grooming the API
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
    var warehouse = whsid;
    var series = seriesid;
    var docNum = docNumOne;
    //Grooming the API
    if (
      fromDateOne === "" &&
      toDateTwo === "" &&
      status === "" &&
      docNum === "" &&
      seriesid === "" &&
      whsid === ""
    ) {
      setProgressLoading(false);
      notify(
        {
          message: "Please fill atleast one Field....",
          width: 280,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        500
      );
    } else {
      //Grooming the API
      if (fromDate === "" || fromDate === undefined || fromDate === null) {
        fromDate = "string";
      }
      if (toDate === "" || toDate === undefined || toDate === null) {
        toDate = "string";
      }
      if (warehouse === "" || warehouse === undefined || warehouse === null) {
        warehouse = "";
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
        warehouse,
        series,
        docNum,
      };
      try {
        let response = await axios.post(
          `${BACKEND_URL}/api/ProductionOrders`,
          postData
        );
        const newData = response.data;
        let newList = newData;
        const newList2 = newList.map((element) => {
          const postDate = element.postDate.split(" ")[0];
          return { ...element, postDate };
        });
        if (newList == "") {
          setHeaderList(newList); // Dynamic API
          setProgressLoading(false);
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
          //Log Status Code
          const status = "E";
          const statusMsg = "There is no record found for this Filter";
          var filter = JSON.stringify(postData);
          let postLogData = {
            module,
            entryDate,
            entryTime,
            userEmailID,
            userName,
            status,
            statusMsg,
            filter,
            dbName,
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
          //Log Status Code Completed
        } else if (newList === undefined) {
          setHeaderList(newList);
          setProgressLoading(false);
          notify(
            {
              message: "Sorry...!!! There is server Error.",
              width: 280,
              position: "bottom center",
              direction: "up-push",
            },
            "error",
            2500
          );
          //Log Status Code
          const status = "E";
          const statusMsg = "Returned Undefined";
          var filter = JSON.stringify(postData);
          let postLogData = {
            module,
            entryDate,
            entryTime,
            userEmailID,
            userName,
            status,
            statusMsg,
            filter,
            dbName,
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
          //Log Status Code Completed
        } else {
          setHeaderList(newList2); // Dynamic API
          setProgressLoading(false);
          notify(
            {
              message: "Success...!!! Your Production Orders are Here.",
              width: 380,
              position: "bottom center",
              direction: "up-push",
            },
            "success",
            1500
          );
          handleAPILogStatus();
          //Log Status Code
          const status = "S";
          const statusMsg = "Success";
          var filter = JSON.stringify(postData);
          let postLogData = {
            module,
            entryDate,
            entryTime,
            userEmailID,
            userName,
            status,
            statusMsg,
            filter,
            dbName,
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
        }
      } catch (error) {
        if (error.response.data.status == "400") {
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
        } else if (error.response.data.status == "500") {
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
        setProgressLoading(false);
        console.log("Error in Production Order Filter", error);
        const status = "E";
        const statusMsg = `${error}`;
        var filter = JSON.stringify(postData);
        let postLogData = {
          module,
          entryDate,
          entryTime,
          userEmailID,
          userName,
          status,
          statusMsg,
          filter,
          dbName,
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
      }
    }
  };
  const handleProductionOrderFilter1 = async () => {
    setProgressLoading(true);
    //Grooming the API
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
    var warehouse = whsid;
    var series = seriesid;
    var docNum = docNumOne;
    //Grooming the API
    if (fromDate === "" || fromDate === undefined || fromDate === null) {
      fromDate = "string";
    }
    if (toDate === "" || toDate === undefined || toDate === null) {
      toDate = "string";
    }
    if (warehouse === "" || warehouse === undefined || warehouse === null) {
      warehouse = "";
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
      warehouse,
      series,
      docNum,
    };
    try {
      let response = await axios.post(
        `${BACKEND_URL}/api/ProductionOrders`,
        postData
      );
      const newData = response.data;
      let newList = newData;
      const newList2 = newList.map((element) => {
        const postDate = element.postDate.split(" ")[0]; // split string at space and get first element
        return { ...element, postDate }; // return new object with updated postDate field
      });
      if (newList == "") {
        setHeaderList(newList);
        setProgressLoading(false);
      } else {
        setHeaderList(newList2); // Dynamic API
        setProgressLoading(false);
      }
    } catch (error) {
      setProgressLoading(false);
      console.log("Error in Production Order", error);
    }
  };
  const addITR = async (e) => {
    setIsActiveOverLay(true);
    e.preventDefault();
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
    var cardCode = cardCodeTwo;
    var refDocEntry = docEntryTwo;
    var refObjType = objectTypeTwo;
    var comments = comments1;
    var toWarehouse = whsid1;
    if (whsid1 === "") {
      setIsActiveOverLay(false);
      notify(
        {
          message: "Please enter To Warehouse....",
          width: 280,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1200
      );
    } else if (
      docDate1 == "" ||
      dueDate1 == "" ||
      docDate1 == undefined ||
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
    } else if (comments1 == "") {
      setIsActiveOverLay(false);
      notify(
        {
          message: "Please enter Comments....",
          width: 280,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1200
      );
    } else {
      let postData1 = {
        cardCode,
        toWarehouse,
        comments,
        docDate,
        dueDate,
        refDocEntry,
        refObjType,
        poLines: poLinesArray1,
      };
      //console.log('postData1', postData1)
      try {
        let response = await axios.post(
          `${BACKEND_URL}/api/ProductionOrders/AddITR`,
          postData1
        );
        //console.log('Add ITR response', response)
        const AddITRStatus = response.data.status;
        const AddITRMessage = response.data.message;
        if (AddITRStatus == "200") {
          notify(
            {
              message: `Your ITR with DocNum ${docNum1} is Added Successfully.`,
              width: 470,
              shading: true,
              position: "bottom center",
              direction: "up-push",
            },
            "success",
            3600
          );
          setDocDate1("");
          setDueDate1("");
          setWhsid1("");
          setComments1("");
          setIsActiveOverLay(false);
          handleProductionOrderFilter1();
          handleAPILogStatus1();
          //Log API
          const status = "S";
          const resCode = "200";
          const resMsg = "Saved Successfully";
          const inputJson = JSON.stringify(postData1);
          let docEntry = docEntryTwo;
          let postLogData = {
            module,
            entryDate,
            entryTime,
            userEmailID,
            userName,
            dbName,
            inputJson,
            status,
            resCode,
            resMsg,
            docEntry,
          };
          try {
            let response = await axios.post(
              `${BACKEND_URL}/api/Logs/AddTransactionLog`,
              postLogData
            );
            // console.log('first', response)
            const LogStatus = response.data.status;
            if (LogStatus === "200") {
              console.log("Success....Add PRD ITR Log Table Status");
            } else {
              console.log("Failed....Add PRD ITR Log Table Status");
            }
          } catch (error) {
            console.log("Error in Add PRD ITR Log Table", error);
          }
          //Log API Completed
        } else {
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
          setWhsid1("");
          setComments1("");
          //
          const status = "E";
          const resCode = "400";
          const resMsg = `${AddITRMessage}`;
          const inputJson = JSON.stringify(postData1);
          let docEntry = docEntryTwo;
          let postLogData = {
            module,
            entryDate,
            entryTime,
            userEmailID,
            userName,
            dbName,
            inputJson,
            status,
            resCode,
            resMsg,
            docEntry,
          };
          try {
            let response = await axios.post(
              `${BACKEND_URL}/api/Logs/AddTransactionLog`,
              postLogData
            );
            //console.log('first', response)
            const LogStatus = response.data.status;
            if (LogStatus === "200") {
              console.log("Success....Add PRD ITR Log Table Status");
            } else {
              console.log("Failed....Add PRD ITR Log Table Status");
            }
          } catch (error) {
            console.log("Error in Add PRD ITR Log Table", error);
          }
          //
        }
      } catch (error) {
        setIsActiveOverLay(false);
        console.log("Error in PRD Add ITR", error);
        if (error.response.data.status == "400") {
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
        } else if (error.response.status == "404") {
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
          setDocDate1("");
          setDueDate1("");
          setWhsid1("");
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
            4000
          );
          setDocDate1("");
          setDueDate1("");
          setWhsid1("");
          setComments1("");
        } else {
          notify(
            {
              message:
                "Sorry...!!! Some Problem in APIs. Please try again later.",
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
          setWhsid1("");
          setComments1("");
        }
        const status = "E";
        const resCode = "500";
        const resMsg = `${error}`;
        const inputJson = JSON.stringify(postData1);
        let docEntry = docEntryTwo;
        let postLogData = {
          module,
          entryDate,
          entryTime,
          userEmailID,
          userName,
          dbName,
          inputJson,
          status,
          resCode,
          resMsg,
          docEntry,
        };
        try {
          let response = await axios.post(
            `${BACKEND_URL}/api/Logs/AddTransactionLog`,
            postLogData
          );
          const LogStatus = response.data.status;
          if (LogStatus === "200") {
            console.log("Success....Add PRD ITR Log Table Status");
          } else {
            console.log("Failed....Add PRD ITR Log Table Status");
          }
        } catch (error) {
          console.log("Error in Add PRD ITR Log Table", error);
        }
      }
    }
  };
  // Master Data Detail Coding Starts
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
  // Master Data Detail Function
  function masterDataDetail(props) {
    const poLines = props.data.poLines;
    setPoLinesArray1(poLines);
    setCardCodeTwo(props.data.cardCode);
    setDocEntryTwo(props.data.docEntry);
    setObjectTypeTwo(props.data.objectType);
    setDocNum1(props.data.docNum);
    const min = new Date(docDate1);
    const max = new Date(new Date());
    const selectionFilter = ["uomStatic", "=", null];
    const { checkBoxesMode } = state;

    return (
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
            Production Order #{`${props.data.docNum}`}
          </SoftTypography>
          <ValidationGroup>
            <Form colCount={2} formData={props.data}>
              <GroupItem caption="">
                <TextBox
                  label="Item Code"
                  labelMode="static"
                  readOnly={true}
                  defaultValue={props.data.itemCode}
                ></TextBox>
                <TextBox
                  label="Item Name"
                  labelMode="static"
                  readOnly={true}
                  defaultValue={props.data.itemName}
                ></TextBox>
                <TextBox
                  label="Post Date"
                  labelMode="static"
                  readOnly={true}
                  defaultValue={props.data.postDate}
                ></TextBox>
                <NumberBox
                  label="Planned Qty"
                  labelMode="static"
                  dataType="number"
                  readOnly={true}
                  defaultValue={props.data.plannedQty}
                ></NumberBox>
              </GroupItem>
              <GroupItem>
                <TextBox
                  label="From Warehouse"
                  labelMode="static"
                  readOnly={true}
                  defaultValue={props.data.warehouse}
                ></TextBox>
                <DropDownBox
                  label="To Warehouse"
                  labelMode="floating"
                  dataSource={whsAPIList}
                  opened={isGridBoxOpened2}
                  wordWrapEnabled={true}
                  selectByClick={true}
                  valueExpr="whsCode"
                  displayExpr={gridBoxDisplayExpr2}
                  value={whsid1}
                  showSelectionControls={true}
                  applyValueMode="useButtons"
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
                  <Validator>
                    <RequiredRule message="Required" />
                  </Validator>
                </DropDownBox>
                <DateBox
                  label="Doc Date"
                  labelMode="floating"
                  focusStateEnabled={true}
                  //pickerType="calendar"
                  displayFormat="dd/MM/yyyy"
                  max={max}
                  showClearButton={true}
                  value={docDate1}
                  valueChangeEvent="change"
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
                  focusStateEnabled={true}
                  displayFormat="dd/MM/yyyy"
                  //pickerType="calendar"
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
            <DataGrid
              id="gridContainer"
              dataSource={props.data.poLines}
              keyExpr="id"
              showBorders={true}
              allowColumnResizing={true}
              columnAutoWidth={true}
              defaultSelectionFilter={selectionFilter}
            >
              <Selection
                mode="multiple"
                deferred={true}
                showCheckBoxesMode={checkBoxesMode}
              />
              <FilterRow visible={true} />
              <HeaderFilter visible={true} allowSearch={true} />
              <Scrolling rowRenderingMode="virtual" />
              <Paging enabled={false} />
              <Sorting mode="multiple" />
              <Editing
                mode="cell"
                useIcons={true}
                allowUpdating={true}
                allowDeleting={true}
              />
              <Column type="buttons" caption="Actions">
                <Button name="edit" />
                <Button name="delete" />
              </Column>
              <Column
                dataField="itemCode"
                caption="Item Code"
                allowEditing={false}
                alignment="center"
              />
              <Column
                dataField="itemName"
                caption="Item Name"
                allowEditing={false}
                alignment="center"
              />
              <Column
                dataField="warehouse"
                caption="Warehouse"
                allowEditing={false}
                alignment="center"
              />
              <Column
                dataField="plannedQty"
                caption="Planned Qty"
                alignment="center"
                format={precisionFormatMaster}
                dataType="number"
                allowEditing={false}
              />
              <Column
                dataField="uomCode"
                caption="UOM Code"
                allowEditing={false}
                alignment="center"
                visible={false}
              />
              <Column
                dataField="baseQty"
                caption="Base Quantity"
                allowEditing={false}
                alignment="center"
                format={precisionFormatMaster}
                dataType="number"
              />
              <Column
                dataField="availableStock"
                caption="In Stock"
                allowEditing={false}
                alignment="center"
                format={precisionFormatMaster}
                dataType="number"
              />
              <Column
                dataField="uomName"
                caption="UOM Name"
                allowEditing={false}
                alignment="center"
              />
              <Column
                dataField="ocrCode"
                caption="OCR Code"
                allowEditing={false}
                alignment="center"
              />
              <Column
                dataField="project"
                caption="Project Code"
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
            <SoftBox style={{ display: "flex" }} mt={4}>
              <SoftBox>
                <SoftButton
                  onClick={addITR}
                  variant="contained"
                  color="info"
                  style={{
                    backgroundColor: "#0B2F8A",
                    boxShadow: " 0px 8px 24px -2px rgba(11, 47, 138, 0.6)",
                    marginLeft: "20px",
                  }}
                >
                  Add ITR
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
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </Card>
      </Card>
    );
  }
  const dateFormatter = { year: "2-digit", month: "narrow", day: "2-digit" };
  const precisionFormat = {
    type: "fixedPoint",
    precision: 2,
  };

  return loading ? (
    <PageLoader1 />
  ) : userRole === "User" || userRole === "Admin" || userRole === "Manager" ? (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3} mb={54} textAlign="center">
        <StartButton />
        <SoftBox ml={2} mr={2} mb={6} mt={6}>
          <Card>
            <SoftBox textAlign="center" mt={3} mb={4} ml={4} mr={4}>
              <ValidationGroup>
                <Form
                  colCount={columnCount}
                  labelMode="static"
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
                      }}
                    ></NumberBox>
                  </GroupItem>
                  <GroupItem caption="Select the Details">
                    <DropDownBox
                      label="Series"
                      labelMode="floating"
                      value={seriesid}
                      opened={isGridBoxOpened1}
                      valueExpr="series"
                      deferRendering={false}
                      displayExpr={gridBoxDisplayExpr1}
                      dataSource={seriesAPIList}
                      onValueChanged={syncDataGridSelection1}
                      onOptionChanged={onGridBoxOpened1}
                      showSelectionControls={true}
                      applyValueMode="useButtons"
                      wordWrapEnabled={true}
                      selectByClick={true}
                    >
                      <DataGrid
                        dataSource={seriesAPIList}
                        columns={gridColumnsSeries}
                        wordWrapEnabled={true}
                        hoverStateEnabled={true}
                        selectedRowKeys={seriesid}
                        onSelectionChanged={dataGridOnSelectionChanged1}
                        height="100%"
                      >
                        <LoadPanel enabled={true} />
                        <Selection mode="single" />
                        <Scrolling columnRenderingMode="virtual"></Scrolling>
                        <Paging defaultPageSize={5} />
                        <FilterRow visible={true} />
                      </DataGrid>
                    </DropDownBox>
                    <br />
                    <DropDownBox
                      label="Warehouse"
                      labelMode="floating"
                      value={whsid}
                      opened={isGridBoxOpened}
                      dataSource={whsAPIList}
                      wordWrapEnabled={true}
                      selectByClick={true}
                      valueExpr="whsCode"
                      showSelectionControls={true}
                      applyValueMode="useButtons"
                      displayExpr={gridBoxDisplayExpr}
                      onValueChanged={syncDataGridSelection}
                      onOptionChanged={onGridBoxOpened}
                    >
                      <DataGrid
                        dataSource={whsAPIList}
                        columns={gridColumnsWhs}
                        wordWrapEnabled={true}
                        hoverStateEnabled={true}
                        height="100%"
                        selectedRowKeys={whsid}
                        onSelectionChanged={dataGridOnSelectionChanged}
                      >
                        <LoadPanel enabled={true} visible={true} />
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
              onClick={handleProductionOrderFilter}
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
        {/* Second component */}
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
                          mb={3}
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
                          Your Production Orders
                        </SoftTypography>

                        <SoftBox ml={0} mr={0} mb={6} mt={5}>
                          <Card>
                            <SoftBox ml={0.5} mr={0.5} mb={4} mt={3}>
                              <DataGrid
                                dataSource={headerList}
                                keyExpr="id"
                                showBorders={true}
                                allowColumnResizing={true}
                                allowColumnReordering={true}
                                onExporting={onExporting}
                              >
                                <FilterRow visible={true} />
                                <HeaderFilter
                                  visible={true}
                                  allowSearch={true}
                                />
                                <Scrolling columnRenderingMode="virtual"></Scrolling>
                                <Paging defaultPageSize={8} />
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
                                  dataField="postDate"
                                  caption="Post Date"
                                  format={dateFormatter}
                                  alignment="center"
                                />
                                <Column
                                  dataField="itemCode"
                                  caption="Item Code"
                                  alignment="center"
                                />
                                <Column
                                  dataField="itemName"
                                  caption="Item Name"
                                  alignment="center"
                                />
                                <Column
                                  dataField="warehouse"
                                  caption="Warehouse"
                                  alignment="center"
                                />
                                <Column
                                  dataField="plannedQty"
                                  caption="Planned Qty"
                                  format={precisionFormat}
                                  dataType="number"
                                  alignment="center"
                                />
                                <MasterDetail
                                  enabled={true}
                                  autoExpandAll={false}
                                  caption="id"
                                  render={masterDataDetail}
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

export default ProductionOrder;
