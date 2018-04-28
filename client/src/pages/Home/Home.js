import React, { Component } from 'react';
import { BrowserRouter as Redirect } from "react-router-dom";
import Header from "../../components/Header";
import Wrapper from "../../components/Wrapper";
import Footer from "../../components/Footer";
import API from "../../utils/API.js";


class Home extends Component {
    state = {
      username: '',
      email: '',
      password: '',
      isLoggedIn: false

    };
    renderContent() {
        // check if logged in
        if (this.state.isLoggedIn) {
            return <Redirect to={{ 
              pathname: "/control",
              state: {username: this.state.username}
              }}
            />
        } 
        return <Wrapper 
          handleRegister={this.handleRegister} 
          handleLogin={this.handleLogin}
          handleInputChange={this.handleInputChange} 
          email={this.state.email} 
          password={this.state.password} 
          username={this.state.username} />
    };

    handleInputChange = event => {
      const { name, value } = event.target;
      this.setState({
        [name]: value
      });
    }

    handleRegister = event => {
      event.preventDefault();
      if (this.state.username && this.state.password && this.state.email) {
        API.registerUser({
          username: this.state.username,
          email: this.state.email,
          password: this.state.password
        });
        this.setState({ isLoggedIn: true })
        localStorage.setItem('Username', this.state.username);
      };
    };

    handleLogin = event => {
      event.preventDefault();
      if (this.state.username && this.state.password && this.state.email) {
        API.loginUser({
          username: this.state.username,
          email: this.state.email,
          password: this.state.password
        });
        this.setState({ isLoggedIn: true })
        localStorage.setItem('Username', this.state.username);
      };
    };



    render() {

     
    
      return (
        <div>
          <div className="wrapper" >
            <Header/>
            {this.renderContent()}
            <div className="push"></div>
          </div>
          <Footer/>
        </div>
      )
    }
  }

export default Home;
