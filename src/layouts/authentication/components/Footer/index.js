import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

function Footer() {
  return (
    <SoftBox component="footer" py={6}>
      <Grid container justifyContent="center">



      <Grid item xs={10} lg={8}>
      <SoftBox display="flex" justifyContent="center" flexWrap="wrap" mb={3}>
        <SoftBox mr={{ xs: 2, lg: 3, xl: 6 }}>
          <SoftTypography component="a" href="https://qitsolution.co.in/" target="_blank" variant="body2" color="secondary">
            Company
          </SoftTypography>
        </SoftBox>
        <SoftBox mr={{ xs: 2, lg: 3, xl: 6 }}>
          <SoftTypography component="a" href="https://qitsolution.co.in/about-us" target="_blank" variant="body2" color="secondary">
            About Us
          </SoftTypography>
        </SoftBox>
        <SoftBox mr={{ xs: 0, lg: 3, xl: 6 }}>
          <SoftTypography component="a" href="https://qitsolution.co.in/sap-business-one" target="_blank" variant="body2" color="secondary">
            SAP Solution
          </SoftTypography>
        </SoftBox>
        <SoftBox mr={{ xs: 2, lg: 3, xl: 6 }}>
          <SoftTypography component="a" href="https://qitsolution.co.in/digital-signature" target="_blank" variant="body2" color="secondary">
            Products
          </SoftTypography>
        </SoftBox>
        <SoftBox>
          <SoftTypography component="a" href="https://qitsolution.co.in/contact-us" target="_blank" variant="body2" color="secondary">
            Contact Us
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </Grid>

    <Grid item xs={12} lg={8}>
    <SoftBox display="flex" justifyContent="center" mt={1} mb={3}>


    <SoftTypography component="a" href="https://www.facebook.com/profile.php?id=100063825674623" target="_blank" variant="body2" color="secondary">
      <SoftBox mr={3} color="secondary">
        <FacebookIcon fontSize="small" />
      </SoftBox>
      </SoftTypography>

      <SoftTypography component="a" href="https://www.twitter.com" target="_blank" variant="body2" color="secondary">
      <SoftBox mr={3} color="secondary">
        <TwitterIcon fontSize="small" />
      </SoftBox>
      </SoftTypography>

      <SoftTypography component="a" href="https://www.instagram.com/qitsolution.co.in/" target="_blank" variant="body2" color="secondary">
      <SoftBox mr={3} color="secondary">
        <InstagramIcon fontSize="small" />
      </SoftBox>
      </SoftTypography>

      <SoftTypography component="a" href="https://in.pinterest.com/" target="_blank" variant="body2" color="secondary">

      <SoftBox mr={3} color="secondary">
        <PinterestIcon fontSize="small" />
      </SoftBox>
      </SoftTypography>

      <SoftTypography component="a" href="https://www.linkedin.com/company/quantum-it-solution/" target="_blank" variant="body2" color="secondary">
      <SoftBox color="secondary">
        <LinkedInIcon fontSize="small" />
      </SoftBox>
      </SoftTypography>



    </SoftBox>
  </Grid>

        <Grid item xs={12} lg={8}  sx={{ textAlign: "center" }}>
          <SoftTypography variant="body2" color="secondary">
            Copyright &copy; 2023 Inventory Distribution.
          </SoftTypography>
        </Grid>



      </Grid>
    </SoftBox>
  );
}

export default Footer;
