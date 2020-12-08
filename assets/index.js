const BASEURL = "http://localhost:3000/"
let currentUser

let doubleStatus = true


document.addEventListener("DOMContentLoaded", event => {
    
    form = document.querySelector("#login-form")
    form.addEventListener("submit", event => {
        event.preventDefault()

        name = event.target.uname.value
        fetch(BASEURL + "users", configPostObj(name))
        .then(resp => resp.json())
        .then(json => {
            currentUser = json

            addScoreboardDeleteEvent()
            addScoreboardButtonEvent()
            addEditButtonEvent()
            addGameEventListener()
            
            renderMainPage() 
        })     
    })
})

function addScoreboardButtonEvent() {
    let scoreboardButton = document.querySelector("#scoreboard-button")
    scoreboardButton.addEventListener("click", event => {
        let scoreboard = document.getElementById("high-score-table")
        

        if (scoreboard.style.display === "none") {
            
            renderScoreboard()
        } else {
            renderMainPage()
        }
    })
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

function renderMainPage() {

    hideLogin()
    hideScoreboard()
    hideClearButton()
    showGameBox()
    showEditUserButton()
    showWelcome()
    
    
    let welcome = document.querySelector("#welcome > h1")

    welcome.textContent = `Hi there, ${capitalize(currentUser.name)}!`
    
    
    showScoreboardButton()

    // let scoreboardButton = document.querySelector("#scoreboard-button")
    // scoreboardButton.addEventListener("click", event => {
    //     let scoreboard = document.getElementById("high-score-table")

    //     if (scoreboard.style.display === "none") {
            
    //         renderScoreboard()
    //     } else {
    //         renderMainPage()
    //     }
//     })
 }

 function showWelcome() {
    let welcome = document.querySelector("#welcome")
    welcome.style.display = "block"
 }

 function hideWelcome() {
    let welcome = document.querySelector("#welcome")
    welcome.style.display = "none"
 }

 function resetWelcome() {
     let welcome = document.querySelector("#welcome > h1")
     welcome.textContent = "Welcome to Aimbot Trainer!"
 }


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// function toggleLoginForm() {
    
//     let form = document.querySelector("#login-form")
 
//     if (form.style.display === "none") {
//         form.style.display = "block"
//     } else {
//         form.style.display = "none" 
//     }
// }

function showGameBox() {

    let gameBox = document.querySelector("#game-box")
    gameBox.style.display = "block"

}

function addGameEventListener() {

    let gameBox = document.querySelector("#game-box")

    gameBox.addEventListener("click", event => {
        if (event.target.tagName != "BUTTON") {return}
        event.target.style.display = "none"
        startGame()
    })
}

function hideGameBox() {
    let gameBox = document.querySelector("#game-box")
    gameBox.style.display = "none"
}

function showScoreboardButton() {
    let heroFoot = document.querySelector("#hero-foot")
    heroFoot.style.display = "block"
}

function hideScoreboardButton() {
    let heroFoot = document.querySelector("#hero-foot")
    heroFoot.style.display = "none"
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

    let targetInterval = setInterval(makeSingleTarget, 500)
    
    let timeoutID = window.setTimeout(function() {clearInterval(targetInterval)}, 30000) 

    gameBox.addEventListener("click", dealWithClick)

}

function makeSingleTarget() {
    let timer = document.getElementById('timer')
    
    let gameBox = document.getElementById("game-box")
    
    let div = document.createElement("div")
    div.className = "target"

    let timeoutID = window.setTimeout(function() {div.parentNode.removeChild(div)}, 3000)
    
    styleTarget(div)

    gameBox.appendChild(div)

    

    

    

}

function styleTarget(element) {
    element.style.top = `${Math.random()*80}%`;
    element.style.left = `${Math.random()*80}%`;


    let randomWidthHeight = getRandomIntInclusive(30, 80)
    element.style.width = `${randomWidthHeight}px`
    element.style.height = `${randomWidthHeight}px`
    // debugger
    
    
    


}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); 
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
    .then(json => {})
}

function configScoreObj(score) {
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
        })
    }  
}

function renderScoreboard() {
    // toggleGameBox()
    hideGameBox()
    clearScoreboard()
    showScoreboard()
    // toggleScoreboard()
    // showScoreboard()
    // toggleClearButton()
    

    showClearButton()

    fetchNewScores()


}

function showClearButton() {
    let clearButton = document.getElementById("delete-game-button")
    clearButton.style.display = "block"
}

function hideClearButton() {
    let clearButton = document.getElementById("delete-game-button")
    clearButton.style.display = "none"
}

function toggleScoreboard() {

    // toggleGameBox()

    let scoreboard = document.querySelector("#high-score-table")
    let button = document.getElementById("scoreboard-button")
    if (scoreboard.style.display === "none") {
        scoreboard.style.display = "block"
        button.textContent = "Back to Game"
        
    } else {
        scoreboard.style.display = "none"
        button.textContent = "View High Scores"
        
    }


}

function showScoreboard() {
    let scoreboard = document.querySelector("#high-score-table")
    let button = document.getElementById("scoreboard-button")

    scoreboard.style.display = "block"
    button.textContent = "Back to Game"

}

function hideScoreboard() {
    let scoreboard = document.querySelector("#high-score-table")
    let button = document.getElementById("scoreboard-button")

    scoreboard.style.display = "none"
    button.textContent = "View High Scores"

}

function toggleGameBox() {
    let gameBox = document.querySelector("#game-box")
    if (gameBox.style.display === "none") {
        gameBox.style.display = "block"
    } else {
        gameBox.style.display = "none"
    }
}

function fetchNewScores() {
    clearScoreboard()
    fetch(BASEURL + "games")
    .then(resp => resp.json())
    .then(json => {

        let sortedJson = json.sort((a,b) => {
            return a.score - b.score
        }).reverse()
        
        let slicedJson = sortedJson.slice(0, 15)
        
        slicedJson.forEach(game => {
            
            let scoreboardDiv = document.getElementById("scoreboard-body")

            let newRow = document.createElement("tr")
            newRow.dataset.id = game.id

            let userCell = document.createElement("td")
            userCell.textContent = game.user.name

            let scoreCell = document.createElement("td")
            scoreCell.textContent = game.score + " "

            if (game.user.name === currentUser.name) {

                let div = document.createElement("div")

                let doubleButton = document.createElement("button")
                doubleButton.textContent = "2x"
                doubleButton.className = "button is-small is-focused is-rounded is-primary"
                // div.appendChild(doubleButton)
                scoreCell.appendChild(doubleButton)

                doubleButton.addEventListener("click", event => {

                    if (doubleStatus) {
                        let num = parseInt(event.target.parentNode.textContent) * 2
                        
                        let id = event.target.parentNode.parentNode.dataset.id
                        
                        doubleStatus = false
                        doubleTheScore(id, num)
                    } else {
                        alert("You can't do that!")
                    }
            })
        }
            newRow.append(userCell, scoreCell)
            scoreboardDiv.appendChild(newRow)
        } )  
    })
}

function clearScoreboard() {
    let tbody = document.getElementById("scoreboard-body")
    tbody.innerHTML = ""
}

// function toggleClearButton() {
//     let clearButton = document.getElementById("delete-game-button")
//     if (clearButton.style.display === "none") {
//         clearButton.style.display = "block"
//     } else {
//         clearButton.style.display = "none"
//     }

//     clearButton.addEventListener("click", dealWithDelete)
// }

function addScoreboardDeleteEvent() {
    let clearButton = document.getElementById("delete-game-button")
    clearButton.addEventListener("click", dealWithDelete)
}

function dealWithDelete() {
    if (confirm("Are you sure? This will delete all scores")) {
        console.log("inside deal with delete")

        fetch(BASEURL + "clear-board")
        .then(resp => resp.json())
        .then(json => {
            fetchNewScores()
        })
    }
}

function doubleTheScore(id, num) {

   console.log(num)
   fetch(BASEURL + `games/${id}`, configDoubleObject(num))
   .then(resp => resp.json())
   .then(json => {
       console.log(json)
       
       fetchNewScores()
       
   })
}

function configDoubleObject(num) {
    return {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            score: num
        })
    } 
}

function showEditUserButton() {
    let button = document.getElementById("edit-user-button")
    button.style.display = "block"

    button.addEventListener("click", event => {

        //if edit form is hidden, turn it on
        goToEditPage()
        //if edif form is showing, turn it off


    })
}

function goToEditPage() {

    hideClearButton()
    hideGameBox()
    hideScoreboardButton()
    hideScoreboard()
    
    showLogin()

    hideEnterButton()
    showEditButtons()



    // toggleGameBox()
    // toggleLoginForm()
    // toggleEditButtons()
    // toggleEnterButton()

}

function toggleEditButtons() {
    let editButtons = document.getElementById("form-edit-buttons")

    let editButton = document.getElementById("username-edit-button")

    let deleteButton = document.getElementById("delete-user-button")

 
    if (editButtons.style.display === "none") {
        editButtons.style.display = "block"
    } else {
        editButtons.style.display = "none" 
    }

    editButtons.addEventListener("click", event => {

        event.preventDefault()
        
        if (event.target.id === "username-edit-button") {
            let newName = event.target.parentNode.parentNode.children[1].value
            
            fetch(BASEURL + `users/${currentUser.id}`, configEditObject(newName))
            .then(resp => resp.json())
            .then(json => {
                currentUser = json
                renderMainPage()
            })
            
        } else if (event.target.id === "delete-user-button") {
            console.log(event.target.id)

        fetch(BASEURL + `users/${currentUser.id}`, {method: "DELETE"})
        .then(resp => resp.json())
        .then(json => {
            console.log(json)
            toggleEnterButton()
            toggleEditButtons()
            resetLoginForm()
        })

        } else {return}
    })
}

function showEditButtons() {
    let editButtons = document.getElementById("form-edit-buttons")

    let editButton = document.getElementById("username-edit-button")

    let deleteButton = document.getElementById("delete-user-button")

    editButtons.style.display = "block"

    // editButtons.addEventListener("click", event => {

    //     event.preventDefault()
        
    //     if (event.target.id === "username-edit-button") {
    //         let newName = event.target.parentNode.parentNode.children[1].value
            
    //         fetch(BASEURL + `users/${currentUser.id}`, configEditObject(newName))
    //         .then(resp => resp.json())
    //         .then(json => {
    //             currentUser = json
    //             renderMainPage()
    //         })
            
    //     } else if (event.target.id === "delete-user-button") {
    //         console.log(event.target.id)

    //     fetch(BASEURL + `users/${currentUser.id}`, {method: "DELETE"})
    //     .then(resp => resp.json())
    //     .then(json => {
    //         console.log(json)
    //         showEnterButton()
    //         hideEditButtons()


    //         // toggleEnterButton()
    //         // toggleEditButtons()
    //         resetLoginForm()
    //     })

    //     } else {return}
    // })
}

function hideEditButtons() {
    let editButtons = document.getElementById("form-edit-buttons")
    editButtons.style.display = "none"
}

function toggleEnterButton() {

    let button = document.getElementById("login-enter")

    if (button.style.display === "none") {
        button.style.display = "block"
    } else {
        button.style.display = "none" 
    }
}

function showEnterButton() {
    let button = document.getElementById("login-enter") 
    button.style.display = "block"
}

function hideEnterButton() {
    let button = document.getElementById("login-enter") 
    button.style.display = "none"
}

function configEditObject(name) {
    return {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            name: name
        })
    }
}

function resetLoginForm() {
    form = document.getElementById("login-form")
    form.reset()
}

function showLogin() {
    let form = document.querySelector("#login-form")
    form.style.display = "block"
}

function hideLogin() {
    let form = document.querySelector("#login-form")
    form.style.display = "none"
}

function addEditButtonEvent() {

    let editButtons = document.getElementById("form-edit-buttons")
    let editButton = document.getElementById("username-edit-button")
    let deleteButton = document.getElementById("delete-user-button")

    editButtons.addEventListener("click", event => {

        event.preventDefault()
        
        if (event.target.id === "username-edit-button") {
            let newName = event.target.parentNode.parentNode.children[1].value
            
            fetch(BASEURL + `users/${currentUser.id}`, configEditObject(newName))
            .then(resp => resp.json())
            .then(json => {
                currentUser = json
                renderMainPage()
            })
        } else if (event.target.id === "delete-user-button") {
            console.log(event.target.id)

        fetch(BASEURL + `users/${currentUser.id}`, {method: "DELETE"})
        .then(resp => resp.json())
        .then(json => {
            console.log(json)
            showEnterButton()
            hideEditButtons()
            resetWelcome()
            resetLoginForm()
        })
    }
    })
}





