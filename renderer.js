const teamCsvInput = document.querySelector("[name = 'teamCsv']")
const form = document.getElementById('teamForm')
const chooseJsonLocationButton = document.getElementById('chooseJsonLocation')
const filePathP = document.getElementById('choosenFilePath')
const homeRosterBody = document.getElementById('homeRoster')
const awayRosterBody = document.getElementById('awayRoster')
const allPlayerObjects = []

chooseJsonLocationButton.addEventListener('click', async () => {
    const filePaths= await window.dataSaving.chooseJsonLocation()
    if (filePaths[0]) {
        filePathP.innerText = filePaths[0]
    }
})

form.addEventListener('submit', (event) => {
    event.preventDefault()
    const {teamCsv, selectTeam } = event.target.elements
    const teamName = selectTeam.value
    const file = teamCsv.files[0]

    console.log(selectTeam.value)
    if (!file || !teamName) {
        alert('Select File and team name')
        return
    }


    const reader = new FileReader()
    reader.onload = (evt => {
        parseData(evt.target.result,teamName)

    })
    reader.readAsText(file)
})


const parseData = (data, team) => {
    const rowSplit = data.split('\n')
    const columnSplit = []
    const players = []
    rowSplit.forEach(row => {
        let noQuote = row.replaceAll('"', '')
        columnSplit.push(noQuote.split(','))
    });
    columnSplit.forEach(column => {
         let playerNumber = parseInt(column[0])
        if (!isNaN(playerNumber)) {
            players.push(column)
        } 
    } )
    prepareForObject(players, team)
}

const prepareForObject = (players, team) => {
    const slicedPlayers = players.map(player => player.slice(0,4))
    createObjects(slicedPlayers, team)
}

const createObjects = (objectReady, team) => {
    const playerObjects = []
    objectReady.forEach(player => {
        const [ number, name, position, grade] = player
        playerObjects.push({
            playername: `${number} ${team}`,
                number,
                name,
                position,
                grade
            })
    })
    allPlayerObjects.push(playerObjects)
    renderPlayerCards(playerObjects, team)
}






const renderPlayerCards = (players, team) => {
    let tableBody = ''
    console.log(team)
    if (team == 'away'){
        console.log('hi')
        tableBody = awayRosterBody
    } else {
        tableBody = homeRosterBody
    }
    players.forEach(player => {
        const playerId = player.playername.replaceAll(' ','')
        const playerLi = document.createElement('div')
        playerLi.innerHTML = `            <div>
        <tr>
          <th>${player.number}</th>
          <td>${player.name}</td>
          <td>${player.position}</td>
          <td>${player.grade}</td>
        </tr>
    </div>`
        playerLi.id = `${playerId}`
        tableBody.appendChild(playerLi)

    });
}
