const BASEURL = "http://localhost:3000/"

document.addEventListener("DOMContentLoaded", event => {
    
    form = document.querySelector("#login-form")
    form.addEventListener("submit", event => {
        event.preventDefault()

        console.log(event.target.uname.value)
        name = event.target.uname.value
        fetch(BASEURL + "/users", configPostObj(name))
        .then(resp => resp.json)
        .then(json => {
            console.log(json)
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
