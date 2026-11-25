let cnv;
let centre;
let margin = 20

let language = 'DE'

function french() {
  language = "FR"
}

function german() {
  language = "DE"
}

let colours = {
  bg: '#457b9d',
  cardFront: '#e63946',
  text: '#f1faee'
}

function setup() {
  cnv = createCanvas(windowWidth - margin, windowHeight - margin);
  cnv.position(margin/2, margin/2, 'fixed');
  cnv.elt.addEventListener("contextmenu", (e) => e.preventDefault());
  //translate(1400,0)
  //loadPhysics()
  textSize(24)
  textWrap(WORD)
  rectMode(CENTER)
  centre = {x: width/2, y: height/2}
  loadCards()
  //new Card()
}

function windowResized() {
  resizeCanvas(windowWidth - margin, windowHeight - margin);
  centre = {x: width/2, y: height/2}
}

function draw() {
  background(colours.bg);

  drawPiles()
  for (let card of cards) {
    card.draw()
  }

  peekPiles()
}

function mousePressed(e) {
  //mousePressedCards(e.button-1)
}
