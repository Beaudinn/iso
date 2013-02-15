// JavaScript Document


function changeCssClass(from, to)
{ 
	var elems = document.getElementsByClassName(from)
	for( var i in elems )
	{
		elems[i].className = to;
	alert(elems[i]);
}}