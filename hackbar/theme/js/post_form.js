
var fields = JSON.parse(decodeURIComponent(post_data));
var form = document.createElement("form");
form.setAttribute("method", "post");
form.setAttribute("action", decodeURIComponent(url));
fields.forEach(function(f){
	var input = document.createElement("input");
	input.setAttribute("type", "hidden");
	input.setAttribute("name", f['name']);
	input.setAttribute("value", f['value']);
	// alert(f.name);
	form.appendChild(input);
})
document.body.appendChild(form);

form.submit();

