var express     = require('express');
var bodyparser  = require('body-parser');
var methodOverride = require('method-override');
var bodyParser =require('body-parser');
var mysql=require('mysql');

var app=express();
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(__dirname + './static/media/'));


var db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'firstcare'
})

db.connect(function(err){
    if(err)
    throw err;
    else
    console.log("MySQL is connected...");
})

var companyis='',useris='';


//====================================
//====================================
//====================================
// ROUTES OF CUSTOMER PORTAL

app.get("/customer/login",function(req,res){
    res.render("cust_login");
})

app.post("/customer/login",function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    let sql='SELECT * FROM customers WHERE username=\''+username+'\' and password=\''+password+'\'';
    let query=db.query(sql,function(err,result){
        if(err)
        throw err;
        if(result.length==0)
            res.redirect('/customer/login');
        else{
            result.forEach((row)=>{
                useris=row.username;
                passwordis=row.password;
                app.use(function(req,res,next)
                {
                    res.locals.useris=useris;
                    next();
                })
                res.redirect('/customer/dashboard');
            });
        }
    })
})

app.get("/customer/add",function(req,res){
    res.render("cust_add");
})

app.post("/customer/add",function(req,res){
    let user={
        username:req.body.username,
        customer_name:req.body.name,
        email:req.body.email,
        password:req.body.password
    }
    let sql='INSERT INTO customers SET ?';
    db.query(sql,user,function(err){
        if(err)
            throw err;
        else{            
            res.redirect("/");
        }
    })
})

app.get("/customer/dashboard",function(req,res){
    if(useris=='')
    res.redirect("/");
    else
    res.render("cust_dashboard");
})

app.get("/customer/view_medicines",function(req,res){
    let sql='SELECT * FROM medicines';
    let query=db.query(sql,function(err,result){
        if(err)
        throw err;
        else
        {
            if(useris=='')
            res.redirect("/");
            else
            res.render("cust_view_medicines",{result:result});
        }
    })
})

app.get("/customer/view_medicines_by",function(req,res){
    if(useris=='')
    res.redirect("/");
    else
    res.render("cust_search_by");
})


app.get("/customer/orders",function(req,res){
    let sql="SELECT * FROM bought_medicines WHERE username=\'"+useris+"\'";
    db.query(sql,function(err,result){
        if(err)
            throw err;
            if(useris=='')
                res.redirect("/");
            else
                res.render("cust_orders",{result:result});
    })
})

app.post("/customer/view_medicines/medicine",function(req,res){
    let sql='SELECT * FROM medicines WHERE med_name=\''+req.body.search+'\'';
    let query=db.query(sql,function(err,result){
        if(err)
        throw err;
        else
        {if(useris=='')
        res.redirect("/");
        else
        res.render("cust_view_medicines",{result:result});
        }
    })
})
app.post("/customer/view_medicines/company",function(req,res){
    let sql='SELECT * FROM medicines WHERE company_name=\''+req.body.search+'\'';
    let query=db.query(sql,function(err,result){
        if(err)
        throw err;
        else
        {if(useris=='')
        res.redirect("/");
        else
            res.render("cust_view_medicines",{result:result});
        }
    })
})

app.get("/about",function(req,res){
    res.render("about");
})

app.post("/customer/add_med",function(req,res){
    var prc=0,qty;
    let entry='SELECT * FROM medicines WHERE company_name=\''+req.body.cname+'\' and med_name=\''+req.body.mname+'\'';
    let query1=db.query(entry,function(err,result){
        if(err)
        {
            throw err;
        }
        else
        {
            result.forEach((row)=>
            {
                qty=row.quantity;
                prc=row.price;
            })
        let medicine={
            username:useris,
            company:req.body.cname,
            med_name:req.body.mname,
            quantity:req.body.qty,
            price:prc,
            bill:Number(prc*req.body.qty)
        }
        let sql0='UPDATE medicines SET quantity=\''+Number(qty-medicine.quantity)+'\' WHERE med_name=\''+medicine.med_name+'\' and company_name=\''+medicine.company+'\'';
        db.query(sql0);
        let sql="INSERT INTO bought_medicines SET ?";
        let query2=db.query(sql,medicine,function(err,result){
            if(err)
            throw err;
            else
            {
                res.redirect("/customer/dashboard");
            }
        })
    }
    })
    })
        
    

//====================================
//====================================
//====================================
// =========ROUTES of Sidebar=========
app.get('/dashboard',function(req,res){
    if(companyis=='')
    res.redirect("/");
    else
    res.render("dashboard",{companyis:companyis});
})

app.get('/addmeds',function(req,res){
    if(companyis=='')
    res.redirect("/");
    else
    res.render('addmeds',{companyis:companyis});
})

app.get('/updatemeds',function(req,res){
    if(companyis=='')
    res.redirect("/");
    else
    res.render("updatemeds.ejs",{companyis:companyis});
})

app.get('/deletemeds',function(req,res){
    if(companyis=='')
    res.redirect("/");
    else
    res.render('deletemeds',{companyis:companyis});
})

app.get('/viewmeds',function(req,res){
    let sql='SELECT * FROM medicines WHERE company_name=\''+companyis+'\'';
    let query=db.query(sql,function(err,result){
        if(err)
        {
            res.send(err);
        }
        else
        {
            if(companyis=='')
    res.redirect("/");
    else
    res.render('viewmeds',{result:result,companyis:companyis});
        }
    })
})


// =================================
// =================================
// =================================
app.get('/',function(req,res){
    useris='';
    companyis='';
    res.render('firstpage');
})

app.get('/logincom',function(req,res){
    res.render("logincom");
})

app.get('/add_company',function(req,res){
    res.render('add_company');
})

// ===================================

// ========== POST Routes ============

app.post('/add_company',function(req,res){
    let company={
        username:req.body.username,
        company:req.body.company,
        email:req.body.email,
        password:req.body.password
    }
    companyis=req.body.company;
    let sql='INSERT INTO companies SET ?';
    let query=db.query(sql,company,function(err){
        if(err)
        throw err;
        else
        {
            res.redirect('/dashboard');
        }
    })
})

app.post('/logincom',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    let sql='SELECT * FROM companies WHERE username=\''+username+'\' and password=\''+password+"\'";
    let query=db.query(sql,function(err,result){
        if(err)
        throw err;
        if(result.length==0)
            res.redirect('/logincom');
        else{
            result.forEach((row)=>{
                companyis=row.company;
                passwordis=row.password;
                app.use(function(req,res,next)
                {
                    res.locals.companyis=companyis;
                    next();
                })
                res.redirect('/dashboard');
            });
        }
    })
})

// =============================
//======== Company Routes=======
// =============================
app.post('/addmeds',function(req,res){
    let medicine={med_name:req.body.medname,
                 company_name:companyis,
                 price:Number(req.body.mprice),
                 quantity:Number(req.body.qty)
                };
    let sql='INSERT INTO medicines SET ?';
    let query=db.query(sql,medicine,function(err){
        if(err)
        throw err;
        else
        res.redirect('/dashboard');
    });
})

app.post('/updatemeds',function(req,res){
    let medicine={med_name:req.body.mname,
        company_name:companyis,
        price:Number(req.body.mprice),
        quantity:Number(req.body.qty)
    }
    
    let sql='UPDATE medicines SET price=\''+Number(req.body.mprice)+'\' , quantity=\''+Number(req.body.qty)+'\'WHERE med_name=\''+req.body.medname+'\' and company_name=\''+companyis+'\'';
    let query=db.query(sql,function(err,result){
        if (err)
        throw err
        else
        {
            res.redirect('/viewmeds')
        }
    })
})

app.post('/deletemeds',function(req,res){
    let sql='DELETE FROM medicines WHERE med_name=\''+req.body.medname+'\' AND company_name=\''+companyis+'\'';
    let query=db.query(sql,function(err){
        if(err)
        throw err;
        else
        res.redirect('/dashboard');
    })
})

// =================================
// =================================
// =================================

app.listen(27017,process.env.IP,function(){
    console.log("Server started...");
})