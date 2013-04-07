/**
* This class has the test for dbAccess.js
*/
var dbAccess = require('./dbAccess');

//Event mock object
var event={ 
	event_id: '1',  
	start_date: 'Sat Apr 06 2013 00:00:00 GMT-0400 (Eastern Daylight Time)',
	end_date: 'Sat Apr 06 2013 00:00:00 GMT-0400 (Eastern Daylight Time)',
	description: 'some description2' 
};

//Event mock object
var user={ 
	user_id: '1', 
	facebook_key: 'facebookKey', 	
	gCalendar_key: 'gCalendarKey', 	
	name: 'Carlos',
	picture_url: 'http://www.google.com'
};

//Event tests
function testEvents(){
	dbAccess.addEvent(event,function(response){
		var eventId=response.insertId;
		dbAccess.getEventByDateAndDescription(event.start_date,event.description,function(response){
			console.log(response);
			dbAccess.getEvent(eventId,function(response){
				console.log(response);
				dbAccess.removeEvent(eventId,function(response){});
			});
		});
	});
};

//User tests
function testUser(){
	dbAccess.addUser(user,function(response){
		var userId=response.insertId;
		dbAccess.getUser(userId,function(response){
			console.log(response);
/*			dbAccess.removeUser(userId,function(response){});*/
		});		
	});
};

//user to event tests
function testUserToEvent(){
	dbAccess.addUser(user,function(response){
		var userId=response.insertId;
		dbAccess.addEvent(event,function(response){
			var eventId=response.insertId;
			dbAccess.addUserToEvent(userId,eventId,function(result){
				dbAccess.getUserEvents(userId,function(response){
					console.log(response);
					dbAccess.removeUserToEvent(userId,eventId,function(response){});
					dbAccess.removeEvent(eventId,function(response){});
					dbAccess.removeUser(userId,function(response){});
				});
			});
		});
	});
};

testEvents();
testUser();
testUserToEvent();
