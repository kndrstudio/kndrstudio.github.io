import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <nav aria-label="main navigation">
      <Link to="/">kndrstudio</Link>
      <Link to="/art">Art</Link>
      <Link to="/music">Music</Link>
      <Link to="/poetry">Poetry</Link>
      <Link to="/teaching">Teaching</Link>
    </nav>
  )
}
