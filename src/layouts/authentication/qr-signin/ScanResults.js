import React from "react";

const ScanResults = ({ data }) => {
  console.log(data);
  let total = 0;
  return (
    <div className="table-responsive mt-5">
      <table className="table  table-bordered">
        <thead className="table-dark">
          <tr>
            <th>S.NO</th>
            <th>empcode</th>
          </tr>
        </thead>
        <tbody className="table-striped">
          {data.map((result, index) => {
            total += parseFloat(result.price);
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{result.empcode}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="table-secondary">
          <tr>
            <th colSpan="3" className="text-start">
              {" "}
              Grand Total
            </th>
            <td>{total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ScanResults;
