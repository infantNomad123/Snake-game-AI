const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext('2d');
const coordinates = [
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 0, y: 4 },
    { x: 0, y: 5 }
  
];
//astar algorithm

class Node{
	constructor(x,y,g,h,parent=null){
		this.x = x;
		this.y = y;
		this.g = g;
		this.h =h;
		this.f = g + h;
		this.parent = parent;
	}
}

function heuristic(a,b){
	return Math.abs(a.x-b.x) + Math.abs(a.y-b.y)
}

function getNeighbors(grid, node){
	const neighbors = [];

	const directions = [
		{x:0,y:1},
		{x:0,y:-1},
		{x:1,y:0},
		{x:-1,y:0}
	];

	for( let dir of directions){
		const x = node.x + dir.x;
		const y = node.y + dir.y;
		if(x >= 0 && x < grid.length && y >= 0 && y <grid[0].length && grid[x][y] !== 1){
			neighbors.push(new Node(x,y,0,0));
		}
	}
	return neighbors;
}

function astar(grid,start,goal){
    //neighbornodes with minimum g value
	const open = [];

	//visited node
	const closed = new Set();

	const startNode=  new Node(start.x, start.y, 0, heuristic(start, goal));
	const goalNode=  new Node(goal.x, goal.y, 0, 0);

	open.push(startNode);

	while(open.length !== 0){
		open.sort((a,b) => a.f - b.f);
		const currentNode = open.shift();

		/* If an element has reached the destination, it will trace its path all the way back to where it started*/
		if(currentNode.x === goalNode.x && currentNode.y === goalNode.y){

			/* It will keep track of all the paths that were visited by nodes */
			const path = [];
			let temp =  currentNode;
			while(temp){
				path.push(temp);
			    temp=temp.parent;
			}

			return path.reverse();

		}

		const neighbors = getNeighbors(grid, currentNode);
		closed.add(`${currentNode.x},${currentNode.y}`)

		for(const neighbor of neighbors){

			if(closed.has(`${currentNode.x}`,`${currentNode.y}`)) continue;
			const g = currentNode.g + 1;
			const h = heuristic(neighbor,goalNode);
			const f = g+h;


			const openNeighbor = open.find(node => node.x === neighbor.x && node.y === neighbor.y)
			const neighborNode = new Node(neighbor.x, neighbor.y,g,h,currentNode);

			/*For finding the existing node that are */
			if(openNeighbor){
				if(g < openNeighbor){
					openNeighbor.g =g;
					openNeighbor.f =f;
					openNeighbor.parent = currentNode;
				}
			}else{
				open.push(neighborNode);
			}

		}
	}
	return [];
}
 let grid = new Array(25)
for (let i = 0; i < grid.length; i++) {
	grid[i] = [];
	for (let j = 0; j < 25; j++) {
		grid[i].push(0);
	}
}



//snake game


let apple =  locateApple();

let path = astar(grid, coordinates[0],apple)


let directions  = 'DOWN';






function moveSnake(){

	const nextMove= path.shift();
	
	const head = {x:nextMove.x, y:nextMove.y};
	// if(directions === 'LEFT'){
	// 	head.x -= 20;
	// }
	// if(directions === 'RIGHT'){
	// 	head.x += 20;
	// }
	// if(directions === 'UP'){
	// 	head.y -= 20;
	// }
	// if(directions === 'DOWN'){
	// 	head.y += 20;
	// }
	grid[head.x][head.y] = 1;

    // Insert '0' in the grid for the tail position (which will be removed)
    const tail = coordinates.pop(); // Remove the last coordinate (tail)
    grid[tail.x][tail.y] = 0; 
	coordinates.unshift(head);
	
	drawSnake();
}

function drawSnake(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	coordinates.forEach(coord => {
		ctx.fillRect(coord.x* 20,coord.y* 20,20,20);
		ctx.fillStyle = "green"
	}) 
}
// document.addEventListener('keydown', setDirections);
// function setDirections(e){
// 	if(e.keyCode === 37 && directions !== 'RIGHT'){
// 		directions = 'LEFT'
// 	}
// 	if(e.keyCode === 38 && directions !== 'DOWN'){
// 		directions = 'UP'
// 	}
// 	if(e.keyCode === 39 && directions !== 'LEFT'){
// 		directions = 'RIGHT'
// 	}
// 	if(e.keyCode === 40 && directions !== 'UP'){
// 		directions = 'DOWN'
// 	}
// }




function locateApple(){
	let applex, appley;
	do{
		applex = Math.floor(Math.random() * canvas.width/20) 
		appley = Math.floor(Math.random() * canvas.height/20) 

	}while(coordinates.some(coord => coord.x === applex && coord.y === appley));

	return{x:applex, y:appley}
}


function checkAppleCollision(){
	if(coordinates[0].x === apple.x && coordinates[0].y === apple.y){
		apple = locateApple();
		const head = {x:coordinates[0].x, y:coordinates[0].y}
		coordinates.unshift(head);
		path = astar(grid, coordinates[0], apple);
	}
}

function shiftAppleLocationsBeforeSnake(){

	let snakeHead = coordinates[0];
	if(Math.abs(snakeHead.x - apple.x) <= 2 && Math.abs(snakeHead.y - apple.y) <= 2){
		apple = locateApple();
		path = astar(grid, coordinates[0],apple);
	}
	
	
}

function drawApple(){
	ctx.clearRect(0,0,20, 20)
	ctx.fillStyle = "red";
	ctx.fillRect(apple.x* 20, apple.y* 20, 20, 20);
	
}
function redundancy(){
	if(coordinates[0].x < 0){
		coordinates[0].x = canvas.width;
	}
	if(coordinates[0].x > canvas.width){
		coordinates[0].x = 0;
	}
	if(coordinates[0].y < 0){
		coordinates[0].y = canvas.height;
	}
	if(coordinates[0].y > canvas.height){
		coordinates[0].y = 0;
	}
}

function gameLoop() {
	moveSnake();    
	drawApple();
	// checkAppleCollision();
	shiftAppleLocationsBeforeSnake()
	
	// apple =setInterval(locateApple();
	// redundancy();	
	

	
}




setInterval(gameLoop,100)


/* Things to note:
 
-> I haven't set the snake's body coordinates with the grid unit value, which won't be compatible to the newly added head coordinates
   (which are in grid unit values) and would later cause loads of errors.

-> Same thing with locateApple function. The applex and appley coordinates were multiplied into 20 which would less likely be a grid unit
   value, which would lay the coordinates off the bound.

*/
	

	
		

	

