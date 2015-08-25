var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig=require('swig');
var nodemailer=require('nodemailer');
var page=require('./controllers/page');
var admin=require('./controllers/admin')
var chat=require('./controllers/chat')
/*var socket = require('./controllers/socket.js');*/
var neo4j = require('neo4j');
var session = require('express-session');
var md5   = require('MD5');
var fs = require('fs');
var xml2js = require ('xml2js'); 
var app = express();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var mv = require('mv');
/*var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);*/
module.exports = app;
app.engine('html', swig.renderFile);
// view engine setup
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.set('view cache', 'true');
/*app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/views'))*/
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000000 }}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(multipartMiddleware);
/*var db = new neo4j.GraphDatabase({
    // Support specifying database info via environment variables,
    // but assume Neo4j installation defaults.
    url: process.env['NEO4J_URL'] || process.env['GRAPHENEDB_URL'] ||
        'http://neo4j:ananth@localhost:7474',
    auth: process.env['NEO4J_AUTH'],
});*/

//https://app.graphenedb.com/dbs/neo4j/connection
var db = new neo4j.GraphDatabase({
    // Support specifying database info via environment variables,
    // but assume Neo4j installation defaults.
    url: process.env['NEO4J_URL'] || process.env['GRAPHENEDB_URL'] ||
        'http://neo4j:L5mPUTZ8tvQ9DxNo3MRB@neo4j.sb02.stations.graphenedb.com:24789/db/data/',
    auth: process.env['NEO4J_AUTH'],
});



/*var b = new Buffer('admin');
var s = b.toString('base64');
console.log(s+'encrypt');

var a = new Buffer('dGVzdDEwMA', 'base64')
var m = a.toString();
console.log(m+'after decrypt');*/
// JavaScript

app.get('/',function(req,res){
  res.render('index.html');
})
app.get('/loggedin',page.loggedin);
/*app.get('/loggedin_admin',page.loggedin);*/
app.post('/forgotpassword', page.forgot_password);
app.post('/request_access',page.request_access);
app.post('/login',page.login);
app.post('/registration',page.registration);
app.get('/dashboard',page.dashboard);
app.post('/register_access',page.register_access);
app.post('/change_pass',page.change_password);
app.post('/logout',page.logout);
app.post('/update_profile',page.update_profile);

app.post('/adminlogin',admin.adminlogin);
app.get('/admindashboard',admin.admindashboard);
app.get('/brand_list',admin.brand_list);
app.get('/circle_list',admin.circle_list);
app.post('/add_brand',admin.add_brand);
app.post('/add_circle',admin.add_circle);
app.post('/delete_brand',admin.delete_brand);
app.post('/delete_circle',admin.delete_circle);
app.post('/get_single_brand',admin.get_single_brand);
app.post('/get_single_circle',admin.get_single_circle);
app.post('/edit_brand',admin.edit_brand);
app.post('/edit_circle',admin.edit_circle);
app.post('/add_story',admin.add_story);
app.get('/editor_list',admin.editor_list);
app.post('/create_group',chat.create_group);
app.post('/delete_fromGroup',page.delete_fromGroup);
app.get('/group_chat_details',page.group_chat_details);

app.get('/display_all_user',chat.display_all_user);
app.post('/add_to_group',chat.add_to_group);
app.post('/chatGroup/:id',chat.display_addedUser);
app.get('/other_group_invited',chat.other_group_invited)
app.post('/resetpassword/:token/:email',function(req,res){
  var token = req.params.token;
  var email = req.params.email;
  var np=req.body.new_password;
  var cp=req.body.confirm_password;
  /*console.log(token.split(':')[1]+'----'+email.split(':')[1]);
  console.log(np+'----'+cp);*/
  if(np==cp){
      var query = [
            'MATCH (n:Userdetails) ',
            'where (n.email="'+email.split(':')[1]+'" and n.token_generated="'+token+'")',
            'RETURN n.access_code as code,id(n) as id'
        ].join('\n');
        //console.log(query)
        db.cypher(query ,function (err, result) {
            if (err) {
              console.log(err);
            } else {
              //console.log(result);
              var pass = new Buffer(np)
                var password = pass.toString('base64');
                var query1 = [
                    'MATCH (n:Userdetails) ',
                    'where n.email="'+email.split(':')[1]+'"',
                    'SET n.password ="'+password+'"',
                    'RETURN n'
                ].join('\n');
                //console.log(query1)
                db.cypher(query1 ,function (err1, result1) {
                    if (err1) {
                      console.log(err1);
                    } else {
                      //console.log(result1);
                      res.send('password successfully changed')
                      
                    }
                  })
            }
          })
  }else{
    res.send('New password and old password are not same')
  }

})

app.get('/view_list',function(req,res){
    var query = [
        'MATCH (user:Userdetails )',
        'RETURN user',
    ].join('\n')
    db.cypher(query ,function (err, result) {
        if (err) {
          console.log(err);
        } else {
          //console.log(result);
          res.send(result);
          //res.render('view_list',result)
        }
      })
})
//module.exports = app;

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
