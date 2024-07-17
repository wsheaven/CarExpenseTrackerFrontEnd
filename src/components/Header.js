import React from 'react'
import useLogout from '../hooks/useLogout';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth";
import { themeChange } from 'theme-change'
import { useEffect, useState } from 'react';
import MoonIcon from '@heroicons/react/24/outline/MoonIcon'
import SunIcon from '@heroicons/react/24/outline/SunIcon'

const Header = () => {
    const logout = useLogout()
    const navigate = useNavigate()
    const { auth } = useAuth();
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme"))

    // useEffect(() => {
    //     themeChange(false)
    //   }, [])

    useEffect(() => {
        themeChange(false)
        if(currentTheme === null){
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ) {
                setCurrentTheme("dark")
            }else{
                setCurrentTheme("light")
            }
        }
        // 👆 false parameter is required for react project
      }, [])
    

    const signOut = async () => {
        await logout()
        navigate('/login')
    }
  return (
    <div className="navbar bg-base-200">
        <div className="navbar-start">
  <div className="dropdown">
    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
      </svg>
    </div>
    <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-64 p-4 shadow">
      <li className="text-lg"><Link to="/viewexpenses">View Expenses</Link></li>
      <li className="text-lg"><Link to="/addexpense">Add Expense</Link></li>
    </ul>
  </div>
  <Link to="/" className="btn btn-ghost text-l">Car Expense Tracker</Link>
</div>
<div className="navbar-center hidden lg:flex">
  <ul className="menu menu-horizontal px-1 text-lg">
    <li><Link to="/viewexpenses">View Expenses</Link></li>
    <li><Link to="/addexpense">Add Expense</Link></li>
  </ul>
</div>
        <div className="navbar-end">


        <label className="swap swap-rotate mr-4">
                <input type="checkbox"/>
                <SunIcon data-set-theme="light" data-act-class="ACTIVECLASS" className={"fill-current w-6 h-6 "+(currentTheme === "dark" ? "swap-on" : "swap-off")}/>
                <MoonIcon data-set-theme="dark" data-act-class="ACTIVECLASS" className={"fill-current w-6 h-6 "+(currentTheme === "light" ? "swap-on" : "swap-off")} />
            </label>

  {auth.user ? (
    <button onClick={signOut} className="px-4 py-2 btn btn-primary">Sign Out</button>
  ) : (
    <Link to="/login" className="px-4 py-2 btn btn-primary">Sign In</Link>
  )}
</div>
      </div>
  )
}

export default Header