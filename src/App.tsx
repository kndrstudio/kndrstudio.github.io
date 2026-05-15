import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import ArtIndex from './pages/ArtIndex'
import ArtProject from './pages/ArtProject'
import MusicIndex from './pages/MusicIndex'
import MusicAlbum from './pages/MusicAlbum'
import PoetryIndex from './pages/PoetryIndex'
import Poem from './pages/Poem'
import Teaching from './pages/Teaching'

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/art" element={<ArtIndex />} />
        <Route path="/art/:slug" element={<ArtProject />} />
        <Route path="/music" element={<MusicIndex />} />
        <Route path="/music/:slug" element={<MusicAlbum />} />
        <Route path="/poetry" element={<PoetryIndex />} />
        <Route path="/poetry/:slug" element={<Poem />} />
        <Route path="/teaching" element={<Teaching />} />
      </Routes>
    </>
  )
}
