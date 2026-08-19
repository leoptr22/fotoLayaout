"use client";

import { useMemo, useRef, useState } from "react";
import { Header } from "./components/Header";
import { TemplatePicker, templates } from "./components/TemplatePicker";
import { PhotoUploader, type PhotoItem } from "./components/PhotoUploader";
import { EditorToolbar } from "./components/EditorToolbar";
import { SheetPreview } from "./components/SheetPreview";
import { ExportBar } from "./components/ExportBar";
import { PhotoAdjuster } from "./components/PhotoAdjuster";
import { BackgroundPicker } from "./components/BackgroundPicker";
import { OperationsPanel } from "./components/OperationsPanel";

export default function Home() {
  const [template, setTemplate] = useState("classic");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [title, setTitle] = useState("Nuestros momentos");
  const [fit, setFit] = useState<"cover" | "contain">("cover");
  const [busy, setBusy] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [background, setBackground] = useState("gray");
  const [editMode, setEditMode] = useState<"move" | "crop">("move");
  const [bleed, setBleed] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const addPhotos = (files: File[]) => {
    const available = Math.max(0, 20 - photos.length);
    const next = files.slice(0, available).map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      x: 50,
      y: 50,
      moveX: 0,
      moveY: 0,
      zoom: 1,
      frameWidth: 100,
      frameHeight: 100,
      widthCm: null,
      heightCm: null,
      copies: 1,
      pixelWidth: 0,
      pixelHeight: 0,
    }));
    setPhotos((current) => [...current, ...next]);
    if (!selectedId && next[0]) setSelectedId(next[0].id);
    next.forEach((photo) => { const image = new Image(); image.onload = () => setPhotos((current) => current.map((item) => item.id === photo.id ? { ...item, pixelWidth: image.naturalWidth, pixelHeight: image.naturalHeight } : item)); image.src = photo.url; });
  };

  const removePhoto = (id: string) => {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((photo) => photo.id !== id);
    });
    if (selectedId === id) setSelectedId(photos.find((photo) => photo.id !== id)?.id ?? null);
  };

  const setPhotoPosition = (id: string, x: number, y: number) => {
    setPhotos((current) => current.map((photo) => photo.id === id ? { ...photo, moveX: x, moveY: y } : photo));
  };

  const setPhotoCrop = (id: string, x: number, y: number) => {
    setPhotos((current) => current.map((photo) => photo.id === id ? { ...photo, x, y } : photo));
  };

  const setPhotoSize = (id: string, frameWidth: number, frameHeight: number) => {
    setPhotos((current) => current.map((photo) => photo.id === id ? { ...photo, frameWidth, frameHeight } : photo));
  };

  const setPhotoFreeform = (id: string, widthCm: number, heightCm: number, moveX: number, moveY: number) => {
    setPhotos((current) => current.map((photo) => photo.id === id ? { ...photo, widthCm, heightCm, moveX, moveY } : photo));
  };

  const updateSelected = (changes: Partial<Pick<PhotoItem, "x" | "y" | "moveX" | "moveY" | "zoom" | "frameWidth" | "frameHeight" | "widthCm" | "heightCm">>) => {
    if (!selectedId) return;
    setPhotos((current) => current.map((photo) => photo.id === selectedId ? { ...photo, ...changes } : photo));
  };

  const startNewJob = () => {
    if (photos.length && !window.confirm("¿Iniciar un nuevo trabajo? Se quitarán todas las fotos del cliente actual.")) return;
    photos.forEach((photo) => URL.revokeObjectURL(photo.url));
    setPhotos([]);
    setSelectedId(null);
    setTemplate("classic");
    setTitle("Nuestros momentos");
    setFit("cover");
    setBackground("gray");
    setEditMode("move");
    setBleed(false);
    setPageIndex(0);
  };

  const expandedPhotos = useMemo(() => photos.flatMap((photo) => Array.from({ length: photo.copies }, (_, copy) => ({ ...photo, instanceId: `${photo.id}-${copy}` }))), [photos]);
  const photosPerSheet = template === "polaroid" ? 15 : 20;
  const sheets = Math.max(1, Math.ceil(expandedPhotos.length / photosPerSheet));
  const visiblePhotos = expandedPhotos.slice(pageIndex * photosPerSheet, pageIndex * photosPerSheet + photosPerSheet);

  const autoArrange = () => {
    const portraitCount = photos.filter((photo) => photo.pixelHeight > photo.pixelWidth).length;
    const nextTemplate = expandedPhotos.length <= 6 ? "cover" : portraitCount > photos.length / 2 ? "portraits" : expandedPhotos.length > 15 ? "classic" : "editorial";
    setTemplate(nextTemplate);
    setFit("cover");
    setEditMode("move");
    setPageIndex(0);
    setPhotos((current) => current.map((photo) => ({ ...photo, x: 50, y: 50, moveX: 0, moveY: 0, zoom: 1, frameWidth: 100, frameHeight: 100, widthCm: null, heightCm: null })));
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
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [329, 483] });
      const originalPage = pageIndex;
      for (let index = 0; index < sheets; index += 1) {
        setPageIndex(index);
        await new Promise((resolve) => setTimeout(resolve, 100));
        const canvas = await html2canvas(sheet, { scale: 2, useCORS: true, backgroundColor: "#e9edef", onclone: (documentClone) => { documentClone.querySelectorAll(".drag-hint,.resize-handle").forEach((element) => element.remove()); documentClone.querySelectorAll(".selected-photo").forEach((element) => element.classList.remove("selected-photo")); } });
        if (index) pdf.addPage([329, 483], "portrait");
        pdf.addImage(canvas.toDataURL("image/jpeg", 0.94), "JPEG", 0, 0, 329, 483);
      }
      setPageIndex(originalPage);
      const safeTitle = title.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s_-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").toLowerCase();
      const today = new Date();
      const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      pdf.save(`${safeTitle || `fotos-super-a3-${date}`}.pdf`);
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
      <Header onNewJob={startNewJob} />
      <div className="app-shell">
        <section className="controls-panel" aria-label="Configuración del álbum">
          <div className="intro-copy">
            <span className="eyebrow">IMPRESIONES</span>
            <h1>Armá tu plantilla<br /><em>Super A3</em></h1>
            <p>Elegí una composición, cargá hasta 20 fotos y acomodá cada encuadre antes de generar el PDF listo para imprimir.</p>
          </div>
          <TemplatePicker selected={template} onSelect={setTemplate} />
          <PhotoUploader photos={photos} onAdd={addPhotos} onRemove={removePhoto} />
          <OperationsPanel totalCopies={expandedPhotos.length} sheets={sheets} bleed={bleed} onBleed={setBleed} onAutoArrange={autoArrange} />
          <EditorToolbar title={title} onTitle={setTitle} fit={fit} onFit={setFit} />
          <BackgroundPicker selected={background} onSelect={setBackground} />
        </section>

        <section className="preview-panel" aria-label="Vista previa">
          <div className="preview-heading">
            <div><span className="step-label">VISTA PREVIA</span><h2>{selected.name}</h2></div>
            <span className="size-badge">SUPER A3 · HOJA {pageIndex + 1}/{sheets}</span>
          </div>
          <div className="sheet-stage">
            <SheetPreview ref={sheetRef} photos={visiblePhotos} template={template} background={background} title={title} fit={fit} editMode={editMode} selectedId={selectedId} onSelect={setSelectedId} onPosition={setPhotoPosition} onCrop={setPhotoCrop} onResize={setPhotoSize} onFreeform={setPhotoFreeform} bleed={bleed} />
          </div>
          {sheets > 1 && <div className="page-nav"><button disabled={!pageIndex} onClick={() => setPageIndex((value) => value - 1)}>Hoja anterior</button><span>{pageIndex + 1} de {sheets}</span><button disabled={pageIndex >= sheets - 1} onClick={() => setPageIndex((value) => value + 1)}>Hoja siguiente</button></div>}
          <PhotoAdjuster photo={selectedPhoto} index={selectedIndex} total={photos.length} mode={editMode} onMode={setEditMode} onZoom={(zoom) => updateSelected({ zoom })} onDimensions={(widthCm, heightCm) => updateSelected({ widthCm, heightCm, ...((selectedPhoto?.widthCm === null || selectedPhoto?.heightCm === null) && widthCm !== null && heightCm !== null ? { moveX: 5, moveY: 5 } : {}) })} onReset={() => updateSelected({ x: 50, y: 50, moveX: 0, moveY: 0, zoom: 1, frameWidth: 100, frameHeight: 100, widthCm: null, heightCm: null })} />
          <ExportBar count={expandedPhotos.length} busy={busy} hasErrors={false} onExport={generatePdf} />
        </section>
      </div>
    </main>
  );
}
