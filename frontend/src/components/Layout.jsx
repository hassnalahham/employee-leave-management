import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

// Shared compnonets for both role areas: brand, nav links, current user, logout.
export default function Layout({ title, links }) {
  const { user, logout } = useAuth();

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="dot" />
          {title}
        </div>

        <nav className="nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="user">
          <span>
            {user.name} · <span className="muted">{user.role}</span>
          </span>
          <button type="button" className="ghost" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
