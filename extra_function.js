app.post('/delete_data/:id',function(req,res){
    var id=req.params.id;
    var query = [
        'MATCH (user:email_list )',
        'where id(user)= '+req.params.id,
        'DELETE user'
    ].join('\n');
    console.log(query)
    db.cypher(query ,function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.send(result);
        }
      })

})




app.get('/view_list',function(req,res){
    var query = [
        'MATCH (user:email_list )',
        'RETURN user',
    ].join('\n')
    db.cypher(query ,function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.send(result);
          //res.render('view_list',result)
        }
      })
})