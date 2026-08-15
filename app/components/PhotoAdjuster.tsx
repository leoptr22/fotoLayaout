import { Grip, RotateCcw, ZoomIn } from "lucide-react";
import type { PhotoItem, PhotoShape } from "./PhotoUploader";

const shapes: { id: PhotoShape; name: string }[] = [
  { id: "rectangle", name: "Rectángulo" }, { id: "rounded", name: "Redondeado" },
  { id: "circle", name: "Círculo" }, { id: "heart", name: "Corazón" },
  { id: "diamond", name: "Rombo" }, { id: "hexagon", name: "Hexágono" },
  { id: "star", name: "Estrella" }, { id: "arch", name: "Arco" },
];

export function PhotoAdjuster({ photo, index, total, onZoom, onShape, onReset }: { photo?: PhotoItem; index: number; total: number; onZoom: (zoom: number) => void; onShape: (shape: PhotoShape) => void; onReset: () => void }) {
  return <div className={`photo-adjuster ${photo ? "is-active" : ""}`} aria-live="polite">
    {photo ? <>
      <div className="adjuster-photo"><img src={photo.url} alt="" /><div><strong>Foto {index + 1} de {total}</strong><span>Tocá otra imagen para seleccionarla</span></div></div>
      <div className="drag-instruction"><Grip size={18} /><div><strong>Ubicación libre</strong><span>Arrastrá la foto a cualquier lugar de la hoja</span></div></div>
      <label className="zoom-control"><span><ZoomIn size={15} /> Tamaño</span><input aria-label="Tamaño de la foto" type="range" min="1" max="2.2" step="0.05" value={photo.zoom} onChange={(event) => onZoom(Number(event.target.value))} /><b>{Math.round(photo.zoom * 100)}%</b></label>
      <div className="shape-control"><strong>Forma</strong><div className="shape-options">{shapes.map((shape) => <button key={shape.id} className={photo.shape === shape.id ? "active" : ""} onClick={() => onShape(shape.id)} title={shape.name} aria-label={`Aplicar forma ${shape.name}`} aria-pressed={photo.shape === shape.id}><i className={`shape-icon shape-icon-${shape.id}`} /><span>{shape.name}</span></button>)}</div></div>
      <button className="reset-photo" onClick={onReset}><RotateCcw size={15} /> Restablecer</button>
    </> : <div className="adjuster-empty"><strong>Seleccioná una foto</strong><span>Después podés moverla, cambiar su tamaño y ajustar el encuadre.</span></div>}
  </div>;
}
