/**
* This class has the test for crossToDB.js
*/
var crossToDB = require('./crossToDB');

var userEventCalendar={
	date:'2013-04-06T00:00:00',
	description:'Coldplay Concert'
};

//crossToDB.processNewCalendarEvent(userEventCalendar,function(response){});
crossToDB.searchSeatGeek('2013-04-06T00:00:00','Coldplay Concert',function(response){});