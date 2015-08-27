var neo4j=require('neo4j')
var nodemailer=require('nodemailer');
var mv = require('mv');
var path = require('path');
/*var db = new neo4j.GraphDatabase({
    // Support specifying database info via environment variables,
    // but assume Neo4j installation defaults.
    url: process.env['NEO4J_URL'] || process.env['GRAPHENEDB_URL'] ||
        'http://neo4j:ananth@localhost:7474',
    auth: process.env['NEO4J_AUTH'],
});*/

var db = new neo4j.GraphDatabase({
    // Support specifying database info via environment variables,
    // but assume Neo4j installation defaults.
    url: process.env['NEO4J_URL'] || process.env['GRAPHENEDB_URL'] ||
        'http://neo4j:L5mPUTZ8tvQ9DxNo3MRB@neo4j.sb02.stations.graphenedb.com:24789/db/data/',
    auth: process.env['NEO4J_AUTH'],
});

exports.loggedin=function(req,res){
  if(req.session.username || req.session.admin_username){
     res.send('1');
    }else{
       res.send('0');
    }
 
}

/*exports.loggedin_admin=function(req,res){
  if(req.session.admin_username){
     res.send('1');
    }else{
       res.send('0');
    }
 
}
*/
exports.logout=function(req,res){
    console.log(req.session.username+'logooooo')
    req.session.destroy();
    res.send(200);
}




exports.request_access=function(req,res){
    var email=req.body.email;
  
    var regex = /^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)[\\.]([a-zA-Z]{2,9})$/;
    if(!regex.test(email)){
        res.send("Enter a valid email");
    }else{
      var Check_mail = [
        'MATCH (email:Userdetails ) ',
        'where email.email="'+email+'"',
        ' RETURN email',
    ].join('\n');

   
    db.cypher(Check_mail ,function (err1, result1) {
        if (err1) {
          console.log(err1);
        } else {
         
          if(result1.length>=1){
              res.send("Email already exist");
          }else if(result1.length==0){
               var mailOpts, smtpConfig;
              smtpConfig = nodemailer.createTransport('SMTP', {
                  service: 'Gmail',
                  auth: {
                      user: "test29239@gmail.com",
                      pass: "ananth123"
                 }
              });

              var text = "<p>Hi you are accessing  request for registation startup</p> ";
              mailOpts = {
                  from:email ,
                  to: "test29239@gmail.com",
                  subject: 'To request Access',
                  html: text
              };


             var query = [
                  'CREATE (email_data :Userdetails { email: "'+email+'" ,registering_through:"access"})',
                  'RETURN email_data',
              ].join('\n');
              db.cypher(query ,function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    smtpConfig.sendMail(mailOpts, function(error, response) { //send Email
                    //Email not sent
                          if (error) {
                              console.log('Email Not Sent' + error);
                          }
                          else { //email send sucessfully
                              res.send('Message sent successfully');
                             // res.send('data inserted successfully');
                          }
                    });
                  }
                })
          }
        }
      }) 
        
    }
}



exports.login=function(req,res){
var pass = new Buffer(req.body.password)
var password = pass.toString('base64');

  var query = [
        'MATCH (user:Userdetails)',
        'where (user.username="'+req.body.username+'" and user.password="'+password+'")',
        'RETURN user'
    ].join('\n');
   
    db.cypher(query ,function (err, result) {
        if (err) {
          console.log(err);
        } else {
         
          if(result.length>=1){
            req.session.username=result[0].user.properties.username;
            req.session.user_id=result[0].user._id;
            var data_contents={
                sess_name:req.session.username,
                sess_id:req.session.user_id,
                data:result
            }
            res.send(data_contents)
          }else{
            res.send(''+0)
          }
          
        }
      })
}



exports.registration=function(req,res){
    var name= req.body.username,email=req.body.email,
        title=req.body.title,type=req.body.type_details,phone=req.body.phone,
        gender=req.body.gender,photo_url=req.body.photo,city=req.body.city,
        country=req.body.country,dob=req.body.dob;
        var access_code=Math.floor((Math.random()*10000)+1);
         var regex = /^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)[\\.]([a-zA-Z]{2,9})$/;
        
         var pass = new Buffer(req.body.password)
        var password = pass.toString('base64');
       

    var Check_mail = [
        'MATCH (email:Userdetails ) ',
        'where email.email="'+email+'"',
        ' RETURN email',
    ].join('\n');

   
   
    if(!regex.test(email) && phone.length==10){
        res.send("Enter Valid Details");
    }else{
       db.cypher(Check_mail ,function (err1, result1) {
        if(err1){
          return;
        }else{
          var query;
         
          if(result1){
           var query2 = [
                  'MATCH (n:Userdetails )',
                  'where n.email= "'+email+'"',
                  'SET n.username = "'+name+'",n.password="'+password+'",',
                  'n.title="'+title+'",n.type="'+type+'",n.phone="'+phone+'",n.gender="'+gender+'",n.photo_url="'+photo_url+'",n.city="'+city+'",',
                  'n.country="'+country+'",n.dob="'+dob+'",n.doj=timestamp(),n.access_code="'+access_code+'",',
                    'n.privacy=0,n.history=0,n.tagging=0,n.post=0,n.followers=0,n.following=0,n.reviews=0,n.circle=0',
                  'RETURN n',
              ].join('\n');
           
           db.cypher(query2 ,function (err2, result2) {
                if (err2) {
                  console.log(err2);
                } else {
                
                  res.send('data updated successfully')
                }
              })
          }
          if(result1.length==0){
            var query3 = [
                'create (user:Userdetails{username:"'+name+'",email:"'+email+'",password:"'+password+'",',
                  'title:"'+title+'",type:"'+type+'",phone:"'+phone+'",gender:"'+gender+'",photo_url:"'+photo_url+'",city:"'+city+'",',
                  'country:"'+country+'",dob:"'+dob+'",doj:timestamp(),access_code:"'+access_code+'",',
                  'privacy:0,history:0,tagging:0,post:0,followers:0,following:0,reviews:0,circle:0})'

            ].join('\n');
          
              db.cypher(query3 ,function (err3, result3) {
                if (err3) {
                  console.log(err3);
                } else {
                
                  res.send('data inserted successfully')
                }
              })
          }


          
            
        }

      })
    }


}



//MATCH (n:Userdetails) RETURN n.access_code,id(n);

exports.register_access=function(req,res){
  var code1=req.body.code1;
  var code2=req.body.code2;
  var code3=req.body.code3;
var check_access_code=[];
var check_id=[];
  var query = [
        'MATCH (n:Userdetails) ',
        'RETURN n.access_code as code,id(n) as id'
    ].join('\n')
    db.cypher(query ,function (err, result) {
        if (err) {
          console.log(err);
        } else {
           for(i=0;i<result.length;i++){
              check_id.push(result[i].id)
              if(result[i].code){
                check_access_code.push(parseInt(result[i].code))
              }
          }
          var a=check_access_code.indexOf(code1);
          var b=check_access_code.indexOf(code2);
          var c=check_access_code.indexOf(code3);
          if((a || b || c)==-1){
         
              res.send('values doesnot match');
          }else{
          
             var access_code1=Math.floor((Math.random()*10000)+1);
             var access_code2=Math.floor((Math.random()*10000)+1);
             var access_code3=Math.floor((Math.random()*10000)+1);
                  var q1=['MATCH (user:Userdetails ) where id(user)= '+check_id[a]+' SET user.access_code = "'+access_code1+'" RETURN user'].join('\n');
                  var q2=['MATCH (user:Userdetails ) where id(user)= '+check_id[b]+' SET user.access_code = "'+access_code2+'" RETURN user'].join('\n');
                  var q3=['MATCH (user:Userdetails ) where id(user)= '+check_id[c]+' SET user.access_code = "'+access_code3+'" RETURN user'].join('\n');
                     
                      db.cypher(q1 ,function (e1, r1) {
                          if (e1) {
                            console.log(e1);
                            return;
                          } else {
                                db.cypher(q2 ,function (e2, r2) {
                                    if (e2) {
                                      console.log(e2);
                                      return;
                                    } else {
                                        db.cypher(q3 ,function (e3, r3) {
                                            if (e3) {
                                              console.log(e3);
                                              return;
                                            } else {
                                              res.send('access code accepted')
                                            }
                                          })
                                    }
                                  })
                          }
                        })

          }
        }
      })



}





exports.forgot_password = function(req, res, next) {
  var min = 1000;
  var max = 9999;
  var token = Math.floor(Math.random() * (max - min + 1)) + min;
  var email = req.body.email;

  var Check_mail = [
        'MATCH (email:Userdetails ) ',
        'where email.email="'+email+'"',
        ' RETURN email',
    ].join('\n');

   
    db.cypher(Check_mail ,function (err1, result1) {
        if (err1) {
          console.log(err1);
        } else {
         
          if(result1.length>=1){
              var mailOpts, smtpConfig;
              smtpConfig = nodemailer.createTransport('SMTP', {
                service: 'Gmail',
                auth: {
                  user: "test29239@gmail.com",
                  pass: "ananth123"
                }
              });
              var text = "<p>Hi </p>\
              <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>\
              <p>Please follow the link to reset your password: <a>http://" + req.headers.host + "/resetpassword?token=" + token + "&email=" + email + "</a></p>\
              <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>";

              mailOpts = {
                from: 'test29239@gmail.com',
                to: email,
                subject: 'D-cirque Password Reset',
                html: text
              };

              var query1 = [
                    'MATCH (n:Userdetails) ',
                    'where n.email="'+email+'"',
                    'SET n.token_generated ="'+token+'"',
                    'RETURN n'
                ].join('\n');
                
                db.cypher(query1 ,function (err1, result1) {
                    if (err1) {
                      console.log(err1);
                    } else {
                       smtpConfig.sendMail(mailOpts, function(error, response) {
                          if (error) {
                            console.log('Email send failed');
                            return;
                          } else {
                           
                            res.send('Email send sucessfully')
                          }
                          res.end('' + 1);
                        });
                      
                    }
                  })



             
          }else{
            res.send('email-id is not registered')
          }
          
        }
     })
}









exports.dashboard=function(req,res){
//console.log(req.body.id+'session if sdafas'+req.session.user_id+'----'+req.session.username)
//var id=req.body.id
  if(req.session.user_id>=0){

    var query = [
          'MATCH (user:Userdetails)',
          'where id(user)='+req.session.user_id,
          'RETURN user'
      ].join('\n');

    /*  var query=[
          'MATCH (p:Userdetails)-[r:groupList]->(g:groupChat_list) where id(p)='+req.session.user_id+' RETURN p,r,g'
      ].join('\n');*/

     console.log(query)
      db.cypher(query ,function (err, result) {
          if (err) {
            console.log(err);
          } else {
            if(result.length>=1){
              res.send(result)
            }else{
              res.send(''+0)
            }
            //console.log(JSON.stringify(result))
            
          }
        })
  }
}


exports.group_chat_details=function(req,res){
   if(req.session.user_id>=0){
      var query=[
          'MATCH (p:Userdetails)-[r:groupList]->(g:groupChat_list) where id(p)='+req.session.user_id+' RETURN p,r,g'
      ].join('\n');

     console.log(query)
      db.cypher(query ,function (err, result) {
          if (err) {
            console.log(err);
          } else {
            if(result.length>=1){
              res.send(result)
            }else{
              res.send(''+0)
            }
            //console.log(JSON.stringify(result))
            
          }
        })
  }
}




exports.update_profile=function(req,res){
  if(req.session.username){
  console.log(JSON.stringify(req.files)+'----'+JSON.stringify(req.body));
    var tmp_path,target_path,filename;
    if(req.files.file){
      console.log('hi value is present');
      // get the temporary location of the file
        tmp_path = req.files.file.path;
        // set where the file should actually exists - in this case it is in the "images" directory
        target_path = './public/uploads/' + req.files.file.name;
        filename=req.files.file.name

        // move the file from the temporary location to the intended location
        mv(tmp_path, target_path, function(err) {
        if(err){
          console.log(err);
          return;
        }else{

            var query = [
              'MATCH (n:Userdetails)',
              'where id(n)='+req.body.id,
              'SET n.username = "'+req.body.username+'",n.phone="'+req.body.phone+'",',
              'n.title = "'+req.body.title+'",n.gender="'+req.body.gender+'",n.description="'+req.body.description+'",n.photo="'+req.files.file.name+'"',
              'RETURN n'
          ].join('\n');
         console.log(query)
          db.cypher(query ,function (err, result) {
              if (err) {
                console.log(err);
              } else {
                if(result.length>=1){
                  res.send(result)
                }else{
                  res.send(''+0)
                }
                //console.log(JSON.stringify(result))
                
              }
            })
        }
      });
    }else{
      console.log('hi value is Not present');
        //tmp_path = "/tmp";
        // set where the file should actually exists - in this case it is in the "images" directory
        //target_path = './public/uploads/' + req.body.old_pic;
        filename=req.body.old_pic;
      var query = [
          'MATCH (n:Userdetails)',
          'where id(n)='+req.body.id,
          'SET n.username = "'+req.body.username+'",n.phone="'+req.body.phone+'",',
          'n.title = "'+req.body.title+'",n.gender="'+req.body.gender+'",n.description="'+req.body.description+'",n.photo="'+filename+'"',
          'RETURN n'
      ].join('\n');
     console.log(query)
      db.cypher(query ,function (err, result) {
          if (err) {
            console.log(err);
          } else {
            if(result.length>=1){
              res.send(result)
            }else{
              res.send(''+0)
            }
            //console.log(JSON.stringify(result))
            
          }
        })
        
    }

  }
}


exports.change_password=function(req,res){
var pass = new Buffer(req.body.password)
var password = pass.toString('base64');
  if(req.session.username){
    var query = [
          'MATCH (n:Userdetails)',
          'where id(n)='+req.body.id,
          'SET n.password = "'+password+'"',
          'RETURN n'
      ].join('\n');
     console.log(query)
      db.cypher(query ,function (err, result) {
          if (err) {
            console.log(err);
          } else {
            if(result.length>=1){
              res.send("password chnaged sucessfully")
            }else{
              res.send(''+0)
            }
            //console.log(JSON.stringify(result))
            
          }
        })
  }
}


exports.delete_fromGroup=function(req,res){
  console.log(req.session)
  /*if(req.session.username>=0){*/

    var query = [
          'MATCH (p:Userdetails)-[r:groupList]->(m:groupChat_list) ',
          'where id(m)='+req.body.id+'  delete r,m'
          
      ].join('\n');
     console.log(query)
      db.cypher(query ,function (err, result) {
          if (err) {
            console.log(err);
          } else {
              console.log(result);
              res.send(result)
            
          }
        })
/*  }*/
}



exports.privacy_setting=function(req,res){
      var query = [
          'MATCH (n:Userdetails)',
          'where id(n)='+req.body.id,
          'SET n.privacy = "'+req.body.privacy+'",n.history="'+req.body.history+'",',
          'n.tagging = "'+req.body.tagging+'",n.post="'+req.body.post+'",n.followers="'+req.body.followers+'",n.following="'+req.body.following+'",n.reviews="'+req.body.reviews+'",n.circle="'+req.body.circle+'"',
          'RETURN n'
      ].join('\n');
     console.log(query)
      db.cypher(query ,function (err, result) {
          if (err) {
            console.log(err);
          } else {
            if(result.length>=1){
              res.send(result)
            }else{
              res.send(''+0)
            }
            //console.log(JSON.stringify(result))
            
          }
        })
}