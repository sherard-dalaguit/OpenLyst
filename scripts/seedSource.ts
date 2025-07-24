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
  await Source.deleteMany({ name: "WeWorkRemotely" });
  const src = await Source.create({ name: "WeWorkRemotely", baseUrl: "https://weworkremotely.com" });
  console.log("Seeded Source:", src);
}

seedWeWorkRemotely().catch(console.error);

export async function seedRemotive() {
  await dbConnect();
  await Source.deleteMany({ name: "Remotive" });
  const src = await Source.create({ name: "Remotive", baseUrl: "https://remotive.com" });
  console.log("Seeded Source:", src);
}

seedRemotive().catch(console.error);