import p5 from "p5";
import World from "./world/World";

let p = new p5();
let world = new World(p);

let cCElement = document.getElementById("currentController")
cCElement.innerText = world.controlMode

let bangBangButton = document.getElementById("bangbang")
let pButton = document.getElementById("p")
let pdButton = document.getElementById("pd")

document.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    world.car.toggleCar()
  }
})

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



function loop() {
  p.createCanvas(p.windowWidth, p.windowHeight)
  p.background(20);
  world.update();
  world.render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);