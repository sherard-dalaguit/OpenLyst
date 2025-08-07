import {runAllTests} from "@/scripts/testScraper";
import {NextResponse} from "next/server";
import handleError from "@/lib/handlers/error";

export async function GET() {
  try {
		await runAllTests();
		return NextResponse.json({success: true}, {status: 200});
	} catch (error) {
		return handleError(error, "api") as APIErrorResponse;
	}
}