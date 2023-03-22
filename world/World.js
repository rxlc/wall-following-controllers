import Car from './Car'
import noise from 'noisejs';

let instance = null;

export default class World {
    constructor(p) {
        if (instance) {
            console.log("World instance already exists")
            return instance
        }
        instance = this

        this.p = p
        this.car = new Car(p)

        this.path = []
        this.setPathStraight();

        this.error = 0

        this.bangBangConfig = {
            turnAngle: 10
        }
        
        this.elapsed = 0;

        this.pdConfig = {
            pGain: 1,
            dGain: 0.3
        }

        this.pConfig = {
            pGain: 0.1
        }

        this.controlMode = "Bang Bang"
    }

    setPathStraight() {
        this.path = []

        let y = Math.floor(Math.random() * 50) + 200 

        for (let i=0; i<=this.p.windowWidth; i+=1) {
            this.path.push(y)
        }
    }

    setPathCurved() {
        this.path = []
        
        let noiseFrequency = 610; 
        let noiseScale = 0.003; 
        let noiseSeed = Math.floor(Math.random() * 100); 

        let setY = Math.floor(Math.random() * 100) + 250 

        const noiseObj = new noise.Noise(noiseSeed);

        for (let i=0; i <= this.p.windowWidth; i++) {
            let y = setY;
            let noiseValue = noiseObj.perlin2(i * noiseScale, 0) * noiseFrequency;
            y += noiseValue;
            this.path.push(y);
        }
    }

    bangBang() {
        if (this.error > 0) {
            this.car.setAngleVel(this.p.radians(-this.bangBangConfig.turnAngle))
        } else {
            this.car.setAngleVel(this.p.radians(this.bangBangConfig.turnAngle))
        }
    }

    proportional() {
        this.car.setAngleVel(this.p.radians(-this.pConfig.pGain * this.error))
    }

    pd() {
        this.elapsed += 0.05;
        
        if (this.car.vel != 0 & this.car.acc != 0) {
            this.car.setAngleVel(-(this.pdConfig.dGain * this.car.angle) - ((this.pdConfig.pGain * this.error)/this.car.maxVel) - (this.elapsed*this.error))
        }
    }

    renderGrids() {
        this.p.push()

        this.p.stroke(60)
        this.p.strokeWeight(2)

        for (let i=0; i<this.p.windowWidth; i+=100) {
            this.p.line(i,0,i,this.p.windowHeight)
        }

        for (let i=0; i<this.p.windowHeight; i+=100) {
            this.p.line(0,i,this.p.windowWidth,i)
        }

        this.p.pop()
    }

    renderSetPath() {
        this.p.push()

        this.p.stroke("#065a60")
        this.p.strokeWeight(2)
        for (let i=0; i<this.path.length; i++) {
            this.p.line(i,this.path[i],i+1, this.path[i+1])
        }

        this.p.pop()
    }

    renderErrorLine() {
        this.p.push()

        this.p.stroke("#8ac926")
        this.p.strokeWeight(2)
        this.p.line(this.car.pos.x - 2, this.car.pos.y, this.car.pos.x + 2, this.car.pos.y)
        this.p.line(this.car.pos.x - 2, this.path[Math.floor(this.car.pos.x)], this.car.pos.x + 2, this.path[Math.floor(this.car.pos.x)])
        this.p.line(this.car.pos.x, this.car.pos.y, this.car.pos.x, this.path[Math.floor(this.car.pos.x)])

        this.p.textSize(9)
        this.p.fill(255)
        this.p.strokeWeight(0)
        this.p.text("Error: ", this.car.pos.x + 8, (this.car.pos.y + this.path[Math.floor(this.car.pos.x)])/2 - 12)
        this.p.textSize(12)
        this.p.text(Math.floor(this.error*100)/100 + "m", this.car.pos.x + 8, (this.car.pos.y + this.path[Math.floor(this.car.pos.x)])/2)

        this.p.pop()
    }

    update() {
        if (this.car.pos.x > 0 && this.car.pos.x < this.path.length) {
            this.error = this.car.pos.y - this.path[Math.floor(this.car.pos.x)]
        }
        if (this.controlMode == "Bang Bang") this.bangBang()
        if (this.controlMode == "Proportional Derivative") this.pd()
        if (this.controlMode == "Proportional") this.proportional()
        
        this.car.update()
    }

    render() {
        this.renderGrids()
        this.renderSetPath()

        this.car.render()

        this.renderErrorLine()

        this.p.fill(255)
        this.p.textSize(12)
        this.p.text("Frame rate:" + Math.floor(this.p.frameRate()), 10, 25)
    }
}
