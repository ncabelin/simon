$(function() {
	var check = true,
    won = false,
	  strict = false,
	  series = [],
	  moves = [],
	  start = false,
	  idVal = {
  		1:"greenB",
  		2:"redB",
  		3:"yellowB",
  		4:"blueB"
	  },
	  counter = $("#counter"),
	  wrong = $("#wrong"),
	  emptyW = function() { setTimeout(function() { wrong.html(" "); }, 3000); };

	function restart() { // restart function
		series = [];
		moves = [];
		won = false;
		strict = false;
		counter.attr("value", 0);
		start = false;
		check = true;
	}

	function Button(id, value, colOrig, colNew, soundS, name) { // Button constructor
		this.id = id;
		this.value = value;
		this.colOrig = colOrig;
		this.colNew = colNew;
		this.soundS = soundS;
		this.name = name;
	}

	var greenB = new Button("#greenB", 1, "#007000", "#009900", "audio1", "greenB");
	var redB = new Button("#redB", 2, "red", "#FF5600", "audio2", "redB");
	var yellowB = new Button("#yellowB", 3, "yellow", "white", "audio3", "yellowB");
	var blueB = new Button("#blueB", 4, "blue", "#009DFF", "audio4", "blueB");

  var buttons = {greenB, redB, yellowB, blueB};

	Button.prototype.clicked = function() {
		var audio = document.getElementById(this.soundS); // plays sound
		audio.play();
		$(this.id).css("backgroundColor", this.colNew); // lightens up cell upon click
		var z = buttons[this.name];
		setTimeout(function() { z.original(); }, 500); // brings cell color back to original
	}

	Button.prototype.original = function() {
		$(this.id).css("backgroundColor", this.colOrig); // cell color change function
	}

	// computer moves
	function moveArr() {
		if (check) {
			var rand = Math.floor((Math.random() * 4) + 1);
			moves.push(rand);
		}
		counter.attr("value", moves.length);
		var delay = 0;
		moves.forEach(function(d) { // iterate through moves array and click cells
			var compMove = idVal[d];
			setTimeout(function() { buttons[compMove].clicked(); }, delay);
			delay += 700;
		});
		start = false;
		setTimeout(function() {
			start = true;
		}, delay);
	}

	$(".cells").click(function() {
		if (start) {
			var cell = buttons[this.id];
			cell.clicked(); // manipulate cell colors and play sound
			series.push(cell.value); // push value to series array
			// if (series.length == moves.length) {
				for (var i = 0; i < series.length ; i++) { // go through series array
					if (series[i] != moves[i]) {
						check = false;
						wrong.html("<span class='red'>WRONG! TRY AGAIN</span>");
						emptyW();
						setTimeout(function() { moveArr(); }, 1500);
						series = [];
						if (strict == true) {
							restart();
							wrong.html("<span class='red'>RESTARTING</span>");
							emptyW();
							return;
						}
						return;
					} else {
						check = true;
					}
				}
				if (check == true && series.length == moves.length) {
					if (moves.length < 20) {
						wrong.html("<span class='green'>CORRECT !</span>");
						emptyW();
						setTimeout(function() { moveArr(); }, 1500);
						series = [];
					} else {
						restart();
						wrong.html("<span class='green'>20 MOVES DONE! YOU WON</span>");
					}
				}
		}
	});

	$("#start").click(function() {
		start = true;
		$("#start").css("display", "none");
		$("#restart").css("display", "inline");
		setTimeout(function() { moveArr(); }, 700); // comp generates random cell move
	});

	$("#restart").click(function() {
		$("#start").css("display", "inline");
		$("#restart").css("display", "none");
		restart();
	});

	$("#strict").click(function() {
		if (strict == false) {
			return strict = true;
		}
		strict = false;
	});

	$("#rewind").click(function() {
		check = false;
		moveArr();
		check = true;
	})
});