
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

	var start_dot_originalX = 310;//310
	var start_dot_originalY = 350;//350
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
	var canvas = d3.select('.canvas')
		.append('svg')
		.attr('width',W)
		.attr('height',H)
		
	//add wheel image
	var wheel = canvas.append('g')
		.append('image')
		.attr('id','wheel-img')
		.attr('xlink:href',"../img/wheel-blur.png")
		.attr('transform','translate(-300,50)')
		
	//dots
	var dots = canvas.append('g')
		.attr('id','timeline')
		.selectAll('.dot')
		.data(rows)
		.enter()
		.append('circle')
		.attr('class','dot')
		.attr('id', (d,i)=>{return `d-${i}`})
		.attr('cx',(d)=>{
			var rotate_degree = avg_degree * (d.year-startYear);
			// console.log(degree);
			// console.log("cx-cos"+ originalX * Math.cos(toRadians(degree)));
			return (start_dot_originalX * Math.cos(toRadians(rotate_degree)));	
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
	
	var dot_1 = d3.select('#d-0')
		.style('fill','red');
	
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

	
	
	var currentDots = canvas.selectAll('.dot');
	var currentWheel = d3.select('#wheel-img');
	
	var index =0;
	//var degrees = [0,8.4,33.5,58.6,67.0,92.1,108.8,142.3,163.3,167.4,175.8];
	var degrees = [0,8.4,25.1,25.1,8.4,25.1,16.7,33.5,21,4.1,8.4]//11 elements, 10 effective ones
	var sumAngle = 0
	var wheel_sumAngle = 0
	var rotationAngle = degrees[index];
	var lastKnownPos = window.scrollY;
	//let ticking = false;
	
	//scroll  
	//var canvas_scroll = document.querySelector('.canvas');
	
	window.addEventListener('scroll', function(event){
		//document.getElementById('scrollLoc').innerHTML = window.pageYOffset + 'px';
		
		// var scrollSmoothTo = function(position){
		// 	if(!window.requestAnimationFrame){
		// 		window.requestAnimationFrame = function(callback,element){
		// 			return setTimeout(callback,17)
		// 		}
		// 	}

		// 	var scrollTop = document.querySelector('.canvas').scrollTop || document.body.scrollTop;
		// 	console.log(scrollTop);

		// 	var step = function(){
		// 		var distance = position - scrollTop;
		// 		scrollTop = scrollTop + distance/5;
				
		// 		if(Math.abs(distance)<1){
		// 			window.scrollTo(0,position);
		// 		}else{
		// 			window.scrollTo(0,scrollTop);
		// 			requestAnimationFrame(step);
		// 		}
		// 	};
		// 	step();
		// }

		// scrollSmoothTo();
		
		if(window.scrollY <=  lastKnownPos){
			if(index < 0){
				event.preventDefault();
				index = 0;
			}else if(index === 0){
				index = 0;
			}
			else{
				index --;
	
				rotationAngle = degrees[index];
				sumAngle = sumAngle - rotationAngle;
				wheel_sumAngle = wheel_sumAngle - 18;
				currentWheel
					.attr('transform',`translate(-300 50) rotate(${wheel_sumAngle} 300 300)`);
				currentDots
					.attr('transform',`translate(0 0) rotate(${sumAngle} 0 350)`);
			}
			console.log('index: '+ index);
			console.log('scroll up: '+ rotationAngle);
			//console.log(window.scrollY);
			//console.log('lastKnowPos'+lastKnownPos);
		}

		//scroll down
		if(window.scrollY >= lastKnownPos){
			if(index === degrees.length){
				event.preventDefault();
				index = degrees.length;
			}else if(index === 0){
				index = 1;

				rotationAngle = degrees[index];
				sumAngle = sumAngle + rotationAngle;
				wheel_sumAngle = wheel_sumAngle + 18;
				currentWheel
					.attr('transform',`translate(-300 50) rotate(${wheel_sumAngle} 300 300)`);
				currentDots
					.attr('transform',`translate(0 0) rotate(${sumAngle} 0 350)`);

				index ++;
			}
			else{
				rotationAngle = degrees[index];
				sumAngle = sumAngle + rotationAngle;
				wheel_sumAngle = wheel_sumAngle + 18;
				currentWheel
					.attr('transform',`translate(-300 50) rotate(${wheel_sumAngle} 300 300)`);
				currentDots
					.attr('transform',`translate(0 0) rotate(${sumAngle} 0 350)`);

				index ++;
			}
			
			console.log('index: '+ index);
			console.log('scroll down: '+ rotationAngle);
			//console.log(window.scrollY);
			//console.log('lastKnowPos'+lastKnownPos);
		}
		
		lastKnownPos = window.scrollY;
		

	})

	
})	


// if (!ticking) {
// 	window.requestAnimationFrame(function(){
// 	  ticking = false;
//    })

// 	ticking = true; 
// }		
	
	
	

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