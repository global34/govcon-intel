import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/signals", label: "Signals" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/premium", label: "Premium" },
  { href: "/admin/review", label: "Review" },
  { href: "/admin/ops", label: "Ops" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container site-header__inner">
          <Link className="brand" href="/">
            <span className="brand__eyebrow">SDVOSBNews.com</span>
            <span className="brand__name">Veteran-owned federal intelligence</span>
          </Link>
          <nav className="site-nav" aria-label="Primary">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container site-footer__inner">
          <div>
            <p className="site-footer__title">Signal-first GovCon intelligence for SDVOSBs and VOSBs.</p>
            <p className="site-footer__copy">
              Public signals drive subscriber growth. Review-backed workflows drive trust.
            </p>
          </div>
          <div className="site-footer__links">
            <Link href="/newsletter">Join the list</Link>
            <Link href="/premium">Premium intelligence</Link>
            <Link href="/admin/review">Internal review</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
