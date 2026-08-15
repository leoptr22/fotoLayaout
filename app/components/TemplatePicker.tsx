export const templates = [
  { id: "classic", name: "Cuadrícula", mark: "▦", note: "Orden limpio" },
  { id: "polaroid", name: "Polaroid", mark: "◇", note: "Nostalgia casual" },
  { id: "editorial", name: "Editorial", mark: "▥", note: "Ritmo de revista" },
  { id: "mosaic", name: "Mosaico", mark: "▤", note: "Dinámico" },
  { id: "gallery", name: "Galería", mark: "▩", note: "Con aire" },
  { id: "organic", name: "Orgánica", mark: "◌", note: "Libre y suave" },
  { id: "cover", name: "Portada", mark: "▣", note: "Una foto protagonista" },
  { id: "panorama", name: "Panorama", mark: "═", note: "Franjas horizontales" },
  { id: "contact", name: "Contacto", mark: "▦", note: "Compacta y completa" },
  { id: "portraits", name: "Retratos", mark: "▯", note: "Formato vertical" },
  { id: "album", name: "Álbum", mark: "◫", note: "Clásico con márgenes" },
];

export function TemplatePicker({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return <section className="control-section"><div className="section-title"><span>01</span><div><h2>Elegí una plantilla</h2><p>Doce maneras de contar tu historia.</p></div></div><div className="template-grid">{templates.map((item) => <button key={item.id} className={`template-card ${selected === item.id ? "selected" : ""}`} onClick={() => onSelect(item.id)}><span className="template-mark">{item.mark}</span><strong>{item.name}</strong><small>{item.note}</small></button>)}</div></section>;
}
