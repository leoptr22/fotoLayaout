"use client";

import { useRef } from "react";
import type { PhotoItem } from "./PhotoUploader";

export function DraggablePhoto({ photo, index, fit, selected, onSelect, onPosition, onSwap }: { photo: PhotoItem; index: number; fit: "cover" | "contain"; selected: boolean; onSelect: (id: string) => void; onPosition: (id: string, x: number, y: number) => void; onSwap: (sourceId: string, targetId: string) => void }) {
  const start = useRef({ clientX: 0, clientY: 0, x: 50, y: 50 });
  const dragging = useRef(false);
  const clamp = (value: number) => Math.max(0, Math.min(100, value));
  return <figure className={`photo-cell cell-${index + 1} ${selected ? "selected-photo" : ""}`} tabIndex={0} aria-label={`Foto ${index + 1}. Arrastrá o usá las flechas para ajustar el encuadre.`}
    onPointerDown={(event) => { onSelect(photo.id); dragging.current = true; start.current = { clientX: event.clientX, clientY: event.clientY, x: photo.x, y: photo.y }; event.currentTarget.setPointerCapture(event.pointerId); }}
    onPointerMove={(event) => { if (!dragging.current || fit === "contain") return; const rect = event.currentTarget.getBoundingClientRect(); onPosition(photo.id, clamp(start.current.x - ((event.clientX - start.current.clientX) / rect.width) * 55), clamp(start.current.y - ((event.clientY - start.current.clientY) / rect.height) * 55)); }}
    onPointerUp={(event) => { const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-photo-id]")?.dataset.photoId; if (target && target !== photo.id) onSwap(photo.id, target); dragging.current = false; }} onPointerCancel={() => { dragging.current = false; }}
    onKeyDown={(event) => { const d = event.shiftKey ? 10 : 3; if (event.key === "ArrowLeft") onPosition(photo.id, clamp(photo.x - d), photo.y); if (event.key === "ArrowRight") onPosition(photo.id, clamp(photo.x + d), photo.y); if (event.key === "ArrowUp") onPosition(photo.id, photo.x, clamp(photo.y - d)); if (event.key === "ArrowDown") onPosition(photo.id, photo.x, clamp(photo.y + d)); }}
    data-photo-id={photo.id}>
    <img draggable={false} src={photo.url} alt={photo.name} style={{ objectFit: fit, objectPosition: `${photo.x}% ${photo.y}%`, transform: `scale(${photo.zoom})` }} />
    <span className="drag-hint">ARRASTRÁ PARA ENCUADRAR</span>
  </figure>;
}
