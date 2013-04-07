var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  , passport = require('passport');

var PagesController = new Controller();

PagesController.main = function() {
  this.title = 'crisscross'
  this.render();
  console.log(this.req.user);
  console.log("this is method1");
}

PagesController.showCrossview = function(){
	this.title="crisscross"
	console.log("this is method2");
    var usr = this.req.user;
	this.render('crossview', {name: usr.displayName, picture:  usr.picture_url});
}

module.exports = PagesController;
