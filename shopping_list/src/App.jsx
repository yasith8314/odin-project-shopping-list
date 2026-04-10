import './App.css'
import Sidebar from './models/sidebar'
import { Link, Outlet } from 'react-router-dom' // <-- Good import

function App() {
  
  return (
    <div> 
      <nav className='navbar'>
        <h1>Game Shop</h1>
        <div className='div-in-nav'>
          <Link className='link' to="/">Home</Link>
          <Link className='link' to="/library">Library</Link>
        </div>
      </nav>

      <Sidebar /> 
      
      <main>
         <Outlet /> {/* <-- THIS IS REQUIRED! Child pages will render here */}
      </main>
    </div>
  )
}

export default App;