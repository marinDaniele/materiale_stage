var component;

function crea(){
	var title = 'Template 1';
	var i = 1;
	var file = "components/component"+i+"/component"+i+".html";
	Ractive.load(file).then( function(Template){
		component = new Template({
			el: 'template'
			
		});	
	});
	
}

function sposta(){
	component.set({x:10});
	component.set({y:20});
}

function bgcolor(){
	component.set({bgcolor: 'yellow'});
}