import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import { useContext } from 'react'

const Navbar = () => {
  const {token, setToken} = useContext(StoreContext);

    const navigate = useNavigate()
  
    const logout = () => {
      localStorage.setItem("token","");
      setToken("");    
      navigate('/')
    }   


  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="" />
      {!token? <button onClick={() => navigate('/login')}>sign in</button> :
      <button onClick={logout}>log out</button>}           

    </div>
  )
}

export default Navbar
{/* // </NavLink> */}
        {/* : <button onClick={logout}>log out</button>                    
      } */}

            {/* {!token? */}
        // <NavLink to='/login' >