function isType (type) {
	return function (obj) {
		return Object.prototype.toString.call(obj) === "[object " + type + "]"
	}
}
// HMR interface
if(module.hot) {
  // Capture hot update
  module.hot.accept()
}

//https://github.com/leizongmin/js-xss
export const xss = function (str) { 
	let REGEXP_LT = /</g;
	let REGEXP_GT = />/g;
	let REGEXP_QUOTE = /"/g;
	let REGEXP_QUOTE_2 = /&quot;/g;
	return str.replace(REGEXP_LT, '&lt;').replace(REGEXP_GT, '&gt;').replace(REGEXP_QUOTE, '&quot;').replace(REGEXP_QUOTE_2, '"')
}

//去重之后顺序 如 [1,2,3,4,1,2] =》 [1,2,3,4]
export const unqie = function (arr) { 
	if(Object.prototype.toString.call(arr) != "[object Array]"){
		arr = []
	}
  	let len=arr.length, obj={}, newArr=[], i = 0     

	  while(i<len){ 
	      if(obj[ arr[i] ] !== arr[i]){ 
	            obj[arr[i]] = arr[i];   
	            newArr.push( arr[i]); 
	      } 
	      i++       
	  } 
	return newArr
}

//去重之后顺序 如 [1,2,3,4,1,2] =》 [2,1,4,3]
export const backUnqie = function (arr) { 
	if(Object.prototype.toString.call(arr) != "[object Array]"){
		arr = []
	}
  	var len=arr.length, obj={}, newArr=[];      

	  while(len--){ 
	           if(obj[ arr[len] ] !== arr[len]){ 
	                obj[arr[len]] = arr[len];   
	                newArr.push( arr[len]); 
	          }  
	  } 
	return newArr.reverse(); 
}

export class checkType {
	constructor ( ) {

	}	

	toIsType (type) {
		return function (obj) {
			return Object.prototype.toString.call(obj) === "[object " + type + "]"
		}		
	}

	isString (obj) {
		return this.toIsType("String")(obj)
	}

	isObject (obj) {
		return this.toIsType("Object")(obj)
	}

	isArray (obj) {
		return this.toIsType("Array")(obj)
	}
}
// sessionStorage.setItem("docs_data", JSON.stringify({_time: (new Date()).valueOf() }))
export class sessionPosition {
	constructor( ) {

	}	
	//opts.pos, opts.active
	sessionStorage (opts) {
		let data = this.getSession()
		if(opts.pos !== 'undefined' && opts.pos !== '')data.pos = opts.pos
		if(opts.active || 0 == opts.active)data.active = opts.active
		data._time = (new Date()).valueOf()
		sessionStorage.setItem("docs_data", JSON.stringify( data ) )
	}

	getSession () {
		if(sessionStorage.getItem("docs_data")){
			let now = (new Date()).valueOf()
			let data = JSON.parse( sessionStorage.getItem("docs_data") )
			//session有效期6个小时
			if(now - data._time > 6*60*60*1000){
				return {}
			}else{
				return data
			}
		}else{
			return {}
		}

	}

}