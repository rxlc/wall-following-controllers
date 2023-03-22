import p5 from "p5";
import World from "./world/World";

let p = new p5();
let world = new World(p);

//Controllers
let cCElement = document.getElementById("currentController")
cCElement.innerText = world.controlMode

let bangBangButton = document.getElementById("bangbang")
let pButton = document.getElementById("p")
let pdButton = document.getElementById("pd")

bangBangButton.addEventListener("click", () => {
  world.controlMode = "Bang Bang"
  cCElement.innerText = world.controlMode
})

pButton.addEventListener("click", () => {
  world.controlMode = "Proportional"
  cCElement.innerText = world.controlMode
})

pdButton.addEventListener("click", () => {
  world.controlMode = "Proportional Derivative"
  cCElement.innerText = world.controlMode
})

//Stats
let positionX = document.getElementById("positionX")
let positionY = document.getElementById("positionY")
let velocity = document.getElementById("velocity")
let heading = document.getElementById("heading")
let angularVel = document.getElementById("angularVelocity")
let error = document.getElementById("error")

function updateDashboard() {
  if (world.car) {
    positionX.innerText = `${Math.floor(world.car.pos.x)}`
    positionY.innerText = `${Math.floor(world.car.pos.y)}`
    velocity.innerText = `${Math.floor(world.car.vel * 100)/100}`
    heading.innerText = `${Math.floor(world.car.angle * 10)/10}°`
    angularVel.innerText = `${Math.floor(world.car.angleVel * 100)/100}°/s`
    error.innerText = `${Math.floor(world.error * 100)/100}`
  }
}

//Dashboard
let start = document.getElementById("start")
let stop = document.getElementById("stop")
let straight = document.getElementById("straight")
let curved = document.getElementById("curved")

let reset = document.getElementById("reset")

reset.addEventListener("click", () => {
  world.car.reset()
})

start.addEventListener("click", () => {
  if (world.car.acc == 0) {
    world.car.toggleCar()
  }
});

stop.addEventListener("click", () => {
  if (world.car.acc != 0) {
    world.car.toggleCar()
  }
});

straight.addEventListener("click", () => {
  world.setPathStraight()
})

curved.addEventListener("click", () => {
  world.setPathCurved()
})


document.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    world.car.toggleCar()
  }
})


p.createCanvas(100,100);

function loop() {
  updateDashboard()

  p.resizeCanvas(p.windowWidth, p.windowHeight)
  p.background(20);
  world.update();
  world.render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);