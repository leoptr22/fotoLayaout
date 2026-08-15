"use client";

import { useRef, useState } from "react";
import { Header } from "./components/Header";
import { TemplatePicker, templates } from "./components/TemplatePicker";
import { PhotoUploader, type PhotoItem } from "./components/PhotoUploader";
import { EditorToolbar } from "./components/EditorToolbar";
import { SheetPreview } from "./components/SheetPreview";
import { ExportBar } from "./components/ExportBar";
import { PhotoAdjuster } from "./components/PhotoAdjuster";
import { BackgroundPicker } from "./components/BackgroundPicker";

export default function Home() {
  const [template, setTemplate] = useState("classic");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [title, setTitle] = useState("Nuestros momentos");
  const [fit, setFit] = useState<"cover" | "contain">("cover");
  const [busy, setBusy] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [background, setBackground] = useState("gray");
  const sheetRef = useRef<HTMLDivElement>(null);

  const addPhotos = (files: File[]) => {
    const available = Math.max(0, 20 - photos.length);
    const next = files.slice(0, available).map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      x: 50,
      y: 50,
      zoom: 1,
      frameWidth: 100,
      frameHeight: 100,
      shape: "rectangle" as const,
    }));
    setPhotos((current) => [...current, ...next]);
    if (!selectedId && next[0]) setSelectedId(next[0].id);
  };

  const removePhoto = (id: string) => {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((photo) => photo.id !== id);
    });
    if (selectedId === id) setSelectedId(photos.find((photo) => photo.id !== id)?.id ?? null);
  };

  const movePhoto = (index: number, direction: -1 | 1) => {
    setPhotos((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const copy = [...current];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  };

  const swapPhotos = (sourceId: string, targetId: string) => {
    setPhotos((current) => {
      const source = current.findIndex((photo) => photo.id === sourceId);
      const target = current.findIndex((photo) => photo.id === targetId);
      if (source < 0 || target < 0 || source === target) return current;
      const copy = [...current];
      [copy[source], copy[target]] = [copy[target], copy[source]];
      return copy;
    });
  };

  const setPhotoPosition = (id: string, x: number, y: number) => {
    setPhotos((current) => current.map((photo) => photo.id === id ? { ...photo, x, y } : photo));
  };

  const setPhotoSize = (id: string, frameWidth: number, frameHeight: number) => {
    setPhotos((current) => current.map((photo) => photo.id === id ? { ...photo, frameWidth, frameHeight } : photo));
  };

  const updateSelected = (changes: Partial<Pick<PhotoItem, "x" | "y" | "zoom" | "frameWidth" | "frameHeight" | "shape">>) => {
    if (!selectedId) return;
    setPhotos((current) => current.map((photo) => photo.id === selectedId ? { ...photo, ...changes } : photo));
  };

  const generatePdf = async () => {
    if (!sheetRef.current || !photos.length) return;
    const sheet = sheetRef.current;
    setBusy(true);
    sheet.classList.add("is-exporting");
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(sheet, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#e9edef",
        onclone: (documentClone) => {
          documentClone.querySelectorAll(".drag-hint").forEach((element) => element.remove());
          documentClone.querySelectorAll(".resize-handle").forEach((element) => element.remove());
          documentClone.querySelectorAll(".selected-photo").forEach((element) => element.classList.remove("selected-photo"));
        },
      });
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [329, 483] });
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.94), "JPEG", 0, 0, 329, 483);
      pdf.save(`${title.trim().replace(/\s+/g, "-").toLowerCase() || "fotoforma"}.pdf`);
    } finally {
      sheet.classList.remove("is-exporting");
      setBusy(false);
    }
  };

  const selected = templates.find((item) => item.id === template) ?? templates[0];
  const selectedIndex = photos.findIndex((photo) => photo.id === selectedId);
  const selectedPhoto = selectedIndex >= 0 ? photos[selectedIndex] : undefined;

  return (
    <main>
      <Header />
      <div className="app-shell">
        <section className="controls-panel" aria-label="Configuración del álbum">
          <div className="intro-copy">
            <span className="eyebrow">IMPRESIONES</span>
            <h1>Armá tu plantilla<br /><em>Super A3</em></h1>
            <p>Elegí una composición, cargá hasta 20 fotos y acomodá cada encuadre antes de generar el PDF listo para imprimir.</p>
          </div>
          <TemplatePicker selected={template} onSelect={setTemplate} />
          <PhotoUploader photos={photos} onAdd={addPhotos} onRemove={removePhoto} onMove={movePhoto} />
          <EditorToolbar title={title} onTitle={setTitle} fit={fit} onFit={setFit} />
          <BackgroundPicker selected={background} onSelect={setBackground} />
        </section>

        <section className="preview-panel" aria-label="Vista previa">
          <div className="preview-heading">
            <div><span className="step-label">VISTA PREVIA</span><h2>{selected.name}</h2></div>
            <span className="size-badge">SUPER A3 · 329 × 483 MM</span>
          </div>
          <div className="sheet-stage">
            <SheetPreview ref={sheetRef} photos={photos} template={template} background={background} title={title} fit={fit} selectedId={selectedId} onSelect={setSelectedId} onPosition={setPhotoPosition} onResize={setPhotoSize} onSwap={swapPhotos} />
          </div>
          <PhotoAdjuster photo={selectedPhoto} index={selectedIndex} total={photos.length} onZoom={(zoom) => updateSelected({ zoom })} onShape={(shape) => updateSelected({ shape })} onReset={() => updateSelected({ x: 50, y: 50, zoom: 1, frameWidth: 100, frameHeight: 100, shape: "rectangle" })} />
          <ExportBar count={photos.length} busy={busy} onExport={generatePdf} />
        </section>
      </div>
    </main>
  );
}
