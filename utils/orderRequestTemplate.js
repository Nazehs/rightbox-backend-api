const newOrderRequestTemplate = (order) => {
  console.log(order);
  const emailTemplate = `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:v="urn:schemas-microsoft-com:vml">

<head>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
  <meta content="width=device-width" name="viewport" />
  <meta content="IE=edge" http-equiv="X-UA-Compatible" />
  <style>
      body {
          font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;
      }

      p {
          color: #2F3B59;
      }

      table {
          table-layout: fixed;
          vertical-align: top;
          min-width: 320px;
          Margin: 0 auto;
          border-spacing: 0;
          border-collapse: collapse;
          --mso-table-lspace: 0pt;
          --mso-table-rspace: 0pt;
          width: 100%;
      }
  </style>
  <title></title>
</head>
<body>
  Hi Tom/Axl, Kindly find the below new order request.
  <br />
  <br />
  <h4>
      Order Details:
  </h4>
  <table cellpadding="0" cellspacing="0" role="presentation">
      <tbody>
          ${order.items
            .map(
              (item) => `<tr>
              <td>
                  <p>
                      <b> Product name:</b> ${item.name}
                  </p>
                  <p>
                  <b> Product code:</b> ${item.code}
              </p>
                  <p>
                      <b> Quantity:</b> ${item.estimatedQuantity}
                  </p>
                  <p>
                      <b> Box width</b>: ${item?.width}
                  </p>
                  <p>
                      <b> Box Height</b>: ${item.height}
                  </p>
                  <p>
                      <b>Box length:</b> ${item.length}
                  </p>
                  <p>
                      <b> Box Optics</b>: ${item.boxOptics}
                  </p>
                  <p>
                      <b> Numbers of colors</b>: ${item.name}
                  </p>
                  <p>
                      <b> Estimated Annual Boxes </b> : ${item.estimatedBoxes}
                  </p>
                  <p>
                      <b> Order Number</b>: ${order.orderNumber}
                  </p>
                  <p>
                      <b> Board Grade</b>: ${item.boardgrade}
                  </p>
                  <p>
                      <b> Average Weight</b>: ${item.averageweight}
                  </p>
                  <p>
                      <b> Print type</b>: ${item.printType}
                  </p>
                  <p>
                      <b> supplier Can Suggest</b>: ${
                        item.supplierCanSuggest ? "Yes" : "No"
                      }
                  </p>
                  <p>
                      <b> precise Box Needed</b>: ${
                        item.preciseBoxNeeded ? "Yes" : "No"
                      }
                  </p>
                  <p>
                      <b> numberOfColours</b>: ${item.numberOfColours}
                  </p>
                  <p>
                      <b> suggestPrintType</b>: ${
                        item.suggestPrintType ? "Yes" : "No"
                      }
                  </p>
                  <p>
                      <b> is stacked product</b>: ${
                        item.isStackedProduct ? "Yes" : "No"
                      }
                  </p>
                  <hr />
              </td>
          </tr>`
            )
            .join("")}
          <tr>
              <td>
                  <p>
                      <b>Full Name</b>: ${order.fullName}
                  </p>
                  <p>
                      <b>
                          User Address
                      </b> : ${order.userAddress}
                  </p>
                  <p>
                      <b> email</b>: ${order.email}
                  </p>
                  <p>
                      <b> Company Sector</b>: ${order.companySector}
                  </p>
                  <p>
                      <b> Post Code</b>: ${order.postCode}
                  </p>
                  <p>
                      <b> Phone Number</b>: ${order.phoneNumber}
                  </p>
                  <p>
                      <b> Delivery Address</b>: ${order.deliveryAddress}
                  </p>
                  <p>
                      <b> User Address</b>: ${order.userAddress}
                  </p>
              </td>
          </tr>
      </tbody>
  </table>
</body>
</html>`;
  return emailTemplate;
};

module.exports = newOrderRequestTemplate;
