class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speedLimit = 3;
        this.size = Math.random() * 2 +1;
        this.speedX = Math.random() * 5 -1.5;
        this.speedY = Math.random() * 5 -1.5;
        this.color = 'hsla(0,0%,100%,0.3)';
        this.kill = false;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if(this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if(this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }
        if(this.kill) this.size -= 0.1;
        if(this.speedX > this.speedLimit) this.speedX = this.speedLimit;
        if(this.speedX < -this.speedLimit) this.speedX = -this.speedLimit;
        if(this.speedY > this.speedLimit) this.speedY = this.speedLimit;
        if(this.speedY < -this.speedLimit) this.speedY = -this.speedLimit;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fill();
    }
}

var canvas = document.getElementById('bg-canvas');
var ctx = canvas.getContext('2d');
const particlesArray = [];
var numParticles = 20;
for(let i=0; i<numParticles; ++i){
    var x = Math.random() * window.innerWidth;
    var y = Math.random() * window.innerHeight;
    particlesArray.push(new Particle(x, y));
}
let hue = 0;
var mouse = {
    x: undefined,
    y: undefined
}
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

canvas.addEventListener('click', function(e) {
    mouse.x = e.x;
    mouse.y = e.y;
    for(let i=0; i<3; ++i){
        particlesArray.push(new Particle(mouse.x, mouse.y));
    }
});

canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.x;
    mouse.y = e.y;
     particlesArray.push(new Particle(e.x, e.y));
});

function handleParticles() {

    for(let i=0; i< particlesArray.length; ++i){
        particlesArray[i].update();
        particlesArray[i].draw();
        /*
        *  see if there are particles that are close by
        */  
        for(let j = i; j< particlesArray.length; ++j){
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx*dx + dy*dy);
            /*
            *  draw lines between particles that are close to each other
            */  
            if(distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = particlesArray[i].color;
                ctx.lineWidth = Math.random() * .5 ;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y)
                ctx.stroke();
                /*
                *  close particles will affect the path of others
                */
                if(particlesArray[i].size < particlesArray[j].size) {
                    particlesArray[i].speedX -= dx * 0.001 *(particlesArray[j].size/particlesArray[i].size);
                    particlesArray[i].speedY -= dy * 0.001 *(particlesArray[j].size/particlesArray[i].size);
                } else {
                    particlesArray[j].speedX -= dx * 0.001 *(particlesArray[i].size/particlesArray[j].size);
                    particlesArray[j].speedY -= dy * 0.001 *(particlesArray[i].size/particlesArray[j].size);
                }
            }
        }
        /*
        *  killed particles start shrinking, when they get too small, remove them from the array
        */
        if(particlesArray[i].size < .3) { 
            particlesArray.splice(i,1);
            --i;
        }
        /*
        *  kill random particles when we have a lot of them
        */
        if(particlesArray.length > numParticles && Math.random() > 0.99) { 
            try {
                particlesArray[i].kill = true;
            } catch (error) {
                console.log(error);
            }
        }   
    }
}

function animate() {
    ctx.fillStyle = 'rgb(255,144,88,0.7)'; // this is the color of the background of the canvas
    ctx.fillRect(0,0,canvas.width, canvas.height);
    handleParticles();

    requestAnimationFrame(animate);
}

animate();



