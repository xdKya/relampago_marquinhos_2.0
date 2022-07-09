class Player {
  constructor() {
    this.name = null
    this.index = null
    this.posx = 0
    this.posy = 0
    this.rank = 0;
    this.score = 0;
    this.life = 200;
    this.fuel = 200;
  }
  getCount(){
    var countRef = database.ref("playerCount")
    countRef.on ("value",function(data){
      playerCount = data.val()
    })
  }
  updateCount(count){
    database.ref("/").update({
    playerCount:count
    })
  }
  addPlayer() {
    var playerIndex = "players/player"+this.index
    if (this.index === 1){
      this.posx = width/2 -100
    }
    else {
      this.posx = width/2 +100

    }
    database.ref(playerIndex).set({
      name: this.name,
      posx:this.posx,
      posy:this.posy,
      rank:this.rank,
      score:this.score, 
      life: this.life,
    })
  }
  static getPlayersInfo() {
    var playerInfoRef = database.ref("players");
    playerInfoRef.on("value", data => {
      allPlayers = data.val();
    });
  }
  update(){
    var playerIndex = "players/player"+this.index
    database.ref(playerIndex).update({
      posx:this.posx,
      posy:this.posy, 
      rank:this.rank,
      score:this.score, 
      life: this.life,
    })
  }
  getDistance(){
    var playerDistance=database.ref("players/player"+this.index)
    playerDistance.on("value",data=>{
      var data=data.val()
      this.posx=data.posx
      this.posy=data.posy
    })
  }
  getCarsEnd(){
    database.ref("carsEnd").on("value",data=>{
      this.rank = data.val()
    })
  }
  static updatecarsEnd(rank){
    database.ref("/").update({
      carsEnd:rank
    })
  }




}
