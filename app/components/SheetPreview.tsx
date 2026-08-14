import { forwardRef } from "react";
import { Image as ImageIcon } from "lucide-react";
import type { PhotoItem } from "./PhotoUploader";

export const SheetPreview = forwardRef<HTMLDivElement, { photos: PhotoItem[]; template: string; title: string; fit: "cover" | "contain" }>(function SheetPreview({ photos, template, title, fit }, ref) {
  return <div ref={ref} className={`paper template-${template}`}><div className="paper-head"><span>FOTOFORMA · COLECCIÓN PERSONAL</span><span>{new Date().getFullYear()}</span></div><div className="paper-title"><h3>{title || "Sin título"}</h3><span>{photos.length} {photos.length === 1 ? "momento" : "momentos"}</span></div><div className="photo-composition">{photos.length ? photos.map((photo, index) => <figure key={photo.id} className={`photo-cell cell-${index + 1}`}><img src={photo.url} alt={photo.name} style={{ objectFit: fit }} /><figcaption>{String(index + 1).padStart(2, "0")}</figcaption></figure>) : <div className="empty-sheet"><ImageIcon size={38} strokeWidth={1} /><p>Tu historia empieza acá</p><span>Agregá fotos para ver la composición</span></div>}</div><div className="paper-foot"><span>SUPER A3</span><i /><span>329 × 483 MM</span></div></div>;
});
