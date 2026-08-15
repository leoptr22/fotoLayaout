"use client";

import { useRef } from "react";
import type { PhotoItem } from "./PhotoUploader";

export function DraggablePhoto({ photo, index, fit, selected, onSelect, onPosition, onResize, onSwap }: { photo: PhotoItem; index: number; fit: "cover" | "contain"; selected: boolean; onSelect: (id: string) => void; onPosition: (id: string, x: number, y: number) => void; onResize: (id: string, frameWidth: number, frameHeight: number) => void; onSwap: (sourceId: string, targetId: string) => void }) {
  const start = useRef({ clientX: 0, clientY: 0, x: 50, y: 50 });
  const dragging = useRef(false);
  const resizeStart = useRef({ active: false, x: 0, y: 0, width: 100, height: 100, pixelWidth: 1, pixelHeight: 1, axis: "both" as "width" | "height" | "both" });
  const clamp = (value: number) => Math.max(0, Math.min(100, value));
  const clampSize = (value: number) => Math.max(55, Math.min(180, value));
  const beginResize = (event: React.PointerEvent<HTMLButtonElement>, axis: "width" | "height" | "both") => { event.preventDefault(); event.stopPropagation(); const rect = event.currentTarget.parentElement!.getBoundingClientRect(); resizeStart.current = { active: true, x: event.clientX, y: event.clientY, width: photo.frameWidth, height: photo.frameHeight, pixelWidth: rect.width, pixelHeight: rect.height, axis }; event.currentTarget.setPointerCapture(event.pointerId); };
  const continueResize = (event: React.PointerEvent<HTMLButtonElement>) => { event.stopPropagation(); const start = resizeStart.current; if (!start.active) return; const width = start.axis === "height" ? start.width : clampSize(start.width + ((event.clientX - start.x) / start.pixelWidth) * start.width); const height = start.axis === "width" ? start.height : clampSize(start.height + ((event.clientY - start.y) / start.pixelHeight) * start.height); onResize(photo.id, width, height); };
  return <figure className={`photo-cell cell-${index + 1} shape-${photo.shape} ${selected ? "selected-photo" : ""}`} tabIndex={0} aria-label={`Foto ${index + 1}. Arrastrá o usá las flechas para ajustar el encuadre.`}
    onPointerDown={(event) => { onSelect(photo.id); dragging.current = true; start.current = { clientX: event.clientX, clientY: event.clientY, x: photo.x, y: photo.y }; event.currentTarget.setPointerCapture(event.pointerId); }}
    onPointerMove={(event) => { if (!dragging.current || fit === "contain") return; const rect = event.currentTarget.getBoundingClientRect(); onPosition(photo.id, clamp(start.current.x - ((event.clientX - start.current.clientX) / rect.width) * 55), clamp(start.current.y - ((event.clientY - start.current.clientY) / rect.height) * 55)); }}
    onPointerUp={(event) => { const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-photo-id]")?.dataset.photoId; if (target && target !== photo.id) onSwap(photo.id, target); dragging.current = false; }} onPointerCancel={() => { dragging.current = false; }}
    onKeyDown={(event) => { const d = event.shiftKey ? 10 : 3; if (event.key === "ArrowLeft") onPosition(photo.id, clamp(photo.x - d), photo.y); if (event.key === "ArrowRight") onPosition(photo.id, clamp(photo.x + d), photo.y); if (event.key === "ArrowUp") onPosition(photo.id, photo.x, clamp(photo.y - d)); if (event.key === "ArrowDown") onPosition(photo.id, photo.x, clamp(photo.y + d)); }}
    data-photo-id={photo.id} style={{ width: `${photo.frameWidth}%`, height: `${photo.frameHeight}%` }}>
    <img draggable={false} src={photo.url} alt={photo.name} style={{ objectFit: fit, objectPosition: `${photo.x}% ${photo.y}%`, transform: `scale(${photo.zoom})` }} />
    <span className="drag-hint">ARRASTRÁ PARA ENCUADRAR</span>
    {selected && <><button className="resize-handle resize-right" aria-label="Ajustar ancho" onPointerDown={(event) => beginResize(event, "width")} onPointerMove={continueResize} onPointerUp={() => { resizeStart.current.active = false; }} /><button className="resize-handle resize-bottom" aria-label="Ajustar alto" onPointerDown={(event) => beginResize(event, "height")} onPointerMove={continueResize} onPointerUp={() => { resizeStart.current.active = false; }} /><button className="resize-handle resize-corner" aria-label="Ajustar ancho y alto" onPointerDown={(event) => beginResize(event, "both")} onPointerMove={continueResize} onPointerUp={() => { resizeStart.current.active = false; }} /></>}
  </figure>;
}
