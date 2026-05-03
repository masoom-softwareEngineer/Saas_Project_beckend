import { Request, Response } from "express";
import { signup } from "../../Models/signupSchema";
import nodemailer from "nodemailer"; 
import { z } from "zod";
import asyncHandler from "express-async-handler";
import crypto from 'crypto'
import bcrypt from 'bcrypt'

const signupSchema = z.object({
  name: z.string().min(3, "Name is too short"),
  email: z.string().email("Invalid email format"),
   password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export const SignupController = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = signupSchema.parse(req.body);
  const { name, email, password } = validatedData;

  const duplicateUser = await signup.findOne({ email }).select("_id");
  if (duplicateUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const verificationCode = crypto.randomInt(100000, 999999).toString();
  const hashVerificationCode = await bcrypt.hash(verificationCode, 10);
  
  const newUser = await signup.create({
    name,
    email,
    password,
    verificationCode: hashVerificationCode,
    verified: false,
    verificationCodeExpires: new Date(Date.now() + 15 * 60 * 1000),
  });

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
  });

  try {
   
    await transporter.sendMail({
      from: '"Test App" <hello@demomailtrap.com>', 
      to: email,
      subject: "Verify Your Account",
      html: `<strong>Your code: ${verificationCode}</strong>`,
    });

    res.status(201).json({
      success: true,
      message: "Verification code sent to Mailtrap inbox.",
    });

  } catch (error: any) {
    await signup.findByIdAndDelete(newUser._id);
    res.status(500);
    throw new Error(`SMTP Error: ${error.message}`);
  }
});