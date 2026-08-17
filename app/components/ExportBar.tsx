import { Download, ReceiptText } from "lucide-react";

export function ExportBar({ count, busy, hasErrors, onTicket, onExport }: { count: number; busy: boolean; hasErrors: boolean; onTicket: () => void; onExport: () => void }) {
  return <div className="export-bar"><div><span>{hasErrors ? "REVISÁ EL TRABAJO" : count ? "LISTA PARA CREAR" : "FALTAN TUS FOTOS"}</span><p>{count ? `${count} copias · PDF Super A3 en alta resolución` : "Cargá al menos una imagen para continuar"}</p></div><div className="export-actions"><button className="ticket-button" disabled={!count || busy} onClick={onTicket}><ReceiptText size={17} />Ticket</button><button disabled={!count || busy || hasErrors} onClick={onExport}><Download size={18} />{busy ? "Generando…" : "Generar PDF"}</button></div></div>;
}
