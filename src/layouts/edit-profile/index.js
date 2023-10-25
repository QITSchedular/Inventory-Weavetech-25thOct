import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import profilePic from "assets/images/profilePic.png";
import FileUploader from "devextreme-react/file-uploader";
import { useState, useEffect, useLayoutEffect } from "react";
import SoftAvatar from "components/SoftAvatar";
import Card from "@mui/material/Card";
import ValidationGroup from "devextreme-react/validation-group";
import TextBox from "devextreme-react/text-box";
import notify from "devextreme/ui/notify";
import "devextreme-react/text-area";
import "devextreme/dist/css/dx.light.css";
import { Button } from "devextreme-react/button";
import { useNavigate } from "react-router-dom";
import { Form, GroupItem } from "devextreme-react/form";
import Validator, { RequiredRule, EmailRule } from "devextreme-react/validator";
import { auth, db } from "../authentication/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Grid from "@mui/material/Grid";
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  Editing,
  Sorting,
} from "devextreme-react/data-grid";
import {
  query,
  collection,
  getDocs,
  where,
  onSnapshot,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../authentication/firebase";
import { logout } from "layouts/authentication/firebase";
//
function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userEmployeeCode, setUserEmployeeCode] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userLogoName, setUserLogoName] = useState("");
  //
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState("");
  //
  const [updatedDoc, setUpdatedDoc] = useState("");
  const [updatedKeyId, setUpdatedKeyId] = useState("");
  const [updatedDoc1, setUpdatedDoc1] = useState("");
  const [updatedKeyId1, setUpdatedKeyId1] = useState("");
  //
  const fileExtensions = [".jpg", ".jpeg", ".png"];
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
  //Get Current User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
      if (currentuser.uid.length > 0) {
        setUser(currentuser);
        setUid(currentuser.uid);
        setLoading(false);
        await fetchUserName(currentuser.uid);
        // unsub
        onSnapshot(
          collection(db, "users"),
          where("uid", "==", currentuser.uid),
          (snapShot) => {
            let list = [];
            snapShot.docs.forEach((doc) => {
              list.push({ id: doc.id, ...doc.data() });
            });
            list.filter((updatedArray) => {
              if (updatedArray.id === currentuser.uid) {
                setUsersList([updatedArray]);
              } else {
                return;
              }
            });
          },
          (error) => {
            console.log("error in fetching users", error);
          }
        );
      } else {
        console.log("no such user");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  //fetch user name
  const fetchUserName = async (id) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", id));
      const doc = await getDocs(q);
      const userDoc = doc.docs[0].data();
      //console.log("first",userDoc)
      setUser(userDoc);
      setUserName(userDoc.name);
      setUserEmail(userDoc.email);
      setUserRole(userDoc.role);
      setUserEmployeeCode(userDoc.empcode);
      setUserPhone(userDoc.phone);
      setUserLogoName(userDoc.logoName);
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
  // Update Document
  useLayoutEffect(() => {
    try {
      const updatedId = updatedKeyId;
      const addRefToDoc = doc(db, "users", updatedId);
      setDoc(
        addRefToDoc,
        {
          name: updatedDoc.name,
          phone: updatedDoc.phone,
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
  // Update Password
  useLayoutEffect(() => {
    try {
      const updatedId = updatedKeyId1;
      const addRefToDoc = doc(db, "users", updatedId);
      setDoc(
        addRefToDoc,
        {
          password: updatedDoc1.newPassword,
        },
        {
          merge: true,
        }
      );
      //set the custom empid in new collection
      const empId = userEmployeeCode;
      const addRefToDoc1 = doc(db, "empcode", empId);
      setDoc(
        addRefToDoc1,
        {
          password: updatedDoc1.newPassword,
        },
        {
          merge: true,
        }
      ).then(() => console.log("success"));
    } catch (err) {
      console.log(err);
    }
  }, [updatedKeyId1, updatedDoc1]);
  //
  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "users", uid));
      await deleteDoc(doc(db, "empcode", userEmployeeCode));
      notify(
        {
          message: "You Account is Deleted !!!",
          width: 280,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "success",
        1500
      );
      logout();
      navigate("/authentication/email-signin");
    } catch (error) {
      console.log("error in delete doc", error);
    }
  };
  // for picture
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(null);
  const imageListRef = ref(storage, "AllBGImages");
  //
  const handleImageChange = (e) => {
    if (e.value[0]) {
      setImage(e.value[0]);
    }
  };
  // for picture
  const handleSubmitBG = () => {
    const imageRef = ref(storage, `AllBGImages/BGImageof${userEmail}`);
    uploadBytes(imageRef, image)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            setUrl(url);
            notify(
              {
                message: "Image upload Successful....",
                width: 280,
                shading: true,
                position: "bottom center",
                direction: "up-push",
              },
              "success",
              1500
            );
          })
          .catch((error) => {
            console.log("error getting the image url", error.message);
          });
        setImage(null);
      })
      .catch((error) => {
        console.log("Error in Image upload", error.message);
      });
  };
  //
  useEffect(() => {
    listAll(imageListRef)
      .then((response) => {
        const ImageArray = response.items;
        let filterFunction = ImageArray.filter((element) => {
          let Path = element._location.path;
          setLoading(false);
          if (Path === `AllBGImages/BGImageof${userEmail}`) {
            getDownloadURL(element).then((url) => {
              setUrl(url);
            });
            return Path;
          }
        });
      })
      .catch((error) => {
        console.log("error in ImageDownloadUseEffect1", error);
      });
  }, [userEmail, url]);
  //
  const SeePicture = () => {
    window.open(`${url}`, "_blank");
  };
  //
  return loading ? (
    <PageLoader1 />
  ) : userRole === "User" || userRole === "Admin" || userRole === "Manager" ? (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3} mb={15}>
        <SoftBox mb={6} mt={6}>
          <SoftTypography
            textAlign="center"
            mt={2}
            style={{
              color: "#0B2F8A",
              fontWeight: "700",
              fontSize: "25px",
              lineHeight: "20px",
            }}
          ></SoftTypography>
        </SoftBox>
        <Card
          sx={{
            backdropFilter: `saturate(200%) blur(30px)`,
            backgroundColor: ({ functions: { rgba }, palette: { white } }) =>
              rgba(white.main, 0.8),
            boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
            position: "relative",
            mt: -8,
            mx: 3,
            py: 2,
            px: 2,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <SoftAvatar
                src={profilePic}
                alt="profile-image"
                variant="rounded"
                size="xl"
                shadow="sm"
              />
            </Grid>
            <Grid item>
              <SoftBox height="100%" mt={0.5} lineHeight={1}>
                <SoftTypography variant="h5" fontWeight="medium">
                  {userName}
                </SoftTypography>
                <SoftTypography
                  variant="button"
                  color="text"
                  fontWeight="medium"
                >
                  {userEmail} -
                </SoftTypography>
                <SoftTypography
                  variant="button"
                  color="text"
                  fontWeight="medium"
                >
                  - ({userRole}) -- ({userEmployeeCode})
                </SoftTypography>
              </SoftBox>
            </Grid>
          </Grid>
        </Card>
        {/* Headings */}
        <SoftBox mb={4} mt={6}>
          <SoftTypography
            textAlign="center"
            mt={2}
            style={{
              color: "#0B2F8A",
              fontWeight: "700",
              fontSize: "25px",
              lineHeight: "20px",
            }}
          >
            Edit Your Profile
          </SoftTypography>
        </SoftBox>
        {/* Second component */}
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
                  // console.log('e.data', e.data)
                  setUpdatedKeyId(e.key);
                  //console.log('e.key', e.key)
                }}
                columnAutoWidth={true}
              >
                <Editing mode="popup" allowUpdating={true} useIcons={true} />
                <Scrolling columnRenderingMode="virtual"></Scrolling>
                <Paging defaultPageSize={8} />
                <Sorting mode="multiple" />
                <Column
                  dataField="id"
                  caption="Id"
                  alignment="center"
                  allowEditing={false}
                  visible={false}
                />
                <Column
                  dataField="name"
                  caption="Full Name"
                  alignment="center"
                />
                <Column
                  dataField="phone"
                  caption="Phone Number"
                  alignment="center"
                />
                <Column
                  dataField="logoName"
                  caption="Logo Name"
                  alignment="center"
                />
              </DataGrid>
            </SoftBox>
          </Card>
        </SoftBox>
        {/* Headings */}
        <SoftBox mb={4} mt={6}>
          <SoftTypography
            textAlign="center"
            mt={2}
            style={{
              color: "#0B2F8A",
              fontWeight: "700",
              fontSize: "25px",
              lineHeight: "20px",
            }}
          >
            Reset Password
          </SoftTypography>
        </SoftBox>
        {/* Second component */}
        <SoftBox ml={2} mr={2} mb={6} mt={0}>
          <Card>
            <SoftBox ml={4} mr={4} mb={4} mt={4}>
              <DataGrid
                dataSource={usersList}
                keyExpr="id"
                showBorders={true}
                allowColumnResizing={true}
                onRowUpdated={(e) => {
                  setUpdatedDoc1(e.data);
                  //console.log('e.data', e.data)
                  setUpdatedKeyId1(e.key);
                  // console.log('e.key', e.key)
                }}
                columnAutoWidth={true}
              >
                <Editing mode="popup" allowUpdating={true} useIcons={true} />
                <Scrolling columnRenderingMode="virtual"></Scrolling>
                <Paging defaultPageSize={8} />
                <Sorting mode="multiple" />
                <Column
                  dataField="id"
                  caption="Id"
                  alignment="center"
                  allowEditing={false}
                  visible={false}
                />
                <Column
                  dataField="email"
                  caption="Email"
                  alignment="center"
                  allowEditing={false}
                />
                <Column
                  dataField="password"
                  caption="Old Password"
                  alignment="center"
                  allowEditing={false}
                  visible={false}
                />
                <Column
                  dataField="newPassword"
                  caption="New Password"
                  alignment="center"
                />
              </DataGrid>
            </SoftBox>
          </Card>
        </SoftBox>
        {/* Headings */}
        <SoftBox mb={4} mt={6}>
          <SoftTypography
            textAlign="center"
            mt={2}
            style={{
              color: "#0B2F8A",
              fontWeight: "700",
              fontSize: "25px",
              lineHeight: "20px",
            }}
          >
            Upload BG Image
          </SoftTypography>
        </SoftBox>
        {/* BG Image */}
        <SoftBox ml={2} mr={2} mb={6} mt={6}>
          <Card>
            <SoftBox textAlign="center" mt={2} mb={4} ml={3} mr={3}>
              <ValidationGroup>
                <Form colCount={1} labelMode="floating" labelLocation="left">
                  <GroupItem>
                    <FileUploader
                      selectButtonText="Select photo"
                      multiple={true}
                      //uploadUrl={url}
                      labelText="Upload your Image Here"
                      accept="image/*"
                      allowedFileExtensions={fileExtensions}
                      maxFileSize={4000000}
                      uploadMode="useForm"
                      //uploadMode="instantly"
                      // uploadMode="useButtons"
                      onValueChanged={handleImageChange}
                    />
                    <span
                      style={{
                        color: "#484848",
                        display: "block",
                        fontWeight: "700",
                        display: "block",
                        marginBottom: "10px",
                        //marginLeft: "9px",
                        //float: "left",
                      }}
                    >
                      {"Specifications"}
                    </span>
                    <span
                      style={{
                        color: "#484848",
                        display: "block",
                        //marginLeft: "9px",
                        //float: "left",
                      }}
                    >
                      {"Allowed Extensions: "}
                      <span style={{ fontWeight: "700" }}>
                        .jpg, .jpeg, .png
                      </span>
                    </span>
                    <span
                      style={{
                        color: "#484848",
                        display: "block",
                        //marginLeft: "-400px",
                        //float: "left",
                        marginBottom: "20px",
                      }}
                    >
                      {"Maximum Size: "}
                      <span style={{ fontWeight: "700", marginBottom: "20px" }}>
                        4 MB (830x1200 px)
                      </span>
                    </span>
                    <Button
                      width={220}
                      text="Previously uploaded picture"
                      type="normal"
                      stylingMode="contained"
                      onClick={SeePicture}
                    />
                    <br></br>
                  </GroupItem>
                </Form>
              </ValidationGroup>
            </SoftBox>
          </Card>
        </SoftBox>
        {/* Button */}
        <SoftBox mt={6}>
          <SoftTypography textAlign="center">
            <SoftButton
              variant="contained"
              color="info"
              style={{
                backgroundColor: "#0B2F8A",
                boxShadow: " 0px 8px 24px -2px rgba(11, 47, 138, 0.6)",
              }}
              onClick={handleSubmitBG}
            >
              Click Here to Upload
            </SoftButton>
          </SoftTypography>
        </SoftBox>
        {/* Headings */}
        <SoftBox mb={4} mt={8}>
          <SoftTypography
            textAlign="center"
            mt={2}
            style={{
              color: "#0B2F8A",
              fontWeight: "700",
              fontSize: "25px",
              lineHeight: "20px",
            }}
          >
            Delete Account
          </SoftTypography>
        </SoftBox>
        <SoftBox ml={2} mr={2} mb={6} mt={6}>
          <Card>
            <SoftBox textAlign="center" mt={4} mb={4} ml={4} mr={4}>
              <ValidationGroup>
                <Form colCount={1} labelMode="floating" labelLocation="left">
                  <GroupItem>
                    <TextBox
                      label="Email Address"
                      labelMode="floating"
                      value={userEmail}
                      readOnly={true}
                      height={40}
                    >
                      <Validator>
                        <RequiredRule message="Email is required" />
                        <EmailRule message="Email Format is invalid" />
                      </Validator>
                    </TextBox>
                    <br />
                  </GroupItem>
                  <GroupItem></GroupItem>
                </Form>
              </ValidationGroup>
            </SoftBox>
          </Card>
        </SoftBox>
        <SoftBox mt={6}>
          <SoftTypography textAlign="center">
            <SoftButton
              variant="contained"
              color="info"
              style={{
                backgroundColor: "#0B2F8A",
                boxShadow: " 0px 8px 24px -2px rgba(11, 47, 138, 0.6)",
              }}
              onClick={handleDelete}
            >
              Delete Account
            </SoftButton>
          </SoftTypography>
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

export default EditProfile;
