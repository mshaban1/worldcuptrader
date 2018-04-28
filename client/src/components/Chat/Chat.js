import React, { Component } from 'react';
import './Chat.css'; 
import openSocket from 'socket.io-client';

class Chat extends Component {
	constructor(props){
		super(props);


	
		this.state = { 
			username: '',
			message: '',
			messages: [] 
		};

		// console.log('test')

		const socket = openSocket('http://localhost:8080');
		
		this.socket = socket;

		//listener to append new messages to be rendered
		socket.on('message', (msg) => {
			console.log('message recieved from ' + msg.username)
	    	this.setState({
	    		messages: [...this.state.messages, msg],
	    	})
	 	});

	};

	handleSubmit = event => {
		event.preventDefault()
		const msgToSend = {
			message: this.state.message,
			username: this.state.username
		}

		this.setState({
    		messages: [...this.state.messages, msgToSend],
			message: ''
    	})


		console.log('emmitting message from ' + msgToSend.username)

	    this.socket.emit('message', msgToSend)

	};


	handleInputChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		this.setState({
			[name]: value,
		})
	}

	componentWillMount() {
		this.setState({
			username: localStorage.getItem('Username')
		})
	}

	render() {

        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body" id="card-body">
                                <div className="card-title" id="card-title">Trade Chat</div>
                                <hr/>
                                <div className="messages">
								    {this.state.messages.map(message => {
										let nameClass
										if (this.state.username === message.username) {
											nameClass = 'msgSelf'
										} else {
											nameClass = 'msgOther'
										}
								        return (
								            <div key={message.index} ><b className={nameClass}>{message.username}</b>: {message.message}</div>
								        )
								    })}                                	
                                </div>
                                <div className="footer">
                                    {/* <input 
	                                    type="text" 
	                                    name="username" 
	                                    placeholder="Username" 
	                                    value={this.state.username} 
	                                    onChange={this.handleInputChange} 
	                                    className="form-control"/> */}
                                    <br/>
                                    <input 
                                    	type="text" 
                                    	name="message" 
                                    	placeholder="Message" 
                                    	className="form-control" 
                                    	value={this.state.message} 
							            onChange={this.handleInputChange}
                                    	onKeyPress={event => {
							                if (event.key === 'Enter') {
							                  this.handleSubmit(event)
							            	}}}
							            	/>
                                    <br/>
                                    <button className="btn btn-primary form-control" onClick={this.handleSubmit}>Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
	}
}

export default Chat;