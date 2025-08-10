import {NextResponse} from "next/server";
import handleError from "@/lib/handlers/error";
import {testWeWorkRemotelyScraper} from "@/scripts/testScraper";

export async function GET() {
  try {
		await testWeWorkRemotelyScraper();
		return NextResponse.json({success: true}, {status: 200});
	} catch (error) {
		return handleError(error, "api") as APIErrorResponse;
	}
}