import {NotFoundError} from "@/lib/http-errors";
import handleError from "@/lib/handlers/error";
import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";
import {NextResponse} from "next/server";
import {UserSchema} from "@/lib/validations";
import mongoose, {isValidObjectId} from "mongoose";
import SavedJob from "@/database/saved-job.model";
import AppliedJob from "@/database/applied-job.model";
import Account from "@/database/account.model";
import {auth} from "@/auth";

// GET /api/users/[id]
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	if (!id) throw new NotFoundError("User");

	try {
		await dbConnect();

		const user = await User.findById(id);
		if (!user) throw new NotFoundError("User");

		return NextResponse.json({ success: true, data: user }, { status: 200 });
	} catch (error) {
		return handleError(error, "api") as APIErrorResponse;
	}
}

// DELETE /api/users/[id]
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid user id" }, { status: 400 });

  const sessionUser = await auth();
  if (!sessionUser?.user?.id || sessionUser.user.id !== id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await dbConnect();

    const mSession = await mongoose.startSession();
    let deletedUser: any = null;

    await mSession.withTransaction(async () => {
      const user = await User.findById(id).session(mSession);
      if (!user) throw new NotFoundError("User");

      await Promise.all([
        SavedJob.deleteMany({ user: id }).session(mSession),
        AppliedJob.deleteMany({ user: id }).session(mSession),
        Account.deleteMany({ userId: id }).session(mSession),
      ]);

      deletedUser = await User.findByIdAndDelete(id, { session: mSession });
    });

    await mSession.endSession();

    if (!deletedUser) throw new NotFoundError("User");
    return NextResponse.json({ success: true, data: deletedUser }, { status: 200 });
  } catch (err: any) {
    console.error("[DELETE /api/users/:id] error:", err);
    const msg = err?.message || "Internal Server Error";
    const code = err?.statusCode || 500;
    return NextResponse.json({ error: msg }, { status: code });
  }
}

// PUT /api/users/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	if (!id) throw new NotFoundError("User");

	try {
		await dbConnect();

		const body = await request.json();
		const validatedData = UserSchema.partial().parse(body);

		const updatedUser = await User.findByIdAndUpdate(id, validatedData, { new: true });
		if (!updatedUser) throw new NotFoundError("User");

		return NextResponse.json({ success: true, data: updatedUser }, { status: 200 });
	} catch (error) {
		return handleError(error, "api") as APIErrorResponse;
	}
}