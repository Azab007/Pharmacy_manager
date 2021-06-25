const sequelize = require('../models');
const Drug = require('../models/drugs');
const DrugModel = sequelize.models.Drug;
const soldDrugModel = sequelize.models.soldDrug

var rows=[];
var name = null;
var edit = false;
var errorMsg = ""
var bill_rows=[];
var search_type="bill"

module.exports.render = async(req, res, next) => {
    if (name !== null){
        if (search_type !="bill"){
    const drug =await Drug.findOne({ where: { drug_name: name } });
    rows=[{
        'sno': drug.barcode,
        'name': drug.drug_name,
        'cat' : drug.drug_cat,
        'price' :drug.drug_price,
        'qty' : drug.quantity
    }];
    }
}
    res.render('home', {
        rows:rows,
        path: '/home',
        isLogged: req.session.admin,
        name: req.session.name,
        errorMsg: errorMsg,
        edit: edit,
        search_type:search_type,
        bill_rows:bill_rows
     })

     edit = false
     errorMsg = ""
}

module.exports.search = async(req, res, next) => {
    
    name = req.body.search;
    search_type = req.body.search_type;
    if (name === "") {
        edit=false
        errorMsg="Please enter a search name"
        return res.redirect("/home") }
    if (search_type !="bill") {
    const drug =await Drug.findOne({ where: { drug_name: name } });
    if (drug === null) {
        rows=[];
        const errorName = name
        name = null
        errorMsg = errorName + " doesn't exists"
        edit = false

        return res.redirect('/home')

      } else {
        rows=[{
            'sno': drug.barcode,
            'name': drug.drug_name,
            'cat' : drug.drug_cat,
            'price' :drug.drug_price,
            'qty' : drug.quantity
        }];

        return res.redirect('home')
      }}
      if (search_type === "bill")
      {
          bill_rows=[];
          const drugs =await soldDrugModel.findAll({ where: { bill_id: name } });
  
          if (drugs.length == 0) {
              bill_rows=[];
              errorMsg=name+" doesn't exists"
              name = null
              edit =false
              
              return res.redirect('/home')      
            }
          else {
          drugs.forEach((drug)=>{
          const bill_row=
                  {
                      name:drug.drug_name,
                      qty:drug.qty,
                      price:drug.total_price,
                      id:drug.bill_id,
                      date:drug.updatedAt
                  }
          bill_rows.push(bill_row)
          }
              )
              return res.redirect('home')
  
      }}

}


module.exports.logout = (req, res, next) => {
    req.session.destroy();
    return res.redirect('/login')
}


module.exports.edit =  (req, res, next) => {
    if (!req.session.admin) {
        errorMsg =  "Access denied"
        edit = false
        return res.redirect('/home')
    }
    edit = true
    return res.redirect('/home')
}

module.exports.save = async (req, res, next) => {
    if (!req.session.admin) {
        errorMsg = errorName + " doesn't exists"
        edit = false
        return res.redirect('/home')
    }

  try { 
      const drug = await Drug.findOne({
        where: { drug_name: name }
    })
    drug.drug_name = req.body.name;
    drug.drug_cat = req.body.cat;
    drug.drug_price = req.body.price;
    drug.quantity= req.body.qty;
    await drug.save()
    name = req.body.name
    return res.redirect('/home');
  }
  catch(err) {
    errorMsg = "Invalid data, drug name already exists"
    edit = true
    return res.redirect('/home')
}
    
}

module.exports.delete = async(req,res, next) => {
    if (!req.session.admin) {
        errorMsg =  "Access denied"
        edit = false
        return res.redirect('/home')
    }
    const barcode = req.body.deleted;
    await Drug.destroy({where: {barcode: barcode}});
    rows = []
    name = null
    return res.redirect('/home');
    
}