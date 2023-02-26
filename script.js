up = false
window.addEventListener("keydown", (e) => {
    if ((e.key == " " || e.key == "ArrowUp" || e.key == "w") && !up) {
        flap = true
        up = true
    }
})
window.addEventListener("keyup", (e) => {
    if ((e.key == " " || e.key == "ArrowUp" || e.key == "w")) { 
        up = false
    }
})

const seed = Math.floor(Math.random()*10000)
var last = seed
function middleRand() {
    last *= last
    last = Math.floor((last % 10**6)/10**2)
    return last/10000
}

generationSize = 10000
cutoffPercentage = 0.0001
function mutateGeneration(list) {
    newGen = []
    list.forEach((bird) => {
        for (i=0;i<generationSize/list.length;i++) {
            newInterval = []
            bird[0].forEach((interval) =>{
                newInterval.push(interval + (Math.random()*10)-5)
            })
            newInterval.sort((a, b) => {
                return a - b
            })
            newGen.push([game.height/2, newInterval, 0, 0, Math.random()*55 + 200])
        }
    })

    return newGen
}

var game = {width:768, height:1024}
var players = []
var lastGen = []
for (let i=0;i<generationSize;i++) {
    // y-value, steps, timer, step index
    players.push([game.height/2, [0], 0, 0, Math.random()*55 + 200])
}
var globalX = 0
var score = 0
var obstacles = []
var frame = 0
var dead = false
var currentObstacle = false
var currentIndex = 0
var graph = []
function animate() {
    requestAnimationFrame(animate)

    ctx.fillStyle = "lightblue"
    ctx.fillRect(0, 0, game.width, game.height)  

    currentObstacle = false
    for (i=0;i<obstacles.length;i++) {
        obstacle = obstacles[i]
        if (globalX >= obstacle[0] - 100 && globalX <= obstacle[0] + 100) {
            currentObstacle = obstacle
            currentIndex = i
            break
        }   
    }
    players.forEach((player, index) => {
        // bird
        ctx.fillStyle = `rgb(${player[4]}, ${player[4]}, 100)`
        ctx.fillRect(game.width/2 - 50, player[0] - 50, 100, 100)

        if ((currentObstacle && (player[0] < currentObstacle[1] + 50  || player[0] > currentObstacle[1] + 200)) || player[0] > game.height + 50) {
            lastGen.push([player[1], (player[0] > game.height + 50 ? score/2 : score)])
            players.splice(index, 1)
        }

        // flapping
        if (Math.abs(frame - player[1][player[3]]) <= 1) {
            player[0] -= player[2]*10
            player[2] += 0.1
            if (player[2] >= 1) {
                player[2] = 0
            }
            player[1].push(player[1][player[3]] + Math.random()*5)
            player[3]++
        } else {
            player[0] += 2.45
        }
    })
    score++

    if (players.length == 0) {
        total = 0
        max = 0
        lastGen.forEach((bird) => {
            total += bird[1]
            if (bird[1] > max) {
                max = bird[1]
            }
        })
        graph.push([total/lastGen.length, max])
        lastGen.sort((a, b) => {
            return b[1] - a[1]
        })
        players = mutateGeneration(lastGen.slice(0, cutoffPercentage*generationSize))
        lastGen = []
        globalX = 0
        obstacles = []
        last = seed
        frame = 0
        score = 0
    }

    obstacles.forEach((obstacle, index) => {
        ctx.fillStyle = "green"
        // draw pipes
        ctx.fillRect(obstacle[0] - globalX - 50 + game.width/2, 0, 100, obstacle[1])
        ctx.fillRect(obstacle[0] - globalX - 50 + game.width/2, obstacle[1] + 250, 100, game.height)
        
        // cull pipes
        if (obstacle[0] < globalX - game.width/2 - 50) {
            obstacles.splice(index, 1)
        }
    })

    // side-scroll
    globalX += 10

    // pipe spawning
    if (frame % 100 == 0) {
        obstacles.push([globalX + game.width/2 + 50, middleRand()*500 + 250])
    }
    frame++

    ctx.font = "50px Arial"
    ctx.fillStyle = "black"
    ctx.fillText(Math.floor(score/10), 50, 100)

    max = 0
    graph.forEach((set) => {
        if (set[1] > max) {
            max = set[1]
        }
    })
    ctx.fillStyle = "white"
    ctx.fillRect(game.width, 0, canvas.width - game.width, canvas.height)
    ctx.beginPath()
    graph.forEach((set, index) => {
        point = set[0]
        ctx.lineTo(50 + (index*10)*(canvas.width - game.width - 100)/(10*(graph.length - 1)) + game.width, canvas.height*0.75 - (point)*canvas.height/2/max)
        ctx.moveTo(50 + (index*10)*(canvas.width - game.width - 100)/(10*(graph.length - 1)) + game.width, canvas.height*0.75 - (point)*canvas.height/2/max)
    })
    ctx.closePath()
    ctx.strokeStyle = "gray"
    ctx.lineWidth = 5
    ctx.stroke()
    ctx.beginPath()
    graph.forEach((set, index) => {
        point = set[1]
        ctx.lineTo(50 + (index*10)*(canvas.width - game.width - 100)/(10*(graph.length - 1)) + game.width, canvas.height*0.75 - (point)*canvas.height/2/max)
        ctx.moveTo(50 + (index*10)*(canvas.width - game.width - 100)/(10*(graph.length - 1)) + game.width, canvas.height*0.75 - (point)*canvas.height/2/max)
    })
    ctx.closePath()
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(canvas.width - 50, canvas.height - 150)
    ctx.lineTo(game.width + 50, canvas.height - 150)
    ctx.moveTo(game.width + 50, canvas.height - 150)
    ctx.lineTo(game.width + 50, 50)
    ctx.closePath()
    ctx.stroke()
    ctx.fillStyle = "gray"
    ctx.font = "25px Arial"
    ctx.fillText("x: Generation", game.width + 50, canvas.height - 115)
    ctx.fillStyle = "red"
    ctx.fillText("Mean Score of Generation", game.width + 105, 70)
    ctx.fillRect(game.width + 70, 50, 20, 20)
    ctx.fillStyle = "blue"
    ctx.fillText("Highest Score of Generation", game.width + 105, 100)
    ctx.beginPath()
    ctx.arc(game.width + 80, 90, 10, 0, 2*Math.PI)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = "gray"
    ctx.fillText(`Seed: ${seed}`, game.width + 50, canvas.height - 75)
    ctx.fillText(`Generation Size: ${players.length}`, game.width + 50, canvas.height - 35)
    ctx.fillText(`[Generation ${graph.length + 1}]`, game.width + 250, canvas.height - 115)
    graph.forEach((set, index) => {
        point = set[0]
        point2 = set[1]
        ctx.fillStyle = "red"
        ctx.fillRect(50 + (index*10)*(canvas.width - game.width - 100)/(10*(graph.length - 1)) + game.width - 10, canvas.height*0.75 - (point)*canvas.height/2/max - 10, 20, 20)
        ctx.fillStyle = "blue"
        ctx.beginPath()
        ctx.arc(50 + (index*10)*(canvas.width - game.width - 100)/(10*(graph.length - 1)) + game.width , canvas.height*0.75 - (point2)*canvas.height/2/max, 10, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fill()
    })
}
  
animate()