var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    has: [Number],
    needs: [Number]
});

userSchema.methods.validPassword = function(pwd) {
	console.log("pwd: " + pwd + ' & password: ' + this.password);
	return (this.password === pwd)
}

// This creates our model from the above schema, using mongoose's model method
var User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;