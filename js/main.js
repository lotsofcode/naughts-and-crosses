(function(window, undefined) {

	// create the board
	for (i = 1; i <= 9; i++) {
		$('#nac-container').append('<div class="nac-item nac-item-'+i+'"><span></span></div>');
	}

	var firstPlayer = Math.round(Math.random()),
		currentPlayer = null,
		players = { 0: 'X', 1: 'O' },
		noticeContainer = $('#nac-notices'),
		turnsRemaining = 9,
		theWinner = false,
		answers = [],
		matcher = [],
		answerMap = [
			[1,2,3],
			[1,5,9],
			[1,4,7],
			[2,5,8],
			[3,6,9],
			[3,5,7],
			[1,2,3],
			[4,5,6],
			[7,8,9],
		];

	notifyPlayer("Player " + players[currentPlayer || firstPlayer] + " turn.");

	$('#reset').live('click',function(e) {
		e.preventDefault();
		
		firstPlayer = Math.round(Math.random());
		currentPlayer = null;
		turnsRemaining = 9;
		theWinner = false;
		answers = [];
		matcher = [];
		
		$('.nac-item').each(function() {
			this.childNodes[0].innerHTML = "";
		});
		
		notifyPlayer("Player " + players[firstPlayer] + " turn.");
	});
	
	$('.nac-item').click(function(e) {
		
		currentPlayer = getNextPlayer(); // get the next player

		matcher = this.className.match(/nac-item nac-item-(.*)/)
		answer = matcher[1]

		// we have a winner
		if ( theWinner !== false ) return notifyPlayer("Game over, "+players[theWinner]+" won, <a id='reset' href='#'>start again</a>");

		// no more goes remaining
		if ( turnsRemaining == 0 ) return notifyPlayer("Game over, <a id='reset' href='#'>start again</a>.");

		if ( this.childNodes[0].innerHTML === "" ) {

			this.childNodes[0].innerHTML = players[currentPlayer]

			if ( answers[currentPlayer] === undefined ) {
				answers[currentPlayer] = []
			}

			answers[currentPlayer].push(answer);

			theWinner = checkForWinningPlayer();

			if ( theWinner !== false ) {
				return notifyPlayer("Game over, "+players[theWinner]+" won , <a id='reset' href='#'>start again</a>");
			}

			if ( --turnsRemaining == 0 ) {
				return notifyPlayer("Game over, no winner, <a id='reset' href='#'>start again</a>");
			}

			return notifyPlayer("Player " + players[getOtherPlayer(currentPlayer)] + " turn.");

		} else {

			return notifyPlayer("Already taken, choose another.");

		}

	});

	function setCurrentPlayer(player) {
		currentPlayer = player;
	}

	function getCurrentPlayer() {
		if (currentPlayer === null) {
			return firstPlayer;
		}
		return currentPlayer;
	}

	function getNextPlayer() {
		if (currentPlayer === null) {
			return firstPlayer;
		}
		return getOtherPlayer(currentPlayer);
	}

	function getOtherPlayer(player) {
		return (player == 0 ? 1 : 0)
	}

	function notifyPlayer(notice) {
		noticeContainer.html(notice);
	}

	function removeNotice() {
		notifyPlayer("")
	}

	function getAnswers(player) {
		return answers[player] || []
	}

	function checkForWinningPlayer() {
		var winningPlayer = false;
		for (i = 0; i <= 1; i++) {
			var playerAnswers = getAnswers(i).sort(sortNumber);
			for (answer in answerMap) {
				if (playerAnswers && compareCurrentAnswers(answerMap[answer], playerAnswers)) {
					winningPlayer = i;
				}
			}
		}
		return winningPlayer;
	}

	function compareCurrentAnswers(a, b) {
		if (a == undefined || b == undefined) {
			return;
		}
		var matches = 0;
		for (c in a) {
			if (inArray(a[c], b)) {
				++matches
			}	
		}
		return matches == a.length;
	}

	function inArray(needle, haystack) {
	    var length = haystack.length;
	    for(var i = 0; i < length; i++) {
	        if(haystack[i] == needle) return true;
	    }
	    return false;
	}

	function sortNumber(a,b) {
		return a - b;
	}

})(window, undefined);
