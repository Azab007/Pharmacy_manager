const { name } = require('ejs');
const sequelize = require('../models');
const Drug = require('../models/drugs');
const DrugModel = sequelize.models.Drug;
const BillModel = sequelize.models.bill;
const soldDrugModel = sequelize.models.soldDrug;
 var products  = [];
 var total = 0 
 var message = ""


module.exports.render = (req, res, next) => {
    if (!req.session.admin) {
        return res.redirect('/login')
    }
        res.render('order', {
        path: '/order',
        products: products,
        total: total,
        isLogged: req.session.admin,
        name: req.session.name,
        Message: message
    })
    message = ""
}


module.exports.search =async (req, res, next) => {
   
    const barcode = req.body.barcode;
    var qty = req.body.qty;

    if (isNaN(qty) || qty <= 0) {
        return res.render('order', {
            path: '/order',
            products: products,
            total: total,
            isLogged: req.session.admin,
            name: req.session.name,
            Message: "Please enter a valid quantity"
        })
    }

    var enough_qty = true  

    // get name and price, qty from database using barcode
    const scanned_drug =await Drug.findOne({ where: { barcode: barcode } });
    if (scanned_drug === null)
    {
        return res.render('order', {
            path: '/order',
            products: products,
            total: total,
            isLogged: req.session.admin,
            name: req.session.name,
            Message: "Drug doesn't exist"
        })


    }
    const _name = scanned_drug.drug_name;
    const _price = scanned_drug.drug_price;
    const _qty = scanned_drug.quantity;


    
    // check if exist in products
    const old = products.findIndex( (pr)=>{ if (pr.name == _name) return true;})
    // console.log(old,'..............................................')
    if (old != -1){
        qty = +qty + +products[old].qty;
    }

    // check if there is enough quantity
    if(_qty < qty) enough_qty = false;

    if (enough_qty) {
        if(old != -1){
            products[old].qty = qty;
            total = +total - +products[old].price; 
            products[old].price =_price * qty;
        }
        else 
            products.push({name: _name, qty: qty, price: _price * qty})
        total = +total + +_price * qty;

    }
    else{
        return res.render('order', {
            path: '/order',
            products: products,
            total: total,
            isLogged: req.session.admin,
            name: req.session.name,
            Message: "Not Enough quantity"
        })
    }

    return res.redirect('order') 
    
}


module.exports.checkout = async(req, res, next) => {
    if (products.length === 0){

        message = "Please add medicine to the Cart"
        return res.redirect('/order')
    }
    const bill=await BillModel.create({
        total_price:total})
    
    products.forEach(async(p)=>{
        await soldDrugModel.create(
            {drug_name:p["name"],
            total_price:p["price"],
            qty:p["qty"],
            bill_id:bill.bill_id})
        var drug= await Drug.findOne({
            where: { drug_name: p["name"]}
        })
        drug.quantity=drug.quantity-parseInt(p["qty"])
        await drug.save()
    }
        )
    products = []
    total = 0
    message = "Accepted"
    return res.redirect('/order')
}

module.exports.cancel = (req, res, next) => {
    products = []
    total = 0
    return res.redirect('/order')
}



module.exports.deleteorder = (req, res, next) => {
    const name = req.params.name;
    products = products.filter( (pr)=>{return pr.name !=name; } ) 
    total = 0
    products.forEach( (pr)=>{total+=pr.price } ) 
    return res.redirect('/order')

}