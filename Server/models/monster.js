let monitor = require('../server').monitor;

class Monster {
    constructor() {
        this.ID = 1;
        this.monsterID = 10004; 
        this.Status = {
            Name: "สามล้อคลั่ง",
            HP: 100,
            MaxHP: 100,
            DEF: 5,
            EXP: 10,
            Level: 1,
            MovementSpeed: 1,
            State: "Idle"
        }

        this.Location = {
            TargetPosition: { x: 0},
            CurrentPosition: { x: 0,y:0}, //Use client physic for real
            Map: "Bangkok"
        };
        this.movingInterval = undefined;
        this.TargetPlayer = undefined;
        this.normalMoving();
        this.ItemPool = [10000, 10002];
        //send monsterData to client
    }

    goToTarget() {
        this.movingInterval = setInterval(() => {
            if (findDistance(this.Location.CurrentPosition.x, this.Location.TargetPosition.x)
                > 1) {
                this.Status.State = "Moving";
                monitor.log("Monster state : Moving");
                let moveValue = (findDirection(this.Location.CurrentPosition.x, this.Location.TargetPosition.x)
                    * this.Status.MovementSpeed)* (90/1000);
                this.Location.CurrentPosition.x += moveValue;
                monitor.log(this.Location.CurrentPosition.x);
                //send data to temp
            } else {
                //we reach the target
                this.Status.State = "Idle";
                monitor.log("Monster state : Idle");
                clearInterval(this.movingInterval);
                this.normalMoving();
            }
        }, 90);
    }

    setTargetPosition(x) {
        clearInterval(this.movingInterval);
        this.Location.TargetPosition.x += x;
        this.goToTarget();
    }

    stopMoving() {
        clearInterval(this.movingInterval);
    }

    hurt(damage) {
        damage -= this.Status.DEF;
        this.Status.HP -= damage > 0 ? damage : 1;
        //send to client this monster was hurt

    }

    normalMoving() {
        setTimeout(() => {
            let movingValue = Math.random()*8;
            movingValue *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
            this.setTargetPosition(movingValue);
        }, ((Math.random() * 5) + 3)*1000);
    }
}

findDirection = (x1, x2) => {
    return x1 < x2 ? 1 : -1;
}
findDistance = (x1, x2) => {
    return Math.abs(x1 - x2)
}
module.exports = Monster;

