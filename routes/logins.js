
// десь тут помилка? 

const express = require('express');
const uuid = require('uuid');
const router = express.Router();
const loginsDal = require('../services/pg.logins.dal')
//const loginsDal = require('../services/m.logins.dal'); // get all the data from mongoDB

router.get('/', async (req, res) => { // list all logins
  // const theLogins = [
  //     {id: 1, username: 'example', password: 'example'},
  //     {id: 4, username: 'frodob', password: 'example'},
  //     {id: 7, username: 'bilbob', password: 'example'}
  // ];
  try {
     let theLogins = await loginsDal.getLogins(); 
      if(DEBUG) console.table(theLogins);
      res.render('logins', {theLogins});
  } catch {
      res.render('503');
  }
});

router.get('/:id', async (req, res) => { // get a login by id
  // const aLogin = [ // temporary data test from memory not from  postgresql database
  //   {id: 1, username: 'example', password: 'example'}
  // ];
  try {
      let aLogin = await loginsDal.getLoginByLoginId(req.params.id); // from postgresql
     if(DEBUG) console.table(aLogin);
      if (aLogin.length === 0)
          res.render('norecord')
      else
          res.render('login', {aLogin});
  } catch {
      res.render('503');
  }
});

router.get('/:id/edit', async (req, res) => {
  if(DEBUG) console.log('login.Edit : ' + req.params.id);
  res.render('loginPatch.ejs', {username: req.query.username,  email: req.query.email, theId: req.params.id}); // render loginPatch.ejs page! Create it!
});

router.get('/:id/delete', async (req, res) => {
  if(DEBUG) console.log('login.Delete : ' + req.params.id);
  res.render('loginDelete.ejs', {username: req.query.username, theId: req.params.id}); // render loginDelete.ejs page! Create it!
});

router.post('/', async (req, res) => { // add a new login
  if(DEBUG) console.log("logins.POST");
  try {
      await loginsDal.addLogin(req.body.username, req.body.password, req.body.email, uuid.v4());
      res.redirect('/logins/');
  } catch (err){
 //     if(DEBUG) console.log(err);
      // log this error to an error log file.
      res.render('503');
  } 
});

router.patch('/:id', async (req, res) => {
  if(DEBUG) console.log('logins.PATCH: ' + req.params.id);
  try {
      await loginsDal.patchLogin(req.params.id, req.body.username, req.body.password, req.body.email);
      res.redirect('/logins/');
  } catch {
      // log this error to an error log file.
      res.render('503');
  }
});

router.delete('/:id', async (req, res) => {
  if(DEBUG) console.log('logins.DELETE: ' + req.params.id);
  try {
      await loginsDal.deleteLogin(req.params.id);
      res.redirect('/logins/');
  } catch {
      // log this error to an error log file.
      res.render('503');
  }
});


module.exports = router