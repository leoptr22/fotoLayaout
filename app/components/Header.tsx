import { Plus, ShieldCheck } from "lucide-react";

export function Header({ onNewJob }: { onNewJob: () => void }) {
  return <header className="topbar"><a className="brand" href="#"><img className="brand-logo" src="/rojas-logo.png" alt="Rojas Impresiones" /></a><div className="header-product"><strong>Plantillas fotográficas</strong><small>Super A3</small></div><span className="privacy-note"><ShieldCheck size={15} /><span><strong>Trabajo privado</strong><small>Las fotos quedan en este equipo</small></span></span><button className="new-job-button" onClick={onNewJob}><Plus size={17} /> Nuevo trabajo</button></header>;
}
