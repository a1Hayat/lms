import { LOGO_URL } from "./config";

export function successRegistrationEmail({ name }: { name: string }) {
  return `
  <div style="background:#f5f6fa;padding:20px;font-family:Arial;">
    <table width="600" align="center" style="background:#fff;border-radius:8px;">
      
      <tr>
        <td style="padding:18px;text-align:center;">
          <img src="${LOGO_URL}" width="120" alt="CSWithBari Logo" />
        </td>
      </tr>

      <tr>
        <td style="background:#28a745;color:white;padding:18px;text-align:center;">
          <h2 style="margin:0;">Registration Successful</h2>
        </td>
      </tr>

      <tr>
        <td style="padding:25px;color:#333;font-size:15px;line-height:1.5;">
          <p>Hello ${name},</p>
          <p>Your account has been successfully created. You can now log in!</p>
        </td>
      </tr>

      <tr>
        <td style="background:#f5f6fa;text-align:center;padding:12px;font-size:12px;color:#777;">
          CSWithBari
        </td>
      </tr>

    </table>
  </div>
  `;
}
