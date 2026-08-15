import { forwardRef } from "react";
import { Image as ImageIcon } from "lucide-react";
import type { PhotoItem } from "./PhotoUploader";
import { DraggablePhoto } from "./DraggablePhoto";

export const SheetPreview = forwardRef<HTMLDivElement, { photos: PhotoItem[]; template: string; title: string; fit: "cover" | "contain"; selectedId: string | null; onSelect: (id: string) => void; onPosition: (id: string, x: number, y: number) => void; onResize: (id: string, frameWidth: number, frameHeight: number) => void; onSwap: (sourceId: string, targetId: string) => void }>(function SheetPreview({ photos, template, title, fit, selectedId, onSelect, onPosition, onResize, onSwap }, ref) {
  return <div ref={ref} className={`paper template-${template} ${photos.length > 12 ? "is-full" : ""}`}><div className="paper-title"><h3>{title || "Sin título"}</h3></div><div className="photo-composition">{photos.length ? photos.map((photo, index) => <DraggablePhoto key={photo.id} photo={photo} index={index} fit={fit} selected={selectedId === photo.id} onSelect={onSelect} onPosition={onPosition} onResize={onResize} onSwap={onSwap} />) : <div className="empty-sheet"><ImageIcon size={38} strokeWidth={1} /><p>Tu composición empieza acá</p><span>Agregá fotos para ver la plantilla</span></div>}</div></div>;
});
