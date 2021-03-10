var dog,sadDog,happyDog;
var foodS, foodStock;
var fedTime, lastFed;
var feed, addFood;
var foodObj;
var database;

function preload(){
  sadDog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");
}

function setup() {
  createCanvas(1000,400);

  database = firebase.database();

  foodObj = new Food();
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feed = createButton("FEED THE DOG");
  feed.position(500, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("ADD FOOD");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);

  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed >= 12){
    text("Last Feed : "+ lastFed%12 + "PM", 350, 95);

  }else if(lastFed == 0){
    text("Last Feed : 12 AM", 350, 95);
  }else{
    text("Last Feed : "+ lastFed + "AM", 350, 95)
  }


  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.deductFood(foodS);

  if(foodObj.getFoodStock() <= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock() + 0);
  }
  else{
    foodObj.getFoodStock(foodObj.getFoodStock() - 1);
    database.ref('/').update({
      Food: foodObj.getFoodStock(),
      FeedTime : hour()
    })
  }
 }



//function to add food in stock
function addFoods()
{

  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}