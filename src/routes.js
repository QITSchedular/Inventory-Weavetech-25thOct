import UserDashboard from "layouts/user-dashboard";
import QRSignIn from "layouts/authentication/qr-signin";
import SignUp from "layouts/authentication/sign-up";
import Faq from "layouts/authentication/faq";
import ForgotPassword from "layouts/authentication/forgot-password";
import SuccessGif from "layouts/authentication/success";
import Shop from "examples/Icons/Shop";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import ProductionOrder from "layouts/Production-Order";
import GoodsReceipt from "layouts/Goods-Receipt";
import ITRManual from "layouts/ITR-Manual";
import InventoryTransferRequest from "layouts/ITR-to-IT";
import InventoryTransfer from "layouts/inventory-transfer";
import Reports from "layouts/reports";
import ReportsITRPrintLayout from "layouts/Reports-ITR-Print-Layout";
import ReportsITRBarCode from "layouts/Reports-ITR-BarCode";
import ReportsITLayout from "layouts/Reports-IT-Layout";
import ReportsIssueDeliveryChallan from "layouts/Reports-Issue-Delivery-Challan";
import EditProfile from "layouts/edit-profile";
import UserAuthContextProvider from "layouts/context/user-auth";
import SignEmail from "layouts/authentication/email-signin";
import Help from "layouts/help";
import WeaveTechUsers from "layouts/weavetech-users";
import LogStatus from "layouts/log-status";
import LogStatusAddITRLog from "layouts/log-status-addITRLog";
import LogStatusAPILog from "layouts/log-status-apiLog";
import LogStatusFilterLog from "layouts/log-status-filterLog";

const routes = [
  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "collapse",
    name: "User Dashboard",
    key: "user-dashboard",
    route: "/user-dashboard",
    icon: <Shop size="12px" />,
    component: <UserDashboard />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "WeaveTech Users",
    key: "WeaveTech Users",
    route: "/weavetech-users",
    icon: <SpaceShip size="12px" />,
    component: <WeaveTechUsers />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Log Status",
    key: "Log Status",
    route: "/log-status",
    icon: <SpaceShip size="12px" />,
    component: <LogStatus />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Log Status",
    key: "Log Status",
    route: "/log-status-addITRLog",
    icon: <SpaceShip size="12px" />,
    component: <LogStatusAddITRLog />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Log Status",
    key: "Log Status",
    route: "/log-status-apiLog",
    icon: <SpaceShip size="12px" />,
    component: <LogStatusAPILog />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Log Status",
    key: "Log Status",
    route: "/log-status-filterLog",
    icon: <SpaceShip size="12px" />,
    component: <LogStatusFilterLog />,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "QR Sign In",
    key: "QR sign-in",
    route: "/authentication/qr-signin",
    icon: <Document size="12px" />,
    component: <QRSignIn />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    icon: <SpaceShip size="12px" />,
    component: <SignUp />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Faq",
    key: "Faq",
    route: "/authentication/faq",
    icon: <SpaceShip size="12px" />,
    component: <Faq />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Forgot Password",
    key: "forgot-password",
    route: "/authentication/forgot-password",
    icon: <SpaceShip size="12px" />,
    component: <ForgotPassword />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Success",
    key: "Success",
    route: "/authentication/success",
    icon: <SpaceShip size="12px" />,
    component: <SuccessGif />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reports",
    route: "/reports",
    icon: <SpaceShip size="12px" />,
    component: <Reports />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "ReportsITRPrintLayout",
    key: "Reports-ITR-Print-Layout",
    route: "/Reports-ITR-Print-Layout",
    icon: <SpaceShip size="12px" />,
    component: <ReportsITRPrintLayout />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "ReportsITRBarCode",
    key: "Reports-ITR-BarCode",
    route: "/Reports-ITR-BarCode",
    icon: <SpaceShip size="12px" />,
    component: <ReportsITRBarCode />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "ReportsITLayout",
    key: "Reports-IT-Layout",
    route: "/Reports-IT-Layout",
    icon: <SpaceShip size="12px" />,
    component: <ReportsITLayout />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "ReportsIssueDeliveryChallan",
    key: "Reports-Issue-Delivery-Challan",
    route: "/Reports-Issue-Delivery-Challan",
    icon: <SpaceShip size="12px" />,
    component: <ReportsIssueDeliveryChallan />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "ProductionOrder",
    key: "Production-Order",
    route: "/Production-Order",
    icon: <SpaceShip size="12px" />,
    component: <ProductionOrder />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "GoodsReceipt",
    key: "Goods-Receipt",
    route: "/Goods-Receipt",
    icon: <SpaceShip size="12px" />,
    component: <GoodsReceipt />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "InventoryTransferRequest",
    key: "ITR-to-IT",
    route: "/ITR-to-IT",
    icon: <SpaceShip size="12px" />,
    component: <InventoryTransferRequest />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "ITRManual",
    key: "ITR-Manual",
    route: "/ITR-Manual",
    icon: <SpaceShip size="12px" />,
    component: <ITRManual />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "InventoryTransfer",
    key: "inventory-transfer",
    route: "/inventory-transfer",
    icon: <SpaceShip size="12px" />,
    component: <InventoryTransfer />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "EditProfile",
    key: "edit-profile",
    route: "/edit-profile",
    icon: <SpaceShip size="12px" />,
    component: <EditProfile />,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "user-auth",
    key: "user-auth",
    route: "/user-auth",
    icon: <SpaceShip size="12px" />,
    component: <UserAuthContextProvider />,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "email-signin",
    key: "email-signin",
    route: "/authentication/email-signin",
    icon: <SpaceShip size="12px" />,
    component: <SignEmail />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "help",
    key: "help",
    route: "/help",
    icon: <SpaceShip size="12px" />,
    component: <Help />,
    noCollapse: true,
  },
  // {
  //   type: "collapse",
  //   name: "MyUrl",
  //   key: "MyUrl",
  //   route: "/myURL",
  //   icon: <SpaceShip size="12px" />,
  //   component: <MyUrl />,
  //   noCollapse: true,
  // },
];

export default routes;
