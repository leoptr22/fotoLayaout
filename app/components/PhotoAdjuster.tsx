import { Grip, RotateCcw, ZoomIn } from "lucide-react";
import type { PhotoItem } from "./PhotoUploader";

export function PhotoAdjuster({ photo, index, total, onZoom, onReset }: { photo?: PhotoItem; index: number; total: number; onZoom: (zoom: number) => void; onReset: () => void }) {
  return <div className={`photo-adjuster ${photo ? "is-active" : ""}`} aria-live="polite">
    {photo ? <>
      <div className="adjuster-photo"><img src={photo.url} alt="" /><div><strong>Foto {index + 1} de {total}</strong><span>Tocá otra imagen para seleccionarla</span></div></div>
      <div className="drag-instruction"><Grip size={18} /><div><strong>Mover y dimensionar</strong><span>Arrastrá la foto o sus bordes destacados</span></div></div>
      <label className="zoom-control"><span><ZoomIn size={15} /> Tamaño</span><input aria-label="Tamaño de la foto" type="range" min="1" max="2.2" step="0.05" value={photo.zoom} onChange={(event) => onZoom(Number(event.target.value))} /><b>{Math.round(photo.zoom * 100)}%</b></label>
      <button className="reset-photo" onClick={onReset}><RotateCcw size={15} /> Restablecer</button>
    </> : <div className="adjuster-empty"><strong>Seleccioná una foto</strong><span>Después podés moverla, cambiar su tamaño y ajustar el encuadre.</span></div>}
  </div>;
}
