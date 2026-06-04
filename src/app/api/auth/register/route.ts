import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { name, email, password, confirmPassword } = await req.json();

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const isVerificationEnabled = process.env.NEXT_PUBLIC_ENABLE_EMAIL_VERIFICATION !== "false";

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (isVerificationEnabled && !existingUser.emailVerified) {
        // If user exists but is not verified, send a new verification email
        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(verificationToken.identifier, verificationToken.token);

        return NextResponse.json(
          { message: "Verification email re-sent!", userId: existingUser.id },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: isVerificationEnabled ? null : new Date(),
      },
    });

    if (!isVerificationEnabled) {
      return NextResponse.json(
        { message: "Account created successfully!", userId: user.id, verificationDisabled: true },
        { status: 201 }
      );
    }

    // Generate verification token
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.identifier, verificationToken.token);

    return NextResponse.json(
      { message: "Verification email sent!", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
