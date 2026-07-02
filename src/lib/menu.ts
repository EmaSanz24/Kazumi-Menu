import { access, readFile, stat, writeFile } from "fs/promises";
import { MENU_FILENAME, MENU_PATH } from "./constants";
import type { MenuInfo } from "./constants";

export async function menuExists(): Promise<boolean> {
  try {
    await access(MENU_PATH);
    return true;
  } catch {
    return false;
  }
}

export async function getMenuInfo(): Promise<MenuInfo | null> {
  try {
    const fileStat = await stat(MENU_PATH);
    return {
      filename: MENU_FILENAME,
      size: fileStat.size,
      lastModified: fileStat.mtimeMs,
    };
  } catch {
    return null;
  }
}

export async function readMenuFile(): Promise<Buffer> {
  return readFile(MENU_PATH);
}

export async function saveMenuFile(data: Buffer): Promise<MenuInfo> {
  await writeFile(MENU_PATH, data);
  const fileStat = await stat(MENU_PATH);
  return {
    filename: MENU_FILENAME,
    size: fileStat.size,
    lastModified: fileStat.mtimeMs,
  };
}
