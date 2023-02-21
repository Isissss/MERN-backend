const User = require('../Schemas/userModel');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const user = await User.findOne({ username: username });
    if (user) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPw = await bcrypt.hash(password, salt);

        //create and store the new user
        const result = await User.create({
            "username": username,
            "password": hashedPw
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { registerUser };