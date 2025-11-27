import userM from "../models/user.m.js";
import bcrypt from "bcryptjs";

export const getLogin = (req, res) => {
    res.render("auth/login", { layout: "auth" });
};

export const getRegister = (req, res) => {
    res.render("auth/register", { layout: "auth" });
};

// Controller to handle user Logout
export const getLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.redirect('/auth/login');
    });
};

// Controller to handle user Login
export const postLogin = async (req, res) => {
    const { username, password, remember } = req.body;
    try {
        // Retrieve user by username
        const user = await userM.oneByUsername(username);
        if (!user) {
            return res.render("auth/login", { layout: "auth", error: 'Invalid username or password' });
        }
        // Compare provided password with stored hashed password
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.render("auth/login", { layout: "auth", error: 'Invalid username or password' });
        }
        // Login successful
        req.session.userId = user.id;

        // hàm xử lý nhớ đăng nhập
        if(remember) {
            req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        } else {
            req.session.cookie.expires = false;
        }

        res.render("auth/loginSuccess", {
            layout: "auth",
            user: { 
                username: user.username, 
                name: user.name, 
                email: user.email,
                initials: user.name.split(' ').map(n => n.charAt(0).toUpperCase()).join('')
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to handle user registration
export const postRegister = async (req, res) => {
    const { username, name, email, password } = req.body;
    try {
        // Check if username already exists
        const existingUser = await userM.oneByUsername(username);
        if (existingUser) {
            return res.render("auth/register", {
                layout: "auth", 
                error: 'Username already taken', 
                form: { username, name, email }
            });
        }
        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);
        // Create new user object
        const newUser = {
            username,
            name,
            email,
            password: hashedPassword
        };
        // Add the new user to the database
        const userId = await userM.add(newUser);
        res.render("auth/loginSuccess", {
            layout: "auth",
            user: { 
                username: username, 
                name: name, 
                email: email, 
                initials: name.split(' ').map(n => n.charAt(0).toUpperCase()).join('') 
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};