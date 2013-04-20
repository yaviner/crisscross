var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  , passport = require('passport')
  , db = require('../../backend/dbAccess.js')
  , graph = require('fbgraph');


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
	var userVar = this.req.user;
    console.log(this.req.user);
    graph.get("fql?q=SELECT uid FROM user WHERE is_app_user=1 AND uid IN (SELECT uid2 FROM friend WHERE uid1 = me())", function(err, res) {
                    db.updateFriends(userVar.user_id,res, function() {} );
                    console.log(userVar.user_id);
                    console.log(res); // { picture: 'http://profile.ak.fbcdn.net/'... }
                return true;
                });
	this.render('crossview', {name: this.req.user.name, picture:  this.req.user.picture_url});
	
}

module.exports = PagesController;
