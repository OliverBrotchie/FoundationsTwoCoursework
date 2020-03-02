//Code for interacting with the user interface
var c = new Interface(document.getElementById('example').firstElementChild,()=>{},{
	messageOptions: {
		tags:{
			tagStyles:{
				You:"client",
				Console:"host"
			}
		}
	},
	code: {
		usage:false
	}
});

c.onMessage = (input) =>{

	var output = [];

	input = input.text;
	input[1] = input[1].split('');

	if(input[1][0] != "B"){
		input[1].unshift("B");
	}

	if(input[1][input[1].length-1] != "B"){
		input[1].push("B");
	}

	for(var i = 0; i<input[1].length;i++){

		if(input[1][i] != ','){
			if(isNaN(input[1][i])){
				output.push(input[1][i])
			} else {
				output.push(eval(input[1][i]));
			}
		}
	}

	var tape =  new Tape(output);
	tape.right();

	var t = new TuringMachine(tape,null);

	if(input[0] == "add"){
		
		t.add();
	
	} else {
		t.mult();
	}

	c.out(new Message({text: t.history[t.history.length-1],tag:'Console'}));
}

c.element.inputBox.focus();
c.out(new Message({text:"Welcome to Turing.js!",tag:"Console"}));
setTimeout(()=>{
	c.out(new Message({text:"Please enter the transition function type (add or mult), followed by the desired input.",tag:"Console"}));
	setTimeout(()=>{
		c.out(new Message({text:"For example: mult 11.1111 would multiply 2x4",tag:"Console"}));
	},1500);
},1500);