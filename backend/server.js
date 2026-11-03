
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Mailgun = require("mailgun.js");
const formData = require("form-data");

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Firebase connection
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

// Mailgun connection
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY
});

// Check required environment variable
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from the .env file.");
}

// Authentication middleware
async function auth(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Please login first."
            });
        }

        const data = jwt.verify(token, process.env.JWT_SECRET);

        const snap = await db.collection("users").doc(data.userId).get();

        if (!snap.exists) {
            return res.status(401).json({
                message: "User not found."
            });
        }

        req.user = {
            id: snap.id,
            ...snap.data()
        };

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired login token."
        });
    }
}

// REGISTER
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            password.length < 8 ||
            password.length > 100
        ) {
            return res.status(400).json({
                message: "Enter valid details. Password must be at least 8 characters."
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const userCheck = await db.collection("users")
            .where("email", "==", cleanEmail)
            .get();

        if (!userCheck.empty) {
            return res.status(400).json({
                message: "Email already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            name: name.trim(),
            email: cleanEmail,
            password: hashedPassword,
            plan: "Free",
            createdAt: FieldValue.serverTimestamp()
        };

        const userRef = await db.collection("users").add(user);

        const token = jwt.sign(
            { userId: userRef.id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(201).json({
            message: "Registration successful.",
            token,
            user: {
                id: userRef.id,
                name: user.name,
                email: user.email,
                plan: user.plan
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Registration failed."
        });
    }
});

// LOGIN
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const userCheck = await db.collection("users")
            .where("email", "==", email.trim().toLowerCase())
            .get();

        if (userCheck.empty) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const userDoc = userCheck.docs[0];
        const user = userDoc.data();

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            { userId: userDoc.id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({
            message: "Login successful.",
            token,
            user: {
                id: userDoc.id,
                name: user.name,
                email: user.email,
                plan: user.plan
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Login failed."
        });
    }
});

// GET CURRENT USER
app.get("/api/me", auth, (req, res) => {
    res.json({
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            plan: req.user.plan
        }
    });
});

// UPGRADE PLAN (DEMO ONLY)
app.post("/api/upgrade", auth, async (req, res) => {
    try {
        if (req.user.plan === "Paid") {
            return res.status(400).json({
                message: "You already have a Paid plan."
            });
        }

        await db.collection("users").doc(req.user.id).update({
            plan: "Paid",
            planUpdatedAt: FieldValue.serverTimestamp()
        });

        res.json({
            message: "Plan upgraded successfully.",
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                plan: "Paid"
            }
        });

    } catch (error) {
        console.error("Upgrade error:", error);

        res.status(500).json({
            message: "Plan upgrade failed."
        });
    }
});

// CREATE POST
app.post("/api/posts", auth, async (req, res) => {
    try {
        const {
            type,
            title,
            description,
            abstract,
            articleText,
            tags
        } = req.body;

        // Validate post type and title
        if (
            !["Article", "Question"].includes(type) ||
            typeof title !== "string" ||
            !title.trim() ||
            title.trim().length > 150
        ) {
            return res.status(400).json({
                message: "Enter a valid post type and title."
            });
        }

        // Validate Question content
        if (type === "Question") {
            if (
                typeof description !== "string" ||
                !description.trim() ||
                description.trim().length > 10000
            ) {
                return res.status(400).json({
                    message: "Enter a valid question description."
                });
            }
        }

        // Validate Article content
        if (type === "Article") {
            if (
                typeof abstract !== "string" ||
                !abstract.trim() ||
                abstract.trim().length > 2000 ||
                typeof articleText !== "string" ||
                !articleText.trim() ||
                articleText.trim().length > 50000
            ) {
                return res.status(400).json({
                    message: "Enter a valid article abstract and text."
                });
            }
        }

        // Validate tags
        if (
            !Array.isArray(tags) ||
            tags.length < 1 ||
            tags.length > 3 ||
            !tags.every(tag =>
                typeof tag === "string" &&
                tag.trim().length > 0 &&
                tag.trim().length <= 30
            )
        ) {
            return res.status(400).json({
                message: "Enter between 1 and 3 valid tags."
            });
        }

        // Check the user's selected plan
        const plan = req.body.plan === "Paid" ? "Paid" : "Free";

        if (plan === "Paid" && req.user.plan !== "Paid") {
            return res.status(403).json({
                message: "Upgrade to Paid to create a Paid post."
            });
        }

        // Prepare post information
        const postData = {
            type,
            title: title.trim(),
            tags: tags.map(tag => tag.trim()),
            plan,
            userId: req.user.id,
            author: req.user.name,
            createdAt: FieldValue.serverTimestamp()
        };

        if (type === "Question") {
            postData.description = description.trim();
        } else {
            postData.abstract = abstract.trim();
            postData.articleText = articleText.trim();
        }

        // Save post in Firestore
        const postRef = await db.collection("posts").add(postData);

        res.status(201).json({
            message: "Post created successfully.",
            postId: postRef.id
        });

    } catch (error) {
        console.error("Create post error:", error);

        res.status(500).json({
            message: "Unable to create post."
        });
    }
});

// GET POSTS
app.get("/api/posts", async (req, res) => {
    try {
        let userPlan = "Free";

        // Check whether visitor has a valid login token
        const token = req.headers.authorization?.split(" ")[1];

        if (token) {
            const data = jwt.verify(token, process.env.JWT_SECRET);

            const userDoc = await db.collection("users")
                .doc(data.userId)
                .get();

            if (!userDoc.exists) {
                return res.status(401).json({
                    message: "User not found."
                });
            }

            userPlan = userDoc.data().plan || "Free";
        }

        // Retrieve posts from Firestore
        const snapshot = await db.collection("posts")
            .orderBy("createdAt", "desc")
            .get();

        const posts = [];

        snapshot.forEach(doc => {
            const post = doc.data();

            // Free users only see Free posts.
            // Paid users can see both Free and Paid posts.
            if (
                userPlan === "Paid" ||
                (post.plan || "Free") === "Free"
            ) {
                posts.push({
                    id: doc.id,
                    ...post
                });
            }
        });

        res.json({ posts });

    } catch (error) {
        console.error("Get posts error:", error);

        res.status(500).json({
            message: "Unable to retrieve posts."
        });
    }
});

// NEWSLETTER SUBSCRIPTION
app.post("/subscribe", async (req, res) => {
    try {
        const email = req.body.email;

        if (
            typeof email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ) {
            return res.status(400).send("Enter a valid email address.");
        }

        const result = await mg.messages.create(
            process.env.MAILGUN_DOMAIN,
            {
                from: "Deakin Newsletter <postmaster@" +
                    process.env.MAILGUN_DOMAIN + ">",
                to: [email.trim()],
                subject: "Welcome to my Deakin Newsletter",
                text: "Thank you for subscribing to my Deakin Newsletter!"
            }
        );

        console.log("Mailgun response:", result);

        res.send("Subscription successful! Check your email.");

    } catch (error) {
        console.error("Mailgun error:", error);

        res.status(500).send("Error sending email.");
    }
});

// Handle unknown API routes with JSON
app.use("/api", (req, res) => {
    res.status(404).json({
        message: "API route not found."
    });
});

// Handle invalid JSON request bodies
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
        return res.status(400).json({
            message: "Invalid JSON request body."
        });
    }

    next(error);
});

// START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
