import { ImagePlus, Trash2 } from "lucide-react";
import { useRef } from "react";

export type PhotoItem = { id: string; name: string; url: string; x: number; y: number; moveX: number; moveY: number; zoom: number; frameWidth: number; frameHeight: number; widthCm: number | null; heightCm: number | null; copies: number; pixelWidth: number; pixelHeight: number };

export function PhotoUploader({ photos, onAdd, onRemove }: { photos: PhotoItem[]; onAdd: (files: File[]) => void; onRemove: (id: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const receive = (list: FileList | null) => list && onAdd(Array.from(list).filter((file) => file.type.startsWith("image/")));
  return <section className="control-section"><div className="section-title"><span>02</span><div><h2>Sumá tus fotos</h2><p>{photos.length} archivo{photos.length === 1 ? "" : "s"}</p></div></div><button className="dropzone" disabled={photos.length >= 20} onClick={() => input.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); receive(e.dataTransfer.files); }}><ImagePlus size={24} /><strong>{photos.length ? "Agregar más fotos" : "Seleccionar fotos"}</strong><span>JPG, PNG o WEBP · hasta 20 archivos</span></button><input ref={input} hidden multiple type="file" accept="image/*" onChange={(e) => receive(e.target.files)} />{photos.length > 0 && <div className="photo-list">{photos.map((photo, index) => <div className="photo-row" key={photo.id}><img src={photo.url} alt="" /><span>{String(index + 1).padStart(2, "0")}</span><p title={photo.name}>{photo.name}</p><button aria-label={`Eliminar ${photo.name}`} title="Eliminar" onClick={() => onRemove(photo.id)}><Trash2 size={15} /></button></div>)}</div>}</section>;
}
