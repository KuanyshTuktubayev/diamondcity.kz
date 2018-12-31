const express = require('express');
const app = express();
const mysql = require('mysql');
var session = require('express-session');
var parseurl = require('parseurl');

//create connection
const db = mysql.createConnection({
	host: 'localhost',
	user: 'rootDC',
	password: 'Root@123',
	database: 'p-13908_DCReal'
});
//connect
db.connect((err) => {
	if(err) { throw err; }
	console.log('MySQL connected...');
});

app.disable('x-powered-by');

var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var bodyParser = require('body-parser');
//app.use(require('body-parser').urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var formidable = require('formidable');

var credentials = require('./credentials.js');
app.use(require('cookie-parser')(credentials.cookieSecret));

app.set('port', process.env.PORT || 3000);

var router = express.Router();

app.use(express.static(__dirname + '/public'));

//var Client = require('./models/client');

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

app.use(session({
	resave: false,
	saveUninitialized: true,
	secret: credentials.cookieSecret, 
	cookie: { maxAge: 600000 }
}));

//showing main page
app.get('/', (req, res) => {
	var nClientID = 0;
	var sPwd = "";
	var sessData = req.session;
	if(sessData.userID > 0 && sessData.userPWD != ""){
		nClientID = sessData.userID;
		sPwd = sessData.userPWD;
	}
	res.render('home', {clientID: nClientID});
});

app.use('/api', router);


app.get('/logindiv', function(req, res){
	var nClientID = 0;
	var sPwd = "";
	var sessData = req.session;
	if(sessData.userID > 0 && sessData.userPWD != ""){
		nClientID = sessData.userID;
		sPwd = sessData.userPWD;
	}
	res.render('logindiv', {clientID: nClientID});
});

// select single client
app.get('/getclient/:id', function(req, res){
	let sql = 'select * from Client where id = ' + req.params.id;
	let query = db.query(sql, function(err, result){
		if(err) throw err;
		console.log(result);
		res.send('client fetched: '+result);
	});
});
app.get('/file-upload/:year/:month', function(req, res){
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, file){
		if(err)
			return res.redirect(303, '/error');
		console.log('Received File');

		console.log(file);
		res.redirect( 303, '/thankyou');
	});
});
//app.get('/getChartData/:id/:planid', function(req, res){
app.get('/getChartData', function(req, res){
	//var nClientID = req.params.id;
	//var nIDPlanType = req.params.planid;
	var nClientID = req.query.cid;
	var nIDPlanType = req.query.pt;
	var form = new formidable.IncomingForm();
	let sqlStruct = ""
			+"SELECT t0.IDPlanType, t0.IDClParent, clp.Lastname LastnameP, clp.Firstname FirstnameP, t0.IDClient, cl.Lastname, cl.Firstname, 0 lev, GetCountChilds(t0.IDClient, t0.IDPlanType, 0) nChildCount "
			+"FROM Struct t0 "
			+"join Client cl on cl.ID = t0.IDClient "
			+"join Client clp on clp.ID = t0.IDClParent "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = "+nIDPlanType+" "
			+"UNION ALL "
			+"SELECT t1.IDPlanType, t1.IDClParent, clp.Lastname, clp.Firstname, t1.IDClient, cl.Lastname, cl.Firstname, 1 lev, GetCountChilds(t1.IDClient, t0.IDPlanType, 0) nChildCount "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"join Client cl on cl.ID = t1.IDClient "
			+"join Client clp on clp.ID = t1.IDClParent "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = "+nIDPlanType+" "
			+"UNION ALL "
			+"SELECT t2.IDPlanType, t2.IDClParent, clp.Lastname, clp.Firstname, t2.IDClient, cl.Lastname, cl.Firstname, 2 lev, GetCountChilds(t2.IDClient, t0.IDPlanType, 0) nChildCount "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t2 ON t2.IDClParent = t1.IDClient and t2.IDPlanType = t0.IDPlanType "
			+"join Client cl on cl.ID = t2.IDClient "
			+"join Client clp on clp.ID = t2.IDClParent "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = "+nIDPlanType+" "
			+"UNION ALL "
			+"SELECT t3.IDPlanType, t3.IDClParent, clp.Lastname, clp.Firstname, t3.IDClient, cl.Lastname, cl.Firstname, 3 lev, GetCountChilds(t3.IDClient, t0.IDPlanType, 0) nChildCount "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t2 ON t2.IDClParent = t1.IDClient and t2.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t3 ON t3.IDClParent = t2.IDClient "
			+"join Client cl on cl.ID = t3.IDClient "
			+"join Client clp on clp.ID = t3.IDClParent "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = "+nIDPlanType+" "
			+"UNION ALL "
			+"SELECT t4.IDPlanType, t4.IDClParent, clp.Lastname, clp.Firstname, t4.IDClient, cl.Lastname, cl.Firstname, 4 lev, GetCountChilds(t4.IDClient, t0.IDPlanType, 0) nChildCount "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t2 ON t2.IDClParent = t1.IDClient and t2.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t3 ON t3.IDClParent = t2.IDClient and t3.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t4 ON t4.IDClParent = t3.IDClient "
			+"join Client cl on cl.ID = t4.IDClient "
			+"join Client clp on clp.ID = t4.IDClParent "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = "+nIDPlanType+" "
			+"UNION ALL "
			+"SELECT t5.IDPlanType, t5.IDClParent, clp.Lastname, clp.Firstname, t5.IDClient, cl.Lastname, cl.Firstname, 5 lev, GetCountChilds(t5.IDClient, t0.IDPlanType, 0) nChildCount "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t2 ON t2.IDClParent = t1.IDClient and t2.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t3 ON t3.IDClParent = t2.IDClient and t3.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t4 ON t4.IDClParent = t3.IDClient and t4.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t5 ON t5.IDClParent = t4.IDClient and t5.IDPlanType = t0.IDPlanType "
			+"join Client cl on cl.ID = t5.IDClient "
			+"join Client clp on clp.ID = t5.IDClParent "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = "+nIDPlanType+" "
			+"UNION ALL "
			+"SELECT t6.IDPlanType, t6.IDClParent, clp.Lastname, clp.Firstname, t6.IDClient, cl.Lastname, cl.Firstname, 6 lev, GetCountChilds(t6.IDClient, t0.IDPlanType, 0) nChildCount "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t2 ON t2.IDClParent = t1.IDClient and t2.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t3 ON t3.IDClParent = t2.IDClient and t3.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t4 ON t4.IDClParent = t3.IDClient and t4.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t5 ON t5.IDClParent = t4.IDClient and t5.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t6 ON t6.IDClParent = t5.IDClient and t6.IDPlanType = t0.IDPlanType "
			+"join Client cl on cl.ID = t6.IDClient "
			+"join Client clp on clp.ID = t6.IDClParent "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = "+nIDPlanType+" "
			+"UNION ALL "
			+"SELECT t7.IDPlanType, t7.IDClParent, clp.Lastname, clp.Firstname, t7.IDClient, cl.Lastname, cl.Firstname, 7 lev, GetCountChilds(t7.IDClient, t0.IDPlanType, 7) nChildCount "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t2 ON t2.IDClParent = t1.IDClient and t2.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t3 ON t3.IDClParent = t2.IDClient and t3.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t4 ON t4.IDClParent = t3.IDClient and t4.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t5 ON t5.IDClParent = t4.IDClient and t5.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t6 ON t6.IDClParent = t5.IDClient and t5.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t7 ON t7.IDClParent = t6.IDClient and t7.IDPlanType = t0.IDPlanType "
			+"join Client cl on cl.ID = t7.IDClient "
			+"join Client clp on clp.ID = t7.IDClParent "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = "+nIDPlanType+"";
	let qry = db.query(sqlStruct, function(err, rows){
		if(err) throw err;
		var jsonMLM = { chart: { container: "#OrganiseChart-simple", rootOrientation: "NORTH" /*NORTH || EAST || WEST || SOUTH*/, scrollbar: "native" /*"native" || "fancy" || "None"*/, connectors: {type: "curve" /*'curve' || 'step' || 'straight' || 'bCurve'*/, style: {"stroke-width": 2 }}, animateOnInit: false, node: { collapsable: true }, animation: { nodeAnimation: "easeOutBounce", nodeSpeed: 700, connectorsAnimation: "bounce", connectorsSpeed: 700 } }, nodeStructure: {}};
		var str0 = {};
		var str1 = {};
		var str2 = {};
		var str3 = {};
		var str4 = {};
		var str5 = {};
		var str6 = {};
		var str7 = {};
		var nCl0 = 0;
		var nCl1 = 0;
		var nCl2 = 0;
		var nCl3 = 0;
		var nCl4 = 0;
		var nCl5 = 0;
		var nCl6 = 0;
		var nCl7 = 0;
		rows.forEach(function(row) {
			if (row.lev == 0) {
				nCl0 = row.IDClient;
				if (row.nChildCount == 0) {
					str0 = {text: {name: nCl0+" "+row.Firstname+" "+row.Lastname}, collapsed: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				} else {
					str0 = {text: {name: nCl0+" "+row.Firstname+" "+row.Lastname}, collapsed: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				}
			}
			if (row.lev == 1) {
				nCl1 = row.IDClient;
				if (row.nChildCount == 0) {
					str1 = {text: {name: nCl1+" "+row.Firstname+" "+row.Lastname}, collapsed: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				} else {
					str1 = {text: {name: nCl1+" "+row.Firstname+" "+row.Lastname}, collapsed: true, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				}
				str0['children'].push(str1);
			}
			if (row.lev == 2) {
				nCl2 = row.IDClient;
				if (row.nChildCount == 0) {
					str2 = {text: {name: nCl2+" "+row.Firstname+" "+row.Lastname}, collapsed: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				} else {
					str2 = {text: {name: nCl2+" "+row.Firstname+" "+row.Lastname}, collapsed: true, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				}
				str1['children'].push(str2);
			}
			if (row.lev == 3) {
				nCl3 = row.IDClient;
				if (row.nChildCount == 0) {
					str3 = {text: {name: nCl3+" "+row.Firstname+" "+row.Lastname}, collapsed: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				} else {
					str3 = {text: {name: nCl3+" "+row.Firstname+" "+row.Lastname}, collapsed: true, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				}
				str2['children'].push(str3);
			}
			if (row.lev == 4) {
				nCl4 = row.IDClient;
				if (row.nChildCount == 0) {
					str4 = {text: {name: nCl4+" "+row.Firstname+" "+row.Lastname}, collapsed: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				} else {
					str4 = {text: {name: nCl4+" "+row.Firstname+" "+row.Lastname}, collapsed: true, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				}
				str3['children'].push(str4);
			}
			if (row.lev == 5) {
				nCl5 = row.IDClient;
				if (row.nChildCount == 0) {
					str5 = {text: {name: nCl5+" "+row.Firstname+" "+row.Lastname}, collapsed: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				} else {
					str5 = {text: {name: nCl5+" "+row.Firstname+" "+row.Lastname}, collapsed: true, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				}
				str4['children'].push(str5);
			}
			if (row.lev == 6) {
				nCl6 = row.IDClient;
				if (row.nChildCount == 0) {
					str6 = {text: {name: nCl6+" "+row.Firstname+" "+row.Lastname}, collapsed: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				} else {
					str6 = {text: {name: nCl6+" "+row.Firstname+" "+row.Lastname}, collapsed: true, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				}
				str5['children'].push(str6);
			}
			if (row.lev == 7) {
				nCl7 = row.IDClient;
				str7 = {text: {name: nCl7+" "+row.Firstname+" "+row.Lastname}, collapsed: false, pseudo: true, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				str6['children'].push(str7);
			}
		});//end of result0.forEach
		jsonMLM.nodeStructure = str0;
		
		//res.send(JSON.stringify(jsonMLM));
		//res.json(JSON.stringify(jsonMLM));
		res.json(jsonMLM);
	});//end of let q0 = db.query
});





app.get('/cab', function(req, res) {
	var nClientID = 0;
	var sPwd = "";
	var nPlanTypeID = 1;
	var sessData = req.session;
	if(sessData.userID > nClientID && sessData.userPWD != ""){
		nClientID = sessData.userID;
		sPwd = sessData.userPWD;
		//nPlanTypeID = sessData.planTypeID;
		nPlanTypeID = req.query.pt;
	}
	else {
		res.send("Вам нужно зайти под своим логином и паролем.<br><a href='/'>Вернуться на сайт</a>");
		return;
	}
	//res.render('cab', {clientID: nClientID});
	if (nPlanTypeID != 1 && nPlanTypeID != 2 && nPlanTypeID != 3 && nPlanTypeID != 4) {
		nPlanTypeID = 1;
	}
	var sql = "";
	sql = "select cl.*, DATE_FORMAT(cl.Birthdate, '%Y-%m-%d') clBirthdate, cn.Shortname CountryCitz, GetCountChildsForBonus(cl.ID, " + nPlanTypeID + ") AS CountChilds from Client cl join Users u on u.ID = cl.ID and u.pwd = password('" + sPwd + "') left join Country cn on cn.ID = cl.IDCountryCitz where cl.ID = " + nClientID;
	/*sql = "select cl.*, DATE_FORMAT(cl.Birthdate, '%Y-%m-%d') clBirthdate, cn.Shortname CountryCitz from Client cl join Users u on u.ID = cl.ID and u.pwd = password('" + sPwd + "') left join Country cn on cn.ID = cl.IDCountryCitz where cl.ID = " + nClientID;*/
	let querySelf = db.query(sql, function(err, result){
    	if(err) {throw err;}
		if (result.length == 0) {
			res.send("No client selected! Возможно вы ввели неправильный идентификатор клиента или неправильно ввели пароль.<br><a href='/'>Вернуться на сайт</a>");
			return;
		}
		
		//var sessData = req.session;
  		//sessData.userID = nClientID;
		//sessData.userPWD = sPwd;
		
		var sqlStr = ""
			+"SELECT t0.IDPlanType, t0.IDClParent, clp.Lastname LastnameP, clp.Firstname FirstnameP, t0.IDClient, cl.Lastname, cl.Firstname, 0 lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName "
			+"FROM Struct t0 "
			+"join Client cl on cl.ID = t0.IDClient "
			+"join Client clp on clp.ID = t0.IDClParent "
			+"join PlanType pt on pt.ID = t0.IDPlanType "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = " + nPlanTypeID + " "
			+"UNION ALL "
			+"SELECT t1.IDPlanType, t1.IDClParent, clp.Lastname, clp.Firstname, t1.IDClient, cl.Lastname, cl.Firstname, 1 lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"join Client cl on cl.ID = t1.IDClient "
			+"join Client clp on clp.ID = t1.IDClParent "
			+"join PlanType pt on pt.ID = t0.IDPlanType "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = " + nPlanTypeID + " "
			+"UNION ALL "
			+"SELECT t2.IDPlanType, t2.IDClParent, clp.Lastname, clp.Firstname, t2.IDClient, cl.Lastname, cl.Firstname, 2 lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t2 ON t2.IDClParent = t1.IDClient and t2.IDPlanType = t0.IDPlanType "
			+"join Client cl on cl.ID = t2.IDClient "
			+"join Client clp on clp.ID = t2.IDClParent "
			+"join PlanType pt on pt.ID = t0.IDPlanType "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = " + nPlanTypeID + " "
			+"UNION ALL "
			+"SELECT t3.IDPlanType, t3.IDClParent, clp.Lastname, clp.Firstname, t3.IDClient, cl.Lastname, cl.Firstname, 3 lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t2 ON t2.IDClParent = t1.IDClient and t2.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t3 ON t3.IDClParent = t2.IDClient and t3.IDPlanType = t0.IDPlanType "
			+"join Client cl on cl.ID = t3.IDClient "
			+"join Client clp on clp.ID = t3.IDClParent "
			+"join PlanType pt on pt.ID = t0.IDPlanType "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = " + nPlanTypeID + " "
			+"UNION ALL "
			+"SELECT t4.IDPlanType, t4.IDClParent, clp.Lastname, clp.Firstname, t4.IDClient, cl.Lastname, cl.Firstname, 4 lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t2 ON t2.IDClParent = t1.IDClient and t2.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t3 ON t3.IDClParent = t2.IDClient and t3.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t4 ON t4.IDClParent = t3.IDClient and t4.IDPlanType = t0.IDPlanType "
			+"join Client cl on cl.ID = t4.IDClient "
			+"join Client clp on clp.ID = t4.IDClParent "
			+"join PlanType pt on pt.ID = t0.IDPlanType "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = " + nPlanTypeID + " "
			+"UNION ALL "
			+"SELECT t5.IDPlanType, t5.IDClParent, clp.Lastname, clp.Firstname, t5.IDClient, cl.Lastname, cl.Firstname, 5 lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t2 ON t2.IDClParent = t1.IDClient and t2.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t3 ON t3.IDClParent = t2.IDClient and t3.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t4 ON t4.IDClParent = t3.IDClient and t4.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t5 ON t5.IDClParent = t4.IDClient and t5.IDPlanType = t0.IDPlanType "
			+"join Client cl on cl.ID = t5.IDClient "
			+"join Client clp on clp.ID = t5.IDClParent "
			+"join PlanType pt on pt.ID = t0.IDPlanType "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = " + nPlanTypeID + " "
			+"UNION ALL "
			+"SELECT t6.IDPlanType, t6.IDClParent, clp.Lastname, clp.Firstname, t6.IDClient, cl.Lastname, cl.Firstname, 6 lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t2 ON t2.IDClParent = t1.IDClient and t2.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t3 ON t3.IDClParent = t2.IDClient and t3.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t4 ON t4.IDClParent = t3.IDClient and t4.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t5 ON t5.IDClParent = t4.IDClient and t5.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t6 ON t6.IDClParent = t5.IDClient and t6.IDPlanType = t0.IDPlanType "
			+"join Client cl on cl.ID = t6.IDClient "
			+"join Client clp on clp.ID = t6.IDClParent "
			+"join PlanType pt on pt.ID = t0.IDPlanType "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = " + nPlanTypeID + " "
			+"UNION ALL "
			+"SELECT t7.IDPlanType, t7.IDClParent, clp.Lastname, clp.Firstname, t7.IDClient, cl.Lastname, cl.Firstname, 7 lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t2 ON t2.IDClParent = t1.IDClient and t2.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t3 ON t3.IDClParent = t2.IDClient and t3.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t4 ON t4.IDClParent = t3.IDClient and t4.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t5 ON t5.IDClParent = t4.IDClient and t5.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t6 ON t6.IDClParent = t5.IDClient and t6.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t7 ON t7.IDClParent = t6.IDClient and t7.IDPlanType = t0.IDPlanType "
			+"join Client cl on cl.ID = t7.IDClient "
			+"join Client clp on clp.ID = t7.IDClParent "
			+"join PlanType pt on pt.ID = t0.IDPlanType "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = " + nPlanTypeID + "";
		let queryStr = db.query(sqlStr, function(errStr, rows){
			if(errStr) {throw errStr;}
			var userID = sessData.userID;
			var userPWD = sessData.userPWD;
			var nPlanTypeID1 = 1;
			var nPlanTypeID2 = 0;
			var nPlanTypeID4 = 0;
			if (nPlanTypeID == 1) {
				nPlanTypeID1 = 1;
				nPlanTypeID2 = 0;
				nPlanTypeID4 = 0;
			}
			if (nPlanTypeID == 2) {
				nPlanTypeID1 = 0;
				nPlanTypeID2 = 2;
				nPlanTypeID4 = 0;
			}
			if (nPlanTypeID == 4) {
				nPlanTypeID1 = 0;
				nPlanTypeID2 = 0;
				nPlanTypeID4 = 4;
			}
			let sSQLBonus = "select b.ID, b.IDClient, b.IDPlanType, b.BonusDate, DATE_FORMAT(b.BonusDate, '%Y-%m-%d') clBonusDate, b.IsPayed, case when b.IsPayed = 1 then 'Выплачен' else 'Не выплачен' end PayedLabel, b.Amount, b.ChildCount, pt.Name as PlanTypeName from Bonuses b join PlanType pt on pt.ID = b.IDPlanType "
				+"WHERE b.IDClient = " + nClientID + " and b.IDPlanType = " + nPlanTypeID + "";
			let queryBonus = db.query(sSQLBonus, function(errBonus, rowsBonus){
				if(errBonus) {throw errBonus;}
				res.render('cab', {clientID: userID, clientPWD: userPWD, selfItems: result, items: rows, planTypeID1: nPlanTypeID1, planTypeID2: nPlanTypeID2, planTypeID4: nPlanTypeID4, bonusList: rowsBonus});
			});
		});
	});
});



app.post('/cab', function(req, res, next) {
	
	var nClientID = 0;// = req.body.login;
	var sPwd = "";// = req.body.pwd;
	var bIsReg = false;// = req.body.registration;
	var nPlanTypeID = 1;
	
	//var btnSaveAnketaClick = req.body.btnSaveAnketa;
	//alert("btnSaveAnketaClick = "+btnSaveAnketaClick);
	
	var sessData = req.session;
	if(sessData.userID > 0 && sessData.userPWD != ""){
		nClientID = sessData.userID;
		sPwd = sessData.userPWD;
		bIsReg = sessData.isReg;
		//nPlanTypeID = sessData.planTypeID;
	}
	else {
		nClientID = req.body.login;
		sPwd = req.body.pwd;
		nPlanTypeID = req.body.radioPlanType;
		bIsReg = req.body.registration;
		sessData.isReg = bIsReg;
		//sessData.planTypeID = nPlanTypeID;
	}
	
	if(bIsReg){
		res.send("Онлайн-регистрация пока не доступна.<br><a href='/'>Вернуться на сайт</a>");
		return;
		//if(sPwd == ""){sPwd = "QWEasd@123";}
	}
	
	if (nPlanTypeID != 1 && nPlanTypeID != 2 && nPlanTypeID != 3 && nPlanTypeID != 4) {
		nPlanTypeID = 1;
	}
	var sql = "";
	sql = "select cl.*, DATE_FORMAT(cl.Birthdate, '%Y-%m-%d') clBirthdate, cn.Shortname CountryCitz, GetCountChildsForBonus(cl.ID, " + nPlanTypeID + ") AS CountChilds from Client cl join Users u on u.ID = cl.ID and u.pwd = password('" + sPwd + "') left join Country cn on cn.ID = cl.IDCountryCitz where cl.ID = " + nClientID;
	/*sql = "select cl.*, DATE_FORMAT(cl.Birthdate, '%Y-%m-%d') clBirthdate, cn.Shortname CountryCitz, 1 CountChilds from Client cl join Users u on u.ID = cl.ID and u.pwd = password('" + sPwd + "') left join Country cn on cn.ID = cl.IDCountryCitz where cl.ID = " + nClientID;*/
	let querySelf = db.query(sql, function(err, result, fields){
    	if(err) {throw err;}
		if (result.length == 0) {
			res.send("No client selected! Возможно вы ввели неправильный идентификатор клиента или неправильно ввели пароль.<br><a href='/'>Вернуться на сайт</a>");
			return;
		}
		
		//var sessData = req.session;
  		sessData.userID = nClientID;
		sessData.userPWD = sPwd;
		
		var sqlStr = ""
			+"SELECT t0.IDPlanType, t0.IDClParent, clp.Lastname LastnameP, clp.Firstname FirstnameP, t0.IDClient, cl.Lastname, cl.Firstname, 0 lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName "
			+"FROM Struct t0 "
			+"join Client cl on cl.ID = t0.IDClient "
			+"join Client clp on clp.ID = t0.IDClParent "
			+"join PlanType pt on pt.ID = t0.IDPlanType "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = " + nPlanTypeID + " "
			+"UNION ALL "
			+"SELECT t1.IDPlanType, t1.IDClParent, clp.Lastname, clp.Firstname, t1.IDClient, cl.Lastname, cl.Firstname, 1 lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"join Client cl on cl.ID = t1.IDClient "
			+"join Client clp on clp.ID = t1.IDClParent "
			+"join PlanType pt on pt.ID = t0.IDPlanType "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = " + nPlanTypeID + " "
			+"UNION ALL "
			+"SELECT t2.IDPlanType, t2.IDClParent, clp.Lastname, clp.Firstname, t2.IDClient, cl.Lastname, cl.Firstname, 2 lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t2 ON t2.IDClParent = t1.IDClient and t2.IDPlanType = t0.IDPlanType "
			+"join Client cl on cl.ID = t2.IDClient "
			+"join Client clp on clp.ID = t2.IDClParent "
			+"join PlanType pt on pt.ID = t0.IDPlanType "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = " + nPlanTypeID + " "
			+"UNION ALL "
			+"SELECT t3.IDPlanType, t3.IDClParent, clp.Lastname, clp.Firstname, t3.IDClient, cl.Lastname, cl.Firstname, 3 lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t2 ON t2.IDClParent = t1.IDClient and t2.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t3 ON t3.IDClParent = t2.IDClient and t3.IDPlanType = t0.IDPlanType "
			+"join Client cl on cl.ID = t3.IDClient "
			+"join Client clp on clp.ID = t3.IDClParent "
			+"join PlanType pt on pt.ID = t0.IDPlanType "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = " + nPlanTypeID + " "
			+"UNION ALL "
			+"SELECT t4.IDPlanType, t4.IDClParent, clp.Lastname, clp.Firstname, t4.IDClient, cl.Lastname, cl.Firstname, 4 lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t2 ON t2.IDClParent = t1.IDClient and t2.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t3 ON t3.IDClParent = t2.IDClient and t3.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t4 ON t4.IDClParent = t3.IDClient and t4.IDPlanType = t0.IDPlanType "
			+"join Client cl on cl.ID = t4.IDClient "
			+"join Client clp on clp.ID = t4.IDClParent "
			+"join PlanType pt on pt.ID = t0.IDPlanType "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = " + nPlanTypeID + " "
			+"UNION ALL "
			+"SELECT t5.IDPlanType, t5.IDClParent, clp.Lastname, clp.Firstname, t5.IDClient, cl.Lastname, cl.Firstname, 5 lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t2 ON t2.IDClParent = t1.IDClient and t2.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t3 ON t3.IDClParent = t2.IDClient and t3.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t4 ON t4.IDClParent = t3.IDClient and t4.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t5 ON t5.IDClParent = t4.IDClient and t5.IDPlanType = t0.IDPlanType "
			+"join Client cl on cl.ID = t5.IDClient "
			+"join Client clp on clp.ID = t5.IDClParent "
			+"join PlanType pt on pt.ID = t0.IDPlanType "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = " + nPlanTypeID + " "
			+"UNION ALL "
			+"SELECT t6.IDPlanType, t6.IDClParent, clp.Lastname, clp.Firstname, t6.IDClient, cl.Lastname, cl.Firstname, 6 lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t2 ON t2.IDClParent = t1.IDClient and t2.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t3 ON t3.IDClParent = t2.IDClient and t3.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t4 ON t4.IDClParent = t3.IDClient and t4.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t5 ON t5.IDClParent = t4.IDClient and t5.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t6 ON t6.IDClParent = t5.IDClient and t6.IDPlanType = t0.IDPlanType "
			+"join Client cl on cl.ID = t6.IDClient "
			+"join Client clp on clp.ID = t6.IDClParent "
			+"join PlanType pt on pt.ID = t0.IDPlanType "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = " + nPlanTypeID + " "
			+"UNION ALL "
			+"SELECT t7.IDPlanType, t7.IDClParent, clp.Lastname, clp.Firstname, t7.IDClient, cl.Lastname, cl.Firstname, 7 lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName "
			+"FROM Struct t0 "
			+"JOIN Struct t1 ON t1.IDClParent = t0.IDClient and t1.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t2 ON t2.IDClParent = t1.IDClient and t2.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t3 ON t3.IDClParent = t2.IDClient and t3.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t4 ON t4.IDClParent = t3.IDClient and t4.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t5 ON t5.IDClParent = t4.IDClient and t5.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t6 ON t6.IDClParent = t5.IDClient and t6.IDPlanType = t0.IDPlanType "
			+"JOIN Struct t7 ON t7.IDClParent = t6.IDClient and t7.IDPlanType = t0.IDPlanType "
			+"join Client cl on cl.ID = t7.IDClient "
			+"join Client clp on clp.ID = t7.IDClParent "
			+"join PlanType pt on pt.ID = t0.IDPlanType "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = " + nPlanTypeID + "";
		let queryStr = db.query(sqlStr, function(errStr, rows){
			if(errStr) {throw errStr;}
			var userID = sessData.userID;
			var userPWD = sessData.userPWD;
			var nPlanTypeID1 = 1;
			var nPlanTypeID2 = 0;
			var nPlanTypeID4 = 0;
			if (nPlanTypeID == 1) {
				nPlanTypeID1 = 1;
				nPlanTypeID2 = 0;
				nPlanTypeID4 = 0;
			}
			if (nPlanTypeID == 2) {
				nPlanTypeID1 = 0;
				nPlanTypeID2 = 2;
				nPlanTypeID4 = 0;
			}
			if (nPlanTypeID == 4) {
				nPlanTypeID1 = 0;
				nPlanTypeID2 = 0;
				nPlanTypeID4 = 4;
			}
			let sSQLBonus = "select b.ID, b.IDClient, b.IDPlanType, b.BonusDate, DATE_FORMAT(b.BonusDate, '%Y-%m-%d') clBonusDate, b.IsPayed, case when b.IsPayed = 1 then 'Выплачен' else 'Не выплачен' end PayedLabel, b.Amount, b.ChildCount, pt.Name as PlanTypeName from Bonuses b join PlanType pt on pt.ID = b.IDPlanType "
				+"WHERE b.IDClient = " + nClientID + " and b.IDPlanType = " + nPlanTypeID + "";
			let queryBonus = db.query(sSQLBonus, function(errBonus, rowsBonus){
				if(errBonus) {throw errBonus;}
				res.render('cab', {clientID: userID, clientPWD: userPWD, selfItems: result, items: rows, planTypeID1: nPlanTypeID1, planTypeID2: nPlanTypeID2, planTypeID4: nPlanTypeID4, bonusList: rowsBonus});
			});
		});
	});
});



app.post('/newpwd', function(req, res) {
	var nClientID = req.body.id;; //req.param('id');
  	var sOldPwd = req.body.oldpwd;; //req.param('oldpwd');
  	var sNewPwd = req.body.newpwd;; //req.param('newpwd');
	var sNewPwdAgain = req.body.newpwdagain;; //req.param('newpwdagain');
	if (sOldPwd == "") {
		res.send('Введите старый пароль');
		return;
	}
	if (sNewPwd != sNewPwdAgain) {
		res.send('Новый пароль неверный. Смена не удалась');
		return;
	}
	let sql = "update Users set pwd = password('" + sNewPwd + "') where id = " + nClientID + " and pwd = password('"+sOldPwd+"')";
	let query = db.query(sql, function(err, result) {
		if(err) throw err;
		//console.log(result);
		res.send('Пароль изменен');
	});
});

app.post('/updanketa', function(req, res) {
	var nClientID = req.body.id; //req.param('id');
  	var sLastname = req.body.Lastname; //req.param('Lastname');
	var sFirstname = req.body.Firstname;
	var sMiddlename = req.body.Middlename;
	var sEmail = req.body.Email;
	var sCountryCitz = req.body.CountryCitz;
	var sIIN = req.body.IIN;
	var sPasspNum = req.body.PasspNum;
	var dBirthdate = req.body.Birthdate;
	var bGender = req.body.Gender;
	
	if (sLastname == "") {
		res.send('Введите вашу фамилию');
		return;
	}
	if (sFirstname == "") {
		res.send('Введите ваше имя');
		return;
	}
	let sql = "update Client set Lastname = '" + sLastname + "', Firstname = '" + sFirstname + "', Middlename = '" + sMiddlename + "', Email = '"+sEmail+"', iin = '"+sIIN+"', PasspNum = '"+sPasspNum+"', Birthdate = '" + dBirthdate + "', Gender = "+bGender+" where id = " + nClientID;
	let query = db.query(sql, function(err, result) {
		if(err) throw err;
		//console.log(result);
		res.send('Анкета сохранена. Вам нужно перелогиниться');
	});
});




// insert client 1
app.get('/addclient1', (req, res) => {
	let post = {lastname:'test1last', firstname:'test1first'};
	let sql = 'insert into client set ?';
	let query = db.query(sql, post, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.send('client 1 added...');
	});
});
//update client
app.get('/updateclient/:id', (req, res) => {
	let newLastname = 'qweqwe';
	let sql = "update client set lastname = '" + newLastname + "' where id = " + req.params.id;
	let query = db.query(sql, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.send('client updated...');
	});
});
//delete client
app.get('/deleteclient/:id', (req, res) => {
	let newLastname = 'qweqwe';
	let sql = "delete from client where id = " + req.params.id;
	let query = db.query(sql, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.send('client deleted...');
	});
});








app.get('/admin', function(req, res, next) {
	var nAdminID = 0;
	var sAdminLogin = "";
	var sPwd = "";
	var bIsAdm = true;
	var sessData = req.session;
	if(sessData.adminID > 0 && sessData.adminLogin != "" && sessData.adminPWD != ""){
		nAdminID = sessData.adminID;
		sAdminLogin = sessData.adminLogin;
		sPwd = sessData.adminPWD;
	}
	res.render('admhome', {isAdmin: bIsAdm, adminID: nAdminID, adminLogin: sAdminLogin, adminPwd: sPwd});
});
app.post('/admin', function(req, res) {
	var nAdminID = 0;
	var sAdminLogin = req.body.admlogin;
	var sPwd = req.body.admpwd;
	var bIsAdm = true;
	var sBtnLogin = req.body.btnAdmLogin;
	var sessData = req.session;
	if(sessData.adminID > 0 && sessData.adminLogin != "" && sessData.adminPWD != ""){
		nAdminID = sessData.adminID;
		sAdminLogin = sessData.adminLogin;
		sPwd = sessData.adminPWD;
	}
	else {
		if (sBtnLogin == "Войти") {
			let sqlAdm = "SELECT a.Email, a.Pwd "
				+"FROM Admins a "
				+"WHERE upper(a.Email) = upper('" + req.body.admlogin + "') and a.Pwd = Password('" + req.body.admpwd + "') limit 1 ";
			let queryAdm = db.query(sqlAdm, function(errAdm, admResult){
				if(errAdm) {throw errAdm;}
				var bFinish = false;
				admResult.forEach(function(row) {
					if (bFinish == false) {
						if (row.Email != "") {
							nAdminID = 1;
							sAdminLogin = row.Email;//req.body.admlogin;
							sPwd = row.Pwd;//req.body.admpwd;
							sessData.adminID = 1;
							sessData.adminLogin = row.Email;
							sessData.adminPWD = row.Pwd;
							bFinish = true;
						}
					}
				});
			});
			//res.send('after foreach sAdminLogin=' + sAdminLogin); //testing
			//res.render('admhome', {isAdmin: bIsAdm, adminID: nAdminID, adminLogin: sAdminLogin, adminPwd: sPwd});
			//return;
		}
		else {
			res.send('admin post ??? sAdminLogin=' + sAdminLogin + ', sessData.adminLogin=' + sessData.adminLogin);
		}
	}
	//res.send('sAdminLogin=' + sAdminLogin); //testing
	res.render('admhome', {isAdmin: bIsAdm, adminID: nAdminID, adminLogin: sAdminLogin, adminPwd: sPwd});
});
app.get('/exadm', function(req, res){
	req.session.destroy(function(err) {
		if(err){throw err;}
	});
	res.redirect('/admin');
});
app.get('/admproducts', function(req, res, next) {
	var sAdminLogin = "";
	var sessData = req.session;
	if(sessData.adminLogin != ""){
		sAdminLogin = sessData.adminLogin;
	}
	let sqlPr = "SELECT p.ID, p.Name, p.Price, p.Descr, p.ImgPath, p.ImgAlt, p.isActual "
		+"FROM Product p "
		+"WHERE p.isActual = 1 ";
	let qryPr = db.query(sqlPr, function(errPr, prResult){
		if(errPr) {throw errPr;}
		res.render('admhome', {adminLogin: sAdminLogin, productList: prResult});
	});
});
app.get('/admclients', function(req, res, next) {
	var sAdminLogin = "";
	var sessData = req.session;
	if(sessData.adminLogin != ""){
		sAdminLogin = sessData.adminLogin;
	}
	
	let sqlCl = "SELECT cl.ID, cl.Lastname, cl.Firstname, cl.Middlename, cl.Birthdate, cl.Gender FROM Client cl ";
	let qryCl = db.query(sqlCl, function(errCl, clResult){
		if(errCl) {throw errCl;}
		res.render('admhome', {adminLogin: sAdminLogin, clientList: clResult});
	});
});

app.get('/loadprods', function(req, res) {
	let sqlPr = "SELECT p.ID, p.Name, p.Price, p.Descr, p.ImgPath, p.ImgAlt, p.isActual "
		+"FROM Product p "
		+"WHERE p.isActual = 1 ";
	let qryPr = db.query(sqlPr, function(errPr, prResult){
		if(errPr) {throw errPr;}
		var jsonProducts = {products: []};
		//var jsonProducts = {};
		var sPrName = "";
		var nPrPrice = 0;
		var sPrDescr = "";
		var sPrImgPath = "";
		var jsonPr = {};
		prResult.forEach(function(row) {
			sPrName = row.Name;
			nPrPrice = row.Price;
			sPrDescr = row.Descr;
			sPrImgPath = row.ImgPath;
			jsonPr = {name: sPrName, price: nPrPrice, descr: sPrDescr, ImgPath: sPrImgPath};
			jsonProducts['products'].push(jsonPr);
			//jsonProducts.push(jsonPr);
		});
		res.json(jsonProducts);
	});
});
app.get('/loadclients', function(req, res) {
	let sqlCl = "SELECT cl.ID, cl.Lastname, cl.Firstname, cl.Middlename, cl.Birthdate, cl.Gender "
		+"FROM Client cl "
		+"WHERE 1 = 1 ";
	let qryCl = db.query(sqlCl, function(errCl, clResult){
		if(errCl) {throw errCl;}
		var jsonClients = {clients: []};
		var nClientID = 0;
		var sClLastname = "";
		var sClFirstname = "";
		var sClMiddlename = "";
		var jsonCl = {};
		clResult.forEach(function(row) {
			nClientID = row.ID;
			sClLastname = row.Lastname;
			sClFirstname = row.Firstname;
			sClMiddlename = row.Middlename;
			jsonCl = {ID: nClientID, Lastname: sClLastname, Firstname: sClFirstname, Middlename: sClMiddlename};
			jsonClients['clients'].push(jsonCl);
		});
	});
	res.json(jsonClients);
});





app.use(function(req, res, next){
	console.log('Looking for URL : ' + req.url);
	next();
});

app.get('/junk', function(req, res, next){
	console.log('Tried to access /junk');
	throw new Error('/junk doesn\'t exist');
});

app.use(function(err, req, res, next){
	console.log('Error : ' + err.message);
	next();
});

app.get('/about', function(req, res){
	res.render('about');
});


app.get('/contact', function(req, res){
	res.render('contact', { csrf: 'CSRF token here' });
});

app.get('/thankyou', function(req, res){
	res.render('thankyou');
});

app.post('/process', function(req, res){
	console.log('Form : ' + req.query.form);
	console.log('CSRF token : ' + req.body._csrf);
	console.log('Email : ' + req.body.email);
	console.log('Question : ' + req.body.ques);
	res.redirect(303, '/thankyou');
});

app.get('/file-upload', function(req, res){
	var now = new Date();
	console.log('Year = '+now.getFullYear() + ', month = ' + now.getMonth());
	res.render('file-upload', {
		year: now.getFullYear(),
		month: now.getMonth()
	});
});

app.get('/file-upload/:year/:month', function(req, res){
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, file){
		if(err)
			return res.redirect(303, '/error');
		console.log('Received File');

		console.log(file);
		res.redirect( 303, '/thankyou');
	});
});

app.get('/cookie', function(req, res){
	res.cookie('username', 'Kuanysh', {expire: new Date() + 9999}).send('Usename has the value of Kuanysh');
});

app.get('/listcookies', function(req, res){
	console.log("Cookies : " + req.cookies);
	res.send("Look in the console for cookies");
});

app.get('/deletecookie', function(req, res){
	res.clearCookie('username');
	res.send('username Cookie Deleted');
});




app.use(function(req, res, next){
	var views = req.session.views;
	if(!views){
		views = req.session.views = {};
	}
	var pathname = parseurl(req).pathname;
	views[pathname] = (views[pathname] || 0) + 1;
	next();
});
app.get('/viewcount', function(req, res, next){
	res.send('You viewed this page ' + req.session.views['/viewcount'] + ' times. <a href="/exss">exit sess</a>');
});
app.get('/exss', function(req, res){
	req.session.destroy(function(err) {
		if(err){throw err;}
	})
	res.redirect('/');
});


var fs = require('fs');

app.get('/readfile', function(req, res, next){
	fs.readFile('./public/randomfile.txt', function(err, data){
		if(err)
			return console.error(err);
		res.send("the file : " + data.toString());
	});
});

app.get('/writefile', function(req, res, next){
	fs.writeFile('./public/randomfile2.txt', 'More random text', function(err){
		if(err){
			return console.error(err);
		}
	});
	fs.readFile('./public/randomfile2.txt', function(err, data){
		if(err){
			return console.error(err);
		}
		res.send("The file " + data.toString());
	});
});



app.use(function(req, res){
	res.type('text/html');
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});


app.listen(app.get('port'), function(){
	console.log("Express started on http://localhost:" + app.get('port') + ' press Ctrl-C to terminate');
});


