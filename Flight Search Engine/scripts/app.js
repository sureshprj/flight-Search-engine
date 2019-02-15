
//getting json data
	var livetrips = response.trips; 

//global variable declaration
	var sortType = {
			depart:'',
			price:''
		}
	var isTwoWay = false;	
	var passangerCount =0;

/* ************Common helper functions******************** */

	//To help dom manipulation
	function element(id,html="",style={},prop={}){
		let dom = document.getElementById(id);
		try{
			let styleProp = Object.keys(style);
			let props = Object.keys(prop);
			if(dom){ // dom found
				if(html !=""){
					dom.innerHTML = html;
				}
				if(styleProp.length != 0){
					styleProp.forEach(key=>dom.style[key] = style[key])
				}
				if(props.length != 0){
					props.forEach(key=>dom[key] = prop[key])
				}
			}else{ // dom not found
				return undefined; 
			}
		}catch(err){
			console.error("something went wrong");
		}
		
		return dom;
	}
	//To get date format for Datepicker
	function getFormat(dateObj=new Date()){
		let date = dateObj.getDate();
		let month =dateObj.getMonth() +1
		let dateStr = dateObj.getFullYear() + "-"+ (month < 10 ? ("0"+month) : month )+ "-" +( date < 10 ? ("0"+date) : date);
		return dateStr;
	}
	
	//get date for user readable format 
	function dateAsText(dateObj){
		dateObj = new Date(dateObj);
		  let fomat={
			  1:"st",
			  2:"nd",
			  3:"rd",
			  4:"th"
		  }
		 let date = dateObj.getDate();
		 let year = dateObj.getFullYear();
		 let month = dateObj.toLocaleString("en-us", { month: "short" });
		 return date + fomat[date>3?4:date] +" "+ month +" "+ year
	}
	
	//show validation message
	function showError(element,msg="required"){
		element.style.border ="3px solid red";
		element.parentElement.className = element.parentElement.className + " tooltip";
		element.nextElementSibling.innerHTML = msg;
	}
	
	//hide validation message
	function removeError(element){
		element.style.border ="1px solid black";
		element.parentElement.className = element.parentElement.classList[0];
		element.nextElementSibling.innerHTML =""
	}
	
/* ******************** END ************************* */

	//intial form values
	function prepareForm(){
		autoCompleteCity(response.cities);
		setMinDate();
		setTrip(1);
		setDefaultValue();
	}
	
	//To display autocomplete orign/destination cities options 
	function autoCompleteCity(city){
		let html ='';
		for(let i=0;i<city.length;i++){
			html +=`<option value="${city[i]}">`
		}
		//document.getElementById('cities').innerHTML = html;
		element('cities',html);
	}
	
	//To set min date for from/to date
	function setMinDate(){
		let form = element("searchFlight");
		let minDate = getFormat(new Date());
		form["fromDate"].min = minDate;	
		form["fromDate"].value = minDate;
		form["toDate"].min =minDate;
		form["toDate"].value = minDate;
	}
	
	//To show/hide application loader
	function pageLoader(prop=false){
		element("loading",'',{display:"block"})
		if(prop == false){
			setTimeout(()=>{
				element("loading",'',{display:"none"})
			},300)
		}				
	}
	
	//set form default values
	function setDefaultValue(){
		let form = element("searchFlight");
		form["fromPlace"].value = "Chennai";
		form["toPlace"].value = "Delhi";
		form["count"].value = 1;
	}
	
	//initialize events
	function initiateEvents(){
		Array.from(document.getElementsByClassName("inputBox")).forEach(element=>
			element.addEventListener("focus",
				function() { 
					removeError(this)
				}
			)
		)
		
	}
	
	//To select trip type oneway/twoway
	function setTrip(way = 1){
		let form = document.getElementById("searchFlight");
		let select ={backgroundColor:"#000",border : "1px solid #ad885b"}
		let unselect ={backgroundColor:"#420d0d",border : "none"}
		
		if(way == 1) {		//if one way trip selected 
			element("isTwoWay",'',{display:"none"})
			element("oneWay",'',select)
			element("twoWay",'',unselect)
			form["toDate"].value = getFormat(new Date());
			isTwoWay = false;
		}else if(way == 2){ 	//if one way trip selected
			element("isTwoWay",'',{display:"block"})
			element("oneWay",'',unselect)
			element("twoWay",'',select)
			isTwoWay = true;
		}
	}
	
	//Search for flights
	function search(){
		pageLoader(true) //Start loader
		resData = validation(); // validating form values
		removeSorting();
		if(resData){ 		//if validation pass
			livetrips = fectchFromJson(resData)
			if(livetrips.length != 0){		//if records found
				element('responseData',formHTML(livetrips));
				element('fromPlace',resData.fromPlace);
				element('toPlace',resData.toPlace);
				element('departDate',dateAsText(resData.fromDate));
				
				if(isTwoWay){
					element('returnDate', dateAsText(resData.toDate)).parentElement.style.display = "block";
					element('departDate').parentElement.style.marginTop = "0px";
					element('arrow','','',{className:"bothArrow"})
				}else{
					element('returnDate').parentElement.style.display = "none";
					element('departDate').parentElement.style.marginTop = "10px";
					element('arrow','','',{className:"flatArrow"})
				}
				
				element("rightHeader",'',{display:"block"})
				element("norecords",'',{display:"none"})
				element("responseData",'',{display:"block"})
				
			}else {		//if no records found
				element("rightHeader",'',{display:"none"})
				element("norecords",'',{display:"block"})
				element("responseData",'',{display:"none"})
			}
		}
		pageLoader(); // Stop loader
	}

	//fetching results
	function fectchFromJson(result){
		let tripsList =[] ;
		let twoWayData = [];
		let filterd = response.trips.filter(r=>{
			if(result.fromDate.getTime() == new Date(r.date).getTime() && result.fromPlace.toLowerCase() == r.from.toLowerCase()){
				return true;
			}else{
				return false;
			}
		});
		
		if(result.isTwoWay){
			  twoWayData = response.trips.filter(r=>{
				if(new Date(result.toDate).getTime() == new Date(r.date).getTime() && result.toPlace.toLowerCase() == r.from.toLowerCase()){
					return true;
				}else{
					return false;
				}
			});
		}
		
		if(result.isTwoWay){ //To form object for two way data
			for(let i =0; i<filterd.length; i++){
				let trip = filterd[i];
				for(let j =0; j<twoWayData.length; j++){
					let tripObj = Object.assign({},trip);
					 tripObj.price += twoWayData[j].price;
					 tripObj.twoway = {
						depart:twoWayData[j].depart,
						arrive:twoWayData[j].arrive,
						fno:twoWayData[j].fno
					 }
					 tripsList.push(tripObj);
				}
			}
		}else { //To form object for one way data
			for(let i =0;i<filterd.length;i++){
					let trip = filterd[i];
			}
			tripsList = filterd;
		}
		passangerCount = resData.pasCount; 
		return tripsList;
	}

	//Form valiation
	function validation(){
		let form = element("searchFlight",'');
		try {
			let fromDate = form["fromDate"].value;
			let toDate = form["toDate"].value;
			let fromPlace =form["fromPlace"].value.trim();
			let toPlace = form["toPlace"].value.trim();
			let pasCount = parseInt(form["count"].value.trim());
			let isTwoWay = window.isTwoWay;
			let count =0;
			fromDate ? count++ : showError(form["fromDate"]);
			fromPlace ? count++ : showError(form["fromPlace"]);
			toPlace ? count++ :  showError(form["toPlace"]);
			pasCount ? count++ : showError(form["count"]);
			
			fromDate = new Date(form["fromDate"].value);
			let curDate = new Date(getFormat(new Date()));
			
			if(fromPlace == toPlace && fromPlace != ""){
				showError(form["toPlace"],"From place and To place should not be same");
				return false;
			}
			if(new Date(fromDate).getTime() < curDate.getTime()){
				showError(form["fromDate"],"Date should not be less than current date");
				return false;
			}
			if(isTwoWay){
				toDate ? count++ : showError(form["toDate"]);
				if(count != 5){
					return false;
				}
				if(new Date(fromDate).getTime() >  new Date(toDate).getTime()){
					showError(form["toDate"],"Return date should not be greater than from date");
					return false;
				}
			}else if(count != 4){
				return false;
			}
			
			return { //if validation pass all conditions
				fromDate,
				toDate,
				fromPlace,
				toPlace,
				pasCount,
				isTwoWay
			}
		}catch(er){
			console.error("something went wrong")
			return false;
		}
	}
	
	// Sort records 
	function sortRecords(type){
		pageLoader(true);
		removeSorting();
		if(type == "depart"){
			sortType[type] = sortType[type] == "asc" ? "desc" : "asc";
			sortType["price"] = "";
		}else if(type == "price"){
			sortType[type] = sortType[type] == "asc" ? "desc" : "asc";
			sortType["depart"] = "";
		}
		let elem = element(type+sortType[type]);
		if(elem){
			elem.className = elem.className +" "+ "activeSort"
		}
		sorting(type,sortType[type]);
		pageLoader(false);
	}

	function removeSorting(){
		Array.from(document.getElementsByClassName("activeSort")).forEach(e=>e.className=e.classList[0])
	}
	
	//Sorting records
	function sorting(sortType,flow){
		let sortedItem = livetrips.sort((first,second)=>{
			switch(sortType){
				case 'depart':
					if(flow=='asc'){
						//first.depart < second.depart;
						return new Date("02-15-2019 " + first.depart) - new Date("02-15-2019 "  + second.depart);
					}else{
						return new Date("02-15-2019 " + second.depart) - new Date("02-15-2019 " + first.depart);
					}
					break;
				case 'price':
					if(flow=='asc'){
						return first.price - second.price;
					}else{
						return second.price - first.price;
					}
					break;
			}
		})
		element('responseData',formHTML(sortedItem));
	}
	
	//Generate HTML for result screen
	function formHTML(data){	
		let innerHTML = '';
		for(let index=0;index<data.length;index++){
			let trip =data[index];
			let totalPrice = parseFloat((trip.price * passangerCount)).toLocaleString('en-IN')+".00";
			innerHTML += `<div class="repsonseRow">
				<p class="price">&#8377 ${totalPrice}</p>
				<div class="tickDetails">
					<div class="oneWay">
					<ul>
					<li>${trip.fno}</li>
					<li class="tripfrom">${trip.from.slice(0,3).toUpperCase()} &#8594 ${trip.to.slice(0,3).toUpperCase()}</li>
					<li>Departure : ${trip.depart}</li>
					<li>Arrival : ${trip.arrive}</li>
					</ul>
						
					</div>
					${
						trip.twoway ?
					`<div class="twoWay">
						<ul>
					<li>${trip.twoway.fno}</li>
					<li class="tripfrom">${trip.from.slice(0,3).toUpperCase()} &#8592 ${trip.to.slice(0,3).toUpperCase()}</li>
					<li>Departure :${trip.twoway.depart}</li>
					<li>Arrival :${trip.twoway.arrive}</li>
					</ul>
					</div>` : ''
					}
					<div class="bookButton">
						<button>book this flight</button>
					</div>
					
				</div>
			</div>`;
		}
		return innerHTML;
	}
	
	//Set screen height
	function dynamicHeight(){
		Array.from(document.getElementsByClassName("rightSection")).forEach(el=> el.style.minHeight = (window.innerHeight -60)+"px");
	}

	function load(){
		 prepareForm();
		 initiateEvents();
		 dynamicHeight();
		 search();//default search		
	}
	window.addEventListener("load", function(event) {
		load();
	 })
