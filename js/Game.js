class Game {
  constructor() {
    this.resetTitle = createElement("H2")
    this.resetB = createButton("")
this.liderBoard = createElement("H2")
this.leader1 = createElement("H2")
this.leader2 = createElement("H2")
this.isMoving = false
  }
showElements(){
  this.resetTitle.html("reset")
  this.resetTitle.class("resetText")
  this.resetTitle.position(width/2+200,40)
  this.resetB.class("resetButton")
  this.resetB.position(width/2+230,100)
  form.titleImg.position(40,50)
  form.titleImg.class("gameTitleAfterEffect")
this.liderBoard.html("points")
this.liderBoard.class("resetText")
this.liderBoard.position(width/3-60,40)

this.leader1.class("leadersText")
this.leader1.position(width/3-50,80)

this.leader2.class("leadersText")
this.leader2.position(width/3-50,130)
}
  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount()

    car1 = createSprite(width/2 -50,height -100)
    car1.addImage("car1",car1img)
    car1.scale = 0.07

    car2 = createSprite(width/2 +50,height -100)
    car2.addImage("car2",car2img)
    car2.scale = 0.07
    cars = [car1,car2]
    
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];







    fuels = new Group()
    coins = new Group()
    obstacles = new Group()

    this.addsprites(fuels,10,fuelImg,0.02)
    this.addsprites(coins,20,coinImg,0.09)
    this.addsprites(obstacles,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions)
  }
  play(){
    form.hide()
    Player.getPlayersInfo()
    player.getCarsEnd();
    this.showElements();
    this.reset();
    if(allPlayers!==undefined) {
      image(track,0,-height*5,width,height*6)
      
     this.showLeaderboard()
     this.showLife()
     this.showFuelBar()

      var index=0
      for (var plr in allPlayers){
        index = index+1
        var x= allPlayers[plr].posx
        var y= height-allPlayers[plr].posy
        
        cars[index-1].position.x = x
        cars[index-1].position.y = y

        if(index===player.index){
        camera.position.y=cars[index-1].position.y
        camera.position.x=cars[index-1].position.x

        this.addFuel(index)
        this.addcoins(index)

        }
      }
      if(this.isMoving){
        player.posy +=5
        player.update()
      }
       this.controls()

       const finish = height*6-100
       
       if (player.posy>finish){
        gameState = 2
        player.rank +=1
        Player.updatecarsEnd(player.rank)
        player.update()
        this.showRank()
       }

       drawSprites()
    }
  }
  getState(){
    var stateRef = database.ref("gameState")
    stateRef.on ("value",function(data){
      gameState = data.val()
    })
  }
  update(state){
    database.ref("/").update({
    gameState:state
    })
  }
 controls (){

  if(keyIsDown(UP_ARROW)){
    player.posy+=10
    player.update()
    this.isMoving = true
  }
  if(keyIsDown(LEFT_ARROW)&&player.posx>width/3-50){
    player.posx-=5
    player.update()
  }
  if(keyIsDown(RIGHT_ARROW)&&player.posx<width/2+300){
    player.posx+=5
    player.update()
  }
}
reset(){
  this.resetB.mousePressed(()=>{
    database.ref("/").set({
      carsEnd:0,
    playerCount:0,
    gameState:0,
    players:{}
    })
    location.reload()
  })
}
showLeaderboard() {
  var leader1, leader2;
  var players = Object.values(allPlayers);
  if (
    (players[0].rank === 0 && players[1].rank === 0) ||
    players[0].rank === 1
  ) {
    // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
    leader1 =
      players[0].rank +
      "&emsp;" +
      players[0].name +
      "&emsp;" +
      players[0].score;

    leader2 =
      players[1].rank +
      "&emsp;" +
      players[1].name +
      "&emsp;" +
      players[1].score;
  }

  if (players[1].rank === 1) {
    leader1 =
      players[1].rank +
      "&emsp;" +
      players[1].name +
      "&emsp;" +
      players[1].score;

    leader2 =
      players[0].rank +
      "&emsp;" +
      players[0].name +
      "&emsp;" +
      players[0].score;
  }

  this.leader1.html(leader1);
  this.leader2.html(leader2);
}
 addsprites (spriteGroup,number,image,scale,positions = []){
  for(var i=0;i<number;i++){
    var x, y
    
   if(positions.length>0){
    x = positions[i].x
    y = positions[i].y
    image = positions [i].image
   }
   else{
    x = random(width/2+150,width/2-150)
    y = random(-height*4.5,height-400)
   }
   
    var sprite = createSprite(x,y)
    sprite.addImage("sprite",image)
    sprite.scale = scale 
    spriteGroup.add(sprite)

  }
 }
 addFuel (index){
  cars[index-1].overlap(fuels,function(coletor,coletavel){
    player.fuel = 200
    coletavel.remove()
  })
  if(player.fuel>0&&this.isMoving){
    player.fuel-=1
  }
  if(player.fuel<=0){
    gameState = 2
    this.gameOver()
  }
 }

 addcoins (index){
  cars[index-1].overlap(coins,function(coletor,coletavel){
    player.score+= 10
    player.update()
    coletavel.remove()
  })
 }
showRank(){
  swal({
    title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
    text: "Você alcançou a linha de chegada com sucesso!",
    imageUrl:
      "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
    imageSize: "100x100",
    confirmButtonText: "Ok"
  });
}
showLife (){
  push();
  image(lifeImg, width / 2 - 130, height - player.posy - 400, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.posy - 400, 200, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.posy - 400, player.life, 20);
    noStroke();
    pop();

}
showFuelBar() {
  push();
  image(fuelImg, width / 2 - 130, height - player.posy - 300, 20, 20);
  fill("white");
  rect(width / 2 - 100, height - player.posy - 300, 200, 20);
  fill("#ffc400");
  rect(width / 2 - 100, height - player.posy - 300, player.fuel, 20);
  noStroke();
  pop();
}

gameOver() {
  swal({
    title: `Fim de Jogo`,
    text: "Oops você perdeu a corrida!",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
    imageSize: "100x100",
    confirmButtonText: "Obrigado por jogar"
  });
}

}
