import { LOGO_URL } from "./config";

export function welcomeEmail({ name, ctaUrl }: { name: string; ctaUrl: string }) {
  return `
  <div style="background:#f5f7fa;padding:20px;font-family:Arial,sans-serif;">
    <table width="600" align="center" style="background:#fff;border-radius:8px;overflow:hidden;">
      
      <!-- Logo -->
      <tr>
        <td style="padding:20px;text-align:center;">
          <img src="${LOGO_URL}" width="120" alt="CSWithBari Logo" style="display:block;margin:auto;" />
        </td>
      </tr>

      <!-- Header -->
      <tr>
        <td style="background:#0b6efd;color:#fff;padding:20px;text-align:center;">
          <h2 style="margin:0;">Welcome to CSWithBari</h2>
        </td>
      </tr>

      <tr>
        <td style="padding:30px;color:#333;font-size:15px;line-height:1.5;">
          <p>Hello ${name},</p>
          <p>Welcome! We're excited to have you. Start learning and track your progress immediately.</p>

          <p style="text-align:center;margin:25px 0;">
            <a href="${ctaUrl}" style="padding:12px 20px;background:#0b6efd;color:#fff;text-decoration:none;border-radius:6px;">
              Get Started
            </a>
          </p>

          <p>Cheers,<br>CSWithBari Team</p>
        </td>
      </tr>

      <tr>
        <td style="background:#f1f3f5;text-align:center;padding:12px;font-size:12px;color:#777;">
          © ${new Date().getFullYear()} CSWithBari
        </td>
      </tr>

    </table>
  </div>
  `;
}
