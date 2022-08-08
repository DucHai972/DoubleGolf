const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const ballColor = "#fff";
const ballBoroder = "black";
const holeColor = "black";
const hole = new Audio('hole.mp3');
const collide = new Audio('collide.mp3');
const shoot = new Audio('shoot.mp3');
const levelShow = document.querySelector("#levelShow");
let ballX = gameWidth/4;
let ballY = gameHeight*4/5;
let ballX2 = gameWidth*3/4;
let ballY2 = gameHeight*4/5;
let ballXMove;
let ballYMove;
let ballXDirection = 0;
let ballRadius = 15;
let ballRadius2 = 15;
let angle = Math.PI;
let angle2 = Math.PI;
let intervalID;
let intervalWin, intervalWin2;
let ballSpeed = 50;
let barrier = [
    {x1: 250, y1: 250, x2: 500-6, y2: 100},
    {x1: 0, y1: 500, x2: 250, y2: 125},
    {x1: 500, y1: 625, x2: 250, y2: 125}    
];

let barrier2 = [
    {x1: 750, y1: 650, x2: 250, y2: 100},
    {x1: 1250, y1: 650, x2: 250, y2: 100},
    {x1: 1000, y1: 250, x2: 250, y2: 250}
];
let ballIn = 0;
let holeX; 
let holeY;
let holeX2;
let holeY2;
let running = true;
let win1 = false;
let win2 = false;
let winCount = 0;
let shoots = 0;
let levelCount = 1;
let playHole = true;
let playHole2 = true;
let moveHole = false;
let holeStep = 1;
let trick = false;
gameStart();

window.document.addEventListener("keydown", adjustAngle);

function gameStart()  {
    clearBoard();
    createBall();
    drawBall(ballX, ballY);
    drawBall2(ballX2, ballY2);
    drawVector();
    drawVector2();
    drawBarrier();
    createHole();
    drawHole();
    ballX = 375;
    ballY = 1000;
    nextTick();
};

function nextTick()  {
    if (running) {
        intervalID = setTimeout(() =>  {
            clearBoard();
            checkWin();
            drawBarrier();
        //2 balls win

        if(win1 && win2)  {
            newLevel();
        }
            //ball 1 wins
        if((win1 || win2) && !(win1 && win2))    {
            if(win1)  {
                ballX = holeX;
                ballY = holeY;
                drawHole();
                if(ballSpeed == 0 || ballSpeed == 50)
                    drawVector2();
                drawBall(ballX, ballY);
                drawBall2(ballX2, ballY2);
            }
            //ball2 wins
            if(win2)  {
                ballX2 = holeX2;
                ballY2 = holeY2;
                drawHole();
                if(ballSpeed == 0 || ballSpeed == 50)
                    drawVector();
                drawBall(ballX, ballY);
                drawBall2(ballX2, ballY2);
            }

        }
        
        else  {
                drawHole();
                if(ballSpeed == 0 || ballSpeed == 50)  {
                    drawVector();
                    drawVector2();
                }
                drawBall(ballX, ballY);
                drawBall2(ballX2, ballY2);
            }
            checkCollision();
            nextTick();
        }, 5);
    }
    
};

function clearBoard()  {
    for(let i = 250; i <= 1500; i += 250)
        for(let j = 250; j <= 1250; j += 250)  {
            if((i/250)%2 && (j/250)%2)
                ctx.fillStyle = "#009900";
            else if ((!((i/250)%2)) && !((j/250)%2))
                ctx.fillStyle = "#009900";
            else    ctx.fillStyle = "#006600";
            
            ctx.fillRect(i-250, j-250, i, j);
        }
    ctx.strokeStyle = "black";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(750, 0);
    ctx.lineTo(750, 1250);
    ctx.stroke();
    ctx.lineWidth = 1;
};

function createBall()  {
    ballX = gameWidth/4;
    ballY = gameHeight*4/5;
    ballX2 = gameWidth*3/4;
    ballY2 = gameHeight*4/5;
};

function drawBall(ballX, ballY)  {
    ctx.fillStyle = "white";
    ctx.fillStroke = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 13;
    

	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius, 0, 2*Math.PI);
	ctx.stroke();
	ctx.fill();
    

};

function drawBall2(ballX2, ballY2)  {
    ctx.fillStyle = "white";
    ctx.fillStroke = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 13;

    ctx.beginPath();
    ctx.arc(ballX2, ballY2, ballRadius2, 0, 2*Math.PI);
    ctx.stroke();
    ctx.fill();
}

function forceBall()  {
    const shoot = setInterval(() =>  {
        if(ballSpeed > 0)  {
            ballX += ballSpeed * Math.sin(angle);
            ballY += ballSpeed * Math.cos(angle);
            ballX2 += ballSpeed * Math.sin(angle2);
            ballY2 += ballSpeed * Math.cos(angle2);
            ballSpeed -= 0.5;
        } else  {
            clearInterval(shoot);
        }
    }, 20);
};

function adjustAngle(event)  {
    const keyPressed = event.keyCode;
    const LEFT = 39;
    const RIGHT = 37;
    const SHOOT = 13;
    if(ballSpeed == 0 || ballSpeed == 50)  {
    switch(keyPressed)  {
        case LEFT:
            angle -= Math.PI/24;
            angle2 -= Math.PI/24;
            break;
        case RIGHT:
            angle += Math.PI/24;
            angle2 += Math.PI/24;
            break;
        case SHOOT:
            shoot.play();
            if(ballSpeed == 50 || ballSpeed == 0)  {
                ballSpeed = 50;
                forceBall();
            }
            break;
    }
    }
};

function drawVector()  {
    ctx.beginPath();
    ctx.lineWidth = 13;
    ctx.moveTo(ballX, ballY);
    ctx.lineTo(ballX + 200*Math.sin(angle), ballY + 200*Math.cos(angle));
    ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
    ctx.stroke();

    
};

function drawVector2()  {
    ctx.beginPath();
    ctx.lineWidth = 13;
    ctx.moveTo(ballX2, ballY2);
    ctx.lineTo(ballX2 + 200*Math.sin(angle2), ballY2 + 200*Math.cos(angle2));
    ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
    ctx.stroke();
}

function checkCollision()  {
    //Ball1
    if(ballX - ballRadius <= 0 || ballX + ballRadius + 6 >= gameWidth/2)  {
        angle = -angle;
        collide.play();
        if(ballX + ballRadius + 6 > gameWidth/2)
            ballX = gameWidth/2 - ballRadius- 6;
        if(ballX - ballRadius < 0)
            ballX = ballRadius;
    }

    if(ballY - ballRadius <= 0 || ballY + ballRadius >= gameHeight)  {
        angle = Math.PI - angle;
        collide.play();
        if(ballY - ballRadius < 0)
            ballY = ballRadius;
        if(ballY + ballRadius > gameHeight)
            ballY = gameHeight - ballRadius;
    }

    barrier.forEach((b) =>  {
        //Ball 1
        if(ballX >= b.x1 && ballX <= b.x1 + b.x2)  {
            if(ballY + ballRadius >= b.y1 && ballY + ballRadius < b.y1 + b.y2/2)  {
                collide.play();
                angle = Math.PI - angle;
                ballY = b.y1 - ballRadius;
            }

            if(ballY - ballRadius <= b.y1 + b.y2 && ballY - ballRadius > b.y1 + b.y2/2)  {
                collide.play();
                angle = Math.PI - angle;
                ballY = b.y1 + b.y2 + ballRadius;
            }   
        }

        if(ballY >= b.y1 && ballY  <= b.y1 + b.y2)  {
            if(ballX + ballRadius  >= b.x1 && ballX + ballRadius < b.x1 + b.x2/2)  {
                collide.play();
                angle = -angle;
                ballX = b.x1 - ballRadius;
            }

            if(ballX - ballRadius <= b.x1 + b.x2 && ballX - ballRadius > b.x1 + b.x2/2)  {
                collide.play();
                angle = -angle;
                ballX = b.x1 + b.x2 + ballRadius;
            }
        }
    
    })


    //Ball2
    if(ballX2 - ballRadius <= 750 || ballX2 + ballRadius + 6 >= gameWidth)  {
        angle2 = -angle2;
        collide.play();
        if(ballX2 + ballRadius + 6 > gameWidth)
            ballX2 = gameWidth - ballRadius- 6;
        if(ballX2 - ballRadius < 750)
            ballX2 = 750 + ballRadius;
    }
    if(ballY2 - ballRadius <= 0 || ballY2 + ballRadius >= gameHeight)  {
        angle2 = Math.PI - angle2;
        collide.play();
        if(ballY2 - ballRadius < 0)
            ballY2 = ballRadius;
        if(ballY2 + ballRadius > gameHeight)
            ballY2 = gameHeight - ballRadius;
    }
    

    barrier2.forEach((b) =>  {
        if(ballX2 >= b.x1 && ballX2 <= b.x1 + b.x2)  {
            if(ballY2 + ballRadius2 >= b.y1 && ballY2 + ballRadius2 < b.y1 + b.y2/2)  {
                collide.play();
                angle2 = Math.PI - angle2;
                ballY2 = b.y1 - ballRadius2;
            }

            if(ballY2 - ballRadius2 <= b.y1 + b.y2 && ballY2 - ballRadius2 > b.y1 + b.y2/2)  {
                collide.play();
                angle2 = Math.PI - angle2;
                ballY2 = b.y1 + b.y2 + ballRadius2;
            }   
        }

        if(ballY2 >= b.y1 && ballY2  <= b.y1 + b.y2)  {
            if(ballX2 + ballRadius2  >= b.x1 && ballX2 + ballRadius2 < b.x1 + b.x2/2)  {
                collide.play();
                angle2 = -angle2;
                ballX2 = b.x1 - ballRadius2;
            }

            if(ballX2 - ballRadius2 <= b.x1 + b.x2 && ballX2 - ballRadius2 > b.x1 + b.x2/2)  {
                collide.play();
                angle2 = -angle2;
                ballX2 = b.x1 + b.x2 + ballRadius2;
            }
        }
    })
};

function drawBarrier()  {
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black";

    barrier.forEach((b) =>  {
        ctx.lineWidth = 10;
        ctx.fillRect(b.x1, b.y1, b.x2, b.y2);
        ctx.strokeRect(b.x1, b.y1, b.x2, b.y2);
        ctx.stroke();
    })
    barrier2.forEach((b) =>  {
        ctx.lineWidth = 10;
        ctx.fillRect(b.x1, b.y1, b.x2, b.y2);
        ctx.strokeRect(b.x1, b.y1, b.x2, b.y2);
        ctx.stroke();
    })
}

function createHole()  {
    holeX = 625;   
    holeY = 125;
    holeX2 = 1125;
    holeY2 = 125;
}
function drawHole()  {
    ctx.fillStyle = "#000000";
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#404040";


	
	ctx.beginPath();
	ctx.arc(holeX, holeY    , 17, 0, 2*Math.PI);
	ctx.fill();


    ctx.moveTo(holeX2, holeY2);
    ctx.arc(holeX2, holeY2, 17, 0, 2*Math.PI);
    ctx.stroke();
    ctx.fill();

    if(moveHole)  {
        if(holeX == 125)
            holeStep = 1;
        else if(holeX == 625)
            holeStep = -1;
        
        holeX += holeStep;
        holeY2 += holeStep;
    }

    if(levelCount == 4)  {
        if(holeX2 == 1375)
            holeStep = -1;
        else if(holeX2 == 875)
            holeStep = 1;
        holeX2 += holeStep;

        if(ballX2 >= 750 && ballX2 <= 800 && ballY2 >=750 && ballY2 <= 800)
            barrier2 = [
                {x1: 800, y1: 800, xs2: 750, y2: 125},
            ];
        else if(ballX2 >= 1450 && ballX2 <= 1500 && ballY2 >= 750 && ballY2 <= 800)
            barrier2 = [
            {x1: 750, y1: 800, x2: 700, y2: 125},
            ];

    }
    if(trick)  {
        if(ballX >= 250 && ballX <= 500 && ballY >= 0 && ballY <= 250)  {
            barrier = [
                {x1: 100, y1: 250, x2: 500, y2: 125},
                {x1: 0, y1: 450, x2: 500, y2: 125},
                {x1: 100, y1: 650, x2: 500, y2: 125},
                {x1: 0, y1: 850, x2: 500, y2: 125},
                {x1: 100, y1: 1050, x2: 500, y2: 125},
                {x1: 600, y1: 375, x2: 100, y2: 800},
                {x1: 500, y1: 0, x2: 100, y2: 250}
            ];

            trick = false;
        }

    }
};

function checkWin()  {
    if(ballX + 15 >= holeX && ballX - 15 <= holeX)  
        if(ballY + 15 >= holeY && ballY - 15 <= holeY)  {
            win1 = true;
            if(playHole)
                hole.play();
            playHole = false;
        }
    
    if(ballX2 + 15 >= holeX2 && ballX2 - 15 <= holeX2)  
        if(ballY2 + 15 >= holeY2 && ballY2 - 15 <= holeY2)  {
            win2 = true;
            if(playHole2)
                hole.play();
            playHole2 = false;
        }
};


function newLevel()  {
    playHole = true;
    playHole2 = true;
    levelCount++;
    console.log(levelCount);
    switch(levelCount)  {

        //LEVEL 2
        case 2:
            ballSpeed = 0;
            ballX = 125;
            ballY = 125;
            ballX2 = 1375;
            ballY2 = 1125;
            holeX = 625;
            holeY = 1125;
            holeX2 = 875;
            holeY2 = 125;
            barrier = [
                {x1: 125, y1: 250, x2: 500, y2: 125},
                {x1: 500, y1: 500, x2: 252, y2: 250},
                {x1: 250, y1: 750, x2: 125, y2: 400}
            ];
            
            barrier2 = [
                {x1: 1000, y1: 50, x2: 1500, y2: 500},
                {x1: 1000, y1: 750, x2: 125, y2: 400}
            ];
            break;
            
        //LEVEL 3
        case 3:
            ballSpeed = 0;
            ballX = 375;
            ballY = 1125;
            ballX2 = 1125;
            ballY2 = 125;
            holeX = 125;
            holeY = 125;
            holeX2 = 1125;
            holeY2 = 625;
            barrier = [
                {x1: 0, y1: 250, x2: 350, y2: 125},
                {x1: 400, y1: 250, x2: 350, y2: 125},
                {x1: 250, y1: 500, x2: 250, y2: 125}
            ];
            barrier2 = [
                {x1: 1000, y1: 450, x2: 250, y2: 125},
                
            ];
            moveHole = true;
            
            break;
        
        case 4:
            moveHole = false;
            ballSpeed = 0;
            ballX = 50;
            ballY = 1200;
            holeX = 625;
            holeY = 125;
            ballX2 = 875;
            ballY2 = 125;
            holeX2 = 1375;
            holeY2 = 1125;
            barrier = [
                {x1: 100, y1: 250, x2: 650, y2: 125},
                {x1: 0, y1: 450, x2: 500, y2: 125},
                {x1: 100, y1: 650, x2: 500, y2: 125},
                {x1: 0, y1: 850, x2: 500, y2: 125},
                {x1: 100, y1: 1050, x2: 500, y2: 125},
                {x1: 600, y1: 375, x2: 100, y2: 800},
                
            ];

            barrier2 = [
                {x1: 750, y1: 800, x2: 750, y2: 125},
        
            ];
            trick = true;

            break;  
    }

    if(levelCount >= 5)  {
        let r1 = Math.floor(Math.random()*2);
        let r2 = Math.floor(Math.random()*2);

        let hx1 = Math.floor(Math.random()*250) + 125;
        let hx2 = Math.floor(Math.random()*250) + 875;
        let bx1 = Math.floor(Math.random()*250) + 125;
        let bx2 = Math.floor(Math.random()*250) + 875;
        let hy1, hy2, by1, by2;
        if(r1)  {
            hy1 = 125;
            by1 = 1125;
        }  else  {
            hy1 = 1125;
            by1 = 125;
        }

        if(r2)  {
            hy2 = 125;
            by2 = 1125;
        }  else  {
            hy2 = 1125;
            by2 = 125;
        }

        let barx1 = Math.floor(Math.random()*675);
        let barx2 = Math.floor(Math.random()*(gameWidth/2 - 60 - barx1)) + 30;
        let bary1 = Math.floor(Math.random()*125) + 250;
        let bary2 = Math.floor(Math.random()*(500 - 20 - bary1)) + 30;
        
        let bar2x1 = Math.floor(Math.random()*675);
        let bar2x2 = Math.floor(Math.random()*(gameWidth/2 - 60 - bar2x1)) + 30;
        let bar2y1 = Math.floor(Math.random()*125) + 500;
        let bar2y2 = Math.floor(Math.random()*(750 - 20 - bar2y1)) + 30;


        let bar3x1 = Math.floor(Math.random()*675);
        let bar3x2 = Math.floor(Math.random()*(gameWidth/2 - 60 - bar3x1)) + 30;
        let bar3y1 = Math.floor(Math.random()*125) + 750;
        let bar3y2 = Math.floor(Math.random()*(1000 - 20 - bar3y1)) + 30;

        let bar4x1 = Math.floor(Math.random()*675) + 875;
        let bar4x2 = Math.floor(Math.random()*(gameWidth  - bar4x1)) + 30;
        let bar4y1 = Math.floor(Math.random()*125) + 250;
        let bar4y2 = Math.floor(Math.random()*(500 - 20 - bar4y1)) + 30;

        let bar5x1 = Math.floor(Math.random()*675) + 875;
        let bar5x2 = Math.floor(Math.random()*(gameWidth- bar5x1)) + 30;
        let bar5y1 = Math.floor(Math.random()*125) + 500;
        let bar5y2 = Math.floor(Math.random()*(750 - 20 - bar5y1)) + 30;

        let bar6x1 = Math.floor(Math.random()*675) + 875;
        let bar6x2 = Math.floor(Math.random()*(gameWidth - bar5x1)) + 30;
        let bar6y1 = Math.floor(Math.random()*125) + 750;
        let bar6y2 = Math.floor(Math.random()*(1000 - bar6y1)) + 30;


        moveHole = false;
        ballSpeed = 0;
        ballX = bx1;
        ballY = by1;
        holeX = hx1;
        holeY = hy1;
        ballX2 = bx2;
        ballY2 = by2;
        holeX2 = hx2;
        holeY2 = hy2;

        barrier = [
            {x1: barx1, y1: bary1, x2: barx2, y2: bary2},
            {x1: bar2x1, y1: bar2y1, x2: bar2x2, y2: bar2y2},
            {x1: bar3x1, y1: bar3y1, x2: bar3x2, y2: bar3y2}
        ];

        barrier2 = [
            {x1: bar4x1, y1: bar4y1, x2: bar4x2, y2: bar4y2},
            {x1: bar5x1, y1: bar5y1, x2: bar5x2, y2: bar5y2},
            {x1: bar6x1, y1: bar6y1, x2: bar6x2, y2: bar6y2}
        ];
    }

    levelShow.textContent = `LEVEL ${levelCount}`;
    win1 = false;
    win2 = false;
}

