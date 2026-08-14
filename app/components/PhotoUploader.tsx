import { ArrowLeft, ArrowRight, ImagePlus, Trash2 } from "lucide-react";
import { useRef } from "react";

export type PhotoItem = { id: string; name: string; url: string };

export function PhotoUploader({ photos, onAdd, onRemove, onMove }: { photos: PhotoItem[]; onAdd: (files: File[]) => void; onRemove: (id: string) => void; onMove: (index: number, direction: -1 | 1) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const receive = (list: FileList | null) => list && onAdd(Array.from(list).filter((file) => file.type.startsWith("image/")));
  return <section className="control-section"><div className="section-title"><span>02</span><div><h2>Sumá tus fotos</h2><p>{photos.length} de 20 imágenes</p></div></div><button className="dropzone" disabled={photos.length >= 20} onClick={() => input.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); receive(e.dataTransfer.files); }}><ImagePlus size={24} /><strong>{photos.length ? "Agregar más fotos" : "Seleccionar fotos"}</strong><span>JPG, PNG o WEBP · hasta 20</span></button><input ref={input} hidden multiple type="file" accept="image/*" onChange={(e) => receive(e.target.files)} />{photos.length > 0 && <div className="photo-list">{photos.map((photo, index) => <div className="photo-row" key={photo.id}><img src={photo.url} alt="" /><span>{String(index + 1).padStart(2, "0")}</span><p title={photo.name}>{photo.name}</p><button aria-label="Mover atrás" disabled={!index} onClick={() => onMove(index, -1)}><ArrowLeft size={15} /></button><button aria-label="Mover adelante" disabled={index === photos.length - 1} onClick={() => onMove(index, 1)}><ArrowRight size={15} /></button><button aria-label="Eliminar" onClick={() => onRemove(photo.id)}><Trash2 size={15} /></button></div>)}</div>}</section>;
}
