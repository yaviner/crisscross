<<<<<<< HEAD
/**
* This class implements the logic for matching an event to our events table
* In gener we receive an updated calendar event and
* we try to match it against what we currently have on the 
* events table. If not found we try the following:
* 1) We try to find it in seatgeek.com and create the event on the event table
* 2) If 1 fails, we create it as new event on the event table
*/

var dbAccess = require('./dbAccess');
var event={ 
	event_id: '1',  
	start_date: 'Sat Apr 06 2013 00:00:00 GMT-0400 (Eastern Daylight Time)',
	end_date: 'Sat Apr 06 2013 00:00:00 GMT-0400 (Eastern Daylight Time)',
	description: 'some description2' 
}
dbAccess.addEvent(event);
//dbAccess.getEvent(1);
console.log('This is my program');

function processNewCalendarEvent(userEvent){
	var exist=checkExists(userEvent);
	if(exists){
			
	}
}

function checkExists(userEvent){
}

