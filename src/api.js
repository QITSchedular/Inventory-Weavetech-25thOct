import axios from "axios";
import notify from "devextreme/ui/notify";

export const BACKEND_URL = "https://weavetech.onthecloud.in:9090";

export const WarehouseAPI = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/Warehouses/N`);
    if (response.data === "") {
      notify(
        {
          message: "Sorry...!!! There is Server error.",
          width: 280,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        2500
      );
    } else {
      return response.data;
    }
  } catch (error) {
    console.log("Inside Catch Block WHS", error);
    notify(
      {
        message:
          "Server Error in Warehouse API. Please try again after Sometime....",
        width: 550,
        shading: true,
        position: "bottom center",
        direction: "up-push",
      },
      "error",
      1000
    );
  }
};
export const SeriesAPI = async (moduleName) => {
  try {
    let moduleCode = "";
    if (moduleName.module === "Production Order") {
      moduleCode = 202;
    }
    if (moduleName.module === "Goods Receipt") {
      moduleCode = 59;
    }
    if (moduleName.module === "ITR Manual" || moduleName.module === "ITR") {
      moduleCode = 1250000001;
    }
    if (moduleName.module === "Issue D Challan") {
      moduleCode = 67;
    }
    const response = await axios.get(
      `${BACKEND_URL}/api/Seriess/GetSeriesByObject/${moduleCode}`
    );
    if (response.data === "") {
      notify(
        {
          message: "Sorry...!!! There is Server error.",
          width: 280,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        2500
      );
    } else {
      return response.data;
    }
  } catch (error) {
    console.log("Inside Catch Block WHS", error);
    notify(
      {
        message:
          "Server Error in Warehouse API. Please try again after Sometime....",
        width: 550,
        shading: true,
        position: "bottom center",
        direction: "up-push",
      },
      "error",
      1000
    );
  }
};
export const VendorAPI = async () => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/BusinessPartners/GetBusinessPartnerByType/S`
    );
    if (response.data === "") {
      notify(
        {
          message: "Sorry...!!! There is Server error.",
          width: 280,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        2500
      );
    } else {
      return response.data;
    }
  } catch (error) {
    console.log("Inside Catch Block WHS", error);
    notify(
      {
        message:
          "Server Error in Warehouse API. Please try again after Sometime....",
        width: 550,
        shading: true,
        position: "bottom center",
        direction: "up-push",
      },
      "error",
      1000
    );
  }
};
//Filter API
export const PrdFilterAPI = async () => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/BusinessPartners/GetBusinessPartnerByType/S`
    );
    if (response.data === "") {
      notify(
        {
          message: "Sorry...!!! There is Server error.",
          width: 280,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        2500
      );
    } else {
      return response.data;
    }
  } catch (error) {
    console.log("Inside Catch Block WHS", error);
    notify(
      {
        message:
          "Server Error in Warehouse API. Please try again after Sometime....",
        width: 550,
        shading: true,
        position: "bottom center",
        direction: "up-push",
      },
      "error",
      1000
    );
  }
};
export const GRNFilterAPI = async () => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/BusinessPartners/GetBusinessPartnerByType/S`
    );
    if (response.data === "") {
      notify(
        {
          message: "Sorry...!!! There is Server error.",
          width: 280,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        2500
      );
    } else {
      return response.data;
    }
  } catch (error) {
    console.log("Inside Catch Block WHS", error);
    notify(
      {
        message:
          "Server Error in Warehouse API. Please try again after Sometime....",
        width: 550,
        shading: true,
        position: "bottom center",
        direction: "up-push",
      },
      "error",
      1000
    );
  }
};
export const ITRFilterAPI = async () => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/BusinessPartners/GetBusinessPartnerByType/S`
    );
    if (response.data === "") {
      notify(
        {
          message: "Sorry...!!! There is Server error.",
          width: 280,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        2500
      );
    } else {
      return response.data;
    }
  } catch (error) {
    console.log("Inside Catch Block WHS", error);
    notify(
      {
        message:
          "Server Error in Warehouse API. Please try again after Sometime....",
        width: 550,
        shading: true,
        position: "bottom center",
        direction: "up-push",
      },
      "error",
      1000
    );
  }
};
//Add ITR API
export const AddITRPrdAPI = async () => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/BusinessPartners/GetBusinessPartnerByType/S`
    );
    if (response.data === "") {
      notify(
        {
          message: "Sorry...!!! There is Server error.",
          width: 280,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        2500
      );
    } else {
      return response.data;
    }
  } catch (error) {
    console.log("Inside Catch Block WHS", error);
    notify(
      {
        message:
          "Server Error in Warehouse API. Please try again after Sometime....",
        width: 550,
        shading: true,
        position: "bottom center",
        direction: "up-push",
      },
      "error",
      1000
    );
  }
};
export const AddITRGrnAPI = async () => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/BusinessPartners/GetBusinessPartnerByType/S`
    );
    if (response.data === "") {
      notify(
        {
          message: "Sorry...!!! There is Server error.",
          width: 280,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        2500
      );
    } else {
      return response.data;
    }
  } catch (error) {
    console.log("Inside Catch Block WHS", error);
    notify(
      {
        message:
          "Server Error in Warehouse API. Please try again after Sometime....",
        width: 550,
        shading: true,
        position: "bottom center",
        direction: "up-push",
      },
      "error",
      1000
    );
  }
};
export const AddITRManualAPI = async () => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/BusinessPartners/GetBusinessPartnerByType/S`
    );
    if (response.data === "") {
      notify(
        {
          message: "Sorry...!!! There is Server error.",
          width: 280,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        2500
      );
    } else {
      return response.data;
    }
  } catch (error) {
    console.log("Inside Catch Block WHS", error);
    notify(
      {
        message:
          "Server Error in Warehouse API. Please try again after Sometime....",
        width: 550,
        shading: true,
        position: "bottom center",
        direction: "up-push",
      },
      "error",
      1000
    );
  }
};
export const AddITRtoITAPI = async () => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/BusinessPartners/GetBusinessPartnerByType/S`
    );
    if (response.data === "") {
      notify(
        {
          message: "Sorry...!!! There is Server error.",
          width: 280,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        2500
      );
    } else {
      return response.data;
    }
  } catch (error) {
    console.log("Inside Catch Block WHS", error);
    notify(
      {
        message:
          "Server Error in Warehouse API. Please try again after Sometime....",
        width: 550,
        shading: true,
        position: "bottom center",
        direction: "up-push",
      },
      "error",
      1000
    );
  }
};
//Log APIs
export const FilterLogAPI = async () => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/BusinessPartners/GetBusinessPartnerByType/S`
    );
    if (response.data === "") {
      notify(
        {
          message: "Sorry...!!! There is Server error.",
          width: 280,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        2500
      );
    } else {
      return response.data;
    }
  } catch (error) {
    console.log("Inside Catch Block WHS", error);
    notify(
      {
        message:
          "Server Error in Warehouse API. Please try again after Sometime....",
        width: 550,
        shading: true,
        position: "bottom center",
        direction: "up-push",
      },
      "error",
      1000
    );
  }
};
export const AddITRLogAPI = async () => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/BusinessPartners/GetBusinessPartnerByType/S`
    );
    if (response.data === "") {
      notify(
        {
          message: "Sorry...!!! There is Server error.",
          width: 280,
          shading: true,
          position: "bottom center",
          direction: "up-push",
        },
        "error",
        2500
      );
    } else {
      return response.data;
    }
  } catch (error) {
    console.log("Inside Catch Block WHS", error);
    notify(
      {
        message:
          "Server Error in Warehouse API. Please try again after Sometime....",
        width: 550,
        shading: true,
        position: "bottom center",
        direction: "up-push",
      },
      "error",
      1000
    );
  }
};
