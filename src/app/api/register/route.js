// import User from "../../../models/User";
// import connect from "../../../utils/db";
// import User from "@/models/User";
// import connect from "@/utils/db";
// import bcrypt from "bcryptjs";
// import { NextResponse } from "next/server";

// export const POST = async (request) => {
//   try {
//     await connect();
//     const { email, password } = await request.json();

//     if (!email || !password) {
//       return new NextResponse("Email and password are required", { status: 400 });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return new NextResponse("Email is already in use", { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);
//     const newUser = new User({
//       email,
//       password : hashedPassword,
//     });

//     await newUser.save();


    
//     return new NextResponse("User registered successfully", { status: 201 });
//   } catch (error) {
//     console.error("Error registering user:", error);
//     return new NextResponse("Internal server error", { status: 500 });
//   }
// };


import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    await connect();

    // Ensure request body is JSON-safe
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email is already in use" }, { status: 400 });
    }

    // Hash password only if the email is unique
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
