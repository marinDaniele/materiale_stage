var ractive = null;


//indice del template
var pos = 4;

function ractiveLoad(){
	
	
	// recupero il json del template tml+pos
	$.getJSON('templates/tml'+pos+'/tml'+pos+'.json', function(json){

		// creo istanza ractive con template tml+pos e i dati del json recuperato
		Ractive.load('templates/tml'+pos+'/tml'+pos+'.html').then( function(Tml){
			ractive = new Tml({
				el: '#demo',
				data: json
			});
		});
	});
	
}

function takeJson(){
	console.log('parse => ');
	$.getJSON('templates/tml'+pos+'/tml'+pos+'.json', function(file){
		
		parse2(file);
	});
}


function parse2(obj)
{
    for (var k in obj)
    {
        if (typeof obj[k] == "object" && obj[k] !== null){
        	console.log(k+' = '+obj[k]+' ---> '+typeof(obj[k]));
            parse2(obj[k]);
        }
        else
           console.log(k+' = '+obj[k]+' ---> '+typeof(obj[k])); 
    }
}

function clean(){
	ractive.teardown();
}