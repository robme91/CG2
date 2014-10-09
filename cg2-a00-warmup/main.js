
/*
 * This is main.js which is referenced directly from within
 * a <script> node in index.html
 */

// "use strict" means that some strange JavaScript things are forbidden
"use strict";

// this shall be the function that generates a new phone book object
var makePath = function(separator) {
	separator = (typeof separator === "undefined") ? "" : separator;
	
	var str = new String;
	var pathObject = function(arg){
		if( arg != undefined ){
			if(str.length != 0 ){
				return str += separator + arg;	
			}else return str += arg;
		}
		return str;
	}
	return pathObject;
};

// the main() function is called when the HTML document is loaded
var main = function() {

	// create a path, add a few points on the path, and print it
	var path1 = makePath(",");
	path1(""); 
	path1("Prag");
	path1("New York");
	window.console.log("path 1 is " + path1() );

};
