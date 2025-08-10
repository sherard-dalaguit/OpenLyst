import {NextResponse} from "next/server";
import handleError from "@/lib/handlers/error";
import {testJobspressoScraper} from "@/scripts/testScraper";

export async function GET() {
  try {
		await testJobspressoScraper();
		return NextResponse.json({success: true}, {status: 200});
	} catch (error) {
		return handleError(error, "api") as APIErrorResponse;
	}
}