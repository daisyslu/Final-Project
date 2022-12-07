//define the function that was used in HTML
let x = document.getElementById("newsection");
function myFunction(){
    //console.log('clicked');
    x.style.display = "block";
    x.scrollIntoView({behavior: "smooth"});
}

//when the button is clicked
let button = document.querySelector(".enterbutton");
button.addEventListener("click", function(){

//get the input city name and show it on the page
let city = document.getElementById("location").value;
//console.log(city);
document.getElementById("city").innerHTML = city;

//and also fetch the weather API 
fetch("https://api.openweathermap.org/data/2.5/weather?q="
    + city + "&appid=" + "077649c13e52b5e301962d467a03a4c6" + "&units=metric")
.then(response =>{
    //console.log(response);
    return (response.json());
})
.then(data => {
  //console.log(data);
  let name = document.getElementById("name").value;
  let mood = document.getElementById("mood").value;
  //get & define the weather and temp info from the weather API
  let temp = data.main.temp + "°C";
  let weather = data.weather[0].description;
  //define a obj that contains all the info wanted to be stored in the database
  let obj = {
    name: name,
    location: city,
    temperature: temp,
    weather: weather,
    mood: mood,
  }
  //fetch to route and request of type POST to send info to the server
  fetch("/messages", {
    method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify(obj),
  })
  .then(response =>{
    return(response.json());
  })
  .then(info => {
    console.log(info);
  })
  //show weather & temp on the page
    let tempPar = document.getElementById('temp');
    tempPar.innerHTML = temp;
    let weatherPar = document.getElementById('weather');
    weatherPar.innerHTML = weather;
})
})

//implement p5 sketches
let noiseY;
let noiseSpeed = 0.01;
let noiseHeight = 20;
let bubbles = [];

//*----------below is p5 code ----------------*//
function setup() {
  var cnv = createCanvas(windowWidth,780);
  noiseY = height * 3 / 4;
  cnv.parent('newsection');
  cnv.style('display', 'block');
  for (let i = 0; i < 20; i++) {
    let bubble = new Bubble(random(width), random(0, 1/2*height), 
    random(2), random(2), random(30,60));
    bubbles.push(bubble)
  }
}

function windowResized() {
    resizeCanvas(windowWidth,height);
}

function draw() {
  background(255);
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  textFont('Helvetica');
  text('Pick A Balloon!', width/2, height*1/3);
  for (let j = 0; j < 4; j++) {
    let offsetY = j * 100;
    noFill();
    stroke(0, 0, 255, 60);
    strokeWeight(height *1/2);
    beginShape();
    curveVertex(0, height *1/2);
    for (let i = 0; i < width; i += 50) {
      let y = noise(frameCount * noiseSpeed + i + j) * noiseHeight + noiseY + offsetY;
      curveVertex(i, y);
    }
    curveVertex(width, height *1/2);
    endShape(LINES);
  }
  
  let weatherinfo = document.getElementById('weather').innerHTML;
  if (weatherinfo == 'few clouds' || weatherinfo == 'broken clouds'){
    fill(200, 200, 0, 50); 
  }
  else if (weatherinfo === 'clear sky'){
    fill(200, 0, 0, 50);
  }
  else if (weatherinfo == 'overcast clouds' || weatherinfo == 'mist' 
  || weatherinfo.includes('rain') || weatherinfo.includes('drizzle')){
    fill(100, 50);
  } 
  else {
    fill(0, 200, 200, 50);
  }
  noStroke();
  
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].display();
    bubbles[i].bounce();
    bubbles[i].move();
  }
}

class Bubble {
  constructor(x,y,xs,ys,size) {
    this.x = x;
    this.y = y;
    this.xspeed = xs;
    this.yspeed = ys;
    this.size = size;
  }
  
  display() {
    circle(this.x, this.y, this.size);
  }
  
  move() {
    this.x += this.xspeed;
    this.y += this.yspeed;
  }
  bounce() {
    if (this.x > width || this.x < 0) {
      this.xspeed *= -1;
    }
    if (this.y > 1/2*height || this.y < 0) {
      this.yspeed *= -1;
    }
  }
}

//show a random database entry when clicking the balloon
x.addEventListener("click", () => {
  document.getElementById("text").style.display = "block";
  //get info on all the data we've had so far
  fetch('/data')
  .then(res => res.json())
  .then(data => {
          //console.log(data);
          let balloons = data.docs;
          let randomNum = Math.floor(Math.random() * balloons.length);
          console.log(randomNum);
          let randomBalloon = balloons[randomNum];
          document.getElementById("name-display").innerText = randomBalloon.name;
          document.getElementById("mood-display").innerText = randomBalloon.mood;
          document.getElementById("loc-display").innerText = randomBalloon.location;
          document.getElementById("temp-display").innerText = randomBalloon.temperature;
          document.getElementById("weather-display").innerText = randomBalloon.weather;
      });
      document.getElementById('closeform').addEventListener("click", () => {
        document.getElementById("text").style.display = "none";
      })
})