import { LOGO_URL } from "./config";

export function generalEnrollmentEmail({
  name,
  itemName,
  orderId
}: {
  name: string;
  itemName: string;
  orderId: string;
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
          <h2 style="margin:0;">Payment Successful</h2>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:25px;color:#333;font-size:15px;line-height:1.6;">
          <p>Hello ${name},</p>

          <p>We’re excited to let you know that your payment was <strong>successfully completed</strong>.</p>

          <p>You are now enrolled in / have access to:</p>

          <h3 style="margin:12px 0;color:#0b6efd;">${itemName}</h3>

          <p>Your Order ID is:</p>
          <p style="font-weight:bold;color:#333;">${orderId}</p>

          <p>You can now log in and start learning immediately.  
          We wish you an awesome learning journey!</p>

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
