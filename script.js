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

const seed = Math.random()*10000
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
                newInterval.push(interval + (Math.random()*1)-0.5)
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
        lastGen.forEach((bird) => {
            total += bird[1]
        })
        graph.push(total/lastGen.length)
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
    graph.forEach((point) => {
        if (point > max) {
            max = point
        }
    })
    ctx.fillStyle = "white"
    ctx.fillRect(game.width, 0, canvas.width - game.width, canvas.height)
    ctx.beginPath()
    graph.forEach((point, index) => {
        ctx.lineTo(50 + (index*10)*(canvas.width - game.width - 100)/(10*(graph.length - 1)) + game.width, canvas.height*0.75 - (point)*canvas.height/2/max)
        ctx.moveTo(50 + (index*10)*(canvas.width - game.width - 100)/(10*(graph.length - 1)) + game.width, canvas.height*0.75 - (point)*canvas.height/2/max)
    })
    ctx.moveTo(10 + (0*10)*(canvas.width - game.width - 20)/(10*graph.length) + game.width, canvas.height/2 - graph[0])
    ctx.closePath()
    ctx.strokeStyle = "gray"
    ctx.lineWidth = 5
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
    ctx.fillText("y: Mean Score of Generation", game.width + 75, 70)
    ctx.fillStyle = "black"
    graph.forEach((point, index) => {
        ctx.fillRect(50 + (index*10)*(canvas.width - game.width - 100)/(10*(graph.length - 1)) + game.width - 5, canvas.height*0.75 - (point)*canvas.height/2/max - 5, 10, 10)
    })
}
  
animate()