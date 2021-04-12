import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import './Navbar.scss';
/**
 * takes an array of links, an alignment, and a logo and creates a navbar from it
 * @param {*} param0 
 */
function Navbar({links, align, logo}){
    //when the navbar shrinks it should collapse into a drawer. This state determines if the drawer is open
    const [open, setOpen] = useState(false);
    const toggleOpen = (event)=>{ 
        event.target.innerText = open ?  '✖':'☰';
        setOpen(!open);
    }
    return(
        <nav className='navbar mr-5'>
            <Link to='/' className='logo'>{logo}</Link>
            <ul className={`flex-align-${align}`}>
                <button onClick={(event)=>{toggleOpen(event)}}>✖</button>
                {/* map the link strings to actual links */}
                {links.map((link, index)=>{ return <li key={index} className='nav-item'><Link to={`/${link}`}>{link}</Link></li>})}
            </ul>       
        </nav>
    )
}

export default Navbar;