const sequelize = require('../models');
const Drug = require('../models/drugs');
const DrugModel = sequelize.models.Drug;


module.exports.render = (req, res, next) => {
    if (!req.session.admin) {
        return res.redirect('login')
    }
    return res.render('new', {
        path: '/new',
        isLogged: req.session.admin,
        name: req.session.name,
        Message: ""
        
    })
}



module.exports.new =async (req, res, next) => {
    if (req.body.barcode === "" || req.body.drugname === "" || req.body.drugcategory === "" || req.body.drugprice === "" ||req.body.quantity==="") 
     
     {
        return res.render('new', {
            path: '/new',
            isLogged: req.session.admin,
            name: req.session.name,
            Message: "Please fill in all the inputs" 
            
        })
     }



        try{
        await DrugModel.create({
        barcode:req.body.barcode.toString(),
        drug_name:req.body.drugname.toString(),
        drug_cat:req.body.drugcategory.toString(),
        drug_price:req.body.drugprice,
        quantity:parseInt(req.body.quantity),
    })
}
        catch(err) {
            return res.render('new', {
                path: '/new',
                isLogged: req.session.admin,
                name: req.session.name,
                Message: "Invalid Input or medicine already exists, please try again" 
                
            })
        }

    return res.render('new', {path:'/new',isLogged: req.session.admin,
    name: req.session.name, Message: "Accepted"  })
}