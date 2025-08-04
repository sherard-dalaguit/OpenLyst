import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import {NotFoundError} from "@/lib/http-errors";
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { token: string } }) {
  const { token } = params
	if (!token) throw new NotFoundError("Unsubscribe token");

	try {
		await dbConnect()

		const user = await User.findOne({'preferences.unsubscribeToken': token})
		if (!user) throw new NotFoundError("User");

		user.preferences.receiveAlerts = false
		await user.save()

		return NextResponse.json({ success: true, message: 'You’ve been unsubscribed. Sorry to see you go!' }, { status: 200 });
	} catch (error) {
		return handleError(error, "api") as APIErrorResponse;
	}
}