let packet = require('../network/packet');
let monitor = require('../server').monitor;
let AOIamount = 10; // ช่วงระยะห่างระหว่าง Client ที่จะรับข้อมูล
// let monitor = console;
class World {
    constructor() {
        this.remotes = []
        this.responseTime = 100;
        this.responseTimer = undefined;
        this.responseDatas = [];
        /* Response data 
        uid : user id,        
        location : position(x,y) & currentMap,
        HP : health point,
        SP : Stamina point,
        Level : level,
        Gender: gender,
        equipment : Head & Weapon & Body
        */
        // static
        // characterName : character name, Job : job,
    }

    addRemote(remote) {
        let playerInWorld = [];
        this.remotes.forEach((otherRemote) => { // stored players that already in world to playerInWorld array
            if (otherRemote.location.map === remote.location.map) { // if in same map
                let character = otherRemote.character;
                playerInWorld.push({
                    "uid": otherRemote.userdata._id,
                    "CharacterName": character.Name,
                    "Location": character.Location,
                    "HP": character.Status.HP,
                    "SP": character.Status.SP,
                    "Job": character.Status.Job,
                    "Level": character.Status.Level,
                    "Equipment": character.Status.Equipment
                })
            }
        })
        remote.send(packet.make_multiplayer_in_same_map(playerInWorld)); // send playerInWorld to the client who just enter
        this.remotes.push(remote) // add this client to retmoes
        // may delete (not check same map)
        // monitor.log(JSON.stringify(remote.character));
        this.broadcastExcept(remote, packet.make_multiplayer_connect(remote.userdata._id, remote.character));
    }

    removeRemote(remote) {
        var indexOfRemote = this.remotes.indexOf(remote);
        if (indexOfRemote > -1) {
            this.remotes.splice(indexOfRemote, 1);
            this.broadcast(packet.make_multiplayer_disconnect(remote.userdata._id));
        }
    }

    broadcast(data) {
        this.remotes.forEach((remote) => {
            remote.send(data)
        })
    }

    broadcastExcept(exceptRemote, data) {
        this.remotes.forEach((remote) => {
            if (remote == exceptRemote) return
            remote.send(data)
        })
    }

    addPlayerDataToQueue(data) {
        let indexOfExistData = this.responseDatas.findIndex((dataSet) => { return dataSet.uid == data.uid });
        if (indexOfExistData > -1) {
            this.responseDatas.splice(indexOfExistData, 1, data);
        } else {
            this.responseDatas.push(data)
        }
    }

    countPlayer() {
        return this.remotes.length;
    }

    startQueueResponse() {
        this.responseTimer = setInterval(() => {
            if (this.countPlayer() > 0) {
                // Broadcast data to client
                // this.broadcast(packet.make_multiplayer_control(this.responseDatas));
                // monitor.log("Broadcast queue to " + this.countPlayer() +" clients");
                // monitor.log("With data "+this.responseDatas.length+" sets");
                // ---------------- Old not AOI -------------------
                // ---------------- AOI (Area of Interest) --------
                this.remotes.forEach((remote) => { // for All remote in world
                    let position = remote.location.position; // get remote's current position;
                    let dataToSend = [];
                    this.responseDatas.forEach((otherPlayerData) => { // for All response data
                        // if (Math.abs(position.x - data.position.x) <= AOIamount) { //Check if in distance
                        //     tempDatas.push(data); // Add data that in distance to tempData;
                        // } else {//not in distance
                        // }
                        if (otherPlayerData.map === remote.location.map) { // if otherPlayer in same map
                            dataToSend.push(otherPlayerData);
                        }
                    });
                    remote.send(packet.make_multiplayer_control(dataToSend)); // send temp data to remote
                })
                // ---------------- AOI (Area of Interest) --------
                this.responseDatas = [];
            } else {
                // console.log("[World] No one in this world");
            }
        }, this.responseTime);
    }
    stopQueueResponse() {
        clearInterval(this.responseTimer);
    }
}

module.exports = World
