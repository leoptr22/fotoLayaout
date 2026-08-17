import { Download } from "lucide-react";

export function ExportBar({ count, busy, hasErrors, onExport }: { count: number; busy: boolean; hasErrors: boolean; onExport: () => void }) {
  return <div className="export-bar"><div><span>{hasErrors ? "REVISÁ EL TRABAJO" : count ? "LISTA PARA CREAR" : "FALTAN TUS FOTOS"}</span><p>{count ? `${count} copias · PDF Super A3 en alta resolución` : "Cargá al menos una imagen para continuar"}</p></div><button disabled={!count || busy || hasErrors} onClick={onExport}><Download size={18} />{busy ? "Generando…" : "Generar PDF"}</button></div>;
}
