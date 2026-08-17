"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Header } from "./components/Header";
import { TemplatePicker, templates } from "./components/TemplatePicker";
import { PhotoUploader, type PhotoItem } from "./components/PhotoUploader";
import { EditorToolbar } from "./components/EditorToolbar";
import { SheetPreview } from "./components/SheetPreview";
import { ExportBar } from "./components/ExportBar";
import { PhotoAdjuster } from "./components/PhotoAdjuster";
import { BackgroundPicker } from "./components/BackgroundPicker";
import { OperationsPanel, printPresets, type OrderData } from "./components/OperationsPanel";

type HistoryItem = { id: string; customer: string; copies: number; total: number; time: string };

export default function Home() {
  const [template, setTemplate] = useState("classic");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [title, setTitle] = useState("Nuestros momentos");
  const [fit, setFit] = useState<"cover" | "contain">("cover");
  const [busy, setBusy] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [background, setBackground] = useState("gray");
  const [editMode, setEditMode] = useState<"move" | "crop">("move");
  const [preset, setPreset] = useState("10x15");
  const [cropMarks, setCropMarks] = useState(true);
  const [bleed, setBleed] = useState(false);
  const [unitPrice, setUnitPrice] = useState(3500);
  const [pageIndex, setPageIndex] = useState(0);
  const [order, setOrder] = useState<OrderData>({ customer: "", phone: "", orderNumber: "", delivery: "", notes: "" });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => { try { setHistory(JSON.parse(localStorage.getItem("rojas-job-history") || "[]")); } catch { /* historial opcional */ } }, []);

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

  const movePhoto = (index: number, direction: -1 | 1) => {
    setPhotos((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const copy = [...current];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
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

  const setCopies = (id: string, copies: number) => setPhotos((current) => current.map((photo) => photo.id === id ? { ...photo, copies } : photo));

  const updateSelected = (changes: Partial<Pick<PhotoItem, "x" | "y" | "moveX" | "moveY" | "zoom" | "frameWidth" | "frameHeight">>) => {
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
    setPreset("10x15");
    setCropMarks(true);
    setBleed(false);
    setPageIndex(0);
    setOrder({ customer: "", phone: "", orderNumber: "", delivery: "", notes: "" });
  };

  const expandedPhotos = useMemo(() => photos.flatMap((photo) => Array.from({ length: photo.copies }, (_, copy) => ({ ...photo, instanceId: `${photo.id}-${copy}` }))), [photos]);
  const sheets = Math.max(1, Math.ceil(expandedPhotos.length / 20));
  const visiblePhotos = expandedPhotos.slice(pageIndex * 20, pageIndex * 20 + 20);
  const currentPreset = printPresets.find((item) => item.id === preset) ?? printPresets[0];
  const minPixels = Math.round(Math.max(currentPreset.width, currentPreset.height) / 25.4 * 180);
  const lowResolution = photos.filter((photo) => photo.pixelWidth && Math.max(photo.pixelWidth, photo.pixelHeight) < minPixels);
  const preflight = [
    photos.length ? { level: "ok" as const, text: `${expandedPhotos.length} copias distribuidas en ${sheets} hoja${sheets === 1 ? "" : "s"}.` } : { level: "error" as const, text: "Faltan fotografías para imprimir." },
    lowResolution.length ? { level: "warn" as const, text: `${lowResolution.length} foto${lowResolution.length === 1 ? "" : "s"} podría verse pixelada en ${currentPreset.name}.` } : { level: "ok" as const, text: "Resolución adecuada para el tamaño elegido." },
    order.customer.trim() ? { level: "ok" as const, text: `Pedido identificado para ${order.customer.trim()}.` } : { level: "warn" as const, text: "Conviene completar el nombre del cliente." },
    { level: "ok" as const, text: cropMarks ? "Guías de corte activadas." : "Composición sin guías de corte." },
  ];
  const hasErrors = preflight.some((item) => item.level === "error");

  const autoArrange = () => {
    const portraitCount = photos.filter((photo) => photo.pixelHeight > photo.pixelWidth).length;
    const nextTemplate = preset === "carnet" || preset === "documento" ? "contact" : expandedPhotos.length <= 6 ? "cover" : portraitCount > photos.length / 2 ? "portraits" : expandedPhotos.length > 15 ? "classic" : "editorial";
    setTemplate(nextTemplate);
    setFit("cover");
    setEditMode("move");
    setPageIndex(0);
    setPhotos((current) => current.map((photo) => ({ ...photo, x: 50, y: 50, moveX: 0, moveY: 0, zoom: 1, frameWidth: 100, frameHeight: 100 })));
  };

  const rememberJob = () => {
    const next = [{ id: crypto.randomUUID(), customer: order.customer, copies: expandedPhotos.length, total: sheets * unitPrice, time: new Date().toLocaleString("es-AR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) }, ...history].slice(0, 8);
    setHistory(next);
    localStorage.setItem("rojas-job-history", JSON.stringify(next));
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
      pdf.save(`${title.trim().replace(/\s+/g, "-").toLowerCase() || "fotoforma"}.pdf`);
      rememberJob();
    } finally {
      sheet.classList.remove("is-exporting");
      setBusy(false);
    }
  };

  const generateTicket = async () => {
    if (!photos.length) return;
    const { jsPDF } = await import("jspdf");
    const ticket = new jsPDF({ unit: "mm", format: [80, 150] });
    ticket.setFontSize(15); ticket.text("ROJAS IMPRESIONES", 8, 13);
    ticket.setFontSize(9); ticket.text(`Pedido: ${order.orderNumber || "Sin número"}`, 8, 24); ticket.text(`Cliente: ${order.customer || "Sin nombre"}`, 8, 31); ticket.text(`WhatsApp: ${order.phone || "—"}`, 8, 38); ticket.text(`Entrega: ${order.delivery ? new Date(order.delivery).toLocaleString("es-AR") : "A coordinar"}`, 8, 45); ticket.line(8, 51, 72, 51); ticket.text(`${expandedPhotos.length} copias · ${currentPreset.name}`, 8, 59); ticket.text(`${sheets} hoja${sheets === 1 ? "" : "s"} Super A3`, 8, 66); ticket.setFontSize(13); ticket.text(`TOTAL: $${(sheets * unitPrice).toLocaleString("es-AR")}`, 8, 77); ticket.setFontSize(8); ticket.text(`Notas: ${order.notes || "—"}`, 8, 88, { maxWidth: 64 }); ticket.text("Las fotografías no se guardan en el historial.", 8, 128); ticket.save(`pedido-${order.orderNumber || Date.now()}.pdf`);
    rememberJob();
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
          <PhotoUploader photos={photos} onAdd={addPhotos} onRemove={removePhoto} onMove={movePhoto} onCopies={setCopies} />
          <EditorToolbar title={title} onTitle={setTitle} fit={fit} onFit={setFit} />
          <BackgroundPicker selected={background} onSelect={setBackground} />
          <OperationsPanel preset={preset} onPreset={setPreset} totalCopies={expandedPhotos.length} sheets={sheets} cropMarks={cropMarks} bleed={bleed} onCropMarks={setCropMarks} onBleed={setBleed} order={order} onOrder={setOrder} unitPrice={unitPrice} onUnitPrice={setUnitPrice} preflight={preflight} onAutoArrange={autoArrange} history={history} onClearHistory={() => { setHistory([]); localStorage.removeItem("rojas-job-history"); }} />
        </section>

        <section className="preview-panel" aria-label="Vista previa">
          <div className="preview-heading">
            <div><span className="step-label">VISTA PREVIA</span><h2>{selected.name}</h2></div>
            <span className="size-badge">SUPER A3 · HOJA {pageIndex + 1}/{sheets}</span>
          </div>
          <div className="sheet-stage">
            <SheetPreview ref={sheetRef} photos={visiblePhotos} template={template} background={background} title={title} fit={fit} editMode={editMode} selectedId={selectedId} onSelect={setSelectedId} onPosition={setPhotoPosition} onCrop={setPhotoCrop} onResize={setPhotoSize} cropMarks={cropMarks} bleed={bleed} />
          </div>
          {sheets > 1 && <div className="page-nav"><button disabled={!pageIndex} onClick={() => setPageIndex((value) => value - 1)}>Hoja anterior</button><span>{pageIndex + 1} de {sheets}</span><button disabled={pageIndex >= sheets - 1} onClick={() => setPageIndex((value) => value + 1)}>Hoja siguiente</button></div>}
          <PhotoAdjuster photo={selectedPhoto} index={selectedIndex} total={photos.length} mode={editMode} onMode={setEditMode} onZoom={(zoom) => updateSelected({ zoom })} onReset={() => updateSelected({ x: 50, y: 50, moveX: 0, moveY: 0, zoom: 1, frameWidth: 100, frameHeight: 100 })} />
          <ExportBar count={expandedPhotos.length} busy={busy} hasErrors={hasErrors} onTicket={generateTicket} onExport={generatePdf} />
        </section>
      </div>
    </main>
  );
}
