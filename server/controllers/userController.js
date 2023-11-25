const myRouter = require('express').Router();
const userSchema = require('../schema/user');

myRouter.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {

        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        const newUser = new userSchema({
            firstName,
            lastName,
            email,
            password,
        });

        await newUser.save();

        return res.status(201).json({ message: 'Sign Up successful' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
myRouter.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {

        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            if (existingUser.password === password) {
                const { firstName } = existingUser;
                return res.status(200).json({ message: 'Sign in successful',firstName });
            }
        }
        return res.status(404).json({ error: 'No User Found' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// IMAGE HANDLING
module.exports = myRouter;
