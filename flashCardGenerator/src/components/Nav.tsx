import { Link, Outlet, BrowserRouter, Routes, Route } from "react-router-dom";
import { firebaseApp } from "../firebase";
import { getAuth, signOut } from "firebase/auth";
import Hero from "./Hero";
import Generator from "./Generator";
import Categories from "./Categories";
import Cards from "./Cards";
import Unknown from "./Unknown";
import { NavProps } from "./Interfaces";
import '../styles/nav.css';

const Nav: React.FC<NavProps> = ({ isLoggedIn, setStatus }) => {
  const auth = getAuth(firebaseApp);

  const handleSignOut = (): void => {
    setStatus(false);
    signOut(auth).then(() => {
      console.log('see you again :)');
    }).catch(e => console.log(e));
  }

  return (
    <BrowserRouter>
      {isLoggedIn ? 
        <div id="navLayout">
          {/* <Link className="navLinks" to='/'>Home</Link> */}
          <Link className="navLinks" to='generate'>Generate</Link>
          <Link className="navLinks" to='categories'>My Flash Cards</Link>
          <div id='logoutBtn' onClick={handleSignOut} className="navLinks">Lagout :)</div>
       
        </div> 
        : 
        <Link to='/'></Link>
     }
      <Outlet />
      
      <Routes>
        <Route>
          <Route path="/" element={<Hero setStatus={setStatus} />} />
          <Route path='/generate' element={<Generator setStatus={setStatus} />}/>
          <Route path='/categories' element={<Categories setStatus={setStatus} />}/>
          <Route path='/categories/:category_name/:category_id' element={<Cards setStatus={setStatus} />}/>
          <Route path='*' element={<Unknown />}/>
        </Route>    
      </Routes>            
    </BrowserRouter>
  );
}

export default Nav;

