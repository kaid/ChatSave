import { buildExtension } from "./build.ts";

const DIST_DIR = new URL("../dist/", import.meta.url);

function toPath(url: URL): string {
  return decodeURIComponent(url.pathname);
}

function safePackageName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(
    /^-|-$/g,
    "",
  );
}

async function removeIfExists(path: URL): Promise<void> {
  try {
    await Deno.remove(path);
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
  }
}

const { manifest, packageDir } = await buildExtension();
const packageName = safePackageName(manifest.name || "chat-save");
const version = manifest.version || "0.0.0";
const zipUrl = new URL(`${packageName}-v${version}.zip`, DIST_DIR);

await removeIfExists(zipUrl);

const command = new Deno.Command("zip", {
  cwd: toPath(packageDir),
  args: ["-r", toPath(zipUrl), "."],
  stdout: "inherit",
  stderr: "inherit",
});
const result = await command.output();

if (!result.success) {
  throw new Error(`zip failed with exit code ${result.code}`);
}

console.log(`Package: ${toPath(zipUrl)}`);
