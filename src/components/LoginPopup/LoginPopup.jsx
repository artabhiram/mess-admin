import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { NavLink, useNavigate } from 'react-router-dom'

const LoginPopup = () => {

   const { setToken, url } = useContext(StoreContext)
    const [currState, setCurrState] = useState("Sign Up");
    const navigate = useNavigate()

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (e) => {
        e.preventDefault()

        let new_url = url;
        if (currState === "Login") {
            new_url += "/api/mess/login";
        }
        else {
            new_url += "/api/mess/register"
        }
        console.log(data);
        
        const response = await axios.post(new_url, data);
        if (response.data.success) {
             setToken(response.data.token)
            localStorage.setItem("token", response.data.token)
            console.log(localStorage.getItem("token"));
            
            // loadCartData({token:response.data.token})
        }
        else {
            toast.error(response.data.message)
        }
        navigate('/')
    }

    return (
        <div className='login-popup'>
            <form  className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2> <img onClick={() => console.log("Submit")} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" ? <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required /> : <></>}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>
                <NavLink to = '/' >
                    <button onClick={onLogin}>{currState === "Login" ? "Login" : "Create account"}</button>
                </NavLink>
                <div className="login-popup-condition">
                    <input type="checkbox" name="" id="" required/>
                    <p>By continuing, i agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup
