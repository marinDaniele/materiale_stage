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
    templateList(3);
}

function templateList(num){
    var templateNum = num;
    ractiveObjects = [];

    for(var i = 1; i < num+1; i++){

        // creo il list item che andrà a contenere il template
        var listItem = "<li class=\"tml-list-item\"><div class=\"tml-mini\" on-click=\"insTml()\" id='template"+i+"'></div></li>";
        // appendo l'item con il contenitore
        $('#tmp-list').append(listItem);
        // carico il template i
        tmlLoad(i);
        
    }
}

function tmlLoad(pos){
    var fileName = "component"+pos+".html";
    var dirUrl = "components/component"+pos+"/";
    // setto la baseUrl dei components
    Ractive.load.baseUrl = dirUrl;
        
    Ractive.load(fileName).then(function(Template){
        var tmlId = 'template'+pos;
        ractiveObjects[pos-1] = new Template({
            el: tmlId,
        });
    });
}

$(document).ready(function(){
    $('.tml-inser-button').click( function(){
        preventDefault();
        console.log( $(this).attr('id') );
    });    
});
