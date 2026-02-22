import { Link, useLocation } from "react-router-dom";
import FloatingYModel from "./FloatingYModel";
import { useState } from "react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Projects", path: "/projects" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/appointment" },
];

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-14 px-6">

          {/* Logo — always left */}
          <Link to="/" className="flex items-center gap-2" style={{ pointerEvents: "auto" }}>
            <FloatingYModel size={32} mode="inline" />
            <span className="font-bold text-base text-foreground tracking-widest uppercase">
              surf
            </span>
          </Link>

          {/* Desktop nav — items right */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xs tracking-widest uppercase transition-colors duration-150 ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setOpen(true)}
            className="flex md:hidden flex-col gap-1.5 p-1 group"
            aria-label="Open menu"
          >
            <span className="block w-6 h-px bg-foreground transition-all duration-200 group-hover:w-4" />
            <span className="block w-4 h-px bg-foreground transition-all duration-200 group-hover:w-6" />
            <span className="block w-5 h-px bg-foreground transition-all duration-200 group-hover:w-4" />
          </button>
        </div>
      </nav>

      {/* Backdrop — mobile only */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Side Drawer — mobile only */}
      <aside
        className={`fixed top-0 right-0 h-full z-50 w-72 bg-background border-l border-border flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-8 h-14 border-b border-border">
          <span className="text-xs text-muted-foreground tracking-widest uppercase">Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close menu"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>

        <nav className="flex flex-col px-8 pt-10 gap-1 flex-1">
          {navItems.map((item, i) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`group flex items-center justify-between py-4 border-b border-border/50 transition-colors duration-150 ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-sm tracking-wide">{item.label}</span>
                <span className="text-xs tabular-nums text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">
                  0{i + 1}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="px-8 py-8">
          <p className="text-xs text-muted-foreground/40 tracking-widest uppercase">© surf studio</p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;