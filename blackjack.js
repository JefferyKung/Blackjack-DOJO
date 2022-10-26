
var dealerSum = 0;
var yourSum = 0;
var yourSum1 =0;
var yourSum2 =0;

var dealerAceCount = 0;
var yourAceCount = 0; 
var yourAceCount2 = 0; 

var hidden;
var dealerBody = document.querySelector("#dealer-cards");
var deck;

var valueWithAce = yourSum;

var currDeck = [];
var dealDeck = [];



//按鈕控制器
var canHit = true; //allows the player (you) to draw while yourSum <= 21
var dealerCanHit = true;
var canSplit = false;
var canSplitStand1 = true;
var canSplitHit2 = false;
function splitEnable(){
    if (getValue(currDeck[0])==getValue(currDeck[1])){
        canSplit = true;
    }
}

//loading頁面
window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGamePlayer();
  
}

//[基礎功能]


//建立牌組
function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
}

//洗牌
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

//取得數值
function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);

}

//確認有沒有A
function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

//含有A的排組數值，最小有沒有爆掉(超過21)
function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}


//[以下為遊戲程序]


//{遊戲開始}
function startGamePlayer() {
    var cardD = deck.pop();
    console.log(cardD);
    document.querySelector("#hidden").setAttribute("src", "./cards/" + cardD + ".png");
    dealerSum += getValue(cardD);
    dealerAceCount += checkAce(cardD);
    dealDeck.push(cardD);
    
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        currDeck.push(card);
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
        console.log(yourSum);
        console.log(yourAceCount);
        console.log(currDeck);
    }

    document.querySelector("img")[0]
    console.log(getValue(currDeck[0]));
    console.log(getValue(currDeck[1]));
    splitEnable();

   
    if(yourAceCount == 0){
        document.getElementById("your-sum").innerText =  yourSum;
    }else if(yourAceCount == 1){
        valueWithAce = yourSum-10;
        console.log(yourAceCount);
        document.getElementById("your-sum").innerText =  yourSum+" or "+valueWithAce;
    }else if(yourAceCount == 2){
        console.log(yourAceCount);
        valueWithAce = 2;
        document.getElementById("your-sum").innerText =  yourSum+" or "+valueWithAce;
    }

    if(yourSum==21){
        document.getElementById("results").innerText = "You win with BJ!";
        canHit=false;
        // window.addEventListener("click",location.reload());

    }
    
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);


}

//{閒家要牌}
function hit() {    
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    console.log(deck);

    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;   
    }
    

    if(yourAceCount == 0){
        document.getElementById("your-sum").innerText =  yourSum;
    }else if(yourAceCount == 1){
        valueWithAce = yourSum-10;
        console.log(yourAceCount);
        document.getElementById("your-sum").innerText =  yourSum+" or "+valueWithAce;
    }else if(yourAceCount == 2){
        console.log(yourAceCount);
        var valueWithAceSmall = yourSum-20;
        var valueWithAceMiddle = yourSum -10;
        document.getElementById("your-sum").innerText =  yourSum+" or "+valueWithAceMiddle+" or "+valueWithAceSmall;
    }

    
    console.log(yourAceCount);
    if(yourAceCount == 0){
        if(yourSum>21){
            dealerCanHit = false;
            document.getElementById("results").innerText = "Busted! You LOSER"; 
        }else if(yourAceCount != 0){
            while(yourAceCount > 0){
                valueWithAce = yourSum-10;
                yourAceCount -= 1;
            }
        
        }
    }

    if(yourSum>21 && valueWithAce>21){
        document.getElementById("results").innerText = "Busted! You LOSER"; 
        canHit = false; 
        dealerCanHit = false;
    }

    if(yourSum>21 && valueWithAceMiddle>21 && valueWithAceSmall>21){
        document.getElementById("results").innerText = "Busted! You LOSER"; 
        canHit = false; 
        dealerCanHit = false;
    }
}


//{不要牌}
function stay() {
    if (!canHit) {
        return;
    }
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;

    dealerHit();
}

//{莊家發牌}
function dealerHit(){
    if (canHit) {
        return;
    }

    if (!dealerCanHit){
        return;
    }

    canSplitHit2 = false;
    //<img src="./cards/4-C.png">
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").append(cardImg);
    dealDeck.push(card);
    console.log(dealDeck);
    
    console.log(dealerSum);
    console.log(dealerAceCount);
    let message = "";
    let msg2 ="";

    var secSum = document.querySelector("#your-sum2").innerText;
    var yourSum = document.querySelector("#your-sum").innerText;
    console.log(secSum);
    console.log(yourSum)

  
    
    if (dealerSum >= 17){
        dealerCanHit = false;
      
        if(secSum === ""){
            if (yourSum > 21 ) {
                msg2  = "You Lose!";
            }else if (dealerSum > 21) {
                message = "dealer busted. You win! ";
            }
            //both you and dealer <= 21
            else if (dealerSum == 21 && dealerAceCount ==1 && dealDeck.length == 2){
                message = "You Lose w/ dealer's BJ!";
            }

            else if (yourSum == dealerSum) {
                message = "Tie!";
            }
            else if (yourSum > dealerSum) {
                message = "You Win!";
            }
            else if (yourSum < dealerSum) {
                message = "You Lose!";
            }
        }else{
            if (yourSum > 21 && secSum>21) {
                msg2  = "You Lose both!";
            }else if (dealerSum > 21) {
                message = "dealer busted. You win! You win both of them!";
            }else if (yourSum > 21 || secSum>21) {
                msg2  = "You bust one of them!";
            }

            //both you and dealer <= 21
            else if (dealerSum == 21 && dealerAceCount ==1 && dealDeck.length == 2 ){
                message = "You Lose w/ dealer's BJ!";
            }else if (yourSum < dealerSum && secSum < dealerSum) {
                message = "You Lose both!";
            }

            else if (yourSum == dealerSum == secSum) {
                message = "Tie!";
            }
            else if (yourSum > dealerSum && secSum < dealerSum) {
                message = "You Win one and lose one!";
            }
            else if (yourSum < dealerSum && secSum > dealerSum) {
                message = "You Win one and lose one!";
            } else if (yourSum > dealerSum && secSum > dealerSum) {
                message = "You win double!";
            }else if (yourSum > dealerSum && secSum == dealerSum) {
                message = "1W1T";
            }else if (yourSum < dealerSum && secSum == dealerSum) {
                message = "1L1T";
            }else if (yourSum == dealerSum && secSum > dealerSum) {
                message = "1W1T";
            }else if (yourSum == dealerSum && secSum < dealerSum) {
                message = "1L1T";
            }

        }
    }
    var secSum = document.querySelector("#your-sum2").innerText;
    console.log(secSum);

    document.getElementById("dealer-sum").innerText = dealerSum;
    // document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message + msg2;
}

// {double Down}
function doubleDown(){
    
    
    if (!canHit) {
        return;
    }

    canHit = false;

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    console.log(deck);

    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;   
    }
    

    if(yourAceCount == 0){
        document.getElementById("your-sum").innerText =  yourSum;
    }else if(yourAceCount == 1){
        valueWithAce = yourSum-10;
        console.log(yourAceCount);
        document.getElementById("your-sum").innerText =  yourSum+" or "+valueWithAce;
    }else if(yourAceCount >= 2){
        console.log(yourAceCount);
        var valueWithAceSmall = 2+ getValue(card);
        var valueWithAceMiddle = 12+ getValue(card);
        document.getElementById("your-sum").innerText =  yourSum+" or "+valueWithAceMiddle+" or "+valueWithAceSmall;
    }

    
    console.log(yourAceCount);
    if(yourAceCount == 0){
        if(yourSum>21){
            dealerCanHit = false;
            document.getElementById("results").innerText = "Busted! You LOSER"; 
        }else if(yourAceCount != 0){
            while(yourAceCount > 0){
                valueWithAce = yourSum-10;
                yourAceCount -= 1;
            }
        
        }
    }

    if(yourSum>21 && valueWithAce>21){
        document.getElementById("results").innerText = "Busted! You LOSER"; 
        canHit = false; 
        dealerCanHit = false;
    }

    if(yourSum>21 && valueWithAceMiddle>21 && valueWithAceSmall>21){
        document.getElementById("results").innerText = "Busted! You LOSER"; 
        canHit = false; 
        dealerCanHit = false;
    }

    dealerHit();
}

//{分牌}
function split(){
    if (!canHit) {
        return;
    }

    if (!canSplit){
        return;
    }

    //版面改變
    document.querySelector(".splitSection").style.display="block";
    document.querySelector(".splitFuncBtns").style.display="flex";
    document.querySelector("#hit").style.display="none";
    document.querySelector("#stay").style.display="none";
    document.querySelector("#split").style.display="none";
    document.querySelector("#splitS1").innerHTML = "Your First pair after splitting: "
    alert("If it's A pair, you can only hit one card for each. and you can only double down when you have two cards of the set.");

    //發下一張牌給第一付牌
    console.log(yourAceCount);

    let cardImg = document.createElement("img");
    let card = deck.pop();

    cardImg.src = "./cards/" + card + ".png";
    var oneCardValue = yourSum / 2;
    var yourSum1 = oneCardValue+ getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    console.log(currDeck);
    console.log(yourAceCount);

    // 點數顯示 -> 0張A / 1張A 
    if(yourAceCount == 0){
        document.getElementById("your-sum").innerText =  yourSum1;
    }else if(yourAceCount == 1){
        valueWithAce = yourSum1-10;
        console.log(yourAceCount);
        document.getElementById("your-sum").innerText =  yourSum1+" or "+valueWithAce;
    }

    //第一付牌BJ
    if(yourSum1==21){
        document.getElementById("results").innerText = "BJ!";
        canHit=false;

    }

    //若超過21點
    if (reduceAce(yourSum1, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;   
    }

    //A pair 分牌後只能各要1張牌
    if (yourAceCount != 0){
        canHit = false;
    }

    //第一付牌繼續要牌
    document.querySelector("#splitHit1").addEventListener("click",function(){
        if (!canHit) {
            return;
        }
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum1 += getValue(card);
        console.log(yourSum1);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    
        console.log(deck);
        console.log(currDeck);

        document.getElementById("your-sum").innerText =  yourSum1;

        if (reduceAce(yourSum1, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
            canHit = false;   
        }

      

        // 點數顯示 -> 0張A / 1張A / 2張A
        if(yourAceCount == 0){
            document.getElementById("your-sum").innerText =  yourSum1;
        }else if(yourAceCount == 1){
            valueWithAce = yourSum1-10;
            console.log(yourAceCount);
            document.getElementById("your-sum").innerText =  yourSum1+" or "+valueWithAce;
        }
        else if(yourAceCount >= 2){
            console.log(yourAceCount);
            var valueWithAceSmall = 2+ getValue(card);
            var valueWithAceMiddle = 12+ getValue(card);
            document.getElementById("your-sum").innerText =  yourSum1+" or "+valueWithAceMiddle+" or "+valueWithAceSmall;
        }

    });

    //第一付牌不要牌 == 發一張牌給第二付牌
    document.querySelector("#splitStand1").addEventListener("click",function(){
        if (!canSplitStand1) {
            return;
        }
        
        if (yourAceCount != 0){
            canSplitHit2 = false;
    
        }


        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        var yourSum2 = oneCardValue+ getValue(card);

        // 設定A的數量
        if (checkAce(currDeck[0]) != 0){
            var yourAceCount = 1;
        }else{
            var yourAceCount = 0;
        }
        console.log(yourAceCount);

        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
        console.log(yourAceCount);

        // 點數顯示 -> 0張A / 1張A 
        if(yourAceCount == 0){
            document.getElementById("your-sum2").innerText =  yourSum2;
        }else if(yourAceCount == 1){
            valueWithAce = yourSum2-10;
            console.log(yourAceCount);
            document.getElementById("your-sum2").innerText =  yourSum2+" or "+valueWithAce;
        }
     

        canSplitStand1=false;
        canSplitHit2=true;
        canHit=false;

        //第二付牌BJ
        if(yourSum2==21){
            document.getElementById("results").innerText = "BJ!";
            canSplitHit2=false;

        }

        //第二付牌爆掉就不能再要牌
        if (reduceAce(yourSum2, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
            canSplitHit2 = false;   
        }

        //第二付繼續要牌
        document.querySelector("#splitHit2").addEventListener("click",function(){
            if (!canSplitHit2) {
                return;
            }
            console.log(yourSum2);
            let cardImg = document.createElement("img");
            let card = deck.pop();
            cardImg.src = "./cards/" + card + ".png";
            yourSum2 += getValue(card);
            yourAceCount += checkAce(card);
            document.getElementById("your-cards").append(cardImg);
        
            console.log(deck);
            console.log(yourSum2);
            console.log(yourAceCount);


            //有A的數值顯示
            if(yourAceCount == 0){
                document.getElementById("your-sum2").innerText =  yourSum2;
            }else if(yourAceCount == 1){
                valueWithAce = yourSum2-10;
                console.log(yourAceCount);
                document.getElementById("your-sum2").innerText =  yourSum2+" or "+valueWithAce;
            }else if(yourAceCount >= 2){
                console.log(yourAceCount);
                var valueWithAceSmall = 2+ getValue(card);
                var valueWithAceMiddle = 12+ getValue(card);
                document.getElementById("your-sum2").innerText =  yourSum2+" or "+valueWithAceMiddle+" or "+valueWithAceSmall;
            }
        
            document.getElementById("your-sum2").innerText =  yourSum2;

            if (reduceAce(yourSum2, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
                canSplitHit2 = false;   
            }
    })

})
    
    if (reduceAce(yourSum1, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;   
    }
    
}


gsap.from('#univ', {
    duration: 10,
    autoAlpha: 0, 
    y: 500,
    scale: 0.1,
    scrollTrigger: {
        trigger: '#univ',
        markers: true,
        //tigger scroller
        start: "top bottom-=80%",
        end: "top 30%",

        //scrub and pin
        scrub: true //duration of tween to animate
    }
})






