var neo4j=require('neo4j');
var mv = require('mv');
var path = require('path');
var nodemailer=require('nodemailer');
var db = new neo4j.GraphDatabase({
    // Support specifying database info via environment variables,
    // but assume Neo4j installation defaults.
    url: process.env['NEO4J_URL'] || process.env['GRAPHENEDB_URL'] ||
        'http://neo4j:L5mPUTZ8tvQ9DxNo3MRB@neo4j.sb02.stations.graphenedb.com:24789/db/data/',
    auth: process.env['NEO4J_AUTH'],
});


exports.create_group=function(req,res){
	var q1=[
		'MATCH (p:Userdetails)-[r:groupList]->(g:groupChat_list) where id(p)='+req.body.id+' and g.name="'+req.body.groupName+'" RETURN p,r,g'
	].join('\n');
	console.log(q1+'q1 details');
	db.cypher(q1 ,function (err, result) {
	  if (err) {
	    console.log(err);
	  } else {
	       //res.send('group chat created successfully');
	       console.log(JSON.stringify(result));
	       if(!result.length){
				var query = [
				  	'MATCH (p:Userdetails) where id(p)='+req.body.id,
					'CREATE (m:groupChat_list { name:"'+req.body.groupName+'",created_time:timestamp() })',
					'CREATE (p)-[r:groupList { roles: ["admin"]}]->(m)',
					'RETURN p,r,m'
				].join('\n');
			      console.log(query)
				db.cypher(query ,function (err, result) {
				  if (err) {
				    console.log(err);
				  } else {
				       res.send('New Group Created successfully');
				  }
				})       	
	       }else{
	       	res.send('Group already exist by this name');
	       }
	  }
	})
	
}





exports.display_all_user=function(req,res){
	 if(req.session.user_id>=0){
      var query=[
          'match (u:Userdetails) where id(u) <> '+req.session.user_id+' return u'
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

exports.add_to_group=function(req,res){
	if(req.session.user_id>=0){
		var q1=['match (g:groupChat_list)-[gml:groupmember_List { roles: ["friends"]}]->(m:Userdetails) where id(m)='+req.body.id+' and g.name="'+req.body.group_Name+'" return g,gml,m'].join('\n');
		console.log(q1)
      db.cypher(q1 ,function (err1, result1) {
          if (err1) {
            console.log(err1);
          } else {
            
            //console.log(JSON.stringify(result))
            if(result1.length>0){
            	console.log('value present');
            	res.send('already user added to group')

            }else{
            	console.log('no value');
            	var query=[
                  'MATCH (p:Userdetails)-[r:groupList]->(g:groupChat_list) where id(p)='+req.session.user_id,
                  'match (m:Userdetails) where id(m)='+req.body.id,
                  'CREATE (g)-[gml:groupmember_List { roles: ["friends"]}]->(m)',
                  'RETURN p,r,m,g,gml',
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
        })
  }
}


//
//match (g:groupChat_list)-[gml:groupmember_List { roles: ["friends"]}]->(m:Userdetails) where g.name="rrr" return g,gml,m


exports.display_addedUser=function(req,res){
	console.log(req.body.id)
	var query = [
              'match (g:groupChat_list)-[gml:groupmember_List { roles: ["friends"]}]->(m:Userdetails) where id(g)='+req.body.id+' return g,gml,m'
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



//

exports.other_group_invited=function(req,res){
	if(req.session.user_id>=0){
      var query=[
          'match (g:groupChat_list)-[gml:groupmember_List { roles: ["friends"]}]->(m:Userdetails) where  id(m)= '+req.session.user_id+' return g,gml,m'
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