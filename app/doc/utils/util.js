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


/**
 * 数组去初undefined、null、‘’
 */
export const cleanArr = function (arr) { 
	if(Object.prototype.toString.call(arr) != "[object Array]"){
		arr = []
	}
   
	for(let i = 0; i < arr.length; i++ ){
		if(arr[i] === undefined || arr[i] === null || arr[i] == 'undefined' || arr[i] == ''){
			arr.splice(i,1)
			i--
		}
	}
	return arr; 
}



/**
*  闭包共享timer
* @param fn {Function}   实际要执行的函数
* @param threshhold {Number}  执行间隔，单位是毫秒（ms）
* @param type {String}  是否第一次执行
* @return {Function}     返回一个“节流”函数
*/
export const throttle = (fn, threshhold, type) =>  {

  // 记录是否可执行
  let isRun = true;

  // 定时器
  let timer;

  type = type || true;

  // 默认间隔为 200ms
  threshhold || (threshhold = 200)

  // 返回的函数，每过 threshhold 毫秒就执行一次 fn 函数
  return function () {

    // 保存函数调用时的上下文和参数，传递给 fn
    let context = this;
    let args = arguments;

    //第一次执行
    if(type && 'undefined' == typeof timer){
    	fn()  
    }

    if(!isRun)return;

    isRun = false;

    //保证间隔时间内执行
	timer = setTimeout(function () {
	   fn.apply(context, args)
	   isRun = true;
	}, threshhold)    

  }
}


/**
 *
 * @param fn {Function}   实际要执行的函数
 * @param delay {Number}  延迟时间，单位是毫秒（ms）
 *
 * @return {Function}     返回一个“防反跳 debounce”了的函数
 */
export const debounce = (fn, delay) => {

  // 定时器，用来 setTimeout
  let timer

  // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
  return function () {

    // 保存函数调用时的上下文和参数，传递给 fn
    let context = this
    let args = arguments

    // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
    clearTimeout(timer)

    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay || 0)
  }
}