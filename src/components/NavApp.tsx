import { NavLink } from 'react-router-dom'

export function NavApp() {
  return (
    <nav className="nav-app">
      <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link ativo' : 'nav-link')} end>
        Mapa
      </NavLink>
      <NavLink
        to="/viagens"
        className={({ isActive }) => (isActive ? 'nav-link ativo' : 'nav-link')}
      >
        Viagens planejadas
      </NavLink>
    </nav>
  )
}
