import Source from "@/database/source.model";
import dbConnect from "@/lib/mongoose";

export async function seed() {
  await dbConnect();
  await Source.deleteMany({ name: "RemoteOK" });
  const src = await Source.create({ name: "RemoteOK", baseUrl: "https://remoteok.com" });
  console.log("Seeded Source:", src);
}

seed().catch(console.error);
