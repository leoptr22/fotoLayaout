import { Calculator, CheckCircle2, Clock3, LayoutGrid, Scissors, TicketCheck, TriangleAlert } from "lucide-react";

export type OrderData = { customer: string; phone: string; orderNumber: string; delivery: string; notes: string };
export type PrintPreset = { id: string; name: string; width: number; height: number; price: number };
export const printPresets: PrintPreset[] = [
  { id: "10x15", name: "10 × 15 cm", width: 100, height: 150, price: 650 },
  { id: "13x18", name: "13 × 18 cm", width: 130, height: 180, price: 900 },
  { id: "15x21", name: "15 × 21 cm", width: 150, height: 210, price: 1200 },
  { id: "carnet", name: "Carnet 4 × 4", width: 40, height: 40, price: 350 },
  { id: "documento", name: "Documento 3 × 4", width: 30, height: 40, price: 300 },
];

export type PreflightItem = { level: "ok" | "warn" | "error"; text: string };

export function OperationsPanel({ preset, onPreset, totalCopies, sheets, cropMarks, bleed, onCropMarks, onBleed, order, onOrder, unitPrice, onUnitPrice, preflight, onAutoArrange, history, onClearHistory }: { preset: string; onPreset: (id: string) => void; totalCopies: number; sheets: number; cropMarks: boolean; bleed: boolean; onCropMarks: (value: boolean) => void; onBleed: (value: boolean) => void; order: OrderData; onOrder: (data: OrderData) => void; unitPrice: number; onUnitPrice: (value: number) => void; preflight: PreflightItem[]; onAutoArrange: () => void; history: Array<{ id: string; customer: string; copies: number; total: number; time: string }>; onClearHistory: () => void }) {
  const total = sheets * unitPrice;
  const update = (field: keyof OrderData, value: string) => onOrder({ ...order, [field]: value });
  return <section className="control-section operations-panel"><div className="section-title"><span>05</span><div><h2>Trabajo rápido</h2><p>Configuración, control y precio en un solo lugar.</p></div></div>
    <div className="preset-row"><label>Tamaño comercial<select value={preset} onChange={(e) => onPreset(e.target.value)}>{printPresets.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><button className="auto-button" onClick={onAutoArrange}><LayoutGrid size={16} /><span><strong>Ordenar automáticamente</strong><small>Elige plantilla y aprovecha la hoja</small></span></button></div>
    <div className="quick-toggles"><label><input type="checkbox" checked={cropMarks} onChange={(e) => onCropMarks(e.target.checked)} /><Scissors size={14} /> Guías de corte</label><label><input type="checkbox" checked={bleed} onChange={(e) => onBleed(e.target.checked)} /> Sangrado 3 mm</label></div>
    <div className="order-fields"><label>Cliente<input value={order.customer} onChange={(e) => update("customer", e.target.value)} placeholder="Nombre y apellido" /></label><label>WhatsApp<input value={order.phone} onChange={(e) => update("phone", e.target.value)} placeholder="3446…" /></label><label>N.º de pedido<input value={order.orderNumber} onChange={(e) => update("orderNumber", e.target.value)} placeholder="Automático" /></label><label>Entrega<input type="datetime-local" value={order.delivery} onChange={(e) => update("delivery", e.target.value)} /></label><label className="wide">Observaciones<input value={order.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Papel, terminación, urgencia…" /></label></div>
    <div className="preflight"><div className="mini-heading"><TicketCheck size={16} /><strong>Preparar para imprimir</strong></div>{preflight.map((item, index) => <div key={index} className={`check-row ${item.level}`}>{item.level === "ok" ? <CheckCircle2 size={14} /> : <TriangleAlert size={14} />}<span>{item.text}</span></div>)}</div>
    <div className="price-box"><Calculator size={18} /><div><span>{totalCopies} copias · {sheets} hoja{sheets === 1 ? "" : "s"}</span><strong>Total estimado: ${total.toLocaleString("es-AR")}</strong></div><label>Precio/hoja $<input type="number" min="0" step="100" value={unitPrice} onChange={(e) => onUnitPrice(Number(e.target.value))} /></label></div>
    {history.length > 0 && <details className="job-history"><summary><Clock3 size={14} /> Últimos trabajos ({history.length})</summary>{history.map((item) => <div key={item.id}><span>{item.time}</span><strong>{item.customer || "Sin nombre"}</strong><small>{item.copies} copias · ${item.total.toLocaleString("es-AR")}</small></div>)}<button onClick={onClearHistory}>Borrar historial</button></details>}
  </section>;
}
