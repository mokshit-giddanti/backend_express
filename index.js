const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const path = require('path');

const PORT = process.env.PORT || 10000;

const app = express();

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://User:user@cluster0.7sewa5u.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => {
  console.log("MongoDB connected");
});

const userSchema2 = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User2 = mongoose.model("User2", userSchema2);

// Routes
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User2.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successfull", user: user });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  User2.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "User already registered" });
    } else {
      const newUser = new User2({
        name,
        email,
        password
      });
      newUser.save(err => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Successfully Registered, Please login now." });
        }
      });
    }
  });
});

const userSchema = new mongoose.Schema({
  name: String,
  id: String,
  TeamNumber: String,
  subj: String,
  pname: String,
  startdate: String,
  status1: String
});
autoIncrement.initialize(mongoose.connection);
userSchema.plugin(autoIncrement.plugin, 'user');
const User = mongoose.model("User", userSchema);

app.post("/add", (req, res) => {
  const { name, id, TeamNumber, subj, pname, startdate, status1 } = req.body;
  User.findOne({ id: id }, (err, user) => {
    if (user) {
      res.send({ message: "User already registered" });
    } else {
      const newUser = new User({
        name,
        id,
        TeamNumber,
        subj,
        pname,
        startdate,
        status1
      });
      newUser.save(err => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Successfully Created" });
        }
      });
    }
  });
});

app.get('/all', async (req, res) => {
  const teams = await User.find({});
  res.status(200).json({ teams });
});

app.get('/:id', async (req, res) => {
  const teams = await User.findById(req.params.id);
  res.status(200).json({ teams });
});

app.post('/:id', async (req, res) => {
  const urs = req.body;
  const editUser = new User(urs);
  try {
    await User.updateOne({ _id: req.params.id }, editUser);
    res.status(200).json(editUser);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

app.delete('/:id', async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Deleted Successfully' });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log("Express server (Web Server) started at port 1800");
});