import { createServerFn } from "@tanstack/react-start";
import nodemailer from "nodemailer";
import { z } from "zod";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const LOGO_URL = "https://sever-mini-app-bot.vercel.app/logo-powered.png"; // Assuming public URL

export const sendBugReportEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string().email(),
      title: z.string(),
      description: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const mailOptions = {
      from: `"Android Server Mini" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: "Xác nhận báo cáo lỗi - Android Server Mini",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #020617; padding: 20px; text-align: center;">
            <img src="${LOGO_URL}" alt="Nhutcoder Team" style="height: 50px;">
          </div>
          <div style="padding: 20px; color: #1e293b;">
            <h2 style="color: #10b981;">Chào bạn,</h2>
            <p>Cảm ơn bạn đã gửi báo cáo lỗi cho <strong>Android Server Mini</strong>.</p>
            <p>Chúng tôi đã nhận được thông tin bug với nội dung sau:</p>
            <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
              <p><strong>Tiêu đề:</strong> ${data.title}</p>
              <p><strong>Mô tả:</strong> ${data.description}</p>
            </div>
            <p>Đội ngũ kỹ thuật sẽ sớm kiểm tra và phản hồi lại cho bạn.</p>
            <p>Trân trọng,<br><strong>Nhutcoder Team</strong></p>
          </div>
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
            © 2026 Android Server Mini. Powered By Nhutcoder Team.
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, error: (error as Error).message };
    }
  });

export const sendApprovalEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string().email(),
      title: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const mailOptions = {
      from: `"Android Server Mini" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: "Báo cáo lỗi của bạn đã được xét duyệt - Android Server Mini",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #020617; padding: 20px; text-align: center;">
            <img src="${LOGO_URL}" alt="Nhutcoder Team" style="height: 50px;">
          </div>
          <div style="padding: 20px; color: #1e293b;">
            <h2 style="color: #10b981;">Tuyệt vời!</h2>
            <p>Báo cáo lỗi của bạn: <strong>"${data.title}"</strong> đã được đội ngũ quản trị xét duyệt và xử lý.</p>
            <p>Chúng tôi chân thành cảm ơn sự đóng góp của bạn để ứng dụng ngày càng hoàn thiện hơn.</p>
            <p>Chúc bạn có những trải nghiệm tốt nhất với Android Server Mini.</p>
            <p>Trân trọng,<br><strong>Nhutcoder Team</strong></p>
          </div>
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
            © 2026 Android Server Mini. Powered By Nhutcoder Team.
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error("Error sending approval email:", error);
      return { success: false, error: (error as Error).message };
    }
  });
