var component;


function crea(){
    var title = 'Template 1';
    var index = 1;
    var file = "components/component"+index+"/component"+index+".html";
    console.log(file);
    Ractive.load(file).then( function(Template){
        component = new Template({
            el: 'template'
        }); 
    });
}


function parseJson(){
    
    var myJson;
    $.getJSON('components/component1/component1.json').then(function(json){
        myJson = json;
        $.each(json, function(key, val){
            console.log(key +" è di tipo: "+ typeof val);
        });

    });

}

function bgcolor(){
    component.set({bgcolor: 'yellow'});
}



/**
	Funzione che conta il numero di directorys
	presenti nella directory in path
*/

function countFolder(path){
    var dir= path;
    var count=0;


    /*
    conto il numero di cartelle '/component' presenti in '/components'
    e ottengo il numero dei template da caricare.

    $.ajax({
        url: dir,
        //async:false,
        success: function (data) {
            $(data).find("a:contains(" + 'component' + ")").each(function () {// function to read foldera name contains 'album'
                count++;
                //alert(url);
            });
        }
    });

    return count;
    */
}

function ShowFolders(){
	console.log(countFolder('components'));
    templateList(4);
}

/*********************************************************************
    caricamento template on load 
*********************************************************************/
function templateList(num){
    var templateNum = num;
    ractiveObjects = [];

    for(var i = 1; i < num+1; i++){

        // creo il list item che andrà a contenere il template
        var listItem = "<li class=\"tml-list-item\" style=\"width: 90%; heigth: 100px; font-size: 60%;\"><div style=\"width: 100%; heigth: auto;\"><a href=\"\" id=\"template"+i+"\" style=\"text-decoration: none;\"></a></div>";
        // html per button : <li class=\"tml-list-item\"><button class=\"button-template\" id=\"button-template"+i+"\" onclick=\"buttonTml(this)\">Template "+i+"</button></li>
        // appendo l'item con il contenitore
        $('#tmp-list').append(listItem);
        // carico il template i
        tmlLoad(i);
        
    }
}



function tmlLoad(pos){
    var fileName = "components/component"+pos+"/component"+pos+".html";
        
    Ractive.load(fileName).then(function(Template){
        var tmlId = 'template'+pos;
        ractiveObjects[pos-1] = new Template({
            el: tmlId,
        });
    });
}

$('document').ready(function(){
    $('.tml-list-item a').on('click', function(event){
        event.preventDefault();
        event.stopPropagation();
        console.log(event);
    });
});