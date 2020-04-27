
//import csv
const dataPromise = d3.csv('../data/data-sample.csv', parseData);

//
const W = d3.select('.canvas').node().clientWidth;
const H = d3.select('.canvas').node().clientHeight;
const m = {t:50, r:50, b:50, l:50};
const w = W - m.r - m.l;
const h = H - m.t - m.b;
console.log(`W,H:${W},${H}`);

	


//d3.json("data-sample.json").then(data=>{})
dataPromise.then(function(rows){
		console.log(rows);

		var count_year =rows.length;

		const canvas = d3.select('.canvas')
			.append('svg')
			.attr('width',W)
			.attr('height',H)
			.append('g')
			.attr('transform',`translate(0,${m.t})`)
			.attr('width',w)
			.attr('height',h);

	const c = canvas.append('circle')
			.attr('class','wheel')
			.attr('cx',50)
			.attr('cy',20)
			.attr('r',20);

	const line = canvas.append('line')
			.attr("x1", 50)
			.attr("y1", 20)
			.attr("x2", 70)
			.attr("y2", 20)
			.style('stroke','black')
			.style('stroke-width','2pt');
	
	c.on("click",function(d){
		if(d.clicked === true){
			d.clicked = false;
		}
		line.attr('transform','rotate(-45,50,20)');
		});

		// var wheel = canvas.append('circle')
		// 	.attr('class','wheel')
		// 	.attr('cx',0)
		// 	.attr('cy',400)
		// 	.attr('r',400);

		//wheel image
		var wheel = canvas.append('image')
			.attr('id','wheel-img')
			.attr('transform','translate(-430,50)')
			.attr('xlink:href',"../img/wheel.png");

		// //label dots
		// var nodes = canvas.selectAll('.node')
		// 	.data(rows);
		// nodes.select('.circle')
		// 	.style('fill','green')	
		
		// const nodesEnter = nodes.enter()
		// 	.append('g')
		// 	.attr('class','dots');
		// nodesEnter.append('.circle')
		// 	.style('fill','yellow');

		// nodes.merge(nodesEnter)
		// 	.transition()
		// 	.
		// 	.enter()
		// 	.append('.circle')
		// 	.attr('cx','420px')
		// 	.attr('cy','400')
		// 	.attr('r',2)
		// 	.style('fill','black');

		
		var rotateTimes = 0;
		var i=0;

		// var textBox = d3.select('.textbox')
		// 	.attr('transform',`translate(50,200)`)
		// 	.attr('width',200)
		// 	.attr('height',80);

		var textTimes = canvas.append('text')
			.attr('transform','translate(50,250)')
			.text('rotate times');
		var textCity = canvas.append('text')
			.attr('transform','translate(50,280)')
			.text('city');

		canvas.on("click", function(){
			console.log(`i= ${i}`);
			console.log(`rotateTimes= ${rotateTimes+1}`);
			
			rotateTimes++;
			
			wheel.transition()
				.attr('transform','rotate(-30)');
			
			textTimes.text(function(){
				return `rotate ${rotateTimes}`;
			})
			textCity.text(function(){
				if(i>=count_year){
					i=0;
				}
				return rows[i].city;
			})
			i++;
			
		})

		
	})

function rotateWheel(){
	var lastDegrees = 1;
}


//parse csv
function parseData(d){
	return {
		year: +d.Year,
		city: d.City,
		title: d.Title,
		date: d.Date,
		story: d.Story
	}
}