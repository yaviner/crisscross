var locomotive = require('locomotive')
  , Controller = locomotive.Controller;

var PagesController = new Controller();

PagesController.main = function() {
  this.title = 'crisscross'
  this.render();
  console.log("this is method1");
}

PagesController.showCrossview = function(){
	this.title="crisscross"
	this.render('crossview');
	console.log("this is method2");
}

module.exports = PagesController;
