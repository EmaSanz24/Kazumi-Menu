import { NextResponse } from "next/server";
import { isAuthenticatedFromCookies } from "@/lib/auth";
import { MAX_UPLOAD_SIZE } from "@/lib/constants";
import { saveMenuFile } from "@/lib/menu";

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedFromCookies())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Debe seleccionar un archivo PDF" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Solo se permiten archivos PDF" }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "El archivo está vacío" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json({ error: "El archivo supera el límite de 20 MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const menuInfo = await saveMenuFile(buffer);

    return NextResponse.json({
      success: true,
      menu: menuInfo,
    });
  } catch {
    return NextResponse.json({ error: "Error al actualizar el menú" }, { status: 500 });
  }
}
