import Link from "next/link";
import CurrencySwitcher from "./CurrencySwitcher";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link href="/" className="logo">
          GEMORA
        </Link>
      </div>
      <div className="nav-right">
        <Link href="/listing">Products</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <CurrencySwitcher />
      </div>
    </nav>
  );
}
