import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";

export async function updatePreferences(formData: FormData, userId: string) {
	await dbConnect()
	const receiveAlerts = formData.get("receiveAlerts") === "on";
	const categories = formData.getAll("categories") as string[];
	const frequency = formData.get("frequency") as 'daily' | 'weekly';

	await User.findByIdAndUpdate(userId, {
		'preferences.receiveAlerts': receiveAlerts,
		'preferences.categories': categories,
		'preferences.frequency': frequency,
	}, { new: true })
}