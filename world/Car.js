let instance = null;

export default class Car {
    constructor(p) {
        if (instance) {
            console.log("Car instance already exists")
            return instance
        }
        instance = this

        this.p = p

        this.defaultPos = p.createVector(100,150)
        this.pos = this.defaultPos.copy()
        this.vel = 0

        this.setAcc = 0.04
        this.acc = 0//this.setAcc

        this.maxVel = 3

        this.size = p.createVector(100,50)

        this.angle = 0
        this.angleVel = 0

        this.posHist = []

        this.toggleCooldown = false
    }

    reset() {
        this.acc = 0
        this.vel = 0
        this.angleVel = 0
        this.angle = 0
        this.posHist = []
        this.pos = this.defaultPos.copy()
    }

    setAngleVel(angleVel) {
        this.angleVel = angleVel
        //(Math.abs(angleVel) < 0.01) ? angleVel : angleVel/Math.abs(angleVel) * 0.1
        //this.angleVel *= this.vel/this.maxVel   
    }

    toggleCar() {
        if (this.toggleCooldown == false) {
            this.toggleCooldown = true

            this.acc = (this.acc == 0) ? this.setAcc : 0
            console.log(this.setAcc)

            setTimeout(() => {
                this.toggleCooldown = false
            }, 200)
        }
    }

    updatePath() {
        this.posHist.push(this.pos.copy())

        if (this.posHist.length > 600) {
            this.posHist.shift()
        }
    }

    update() {
        this.updatePath()
        //Position
        if (this.vel < this.maxVel && this.acc != 0) {
            this.vel += this.acc
            console.log(this.acc)
            
        } else if (this.acc == 0) {
            if (this.vel > 0) {
                this.vel -= this.setAcc/3
            } else {
                this.vel = 0
            }
        }


        this.pos.add(this.p.cos(this.p.radians(this.angle)) * this.vel, this.p.sin(this.p.radians(this.angle)) * this.vel)

        if (this.acc != 0) {    
            this.angle += this.angleVel
        }

        if (this.pos.x > this.p.windowWidth + this.size.x) {
            this.pos.x = -this.size.x
        }
    
    }

    //add path behind car
    renderPath() {
        this.p.push()

        this.p.stroke("#065a60")
        this.p.strokeWeight(2)

        for (let i=0; i<this.posHist.length-1; i++) {
            if (Math.abs(this.posHist[i].x - this.posHist[i+1].x) < 20) {
                this.p.stroke(255, 183, 3, (i/this.posHist.length)*100)
                this.p.line(this.posHist[i].x, this.posHist[i].y, this.posHist[i+1].x, this.posHist[i+1].y)
            }
        }

        this.p.pop()
    }

    renderHeading() {
        this.p.push()

        this.p.fill(255)
        this.p.strokeWeight(0)
        this.p.textSize(11);
        this.p.text("Angular Velocity: ", this.pos.x + this.size.x/2 + 6, this.pos.y)
        this.p.textSize(13);
        this.p.text(Math.floor(this.p.degrees(this.angleVel) * 100)/100 + "° /s", this.pos.x + this.size.x/2 + 6, this.pos.y + 15)
        this.p.pop()
    }

    render() {
        this.p.push()

        this.renderPath()

        this.p.stroke(140)
        this.p.strokeWeight(2)
        this.p.rectMode(this.p.CENTER)
        this.p.translate(this.pos.x, this.pos.y)
        this.p.rotate(this.p.radians(this.angle))
        this.p.fill(40)
        this.p.rect(-30,-24,-20,-20)
        this.p.rect(30,-24,20,-20)
        this.p.rect(-30,24,-20,20)
        this.p.rect(30,24,20,20)
        
        this.p.fill(70)
        this.p.rect(0,0,this.size.x,this.size.y)

        this.p.rotate(-this.p.radians(this.angle))
        this.p.translate(-this.pos.x, -this.pos.y)

        this.renderHeading()

        this.p.pop()
    }
}