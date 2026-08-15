export const backgrounds = [
  { id: "gray", name: "Gris claro" },
  { id: "white", name: "Blanco" },
  { id: "cream", name: "Crema" },
  { id: "rose", name: "Rosa suave" },
  { id: "sky", name: "Celeste" },
  { id: "charcoal", name: "Carbón" },
  { id: "dots", name: "Puntos" },
  { id: "cmyk", name: "CMYK" },
];

export function BackgroundPicker({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return <section className="control-section"><div className="section-title"><span>04</span><div><h2>Elegí un fondo</h2><p>Se aplica a la vista previa y al PDF.</p></div></div><div className="background-grid">{backgrounds.map((background) => <button key={background.id} className={`background-option bg-swatch-${background.id} ${selected === background.id ? "selected" : ""}`} onClick={() => onSelect(background.id)} aria-pressed={selected === background.id}><i /><span>{background.name}</span></button>)}</div></section>;
}
