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
function newID(){
	
	return "3";
}

function getColor(){
	return "green";
}

function updateStream(){
	$("section.collection").html("");
	$.each(pages, function(index, page){
		$("section.collection").append("<article>"+page.text+"</article>");	
		
	});
}


function createPage(t){
	pages.push({id: newID(), text: t, date: new Date()});
	localStorage.setItem("pages", JSON.stringify(pages));
	updateStream();
}

function createNotebook(n){
	notebooks.push({name: n, color: getColor()});
}


$(function(){
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
		$("nav").toggleClass("expanded");
	});
	
	$("div.new-page").click(function(){
		$(this).addClass("expanded");
	});
	
	$("div.new-page button.done").click(function(){
		createPage($("div.new-page textarea").val());
		$("div.new-page textarea").val("");
		$("div.new-page").removeClass("expanded");
	});
});