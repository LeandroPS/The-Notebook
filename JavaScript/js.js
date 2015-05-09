var color = "#000";

if (localStorage.getItem("notebooks") === null) {
	localStorage.setItem("notebooks", "[]");
	var notebooks = [];
}else{
	var notebooks = JSON.parse(localStorage.getItem("notebooks"));
}

if (localStorage.getItem("pages") === null) {
	localStorage.setItem("pages", "[]");
	var pages = [];
}else{
	var pages = JSON.parse(localStorage.getItem("pages"));
}

function sortByDate(a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
}

function newID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function getColor(){
	return "green";
}

function updateStream(){
	$("section.collection").html("");
	pages.sort(sortByDate);

	$.each(pages, function(index, page){
		var p = jQuery("<article></article>");
		var span = jQuery("<span></span>");
		span.addClass("text");
		span.append(page.text);
		p.append(span);
		console.log("ate ");
		if(page.scratches!=null){
			console.log("ate´aqui");
			for(var i=0; i<page.scratches.length; i++){
				var s =jQuery("<img/>");
				s.attr("src", page.scratches[i]);
				s.addClass("scratch");
				p.append(s);
			}
			
		}
		
		
		$("section.collection").append(p);
	

	});
}

function updateNotebookList(){
	$("nav ul.notebooks").html("");
	notebooks.sort(sortByDate);

	$.each(notebooks, function(index, notebook){
		var n = jQuery('<li><span class="fa fa-book"></span>'+notebook.title+'</li>');
		n.css("color", notebook.color);
		$("nav ul.notebooks").append(n);	

	});
	
}

function createPage(t, s, a, p, n){
	pages.push({id: newID(), text: t, date: new Date(), scratches: s, audios: a, pictures: p, notebook: n });
	localStorage.setItem("pages", JSON.stringify(pages));
	updateStream();
}

function createNotebook(n, c){
	notebooks.push({id: newID(), title: n, date: new Date(), color: c});
}

function search(s){
	var list = [];

	for(i=0;i<pages.length;i++){
		str = pages[i].text.toLowerCase();
		if(str.search(s.toLowerCase())!=-1){
			list.push(pages[i]);
		}
	}
	return list;
}


function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
        switch(event.type)
    	{
        	case "touchstart": type = "mousedown"; break;
        	case "touchmove":  type="mousemove"; break;        
        	case "touchend":   type="mouseup"; break;
        	default: return;
    	}

             //initMouseEvent(type, canBubble, cancelable, view, clickCount, 
    //           screenX, screenY, clientX, clientY, ctrlKey, 
    //           altKey, shiftKey, metaKey, button, relatedTarget);

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                              first.screenX, first.screenY, 
                              first.clientX, first.clientY, false, 
                              false, false, false, 0/*left*/, null);

                                                                                 first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

$(function(){
	updateStream();
	/*
	if (localStorage.getItem("Notebooks") === null) {
  		localStorage.setItem("Notebooks", []);
	}
	
	if (localStorage.getItem("pages") === null) {
		localStorage.setItem("Notebooks", []);
	}
	
	if (localStorage.getItem("pages") === null) {
		localStorage.setItem("pages", []);
	}
	*/
	$("button.menu").click(function(){
		$("nav, div.cover").addClass("expanded");
	});
	
	$("input.search").keyup(function(){
		if($(this).val()!=""){
			$("nav ul, nav div.line, nav div.new-notebook").fadeOut();
			$("nav section.search-results").fadeIn();
			var result = search($(this).val());
			$("nav section.search-results").empty();
			for(var i = 0; i<=result.length; i++){
				$("nav section.search-results").append("<article>"+result[i].text+"</article>");
			}
		}else{
			$("nav section.search-results").empty();
			$("nav ul, nav div.line, nav div.new-notebook").fadeIn();
			$("nav section.search-results").fadeOut();
		}
		
	})
	
	$("div.new-page").click(function(){
		$(this).addClass("expanded");
		$("div.new-page textarea").focus();
	});
	
	$("div.new-page button.done").click(function(){
		if($("div.new-page textarea").val()!=""){
			
			scratches = [];
			$("div.new-page img.scratch").each(function(){
				scratches.push($(this).attr("src"));
			});
			createPage($("div.new-page textarea").val(), scratches, null, null, null);
			$("div.new-page").removeClass("expanded");
			$("div.new-page textarea").val("");
		}
	});
	
	$("div.new-page div.scribble button.add").click(function(){
		alert("heeey");
		var urld = $("div.new-page div.scribble canvas.canvas").get(0).toDataURL();
		var img = jQuery("<img/>");
		img.attr("src", urld);
		img.addClass("scratch");
		$("div.new-page").append(img);
		$("div.new-page div.scribble").removeClass("expanded");
	});
	
	$("div.new-page button.rec").click(function(){
		$("div.rest div.new-page div.sound-recorder").show();
		setTimeout(function(){
			$("div.rest div.new-page div.sound-recorder").toggleClass("expanded");
		}, 50);
	});
	
	$("div.new-page button.scratch").click(function(){
		$("div.rest div.new-page div.scribble").show();
		setTimeout(function(){
			$("div.rest div.new-page div.scribble").toggleClass("expanded");
		}, 50);
		
		var can = $("div.rest div.new-page div.scribble canvas.canvas");
		
		can.attr("width", can.parent().width());
        can.attr("height", can.parent().height());
	});
	
	$("div.new-page button.notebook").click(function(){
		$("div.rest div.new-page div.notebook-list").show();
		setTimeout(function(){
			$("div.rest div.new-page div.notebook-list").toggleClass("expanded");
		}, 50);
	});
	
	$("div.new-page button.cam").click(function(){
		$("div.rest div.new-page div.camera canvas.screen").attr('width', $("div.new-page").width());
		$("div.rest div.new-page div.camera canvas.screen").attr('height', $("div.new-page").height());
		$("div.rest div.new-page div.camera").show();
		setTimeout(function(){
			$("div.rest div.new-page div.camera").toggleClass("expanded");
		}, 50);
		
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
		
		if(navigator.getUserMedia){
			navigator.getUserMedia({video: true, audio: false}, handleVideo, videoError);
			//navigator.getUserMedia("video", handleVideo, videoError);
			console.log("I got here 1");
			var vid = document.getElementById("screen");

			function handleVideo(stream) {
				// if found attach feed to video element
				console.log("I got here");
				vid.src = window.URL.createObjectURL(stream);
				//vid.src = stream;
			}

			function videoError(e) {
				console.log(e);
			}
		}else{
			console.log("eeeeita :p");	
		}
		
	});
	
	$("div.new-page div.extra canvas.canvas").each(function(index){

        this.addEventListener("touchstart", touchHandler, true);
        this.addEventListener("touchmove", touchHandler, true);
        this.addEventListener("touchend", touchHandler, true);
        this.addEventListener("touchcancel", touchHandler, true); 

        ctx = this.getContext("2d");
        ctx.lineCap = 'round';
        ctx.lineWidth = 2;
		
		var desenhando = false;


        this.onmousedown = function (evt) {	
            ctx.moveTo(evt.clientX - $(this).offset().left, evt.clientY - $(this).offset().top);
            ctx.beginPath();
            ctx.strokeStyle = color;

            desenhando = true;
        }

        this.onmouseup = function () {
            desenhando = false;               
        }

        this.onmousemove = function (evt) {
            if (desenhando) {
                ctx.lineTo(evt.clientX - $(this).offset().left, evt.clientY - $(this).offset().top);
                ctx.stroke();
            }
        }

    });
	
	$("div.new-page div.extra button.cancel").click(function(){
		$(this).parent().toggleClass("expanded");
	});
	
	$("div.cover").click(function(){
		$("nav, div.cover").removeClass("expanded");
	});
	
	$("nav div.new-notebook input").click(function(){
		var color = getColor;
		$("nav div.new-notebook, nav div.new-notebook input").css("color", color);
		$("nav div.new-notebook input").attr("data-color", color);
	});
	
	$("nav div.new-notebook input").keyup(function(e){
		if(e.which==13){
			createNotebook($(this).val(), $(this).attr("data-color"));
		
			$(this).blur();
			updateNotebookList();
		}
	});
	
	$("nav div.new-notebook input").focusout(function(){
		$("nav div.new-notebook, nav div.new-notebook input").css("color", "#000");
		$("nav div.new-notebook input").attr("data-color", "");
		$("nav div.new-notebook input").val("");
	});
	
	$("div.rest section.collection article").click(function(){
		$(this).addClass("layout-entire-w");
	});
	
});