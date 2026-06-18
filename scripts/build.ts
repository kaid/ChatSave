const ROOT_DIR = new URL("../", import.meta.url);
const SRC_DIR = new URL("src/", ROOT_DIR);
const DIST_DIR = new URL("dist/", ROOT_DIR);
const PACKAGE_DIR = new URL("chat-save/", DIST_DIR);

type Manifest = {
  manifest_version?: number;
  name?: string;
  version?: string;
  icons?: Record<string, string>;
  content_scripts?: Array<{ js?: string[] }>;
};

function toPath(url: URL): string {
  return decodeURIComponent(url.pathname);
}

async function removeIfExists(path: URL): Promise<void> {
  try {
    await Deno.remove(path, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
  }
}

async function copyDir(source: URL, destination: URL): Promise<void> {
  await Deno.mkdir(destination, { recursive: true });

  for await (const entry of Deno.readDir(source)) {
    const sourceEntry = new URL(entry.name, source);
    const destinationEntry = new URL(entry.name, destination);

    if (entry.isDirectory) {
      await copyDir(
        new URL(`${entry.name}/`, source),
        new URL(`${entry.name}/`, destination),
      );
      continue;
    }

    if (entry.isFile) {
      await Deno.copyFile(sourceEntry, destinationEntry);
    }
  }
}

async function validateManifest(packageDir: URL): Promise<Manifest> {
  const manifestUrl = new URL("manifest.json", packageDir);
  const manifest = JSON.parse(
    await Deno.readTextFile(manifestUrl),
  ) as Manifest;

  if (manifest.manifest_version !== 3) {
    throw new Error("manifest.json must use Manifest V3.");
  }
  if (!manifest.name || !manifest.version) {
    throw new Error("manifest.json must include name and version.");
  }
  if (!manifest.content_scripts?.length) {
    throw new Error("manifest.json must include at least one content script.");
  }
  if (!manifest.icons?.["128"]) {
    throw new Error("manifest.json must include a 128px icon.");
  }

  for (const script of manifest.content_scripts) {
    for (const jsFile of script.js || []) {
      await assertPackageFile(packageDir, jsFile, "content script");
    }
  }

  for (const [size, iconPath] of Object.entries(manifest.icons || {})) {
    await assertPackageFile(packageDir, iconPath, `${size}px icon`);
  }

  return manifest;
}

async function assertPackageFile(
  packageDir: URL,
  filePath: string,
  label: string,
): Promise<void> {
  const fileUrl = new URL(filePath, packageDir);
  try {
    await Deno.stat(fileUrl);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new Error(`Missing ${label} in package: ${filePath}`);
    }
    throw error;
  }
}

export async function buildExtension(): Promise<{
  manifest: Manifest;
  packageDir: URL;
}> {
  await removeIfExists(PACKAGE_DIR);
  await Deno.mkdir(DIST_DIR, { recursive: true });
  await copyDir(SRC_DIR, PACKAGE_DIR);

  const manifest = await validateManifest(PACKAGE_DIR);
  console.log(`Built ${manifest.name} ${manifest.version}`);
  console.log(`Unpacked extension: ${toPath(PACKAGE_DIR)}`);

  return { manifest, packageDir: PACKAGE_DIR };
}

if (import.meta.main) {
  await buildExtension();
}
