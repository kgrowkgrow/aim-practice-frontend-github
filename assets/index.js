const BASEURL = "http://localhost:3000/"
let currentUser


document.addEventListener("DOMContentLoaded", event => {
    
    form = document.querySelector("#login-form")
    form.addEventListener("submit", event => {
        event.preventDefault()

        name = event.target.uname.value
        fetch(BASEURL + "users", configPostObj(name))
        .then(resp => resp.json())
        .then(json => {
            currentUser = json
            
            renderMainPage(currentUser.name) 
        })     
    })
})


function configPostObj(name) {
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            name: name
        })
    }   
}

function renderMainPage(username) {

    hideForm()
    
    let welcome = document.querySelector("#welcome")
    welcome.children[0].textContent = `Hi there, ${username}!`

    let gameBox = document.querySelector("#game-box")
    gameBox.style.display = "block"

    gameBox.addEventListener("click", event => {
        if (event.target.tagName != "BUTTON") {return}
        event.target.style.display = "none"
        startGame()
    })
}

function hideForm() {
    
    let form = document.querySelector("#login-form")
    form.style.display = "none"
}

function startGame() {
    let gameBox = document.querySelector("#game-box")
    let score = document.querySelector("#score-num")
    score.textContent = "0"

    startTimer()

    makeTargetDivs()

    let playAgainTimeout = window.setTimeout(function() {
        let button = document.querySelector("#new-game-button")
        button.innerText = "Play Again"
        button.style.display = "block"

        postScore(parseInt(score.textContent))
        
        //accept number of seconds as an input and base all the times off of that. or maybe give an option
    }, 33000)
    

}

function startTimer() {
   
    let timeElm = document.getElementById('timer');
    let timer = function(x) {
        if(x === -1) {
            console.log("time's up!")
            return;
    }

    timeElm.innerHTML = x;

    return setTimeout(() => {timer(--x)}, 1000)
    }

    timer(30)
}

function makeTargetDivs() {

    let gameBox = document.getElementById("game-box")

    let targetID = 1

    let targetInterval = setInterval(makeSingleTarget, 1000)
    
    let timeoutID = window.setTimeout(function() {clearInterval(targetInterval)}, 30000) 

    gameBox.addEventListener("click", dealWithClick)

}

function makeSingleTarget() {
    let timer = document.getElementById('timer')
    
    let gameBox = document.getElementById("game-box")
    
    let div = document.createElement("div")
    div.className = "target"

    let timeoutID = window.setTimeout(function() {div.parentNode.removeChild(div)}, 3000)
    
    pagePosition(div)

    gameBox.appendChild(div)

    

    

    

}

function pagePosition(element) {
    element.style.top = `${Math.random()*80}%`;
    element.style.left = `${Math.random()*80}%`;
}

function dealWithClick(event) {
    let gameBox = document.getElementById("game-box") 
        
        if (event.target.className != "target") {
            if (event.target.tagName != "BUTTON") {
            console.log("you missed!")
            addToScore(-10) 
            }     
        } else {
            console.log("direct hit!")
            event.target.style.display = "none"
            addToScore(50)
        }     
}

function addToScore(num) {
    let currentScore = document.querySelector("#score-num")
    if (currentScore.textContent != "0") {
        
        let scoreInt = parseInt(currentScore.textContent) 
        scoreInt += num
        currentScore.textContent = scoreInt
      
    } else { 
        currentScore.textContent = `${num}`
    }   
}

function postScore(score) {
    fetch(BASEURL + "games", configScoreObj(score))
    .then(resp => resp.json())
    .then(json => {
        console.log(json)
    })
}

function configScoreObj(score) {
    // make and return obj
    // debugger
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            score: score,
            user_id: currentUser.id,
            scoreboard_id: 1
            // before this works, I need to: handle this in games controller, 
        })
    }  
}
