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
		host     : '198.211.114.240',
		user     : 'crisscross',
		password : 'user12345',
		database : 'crisscross', 
	});
	return connection;
}

//Event Management
function addEvent(event,callback){
	console.log('Calling addEvent');
	var connection=getConnection();
	//fix event format for insertion
	event.start_date=dateFormat(event.start_date, "isoDateTime");
	event.end_date=dateFormat(event.end_date, "isoDateTime");
	delete event.event_id;
	connection.query('insert into event set ?',event, function(err, result, fields) {
		if (err) throw err;
		callback(result)
	});
	connection.end();
}

function getEvent(eventId,callback){
	console.log('Calling getEvent '+eventId);
	var connection=getConnection();
	connection.query('SELECT * from event where event_id=?',[eventId], function(err, result, fields) {
		if (err) throw err;
		for (var i=0;i<result.length;i++){
			result[i].start_date=dateFormat(result[i].start_date, "isoDateTime");
			result[i].end_date=dateFormat(result[i].end_date, "isoDateTime");
		}
		callback(result);
	});
	connection.end();
}

function getEventByDateAndDescription(date,description,callback){
	console.log('Calling getEventByDataAndDescription: '+ date + ',' + description);
	var connection=getConnection();
	connection.query('SELECT * FROM event where MATCH(description) AGAINST (? IN boolean mode) AND ABS(DATEDIFF(start_date,?))<2',
			[description, date], function(err, result, fields) {
		if (err) throw err;
		callback(result);
	});
	connection.end();
}

function removeEvent(eventId,callback){
	console.log('Calling removeEvent');
	var connection=getConnection();
	connection.query('delete from event where event_id= ?',[eventId], function(err, result, fields) {
		if (err) throw err;
		callback(result);
	});
	connection.end();
}

//User Management
function addUser(user,callback){
	console.log('Calling addUser');
    var connection=getConnection();
    //fix event format
    connection.query('insert into user set ?',user, function(err, result, fields) {
        console.log(err);
        if (err.code == 'ER_DUP_ENTRY') callback(null);
        else if (err) callback(null);
        callback(result);
    });
    connection.end();
}

function getUser(userId,callback){
	console.log('Calling getUser');
	var connection=getConnection();
	connection.query('SELECT * from user where user_id=?',[userId], function(err, result, fields) {
        if (err) {
            return callback(err);
        }
        if (result.length == 1) {
            return callback(err, result[0]);
        }
        return callback(null, null);
	});
	connection.end();
}

function removeUser(userId,callback){
	console.log('Calling removeUser');
	var connection=getConnection();
	connection.query('delete from user where user_id= ?',[userId], function(err, result, fields) {
		if (err) throw err;
		callback(result);
	});
	connection.end();
}


//User to Event Management
function addUserToEvent(userId,eventId,callback){
	console.log('Calling addUserToEvent:');
	var connection=getConnection();
	connection.query('insert into user_to_event values(?,?)',[userId,eventId], function(err, result, fields) {
		if (err) throw err;
		callback(result);
	});
	connection.end();
};

function getUserEvents(userId,callback){
	console.log('Calling getUserEvents');
	var connection=getConnection();
	connection.query('SELECT * from user_to_event where user_id=?',[userId], function(err, result, fields) {
		if (err) throw err;
		callback(result);
	});
	connection.end();
};

function removeUserToEvent(userId,eventId,callback){
	console.log('Calling removeUserToEvent');
	var connection=getConnection();
	connection.query('delete from user_to_event where user_id=? and event_id=?',[userId,eventId], function(err, result, fields) {
		if (err) throw err;
		callback(result);
	});
	connection.end();
};

exports.addEvent=addEvent;
exports.getEvent=getEvent;
exports.getEventByDateAndDescription=getEventByDateAndDescription;
exports.removeEvent=removeEvent;

exports.addUser=addUser;
exports.getUser=getUser;
exports.removeUser=removeUser;

exports.addUserToEvent=addUserToEvent;
exports.getUserEvents=getUserEvents;
exports.removeUserToEvent=removeUserToEvent;

