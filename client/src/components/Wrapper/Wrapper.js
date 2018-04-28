import React from 'react';
import "./Wrapper.css";

const Wrapper = props => {
        return (
            <div>
<div className='main'>
                <div className="slideshow">
                    <div className="images">
                    </div>
                </div>

 <div className="login">

        <form>
            <label htmlFor="uname">
                <b>E-Mail</b>
            </label>
            <input type="text" placeholder="Enter your E-mail" name="email" onChange={props.handleInputChange} value={props.email} required/>

            <label htmlFor="email">
                <b>Screen Name</b>
            </label>
            <input type="text" placeholder="Enter Screen Name" name="username" onChange={props.handleInputChange} value={props.username} required/>
            <label htmlFor="username">
                <b>Password</b>
            </label>
            <input type="password" placeholder="Enter Password" name="password" onChange={props.handleInputChange} value={props.password} required/>

            <div className="buttons">
                <button type="submit" onClick={props.handleRegister}>Create account</button>
                <button type="submit" onClick={props.handleLogin}>Login</button>
            </div>



        </form>
        </div>
    <div className="push"></div>
    </div>
            </div>
        )

}

export default Wrapper;