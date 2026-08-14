import { Aperture } from "lucide-react";

export function Header() {
  return <header className="topbar"><a className="brand" href="#"><Aperture size={23} strokeWidth={1.6} /><span>fotoforma</span></a><p>Composiciones para guardar lo que importa</p><span className="draft-pill">PROYECTO LOCAL</span></header>;
}
