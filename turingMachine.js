//My Graph implementation
function Vertex(key) {

	this.key = key;
	this.edges = [];
  
}
  
Vertex.prototype.outLinks = function () {

	var x = [];

	for (var i = 0; i < this.edges.length; i++) {
		if (this.edges[i].from == this) {
		x.push(this.edges[i]);
		}
	}

	return x;

}

Vertex.prototype.inLinks = function () {

	var x = [];

	for (var i = 0; i < this.edges.length; i++) {
		if (this.edges[i].to == this) {
		x.push(this.edges[i]);
		}
	}

	return x;

}

function edge(from, to,read,write,move) {
	this.from = from;
	this.to = to;
	this.read = read;
	this.write = write;
	this.move = move;
}


function DirectedGraph() {
	this.vertexes = [];
	this.edges = [];
}

DirectedGraph.prototype.addVertex = function (x) {

	this.vertexes.push(x);

}


DirectedGraph.prototype.getVertex = function (key) {

	for (var i = 0; i < this.vertexes.length; i++) {
		if (this.vertexes[i].key == key) {
			return this.vertexes[i];
		}
	}

	return false;
}

DirectedGraph.prototype.addEdge = function (from, to, read, write, move) {

	from = this.getVertex(from);
	to = this.getVertex(to);

	if (from == false || to == false) {
		return false;
	} else {

		x = new edge(from, to, read, write, move);

		this.edges.push(x);
		from.edges.push(x);		
	}

}

DirectedGraph.prototype.getVertexes = function () {

	return this.vertexes;

}

DirectedGraph.prototype.getEdges = function () {

	return this.edges;

}


/////////////////////////////////////////////


//Cell on the tape
function Cell(value){
	this.value = value;
	this.prev = null;
	this.next = null;
}

//The reprisentation of the tape
function Tape(arr){
	this.head = null;

	for(var i = 0;i<arr.length;i++){
		this.addRight(new Cell(arr[i]));
	}

	this.start();
}

//Adds a cell to the right of the head
Tape.prototype.addRight = function(cell){
	if(this.head == null){
		this.head = cell;
	} else {
		cell.prev = this.head;
		this.head.next = cell;
		this.right();
	}
}

Tape.prototype.addLeft = function(cell){
	if(this.head == null){
		this.head = cell;
	} else {
		cell.next = this.head;
		this.head.prev = cell;
		this.left();
	}
}

//Moves the head left
Tape.prototype.left = function(){
	if(this.head.prev == null){
		this.addLeft(new Cell('B'));
	} else {
		this.head = this.head.prev;
	}
}

//Moves the head right
Tape.prototype.right = function(){
	if(this.head.next == null){
		this.addRight(new Cell('B'));
	} else {
		this.head = this.head.next;
	}
}

//Moves the head to the start of the tape
Tape.prototype.start = function(){
	while(this.head.prev != null){
		this.left();
	}
}

//Moves the head to the end of the tape
Tape.prototype.end = function(){
	while(this.head.next != null){
		this.right();
	}
}

Tape.prototype.export = function(){
	var h = this.head,output = [],prev = null;

	while(h.prev != null){
		h = h.prev;
	}

	while(h.next != null){
		if(!(prev == 'B' && h.value == 'B')){
			output.push(h.value);
		}
		prev = h.value;
		h = h.next;
	} 

	
	output.push(h.value);
	return output.join('');
}

//My turing Machine implementation
function TuringMachine(tape,states){

	this.tape = tape;
	this.states = states;
	this.history = [];
	
}

//Basic Add
TuringMachine.prototype.add = function() {

	g = new DirectedGraph();

	//create the states
	for(var i = 0;i<6;i++){
		g.addVertex(new Vertex(i));
	}

	//adding edges

	//replace the first 1 with X
	g.addEdge(0,1,1,'X','r');
	

	//move to the right until you reach the blank
	g.addEdge(1,1,1,1,'r');
	g.addEdge(1,2,'.','.','r');
	g.addEdge(2,2,1,1,'r');

	//replace the blank with a 1
	g.addEdge(2,3,'B',1,'l');

	//move to the left until you reach the start and ignore Xs
	g.addEdge(3,3,1,1,'l');
	g.addEdge(3,4,'.','.','l');
	g.addEdge(4,4,1,1,'l');
	g.addEdge(4,0,'X','X','r');

	//Finish
	g.addEdge(0,5,'.','B','l');
	g.addEdge(5,5,'X','B','l');

	this.states = g;
	this.run(this.states.getVertex(0));
}

TuringMachine.prototype.mult = function(){
	g = new DirectedGraph();

	//create the states
	for(var i = 0;i<13;i++){
		g.addVertex(new Vertex(i));
	}



	this.states = g;
	this.run(this.states.getVertex(0));
}

//Recursive running function
TuringMachine.prototype.run = function(v) {

	//Store the current tape
	this.history.push(this.tape.export());

	//Find the corresponding edge
	for(var i = 0; i<v.edges.length;i++){
		if(v.edges[i].read == this.tape.head.value){

			//Write the write value onto the head
			this.tape.head.value = v.edges[i].write;
			
			//Add blanks to each end of the tape if they have been replaced
			if(this.tape.head.next == null){
				this.tape.addRight(new Cell('B'));
				this.tape.left();
			}

			if(this.tape.head.prev == null){
				this.tape.addLeft(new Cell('B'));
				this.tape.right();
			}

			//Move the tape left/right
			switch(v.edges[i].move){
				case 'r':
					this.tape.right();
				break;
				case 'l':
					this.tape.left();
				break;
			}

			//Recursivly runs the program
			this.run(v.edges[i].to);
			break;
		}
	}

}

Keep going right until you reach a blank
Turn the blank into a .
Go left until you reach a c
Skip all Xs
Convert a one on the right side into and X
Skip all X,Y and Z, moving left
Convert a one on the left side into and Y
Skip all X,.,Y and ones, moving right to the end of the tape
Convert a blank into a one
Move left until you get back to the left side
Go back to state 5
When at state 5 skip blanks moving right
Convert all Ys into ones moving right
When you reach the ., move to the right and go back to state 3
When the multiplication is done, convert . into an = and all the Xs into ones