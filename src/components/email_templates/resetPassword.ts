import { LOGO_URL } from "./config";

export function resetPasswordEmail({ name, resetUrl }: { name: string; resetUrl: string }) {
  return `
  <div style="background:#fbfcfe;padding:20px;font-family:Arial;">
    <table width="600" align="center" style="background:#fff;border-radius:8px;">

      <tr>
        <td style="padding:18px;text-align:center;">
          <img src="${LOGO_URL}" width="120" alt="CSWithBari Logo" />
        </td>
      </tr>

      <tr>
        <td style="background:#0b6efd;color:white;padding:18px;text-align:center;">
          <h2 style="margin:0;">Reset Your Password</h2>
        </td>
      </tr>

      <tr>
        <td style="padding:25px;color:#333;font-size:15px;line-height:1.5;">
          <p>Hello ${name},</p>
          <p>Click below to reset your password:</p>

          <p style="text-align:center;margin:20px 0;">
            <a href="${resetUrl}"
              style="background:#0b6efd;color:white;padding:12px 20px;border-radius:6px;text-decoration:none;">
              Reset Password
            </a>
          </p>

          <p>If you didn’t request this, ignore this email.</p>
        </td>
      </tr>

      <tr>
        <td style="background:#f5f5f7;text-align:center;padding:12px;font-size:12px;color:#777;">
          CSWithBari
        </td>
      </tr>

    </table>
  </div>
  `;
}
