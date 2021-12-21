const newOrderRequestTemplate = (order) => {
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
          <tr>
              <td>
                  <p>
                  <b>  Product name:</b> ${order.name}
                  </p>
                  <p>
                  <b>   Quantity:</b> ${order.count}
                  </p>
                  <p>
                  <b>  Box width</b>: ${order?.width}
                  </p>
                  <p>
                  <b>   Box Height</b>: ${order.height}
                  </p>
                  <p>
                  <b>Box Weight:</b> ${order.weight}
                  </p>
                  <p>
                  <b> Box Optics</b>: ${order.boxOptics}
                  </p>
                  <p>
                  <b>  Numbers of colors</b>: ${order.name}
                  </p>
                  <p>
                  <b>   Estimated Annual Boxes  </b> : ${order.estimatedBoxes}
                  </p>
                  <p>
                  <b> Order Number</b>: ${order.orderNumber}
                  </p>
                  <p>
                  <b> Board Grade</b>: ${order.boardgrade}
                  </p>
                  <p>
                  <b> Average Weight</b>: ${order.averageweight}
                  </p>
                  <p>
                  <b> Print type</b>: ${order.printType}
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
