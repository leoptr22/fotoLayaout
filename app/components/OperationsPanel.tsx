import { LayoutGrid } from "lucide-react";

export type PrintPreset = { id: string; name: string; width: number; height: number; price: number };
export const printPresets: PrintPreset[] = [
  { id: "10x15", name: "10 × 15 cm", width: 100, height: 150, price: 650 },
  { id: "13x18", name: "13 × 18 cm", width: 130, height: 180, price: 900 },
  { id: "15x21", name: "15 × 21 cm", width: 150, height: 210, price: 1200 },
  { id: "carnet", name: "Carnet 4 × 4", width: 40, height: 40, price: 350 },
  { id: "documento", name: "Documento 3 × 4", width: 30, height: 40, price: 300 },
];

export function OperationsPanel({ preset, onPreset, totalCopies, sheets, bleed, onBleed, onAutoArrange }: { preset: string; onPreset: (id: string) => void; totalCopies: number; sheets: number; bleed: boolean; onBleed: (value: boolean) => void; onAutoArrange: () => void }) {
  return <section className="control-section operations-panel"><div className="section-title"><span>05</span><div><h2>Preparación rápida</h2><p>Configuración y control técnico en un solo lugar.</p></div></div>
    <div className="preset-row"><label>Tamaño comercial<select value={preset} onChange={(e) => onPreset(e.target.value)}>{printPresets.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><button className="auto-button" onClick={onAutoArrange}><LayoutGrid size={16} /><span><strong>Ordenar automáticamente</strong><small>Elige plantilla y aprovecha la hoja</small></span></button></div>
    <div className="quick-toggles"><label><input type="checkbox" checked={bleed} onChange={(e) => onBleed(e.target.checked)} /> Sangrado 3 mm</label></div>
    <div className="sheet-summary"><strong>{totalCopies} copias</strong><span>{sheets} hoja{sheets === 1 ? "" : "s"} Super A3</span></div>
  </section>;
}
