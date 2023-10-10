const mongoose = require('mongoose')
const express = require('express')
const dotenv = require("dotenv")
const User = require('./models/user')
const bcrypt = require('bcrypt')

dotenv.config();

const app = express()
app.use(express.json())

// credencial
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@luxurious.tywqoos.mongodb.net/?retryWrites=true&w=majority`).then(
    console.log("conectado no MongoDB"),
    app.listen(3000, console.log("Conectado a API"))
).catch((err) => {console.log(err)})

app.post("/auth/cadaster", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(422).json({ msg: "Preencha todos os campos obrigatórios." });
    }

    //check de email existente
    const checkEmail = await User.findOne({email: email})

    if(checkEmail){
        return res.status(422).json({msg: "Email ja foi cadastrado"})
    }

    const salt = await bcrypt.genSalt(12);
    const cryptoPass = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        email,
        password: cryptoPass,
    });

    try {
        await user.save();
        res.status(201).json({ msg: "Usuário criado" });
    } catch (error) {
        console.log("Erro ao criar usuário:", error);
        res.status(500).json({ msg: "Erro ao criar o usuário" });
    }
});

// Adicione esta rota GET para recuperar os dados do usuário
app.get("/auth/user/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (user) {
        // Retorna os dados do usuário
        res.status(200).json(user);
        } else {
        res.status(404).json({ msg: "Usuário não encontrado" });
        }
    } catch (error) {
        console.log("Erro ao recuperar o usuário:", error);
        res.status(500).json({ msg: "Erro ao recuperar o usuário" });
    }
});

  // Rota para recuperar todos os usuários
app.get("/auth/users", async (req, res) => {
    try {
        // Consulta o banco de dados para obter todos os usuários
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.log("Erro ao recuperar os usuários:", error);
        res.status(500).json({ msg: "Erro ao recuperar os usuários" });
    }
});
  