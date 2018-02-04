/*
 * Create a list that holds all of your cards
 */
'use strict';

var cardList, cardId, cardOpen, cardFlipCount, moves, stars, starsCount, time, timeIncrease, timeRun;

cardList = ['anchor', 'anchor', 'bicycle', 'bicycle', 'bolt', 'bolt', 'bomb', 'bomb', 'cube', 'cube', 'diamond', 'diamond', 'leaf', 'leaf', 'paper-plane-o', 'paper-plane-o'];
cardId = [];
cardOpen = [];

init();

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function init() {
    cardFlipCount = 0;
    moves = 0;
    document.querySelector('.moves').textContent = moves;

    stars = document.querySelector('.stars');
    starsCount = stars.getElementsByTagName('li');
    starsRating(moves);
    starsReset();

    timeReset();

    var displayCard = '';
    shuffle(cardList);
    for (var i = 0; i < cardList.length; i++) {
        var createCardId = i + 1;
        displayCard += '<li id="card-' + createCardId + '" class="card" onclick="flipCard(this,\'' + cardList[i] + '\')"></li>';
    }
    
    document.querySelector('.deck').innerHTML = displayCard;
    document.querySelector('.modal').style.display = 'none';
    document.querySelector('.container').classList.remove('blur');
}

function flipCard(card, symbol) {
    if (card.innerHTML === '' && cardOpen.length < 2) {
        card.classList.add('open', 'show', 'animated', 'flipInY');
        card.innerHTML = '<i class="fa fa-' + symbol + '"></i>';

        if (cardOpen.length === 0) {
            cardOpen.push(symbol);
            cardId.push(card.id);

        } else if (cardOpen.length === 1) {
            cardOpen.push(symbol);
            cardId.push(card.id);

            var cardOne = document.getElementById(cardId[0]);
            var cardTwo = document.getElementById(cardId[1]);

            if (cardOpen[0] === cardOpen[1]) {
                cardFlipCount += 2;
                
                cardOne.classList.add('match', 'rubberBand');
                cardTwo.classList.add('match', 'rubberBand');

                cardOne.classList.remove('open', 'show', 'flipInY');
                cardTwo.classList.remove('open', 'show', 'flipInY');
                
                moves++;
                document.querySelector('.moves').textContent = moves;
                starsRating(moves);
                cardOpen = [];
                cardId = [];
                
                if (cardFlipCount === cardList.length) {
                    timeStop();
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

                moves++;
                document.querySelector('.moves').textContent = moves;
                starsRating(moves);
                cardOpen = [];
                cardId = [];
            }
        }
    }
}

// Star check
function starsRating(moves) {
    var starsRemain = '3 stars';
    if (moves >= 10 && moves < 16) {
        starsCount[2].innerHTML = '<i class="fa fa-star-o"></i>';
        starsRemain = '2 stars';
    } else if (moves >= 16 && moves < 22) {
        starsCount[1].innerHTML = '<i class="fa fa-star-o"></i>';
        starsRemain = '1 star';
    } else if (moves >= 22) {
        starsCount[0].innerHTML = '<i class="fa fa-star-o"></i>';
        starsRemain = '0 star';
    }

    return { starsNumber: starsRemain };
}

function starsReset() {
    for (var j = 0; j < starsCount.length; j++) {
        starsCount[j].innerHTML = '<i class="fa fa-star"></i>';
    }
}

// Time check
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

document.querySelector('.restart').addEventListener('click', init);
