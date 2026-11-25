let piles;
let activeCard;
let cardHeight = 120
let cardWidth = cardHeight * 1.5

let pileSpacing = 5

let animationDur = 15

let remainingWords = []

function loadCards() {
    piles = {
        draw: { x: centre.x, y: height - cardHeight * 0.6 },
        know: { x: centre.x + 400, y: 150 },
        dontknow: { x: centre.x - 400, y: 150 }
    }

    for (let i in words) {
        remainingWords.push(i)
    }

    autoDeal = createCheckbox('Auto Deal')
    autoDeal.style('color', colours.text)
        autoDeal.style('background-color', colours.cardFront)

    autoDeal.style('border', "2px solid black")
    
    autoDeal.size(100, autoDeal.height)
    autoDeal.position(centre.x - autoDeal.width/2, 100-autoDeal.height/2)
    autoDeal.checked(true)
}

let cards = []

function getRandomWord() {
    let wordN = remainingWords[getRandomInt(remainingWords.length)]
    remainingWords.splice(remainingWords.indexOf(wordN), 1)
    return words[wordN]
}

class Card {
    constructor(x, y, word) {
        this.pos = { x: x, y: y }
        this.animation = {
            active: false,
            direction: { x: 0, y: 0 },
            endTime: 0
        }

        this.word = word || getRandomWord()
        this.hasTranslation = false
        this.facing = "down"
        cards.push(this)
    }

    draw() {
        if (this.facing == "up") {
            fill(colours.cardFront)
        } else {
            fill(colours.cardFront)
        }

        stroke(0)
        strokeWeight(1)
        rect(this.pos.x, this.pos.y, cardWidth, cardHeight)
        fill(colours.text)
        if (this.facing == "up") {
            strokeWeight(2)
            textAlign(CENTER, TOP)

            if (this.hasTranslation) {
                if (language == "DE") {
                    text(`${this.word.english}\n${this.word.german}`, this.pos.x, this.pos.y - cardHeight / 4, cardWidth)
                } else if (language == "FR") {
                    text(`${this.word.english}\n${this.word.french}`, this.pos.x, this.pos.y - cardHeight / 4, cardWidth)
                }
            } else {
                text(this.word.english, this.pos.x, this.pos.y - cardHeight / 4, cardWidth)
            }

        }

        this.animate()
    }

    animate() {
        if (this.animation.active) {
            let d = dist(this.pos.x, this.pos.y, this.animation.endPos.x, this.animation.endPos.y)
            //console.log(d)
            if (d < 1) {
                this.animation.active = false
            } else {
                // Move
                this.pos.x += this.animation.step.x
                this.pos.y += this.animation.step.y
            }
        }
    }

    startAnimation(x, y, duration) {
        if (!this.animation.active) {
            let translation = { x: x, y: y }
            this.animation = {
                active: true,
                translation: translation,
                endPos: { x: this.pos.x + translation.x, y: this.pos.y + translation.y },
                step: { x: translation.x / duration, y: translation.y / duration }
            }
        }

    }

    discard() {
        cards.splice(cards.indexOf(this), 1)
    }
}

let correctRate = 0

function drawPiles() {
    fill(colours.cardFront)
    stroke(0)
    strokeWeight(1)

    rect(piles.draw.x, piles.draw.y, cardWidth, cardHeight)
    rect(centre.x, 50, cardWidth/1.5, cardHeight/3)


    rect(piles.know.x, 100, cardWidth, cardHeight / 2)

    rect(piles.dontknow.x, 100, cardWidth, cardHeight / 2)


    strokeWeight(2)
    fill(colours.text)
    textAlign(CENTER, CENTER)
    text('Know Pile', piles.know.x, 100)
    text('Don\'t Know Pile', piles.dontknow.x, 100)

    text(`Rate: ${correctRate}`, centre.x, 50)
    correctRate = (iknowPile.length/idkPile.length).toFixed(2)
  
}

function isPileHovered(pile) {
    return (mouseX > pile.x - cardWidth / 2 && mouseX < pile.x + cardWidth / 2 && mouseY > pile.y)
}

function peekPiles() {
    //console.log(iknowPile)
    if (isPileHovered(piles.know) && iknowPile.length > 0) {
        let topY = iknowPile[0].pos.y - cardHeight / 2
        let mouseDown = Math.max(0, mouseY - topY)
        let mouseI = Math.round(mouseDown / pileSpacing)

        if (iknowPile[mouseI]) {
            iknowPile[mouseI].draw()
        }
    }

    if (isPileHovered(piles.dontknow) && idkPile.length > 0) {
        let topY = idkPile[0].pos.y - cardHeight / 2
        let mouseDown = Math.max(0, mouseY - topY)
        let mouseI = Math.floor(mouseDown / pileSpacing)

        if (idkPile[mouseI]) {
            idkPile[mouseI].draw()
        }
    }
}

let idkPile = []
let iknowPile = []
let autoDeal;

function storeCard(button) {
    if (!activeCard.animation.active) {
        let c = new Card(activeCard.pos.x, activeCard.pos.y, activeCard.word)
        c.facing = "up"
        c.hasTranslation = true
        if (button == 1) {
            let yDist = (piles.know.y - c.pos.y) + cardHeight / 2
            let yOff = iknowPile.length * pileSpacing
            c.startAnimation(400 * button, yDist + yOff, animationDur)
            iknowPile.push(c)
            console.log('iknowPile')

        } else if (button == -1) {
            let yDist = (piles.dontknow.y - c.pos.y) + cardHeight / 2
            let yOff = idkPile.length * pileSpacing
            c.startAnimation(400 * button, yOff + yDist, animationDur)
            idkPile.push(c)
        }


        activeCard.discard()
        activeCard = undefined

        if (autoDeal.checked()) {
            getNewCard()
        }

    }

}

function mousePressedCards(button) {
    //console.log(button)
    if (activeCard) {
        if (mouseInBoundsCentre(activeCard.pos.x, activeCard.pos.y, cardWidth, cardHeight)) {
            storeCard(button)
        }
    }
    if (mouseInBoundsCentre(piles.draw.x, piles.draw.y, cardWidth, cardHeight)) {
        if (!activeCard) {
            getNewCard()
        }
    }

}

function getNewCard() {
    activeCard = new Card(piles.draw.x, piles.draw.y)
    activeCard.startAnimation(0, (height / 2) - piles.draw.y, animationDur)
    activeCard.facing = "up"
}

function keyPressed() {
    if (activeCard) {
        if (key == "ArrowLeft") {
            storeCard(-1)
        }
        if (key == "ArrowRight") {
            storeCard(1)
        }
    } else if (key == "ArrowUp") {
        getNewCard()
    }
}
