const Error = require('../errors/error');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Users } = require('../models/models')
const { UserDTO } = require('../models/dto/auth.dto')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}


class UserController {
    async registration(req, res, next) {
          const { userName, email, password, pronounces } = req.body;
      
          // Проверка наличия пользователя с тем же email
          const existingUser = await Users.findOne({ where: { email } });
          if (existingUser) {
            return res.status(400).json({ error: 'INFO: User already exists!' });
          }
      
          // Хэширование пароля
          const hashedPassword = await bcrypt.hash(password, 10);
      
          // Создание нового пользователя
          const newUser = await Users.create({
            userName,
            email,
            passwordHash: hashedPassword,
            isEmailConfirmed: false,
            pronounces,
          });
          const token = generateJwt(newUser.id, newUser.email, newUser.role)
          res.status(201).json({ token: `${token}` });
      }
      

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await Users.findOne({where: {email}})
        if (!user) {
            return next(Error.internal('INFO: User is undefined!'))
        }
        let comparePassword = bcrypt.compareSync(password, user.passwordHash)
        if (!comparePassword) {
            return next(Error.internal('INFO: Wrong password!'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }
    
    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.userName, req.user.email)
        return res.json({token})
    }
}

module.exports = new UserController()