import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Chat from "../../components/Chat"
import './style.css';
import API from '../../utils/API';



class Control extends Component {
    state = {
        users: [],
        userHas: [],
        userNeeds: [],
        otherUser: '',
        otherNeeds: [],
        otherHas: [],
        uNeeds: '',
        uHas: ''
    }


    componentDidMount() {
        API.usersList()
            .then(result => {
                console.log(result)
                // debugger
                this.setState({ users: result.data })
            })
            .catch(err => alert(err));

        API.userHas(localStorage.getItem('Username'))
            .then(result => {
                console.log('User has: ' + result)
                this.setState({ userHas: result.data})
            });
            
        API.userNeeds(localStorage.getItem('Username'))
            .then(result => {
                console.log(result)
                this.setState({ userNeeds: result.data})
            });
    }

    clickTrader = event => {
        console.log('clickTrader launched')
        event.preventDefault();
        const name = event.target.innerText
        console.log(name);
        API.userNeeds(name)
            .then(result => {
                this.setState({
                    otherNeeds: result.data
                })
            });
        API.userHas(name)
            .then(result => {
                this.setState({
                    otherHas: result.data
                })
            });
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });
      }

    handleUpdate = (option) => {
        if (option === 'Needs') {
        //event.preventDefault();

            const Needs = parseInt(this.state.uNeeds);
            this.setState({
                userNeeds: [...this.state.userNeeds, Needs],
                uNeeds: ''
            });
            API.updateUser({
                username: localStorage.getItem('Username'),
                key: 'needs',
                value: [...this.state.userNeeds, Needs],
            });

        } else if (option === 'Has') {
            const uHas = this.state.uHas;
            API.updateUser({
                has: [...this.state.uHas, uHas]
            });
            this.setState({
                uHas: ''
            })
        }
    }

    renderTraders = () => {
        return this.state.users.map(user => (
            <p onClick={this.clickTrader} key={user._id}>{user.username}</p>
        ));
    }


    render() {

      return (
        <div>
            <Header/>
            <div className="wrapper">
                <div className="forms">
                <form id="user-needs-form">
                <label htmlFor="message">User Needs</label>
                <br/>
                <ul className="block" id="message" name="message" required="required">{this.state.userNeeds.map(card => (
                    <li>{card}</li>
                ))}</ul>
                <input name="uNeeds" onChange={this.handleInputChange} value={this.state.uNeeds}/>
                <button type="submit" 
                onClick={(e)=>{
                    e.preventDefault()
                    this.handleUpdate('Needs')
                }}>Submit</button>
                </form>

            <form id="their-needs-form">
                <label htmlFor="message">Their Needs</label>
                <br/>
                <ul id="message" name="message" required="required">{this.state.otherNeeds.map(card => 
                (
                    <li>{card}</li>
                ))}</ul>
            </form>

            <form id="traders-list">
                <label htmlFor="message">Trader's List</label>
                <br/>
                <div className="block" id="message" name="message" required="required" > 
                    {this.renderTraders()}
                </div>
            </form>
        </div>
        
        <div className="forms">
            <form id="user-has-form">
                <label htmlFor="message">User Has</label>
                <br/>
                <ul id="message" name="message" required="required">{this.state.userHas.map(card => 
                (
                    <li>{card}</li>
                ))}</ul>
                <input name="uHas" onChange={this.handleInputChange} value={this.state.uHas}/>
                <button type="submit" 
                onClick={(e)=>{
                    e.preventDefault()
                    this.handleUpdate('Has')
                }}>Submit</button>
            </form>
            
            <form id="they-have-form">
                <label htmlFor="message">They Have</label>
                <br/>
                <ul id="message" name="message" required="required">{this.state.otherHas.map(card => (
                    <li>{card}</li>
                ))}</ul>
            </form>

            <form id="socket-goes-here">
                <Chat username={this.props.username} />
            </form>
        </div>
    </div>

          <Footer/>
        </div>
      )
    }
  }

export default Control;
