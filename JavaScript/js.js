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
		$("section.collection").append("<article>"+page.text+"</article>");	

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

function createPage(t){
	pages.push({id: newID(), text: t, date: new Date()});
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
			createPage($("div.new-page textarea").val());
			$("div.new-page textarea").val("");
			$("div.new-page").removeClass("expanded");
		}
	});
	
	$("div.new-page button.rec").click(function(){
		$("div.rest div.new-page div.sound-recorder").show();
		setTimeout(function(){
			$("div.rest div.new-page div.sound-recorder").toggleClass("expanded");
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