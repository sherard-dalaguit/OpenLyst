import Source from "@/database/source.model";
import dbConnect from "@/lib/mongoose";

export async function seedRemoteOk() {
  await dbConnect();
  await Source.deleteMany({ name: "RemoteOK" });
  const src = await Source.create({ name: "RemoteOK", baseUrl: "https://remoteok.com" });
  console.log("Seeded Source:", src);
}

export async function seedWeWorkRemotely() {
  await dbConnect();
  await Source.deleteMany({ name: "WeWorkRemotely" });
  const src = await Source.create({ name: "WeWorkRemotely", baseUrl: "https://weworkremotely.com" });
  console.log("Seeded Source:", src);
}

export async function seedRemotive() {
  await dbConnect();
  await Source.deleteMany({ name: "Remotive" });
  const src = await Source.create({ name: "Remotive", baseUrl: "https://remotive.com" });
  console.log("Seeded Source:", src);
}

export async function seedJobspresso() {
  await dbConnect();
  await Source.deleteMany({ name: "Jobspresso" });
  const src = await Source.create({ name: "Jobspresso", baseUrl: "https://jobspresso.co" });
  console.log("Seeded Source:", src);
}

export async function seedJavascriptJobs() {
  await dbConnect();
  await Source.deleteMany({ name: "JavascriptJobs" });
  const src = await Source.create({ name: "JavascriptJobs", baseUrl: "https://javascript.jobs" });
  console.log("Seeded Source:", src);
}

export async function seedWorkingNomads() {
  await dbConnect();
  await Source.deleteMany({ name: "WorkingNomads" });
  const src = await Source.create({ name: "WorkingNomads", baseUrl: "https://workingnomads.com" });
  console.log("Seeded Source:", src);
}

export async function seedSkipTheDrive() {
  await dbConnect();
  await Source.deleteMany({ name: "SkipTheDrive" });
  const src = await Source.create({ name: "SkipTheDrive", baseUrl: "https://skipthedrive.com" });
  console.log("Seeded Source:", src);
}