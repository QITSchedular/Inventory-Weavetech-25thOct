import React from "react";
import "devextreme/dist/css/dx.light.css";
import { Accordion, Item } from "devextreme-react/accordion";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import curved9 from "assets/images/curved-images/curved-6.jpg";
//
function Faq() {
  return (
    <CoverLayout title="Verify OTP" image={curved9}>
      <Accordion
        collapsible={true}
        //multiple={true}
        animationDuration="450"
      >
        <Item title="Introduction">
          <span>
            {" "}
            The main purpose of this application is to reduce the manual effort
            needed to manage transactions & historical data used in various
            warehouses.
          </span>
        </Item>
        <Item title="Production Order List">
          <span>
            {" "}
            It defines which material is processed, at which location, at what
            time & how much quantity is required.
          </span>
          <br></br>
          <a
            href="https://help.sap.com/docs/SAP_BUSINESS_ONE/68a2e87fb29941b5bf959a184d9c6727/44f29329df7365fbe10000000a1553f7.html?q=production%20order"
            target="_blank"
          >
            Learn More...
          </a>
        </Item>
        <Item title="Goods Receipt Note">
          <span>
            Is a document that acknowledges the delivery of goods to a customer
            by a supplier.
          </span>
          <br></br>
          <a
            href="https://help.sap.com/docs/SAP_BUSINESS_ONE/68a2e87fb29941b5bf959a184d9c6727/452366249e152b31e10000000a1553f7.html?q=goods%20receipt"
            target="_blank"
          >
            Learn More...
          </a>
        </Item>
        <Item title="ITR Manual">
          <span>
            {" "}
            It is an internal request amongst your company to send items from
            one warehouse to another. <br></br>It updates ordered & available
            quantity in the target warehouse.
          </span>
          <br></br>
          <a
            href="https://help.sap.com/docs/SAP_BUSINESS_ONE/68a2e87fb29941b5bf959a184d9c6727/159181bbb97e4e509caa6a23adcbd571.html?q=Inventory%20Transfer%20Request"
            target="_blank"
          >
            Learn More...
          </a>
        </Item>
        <Item title="Inventory Transfer Request">
          <span>
            It Shows all the requested lists of Inventory Transfer.
            <br></br>User should enter all the required input fields.
            <br></br>
            <a
              href="https://help.sap.com/docs/SAP_BUSINESS_ONE/68a2e87fb29941b5bf959a184d9c6727/159181bbb97e4e509caa6a23adcbd571.html?q=Inventory%20Transfer%20Request"
              target="_blank"
            >
              Learn More...
            </a>
          </span>
        </Item>
        <Item title="Inventory Transfer">
          <span>
            It Shows all the approved lists of Inventory Transfer. User should
            enter all the required input fields.
          </span>
          <br></br>
          <a
            href="https://help.sap.com/docs/SAP_BUSINESS_ONE/68a2e87fb29941b5bf959a184d9c6727/452364ea9e152b31e10000000a1553f7.html?q=Inventory%20Transfer"
            target="_blank"
          >
            Learn More...
          </a>
        </Item>
        <Item title="Reports">
          <span>
            SAP Reports are executable program that reads the information in the
            database & produces output based on the filter criteria chosen from
            end user.
            <br></br>
            <a
              href="https://help.sap.com/docs/SAP_BUSINESS_ONE/68a2e87fb29941b5bf959a184d9c6727/4509428565e16c32e10000000a114a6b.html?q=Reports"
              target="_blank"
            >
              Learn More...
            </a>
          </span>
        </Item>
      </Accordion>
    </CoverLayout>
  );
}

export default Faq;
