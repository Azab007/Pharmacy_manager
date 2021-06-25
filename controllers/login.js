const sequelize = require('../models');
const User = require('../models/users');
const UserModel = sequelize.models.User;

module.exports.render = (req, res, next) => {
    if (req.session.admin) {
        return res.redirect('home')
    }
    return res.render('login', {
        path: '/login',
        isLogged: req.session.admin,
        name: req.session.name,
        errorMsg: "" 
    })
}


module.exports.login = async(req, res, next) => {
    
    const username = req.body.uname;
    const password = req.body.psw;


    const verfied_user= await User.findOne({ where: { user_name: username } })
    if (verfied_user===null)
    {
        return res.render('login', {
            path: '/login',
            isLogged: req.session.admin,
            name: req.session.name,
            errorMsg: "Invalid credentials" 
        })

    } 

    
    const password_from_db = verfied_user.password

    if ( password=== password_from_db) {
        req.session.name = username;
        req.session.admin = true; 
        console.log(req.session)
        return res.redirect('home')
    }
    else {
        return res.render('login', {
            path: '/login',
            isLogged: req.session.admin,
            name: req.session.name,
            errorMsg: "Invalid credentials" 
        })

    }

}


