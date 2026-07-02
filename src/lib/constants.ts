import path from "path";

export const MENU_FILENAME = "menu.pdf";
export const MENU_PATH = path.join(process.cwd(), "storage", MENU_FILENAME);
export const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;

export type MenuInfo = {
  filename: string;
  size: number;
  lastModified: number;
};
