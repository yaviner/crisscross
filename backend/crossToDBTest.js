/**
* This class has the test for crossToDB.js
*/
var crossToDB = require('./crossToDB');

var userEventCalendar={
	date:'2013-04-25T21:00:00',
	description:'coldplay'
};

crossToDB.processNewCalendarEvent('1',userEventCalendar,function(response){});
//crossToDB.searchSeatGeek('2013-04-25T21:00:00','Coldplay',function(response){});