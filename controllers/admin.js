var neo4j=require('neo4j');
var mv = require('mv');
var path = require('path');
var nodemailer=require('nodemailer');
var db = new neo4j.GraphDatabase({
    // Support specifying database info via environment variables,
    // but assume Neo4j installation defaults.
    url: process.env['NEO4J_URL'] || process.env['GRAPHENEDB_URL'] ||
        'http://neo4j:ananth@localhost:7474',
    auth: process.env['NEO4J_AUTH'],
});

exports.adminlogin=function(req,res){
/*var pass = new Buffer(req.body.password)
var password = pass.toString('base64');*/

  var query = [
        'MATCH (user:AdminDetails)',
        'where (user.username="'+req.body.username+'" and user.password="'+req.body.password+'")',
        'RETURN user'
    ].join('\n');
   console.log(query)
    db.cypher(query ,function (err, result) {
        if (err) {
          console.log(err);
        } else {
         console.log(result)
          if(result.length>=1){
            req.session.admin_username=result[0].user.properties.username;
            req.session.admin_user_id=result[0].user._id;
            var data_contents={
                sess_name:req.session.admin_username,
                sess_id:req.session.admin_user_id,
                data:result
            }
            res.send(data_contents)
          }else{
            res.send(''+0)
          }
          
        }
      })
}



exports.admindashboard=function(req,res){
	console.log(req.session)
	if(req.session.admin_user_id>=0){

    var query = [
          'MATCH (user:AdminDetails)',
          'where id(user)='+req.session.admin_user_id,
          'RETURN user'
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




exports.brand_list=function(req,res){
  console.log(req.session)
  if(req.session.admin_user_id>=0){

    var query = [
          'MATCH (n:brand_list)',
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


exports.add_brand=function(req,res){
console.log(JSON.stringify(req.files)+'----'+JSON.stringify(req.body));
// get the temporary location of the file
        var tmp_path = req.files.file.path;
        // set where the file should actually exists - in this case it is in the "images" directory
        var target_path = './public/uploads/' + req.files.file.name;
        // move the file from the temporary location to the intended location
       
        mv(tmp_path, target_path, function(err) {
        if(err){
          console.log(err);
          return;
        }else{

            var query = [
                  'CREATE (n :brand_list { brand_name: "'+req.body.brand_name+'" ,description:"'+req.body.brand_description+'",photo:"'+req.files.file.name+'"})',
                  'RETURN n',
              ].join('\n');
              console.log(query)
              db.cypher(query ,function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    
                              res.send('brand created successfully');
                             // res.send('data inserted successfully');
                         
                  }
                })
        }
      });
}


exports.delete_brand=function(req,res){
  console.log(req.session)
  if(req.session.admin_user_id>=0){

    var query = [
          'MATCH (n:brand_list)',
          'where id(n)='+req.body.brand_id,
          'DELETE n'
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
  }
}
exports.delete_circle=function(req,res){
  console.log(req.session)
  if(req.session.admin_user_id>=0){

    var query = [
          'MATCH (n:circle_list)',
          'where id(n)='+req.body.circle_id,
          'DELETE n'
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
  }
}
exports.get_single_brand=function(req,res){
  console.log(req.session)
  if(req.session.admin_user_id>=0){

    var query = [
          'MATCH (n:brand_list)',
          'where id(n)='+req.body.brand_id,
          'Return n'
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
  }
}


exports.edit_brand=function(req,res){
  if(req.session.admin_user_id>=0){
   
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
                    'MATCH (n:brand_list)',
                    'where id(n)='+req.body.b_id,
                    'SET n.brand_name = "'+req.body.brand_name+'",n.description="'+req.body.brand_description+'",n.photo="'+filename+'"',
                    'Return n'
              ].join('\n');
              console.log(query)
              db.cypher(query ,function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    
                              res.send('Brand Edited  successfully');
                             // res.send('data inserted successfully');
                         
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
                    'MATCH (n:brand_list)',
                    'where id(n)='+req.body.b_id,
                    'SET n.brand_name = "'+req.body.brand_name+'",n.description="'+req.body.brand_description+'",n.photo="'+filename+'"',
                    'Return n'
              ].join('\n');
              console.log(query)
              db.cypher(query ,function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    
                              res.send('Brand Edited  successfully');
                             // res.send('data inserted successfully');
                         
                  }
                })
        
    }
     
     
        
  }
}




exports.add_story=function(req,res){
console.log(JSON.stringify(req.files)+'----'+JSON.stringify(req.body));
// get the temporary location of the file
        var tmp_path = req.files.file.path;
        // set where the file should actually exists - in this case it is in the "images" directory
        var target_path = './public/uploads/' + req.files.file.name;
        // move the file from the temporary location to the intended location
       
        mv(tmp_path, target_path, function(err) {
        if(err){
          console.log(err);
          return;
        }else{

            var query = [
                  'CREATE (n :editor_list { description:"'+req.body.story_description+'",photo:"'+req.files.file.name+'",date_created:timestamp()})',
                  'RETURN n'
              ].join('\n');
              console.log(query)
              db.cypher(query ,function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    res.send('story created successfully');
                  }
                })
        }
      });
}


exports.editor_list=function(req,res){
  console.log(req.session)
  if(req.session.admin_user_id>=0){

    var query = [
          'MATCH (n:editor_list)',
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




exports.add_circle=function(req,res){
console.log(JSON.stringify(req.files)+'----'+JSON.stringify(req.body));
// get the temporary location of the file
        var tmp_path = req.files.file.path;
        // set where the file should actually exists - in this case it is in the "images" directory
        var target_path = './public/uploads/' + req.files.file.name;
        // move the file from the temporary location to the intended location
       
        mv(tmp_path, target_path, function(err) {
        if(err){
          console.log(err);
          return;
        }else{

            var query = [
                  'CREATE (n :circle_list { circle_name: "'+req.body.circle_name+'" ,description:"'+req.body.circle_description+'",photo:"'+req.files.file.name+'",date_created:timestamp(),create_by:"admin"})',
                  'RETURN n',
              ].join('\n');
              console.log(query)
              db.cypher(query ,function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    
                              res.send('circle created successfully');
                             // res.send('data inserted successfully');
                         
                  }
                })
        }
      });
}



exports.circle_list=function(req,res){
  console.log(req.session)
  if(req.session.admin_user_id>=0){

    var query = [
          'MATCH (n:circle_list)',
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


exports.get_single_circle=function(req,res){
  console.log(req.session)
  if(req.session.admin_user_id>=0){

    var query = [
          'MATCH (n:circle_list)',
          'where id(n)='+req.body.brand_id,
          'Return n'
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
  }
}







exports.edit_circle=function(req,res){
  if(req.session.admin_user_id>=0){
   
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
                    'MATCH (n:circle_list)',
                    'where id(n)='+req.body.c_id,
                    'SET n.circle_name = "'+req.body.circle_name+'",n.description="'+req.body.circle_description+'",n.photo="'+filename+'"',
                    'Return n'
              ].join('\n');
              console.log(query)
              db.cypher(query ,function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    
                              res.send('circle Edited  successfully');
                             // res.send('data inserted successfully');
                         
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
                    'MATCH (n:circle_list)',
                    'where id(n)='+req.body.c_id,
                    'SET n.circle_name = "'+req.body.circle_name+'",n.description="'+req.body.circle_description+'",n.photo="'+filename+'"',
                    'Return n'
              ].join('\n');
              console.log(query)
              db.cypher(query ,function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    
                              res.send('circle Edited  successfully');
                             // res.send('data inserted successfully');
                         
                  }
                })
        
    }
     
     
        
  }
}