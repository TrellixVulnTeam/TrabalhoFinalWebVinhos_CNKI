var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var db = require('./../db');

db.connectDB();

router.post('/login', function (req, res, next){
  var filtro = {
    Usuario: req.body.username,
    Senha: req.body.password
  }
  var Usuarios = db.Mongoose.model('user', db.UserSchema, 'user');
  Usuarios.find(filtro).lean().exec(function(e, docs){
    if(!e){
      var token = jwt.sign({ data: docs}, 'secret');
      res.send({status: 1, data: docs, token: token});
    } else {
      console.log(e);
      res.send({status: 0, data:err});
    }
  })
});

router.post('/registrar', function (req, res, next){
    var novo = { 
      Usuario: req.body.username, 
      Email: req.body.email, 
      Senha: req.body.password 
    }
    var Usuarios = db.Mongoose.model('user', db.UserSchema, 'user');
    var novo_usuario = new Usuarios(novo);
    console.log(novo_usuario);
    novo_usuario.save(function (err){
      if(err){
        console.log("Error " + err.message);
        res.send({status: 0, data:err});
      } else{
        Usuarios.find(novo).lean().exec(function(e, docs){
          if(!e){
            var token = jwt.sign({data: docs}, 'secret');
            res.send({status:1 , data: docs, token: token});
          }
        })
      }
    });
});

router.post('/adiciona_vinho', function(req, res){
  var novo = { 
    Vinicola: req.body.vineyard, 
    Nome: req.body.name, 
    PaisOrigem: req.body.origin, 
    Tipo: req.body.type, 
    TipoUva: req.body.grapeType, 
    Harmonizacao: req.body.harmonization, 
    Rotulo: req.body.stamp
  }
  var Vinhos = db.Mongoose.model('vinho', db.VinhoSchema, 'vinho');
  var novo_vinho = new Vinhos(novo);
  novo_vinho.save(function(err){
    if(err){
      console.log("Error " + err.message);
      return err;
    } else{
      console.log("Vinho adicionado com sucesso!");
      res.json(novo_vinho)
    }
  })
});



module.exports = router;