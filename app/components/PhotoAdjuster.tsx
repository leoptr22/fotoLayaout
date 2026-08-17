import { Crop, Move, RotateCcw, ZoomIn } from "lucide-react";
import type { PhotoItem } from "./PhotoUploader";

export function PhotoAdjuster({ photo, index, total, mode, onMode, onZoom, onReset }: { photo?: PhotoItem; index: number; total: number; mode: "move" | "crop"; onMode: (mode: "move" | "crop") => void; onZoom: (zoom: number) => void; onReset: () => void }) {
  return <div className={`photo-adjuster ${photo ? "is-active" : ""}`} aria-live="polite">
    {photo ? <>
      <div className="adjuster-photo"><img src={photo.url} alt="" /><div><strong>Foto {index + 1} de {total}</strong><span>Tocá otra imagen para seleccionarla</span></div></div>
      <div className="edit-mode-control" aria-label="Acción al arrastrar"><button className={mode === "move" ? "active" : ""} onClick={() => onMode("move")} aria-pressed={mode === "move"}><Move size={15} /><span><strong>Mover en la hoja</strong><small>Desplaza el recuadro completo</small></span></button><button className={mode === "crop" ? "active" : ""} onClick={() => onMode("crop")} aria-pressed={mode === "crop"}><Crop size={15} /><span><strong>Ajustar encuadre</strong><small>Mueve la imagen dentro del recuadro</small></span></button></div>
      <label className="zoom-control"><span><ZoomIn size={15} /> Tamaño</span><input aria-label="Tamaño de la foto" type="range" min="1" max="2.2" step="0.05" value={photo.zoom} onChange={(event) => onZoom(Number(event.target.value))} /><b>{Math.round(photo.zoom * 100)}%</b></label>
      <button className="reset-photo" onClick={onReset}><RotateCcw size={15} /> Restablecer</button>
    </> : <div className="adjuster-empty"><strong>Seleccioná una foto</strong><span>Después podés moverla, cambiar su tamaño y ajustar el encuadre.</span></div>}
  </div>;
}
