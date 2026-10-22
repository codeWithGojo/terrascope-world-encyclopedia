// CSS owns this finite transition so the site-wide pause control also stops it.
export function PageTransition({children}:{children:React.ReactNode}){return <div className="page-transition">{children}</div>;}
