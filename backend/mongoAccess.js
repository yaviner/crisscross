var mysql      = require('mysql');
var dateFormat = require('dateformat');

//var connection = mysql.createConnection({
//var pool = mysql.createPool({
//	host     : 'localhost',
//	user     : 'crisscross',
//	password : 'user1234',
//	database : 'crisscross', 
//});
//connection.end();

function getConnection(){
	var connection = mysql.createConnection({
		//var pool = mysql.createPool({
		host     : 'localhost',
		user     : 'crisscross',
		password : 'user1234',
		database : 'crisscross', 
	});
	return connection;
}

//Event Management
function addEvent(event){
	console.log('Calling addEvent');
	var connection=getConnection();
	//fix event format for insertion
	event.start_date=dateFormat(event.start_date, "isoDateTime");
	event.end_date=dateFormat(event.end_date, "isoDateTime");
	delete event.event_id;
	connection.query('insert into event set ?',event, function(err, rows, fields) {
		if (err) throw err;
		console.log(rows);
		return rows.insertId
	});
	connection.end();
}

function getEvent(eventId){
	console.log('Calling getEvent '+eventId);
	var connection=getConnection();
	connection.query('SELECT * from event where event_id=?',[eventId], function(err, rows, fields) {
		if (err) throw err;
		for (var i=0;i<rows.length;i++){
			var event=rows[i];
			event.start_date=dateFormat(event.start_date, "isoDateTime");
			event.end_date=dateFormat(event.end_date, "isoDateTime");
			console.log('The event is: \n', event);
		}
	});
	connection.end();
}

function removeEvent(eventId){
	console.log('Calling removeEvent');
	var connection=getConnection();
	connection.query('delete from event where event_id= ?',[eventId], function(err, rows, fields) {
		if (err) throw err;
	});
	connection.end();
}

//User Management
function addUser(user){
	console.log('Calling addUser');
	var connection=getConnection();
	//fix event format
	delete user.user_id;
	connection.query('insert into user set ?',user, function(err, rows, fields) {
		if (err) throw err;
		return rows.insertId
	});
	connection.end();
}

function getUser(userId){
	console.log('Calling getUser');
	var connection=getConnection();
	connection.query('SELECT * from user where user_id=?',[userId], function(err, rows, fields) {
		if (err) throw err;
		for (var i=0;i<rows.length;i++){
			var user=rows[i];
			console.log('The user is: \n', user);
		}
	});
	connection.end();
}

function removeUser(userId){
	console.log('Calling removeUser');
	var connection=getConnection();
	connection.query('delete from user where user_id= ?',[userId], function(err, rows, fields) {
		if (err) throw err;
	});
	connection.end();
}


//User to Event
function addUserToEvent(userId,eventId){
	console.log('Calling addUserToEvent');
	var connection=getConnection();
	//fix event format
	delete user.user_id;
	connection.query('insert into user_to_event set ?',[userId,eventId], function(err, rows, fields) {
		if (err) throw err;
	});
	connection.end();
}

function getUserEvents(userId){
	console.log('Calling getUser');
	var connection=getConnection();
	connection.query('SELECT * from user_to_event where user_id=?',[userId], function(err, rows, fields) {
		if (err) throw err;
		for (var i=0;i<rows.length;i++){
			var userEvent=rows[i];
			console.log('The events of the user is: \n', userEvent);
		}
	});
}

exports.addEvent=addEvent;
exports.getEvent=getEvent;
exports.removeEvent=removeEvent;
exports.getUser=getUser;
exports.addUser=addUser;
exports.addUser=removeUser;


