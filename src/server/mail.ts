import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/verify?token=${token}`;
  const html = `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`;

  await resend.emails.send({
    from: "DevStash <onboarding@resend.dev>",
    to: email,
    subject: "Confirm your email",
    html: html,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/reset-password?token=${token}`;
  const html = `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`;

  await resend.emails.send({
    from: "DevStash <onboarding@resend.dev>",
    to: email,
    subject: "Reset your password",
    html: html,
  });
};
