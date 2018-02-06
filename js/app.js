'use strict';

/* Create a list that holds all of the cards */
let cardList, cardId, cardOpen, cardFlipCount, moves, stars, starsCount, time, timeIncrease, timeRun;

cardList = ['anchor', 'anchor', 'bicycle', 'bicycle', 'bolt', 'bolt', 'bomb', 'bomb', 'cube', 'cube', 'diamond', 'diamond', 'leaf', 'leaf', 'paper-plane-o', 'paper-plane-o'];
cardId = [];
cardOpen = [];

init();

/* Shuffle the list of cards using the provided "shuffle" method below */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/* A function to start or reset the game board, the moves, the timer, and the star rating */
function init() {
    cardFlipCount = 0;
    moves = 0;
    document.querySelector('.moves').textContent = moves;

    stars = document.querySelector('.stars');
    starsCount = stars.getElementsByTagName('li');
    starsRating(moves);
    starsReset();

    timeReset();

    // Loop through each card and create its HTML
    var displayCard = '';
    shuffle(cardList);
    for (var i = 0; i < cardList.length; i++) {
        var createCardId = i + 1;
        displayCard += '<li id="card-' + createCardId + '" class="card" onclick="flipCard(this,\'' + cardList[i] + '\')"></li>';
    }
    
    // Add each card's HTML to the page
    document.querySelector('.deck').innerHTML = displayCard;

    // Hide modal
    document.querySelector('.modal').style.display = 'none';
    document.querySelector('.container').classList.remove('blur');
}

/* Set up the event listener for a card when it is clicked */
function flipCard(card, symbol) {
    if (card.innerHTML === '' && cardOpen.length < 2) {

        card.classList.add('open', 'show', 'animated', 'flipInY');
        card.innerHTML = '<i class="fa fa-' + symbol + '"></i>';

        // Add the FIRST opened card to the 'cardOpen' and 'cardId' arrays
        if (cardOpen.length === 0) {
            cardOpen.push(symbol);
            cardId.push(card.id);
        } else if (cardOpen.length === 1) {

            // Add the SECOND opened card to the 'cardOpen' and 'cardId' arrays
            cardOpen.push(symbol);
            cardId.push(card.id);

            var cardOne = document.getElementById(cardId[0]);
            var cardTwo = document.getElementById(cardId[1]);

            // If both FIRST and SECOND opened cards MATCH
            if (cardOpen[0] === cardOpen[1]) {
                cardFlipCount += 2;
                
                cardOne.classList.add('match', 'rubberBand');
                cardTwo.classList.add('match', 'rubberBand');

                cardOne.classList.remove('open', 'show', 'flipInY');
                cardTwo.classList.remove('open', 'show', 'flipInY');
                
                // Increase move count by 1
                moves++;
                document.querySelector('.moves').textContent = moves;
                starsRating(moves);

                // Empty the arrays and make them ready for next open cards
                cardOpen = [];
                cardId = [];
                
                // When all cards are matched
                if (cardFlipCount === cardList.length) {
                    timeStop();

                    // Congratulations Popup
                    setTimeout(function() {
                        document.querySelector('.modal').style.display = 'block';
                        document.querySelector('.container').classList.add('blur');
                    }, 1000);
                    document.querySelector('.move-count').textContent = moves;
                    document.querySelector('.star-count').textContent = starsRating(moves).starsNumber;
                    document.querySelector('.time-spent').textContent = time.textContent;
                    document.querySelector('.play-again').addEventListener('click', init);
                }
            } else {

                // If both FIRST and SECOND opened cards DO NOT MATCH
                cardOne.classList.add('shake', 'mismatch');
                cardTwo.classList.add('shake', 'mismatch');

                cardOne.classList.remove('open', 'show', 'flipInY');
                cardTwo.classList.remove('open', 'show', 'flipInY');

                setTimeout(function() {
                    cardOne.classList.remove('shake', 'mismatch');
                    cardTwo.classList.remove('shake', 'mismatch');
                    cardOne.innerHTML = '';
                    cardTwo.innerHTML = '';
                }, 500);

                // Increase move count by 1
                moves++;
                document.querySelector('.moves').textContent = moves;
                starsRating(moves);

                // Empty the arrays and make them ready for next open cards
                cardOpen = [];
                cardId = [];
            }
        }
    }
}

/* Star Rating: Change star rating after some number of moves */
function starsRating(moves) {
    var starsRemain;

    if (moves <= 10) {
        starsRemain = '3 stars';
    } else if (moves > 10 && moves < 16) {
        starsCount[2].innerHTML = '<i class="fa fa-star-o"></i>';
        starsRemain = '2 stars';
    } else if (moves >= 16) {
        starsCount[1].innerHTML = '<i class="fa fa-star-o"></i>';
        starsRemain = '1 star';
    }

    return { starsNumber: starsRemain };
}

function starsReset() {
    for (var j = 0; j < starsCount.length; j++) {
        starsCount[j].innerHTML = '<i class="fa fa-star"></i>';
    }
}

/* Timer: Display time when the game starts */
function timeCount(s) {
    var sec = s % 60;
    var min = Math.floor(s / 60);

    if (sec < 10) {
        sec = '0' + s % 60;
    }

    if (min < 10) {
        min = '0' + Math.floor(s / 60)
    }

    if (min < 1 ) {
        time.textContent = min + ' : ' + sec + ' seconds';
    } else {
        time.textContent = min + ' : ' + sec + ' minutes';
    }

}

function timeStart() {
    timeIncrease++;
    timeCount(timeIncrease);
}

function timeStop() {
    clearInterval(timeRun);
}

function timeReset() {
    timeStop();
    time = document.querySelector('.time');
    time.textContent = '00 : 00 seconds';
    timeIncrease = 0;
    timeRun = setInterval(timeStart, 1000);
}

/* Restart Button */
document.querySelector('.restart').addEventListener('click', init);
