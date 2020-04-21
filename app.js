new Vue({
    el: "#app",
    data: {
        playerHealth: 100,
        monsterHealth: 100,
        skill: {
            specialAttackSkill: 0,
            healSkill: 0,
        },
        isRunning: false,
        logs: []
    },
    computed: {
        healCooldownStatus: function() {
            var cooldown = this.skill.healSkill
            return cooldown === 0 ? "" : `(${cooldown} turn left)`
        },
        specicalAttackCooldownStatus: function () {
            var cooldown = this.skill.specialAttackSkill
            return cooldown === 0 ? "" : `(${cooldown} turn left)`
        }
    },
    methods: {
        monsterAttack: function(damage) {
            this.playerHealth -= damage
            this.logs.unshift({
                message: `Monster deals ${damage} to player`,
                player: false
            })
        },
        setCooldownSKill: function (skillname,cooldown) {
            this.skill[skillname] = cooldown
        },
        counterCooldownSkill: function() {
            for(let key in this.skill) {
                if (this.skill[key] > 0) this.skill[key] -= 1
            }
        },
        checkSkill: function(skillname) {
            return this.skill[skillname] === 0
        },
        checkWin: function() {
            let message
            if(this.monsterHealth <= 0 && this.playerHealth <= 0){
                message = "Draw ! New game ?"
            } else if (this.monsterHealth <= 0) {
                message = "You win ! New game ?"          
            } else if (this.playerHealth <= 0) {
                message = "You lose ! New game ?"
            }
            if(!message) {
                return false
            } else if (confirm(message)) {
                this.startNewGame()
            } else {
                this.isRunning = false
            }
            return true
        },
        getIntRandom: function(max, min) {
            return Math.floor(Math.random() * (max - min) + min)
        },
        startNewGame: function() {
            this.isRunning = true,
            this.playerHealth = 100,
            this.monsterHealth = 100,
            this.skill = {
                specialAttackSkill: 0,
                healSkill: 0
            }
            this.logs = [
                {
                    message: "Game started",
                    player: null
                }
            ]
        },
        attackAction: function() {
            var monsterAttackDamage = this.getIntRandom(10, 5) + 5
            var playerAttackDamage = this.getIntRandom(10, 5)
            this.monsterAttack(monsterAttackDamage)
            this.monsterHealth -= playerAttackDamage
            this.logs.unshift({
                message: `Player deals ${playerAttackDamage} to monster`,
                player: true
            })
            if(!this.checkWin()) {
                this.counterCooldownSkill()
            }
        },
        specialAttackAction: function() {
            if (this.checkSkill("specialAttackSkill")) {
                var monsterAttackDamage = this.getIntRandom(10, 5) + 5
                var playerAttackDamage = this.getIntRandom(10, 5)*2
                this.monsterAttack(monsterAttackDamage)
                this.monsterHealth -= playerAttackDamage
                this.logs.unshift({
                    message: `Player deals ${playerAttackDamage} to monster`,
                    player: true
                })
                if (!this.checkWin()) {
                    this.counterCooldownSkill()
                    this.setCooldownSKill("specialAttackSkill", 4)
                }
            }
        },
        healAction: function() {
            if (this.checkSkill("healSkill")) {
                var monsterAttackDamage = this.getIntRandom(10, 5) + 5
                var playerHeal = this.getIntRandom(10, 5) * 3
                this.monsterAttack(monsterAttackDamage)
                this.playerHealth = Math.min(this.playerHealth + playerHeal,100)
                this.logs.unshift({
                    message: `Player heal ${playerHeal}`,
                    player: true
                })
                if (!this.checkWin()) {
                    this.counterCooldownSkill()
                    this.setCooldownSKill("healSkill", 4)
                }
            }
        },
        giveUpAction: function() {
            this.isRunning = false
        }
    },
})