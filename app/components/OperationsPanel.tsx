import { LayoutGrid } from "lucide-react";

export function OperationsPanel({ totalCopies, sheets, bleed, onBleed, onAutoArrange }: { totalCopies: number; sheets: number; bleed: boolean; onBleed: (value: boolean) => void; onAutoArrange: () => void }) {
  return <section className="control-section operations-panel"><div className="section-title"><span>05</span><div><h2>Preparación rápida</h2><p>Configuración y control técnico en un solo lugar.</p></div></div>
    <button className="auto-button auto-button-wide" onClick={onAutoArrange}><LayoutGrid size={16} /><span><strong>Ordenar automáticamente</strong><small>Elige plantilla y aprovecha la hoja</small></span></button>
    <div className="quick-toggles"><label><input type="checkbox" checked={bleed} onChange={(e) => onBleed(e.target.checked)} /> Sangrado 3 mm</label></div>
    <div className="sheet-summary"><strong>{totalCopies} copias</strong><span>{sheets} hoja{sheets === 1 ? "" : "s"} Super A3</span></div>
  </section>;
}
