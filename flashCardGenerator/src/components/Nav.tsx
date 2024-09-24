import { Link, Outlet, BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./Hero";
import Generator from "./Generator";
import Categories from "./Categories";
import Cards from "./Cards";
import '../styles/nav.css';

const Nav = () => {

  return (
    <BrowserRouter>
      <div id="navLayout">
        <Link className="navLinks" to='/'>Home</Link>
        <Link className="navLinks" to='generate'>Generate</Link>
        <Link className="navLinks" to='categories'>My Flash Cards</Link>
        <Outlet />
      </div>
      <Routes>
        <Route>
          <Route path="/" element={<Hero />} />
          <Route path='generate' element={<Generator />}/>
          <Route path='categories' element={<Categories />}/>
          <Route path='categories/:category_name/:category_id' element={<Cards />}/>
        </Route>    
      </Routes>            
    </BrowserRouter>
  );
}

export default Nav;

