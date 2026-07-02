"use client";

type PdfViewerProps = {
  version: string;
};

export function PdfViewer({ version }: PdfViewerProps) {
  const menuUrl = `/api/menu?v=${encodeURIComponent(version)}`;

  return (
    <main className="h-dvh w-full bg-white">
      <object data={menuUrl} type="application/pdf" className="h-full w-full">
        <embed src={menuUrl} type="application/pdf" className="h-full w-full" />
        <div className="flex h-dvh items-center justify-center bg-white p-6 text-center">
          <p className="mb-4 text-neutral-600">
            Su navegador no puede mostrar el PDF directamente.
          </p>
          <a
            href={menuUrl}
            className="text-base font-medium text-neutral-900 underline underline-offset-4"
          >
            Descargar menú PDF
          </a>
        </div>
      </object>
    </main>
  );
}
