import { LOGO_URL } from "./config";

export function workshopRegistrationEmail({
  name,
  workshopName,
  date,
  type,
  details
}: {
  name: string;
  workshopName: string;
  date: string;
  type: string;
  details: string; // Location or Meeting Link
}) {
  return `
  <div style="background:#eef0f4;padding:20px;font-family:Arial,sans-serif;">
    <table width="600" align="center" style="background:#ffffff;border-radius:8px;overflow:hidden;">
      
      <!-- Logo -->
      <tr>
        <td style="padding:18px;text-align:center;">
          <img src="${LOGO_URL}" width="120" alt="CSWithBari Logo" style="display:block;margin:auto;" />
        </td>
      </tr>

      <!-- Header -->
      <tr>
        <td style="background:#28a745;color:white;padding:18px;text-align:center;">
          <h2 style="margin:0;">Registration Confirmed!</h2>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:25px;color:#333;font-size:15px;line-height:1.6;">
          <p>Hello ${name},</p>

          <p>You have successfully registered for the upcoming workshop/session. Your seat is confirmed!</p>

          <div style="background:#f8f9fa; border-left: 4px solid #0b6efd; padding: 15px; margin: 20px 0;">
            <h3 style="margin:0 0 10px 0;color:#0b6efd;">${workshopName}</h3>
            
            <table cellpadding="4" cellspacing="0" border="0" style="width:100%; font-size:14px;">
              <tr>
                <td style="font-weight:bold; width: 80px; color:#555;">Date:</td>
                <td>${date}</td>
              </tr>
              <tr>
                <td style="font-weight:bold; color:#555;">Type:</td>
                <td style="text-transform: capitalize;">${type}</td>
              </tr>
              <tr>
                <td style="font-weight:bold; color:#555; vertical-align: top;">${type === 'online' ? 'Link' : 'Location'}:</td>
                <td>${details}</td>
              </tr>
            </table>
          </div>

          <p>Please make sure to join/arrive 5 minutes before the scheduled time.</p>
          
          <p>We look forward to seeing you there!</p>

          <p style="margin-top:25px;">
            Best Regards,<br />
            <strong>CSWithBari Team</strong>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f5f6fa;text-align:center;padding:12px;font-size:12px;color:#777;">
          © ${new Date().getFullYear()} CSWithBari
        </td>
      </tr>

    </table>
  </div>
  `;
}