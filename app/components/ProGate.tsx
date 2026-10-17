import Link from 'next/link';
export function ProGate({title,children}:{title:string;children?:React.ReactNode}) {
  return <section className="pro-gate"><span className="pro-pill">Pro</span><h3>{title}</h3>{children}<p>Keep exploring for free. Pro adds compare mode, the history slider and HD country cards.</p><Link href="/pro" className="ts-button">Explore Pro ↗</Link><small>Payments are not open yet.</small></section>;
}
