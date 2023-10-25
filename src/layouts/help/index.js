import Grid from '@mui/material/Grid'
import SoftBox from 'components/SoftBox'
import SoftTypography from 'components/SoftTypography'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import Footer from 'examples/Footer'
import React from 'react'
import 'devextreme/dist/css/dx.light.css'
import { Accordion, Item } from 'devextreme-react/accordion'
//
function Help () {
  const p = {
    display: 'block',
    fontSize: '16px',
    color: 'grey',
    fontFamily: 'Inter',
    letterSpacing: 1,
    marginBottom: '30px'
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3} mb={15}>
        <Grid container style={{ paddingLeft: '50px', paddingRight: '50px' }}>
          <SoftBox mt={3} mb={4}>
            <SoftTypography
              style={{
                fontSize: '24px',
                color: '#0B2F8A',
                letterSpacing: 1,
                fontFamily: 'Arial',
                marginBottom: '20px'
              }}
            >
              <strong>Introduction</strong>
            </SoftTypography>
            <SoftTypography style={p} mt={2}>
              Inventory Distribution System is an online software application
              which fulfills the requirement of a typical stock analysis in
              various warehouses.
            </SoftTypography>
            <SoftTypography
              style={{
                fontSize: '20px',
                color: '#0B2F8A',
                letterSpacing: 1,
                fontFamily: 'Arial',
                marginBottom: '20px'
              }}
            >
              <strong>Frequently asked Questions</strong>
            </SoftTypography>

            <SoftTypography style={p} mt={2}>
              <Accordion
                collapsible={true}
                multiple={true}
                animationDuration='450'
              >
                <Item title='Purpose'>
                  <span>
                    {' '}
                    1. Its main purpose is to define & track all the activities
                    & operations in the system, & provide an efficient interface
                    to user & admin for managing inventory. <br></br> 2. The aim
                    of this application is to reduce the manual effort needed to
                    manage transactions & historical data used in various
                    warehouses.
                  </span>
                </Item>
                <Item title='Main Menu Components'>
                  <span>
                    After Logged In, User has to select the functionality as per
                    his requirement. <br></br>
                    <br></br>1. Production Order List <br></br> It defines which
                    material is processed, at which location, at what time & how
                    much quantity is required. <br></br>
                    <br></br>2. Goods Receipt Note
                    <br></br> Is a document that acknowledges the delivery of
                    goods to a customer by a supplier. <br></br> <br></br>
                    3. ITR Manual
                    <br></br> It is an internal request amongst your company to
                    send items from one warehouse to another.<br></br> It
                    updates ordered & available quantity in the target
                    warehouse.
                    <br></br>
                    <br></br> 4. Inventory Transfer Request <br></br> It Shows
                    all the requested lists of Inventory Transfer.<br></br>{' '}
                    <br></br>
                    5. Inventory Transfer<br></br> It Shows all the approved
                    lists of Inventory Transfer. <br></br>
                    <br></br>6. Reports
                    <br></br> Description SAP Report is an executable program
                    that reads the information in the database & produces output
                    based on the filter criteria chosen from end user.
                  </span>
                </Item>
                <Item title='Production Order List'>
                  <span>
                    {' '}
                    It defines which material is processed, at which location,
                    at what time & how much quantity is required. <br></br>
                    <a
                      href='https://help.sap.com/docs/SAP_BUSINESS_ONE/68a2e87fb29941b5bf959a184d9c6727/44f29329df7365fbe10000000a1553f7.html?q=production%20order'
                      target='_blank'
                    >
                      Learn More...
                    </a>
                  </span>
                </Item>
                <Item title='Goods Receipt Note'>
                  <span>
                    Is a document that acknowledges the delivery of goods to a
                    customer by a supplier.<br></br>User should enter all the
                    required input fields <br></br>
                    <a
                      href='https://help.sap.com/docs/SAP_BUSINESS_ONE/68a2e87fb29941b5bf959a184d9c6727/452366249e152b31e10000000a1553f7.html?q=goods%20receipt'
                      target='_blank'
                    >
                      Learn More...
                    </a>
                  </span>
                </Item>
                <Item title='ITR Manual'>
                  <span>
                    {' '}
                    It is an internal request amongst your company to send items
                    from one warehouse to another. <br></br>
                    It updates ordered & available quantity in the target
                    warehouse. <br></br>
                    <a
                      href='https://help.sap.com/docs/SAP_BUSINESS_ONE/68a2e87fb29941b5bf959a184d9c6727/159181bbb97e4e509caa6a23adcbd571.html?q=Inventory%20Transfer%20Request'
                      target='_blank'
                    >
                      Learn More...
                    </a>
                  </span>
                </Item>
                <Item title='Inventory Transfer Request'>
                  <span>
                    It Shows all the requested lists of Inventory Transfer.
                    <br></br>User should enter all the required input fields{' '}
                    <br></br>
                    <a
                      href='https://help.sap.com/docs/SAP_BUSINESS_ONE/68a2e87fb29941b5bf959a184d9c6727/159181bbb97e4e509caa6a23adcbd571.html?q=Inventory%20Transfer%20Request'
                      target='_blank'
                    >
                      Learn More...
                    </a>
                  </span>
                </Item>
                <Item title='Inventory Transfer'>
                  <span>
                    It Shows all the approved lists of Inventory Transfer.{' '}
                    <br></br>
                    <a
                      href='https://help.sap.com/docs/SAP_BUSINESS_ONE/68a2e87fb29941b5bf959a184d9c6727/452364ea9e152b31e10000000a1553f7.html?q=Inventory%20Transfer'
                      target='_blank'
                    >
                      Learn More...
                    </a>
                  </span>
                </Item>
                <Item title='Reports'>
                  <span>
                    SAP Reports are executable program that reads the
                    information in the database & produces output based on the
                    filter criteria chosen from end user.<br></br>
                    Crystal Reports are not directly created in web, we should
                    use an API that converts reports to binary format.<br></br>
                    <a
                      href='https://help.sap.com/docs/SAP_BUSINESS_ONE/68a2e87fb29941b5bf959a184d9c6727/4509428565e16c32e10000000a114a6b.html?q=Reports'
                      target='_blank'
                    >
                      Learn More...
                    </a>
                  </span>
                </Item>
              </Accordion>
            </SoftTypography>
          </SoftBox>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  )
}

export default Help
