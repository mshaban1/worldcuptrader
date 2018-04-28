import axios from 'axios';

const API = {
	registerUser: function(data) {
		return axios.post('/register', data);
	},

	loginUser: function(data) {
		return axios.post('/login', data);
	},

	updateUser: function(data) {
		return axios.post('/updateUser', data);
	},

	usersList: function (){
		return axios.get('/usersList/');
	},

	userNeeds: function (username) {
		return axios.get('/userNeeds/'+username);
	},

	userHas: function (username) {
		return axios.get('/userHas/'+username);
	}
	
};

export default API;