import dbConnect from "@/lib/mongoose";
import handleError from "@/lib/handlers/error";
import User from "@/database/user.model";
import {NextResponse} from "next/server";
import {UserSchema} from "@/lib/validations";
import {ValidationError} from "@/lib/http-errors";

export async function GET() {
	try {
		await dbConnect();

		const users = await User.find();

		return NextResponse.json({ success: true, data: users }, { status: 200 });
	} catch (error) {
		return handleError(error, "api") as APIErrorResponse;
	}
}

export async function POST(request: Request) {
	try {
		await dbConnect();
		const body = await request.json();

		// validate request body
		const validatedData = UserSchema.safeParse(body);

		if (!validatedData.success) {
			throw new ValidationError(validatedData.error.flatten().fieldErrors);
		}

		const { email } = validatedData.data;

		const existingUser = await User.findOne({ email });
		if (existingUser) throw new Error("User already exists");

		// create user
		const newUser = await User.create(validatedData.data);

		return NextResponse.json({ success: true, data: newUser }, { status: 201 });
	} catch (error) {
		return handleError(error, "api") as APIErrorResponse;
	}
}