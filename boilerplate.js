var viewport = {width:1536, height:1024}
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
canvas.width = viewport.width
canvas.height = viewport.height
ctx.imageSmoothingEnabled = false
function resized() {
    scaleFactor = window.innerWidth/viewport.width > window.innerHeight/viewport.height ? window.innerHeight/viewport.height : window.innerWidth/viewport.width

    canvas.style.width = parseInt(viewport.width * scaleFactor) + "px"
    canvas.style.height = parseInt(viewport.height * scaleFactor) + "px"
}
resized()

function distance(tuple1, tuple2) {
    return Math.sqrt((tuple1[0] - tuple2[0])**2 + (tuple1[1] - tuple2[1])**2 + (tuple1[1] - tuple2[1])**2)
}