
//import csv
const dataPromise = d3.csv('../data/data-sample.csv', parseData);

//
const W = d3.select('.canvas').node().clientWidth;
const H = d3.select('.canvas').node().clientHeight;
const m = {t:50, r:50, b:50, l:50};
const w = W - m.r - m.l;
const h = H - m.t - m.b;
console.log(`W,H:${W},${H}`);

window.addEventListener('scroll', function(){
	// detects new state and compares it with the new one
	if ((document.body.getBoundingClientRect()).top > scrollPos){
		document.getElementById('info-box').setAttribute('data-scroll-direction', 'UP');
	}  
	else{
		document.getElementById('info-box').setAttribute('data-scroll-direction', 'DOWN');
	}	  
	// saves the new position for iteration.
	scrollPos = (document.body.getBoundingClientRect()).top;
  });


//d3.json("data-sample.json").then(data=>{})
dataPromise.then(function(rows){
	console.log(rows);

	var start_dot_originalX = 310;
	var start_dot_originalY = 350;
	var dot_radius = 5;
	var startYear = rows[0].year;
	var count_year = rows[rows.length-1].year-startYear+1;//number of all dots
	var avg_degree = 180/count_year;

	var rotating_degrees =[];

	//calculate rotating degrees
	for(i=1;i<rows.length;i++){
		var interval_year = rows[i].year-startYear;
		var new_element = d3.format(".1f")(avg_degree * interval_year); 
		rotating_degrees.push(new_element);		
	}
	console.log(`degrees have ${rotating_degrees.length} elements: ${rotating_degrees}`);

	//add svg	
	const canvas = d3.select('.canvas')
		.append('svg')
		.attr('width',W)
		.attr('height',H)
		
	//add wheel image
	var wheel = canvas.append('g')
		.append('image')
		.attr('class','wheel-img')
		.attr('xlink:href',"../img/wheel-blur.png")
		.attr('transform','translate(-300,50)')
		

	//dots
	var dots = canvas.append('g')
	
	dots.selectAll('.dot')
		.data(rows)
		.enter()
		.append('circle')
		.attr('class','dot')
		.attr('cx',(d)=>{
			var rotate_degree = avg_degree * (d.year-startYear);
			// console.log(degree);
			// console.log("cx-cos"+ originalX * Math.cos(toRadians(degree)));
			return start_dot_originalX * Math.cos(toRadians(rotate_degree));	
		})
		.attr('cy',(d)=>{
			var rotate_degree = avg_degree * (d.year-startYear);
			if(rotate_degree<=90){
				//console.log("cy-sin"+Math.sin(toRadians(degree)));
				return start_dot_originalX * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
			}else if (rotate_degree < 180){
				//console.log("cy-sin"+Math.sin(toRadians(degree)));
				return start_dot_originalX * Math.sin(toRadians(180-rotate_degree)) + start_dot_originalY;
			}
		})
		.attr('r',dot_radius)
		.style('fill','grey');


	//interaction-rotation

	//window.addEventListener('scroll', callback());
	
	// window.addEventListener('scroll', throttle(callback,500));
	// function throttle(fn,wait){
	// 	var time = Date.now();
	// 	return function(){
	// 		if(time+wait-Date.now()<0){
	// 			fn();
	// 			time=Date.now();
	// 		}
	// 	}
	// }

	var index =0;
	var scrollDistance = 0;
	var currentDots = dots.selectAll('.dot');
	var currentWheel = d3.select('.wheel-img');
	//var curretDistance = document.body.scrollTop();
	
	window.addEventListener('wheel', function(event){
		//8.4,33.5,58.6,67.0,92.1,108.8,142.3,163.3,167.4,175.8
		//var rotateDegrees = rotating_degrees[index];

		//scroll up
		if (event.deltaY < 0){
			console.log(`scrolling up: ${event.deltaY}`);
			console.log("initial index: "+index);

			index--;

			if(index < 0){
				event.preventDefault();
				index = 0;
			}else{
				
				scrollDistance -= event.deltaY;

				currentWheel.attr('transform', `translate(-300, 50) rotate(${-rotating_degrees[index]} 300 300)`);
				currentDots.attr('transform',`rotate(${-rotating_degrees[index]} 0 350)`);

				currentWheel = currentWheel.attr('transform', `translate(-300, 50) rotate(${rotating_degrees[index]} 300 300)`);
				currentDots = currentDots.attr('transform',`rotate(${rotating_degrees[index]} 0 350)`);
				
				console.log("["+index+"]"+ (-1)*rotating_degrees[index]);
			}
		}
		//scroll down
		if (event.deltaY > 0){
			console.log(`scrolling down: ${event.deltaY}`);
			console.log("initial index: "+index);

			if(index <0){
				index=0;

				scrollDistance += event.deltaY;
				currentWheel.attr('transform', `translate(-300, 50) rotate(${rotating_degrees[index]} 300 300)`);
				currentDots.attr('transform',`rotate(${rotating_degrees[index]} 0 350)`);

				currentWheel = currentWheel.attr('transform', `translate(-300, 50) rotate(${rotating_degrees[index]} 300 300)`);
				currentDots = currentDots.attr('transform',`rotate(${rotating_degrees[index]} 0 350)`);

				console.log("["+index+"]"+rotating_degrees[index]);

				index++;
				
			}else if(index>=0 && index<rotating_degrees.length){
				scrollDistance += event.deltaY;
				//var rotateDegrees = scrollDistance/5;//test angle
				
				currentWheel.attr('transform', `translate(-300, 50) rotate(${rotating_degrees[index]} 300 300)`);
				currentDots.attr('transform',`rotate(${rotating_degrees[index]} 0 350)`)

				currentWheel = currentWheel.attr('transform', `translate(-300, 50) rotate(${rotating_degrees[index]} 300 300)`);
				currentDots = currentDots.attr('transform',`rotate(${rotating_degrees[index]} 0 350)`);
				
				console.log("["+index+"]"+rotating_degrees[index]);

				index++;
			}else if(index === (rotating_degrees.length)){
				event.preventDefault();
			}
		}
	},
	{passive: false});	
	


	// function rotTween(a,b){
	// 	var func = d3.interpolate(a,b);
	// 	return function(t){
	// 		return "rotate(" + func(t) + ",0,300)";
	// 	};	
	// }

	// function rotTween(){
	// 	var func = d3.interpolate(0,360);
	// 	return function(t){
	// 		return "rotate(" + func(t) + ",0,300)";
	// 	};	
	// }
	
	//const alreadyTransformed = wheel.attr('transform');
	//console.log(alreadyTransformed);

	// var interpol_rotate = [];
	// for(i=0;i<3;i++){
	// 	interpol_rotate[i] = d3.interpolateString("rotate("+ 45*i +",0,300)", "rotate("+ 45*(i+1) +",0,300)");
	// }
	// console.log(interpol_rotate);
	

	// function debounce (func, interval) {
	// 	var timeout;
	// 	return function () {
	// 	  var context = this, args = arguments;
	// 	  var later = function () {
	// 		timeout = null;
	// 		func.apply(context, args);
	// 	  };
	// 	  clearTimeout(timeout);
	// 	  timeout = setTimeout(later, interval || 200);
	// 	}
	//   }




		
	//text

	// create a new div element 
	var newDiv = document.createElement("div"); 
	// //Add content
	newDiv.innerHTML="Title"; 
	newDiv.setAttribute('class','main-items');
	document.body.appendChild(newDiv);
	

	var rotateTimes = 0;
	var i=0;
	var t=0

		// var textBox = d3.select('.textbox')
		// 	.attr('transform',`translate(50,200)`)
		// 	.attr('width',200)
		// 	.attr('height',80);

	// var textTimes = canvas.append('text')
	// 	.attr('transform','translate(50,250)')
	// 	.text('rotate times');
	// var textCity = canvas.append('text')
	// 	.attr('transform','translate(50,280)')
	// 	.text('city');
		
	
	

		
	//rotation		
		// canvas.on("click", function(){
				
		// 		console.log(`i= ${i}`);
		// 		console.log(`rotateTimes= ${rotateTimes+1}`);
				
		// 		clickStatus = "true"

		// 		rotateTimes++;
				
		// 		wheel.transition()
		// 			.attr('transform','rotate(90,0,250)');
				
		// 		textTimes.text(function(){
		// 			return `rotate ${rotateTimes}`;
		// 		})
		// 		textCity.text(function(){
		// 			if(i>=count_year){
		// 				i=0;
		// 			}
		// 			return rows[i].city;
		// 		})
		// 		i++;
				
		// 	})
		
		

		
	})
function toRadians (angle) {
	return angle * (Math.PI / 180);
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