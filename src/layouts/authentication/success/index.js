import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import curved9 from "assets/images/curved-images/curved-6.jpg";
import Card from "@mui/material/Card";
import { signOut } from "firebase/auth";
//
function SuccessGif() {
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    if (loading) return;
    if (user) {
      signOut(auth);
    }
  }, [user, loading]);

  return (
    <CoverLayout title="Verify OTP" image={curved9}>
      <SoftBox component="" role="">
        <SoftBox mb={0}>
          <Card>
            <SoftBox mt={0} mb={0} ml={0}>
              <img
                src={require("assets/images/success-gif.gif")}
                className="appSuccess"
                alt="successImage"
                width={300}
                height={300}
              />
            </SoftBox>
          </Card>
          <SoftBox>
            <SoftBox mt={1} mb={1} textAlign="center">
              <SoftTypography
                variant="h3"
                fontWeight="bold"
                style={{ color: "#50C878" }}
              >
                Success !!!
              </SoftTypography>
            </SoftBox>
            <SoftBox mt={3} mb={1} textAlign="center">
              <SoftTypography variant="h6" style={{ color: "grey" }}>
                Your account has been created.
              </SoftTypography>
            </SoftBox>
          </SoftBox>

          <SoftBox mt={4} mb={1} textAlign="center">
            <SoftButton
              fullWidth
              style={{
                backgroundColor: "#0B2F8A",
                color: "white",
                boxShadow: "0px 8px 24px -2px rgba(11, 47, 138, 0.6)",
                borderRadius: "16px",
              }}
              //onClick={logout}
              component={Link}
              to="/authentication/email-signin"
            >
              Continue
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </CoverLayout>
  );
}

export default SuccessGif;
