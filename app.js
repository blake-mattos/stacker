$(document).ready( function() {

//------ Section: A ------
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});
	$('.inspiration-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var answerers = $(this).find("input[name='answerers']").val();
		getInspiration(answerers);
	});
});



//------ Section: B ------
// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
		question.owner.display_name +
		'</a>' +
		'</p>' +
		'<p>Reputation: ' + question.owner.reputation + '</p>'
		);

	return result;
};

//showUsers
// this function takes the Users object returned by StackOverflow 
// and creates new result to be appended to DOM
var showUsers = function(answerers) {
	console.log(answerers)

	// clone our result template code
	var result = $('.templates .user').clone();
	
	// set username
	var username = result.find('.username a');
	console.log(answerers.user.link);
	console.log(username.attr('href'));	
	username.attr('href', answerers.user.link);
	username.text(answerers.user.display_name);
	console.log(username.attr('href'));


	// set reputation
	var reputation = result.find('.reputation');
	reputation.text(answerers.user.reputation);


	// // set the #views for question property in result
	// var viewed = result.find('.viewed');
	// viewed.text(question.view_count);

	// // set some properties related to asker
	// var asker = result.find('.asker');
	// asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
	// 	question.owner.display_name +
	// 	'</a>' +
	// 	'</p>' +
	// 	'<p>Reputation: ' + question.owner.reputation + '</p>'
	// 	);

console.log(result);

$("#stuff").text(answerers);
	return result;
};


//------ Section: C ------
// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};



//------ Section: D ------
// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation'};

		var result = $.ajax({
			url: "http://api.stackexchange.com/2.2/questions/unanswered",
			data: request,
			dataType: "jsonp",
			type: "GET",
		})
		.done(function(result){
			var searchResults = showSearchResults(request.tagged, result.items.length);

			$('.search-results').html(searchResults);

			$.each(result.items, function(i, item) {
				var question = showQuestion(item);
				$('.results').append(question);
			});
		})
		.fail(function(jqXHR, error, errorThrown){
			var errorElem = showError(error);
			$('.search-results').append(errorElem);
		});
	};

//	getInspiration here
var getInspiration = function(answerers) {

//check that function is called	
	console.log('getInspiration:' +answerers );

		// the parameters we need to pass in our request to StackOverflow's API
		var request = {	site: 'stackoverflow'};

		// URL: https://api.stackexchange.com/2.2/tags/jquery/top-answerers/all_time?site=stackoverflow
		var result = $.ajax({
			url: "http://api.stackexchange.com/2.2/tags/" +answerers+ "/top-answerers/all_time",
			data: request,
			dataType: "jsonp",
			type: "GET",
		})

		.done(function(result){
			var searchResults = showSearchResults(request.tagged, result.items.length);

			$('.search-results').html(searchResults);

			$.each(result.items, function(i, item) {
				var topUsers = showUsers(item);
				$('.results').append(topUsers);
			});
		})
		.fail(function(jqXHR, error, errorThrown){
			var errorElem = showError(error);
			$('.search-results').append(errorElem);
		});


};


