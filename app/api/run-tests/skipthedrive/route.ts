import {NextResponse} from "next/server";
import handleError from "@/lib/handlers/error";
import {testSkipTheDriveScraper} from "@/scripts/testScraper";

export async function GET() {
  try {
		await testSkipTheDriveScraper();
		return NextResponse.json({success: true}, {status: 200});
	} catch (error) {
		return handleError(error, "api") as APIErrorResponse;
	}
}