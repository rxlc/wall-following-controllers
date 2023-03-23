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
  updateCSettings();
})

pButton.addEventListener("click", () => {
  world.controlMode = "Proportional"
  cCElement.innerText = world.controlMode
  updateCSettings();
})

pdButton.addEventListener("click", () => {
  world.controlMode = "Proportional Derivative"
  cCElement.innerText = world.controlMode
  updateCSettings();
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

//Settings
let maxVel = document.getElementById("maxVel")
let acc = document.getElementById("acc")

let cts = document.getElementById("cts")

if (world.car) {
  maxVel.value = world.car.maxVel
  acc.value = world.car.setAcc
}

maxVel.addEventListener("focusout", () => {
  if (isNaN(maxVel.value) || parseFloat(maxVel.value) < 0) maxVel.value = 0

  world.car.maxVel = parseFloat(maxVel.value)
  world.car.reset()
})

acc.addEventListener("focusout", () => {
  if (isNaN(acc.value) || parseFloat(acc.value) < 0) {
    acc.value = 0
  }
  
  world.car.setAcc = parseFloat(acc.value)
  world.car.reset()
})

updateCSettings();

function updateCSettings() {
  if (world.controlMode == "Proportional Derivative") {
    cts.innerHTML = 
    `
      <div class="scol">
        <input class="sinput" type="text" id="kp" placeholder="Kp"/>
        <div class="tn">Proportional Gain</div>
      </div>
      <div class="scol">
        <input class="sinput" type="text" id="kd" placeholder="Kd"/>
        <div class="tn">Derivative Gain</div>
      </div>
    `
    let kp = document.getElementById("kp")
    let kd = document.getElementById("kd")

    kp.value = world.pdConfig.pGain
    kd.value = world.pdConfig.dGain

    kp.addEventListener("focusout", () => {
      if (isNaN(kp.value) || parseFloat(kp.value) < 0) kp.value = 0
    
      world.pdConfig.pGain = parseFloat(kp.value)
      world.car.reset()
    })

    kd.addEventListener("focusout", () => {
      if (isNaN(kd.value) || parseFloat(kd.value) < 0) kd.value = 0
    
      world.pdConfig.dGain = parseFloat(kd.value)
      world.car.reset()
    })
  } else if (world.controlMode == "Proportional") {
    cts.innerHTML = 
    `
      <div class="scol">
        <input class="sinput" type="text" id="kp" placeholder="Kp"/>
        <div class="tn">Proportional Gain</div>
      </div>
    `

    let kp = document.getElementById("kp")

    kp.value = world.pConfig.pGain

    kp.addEventListener("focusout", () => {
      if (isNaN(kp.value) || parseFloat(kp.value) < 0) kp.value = 0
    
      world.pConfig.pGain = parseFloat(kp.value)
      world.car.reset()
    })
  } else if (world.controlMode == "Bang Bang") {
    cts.innerHTML = 
    `
      <div class="scol">
        <input class="sinput" type="text" id="bg" placeholder=""/>
        <div class="tn">Turn Angle</div>
      </div>
    `

    let bg = document.getElementById("bg")

    bg.value = world.bangBangConfig.turnAngle

    bg.addEventListener("focusout", () => {
      if (isNaN(bg.value) || parseFloat(bg.value) < 0) bg.value = 0
    
      world.bangBangConfig.turnAngle = parseFloat(bg.value)
      world.car.reset()
    })
  }
}


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