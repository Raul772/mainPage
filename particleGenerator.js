class Blob {

    static maxRaio = 20;
    static minRaio = 10;

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.nextX = 0;
        this.nextY = 0;

        this.step = -0.2;
        this.resistance = Math.random() * 0.99

        
        this.raio = Math.random() * 
        ((Blob.maxRaio - Blob.minRaio) + Blob.minRaio);
        

        this.color = colours[Math.floor(Math.random() * colours.length)];
        this.opacity = 0;

        this.inView = true;

        return this;
    }

    movement() {
        this.x += this.nextX;
        this.y += this.nextY;

        this.nextX *= this.resistance;
        this.nextY *= this.resistance;

        let aux = Math.random() * this.step;
        this.nextX += aux;
        this.nextY += aux;

        if(this.opacity < 0.50)
            this.opacity += 0.01;
    }

    correctPosition() {
        if (this.x > window.innerWidth + 100) {
            this.inView = false;
        } else if (this.x < -100) {
            this.inView = false;
        }
    
        if (this.y > window.innerHeight + 100) {
            this.inView = false;
        } else if (this.y < -100) {
            this.inView = false;
        }
    }

    render(context) {

        context.globalAlpha = this.opacity;
        context.globalCompositeOperation = 'source-over';

        context.beginPath();
        context.arc(this.x, this.y, this.raio, 0, (2 * Math.PI));

        context.fillStyle = this.color;
        context.fill();

        context.globalAlpha = 1;
    }

}

const mouseReactMultiplier = 0.01 ;
let nblobs = 25;
let colours = ['#FFF','#9FEDE3','#A6ECF7','#A1C7E0','#A6C1F7','#9FA5ED'];

let canvas = document.querySelector('#particle-generator');
let context = canvas.getContext('2d');

canvas.style.width = window.innerWidth + 'px';
canvas.style.height = window.innerHeight + 'px';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.position = 'absolute';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = -1;

let blobs = [];

for (let i = 0; i < nblobs; i++) {
    blobs.push(blobCreator());
}

(function att () {

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < nblobs; i++) {

        if (blobs[i].inView) {
            blobs[i].movement();
            blobs[i].correctPosition();
            blobs[i].render(context);
        }else{
            blobs.splice(i, 1);
            blobs.push(blobCreator());
        }  
    }

    requestAnimationFrame(att);

})();

function blobCreator(){
    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;

    return new Blob(x, y);
}

window.addEventListener('resize', () => {
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

document.body.addEventListener('pointermove', (event) => {
    blobs.forEach(blob => {
        blob.x += event.movementX * mouseReactMultiplier;
        blob.y += event.movementY * mouseReactMultiplier;
    });
})