const BASEURL = "http://localhost:3000/"

// let username 

document.addEventListener("DOMContentLoaded", event => {
    
    // debugger
    form = document.querySelector("#login-form")
    form.addEventListener("submit", event => {
        event.preventDefault()

        name = event.target.uname.value
        fetch(BASEURL + "users", configPostObj(name))
        .then(resp => resp.json())
        .then(json => {
            let username = json.name  
            renderMainPage(username) // I may also need to keep the user id here so that a new game can grab it
        })     
    })
})

function renderLogin() {
    const welcome = document.querySelector("#login")
    // const div = document.querySelector("#game-box")
    // div.style.display = "block"
}

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
        startGame()
    })
}

function hideForm() {
    let form = document.querySelector("#login-form")
    form.style.display = "none"
}

function startGame() {
    let gameBox = document.querySelector("#game-box")

    startTimer()
    
    

}

function startTimer() {
    // let timer = document.getElementById("timer")

    // let timerID = setInterval(countdown, 1000);
    // let timeLeft = 30
    
    // function countdown() {
    //     if (timeLeft == -1) {
    //         clearTimeout(timerId);
    //         // endGame() ???? not sure how this will work yet
    //     } else {
    //         timer.innerHTML = timeLeft;
    //         timeLeft --;
    //     }
    // }
    let timeElm = document.getElementById('timer');
    let timer = function(x) {
        if(x === -1) {
            console.log("time's up!")
            return;
    }

    timeElm.innerHTML = x;

    return setTimeout(() => {timer(--x)}, 1000)
    }

    timer(30);

}