


$(function(){
	$("button.menu").click(function(){
		$("nav").toggleClass("expanded");
	});
	
	$("div.new-post").click(function(){
		$(this).addClass("expanded");
		$(this).removeClass("unexpanded");
	});
});