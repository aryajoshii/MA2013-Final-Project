//global variables
//for the uni assignment part
let uniActive = false;
let deadlineTimer = 0;
let maxPressure = 600;
let tickingSound;

//journal folder
let journalActive = false;
let journalWords = [];

//apps
let spotifySpamActive = false;
let instaSpamActive = false;
let hearts = [];
let hashtags = ["#LOL", "#LOVE", "#GOALS", "#LOVE", "#SLAY", "#FOLLOWME", "#AD", "#INSTA"]

//for ml5
let faceMesh;
let faces =[];
let previousLipDistance = 0;
let words = [];
let notifications = [];
let startTime; //tracks when the sketch started running 
let song, albumCoverImg, playIcon, pauseIcon;
let isPlaying = false;
let cameraActive = false;
let cam;
let browserWindows = [];
let browserImgs = [];
let albumImages = [];
let albumPile = [];
let totalCovers = 15;

// assets
let icons =[];
let decorations = [];

//let taskbarImg; // my desktop is based of an apple interface
let chargingImg; //charger widget w airpods, watch etc
let liliesImg; //random decoration on desktop to make it seem more authentic
let flowersImg;
let quoteImg;
let calendarImg;
let postitImg; //hopefully an editable to do list that looks like a post it note
let folderImg;
let spotifyImg;
let instagramImg;
let cameraImg;

// trying to find a way for it to register your location- is that an invasion of privacy i dont know
let userLocation = "Loading...";
let cityName = "London, UK";

class Word{
  constructor(x, y, fontSize, font, startAngle){
    let phrases = ["Follower", "Algorithm", "Hashtag", "Engagement", "Story", "Reel", "Discover", "Explore", "Influencer", "Archive", "Direct", "Profile", "Bio", "Thread", "Metrics", "Insights", "Viral", "Buffer", "Mention", "Notify", "Feed", "Post", "Share", "Caption", "Content", "Repost"];
    this.word = random(phrases); //ran out of time to get the hashtags to work, but the rest of this works
    this.fontSize = fontSize;
    this.font = font;
    this.position = createVector(x, y);
    this.velocity = createVector(random(-2,2), random(-2,2));
    this.acceleration = createVector(0,0);
    this.angle = startAngle;
    this.angleV = random(-0.02, 0.02);
  }
  applyForce(force){ this.acceleration.add(force);}
  update(){
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.angle += this.angleV;
    this.velocity.mult(0.99);
  }
  edges(x, y, w, h) {
    if (this.position.x < x || this.position.x > x + w) {
      this.velocity.x *= -1;
    }
    if (this.position.y < y + 30 || this.position.y > y + h) {
      this.velocity.y *= -1;
    }
  }
  display() {
    fill(245, 206, 232);
    noStroke();
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    textSize(this.fontSize);
    textAlign(CENTER, CENTER);
    text(this.word, 0, 0);
    pop();
  }
}

class Notifications{ //notifications pop up on the top right corner of the screen
  constructor(title, message, targetAction){
    this.w = 280;
    this.h = 80;
    this.targetX = width - this.w - 20;
    this.x = width + 50;
    this.y = 20;
    this.title = title; 
    this.message = message;
    this.targetAction = targetAction;
    this.isVisible = true;
    this.scale = 1;
   this.targetScale = 1;
  }

  display(){
    if(!this.isVisible) return; 

    //slide animation
    this.x = lerp(this.x, this.targetX, 0.1);

    //check if user is hovering over it
    let isHovered = mouseX > this.x && mouseX < this.x + this.w &&
                    mouseY > this.y && mouseY < this.y + this.h;
    this.targetScale = isHovered ? 1.05 : 1.0;
    this.scale = lerp(this.scale, this.targetScale, 0.2);

    push();
    translate(this.x + this.w / 2, this.y + this.h / 2);
    scale(this.scale);

    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = 'rgba(0,0,0,0.15';

    fill(255, 255, 255, 240);
    noStroke();
    rect(-this.w / 2, -this.h / 2, this.w, this.h, 15);

    fill(0);
    textAlign(LEFT, TOP);
    textSize(15);
    textStyle(BOLD);
    text(this.title, -this.w / 2 + 15, -this.h / 2 + 15);

    textStyle(NORMAL);
    textSize(13);
    text(this.message, -this.w / 2 + 15, -this.h / 2 + 40);
    pop();

  }

  clicked() {
    let isHovered = mouseX > this.x && mouseX < this.x + this.w &&
                    mouseY > this.y && mouseY < this.y + this.h;
    if (isHovered && this.isVisible) {
      this.isVisible = false;
      this.targetAction();
      return true;
    }
    return false;
  }
}

class BrowserWindows{
  constructor(img, x, y, w, h){
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.isVisible = true;

    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  display(){
    if (!this.isVisible) return;

    push();
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'rgba(0,0,0,0.2)';

    image(this.img, this.x, this.y, this.w, this.h);

    fill(255, 100, 100);
    noStroke();
    circle(this.x + 15, this.y + 15, 12);
    pop();
  }

  pressed(){
    if(dist(mouseX, mouseY, this.x + 15, this.y + 15) < 10) {
      this.isVisible = false;
      return;
    }

    if (mouseX > this.x && mouseX < this.x + this.w && 
        mouseY > this.y && mouseY < this.y + 30) {
      this.dragging = true;
      this.offsetX = mouseX - this.x;
      this.offsetY = mouseY - this.y;
    }
  }
  update() {
    if (this.dragging) {
      this.x = mouseX - this.offsetX;
      this.y = mouseY - this.offsetY;
  }
  }
}

class Heart{
  constructor(){
    this.x = random(width);
    this.y = height + 50;
    this.speed = random(2,5);
    this.size = random(20, 60);
    this.text = random(["❤️", "😍", "🔥" ] ); //makes these emojis pop up on the screen randomly
    this.tag = random(hashtags);
    this.xOffset = random(1000);
  }

  update(){
    this.y -= this.speed;
    this.x += map(noise(this.xOffset, frameCount * 0.01), 0, 1, -2, 2);
  }

  display(){
    textSize(this.size);
    textAlign(CENTER, CENTER);
    text(this.text, this.x, this.y);
  }
}

class Icon {
  constructor(img, x, y, w, h, label, action){
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
    this.action = action;

    this.dragging = false; //icons will be draggable like on a normal desktop
    this.offsetX = 0;
    this.offsetY = 0;    
    this.scale = 1;
    this.targetScale = 1;
  }

  isHovered(){
    return(
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    );
  }

  display(){
    this.targetScale = this.isHovered() ? 1.1 : 1;
    this.scale = lerp(this.scale, this.targetScale, 0.15);
  
    push();
    translate(this.x + this.w / 2, this.y + this.h / 2);
    scale(this.scale);
    imageMode(CENTER);

    if (this.isHovered()){
      drawingContext.shadowBlur = 15;
      drawingContext.shadowColor = "rgba(0,0,0,0.2)";
    }

    image(this.img, 0, 0, this.w, this.h);

    fill(0);
    noStroke();
    textAlign(CENTER, TOP);
    textSize(14);
    text(this.label, 0, this.h /2 + 5);
    pop();
  }

  //hover animations
  pressed() {
    if (this.isHovered()) {
    this.action(); 
      this.dragging = true;
      this.offsetX = mouseX - this.x;
      this.offsetY = mouseY - this.y;
    }
  }

  dragged(){ //setting up drag and drop feature
    if(this.dragging){
      this.x = mouseX - this.offsetX;
      this.y = mouseY - this.offsetY;
    }
  }

  released(){
    this.dragging = false; // releases icon when the mouse is released
  }
}
// preloading images!
function preload(){
  //taskbarImg = loadImage("taskbar.png");
  chargingImg = loadImage("chargers.png");
  liliesImg = loadImage("lilies.png");
  flowersImg = loadImage("flowers.png");
  quoteImg = loadImage("quote.png");
  calendarImg = loadImage("calendar.png");
  postitImg = loadImage("post it note.png");
  folderImg = loadImage("folder.png");
  spotifyImg = loadImage("spotify.logo.png");
  instagramImg = loadImage("instagram.logo.png");
  cameraImg = loadImage("camera.png");

  browserImgs = [];
  browserImgs.push(loadImage("image.png"));
  browserImgs.push(loadImage("window2.png"));
  browserImgs.push(loadImage("Loading Icon.png"));
  browserImgs.push(loadImage("Consent Maze.png"));

  tickingSound = loadSound("ticking.mp3");
  dingSound = loadSound("ding.mp3");
  
  for(let i = 0; i < totalCovers; i++){
    albumImages[i] = loadImage("cover" + i + ".jpg");
  }

  playIcon = loadImage("playbutton.png");
  pauseIcon = loadImage("pausebutton.png");

  //for the music, just one song for now (EDIT: no time to build a 'playlist' type thing, but that would have been nice)
  song = loadSound("bestpart.mp3");
  albumCoverImg = loadImage("albumcover.jpg");
}
function setup(){
  createCanvas(windowWidth, windowHeight);
  startTime = millis();

  // widgets that are interactive
  ToDoWidgetObj = new ToDoWidget(40,280);

// folders
  icons.push(new Icon(folderImg, 400, 300, 100, 90, "journal", () => {
    journalActive = true;
    journalWords = [];

    for (let i = 0; i < 40; i++) {
    journalWords.push(new JournalWord(random(width), random(height), random(14, 28), "Arial"));
  }
}));
  icons.push(new Icon(folderImg, 550, 300, 100, 90, "uni work", () => {
  uniActive = true;
  deadlineTimer = 0; 
  if(!tickingSound.isLooping()){
    tickingSound.loop();
  }
  console.log("deadline approaching!!");
}));
  icons.push(new Icon(folderImg, 700, 300, 100, 90, "photos", () => {
    console.log("Photos clicked - setting up next...");
  }));

  let dockY = height - 95;
  let iconSize = 55;

  //camera 
  icons.push(new Icon(cameraImg, width/2 - 100, dockY-15, iconSize, iconSize, "camera", () => {
    cameraActive = true;
    if(!cam) { 
      cam = createCapture(VIDEO); 
      cam.size(640, 480); 
      cam.hide();

      //initializing face mesh
    faceMesh = ml5.faceMesh({ maxFaces: 1, refineLandmarks: false, flipped: false });
      faceMesh.detectStart(cam, (results)=>{
        faces = results;
      });
    }
    words = [];
    for(let i = 0; i < 30; i++){
      words.push(new Word(width/2 + random(-150, 150), height/2 + random(-100, 100), random(12, 24), "Arial", random(TWO_PI)));
    }
  }));

  //spotify
  let spotifyW = (spotifyImg.width / spotifyImg.height) * iconSize;
  icons.push(new Icon(spotifyImg, width/2 - (spotifyW/2), dockY - 15, spotifyW, iconSize, "spotify", () => {

    spotifySpamActive = true; 

    if (albumImages.length > 0) {
    for (let i = 0; i < 5; i++) {
      albumPile.push({
        img: random(albumImages),
        x: random(0, width - 200),
        y: random(-200, -100),
        speed: random(3, 7),
        rot: random(TWO_PI),
        size: random(150, 250)
      });
    }
  }
  console.log("Spotify Spam Mode: ACTIVATED");
}));

  //instagram
  icons.push(new Icon(instagramImg, width/2 + 60, dockY-15, iconSize, iconSize, "instagram", () => {
  instaSpamActive = true;
  console.log("Instagram Dopamine Mode: ON");
}));
  
//non clickable things 

  let liliesW = 600;
  let liliesH = liliesW * (liliesImg.height / liliesImg.width);
  let flowersW = 310;
  let flowersH = 310;
  let quoteW = 380;
  let quoteH = quoteW * (quoteImg.height/quoteImg.width);
  decorations.push({ img: liliesImg, x:400, y: height - 380, w: liliesW, h: liliesH});
  decorations.push({ img: chargingImg, x: 150, y: 55, w: 130, h:130});
  decorations.push({img: calendarImg, x: width- 350, y: height - 300, w: 300, h: 200});
  decorations.push({img: flowersImg, x: width - 330, y: height - 840, w:flowersW, h:flowersH});
  decorations.push({img: quoteImg, x: width - 600, y: height - 540, w: quoteW, h: quoteH });


  fetch("https://ipapi.co/json/")
     .then(rest => rest.json())
     .then(data => {
      cityName = data.city + "," + data.country;
     })
     .catch(() => {
      cityName = "London, UK"; // in case u cant get location data , this is the default
     })
}


let TimeWidgetObj;
let ToDoWidgetObj;

//making a clock and location widget
function drawTimeWidget(x, y, w, h){
  let hr = hour();
  let mn = minute();
  let timeStr = nf(hr, 2) + ":" + nf(mn,2);
  let ampm = hr >= 12 ? "PM" : "AM";

  // semi transparent pink n white widget
  push();
  fill(255, 240, 240, 200);
  noStroke();
  rect(x, y, w, h, 30);

  fill(0);
  textSize(90);
  textAlign(LEFT, TOP);
  text(timeStr, x + 30, y + 20);

  textSize(22);
  text(ampm, x + w - 80, y + 30);

  textSize(24);
  textAlign(LEFT, TOP);
  text(cityName, x + 30, y + h - 45);
  pop();

}


//post it note looking widget
let tasks = ["finish assignment", "call parents", "do pre reading"];
let checkmarks = [false, false, false]; 

class ToDoWidget{
  constructor(x,y){
    this.x =x;
    this.y = y;
  }

  display(){ //creates an interactive post it note widget
    image(postitImg, this.x, this.y, 250, 250);

    fill(50);
    textSize(18);
    textAlign(LEFT, TOP);

    for (let i = 0; i < tasks.length; i++){
      let ty = this.y + 70 + i * 35;

      let checkbox_x = this.x + 40;
      let checkbox_y = ty + 5;
      let checkbox_w = 14;

      push();
      text(tasks[i], checkbox_x + checkbox_w + 10, ty);

      noFill();
      stroke(50);
      strokeWeight(1);
      rect(checkbox_x, checkbox_y, checkbox_w, checkbox_w);

      if (checkmarks[i]){
        stroke(50);
        strokeWeight(2);
        line(checkbox_x, checkbox_y + checkbox_w/2, checkbox_x + checkbox_w/3, checkbox_y + checkbox_w);
        line(checkbox_x + checkbox_w/3, checkbox_y + checkbox_w, checkbox_x + checkbox_w, checkbox_y);
      }
      pop();
    }
  }

  toggleTask(mx, my){
    for (let i = 0; i < tasks.length; i++){
      let ty = this.y + 70 + i * 35;
      if (
        mx > this.x + 35 && 
        mx < this.x + 250 &&
         my > ty - 10 && 
         my < ty + 30){
        checkmarks[i] = !checkmarks[i];
        break;
      }
    }
  }
}

//let ToDoWidget;

//draw loop
function draw() {
  background(255, 215, 235); //light pink background

  //the dock 
  fill(255, 255, 255, 120);
  noStroke();
  rect(width / 2 - 180, height - 120, 360, 90, 20);
  for (let d of decorations) image(d.img, d.x, d.y, d.w, d.h);

  drawTimeWidget(35, height - 250, 330, 150);
  ToDoWidgetObj.display();
  for (let i of icons) i.display();

  let musicW = 320;
  let musicH = 110;
  drawMusicWidget(width / 2 - musicW / 2, 20, musicW, musicH);

  if (spotifySpamActive && albumImages.length > 0) {
    albumPile.push({
      img: random(albumImages),
      x: random(-100, width),
      y: random(-300, -100),
      speed: random(4, 12),
      rot: random(TWO_PI),
      size: random(100, 300)
    });
  }
  if (instaSpamActive) {
    if (frameCount % 25 === 0) hearts.push(new Heart());
  }
  

  for (let i = hearts.length - 1; i >= 0; i--) {
    hearts[i].update();
    hearts[i].display();
    if (hearts[i].y < -100) hearts.splice(i, 1);
  }

  if (journalActive) {
    for (let jw of journalWords) {
      jw.update();
      jw.display();
    }
  }
  for (let a of albumPile) {
    push();
    translate(a.x + a.size / 2, a.y + a.size / 2);
    rotate(a.rot);
    imageMode(CENTER);
    image(a.img, 0, 0, a.size, a.size);
    pop();
    if (a.y < height - a.size / 4) a.y += a.speed;
  }

  if (cameraActive && cam) {
    let winW = 640; 
    let winH = 510;
    let winX = width/2 - winW/2; 
    let winY = height/2 - winH/2;
    
    fill(255, 240, 240); 
    stroke(245, 206, 232);
    strokeWeight(2);
    rect(winX, winY, winW, winH, 15);
    image(cam, winX, winY + 30, winW, 480);
    
    fill(245, 206, 232); 
    noStroke(); 
    rect(winX, winY, winW, 30, 15, 15, 0, 0);
    fill(255, 100, 100); 
    circle(winX + 20, winY + 15, 15);

    if (faces.length > 0) {
      let face = faces[0];
      let lips = face.lips;

      if (lips) {
        let currentMouthOpen = lips.height;

        if (previousLipDistance > 20 && (previousLipDistance - currentMouthOpen > 5)) {
          let centerMouth = createVector(winX + lips.x + lips.width/2, winY + 30 + lips.y + lips.height/2);
          for (let w of words) {
            triggerWord(w, centerMouth);
          }
          console.log("Blow detected!");
        }
        previousLipDistance = currentMouthOpen;
      }
    }


    for (let w of words) {
      w.applyForce(createVector(0, -0.01));
      w.edges(winX, winY, winW, winH);
      w.update();
      w.display();
    }
  }


  if (frameCount % 400 === 0){
    let img = random(browserImgs);
    let x = random(50, width - 400);
    let y = random(80, height - 400);
    browserWindows.push(new BrowserWindows(img, x, y, 400, 300));
  }

  for (let win of browserWindows){
    win.update();
    win.display();
  }

  for (let a of albumPile){
    push();
    translate(a.x + a.size/2, a.y + a.size/2);
    rotate(a.rot);
    imageMode(CENTER);
    image(a.img, 0, 0, a.size, a.size);
    pop();

    if(a.y < height - a.size){
      a.y += a.speed;
    }
  }

  let elapsedTime = millis() - startTime;
  if (elapsedTime > 10000 && notifications.length === 0) {
    notifications.push(new Notifications("you have a new message!", "have you completed your to-do list?", () => {}));
  }
  for (let n of notifications) n.display();

  cursor(icons.some(i => i.isHovered()) ? HAND : ARROW);
  
  if (spotifySpamActive || instaSpamActive || journalActive || uniActive) {
    fill(255, 100, 100);
    noStroke();
    rect(width / 2 - 60, 140, 120, 35, 10);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(BOLD);
    text("STOP!", width / 2, 157);
    textStyle(NORMAL);
  }

  if (uniActive){
    deadlineTimer += 0.5;

    let centerX = width /2;
    let centerY = height/2;

    //sphere changes size and colour based on how close the deadline is
    let sphereSize = map(deadlineTimer, 0, maxPressure, 50, 400, true);
    let urgency = map(deadlineTimer, 0, maxPressure, 0, 1, true);

    let vol = map(urgency, 0, 1, 0.1, 1.0);
    tickingSound.setVolume(vol);
    let speed = map(urgency, 0, 1, 1.0, 2.5);
    tickingSound.rate(speed);

    let sphereColor = lerpColor(color(255), color(255, 0, 0), urgency);

    push();
    translate(centerX, centerY);

    let jitter = urgency * 10;
    translate(random(-jitter, jitter), random(-jitter, jitter));

    fill(sphereColor);
    stroke(0);
    strokeWeight(2);
    
    beginShape();
    for(let a = 0; a< TWO_PI; a += 0.1){
      let offset = map(noise(a, frameCount * 0.1), 0, 1, -20 * urgency, 20 * urgency);
      let r = sphereSize + offset;
      let x = r *cos(a);
      let y = r * sin(a);
      vertex(x,y);
    }
    endShape(CLOSE);

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(16);
    if(urgency > 0.8) text ("SUBMIT NOW!!!", 0, 0);
    else text("click here to submit assignment.", 0, 0);

    pop();
  }
}



function mousePressed() {
  for(let i = browserWindows.length - 1; i >= 0; i--){
    browserWindows[i].pressed();
  }

  if(uniActive){
    let d = dist(mouseX, mouseY, width/2, height/2);
    let sphereRadius = map(deadlineTimer, 0, maxPressure, 25, 200, true);

    if (d < sphereRadius){
      deadlineTimer = 0;
      tickingSound.rate(1.0);
      tickingSound.setVolume(0.1);
      dingSound.play(); //plays when user has submitted their assignment
      console.log("assignment submitted, new deadline set.");

      notifications.push(new Notifications("success, assignment submitted!", "you can relax. for now.", ()=>{}));
    }
  }

  if (spotifySpamActive || instaSpamActive || journalActive || uniActive) {
    if (mouseX > width/2 - 60 && mouseX < width/2 + 60 && 
        mouseY > 140 && mouseY < 175) {

      spotifySpamActive = false;
      instaSpamActive = false;
      journalActive = false;
      uniActive = false;
      tickingSound.stop();

      albumPile = [];
      hearts = [];
      journalWords = [];
      browserWindows = [];

      console.log("system cleared!")
      return;
    }
  }

  ToDoWidgetObj.toggleTask(mouseX, mouseY);
  for (let icon of icons) icon.pressed();
  for (let n of notifications) n.clicked();

  // Music Click
  let musicX = width/2 - 160;
  if (dist(mouseX, mouseY, musicX + 280, 20 + 55) < 25) toggleMusic();
  

  if (cameraActive) {
    let winW = 640;
    let winH = 510;
    let winX = width/2 - winW/2;
    let winY = height/2 - winH/2; 
    if (dist(mouseX, mouseY, winX + 20, winY + 15) < 15) {
      cameraActive = false;
    }
  }
}


function mouseDragged(){
  for (let i = 0; i < icons.length; i++)
   icons[i].dragged();
}

function mouseReleased(){
  for (let win of browserWindows){
    win.dragging = false;
  }

  for( let i = 0; i < icons.length; i++) 
  icons[i].released();
}

function toggleMusic(){
  if(!song.isPlaying()){
    song.play();
    isPlaying = true;
  } else {
    song.pause();
    isPlaying = false;
  }
}

function drawMusicWidget(x, y, w, h) {
  push();
  fill(255, 240, 240, 200);
  rect(x, y, w, h, 20); //rounded corner like apple interface
  if (albumCoverImg) image(albumCoverImg, x + 10, y + 10, h - 20, h - 20);
  fill(0); textSize(14); textStyle(BOLD); text("Daniel Caesar", x + h, y + 40);
  textStyle(NORMAL); text("Best Part", x + h, y + 65);
  imageMode(CENTER);
  image(isPlaying ? pauseIcon : playIcon, x + w - 40, y + h/2, 30, 30);
  pop();
}

function openMessageInterface(){
  console.log("MESSAGE INTERFACE OPENED");
}

function triggerWord(word, mouthPos) {
  let force = p5.Vector.sub(word.position, mouthPos);
  let distance = force.mag();
  force.normalize();

  let magnitude = map(distance, 0, 600, 0.5, 2) * random(5, 15);
  force.mult(magnitude);
  word.applyForce(force);

  word.angleV = map(distance, 0, 600, 0.01, 0.1) * random(0.5, 2);
}

class JournalWord extends Word {
  constructor(x, y, fontSize, font){
    super(x, y, fontSize, font, random(TWO_PI));

    let journalPhrases = ["dear diary", "overwhelmed", "private", "help", "do not read", "anxiety", "memories", "secrets"];

    this.word = random(journalPhrases);
    this.jitterAmount = 3;
  }

  update(){
    //making the words vibrate
    this.position.x += random(-this.jitterAmount, this.jitterAmount);
    this.position.y += random(-this.jitterAmount, this.jitterAmount);

    this.position.add(p5.Vector.random2D().mult(0.5));

    //keeps words within a boundary 
    this.position.x = constrain(this.position.x, 50, width-50);
    this.position.y = constrain(this.position.y, 50, height - 50);
  }

  display(){
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    fill(0);
    stroke(2);
    textSize(this.fontSize);
    textAlign(CENTER,CENTER);
    text(this.word, 0, 0);
    pop();
  }
}