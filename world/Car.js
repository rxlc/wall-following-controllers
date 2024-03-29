let instance = null;

export default class Car {
    constructor(p, pmRatio) {
        if (instance) {
            console.log("Car instance already exists")
            return instance
        }

        this.pmRatio = pmRatio

        instance = this

        this.p = p

        this.defaultPos = p.createVector(100,150)
        this.pos = this.defaultPos.copy()
        this.vel = 0

        this.mSetAcc = 0.8
        this.setAcc = this.mSetAcc * this.pmRatio
        this.acc = 0//this.setAcc

        this.mMaxVel = 2
        this.maxVel = this.mMaxVel * this.pmRatio

        this.size = p.createVector(100,50)

        this.angle = 0
        this.angleVel = 0

        this.posHist = []

        this.toggleCooldown = false

        this.m = {
            pos: this.defaultPos.copy(),
            vel: 0,
            acc: 0
        }
    }

    updateM() {
        this.setAcc = this.mSetAcc * this.pmRatio
        this.maxVel = this.mMaxVel * this.pmRatio
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

    setAngle(angle) {
        this.angle = angle
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

        this.m.pos = this.pos.copy().div(this.pmRatio) 
        this.m.vel = this.vel/this.pmRatio


        //Position
        if (this.vel < this.maxVel && this.acc != 0) {
            this.vel += this.acc * (1/this.p.frameRate())
            
        } else if (this.acc == 0) {
            if (this.vel > 0) {
                this.vel -= this.setAcc * (1/this.p.frameRate())/3
            } else {
                this.vel = 0
            }
        }

        this.pos.add(this.p.cos(this.p.radians(this.angle)) * this.vel * (1/this.p.frameRate()), this.p.sin(this.p.radians(this.angle)) * this.vel * (1/this.p.frameRate()))

        if (this.acc != 0) {    
            this.angle += this.angleVel * (1/this.p.frameRate())
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
        this.p.text(Math.floor(this.angleVel * 100)/100 + "° /s", this.pos.x + this.size.x/2 + 6, this.pos.y + 15)
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
