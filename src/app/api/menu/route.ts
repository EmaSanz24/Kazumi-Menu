import { NextResponse } from "next/server";
import { getMenuInfo, menuExists, readMenuFile } from "@/lib/menu";

export async function GET() {
  try {
    if (!(await menuExists())) {
      return NextResponse.json({ error: "Menú no disponible" }, { status: 404 });
    }

    const menuInfo = await getMenuInfo();
    const fileBuffer = await readMenuFile();

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="menu.pdf"',
        "Cache-Control": "public, max-age=0, must-revalidate",
        ...(menuInfo
          ? {
              "Last-Modified": new Date(menuInfo.lastModified).toUTCString(),
              ETag: `"${menuInfo.lastModified}"`,
            }
          : {}),
      },
    });
  } catch {
    return NextResponse.json({ error: "Error al cargar el menú" }, { status: 500 });
  }
}
