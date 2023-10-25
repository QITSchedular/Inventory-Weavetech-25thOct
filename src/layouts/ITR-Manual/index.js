import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import "./index.css";
import Card from "@mui/material/Card";
import axios from "axios";
import { formatDate } from "devextreme/localization";
import React, { useState, useEffect, useCallback } from "react";
import "devextreme/dist/css/dx.light.css";
import Form, { GroupItem } from "devextreme-react/form";
import DateBox from "devextreme-react/date-box";
import TextBox from "devextreme-react/text-box";
import { RequiredRule } from "devextreme-react/validator";
import ValidationGroup from "devextreme-react/validation-group";
import { DropDownBox } from "devextreme-react/drop-down-box";
import DataGrid, {
  Column,
  Selection,
  Paging,
  FilterRow,
  Scrolling,
  Editing,
  Lookup,
  Sorting,
  Toolbar,
  LoadPanel,
  Popup,
} from "devextreme-react/data-grid";
import { query, collection, getDocs, where } from "firebase/firestore";
import { NumberBox } from "devextreme-react";
import { itemsIdStatic } from "./ITRManualStaticJSON.js";
import { auth, db } from "../authentication/firebase";
import { onAuthStateChanged } from "firebase/auth";
import notify from "devextreme/ui/notify";
import "devextreme-react/text-area";
import { Item } from "devextreme-react/form";
import TextArea from "devextreme-react/text-area";
import "devextreme/data/odata/store";

import LoadingOverlay from "react-loading-overlay";
import { WarehouseAPI, SeriesAPI, BACKEND_URL, VendorAPI } from "../../api.js";
//Coding Starts
const gridColumnsWhs = ["whsCode", "whsName"];
const gridColumnsSeries = ["series", "seriesName"];
const gridColumnsVendor = ["cardCode", "cardName"];
//
const ITRManual = () => {
  const [seriesid, setSeriesid] = useState("");
  const [seriesAPIList, setSeriesAPIList] = useState([]);
  const [whsid, setWhsid] = useState(""); //from warehouse
  const [whsLocation, setWhsLocation] = useState(""); //from warehouse
  const [whsFromLocationId, setWhsFromLocationId] = useState(""); //from warehouse
  const [whsAPIList, setwhsAPIList] = useState([]); //from warehouse
  const [whsid1, setWhsid1] = useState(""); //to warehouse
  const [vendorid, setVendorid] = useState(""); //Business Partner API, Vendor Code
  const [vendorName, setVendorName] = useState(""); //Business Partner API, Vendor Name
  const [vendorAPIList, setVendorAPIList] = useState([]); //Business Partner API, Vendor API
  const [vendorAPIList1, setVendorAPIList1] = useState([]); //Business Partner API, Vendor API
  //Business Partner API
  const [contactPerson, setContactPerson] = useState("");
  const [shipTo, setShipTo] = useState("");
  const [street, setStreet] = useState("");
  const [block, setBlock] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [state1, setState1] = useState("");
  const [country, setCountry] = useState("");
  //Items API List
  const [itemsAPIList, setItemsAPIList] = useState([]);
  // Table Data
  const [itemCode, setItemCode] = useState("");
  const [qty1, setQty1] = useState("");
  const [headerList, setHeaderList] = useState([]);
  const [headerListServer, setHeaderListServer] = useState([]);
  const [docNum, setDocNum] = useState("");
  const [remarks, setRemarks] = useState("");
  const [postingDateOne, setPostingDateOne] = useState(new Date());
  const [docDateOne, setDocDateOne] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [isActiveOverLay, setIsActiveOverLay] = useState(false);
  const [getCurrentDateandTime, setGetCurrentDateandTime] = useState(
    new Date()
  );
  const [module, setModule] = useState("ITR Manual");
  //user login firebase status
  const [user, setUser] = useState();
  const [userName, setUserName] = useState();
  const [userEmailID, setUserEmailID] = useState();
  const [userRole, setUserRole] = useState();
  //Fetch Username
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
  //user login firebase status completed
  // Series
  const [gridBoxValue1, setGridBoxValue1] = useState([1]);
  const [isGridBoxOpened1, setIsGridBoxOpened1] = useState(false);
  // From Warehouse
  const [gridBoxValue, setGridBoxValue] = useState([1]);
  const [isGridBoxOpened, setIsGridBoxOpened] = useState(false);
  // To Warehouse
  const [gridBoxValue2, setGridBoxValue2] = useState([1]);
  const [isGridBoxOpened2, setIsGridBoxOpened2] = useState(false);
  // Vendor/Supplier
  const [gridBoxValue3, setGridBoxValue3] = useState([1]);
  const [isGridBoxOpened3, setIsGridBoxOpened3] = useState(false);

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
        ITR Manual
      </SoftTypography>
    );
  };
  //Second Part // Grid Boxes Opened
  //Series API Grid Opened
  const dataGridOnSelectionChanged1 = async (e) => {
    setGridBoxValue1(e.selectedRowKeys);
    setSeriesid(e.selectedRowsData[0].series);
    setIsGridBoxOpened1(false);
    const Series4 = e.selectedRowsData[0].series;
    //Get Document Number
    try {
      let response = await axios.get(
        `${BACKEND_URL}/api/DocNumBySeriess/1250000001/${Series4}`
      );
      const NewDocNum5 = response.data;
      setDocNum(NewDocNum5[0].docNum);
    } catch (error) {
      console.log("Error in getDocumentNumberBySeries", error);
      notify(
        {
          message: "Get Document Number by Series API by Code not Working....",
          width: 370,
          shading: true,
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
  //From Warehouse API Grid Opened
  const dataGridOnSelectionChanged = async (e) => {
    setGridBoxValue(e.selectedRowKeys);
    setWhsid(e.selectedRowsData[0].whsCode);
    setWhsLocation(e.selectedRowsData[0].locName);
    setWhsFromLocationId(e.selectedRowsData[0].locationId);
    setIsGridBoxOpened(false);
    const fromWhsCode = e.selectedRowsData[0].whsCode;
    //Get Address
    try {
      let response = await axios.get(
        `${BACKEND_URL}/api/Items/ItemDet/${fromWhsCode}`
      );
      const ItemsDataAPI = response.data;
      const NewItemsDataAPIList = ItemsDataAPI.map((element) => {
        const availableStock = element.availableStock.split(".")[0];
        return { ...element, availableStock };
      });
      setItemsAPIList(NewItemsDataAPIList);
    } catch (error) {
      console.log("Inside Catch Block Items API", error);
      notify(
        {
          message: "Item's API is not Working....",
          width: 280,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1000
      );
    }
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
  //Vendor API Grid Opened
  const dataGridOnSelectionChanged3 = async (e) => {
    setGridBoxValue3(e.selectedRowKeys);
    setVendorid(e.selectedRowsData[0].cardCode);
    setVendorName(e.selectedRowsData[0].cardName);
    setIsGridBoxOpened3(false);
    const CardCode4 = e.selectedRowsData[0].cardCode;
    //Get Address
    try {
      let response = await axios.get(
        `${BACKEND_URL}/api/BusinessPartners/GetBusinessPartnerByCode/${CardCode4}`
      );
      const NewVendorDataAPIList1 = response.data;
      setVendorAPIList1(NewVendorDataAPIList1);
      setContactPerson(NewVendorDataAPIList1[0].cntctPrsn);
      setShipTo(NewVendorDataAPIList1[0].shipToDef);
      setStreet(NewVendorDataAPIList1[0].streetS);
      setBlock(NewVendorDataAPIList1[0].blockS);
      setCity(NewVendorDataAPIList1[0].cityS);
      setState1(NewVendorDataAPIList1[0].stateS);
      setZipCode(NewVendorDataAPIList1[0].zipCodeS);
      setCountry(NewVendorDataAPIList1[0].country);
    } catch (error) {
      console.log("Error in Vendor API", error);
      notify(
        {
          message: "Business Partner API by Code not Working....",
          width: 300,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        2000
      );
    }
  };
  const syncDataGridSelection3 = (e) => {
    setGridBoxValue3(e.value);
  };
  function gridBoxDisplayExpr3(item) {
    return item && `${item.cardCode}`;
  }
  const onGridBoxOpened3 = (e) => {
    if (e.name === "opened") {
      setIsGridBoxOpened3(e.value);
    }
    if (e.name === "isActive") {
      setVendorid("");
    }
  };
  //Third Part // UseEffect
  //Get Series & Warehouse
  useEffect(() => {
    const getSeriesAPI = async () => {
      const moduleName = {
        module: "ITR Manual",
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
  //Business Partner by Type
  useEffect(() => {
    const getVendorAPI = async () => {
      const NewVendorDataAPIList = await VendorAPI();
      setVendorAPIList(NewVendorDataAPIList);
    };
    getVendorAPI();
  }, []);
  const validateForm = React.useCallback((e) => {
    e.component.validate();
  }, []);
  //
  const now = new Date();
  const max = new Date(new Date());
  const handleCancel = () => {
    setHeaderListServer("");
    setHeaderList("");
  };
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
        "${myURL}/api/Seriess/GetSeriesByObject/1250000001 & ${myURL}/api/Warehouses/N & ${myURL}/api/DocNumBySeriess/1250000001/${Seriesid} & ${myURL}/api/Items/ItemDet/${Whsid}";
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
      //console.log("first", postLogData)
      try {
        let response = await axios.post(
          `${BACKEND_URL}/api/Logs/AddAPILog`,
          postLogData
        );
        // console.log("first", response)
        const LogStatus = response.data.status;
        if (LogStatus === "200") {
          console.log("Success....ITR Manual API Log Table Status");
        } else {
          console.log("Failed....ITR Manual Log Table Status");
        }
      } catch (error) {
        console.log("Error in ITR Manual Log Table", error);
      }
    }
    if (vendorid != "") {
      const apiUrl =
        "${myURL}/api/BusinessPartners/GetBusinessPartnerByType/S & ${myURL}/api/BusinessPartners/GetBusinessPartnerByCode/${CardCode}";
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
          console.log("Success....ITR Manual BP Code Log Table Status");
        } else {
          console.log("Failed....ITR Manual BP CodeLog Table Status");
        }
      } catch (error) {
        console.log("Error in ITR Manual BP Code Log Table", error);
      }
    }
  };
  const handleContinue = async (e) => {
    e.preventDefault();
    if (
      seriesid === "" ||
      docNum === "" ||
      postingDateOne === "" ||
      docDateOne === "" ||
      whsid === "" ||
      whsid1 === ""
    ) {
      notify(
        {
          message: "Please Fill all the Fields....",
          width: 240,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1000
      );
    } else if (whsid === whsid1) {
      notify(
        {
          message: "From Warehouse & To Warehouse can't be same....",
          width: 440,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1000
      );
    } else {
      const headerList4 = [
        {
          id: `${index + 1}`,
          fromWhs: whsid,
          toWhs: whsid1,
          //qty: qty1,
        },
      ];
      setIndex(index + 1);
      setHeaderList(headerList4);
      handleAPILogStatus();
      //setHeaderListServer(headerList4);
      //console.log("headerList4", headerList4);
    }
  };
  function containsWhitespace(str) {
    return /\s/.test(str);
  }
  const addIT = async (e) => {
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
    if (
      seriesid === "" ||
      docNum === "" ||
      postingDateOne === "" ||
      docDateOne === "" ||
      whsid === "" ||
      whsid1 === ""
    ) {
      setIsActiveOverLay(false);
      notify(
        {
          message: "Please Fill all the Fields",
          width: 300,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1000
      );
    } else if (headerListServer === "") {
      setIsActiveOverLay(false);
      notify(
        {
          message: "Please Fill all the Parameters Table",
          width: 400,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        1000
      );
    } else {
      //
      if (containsWhitespace(postingDateOne)) {
        var postingDate = formatDate(postingDateOne, "yyyy-MM-dd");
      } else {
        postingDate = postingDateOne.split("/").join("-");
      }
      if (containsWhitespace(docDateOne)) {
        var docDate = formatDate(docDateOne, "yyyy-MM-dd");
      } else {
        docDate = docDateOne.split("/").join("-");
      }
      let cardCode = vendorid;
      let series = seriesid;
      let fromWarehouse = whsid;
      let toWarehouse = whsid1;
      let comments = remarks;
      //
      let postDataITRManual = {
        cardCode,
        docNum,
        series,
        postingDate,
        docDate,
        fromWarehouse,
        toWarehouse,
        comments,
        itrDet: headerListServer,
      };
      try {
        let response = await axios.post(
          `${BACKEND_URL}/api/AddITRManuals/AddITR`,
          postDataITRManual
        );
        const AddITRStatus = response.data.status;
        const AddITRMessage = response.data.message;
        if (AddITRStatus == "200") {
          //Insertion in Log Table
          const status = "S";
          const resCode = "200";
          const resMsg = "Inserted Successfully";
          const docEntry = docNum;
          const inputJson = JSON.stringify(postDataITRManual);
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
              console.log("Success....Add ITR Manual Log Table Status");
            } else {
              console.log("Failed....Add ITR Manual Log Table Status");
            }
          } catch (error) {
            console.log("Error in Add ITR Manual Log Table", error);
          }
          //
          //Insertion in Log Table Completed
          notify(
            {
              message: `Success...!!! Your ITR with Doc Num  ${docNum} is added.`,
              width: 450,
              shading: true,
              position: "bottom center",
              direction: "up-push",
            },
            "success",
            1500
          );
          setIsActiveOverLay(false);
          setHeaderListServer("");
          setHeaderList("");
          setVendorid("");
          setDocNum("");
          setSeriesid("");
          setPostingDateOne("");
          setDocDateOne("");
          setWhsid("");
          setWhsid1("");
          setWhsLocation("");
          setRemarks("");
          setVendorName("");
          setContactPerson("");
          setShipTo("");
          setStreet("");
          setBlock("");
          setCity("");
          setState1("");
          setCountry("");
          setZipCode("");
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
          //
          const status = "E";
          const resCode = "400";
          const resMsg = `${AddITRMessage}`;
          const docEntry = docNum;
          const inputJson = JSON.stringify(postDataITRManual);
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
              console.log("Success....Add  ITR Manual Log Table Status");
            } else {
              console.log("Failed....Add ITR Manual Log Table Status");
            }
          } catch (error) {
            console.log("Error in Add ITR Manual Log Table", error);
          }
          //
        }
      } catch (error) {
        setIsActiveOverLay(false);
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
            4000
          );
        }
        console.log("Error in Adding Manual ITR", error);
        //
        const status = "E";
        const resCode = "500";
        const resMsg = `${error}`;
        const docEntry = docNum;
        const inputJson = JSON.stringify(postDataITRManual);
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
            console.log("Success....Add GRN ITR Log Table Status");
          } else {
            console.log("Failed....Add GRN ITR Log Table Status");
          }
        } catch (error) {
          console.log("Error in Add GRN ITR Log Table", error);
        }
        //
      }
    }
  };
  //
  function gridBoxDisplayExpr18(item) {
    // navigator.keyboard.lock();

    return (
      item &&
      `${item.availableStock} -- ${item.itemCode} -- ${item.itemName} -- <${item.uomName}>`
    );
  }

  const onGridBoxOpened18 = useCallback((e) => {
    console.log(e.previousValue);
    console.log(e.value);
  }, []);

  const LookUpWhsName = [
    {
      LookupWhsName: whsid,
    },
  ];

  const precisionFormatMaster = {
    type: "fixedPoint",
    precision: 6,
  };

  return loading ? (
    <PageLoader1 />
  ) : userRole === "User" || userRole === "Admin" || userRole === "Manager" ? (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3} mb={25} textAlign="center">
        <StartButton />
        <SoftBox ml={2} mr={2} mb={6} mt={6}>
          <Card>
            <SoftBox textAlign="center" mt={3} mb={4} ml={4} mr={4}>
              <ValidationGroup>
                <Form
                  colCount={2}
                  readOnly={false}
                  labelMode="floating"
                  labelLocation="left"
                  onContentReady={validateForm}
                  showColonAfterLabel={true}
                  showValidationSummary={true}
                  validationGroup="headerList"
                >
                  <GroupItem caption="Business Partner Details">
                    <DropDownBox
                      label="Business Partner Code"
                      labelMode="floating"
                      opened={isGridBoxOpened3}
                      deferRendering={false}
                      valueExpr="cardCode"
                      displayExpr={gridBoxDisplayExpr3}
                      dataSource={vendorAPIList}
                      value={vendorid}
                      showSelectionControls={true}
                      applyValueMode="useButtons"
                      onValueChanged={syncDataGridSelection3}
                      onOptionChanged={onGridBoxOpened3}
                    >
                      <DataGrid
                        dataSource={vendorAPIList}
                        columns={gridColumnsVendor}
                        wordWrapEnabled={true}
                        hoverStateEnabled={true}
                        height="100%"
                        selectedRowKeys={vendorid}
                        onSelectionChanged={dataGridOnSelectionChanged3}
                      >
                        <Selection mode="single" />
                        <Scrolling columnRenderingMode="virtual"></Scrolling>
                        <Paging defaultPageSize={5} />
                        <FilterRow visible={true} />
                        <LoadPanel enabled={true} />
                      </DataGrid>
                    </DropDownBox>
                    <br />
                    <TextBox
                      label="Business Partner Name"
                      readOnly={true}
                      labelMode="floating"
                      value={vendorName}
                    ></TextBox>
                    <br />
                    <TextBox
                      label="Contact Person"
                      readOnly={true}
                      labelMode="floating"
                      value={contactPerson}
                    ></TextBox>
                    <br />
                    <TextBox
                      label="Ship To"
                      labelMode="floating"
                      readOnly={true}
                      value={shipTo}
                    ></TextBox>
                    <br />
                    <TextBox
                      label="Street"
                      labelMode="floating"
                      readOnly={true}
                      value={street}
                    ></TextBox>
                    <br />
                    <TextBox
                      label="Block"
                      labelMode="floating"
                      readOnly={true}
                      value={block}
                    ></TextBox>
                    <br />
                    <TextBox
                      label=""
                      labelMode="floating"
                      readOnly={true}
                      value={`${city} -- ${state1} -- ${country} -- ${zipCode}`}
                      height={42}
                    ></TextBox>
                  </GroupItem>
                  <GroupItem caption="Mandatory Details to Fill">
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
                        <LoadPanel enabled={true} />
                        <Selection mode="single" />
                        <Scrolling columnRenderingMode="virtual"></Scrolling>
                        <Paging defaultPageSize={5} />
                        <FilterRow visible={true} />
                      </DataGrid>
                    </DropDownBox>
                    <br />
                    <NumberBox
                      label="Document Number"
                      readOnly={true}
                      labelMode="floating"
                      value={docNum}
                    ></NumberBox>
                    <br />
                    <DateBox
                      label="Posting Date"
                      labelMode="floating"
                      displayFormat="dd/MM/yyyy"
                      showClearButton={true}
                      defaultValue={now}
                      value={postingDateOne}
                      valueChangeEvent="change"
                      onValueChanged={(e) => {
                        setPostingDateOne(e.value);
                      }}
                    ></DateBox>
                    <br />
                    <DateBox
                      label="Document Date"
                      labelMode="floating"
                      displayFormat="dd/MM/yyyy"
                      showClearButton={true}
                      defaultValue={now}
                      max={max}
                      value={docDateOne}
                      valueChangeEvent="change"
                      onValueChanged={(e) => {
                        setDocDateOne(e.value);
                      }}
                    ></DateBox>
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
                        <LoadPanel enabled={true} />
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
                        <LoadPanel enabled={true} />
                      </DataGrid>
                    </DropDownBox>
                    <br />
                    <TextBox
                      label="From Warehouse Location"
                      readOnly={true}
                      labelMode="floating"
                      value={whsLocation}
                    ></TextBox>
                  </GroupItem>
                </Form>
              </ValidationGroup>
            </SoftBox>
          </Card>
          <SoftBox container spacing={1} mt={5}>
            <SoftButton
              onClick={handleContinue}
              variant="contained"
              color="info"
              style={{
                backgroundColor: "#0B2F8A",
                boxShadow: " 0px 8px 24px -2px rgba(11, 47, 138, 0.6)",
              }}
            >
              Continue
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
                      styles={{
                        backgroundColor: "rgba(0,0,0,0.4)",
                      }}
                    >
                      <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                        <SoftBox ml={1} mr={1} mb={6} mt={6}>
                          <Card>
                            <SoftBox ml={1} mr={1} mb={7} mt={4}>
                              <DataGrid
                                id="id"
                                keyExpr="id"
                                dataSource={headerListServer}
                                showBorders={true}
                                allowColumnReordering={true}
                                allowColumnResizing={true}
                                remoteOperations={true}
                              >
                                <Editing
                                  mode="popup"
                                  allowUpdating={true}
                                  allowDeleting={true}
                                  allowAdding={true}
                                  useIcons={true}
                                >
                                  <Popup
                                    title="From Warehouse Details"
                                    showTitle={true}
                                    width={700}
                                    height={250}
                                  />
                                  <Form>
                                    <Item
                                      itemType="group"
                                      colCount={1}
                                      colSpan={1}
                                    >
                                      <Item dataField="whsName" />
                                      <Item dataField="itemCode" />
                                      <Item dataField="qty" />
                                    </Item>
                                  </Form>
                                </Editing>
                                <Toolbar>
                                  <Item name="addRowButton" showText="always" />
                                </Toolbar>
                                <Scrolling columnRenderingMode="virtual" />
                                <Paging enabled={true} />
                                <Sorting mode="multiple" />

                                {/* Table Start */}
                                <Column
                                  dataField="whsName"
                                  caption="From Whs"
                                  alignment="center"
                                  visible={false}
                                >
                                  <Lookup
                                    dataSource={LookUpWhsName}
                                    value={LookUpWhsName[0].LookupWhsName}
                                    valueExpr="LookupWhsName"
                                    displayExpr="LookupWhsName"
                                  />
                                  <RequiredRule message="Required" />
                                </Column>
                                <Column
                                  dataField="itemCode"
                                  //caption="In Stock--Item Code--Item Name--<UOM Name>"
                                  caption="Item Code"
                                  alignment="center"
                                  // width={400}
                                >
                                  <Lookup
                                    dataSource={itemsAPIList} //Dynamic API
                                    valueExpr="itemCode"
                                    displayExpr={gridBoxDisplayExpr18}
                                    onValueChanged={onGridBoxOpened18}
                                  />
                                  <RequiredRule message="Required" />
                                </Column>
                                <Column
                                  dataField="qty"
                                  caption="Quantity"
                                  dataType="number"
                                  alignment="center"
                                  format={precisionFormatMaster}
                                  width={80}
                                >
                                  <RequiredRule message="Required" />
                                </Column>
                              </DataGrid>
                            </SoftBox>
                          </Card>

                          <br />
                          <TextArea
                            label="Remarks"
                            labelMode="floating"
                            value={remarks}
                            onValueChanged={(e) => {
                              setRemarks(e.value);
                              //console.log(e.value);
                            }}
                            height={70}
                            width={400}
                            editorType="dxTextArea"
                          ></TextArea>
                          <br />
                          <SoftBox style={{ display: "flex" }} mt={4}>
                            <SoftBox>
                              <SoftButton
                                onClick={addIT}
                                variant="contained"
                                color="info"
                                style={{
                                  backgroundColor: "#0B2F8A",
                                  boxShadow:
                                    " 0px 8px 24px -2px rgba(11, 47, 138, 0.6)",
                                  marginLeft: "20px",
                                  marginBottom: "30px",
                                }}
                              >
                                Add
                              </SoftButton>
                              <SoftButton
                                // component={Link}
                                // to="/user-dashboard"
                                onClick={handleCancel}
                                variant="contained"
                                color="info"
                                style={{
                                  backgroundColor: "#0B2F8A",
                                  boxShadow:
                                    " 0px 8px 24px -2px rgba(11, 47, 138, 0.6)",
                                  marginLeft: "30px",
                                  marginBottom: "30px",
                                }}
                              >
                                Cancel
                              </SoftButton>
                            </SoftBox>
                          </SoftBox>
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

export default ITRManual;
