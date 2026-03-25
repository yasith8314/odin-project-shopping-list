import './App.css'
import Sidebar from './models/sidebar'
import MainCard from './models/main_card'
import GameCard from './models/game_card'

function App() {

  return (
    <> 
      <nav className='navbar'>
        <h1>Game Shop</h1>
        <div className='div-in-nav'>
          <div>Home</div>
          <div>Cart</div>
        </div>
      </nav>

      <Sidebar />
      
      <MainCard query={'games?dates=2026-01-16,2026-03-16'} title={"Games in 2026 so far"} />
    </>
  )
}

export default App
