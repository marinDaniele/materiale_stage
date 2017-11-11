function maketml(){
	var in1,in2,in3,in4;
	var data = {};

	for(var i=1; i<5; i++){
	 	if (document.getElementById("input"+i).value === "") {
	 		alert("inserire tutti i campi");
	 		return;
	 	}
	 	else{
	 		var tmp = document.getElementById("input"+i).value;
	 		console.log(tmp);
	 		var t = "input"+i;
	 		console.log(t);
	 		data[t] = tmp;
	 	}
	}
	
	console.log(data);

	$.get('templates/template1/template1.html', function(page){
		var render = Mustache.render(page,data);
		$('#templatesRe').html(render);
	});

}

function selectTemplate(elem){
	var html,css,data;
	var text = $(elem).text();

	html = text+".html";
	css = text+".css";
	json = text+".json";

	var template = {};
	$.get('templates/'+text+'/'+html, function(data){
		template.tml = data;
		console.log(template.tml);

		$.getJSON('templates/'+text+'/'+json, function(data){
			template.data = data;
			console.log(template.data);
		});
	});

}


function select2(){
	var t = {
			input1:"Lista",
			input2:"pane",
			input3:"pasta",
			input4:"pere"
			//styleSrc: "templates/template1/template1.css"
		}
	
	$.get('templates/template1/template1.html', function(pagina){
		console.log(pagina);
		var h = Mustache.to_html(pagina,t);
		$('#templatesView').html(h);
	});
}

/*
function select3(){
	var temp = "<div id=\"#template1\"><h1>{{input1}}</h1><ul><li>{{input2}}</li><li>{{input3}}</li><li>{{input4}}</li></ul></div>";
	
	$.getJSON('template1.json', function(j){
		
		var h = Mustache.to_html(temp,j);
		$('#templatesRe').html(h);
	});
}

function select4(){
	$.get('templates/template1/template1.html', function(d){
		$.getJSON('templates/template1/template1.json', function(j){
		
			var h = Mustache.to_html(d,j);
			$('#templatesRe').html(h);
		});
	});
}
*/
function getStyle(){
	console.log("lista dei fogli di stile");

	var sheet = document.styleSheets;

	$.get('templates/template1/template1.css', function(data){
		console.log(data);
		sheet[0].insertRule(data,0);
	});
	
}