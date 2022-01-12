const notifyMeTemplate = (data) => {
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
    Hi Tom/Axl, 
    The below user want to be notified when you are live!!!.
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
                        <b>Email</b>: ${data.email}
                    </p>
                   
                </td>
            </tr>
        </tbody>
    </table>
  </body>
  </html>`;
  return emailTemplate;
};

module.exports = notifyMeTemplate;
