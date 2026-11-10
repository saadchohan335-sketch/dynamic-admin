
import Link from "next/link";
import "./admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dyn-shell">
      <header className="dyn-header">
        <Link href="/admin" className="dyn-logo">
          Dynamic Store
        </Link>
        <Link href="/" className="dyn-site-link">
          View Website
        </Link>
      </header>

      <div className="dyn-body">
        <aside className="dyn-sidebar">
          <Link href="/products" className="dyn-nav-link">
            Products
          </Link>
          <Link href="/add-product" className="dyn-nav-link">
            Add Product
          </Link>
        </aside>

        <div className="dyn-content">{children}</div>
      </div>
    </div>
  );
}
