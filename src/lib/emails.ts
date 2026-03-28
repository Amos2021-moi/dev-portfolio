export async function sendContactNotification({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: "amosmark2332@gmail.com",
      subject: "New Contact Message: " + subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
            <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

              <div style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:40px 32px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">New Message!</h1>
                <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Someone reached out through your portfolio</p>
              </div>

              <div style="padding:32px;">

                <div style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:24px;">
                  <h2 style="margin:0 0 16px;font-size:16px;font-weight:600;color:#1e293b;">Sender Details</h2>
                  <table style="width:100%;border-collapse:collapse;">
                    <tr>
                      <td style="padding:8px 0;color:#64748b;font-size:14px;width:80px;">Name</td>
                      <td style="padding:8px 0;color:#1e293b;font-size:14px;font-weight:500;">${name}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;color:#64748b;font-size:14px;">Email</td>
                      <td style="padding:8px 0;font-size:14px;">
                        <a href="mailto:${email}" style="color:#3b82f6;text-decoration:none;">${email}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;color:#64748b;font-size:14px;">Subject</td>
                      <td style="padding:8px 0;color:#1e293b;font-size:14px;font-weight:500;">${subject}</td>
                    </tr>
                  </table>
                </div>

                <div style="margin-bottom:24px;">
                  <h2 style="margin:0 0 12px;font-size:16px;font-weight:600;color:#1e293b;">Message</h2>
                  <div style="background:#f8fafc;border-left:4px solid #3b82f6;border-radius:0 8px 8px 0;padding:16px 20px;">
                    <p style="margin:0;color:#475569;font-size:14px;line-height:1.7;">${message}</p>
                  </div>
                </div>

                <div style="text-align:center;margin-bottom:24px;">
                  
                    href="mailto:${email}?subject=Re: ${subject}"
                    style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:600;"
                  >
                    Reply to ${name}
                  </a>
                </div>

                <div style="border-top:1px solid #e2e8f0;padding-top:20px;text-align:center;">
                  <p style="margin:0;color:#94a3b8;font-size:12px;">
                    Sent from your portfolio contact form at Mark.dev
                  </p>
                </div>

              </div>
            </div>
          </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send contact notification:", error);
    return { success: false };
  }
}

export async function sendNewsletterConfirmation({
  email,
}: {
  email: string;
}) {
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Welcome to Mark's Newsletter!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
            <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

              <div style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:40px 32px;text-align:center;">
                <div style="font-size:48px;margin-bottom:16px;">🎉</div>
                <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">You are subscribed!</h1>
                <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Welcome to Mark Osiemo's newsletter</p>
              </div>

              <div style="padding:32px;">

                <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 20px;">
                  Hi there! Thank you for subscribing to my newsletter. I am excited to have you on board!
                </p>

                <div style="margin-bottom:28px;">

                  <div style="display:flex;align-items:flex-start;gap:12px;padding:12px;background:#f8fafc;border-radius:8px;margin-bottom:8px;">
                    <span style="font-size:20px;">🚀</span>
                    <div>
                      <p style="margin:0 0 2px;font-weight:600;color:#1e293b;font-size:14px;">New Projects</p>
                      <p style="margin:0;color:#64748b;font-size:13px;">Be the first to know when I launch something new</p>
                    </div>
                  </div>

                  <div style="display:flex;align-items:flex-start;gap:12px;padding:12px;background:#f8fafc;border-radius:8px;margin-bottom:8px;">
                    <span style="font-size:20px;">📝</span>
                    <div>
                      <p style="margin:0 0 2px;font-weight:600;color:#1e293b;font-size:14px;">Blog Posts</p>
                      <p style="margin:0;color:#64748b;font-size:13px;">Tutorials and insights about web development</p>
                    </div>
                  </div>

                  <div style="display:flex;align-items:flex-start;gap:12px;padding:12px;background:#f8fafc;border-radius:8px;margin-bottom:8px;">
                    <span style="font-size:20px;">💡</span>
                    <div>
                      <p style="margin:0 0 2px;font-weight:600;color:#1e293b;font-size:14px;">Dev Tips</p>
                      <p style="margin:0;color:#64748b;font-size:13px;">Useful tips and tricks I discover along the way</p>
                    </div>
                  </div>

                  <div style="display:flex;align-items:flex-start;gap:12px;padding:12px;background:#f8fafc;border-radius:8px;margin-bottom:8px;">
                    <span style="font-size:20px;">🎓</span>
                    <div>
                      <p style="margin:0 0 2px;font-weight:600;color:#1e293b;font-size:14px;">Learning Updates</p>
                      <p style="margin:0;color:#64748b;font-size:13px;">My journey as a CS student at SEKU</p>
                    </div>
                  </div>

                </div>

                <div style="text-align:center;margin-bottom:28px;">
                  
                    href="https://dev-portfolio-jr4o.vercel.app"
                    style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:600;"
                  >
                    Visit My Portfolio
                  </a>
                </div>

                <div style="border-top:1px solid #e2e8f0;padding-top:20px;text-align:center;">
                  <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;">
                    You subscribed at Mark.dev
                  </p>
                  <p style="margin:0;color:#94a3b8;font-size:12px;">
                    Mark Amos Osiemo · SEKU · Kenya
                  </p>
                </div>

              </div>
            </div>
          </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send newsletter confirmation:", error);
    return { success: false };
  }
}