import crypto from "node:crypto";
import sharp from "sharp";
import { AppError } from "../middlewares/errorHandler.middleware.js";
import { readFile, writeFile } from "./store.js";

const MAX_PIXELS = 40e6;
const MAX_WIDTH = 2000;

/**
 * Checks an uploaded image (a real PNG, JPEG, WebP or GIF), turns it upright, scales it to at
 * most 2000 px wide, converts it to WebP and saves it as public/img/uploads/<hash>.webp. The
 * name comes from the content, so uploading the same picture twice reuses the same file.
 */
export async function saveImage(buffer, { who }) {
  let meta;
  try {
    meta = await sharp(buffer, { limitInputPixels: MAX_PIXELS }).metadata();
  } catch {
    throw new AppError("That file isn't a readable image.", 400, "BAD_IMAGE");
  }
  if (!["png", "jpeg", "webp", "gif"].includes(meta.format)) throw new AppError("Upload a PNG, JPG, WebP or GIF image.", 400, "BAD_IMAGE");
  const out = await sharp(buffer, { limitInputPixels: MAX_PIXELS })
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });
  const name = crypto.createHash("sha256").update(out.data).digest("hex").slice(0, 16);
  const rel = `public/img/uploads/${name}.webp`;
  if (!(await readFile(rel))) await writeFile(rel, out.data, { message: `content: add image ${name}.webp (by ${who})` });
  return { path: `/img/uploads/${name}.webp`, width: out.info.width, height: out.info.height, bytes: out.data.length };
}
