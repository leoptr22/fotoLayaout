import { forwardRef } from "react";
import { Image as ImageIcon } from "lucide-react";
import type { PhotoItem } from "./PhotoUploader";
import { DraggablePhoto } from "./DraggablePhoto";

export const SheetPreview = forwardRef<HTMLDivElement, { photos: Array<PhotoItem & { instanceId?: string }>; template: string; background: string; title: string; fit: "cover" | "contain"; editMode: "move" | "crop"; selectedId: string | null; onSelect: (id: string) => void; onPosition: (id: string, x: number, y: number) => void; onCrop: (id: string, x: number, y: number) => void; onResize: (id: string, frameWidth: number, frameHeight: number) => void; bleed: boolean }>(function SheetPreview({ photos, template, background, title, fit, editMode, selectedId, onSelect, onPosition, onCrop, onResize, bleed }, ref) {
  return <div ref={ref} className={`paper template-${template} bg-${background} ${photos.length > 12 ? "is-full" : ""} ${bleed ? "with-bleed" : ""} ${title.trim() ? "has-title" : "no-title"}`}>{title.trim() && <div className="paper-title"><h3>{title}</h3></div>}<div className="photo-composition">{photos.length ? photos.map((photo, index) => <DraggablePhoto key={photo.instanceId ?? photo.id} photo={photo} index={index} fit={fit} editMode={editMode} selected={selectedId === photo.id} onSelect={onSelect} onPosition={onPosition} onCrop={onCrop} onResize={onResize} />) : <div className="empty-sheet"><ImageIcon size={38} strokeWidth={1} /><p>Tu composición empieza acá</p><span>Agregá fotos para ver la plantilla</span></div>}</div></div>;
});
