const requestQuoteTemplate = (contact) => {
  const template = `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
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
  Hi Tom/Axl, Kindly find the below consultation appointment.
  <br />
  <br />

  <table cellpadding="0" cellspacing="0" role="presentation">
      <tbody>
          <tr>
              <td>
                  <p>
                  <b>Service Type</b>: ${contact.serviceType}
                  </p>

              </td>
              <td>
                  <p>
                  <b> Date Range Availability</b>: ${contact.dateRange}
                  </p>
              </td>
          </tr>
          <tr>
              <td>
                  <p>
                     <b> Available Time Range</b>: ${contact.timeRange}
                  </p>

              </td>
              <td>
                  <p>
                  <b>Email:</b> ${contact.email}
                  </p>
              </td>
          </tr>

          <tr>
              <td>
                  <p>
                  <b>Full Name</b>: ${contact.fullname}
                  </p>

              </td>
              <td>
                  <p>
                  <b>Phone Number</b>: ${contact.phone}
                  </p>
              </td>
          </tr>
          <tr>
              <td>
                  <p>
                  <b> Notes</b>: ${contact.notes}
                  </p>

              </td>
             
          </tr>
      </tbody>
  </table>
</body>
</html>`;
  return template;
};
module.exports = requestQuoteTemplate;
