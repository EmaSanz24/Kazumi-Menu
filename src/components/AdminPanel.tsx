"use client";

import { DragEvent, FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { MenuInfo } from "@/lib/constants";
import { formatDate, formatFileSize } from "@/lib/format";

type AdminPanelProps = {
  menuInfo: MenuInfo | null;
};

export function AdminPanel({ menuInfo }: AdminPanelProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(menuInfo);

  function handleFileSelection(file: File | null) {
    setError("");
    setSuccess("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Solo se permiten archivos PDF");
      setSelectedFile(null);
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("El archivo supera el límite de 20 MB");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    handleFileSelection(file);
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedFile) {
      setError("Seleccione un archivo PDF");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "No se pudo actualizar el menú");
        return;
      }

      setCurrentMenu(data.menu);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSuccess("Menú actualizado correctamente");
      router.refresh();
    } catch {
      setError("Error de conexión. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/logout", { method: "POST" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
      <h1 className="mb-8 text-center text-2xl font-semibold text-neutral-900">
        Panel de administración
      </h1>

      <section className="mb-8 rounded-xl bg-neutral-50 p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Menú actual
        </h2>

        {currentMenu ? (
          <div className="space-y-2 text-sm text-neutral-700">
            <p>
              <span className="font-medium text-neutral-900">{currentMenu.filename}</span>
            </p>
            <p>
              Última actualización:{" "}
              <span className="text-neutral-900">{formatDate(currentMenu.lastModified)}</span>
            </p>
            <p>
              Tamaño:{" "}
              <span className="text-neutral-900">{formatFileSize(currentMenu.size)}</span>
            </p>
          </div>
        ) : (
          <p className="text-sm text-neutral-600">No hay menú cargado todavía.</p>
        )}
      </section>

      <form onSubmit={handleUpload} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Seleccionar PDF
          </label>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`rounded-xl border-2 border-dashed p-6 text-center transition ${
              dragActive
                ? "border-neutral-900 bg-neutral-50"
                : "border-neutral-300 bg-white"
            }`}
          >
            <p className="mb-4 text-sm text-neutral-600">
              Arrastre un PDF aquí o elija un archivo
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
            >
              Elegir archivo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(event) => handleFileSelection(event.target.files?.[0] ?? null)}
            />
            {selectedFile ? (
              <p className="mt-4 text-sm text-neutral-700">
                Archivo seleccionado:{" "}
                <span className="font-medium text-neutral-900">{selectedFile.name}</span>
              </p>
            ) : null}
          </div>
        </div>

        {error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}

        {success ? (
          <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Actualizando..." : "Actualizar menú"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className="mt-6 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
