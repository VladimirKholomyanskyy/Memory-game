

var uiController = (function(){
    
    const domStrings = {
        firstPlayerScoreId: 'score-0',
        secondPlayerScoreId: 'score-1',
        firstPlayerNameId: 'name-0',
        secondPlayerNameId: 'name-1',
        firstPlayerPanel: '.player-0-panel',
        secondPlayerPanel: '.player-1-panel',
        active: 'active',
        card: '.card',
        flip: 'flip',
        newButton: '.btn-new'
    };
    
    const clearActivation = function(){
        document.querySelector(domStrings.firstPlayerPanel).classList.remove(domStrings.active);
        document.querySelector(domStrings.secondPlayerPanel).classList.remove(domStrings.active);
        
    };
    
    
    
    return {
        setFirstPlayerScore: function(score){
            document.getElementById(domStrings.firstPlayerScoreId).textContent = score;
        },
        
        setSecondPlayerScore: function(score){
            document.getElementById(domStrings.secondPlayerScoreId).textContent = score;
        },
        
        activateFirstPlayerPanel: function(){
             clearActivation();
             document.querySelector(domStrings.firstPlayerPanel).classList.add(domStrings.active);
        },
        
        setFirstPlayerName: function(name){
            document.getElementById(domStrings.firstPlayerNameId).textContent = name;
        },
        
         setSecondPlayerName: function(name){
            document.getElementById(domStrings.secondPlayerNameId).textContent = name;
        },
        
        activateSecondPlayerPanel: function(){
            clearActivation();
            document.querySelector(domStrings.secondPlayerPanel).classList.add(domStrings.active);
        },
        
        setCardFlippingHandler: function(handler){
            const cards = document.querySelectorAll(domStrings.card);
            cards.forEach(card=>card.addEventListener('click', handler));
    
        },
        
        removeCardFlippingHandler: function(card, handler){
            card.removeEventListener('click', handler);
        },
        
        backFaceAllCards: function(){
            document.querySelectorAll(domStrings.card).forEach(card => card.classList.remove(domStrings.flip));
        },
        
        setNewButtonEventListener: function(eventListener){
            document.querySelector(domStrings.newButton).addEventListener('click', eventListener);
        },
        
        flipCard: function(card){
            card.classList.toggle(domStrings.flip);
            console.log(card);
        },
        
        shuffle: function(){
            const cards = document.querySelectorAll(domStrings.card);
            cards.forEach(card => {
                random = Math.floor(Math.random()*40);
                card.style.order = random;
            });
        } 
    };
})();



const gameController = (function(ui){
    
    var turn, firstCardIsSelected, lockBoard, openedCards;
    var score = {
            firstPlayer : 0,
            secondPlayer : 0
        };
    
    var selectedCards = {
        first: '',
        second: ''
    };
    
    const startNewGame = function(){
        score.firstPlayer = 0;
        score.secondPlayer = 0;
        openedCards = 0;
        turn = 'firstPlayer';
        firstCardIsSelected = false;
        lockBoard = true;
        
        ui.backFaceAllCards();
        ui.setFirstPlayerScore(score.firstPlayer);
        ui.setSecondPlayerScore(score.secondPlayer);
        ui.activateFirstPlayerPanel();
        ui.setFirstPlayerName('Player 1');
        ui.setSecondPlayerName('Player 2');
        ui.setCardFlippingHandler(cardClickHandler);
        setTimeout(() => {
            ui.shuffle();
            lockBoard = false;
        },1500);
        
    }
    
    const disableCards = function(){
        ui.removeCardFlippingHandler(selectedCards.first, cardClickHandler);
        ui.removeCardFlippingHandler(selectedCards.second, cardClickHandler);
    }
    
    const switchPlayer = function(){
        if(turn === 'firstPlayer'){
            ui.activateSecondPlayerPanel();
            turn = 'secondPlayer';
        }else if(turn === 'secondPlayer'){
            ui.activateFirstPlayerPanel();
            turn = 'firstPlayer';
        }
 
    }
    
    const addPointToCurrentPlayer = function(){
        score[turn] += 1;
        openedCards += 2;
        
        if(turn === 'firstPlayer'){
            ui.setFirstPlayerScore(score.firstPlayer);
        }else if(turn === 'secondPlayer'){
            ui.setSecondPlayerScore(score.secondPlayer);
        }
    }
    
    const isGameOver = function(){
        return openedCards === 40;
    }
    
    const endGame = function(){
       
        if(score.firstPlayer> score.secondPlayer){
            ui.setFirstPlayerName('Winner!!!');
        }else if(score.firstPlayer < score.secondPlayer){
            ui.setSecondPlayerName('Winner!!!');
        }else{
            ui.setFirstPlayerName('Tie');
            ui.setSecondPlayerName('Tie');
        }
    }
    
    
    const cardClickHandler = function(){
        if(lockBoard) return;
        
        if(!firstCardIsSelected) {
            ui.flipCard(this);
            selectedCards.first = this;
            firstCardIsSelected = true;
            
        }else if(this !== selectedCards.first) {
            
            ui.flipCard(this);
            selectedCards.second = this;
            firstCardIsSelected = false;
            
            if(selectedCards.first.dataset.card === selectedCards.second.dataset.card){
                disableCards();
                addPointToCurrentPlayer();
                if(isGameOver()) endGame();
                
            }else{
                lockBoard = true;
                setTimeout(() => {
                    ui.flipCard(selectedCards.first);
                    ui.flipCard(selectedCards.second);
                    switchPlayer();
                    lockBoard = false;
                }, 1500); 
            }
        }   
    }
    
    return {
        startApplication: function(){
            ui.setNewButtonEventListener(startNewGame);
            
            startNewGame();
        }
    };
    
})(uiController);

gameController.startApplication();
