import Source from "@/database/source.model";
import dbConnect from "@/lib/mongoose";

export async function seedRemoteOk() {
  await dbConnect();
  await Source.deleteMany({ name: "RemoteOK" });
  const src = await Source.create({ name: "RemoteOK", baseUrl: "https://remoteok.com" });
  console.log("Seeded Source:", src);
}

seedRemoteOk().catch(console.error);

export async function seedWeWorkRemotely() {
  await dbConnect();
  await Source.deleteMany({ name: "We Work Remotely" });
  const src = await Source.create({ name: "We Work Remotely", baseUrl: "https://weworkremotely.com" });
  console.log("Seeded Source:", src);
}

seedWeWorkRemotely().catch(console.error);