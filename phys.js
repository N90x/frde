var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;
;

function createBounds(thick) {
    let param = {isStatic: true}

    let top = Bodies.rectangle(width/2, thick/2, width, thick, param)
    let bottom = Bodies.rectangle(width/2, height - thick/2, width, thick, param)

    let left = Bodies.rectangle(thick/2, height/2, thick, height, param)
    let right = Bodies.rectangle(width-thick/2, height/2, thick, height, param)

    Composite.add(engine.world, [top,bottom,left,right])
}


function loadPhysics() {

    engine = Engine.create();

    //engine.gravity.scale = 0   


    // create runner
    var runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);

    createBounds(5)
}

let balls = []
class Ball {
    constructor(x,y,r) {
        this.pos = {x:x,y:y}
        this.d = r*2
        this.body = Bodies.circle(x, y, r)
        Composite.add(engine.world, [this.body]);
        this.index = balls.length
        balls.push(this)
    }
    
    draw() {
        this.pos = this.body.position
        if (this.hovered()) {
            fill(255,0,0)
        }
        else {
            fill(255)
        }
        circle(this.pos.x, this.pos.y, this.d)
    }

    hovered() {
        return mouseInBoundsC(this.pos.x, this.pos.y, this.d/2)
    }

    del() {
        let i = balls.indexOf(this)
        console.log('deleting index', i)
        Composite.remove(engine.world, this.body)
        balls.splice(i, 1)
    }
}