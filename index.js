const express = require('express');
const app = express();
const mysql = require('mysql');
var session = require('express-session');
var parseurl = require('parseurl');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var credentials = require('./credentials.js');
var handlebars = require('express-handlebars');
var fs = require('fs');
var nodeMailer = require('nodemailer');

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

var hbs = handlebars.create({
	defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        foo: function () { return 'FOO!'; },
		iff: function(a, operator, b, opts) {
				var bool = false;
				switch(operator) {
				   case '==':
					   bool = a == b;
					   break;
				   case '>':
					   bool = a > b;
					   break;
				   case '<':
					   bool = a < b;
					   break;
				   case '>=':
					   bool = a >= b;
					   break;
				   case '<=':
					   bool = a <= b;
					   break;
				   default:
					   throw "Unknown operator " + operator;
				}
				if (bool) {
					return opts.fn(this);
				} else {
					return opts.inverse(this);
				}
			},
        foo2: function () { return 'FOO2!'; }
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(require('cookie-parser')(credentials.cookieSecret));

app.set('port', process.env.PORT || 3000);

var router = express.Router();

app.use(express.static(__dirname + '/public'));

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
	cookie: { maxAge: 1000*60*60*2 } //время сессии
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


app.get('/gallery', (req, res) => {
	var nClientID = 0;
	var sPwd = "";
	var sessData = req.session;
	if(sessData.userID > 0 && sessData.userPWD != ""){
		nClientID = sessData.userID;
		sPwd = sessData.userPWD;
	}
	var sFolder = './wp-content/uploads/gallery/';
	var sSubfolder = "";
	if (sessData.gallerySubfolder) {
		if (sessData.gallerySubfolder != "") {
			sSubfolder = sessData.gallerySubfolder;
			sFolder = sFolder+sSubfolder+'/';
			sessData.gallerySubfolder = "";
		}
	}
	var listFiles = [];
	var nN = 0;
	fs.readdir(sFolder, (err, files) => {
		if (err) { return console.error(err); }
		files.forEach(file => {
			var checkingPath = sFolder + file.toString();
			fs.stat(checkingPath, (errCh, stats) => {
				if (errCh) { return console.error(errCh); }
				if (stats.isFile()) {
					nN = nN + 1;
					listFiles.push({id: nN, imgPath: checkingPath, type: "FILE"});
				}
				else {
					if (stats.isDirectory()) {
						listFiles.push({id: -1, imgPath: file.toString(), type: "DIR"});
					}
				}
			});
		});
	});
	res.render('gallery', {clientID: nClientID, listFiles: listFiles});
});

app.get('/gallery/:subfolder', (req, res) => {
	var sSubfolder = req.params.subfolder;
	var sessData = req.session;
	sessData.gallerySubfolder = sSubfolder;
	res.redirect('/gallery');
});

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
		//console.log(result);
		res.send('client fetched: '+result);
	});
});
app.get('/file-upload/:year/:month', function(req, res){
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, file){
		if(err)
			return res.redirect(303, '/error');
		//console.log('Received File');

		//console.log(file);
		res.redirect( 303, '/thankyou');
	});
});
app.get('/getChartData', function(req, res){
	var nClientID = req.query.cid;
	var nIDPlanType = req.query.pt;
	var form = new formidable.IncomingForm();
	let sqlStruct = ""
			+"SELECT t0.IDPlanType, t0.IDClParent, clp.Lastname LastnameP, clp.Firstname FirstnameP, t0.IDClient, cl.Lastname, cl.Firstname, 0 lev, GetCountChilds(t0.IDClient, t0.IDPlanType, 0) nChildCount "
			+"FROM Struct t0 "
			+"join Client cl on cl.ID = t0.IDClient "
			+"left join Client clp on clp.ID = t0.IDClParent "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = "+nIDPlanType+" "
			+"UNION ALL "
			+"SELECT ou.IDPlanType, ou.IDClParent, clp.Lastname LastnameP, clp.Firstname FirstnameP, ou.IDClient, cl.Lastname, cl.Firstname, ou.level lev, GetCountChilds(ou.IDClient, ou.IDPlanType, 0) nChildCount "
			+"FROM ( "
			+"	SELECT hi.IDPlanType, hi.IDClParent, hi.IDClient, ho.level FROM ( "
			+"		SELECT hierarchy_connect_by_parent_eq_prior_id(s.IDClient, s.IDPlanType) AS id, s.IDPlanType, "
			+"			@level AS level "
			+"			FROM ( "
			+"				SELECT @start_with := " + nClientID + ", @id := @start_with, @level := 0 "
			+"				) vars, Struct s "
			+"			WHERE @id IS NOT NULL and s.IDPlanType = "+nIDPlanType+" "
			+"		) ho "
			+"	JOIN Struct hi ON hi.IDClient = ho.id and hi.IDPlanType = ho.IDPlanType "
			+"	where ho.level <= 7 "
			+") ou "
			+"join Client cl on cl.ID = ou.IDClient "
			+"join Client clp on clp.ID = ou.IDClParent";
	let qry = db.query(sqlStruct, function(err, rows){
		if(err) throw err;
		var jsonMLM = { chart: { container: "#OrganiseChart-simple", rootOrientation: "NORTH" /*NORTH || EAST || WEST || SOUTH*/, scrollbar: "native" /*"native" || "fancy" || "None"*/, connectors: {type: "step" /*'curve' || 'step' || 'straight' || 'bCurve'*/, style: {"stroke-width": 2 }}, animateOnInit: false, node: { collapsable: true, HTMLclass: "big-commpany" }, animation: { nodeAnimation: "easeOutBounce", nodeSpeed: 700, connectorsAnimation: "bounce", connectorsSpeed: 700 } }, nodeStructure: {}};
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
				str1 = {};
				str2 = {};
				str3 = {};
				str4 = {};
				str5 = {};
				str6 = {};
				str7 = {};
				nCl0 = row.IDClient;
				if (row.nChildCount == 0) {
					str0 = {text: {name: nCl0+" "+row.Firstname+" "+row.Lastname}, collapsed: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				} else {
					str0 = {text: {name: nCl0+" "+row.Firstname+" "+row.Lastname}, collapsed: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				}
			}
			if (row.lev == 1) {
				str2 = {};
				str3 = {};
				str4 = {};
				str5 = {};
				str6 = {};
				str7 = {};
				nCl1 = row.IDClient;
				if (row.nChildCount == 0) {
					str1 = {text: {name: nCl1+" "+row.Firstname+" "+row.Lastname}, collapsed: false, stackChildren: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				} else {
					str1 = {text: {name: nCl1+" "+row.Firstname+" "+row.Lastname}, collapsed: true, stackChildren: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				}
				str0['children'].push(str1);
			}
			if (row.lev == 2) {
				str3 = {};
				str4 = {};
				str5 = {};
				str6 = {};
				str7 = {};
				nCl2 = row.IDClient;
				if (row.nChildCount == 0) {
					str2 = {text: {name: nCl2+" "+row.Firstname+" "+row.Lastname}, collapsed: false, stackChildren: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				} else {
					str2 = {text: {name: nCl2+" "+row.Firstname+" "+row.Lastname}, collapsed: true, stackChildren: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				}
				str1['children'].push(str2);
			}
			if (row.lev == 3) {
				str4 = {};
				str5 = {};
				str6 = {};
				str7 = {};
				nCl3 = row.IDClient;
				if (row.nChildCount == 0) {
					str3 = {text: {name: nCl3+" "+row.Firstname+" "+row.Lastname}, collapsed: false, stackChildren: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				} else {
					str3 = {text: {name: nCl3+" "+row.Firstname+" "+row.Lastname}, collapsed: true, stackChildren: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				}
				str2['children'].push(str3);
			}
			if (row.lev == 4) {
				str5 = {};
				str6 = {};
				str7 = {};
				nCl4 = row.IDClient;
				if (row.nChildCount == 0) {
					str4 = {text: {name: nCl4+" "+row.Firstname+" "+row.Lastname}, collapsed: false, stackChildren: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				} else {
					str4 = {text: {name: nCl4+" "+row.Firstname+" "+row.Lastname}, collapsed: true, stackChildren: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				}
				str3['children'].push(str4);
			}
			if (row.lev == 5) {
				str6 = {};
				str7 = {};
				nCl5 = row.IDClient;
				if (row.nChildCount == 0) {
					str5 = {text: {name: nCl5+" "+row.Firstname+" "+row.Lastname}, collapsed: false, stackChildren: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				} else {
					str5 = {text: {name: nCl5+" "+row.Firstname+" "+row.Lastname}, collapsed: true, stackChildren: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				}
				str4['children'].push(str5);
			}
			if (row.lev == 6) {
				str7 = {};
				nCl6 = row.IDClient;
				if (row.nChildCount == 0) {
					str6 = {text: {name: nCl6+" "+row.Firstname+" "+row.Lastname}, collapsed: false, stackChildren: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				} else {
					str6 = {text: {name: nCl6+" "+row.Firstname+" "+row.Lastname}, collapsed: true, stackChildren: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
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


app.get('/getTreeData', function(req, res){
	var nClientID = req.query.cid;
	var nIDPlanType = req.query.pt;
	var form = new formidable.IncomingForm();
	let sqlStruct = ""
			+"SELECT t0.IDPlanType, t0.IDClParent, clp.Lastname LastnameP, clp.Firstname FirstnameP, t0.IDClient, cl.Lastname, cl.Firstname, 0 lev, GetCountChilds(t0.IDClient, t0.IDPlanType, 0) nChildCount "
			+"FROM Struct t0 "
			+"join Client cl on cl.ID = t0.IDClient "
			+"left join Client clp on clp.ID = t0.IDClParent "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = "+nIDPlanType+" "
			+"UNION ALL "
			+"SELECT ou.IDPlanType, ou.IDClParent, clp.Lastname LastnameP, clp.Firstname FirstnameP, ou.IDClient, cl.Lastname, cl.Firstname, ou.level lev, GetCountChilds(ou.IDClient, ou.IDPlanType, 0) nChildCount "
			+"FROM ( "
			+"	SELECT hi.IDPlanType, hi.IDClParent, hi.IDClient, ho.level FROM ( "
			+"		SELECT hierarchy_connect_by_parent_eq_prior_id(s.IDClient, s.IDPlanType) AS id, s.IDPlanType, "
			+"			@level AS level "
			+"			FROM ( "
			+"				SELECT @start_with := " + nClientID + ", @id := @start_with, @level := 0 "
			+"				) vars, Struct s "
			+"			WHERE @id IS NOT NULL and s.IDPlanType = "+nIDPlanType+" "
			+"		) ho "
			+"	JOIN Struct hi ON hi.IDClient = ho.id and hi.IDPlanType = ho.IDPlanType "
			+"	where ho.level <= 7 "
			+") ou "
			+"join Client cl on cl.ID = ou.IDClient "
			+"join Client clp on clp.ID = ou.IDClParent";
	let qry = db.query(sqlStruct, function(err, rows){
		if(err) throw err;
		var jsonMLM = { nodeStructure: []};
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
				str1 = {};
				str2 = {};
				str3 = {};
				str4 = {};
				str5 = {};
				str6 = {};
				str7 = {};
				nCl0 = row.IDClient;
				str0 = {idclient: nCl0, name: nCl0+" "+row.Firstname+" "+row.Lastname, children: []};
			}
			if (row.lev == 1) {
				str2 = {};
				str3 = {};
				str4 = {};
				str5 = {};
				str6 = {};
				str7 = {};
				nCl1 = row.IDClient;
				str1 = {idclient: nCl1, name: nCl1+" "+row.Firstname+" "+row.Lastname, children: []};
				str0['children'].push(str1);
			}
			if (row.lev == 2) {
				str3 = {};
				str4 = {};
				str5 = {};
				str6 = {};
				str7 = {};
				nCl2 = row.IDClient;
				str2 = {idclient: nCl2, name: nCl2+" "+row.Firstname+" "+row.Lastname, children: []};
				str1['children'].push(str2);
			}
			if (row.lev == 3) {
				str4 = {};
				str5 = {};
				str6 = {};
				str7 = {};
				nCl3 = row.IDClient;
				str3 = {idclient: nCl3, name: nCl3+" "+row.Firstname+" "+row.Lastname, children: []};
				str2['children'].push(str3);
			}
			if (row.lev == 4) {
				str5 = {};
				str6 = {};
				str7 = {};
				nCl4 = row.IDClient;
				str4 = {idclient: nCl4, name: nCl4+" "+row.Firstname+" "+row.Lastname, children: []};
				str3['children'].push(str4);
			}
			if (row.lev == 5) {
				str6 = {};
				str7 = {};
				nCl5 = row.IDClient;
				str5 = {idclient: nCl5, name: nCl5+" "+row.Firstname+" "+row.Lastname, children: []};
				str4['children'].push(str5);
			}
			if (row.lev == 6) {
				str7 = {};
				nCl6 = row.IDClient;
				str6 = {idclient: nCl6, name: nCl6+" "+row.Firstname+" "+row.Lastname, children: []};
				str5['children'].push(str6);
			}
			if (row.lev == 7) {
				nCl7 = row.IDClient;
				str7 = {idclient: nCl7, name: nCl7+" "+row.Firstname+" "+row.Lastname, children: []};
				str6['children'].push(str7);
			}
		});//end of result0.forEach
		//jsonMLM.nodeStructure = str0;
		jsonMLM['nodeStructure'].push(str0);
		res.json(jsonMLM);
	});//end of let q0 = db.query
});



////test /////////////////////////////
app.get('/getChartDatatest', function(req, res){
	var nClientID = req.query.cid;
	var nIDPlanType = req.query.pt;
	var form = new formidable.IncomingForm();
	let sqlStruct = ""
			+"SELECT t0.IDPlanType, t0.IDClParent, clp.Lastname LastnameP, clp.Firstname FirstnameP, t0.IDClient, cl.Lastname, cl.Firstname, 0 lev, GetCountChilds(t0.IDClient, t0.IDPlanType, 0) nChildCount "
			+"FROM Struct t0 "
			+"join Client cl on cl.ID = t0.IDClient "
			+"left join Client clp on clp.ID = t0.IDClParent "
			+"WHERE t0.IDClient = " + nClientID + " and t0.IDPlanType = "+nIDPlanType+" "
			+"UNION ALL "
			+"SELECT ou.IDPlanType, ou.IDClParent, clp.Lastname LastnameP, clp.Firstname FirstnameP, ou.IDClient, cl.Lastname, cl.Firstname, ou.level lev, GetCountChilds(ou.IDClient, ou.IDPlanType, 0) nChildCount "
			+"FROM ( "
			+"	SELECT hi.IDPlanType, hi.IDClParent, hi.IDClient, ho.level FROM ( "
			+"		SELECT hierarchy_connect_by_parent_eq_prior_id(s.IDClient, s.IDPlanType) AS id, s.IDPlanType, "
			+"			@level AS level "
			+"			FROM ( "
			+"				SELECT @start_with := " + nClientID + ", @id := @start_with, @level := 0 "
			+"				) vars, Struct s "
			+"			WHERE @id IS NOT NULL and s.IDPlanType = "+nIDPlanType+" "
			+"		) ho "
			+"	JOIN Struct hi ON hi.IDClient = ho.id and hi.IDPlanType = ho.IDPlanType "
			+"	where ho.level <= 7 "
			+") ou "
			+"join Client cl on cl.ID = ou.IDClient "
			+"join Client clp on clp.ID = ou.IDClParent";
	let qry = db.query(sqlStruct, function(err, rows){
		if(err) throw err;
		var jsonMLM = { chart: { container: "#OrganiseChart-simple", rootOrientation: "NORTH" /*NORTH || EAST || WEST || SOUTH*/, scrollbar: "native" /*"native" || "fancy" || "None"*/, connectors: {type: "step" /*'curve' || 'step' || 'straight' || 'bCurve'*/, style: {"stroke-width": 2 }}, animateOnInit: false, node: { collapsable: true, HTMLclass: "big-commpany" }, animation: { nodeAnimation: "easeOutBounce", nodeSpeed: 700, connectorsAnimation: "bounce", connectorsSpeed: 700 } }, nodeStructure: {}};
		var str0 = {};
		var str1 = {};
		var str2 = {};
		var str3 = {};
		var nCl0 = 0;
		var nCl1 = 0;
		var nCl2 = 0;
		var nCl3 = 0;
		rows.forEach(function(row) {
			if (row.lev == 0) {
				str1 = {};
				str2 = {};
				str3 = {};
				nCl0 = row.IDClient;
				if (row.nChildCount == 0) {
					str0 = {text: {name: nCl0+" "+row.Firstname+" "+row.Lastname}, collapsed: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				} else {
					str0 = {text: {name: nCl0+" "+row.Firstname+" "+row.Lastname}, collapsed: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				}
			}
			if (row.lev == 1) {
				str2 = {};
				str3 = {};
				nCl1 = row.IDClient;
				if (row.nChildCount == 0) {
					str1 = {text: {name: nCl1+" "+row.Firstname+" "+row.Lastname}, collapsed: false, stackChildren: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				} else {
					str1 = {text: {name: nCl1+" "+row.Firstname+" "+row.Lastname}, collapsed: true, stackChildren: false, connectors: {style: {'stroke': '#8080FF', 'arrow-end': 'block-wide-long'}}, children: []};
				}
				str0['children'].push(str1);
			}
		});//end of result0.forEach
		jsonMLM.nodeStructure = str0;
		res.json(jsonMLM);
	});//end of let q0 = db.query
});
//////////////////////////////////////




app.get('/cab', function(req, res) {
	var nClientID = 0;
	var sPwd = "";
	var nPlanTypeID = 1;
	var nPlanTypeID0 = 0;
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
	if (nPlanTypeID != 1 && nPlanTypeID != 2 && nPlanTypeID != 3 && nPlanTypeID != 4) {
		nPlanTypeID = 1;
		nPlanTypeID0 = 0;
	}
	else {
		nPlanTypeID0 = nPlanTypeID;
	}
	var sql = "";
	/*sql = "select cl.*, DATE_FORMAT(cl.Birthdate, '%Y-%m-%d') clBirthdate, cn.Shortname CountryCitz, GetCountChildsForBonus(cl.ID, " + nPlanTypeID + ") AS CountChilds, ifnull(GetCountChilds(cl.ID, " + nPlanTypeID + ", 0),0)+ifnull(GetCountChilds(cl.ID, " + nPlanTypeID + ", 1),0)+ifnull(GetCountChilds(cl.ID, " + nPlanTypeID + ", 2),0)+ifnull(GetCountChilds(cl.ID, " + nPlanTypeID + ", 3),0)+ifnull(GetCountChilds(cl.ID, " + nPlanTypeID + ", 4),0)+ifnull(GetCountChilds(cl.ID, " + nPlanTypeID + ", 5),0)+ifnull(GetCountChilds(cl.ID, " + nPlanTypeID + ", 6),0)+ifnull(GetCountChilds(cl.ID, " + nPlanTypeID + ", 7),0) AS CountStr, ifnull(GetCurrentClientTitle(cl.ID, " + nPlanTypeID + "),'Клиент') ClientTitle from Client cl join Users u on u.ID = cl.ID and (u.pwd = password('" + sPwd + "') or u.pwd = '" + sPwd + "') left join Country cn on cn.ID = cl.IDCountryCitz where cl.ID = " + nClientID;*/
	sql = "select cl.*, DATE_FORMAT(cl.Birthdate, '%Y-%m-%d') clBirthdate, cn.Shortname CountryCitz, GetCountChForBonus2(cl.ID, " + nPlanTypeID + ") AS CountChilds, ifnull(GetCountChilds2(cl.ID, " + nPlanTypeID + ", 0),0)+ifnull(GetCountChilds2(cl.ID, " + nPlanTypeID + ", 1),0)+ifnull(GetCountChilds2(cl.ID, " + nPlanTypeID + ", 2),0)+ifnull(GetCountChilds2(cl.ID, " + nPlanTypeID + ", 3),0)+ifnull(GetCountChilds2(cl.ID, " + nPlanTypeID + ", 4),0)+ifnull(GetCountChilds2(cl.ID, " + nPlanTypeID + ", 5),0)+ifnull(GetCountChilds2(cl.ID, " + nPlanTypeID + ", 6),0)+ifnull(GetCountChilds2(cl.ID, " + nPlanTypeID + ", 7),0) AS CountStr, ifnull(GetCurrentClientTitle(cl.ID, " + nPlanTypeID + "),'Клиент') ClientTitle from Client cl join Users u on u.ID = cl.ID and (u.pwd = password('" + sPwd + "') or u.pwd = '" + sPwd + "') left join Country cn on cn.ID = cl.IDCountryCitz where cl.ID = " + nClientID;
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
		var sqlStr = ``
			+`SELECT t0.IDPlanType, t0.IDClParent, clp.Lastname LastnameP, clp.Firstname FirstnameP, t0.IDClient, cl.Lastname, cl.Firstname, 0 lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName 
			FROM Struct t0 
			join Client cl on cl.ID = t0.IDClient 
			left join Client clp on clp.ID = t0.IDClParent 
			join PlanType pt on pt.ID = t0.IDPlanType
			WHERE t0.IDClient = `+nClientID+` and t0.IDPlanType = `+nPlanTypeID+`
			UNION ALL 
			SELECT ou.IDPlanType, ou.IDClParent, clp.Lastname LastnameP, clp.Firstname FirstnameP, ou.IDClient, cl.Lastname, cl.Firstname, ou.level lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName 
			FROM ( 
			SELECT hi.IDPlanType, hi.IDClParent, hi.IDClient, ho.level FROM ( 
			SELECT hierarchy_connect_by_parent_eq_prior_id(s.IDClient, s.IDPlanType) AS id, s.IDPlanType, 
			@level AS level 
			FROM ( 
			SELECT @start_with := `+nClientID+`, @id := @start_with, @level := 0 
			) vars, Struct s 
			WHERE @id IS NOT NULL and s.IDPlanType = `+nPlanTypeID+`
			) ho 
			JOIN Struct hi ON hi.IDClient = ho.id and hi.IDPlanType = ho.IDPlanType 
			where ho.level <= 7 
			) ou 
			join Client cl on cl.ID = ou.IDClient 
			join Client clp on clp.ID = ou.IDClParent
			join PlanType pt on pt.ID = ou.IDPlanType`;
		let queryStr = db.query(sqlStr, function(errStr, structRows){
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
			var sqlBonuses = "select b.ID, b.IDClient, b.IDPLanType, DATE_FORMAT(b.BonusDate, '%Y-%m-%d') BonusDate, b.IsPayed, b.Amount, b.ChildCount, b.RankTitle from Bonuses b where b.IDClient = " + nClientID + " and b.IDPlanType = " + nPlanTypeID + "";
			let queryBonuses = db.query(sqlBonuses, function(errBonuses, bonusesRows){
				if(errBonuses) {throw errBonuses;}
				var sqlSalary = "select s.ID, s.IDClient, s.IDPlanType, DATE_FORMAT(s.PeriodFrom, '%d.%m.%Y') PeriodFrom, DATE_FORMAT(s.PeriodTo, '%d.%m.%Y') PeriodTo, DATE_FORMAT(s.CalcDate, '%Y-%m-%d') CalcDate, DATE_FORMAT(s.PayDate, '%Y-%m-%d') PayDate, s.IsPayed, s.Amount from Salary s where s.IDClient = " + nClientID + " and s.IDPlanType = " + nPlanTypeID + " order by s.ID";
				let querySalary = db.query(sqlSalary, function(errSalary, salaryRows){
					if(errSalary) {throw errSalary;}
					res.render('cab', {clientID: userID, clientPWD: userPWD, selfItems: result, structItems: structRows, bonusItems: bonusesRows, salaryItems: salaryRows, planTypeID0: nPlanTypeID0, planTypeID1: nPlanTypeID1, planTypeID2: nPlanTypeID2, planTypeID4: nPlanTypeID4});
				});
			});
		});
	});
});



app.post('/cab', function(req, res, next) {
	
	var nClientID = 0;// = req.body.login;
	var sPwd = "";// = req.body.pwd;
	var bIsReg = false;// = req.body.registration;
	var nPlanTypeID = 1;
	var nPlanTypeID0 = 0;
	
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
		//if(sPwd == ""){sPwd = "1234567";}
	}
	
	if (nPlanTypeID != 1 && nPlanTypeID != 2 && nPlanTypeID != 3 && nPlanTypeID != 4) {
		nPlanTypeID = 1;
		nPlanTypeID0 = 0;
	}
	else {
		nPlanTypeID0 = nPlanTypeID;
	}
	var sql = "";
	/*sql = "select cl.*, DATE_FORMAT(cl.Birthdate, '%Y-%m-%d') clBirthdate, cn.Shortname CountryCitz, GetCountChildsForBonus(cl.ID, " + nPlanTypeID + ") AS CountChilds, ifnull(GetCountChilds(cl.ID, " + nPlanTypeID + ", 0),0)+ifnull(GetCountChilds(cl.ID, " + nPlanTypeID + ", 1),0)+ifnull(GetCountChilds(cl.ID, " + nPlanTypeID + ", 2),0)+ifnull(GetCountChilds(cl.ID, " + nPlanTypeID + ", 3),0)+ifnull(GetCountChilds(cl.ID, " + nPlanTypeID + ", 4),0)+ifnull(GetCountChilds(cl.ID, " + nPlanTypeID + ", 5),0)+ifnull(GetCountChilds(cl.ID, " + nPlanTypeID + ", 6),0)+ifnull(GetCountChilds(cl.ID, " + nPlanTypeID + ", 7),0) AS CountStr, ifnull(GetCurrentClientTitle(cl.ID, " + nPlanTypeID + "),'Клиент') ClientTitle from Client cl join Users u on u.ID = cl.ID and (u.pwd = password('" + sPwd + "') or u.pwd = '" + sPwd + "') left join Country cn on cn.ID = cl.IDCountryCitz where cl.ID = " + nClientID;*/
	sql = "select cl.*, DATE_FORMAT(cl.Birthdate, '%Y-%m-%d') clBirthdate, cn.Shortname CountryCitz, GetCountChForBonus2(cl.ID, " + nPlanTypeID + ") AS CountChilds, ifnull(GetCountChilds2(cl.ID, " + nPlanTypeID + ", 0),0)+ifnull(GetCountChilds2(cl.ID, " + nPlanTypeID + ", 1),0)+ifnull(GetCountChilds2(cl.ID, " + nPlanTypeID + ", 2),0)+ifnull(GetCountChilds2(cl.ID, " + nPlanTypeID + ", 3),0)+ifnull(GetCountChilds2(cl.ID, " + nPlanTypeID + ", 4),0)+ifnull(GetCountChilds2(cl.ID, " + nPlanTypeID + ", 5),0)+ifnull(GetCountChilds2(cl.ID, " + nPlanTypeID + ", 6),0)+ifnull(GetCountChilds2(cl.ID, " + nPlanTypeID + ", 7),0) AS CountStr, ifnull(GetCurrentClientTitle(cl.ID, " + nPlanTypeID + "),'Клиент') ClientTitle from Client cl join Users u on u.ID = cl.ID and (u.pwd = password('" + sPwd + "') or u.pwd = '" + sPwd + "') left join Country cn on cn.ID = cl.IDCountryCitz where cl.ID = " + nClientID;
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
		var sqlStr = ``
			+`SELECT t0.IDPlanType, t0.IDClParent, clp.Lastname LastnameP, clp.Firstname FirstnameP, t0.IDClient, cl.Lastname, cl.Firstname, 0 lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName 
			FROM Struct t0 
			join Client cl on cl.ID = t0.IDClient 
			left join Client clp on clp.ID = t0.IDClParent 
			join PlanType pt on pt.ID = t0.IDPlanType
			WHERE t0.IDClient = `+nClientID+` and t0.IDPlanType = `+nPlanTypeID+`
			UNION ALL 
			SELECT ou.IDPlanType, ou.IDClParent, clp.Lastname LastnameP, clp.Firstname FirstnameP, ou.IDClient, cl.Lastname, cl.Firstname, ou.level lev, concat(pt.Name,'-',pt.AmountEnter) as PlanTypeName 
			FROM ( 
			SELECT hi.IDPlanType, hi.IDClParent, hi.IDClient, ho.level FROM ( 
			SELECT hierarchy_connect_by_parent_eq_prior_id(s.IDClient, s.IDPlanType) AS id, s.IDPlanType, 
			@level AS level 
			FROM ( 
			SELECT @start_with := `+nClientID+`, @id := @start_with, @level := 0 
			) vars, Struct s 
			WHERE @id IS NOT NULL and s.IDPlanType = `+nPlanTypeID+`
			) ho 
			JOIN Struct hi ON hi.IDClient = ho.id and hi.IDPlanType = ho.IDPlanType 
			where ho.level <= 7 
			) ou 
			join Client cl on cl.ID = ou.IDClient 
			join Client clp on clp.ID = ou.IDClParent
			join PlanType pt on pt.ID = ou.IDPlanType`;
		let queryStr = db.query(sqlStr, function(errStr, structRows){
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
			var sqlBonuses = "select b.ID, b.IDClient, b.IDPLanType, DATE_FORMAT(b.BonusDate, '%Y-%m-%d') BonusDate, b.IsPayed, b.Amount, b.ChildCount, b.RankTitle from Bonuses b where b.IDClient = " + nClientID + " and b.IDPlanType = " + nPlanTypeID + "";
			let queryBonuses = db.query(sqlBonuses, function(errBonuses, bonusesRows){
				if(errBonuses) {throw errBonuses;}
				var sqlSalary = "select s.ID, s.IDClient, s.IDPlanType, DATE_FORMAT(s.PeriodFrom, '%d.%m.%Y') PeriodFrom, DATE_FORMAT(s.PeriodTo, '%d.%m.%Y') PeriodTo, DATE_FORMAT(s.CalcDate, '%Y-%m-%d') CalcDate, DATE_FORMAT(s.PayDate, '%Y-%m-%d') PayDate, s.IsPayed, s.Amount from Salary s where s.IDClient = " + nClientID + " and s.IDPlanType = " + nPlanTypeID + " order by s.ID";
				let querySalary = db.query(sqlSalary, function(errSalary, salaryRows){
					if(errSalary) {throw errSalary;}
					res.render('cab', {clientID: userID, clientPWD: userPWD, selfItems: result, structItems: structRows, bonusItems: bonusesRows, salaryItems: salaryRows, planTypeID0: nPlanTypeID0, planTypeID1: nPlanTypeID1, planTypeID2: nPlanTypeID2, planTypeID4: nPlanTypeID4});
				});
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
		//console.log(result);
		res.send('client 1 added...');
	});
});
//update client
app.get('/updateclient/:id', (req, res) => {
	let newLastname = 'qweqwe';
	let sql = "update client set lastname = '" + newLastname + "' where id = " + req.params.id;
	let query = db.query(sql, (err, result) => {
		if(err) throw err;
		//console.log(result);
		res.send('client updated...');
	});
});
//delete client
app.get('/deleteclient/:id', (req, res) => {
	let newLastname = 'qweqwe';
	let sql = "delete from client where id = " + req.params.id;
	let query = db.query(sql, (err, result) => {
		if(err) throw err;
		//console.log(result);
		res.send('client deleted...');
	});
});

app.get('/productprices', function(req, res) {
	let sqlPr = "SELECT p.ID, p.Name, p.NamePrice, p.Price, p.Descr, p.ImgPath, p.ImgAlt, p.isActual, p.IsShowProd, p.IsShowPrice "
		+"FROM Product p "
		+"WHERE p.isActual = 1 ";
	let qryPr = db.query(sqlPr, function(errPr, prResult){
		if(errPr) {throw errPr;}
		var jsonProducts = {products: []};
		var nPrID = 0;
		var sPrName = "";
		var sPrNamePrice = "";
		var nPrPrice = 0;
		var sPrDescr = "";
		var sPrImgPath = "";
		var sPrImgAlt = "";
		var nIsShowProd = "";
		var nIsShowPrice = "";
		var jsonPr = {};
		prResult.forEach(function(row) {
			nPrID = row.ID;
			sPrName = row.Name;
			sPrNamePrice = row.NamePrice;
			nPrPrice = row.Price;
			sPrDescr = row.Descr;
			sPrImgPath = row.ImgPath;
			sPrImgAlt = row.ImgAlt;
			nIsShowProd = row.IsShowProd;
			nIsShowPrice = row.IsShowPrice;
			jsonPr = {ID: nPrID, name: sPrName, namePrice: sPrNamePrice, price: nPrPrice, descr: sPrDescr, imgPath: sPrImgPath, imgAlt: sPrImgAlt, isShowProd: nIsShowProd, isShowPrice: nIsShowPrice};
			jsonProducts['products'].push(jsonPr);
		});
		res.json(jsonProducts);
	});
});

app.get('/sendemail', function(req, res) {
	let transporter = nodeMailer.createTransport({
		host: 'mail.diamondcity.kz',
		port: 25,
		auth: {
			user: 'p-13908', //p-13908, diamondcity.kz, autosender@diamondcity.kz, diana_aidar01.01.2013@mail.ru
			pass: 'Ayana2016@'
		}
	});
	let mailOptions = {
		from: 'autosender@diamondcity.kz', // sender address
		to: 'kuanysh.tuktubayev@mail.ru', //list of receivers
		subject: 'Тема письма', //Subject line
		//text: 'Текст тела письма', //plain text body
		html: '<b>Текст в формате html</b>' // html body
		/*,attachments: [
			{ // Use a URL as an attachment
				filename: 'your-testla.png',
				path: 'https://media.gettyimages.com/photos/view-of-tesla-model-s-in-barcelona-spain-on-september-10-2018-picture-id1032050330?s=2048x2048'
			}
		]*/
	};
	transporter.sendMail(mailOptions, (error, info) => {
    	if (error) {
			res.send(error);
		}
		//res.send('Message '+info.messageId+' sent: '+info.response+'');
		res.send('Message sent');
	});
});











/*------ admin page ----------*/

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
		res.render('admhome', {isAdmin: bIsAdm, adminID: nAdminID, adminLogin: sAdminLogin, adminPwd: sPwd});
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
							res.render('admhome', {isAdmin: bIsAdm, adminID: nAdminID, adminLogin: sAdminLogin, adminPwd: sPwd});
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
	//res.render('admhome', {isAdmin: bIsAdm, adminID: nAdminID, adminLogin: sAdminLogin, adminPwd: sPwd});
});
app.get('/exadm', function(req, res){
	req.session.destroy(function(err) {
		if(err){throw err;}
	});
	res.redirect('/admin');
});

app.get('/admproducts', function(req, res, next) {
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
	else{
		res.redirect('/admin');
		return;
	}
	
	var bIsNewProd = false;
	
	var nDelProdID = 0;
	var sUpdProdName = "";
	var bIsDelProdID = false;
	
	var bIsUpdProd = false;
	var nUpdProdID = 0;
	
	if (sessData.IsNewProd > 0) {
		bIsNewProd = sessData.IsNewProd;
		sessData.IsNewProd = 0;
	}
	else if (sessData.DelProdID > 0) {
		nDelProdID = sessData.DelProdID;
		sUpdProdName = sessData.UpdProdName;
		bIsDelProdID = true;
		sessData.DelProdID = 0;
		sessData.UpdProdName = "";
	}
	else if (sessData.UpdProdID > 0) {
		nUpdProdID = sessData.UpdProdID;
		sUpdProdName = sessData.UpdProdName;
		bIsUpdProd = true;
		sessData.UpdProdID = 0;
		sessData.UpdProdName = "";
	}
	
	let sqlPr = "SELECT p.ID, p.Name, p.NamePrice, p.Price, p.Descr, p.ImgPath, p.ImgAlt, p.isActual, p.IsShowProd, p.IsShowPrice "
		+"FROM Product p "
		+"WHERE p.isActual = 1 ";
	let qryPr = db.query(sqlPr, function(errPr, prResult){
		if(errPr) {throw errPr;}
		var sErrMsg = "";
		if (sessData.ErrMsg != "") {
			sErrMsg = sessData.ErrMsg;
		}
		if (bIsNewProd) {
			res.render('admhome', {isAdmin: bIsAdm, adminID: nAdminID, adminLogin: sAdminLogin, adminPwd: sPwd, productPage: true, productIsNew: bIsNewProd, productList: prResult, errMsg: sErrMsg});
		}
		else if (bIsDelProdID) {
			res.render('admhome', {isAdmin: bIsAdm, adminID: nAdminID, adminLogin: sAdminLogin, adminPwd: sPwd, productPage: true, prodIsDel: bIsDelProdID, prodDelID: nDelProdID, prodUpdName: sUpdProdName, productList: prResult, errMsg: sErrMsg});
		}
		else if (bIsUpdProd) {
			res.render('admhome', {isAdmin: bIsAdm, adminID: nAdminID, adminLogin: sAdminLogin, adminPwd: sPwd, productPage: true, prodIsUpd: bIsUpdProd, prodUpdID: nUpdProdID, prodUpdName: sUpdProdName, productList: prResult, errMsg: sErrMsg});
		}
		else {
			res.render('admhome', {isAdmin: bIsAdm, adminID: nAdminID, adminLogin: sAdminLogin, adminPwd: sPwd, productPage: true, productList: prResult, errMsg: sErrMsg});
		}
	});
});

app.post('/admsaveprod/:idproduct', function(req, res, next){
	var nAdminID = 0;
	var sAdminLogin = "";
	var sPwd = "";
	var bIsAdm = true;
	var sessData = req.session;
	var sUploadedImgWithPath = "";
	var sProdImgFolderDefault = "./wp-content/uploads/prods/";
	var nProductID = req.params.idproduct;
	if(sessData.adminID > 0 && sessData.adminLogin != "" && sessData.adminPWD != ""){
		nAdminID = sessData.adminID;
		sAdminLogin = sessData.adminLogin;
		sPwd = sessData.adminPWD;
	}
	else{
		res.redirect('/admin');
		return;
	}
	var form = new formidable.IncomingForm();
	form.parse(req, function(err0, fields, files) {
		if(err0) { return res.redirect(303, '/error'); }
		//var postValues = req.body;
		var postValues = fields;
		let sqlUpd = "";
		var sProdName = postValues.txName;
		var sProdNameForPrice = postValues.txNameForPrice;
		var nProdPrice = postValues.txPrice;
		var bIsShowProd = postValues.isShowProd;
		var bIsShowPrice = postValues.isShowPrice;
		var sProdDescr = postValues.txDescr;
		var sImgPath = sProdImgFolderDefault+postValues.txImgFileName;
		var sImgAlt = postValues.txImgAlt;
		if (!bIsShowProd) { bIsShowProd = 0; } else {
			if (bIsShowProd == "on") { bIsShowProd = 1; }
		}
		if (!bIsShowPrice) { bIsShowPrice = 0; } else {
			if (bIsShowPrice == "on") { bIsShowPrice = 1; }
		}
		if (!sProdDescr) { sProdDescr = ""; }
		if (sUploadedImgWithPath != "") {
			sImgPath = sUploadedImgWithPath;
		}
		else {
			if (!sImgPath) {
				sImgPath = sProdImgFolderDefault+"No_pic.jpg";
			}
		}
		if (!sImgAlt) { sImgAlt = ""; }
		if (nProdPrice == "") { nProdPrice = 0; }
		/*if (sUploadedImgWithPath != "") {
			sImgPath = sUploadedImgWithPath;
		}
		else {
			sImgPath = sProdImgFolderDefault+"No_pic.jpg";
		}*/
		if (files.fimgFile.size > 0) {
			// Temporary location of our uploaded file
			var temp_path = files.fimgFile.path;
			// The file name of the uploaded file
			var file_name = files.fimgFile.name;
			// Location where we want to copy the uploaded file
			var new_location = sProdImgFolderDefault;
			fs.readFile(temp_path, function(err1, data) {
				if(err1) { throw err1; }
				var bIsFileExists = false;
				try {
					if (fs.existsSync(new_location + file_name)) {
						bIsFileExists = true; //file exists
						sUploadedImgWithPath = new_location + file_name;
						sImgPath = sUploadedImgWithPath;
						sessData.ErrMsg = "Файл картинки не загружен, потому что такой файл раньше загружался, он и будет прикреплен к продукту";
					}
				} catch(errEx) {
					//console.error(errEx)
					bIsFileExists = false;
				}
				if (!bIsFileExists) {
					fs.writeFile(new_location + file_name, data, function(err2) {
						if(err2) { throw err2; }
						sUploadedImgWithPath = new_location + file_name;
						sImgPath = sUploadedImgWithPath;
						/*fs.unlink(temp_path, function(err3) {
							//not work, why?
							if(err3) { throw err3; }
							else {
								res.esnd("sUploadedImgWithPath="+sUploadedImgWithPath);
							}
						});*/
					});
				}
			});
		}
		else {
			sUploadedImgWithPath = "";
			sImgPath = sProdImgFolderDefault+"No_pic.jpg";
		}
		if (!sProdName || sProdName != "") {
			if (sImgPath == "") {
				sqlUpd = "update Product p set p.Name = '"+sProdName+"', p.NamePrice = '"+sProdNameForPrice+"', p.Price = "+nProdPrice+", p.Descr = '"+sProdDescr+"', p.ImgAlt = '"+sImgAlt+"', p.IsShowProd = "+bIsShowProd+", p.IsShowPrice = "+bIsShowPrice+" where p.ID = "+nProductID;
			}
			else {
				sqlUpd = "update Product p set p.Name = '"+sProdName+"', p.NamePrice = '"+sProdNameForPrice+"', p.Price = "+nProdPrice+", p.Descr = '"+sProdDescr+"', p.ImgPath = '"+sImgPath+"', p.ImgAlt = '"+sImgAlt+"', p.IsShowProd = "+bIsShowProd+", p.IsShowPrice = "+bIsShowPrice+" where p.ID = "+nProductID;
			}
			sessData.UpdProdID = nProductID;
			sessData.UpdProdName = sProdName;
		} else {
			sessData.ErrMsg = "Не удалось сохранить изменения. Неизвестная ошибка.";
			sessData.UpdProdID = 0;
			sessData.UpdProdName = "";
			res.redirect('/admproducts');
			return;
		}
		let qryPrUpd = db.query(sqlUpd, function(err, result) {
			if(err) throw err;
			res.redirect('/admproducts');
		});
    });
});
app.get('/admsaveprod/:idproduct', function(req, res, next){
	res.redirect('/admproducts');
});

app.post('/admnewprod', function(req, res, next){
	var nAdminID = 0;
	var sAdminLogin = "";
	var sPwd = "";
	var bIsAdm = true;
	var sessData = req.session;
	var sUploadedImgWithPath = "";
	var sProdImgFolderDefault = "./wp-content/uploads/prods/";
	if(sessData.adminID > 0 && sessData.adminLogin != "" && sessData.adminPWD != ""){
		nAdminID = sessData.adminID;
		sAdminLogin = sessData.adminLogin;
		sPwd = sessData.adminPWD;
	}
	else{
		res.redirect('/admin');
		return;
	}
	var form = new formidable.IncomingForm();
    form.parse(req, function(err0, fields, files) {
		if(err0) { return res.redirect(303, '/error'); }
		//var postValues = req.body;
		var postValues = fields;
		let sqlUpd = "";
		var sProdName = postValues.txName;
		var sProdNameForPrice = postValues.txNameForPrice;
		var nProdPrice = postValues.txPrice;
		var bIsShowProd = postValues.isShowProd;
		var bIsShowPrice = postValues.isShowPrice;
		var sProdDescr = postValues.txDescr;
		var sImgPath = sProdImgFolderDefault+postValues.txImgName_0;
		var sImgAlt = postValues.txImgAlt;
		if (!bIsShowProd) { bIsShowProd = 0; }
		if (!bIsShowPrice) { bIsShowPrice = 0; }
		if (!sProdDescr) { sProdDescr = ""; }
		if (!sImgAlt) { sImgAlt = ""; }
		if (nProdPrice == "") { nProdPrice = 0; }
		/*if (sUploadedImgWithPath != "") {
			sImgPath = sUploadedImgWithPath;
		}
		else {
			sImgPath = sProdImgFolderDefault+"No_pic.jpg";
		}*/
		if (files.fImgInp_0.size > 0) {
			// Temporary location of our uploaded file
			var temp_path = files.fImgInp_0.path;
			// The file name of the uploaded file
			var file_name = files.fImgInp_0.name;
			// Location where we want to copy the uploaded file
			var new_location = sProdImgFolderDefault;
			fs.readFile(temp_path, function(err1, data) {
				if(err1) { throw err1; }
				var bIsFileExists = false;
				try {
					if (fs.existsSync(new_location + file_name)) {
						bIsFileExists = true; //file exists
						sUploadedImgWithPath = new_location + file_name;
						sImgPath = sUploadedImgWithPath;
						sessData.ErrMsg = "Файл картинки не загружен, потому что такой файл раньше загружался, он и будет прикреплен к продукту";
					}
				} catch(errEx) {
					//console.error(errEx)
					bIsFileExists = false;
				}
				if (!bIsFileExists) {
					fs.writeFile(new_location + file_name, data, function(err2) {
						if(err2) { throw err2; }
						sUploadedImgWithPath = new_location + file_name;
						sImgPath = sUploadedImgWithPath;
						/*fs.unlink(temp_path, function(err3) {
							//not work, why?
							if(err3) { throw err3; }
							else {
								res.esnd("sUploadedImgWithPath="+sUploadedImgWithPath);
							}
						});*/
					});
				}
			});
		}
		else {
			sUploadedImgWithPath = "";
			sImgPath = sProdImgFolderDefault+"No_pic.jpg";
		}
		if (!sProdName || sProdName != "") {
			sqlUpd = "insert into Product (Name, NamePrice, Price, Descr, ImgPath, ImgAlt, isActual, IsShowProd, IsShowPrice) values('"+sProdName+"', '"+sProdNameForPrice+"', "+nProdPrice+", '"+sProdDescr+"', '"+sImgPath+"', '"+sImgAlt+"', 1, "+bIsShowProd+", "+bIsShowPrice+")";
			sessData.IsNewProd = 1;
		} else {
			sessData.ErrMsg = "Не удалось создать продукт. Неизвестная ошибка.";
			res.redirect('/admproducts');
			return;
		}
		let qryPrUpd = db.query(sqlUpd, function(err, result) {
			if(err) throw err;
			res.redirect('/admproducts');
		});
    });
});
app.get('/admnewprod', function(req, res, next){
	res.redirect('/admproducts');
});

app.post('/admdelprod/:idproduct', function(req, res, next){
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
	else{
		res.redirect('/admin');
		return;
	}
	var nProductID = req.params.idproduct;
	var postValues = req.body;
	let sqlUpd = "";
	sqlUpd = "update Product p set p.isActual = 0 where p.ID = "+nProductID;
	sessData.DelProdID = nProductID;
	sessData.UpdProdName = postValues.txName;
	let qryPrUpd = db.query(sqlUpd, function(err, result) {
		if(err) throw err;
		res.redirect('/admproducts');
	});
});
app.get('/admdelprod/:idproduct', function(req, res, next){
	res.redirect('/admproducts');
});

app.get('/admclients', function(req, res, next) {
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
	else{
		res.redirect('/admin');
		return;
	}
	
	/*var nUpdClientID = 0;
	var sUpdClientFIO = "";
	if (sessData.UpdClientID != 0) {
		nUpdClientID = sessData.UpdClientID;
		sUpdClientFIO = sessData.UpdClientFIO;
		sessData.UpdClientID = 0;
		sessData.UpdClientFIO = "";
	}*/
	var bIsNewClient = false;
	var sNewClientFIO = "";
	if (sessData.IsNewClient > 0) {
		bIsNewClient = sessData.IsNewClient;
		sNewClientFIO = sessData.NewClientFIO;
		sessData.IsNewClient = false;
		sessData.NewClientFIO = "";
	}
	
	let sqlCl = `SELECT cl.ID, cl.Lastname, cl.Firstname, cl.Middlename, 
					DATE_FORMAT(cl.Birthdate, '%Y-%m-%d') clBirthdate, cl.Gender, cl.Email, 
					cl.IIN, cl.PasspNum, cl.IDCountryCitz, ctr.Shortname CountryShortName 
				FROM Client cl 
				left join Country ctr on ctr.ID = cl.IDCountryCitz 
				where cl.ID >= 1000000000 `;
	let qryCl = db.query(sqlCl, function(errCl, clResult){
		if(errCl) {throw errCl;}
		let sqlCountry = `SELECT c.ID IDCountry, c.Shortname FROM Country c `;
		let qryCountry = db.query(sqlCountry, function(errCountry, countryResult){
			if(errCountry) {throw errCountry;}
			
			var sErrMsg = "";
			//var nUpdClientID = 0;
			//var sUpdClientFIO = "";
			if (sessData.ErrMsg != "") {
				sErrMsg = sessData.ErrMsg;
				sessData.ErrMsg = "";
			}
			
			if (bIsNewClient) {
				res.render('admhome', {isAdmin: bIsAdm, 
									   adminID: nAdminID,
									   adminLogin: sAdminLogin, 
									   adminPwd: sPwd, 
									   clientPage: true, 
									   clientList: clResult, 
									   countryList: countryResult,
									   clientIsNew: bIsNewClient,
									   clientNewFIO: sNewClientFIO,
									   errMsg: sErrMsg
									  });
			}
			else {
				res.render('admhome', {isAdmin: bIsAdm, 
									   adminID: nAdminID,
									   adminLogin: sAdminLogin, 
									   adminPwd: sPwd, 
									   clientPage: true, 
									   clientList: clResult, 
									   countryList: countryResult,
									   errMsg: sErrMsg
									  });
			}
		});
	});
});

app.get('/admclient', function(req, res, next) {
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
	else{
		res.redirect('/admin');
		return;
	}
	
	var postValues = req.body;
	
	var nClientID = req.query.cid;
	if (!nClientID) {
		sessData.ErrMsg = "Выберите клиента для редактирования";
		//sessData.UpdClientID = 0;
		//sessData.UpdClientFIO = "";
		res.redirect('/admclients');
		return;
	}
	
	/*var nUpdClientID = 0;
	var sUpdClientFIO = "";
	if (sessData.UpdClientID != 0) {
		nUpdClientID = sessData.UpdClientID;
		sUpdClientFIO = sessData.UpdClientFIO;
		sessData.UpdClientID = 0;
		sessData.UpdClientFIO = "";
	}*/
	
	let sqlCl = `SELECT cl.ID, cl.Lastname, cl.Firstname, cl.Middlename, 
					DATE_FORMAT(cl.Birthdate, '%Y-%m-%d') clBirthdate, cl.Gender, cl.Email, cl.IDCountryCitz, 
					cl.IIN, cl.PasspNum 
				FROM Client cl 
				where cl.ID >= 1000000000 and cl.ID = `+nClientID;
	let qryCl = db.query(sqlCl, function(errCl, clResult){
		if(errCl) {throw errCl;}
		let sqlCountry = `SELECT cn.ID, cn.Shortname, cn.Fullname, `+clResult[0].IDCountryCitz+` as IDCountryCitz FROM Country cn`;
		let qryCountry = db.query(sqlCountry, function(errCountry, countryResult){
			if(errCountry) {throw errCountry;}
			
			var sErrMsg = "";
			if (sessData.ErrMsg != "") {
				sErrMsg = sessData.ErrMsg;
				sessData.ErrMsg = "";
			}
			
			res.render('admhome', {isAdmin: bIsAdm,
								   adminID: nAdminID,
								   adminLogin: sAdminLogin,
								   adminPwd: sPwd,
								   clientPage: true, 
								   clientData: clResult,
								   countryList: countryResult,
								   errMsg: sErrMsg
								  });
			//res.send(sqlCl +'<br>'+ sqlCountry+'<br>'+'nAdminID='+nAdminID+'<br>'+clResult+'<br>'+countryResult);
		});
	});
});

app.post('/admsaveclient/:idclient', function(req, res, next){
	var nAdminID = 0;
	var sAdminLogin = "";
	var sPwd = "";
	var bIsAdm = true;
	var sessData = req.session;
	var nClientID = req.params.idclient;
	if(sessData.adminID > 0 && sessData.adminLogin != "" && sessData.adminPWD != ""){
		nAdminID = sessData.adminID;
		sAdminLogin = sessData.adminLogin;
		sPwd = sessData.adminPWD;
	}
	else{
		res.redirect('/admin');
		return;
	}
	
	if (!nClientID) {
		sessData.ErrMsg = "Выберите клиента для редактирования";
		//sessData.UpdClientID = 0;
		//sessData.UpdClientFIO = "";
		res.redirect('/admclients');
		return;
	}
	
	var form = new formidable.IncomingForm();
    form.parse(req, function(err0, fields, files) {
		if(err0) { return res.redirect(303, '/error'); }
		//var postValues = req.body;
		var postValues = fields;
		let sqlUpd = "";
		
		//var nClientID = postValues.idclient;
		var sClLastname = postValues.txClLastName;
		var sClFirstname = postValues.txClFirstName;
		var sClMiddlename = postValues.txClMiddleName;
		var sClBirthdate = postValues.txClBirthdate;
		var nClGender = postValues.txClGender;
		var sClEmail = postValues.txClEmail;
		var nClCountryCitz = postValues.nClCountryCitz;
		var sClIIN = postValues.txClIIN;
		var sClPasspNum = postValues.txClPasspNum;
		
		if (!sClMiddlename) { sClMiddlename = ""; }
		if (!sClEmail) { sClEmail = ""; }
		if (!sClIIN) { sClIIN = ""; }
		if (!sClPasspNum) { sClPasspNum = ""; }
		if (!nClGender || nClGender == "") { nClGender = 0; }
		if (!nClCountryCitz || nClCountryCitz == "") { nClCountryCitz = 1; }
		
		sqlUpd = `update Client cl 
				set cl.Lastname='`+sClLastname+`', 
					cl.Firstname='`+sClFirstname+`', 
					cl.Middlename='`+sClMiddlename+`', 
					cl.Birthdate=DATE_FORMAT('`+sClBirthdate+`', '%Y-%m-%d'), 
					cl.Gender=`+nClGender+`, 
					cl.Email='`+sClEmail+`', 
					cl.IDCountryCitz=`+nClCountryCitz+`, 
					cl.IIN='`+sClIIN+`', 
					cl.PasspNum='`+sClPasspNum+`' 
				where cl.ID = `+nClientID;
		//sessData.UpdClientID = nClientID;
		//sessData.UpdClientFIO = sClLastname +' '+ sClFirstname +' '+ sClMiddlename;
		
		let qryClUpd = db.query(sqlUpd, function(err, result) {
			if(err) throw err;
			res.redirect('/admclient?cid='+nClientID);
		});
    });
});
app.get('/admsaveclient/:idclient', function(req, res, next){
	var nClientID = req.params.idclient;
	res.redirect('/admclient?cid='+nClientID);
});

app.post('/admnewclient', function(req, res, next){
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
	else{
		res.redirect('/admin');
		return;
	}
	
	var form = new formidable.IncomingForm();
    form.parse(req, function(err0, fields, files) {
		if(err0) { return res.redirect(303, '/error'); }
		//var postValues = req.body;
		var postValues = fields;
		let sqlIns = "";
		
		var nClientID = 0; //postValues.idclient;
		var sClLastname = postValues.txClLastName;
		var sClFirstname = postValues.txClFirstName;
		var sClMiddlename = postValues.txClMiddleName;
		var sClBirthdate = postValues.txClBirthdate;
		var nClGender = postValues.txClGender;
		var sClEmail = postValues.txClEmail;
		var nClCountryCitz = postValues.nClCountryCitz;
		var sClIIN = postValues.txClIIN;
		var sClPasspNum = postValues.txClPasspNum;
		
		if (!sClMiddlename) { sClMiddlename = ""; }
		if (!sClEmail) { sClEmail = ""; }
		if (!sClIIN) { sClIIN = ""; }
		if (!sClPasspNum) { sClPasspNum = ""; }
		if (!nClGender || nClGender == "") { nClGender = 0; }
		if (!nClCountryCitz || nClCountryCitz == "") { nClCountryCitz = 1; }
		
		sqlIns = `insert into Client (Lastname, Firstname, Middlename, Birthdate, Gender, Email, IDCountryCitz, IIN, PasspNum)
				values('`+sClLastname+`', '`+sClFirstname+`', '`+sClMiddlename+`', DATE_FORMAT('`+sClBirthdate+`', '%Y-%m-%d'), `+nClGender+`, '`+sClEmail+`', `+nClCountryCitz+`, '`+sClIIN+`', '`+sClPasspNum+`')`;
		
		let qryClIns = db.query(sqlIns, function(err, result) {
			if (err) { throw err; }
			sessData.IsNewClient = true;
			sessData.NewClientFIO = sClLastname+' '+sClFirstname+' '+sClMiddlename;
			res.redirect('/admclients');
		});
    });
});
app.get('/admnewclient', function(req, res, next){
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
	else{
		res.redirect('/admin');
		return;
	}
	res.redirect('/admclients');
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


