import { Download } from "lucide-react";

export function ExportBar({ count, busy, onExport }: { count: number; busy: boolean; onExport: () => void }) {
  return <div className="export-bar"><div><span>{count ? "LISTA PARA CREAR" : "FALTAN TUS FOTOS"}</span><p>{count ? `${count} imágenes · PDF en alta resolución` : "Cargá al menos una imagen para continuar"}</p></div><button disabled={!count || busy} onClick={onExport}><Download size={18} />{busy ? "Generando…" : "Generar PDF"}</button></div>;
}
