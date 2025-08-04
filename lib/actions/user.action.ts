"use server";

import action from "../handlers/action";
import {GetUserSchema} from "@/lib/validations";
import handleError from "@/lib/handlers/error";
import User from "@/database/user.model";

export async function getUser(params: GetUserParams): Promise<ActionResponse<{
	user: UserType
}>> {
	const validationResult = await action({
		params,
		schema: GetUserSchema,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { userId } = params;

	try {
		const user = await User.findById(userId);

		if (!user) throw new Error("User not found");

		return {
			success: true,
			data: {
				user: JSON.parse(JSON.stringify(user)),
			}
		}
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}