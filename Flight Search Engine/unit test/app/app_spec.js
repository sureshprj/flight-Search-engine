function createFormElement(name,value=""){
	var div = document.createElement("div");
	var input = document.createElement("input");
	var span = document.createElement("span");
	div.className = "row";
	input.name=name;
	input.value=value;
	div.appendChild(input);
	div.appendChild(span);
	return div;
}
describe('Initial load',function(){
	var form;
	beforeAll(function(){
		
		spyOn(document, "getElementById").and.callFake(function(id) {
			if(id == "searchFlight"){
			 form = document.createElement("form");
			 form.appendChild(createFormElement("fromDate"))
			 form.appendChild(createFormElement("toDate"))
			 form.appendChild(createFormElement("fromPlace"))
			 form.appendChild(createFormElement("count"))
			 form.appendChild(createFormElement("toPlace"))
				return form;
			}else{
				return document.createElement("div");
			}	
		});
	});
	it('should auto fill form values', function(){
		setMinDate();
		expect(form["fromDate"].value).not.toEqual('');
		setDefaultValue();
		expect(form["fromPlace"].value).not.toEqual('');
		expect(form["toPlace"].value).not.toEqual('');
		expect(form["count"].value).not.toEqual('');
		
	})
})
describe('Form Validation', function(){
	var form;
	beforeAll(function(){
		
		spyOn(document, "getElementById").and.callFake(function(id) {
			if(id == "searchFlight"){
			 form = document.createElement("form");
			 form.appendChild(createFormElement("fromDate"))
			 form.appendChild(createFormElement("toDate"))
			 form.appendChild(createFormElement("fromPlace"))
			 form.appendChild(createFormElement("count"))
			 form.appendChild(createFormElement("toPlace"))
				return form;
			}else{
				return document.createElement("div");
			}	
		});
	});
	it('oneway trip:should show error messages', function(){
		validation();
		expect(form["fromDate"].nextElementSibling.innerHTML).not.toEqual('');
		expect(form["fromPlace"].nextElementSibling.innerHTML).not.toEqual('');
		expect(form["toPlace"].nextElementSibling.innerHTML).not.toEqual('');
		expect(form["count"].nextElementSibling.innerHTML).not.toEqual('');
	});
	it('onewway trip:should remove error messages', function(){
		removeError(form["fromDate"]);
		removeError(form["fromPlace"]);
		removeError(form["toPlace"]);
		removeError(form["count"]);
		expect(form["fromDate"].nextElementSibling.innerHTML).toEqual('');
		//expect(form["toDate"].nextElementSibling.innerHTML).toEqual('');
		expect(form["fromPlace"].nextElementSibling.innerHTML).toEqual('');
		expect(form["toPlace"].nextElementSibling.innerHTML).toEqual('');
		expect(form["count"].nextElementSibling.innerHTML).toEqual('');
	});
	
	it('twoWay trip:should show error messages', function(){
		setTrip(2);
		validation();
		expect(form["fromDate"].nextElementSibling.innerHTML).not.toEqual('');
		expect(form["toDate"].nextElementSibling.innerHTML).not.toEqual('');
		expect(form["fromPlace"].nextElementSibling.innerHTML).not.toEqual('');
		expect(form["toPlace"].nextElementSibling.innerHTML).not.toEqual('');
		expect(form["count"].nextElementSibling.innerHTML).not.toEqual('');
	});
	
	it('twoWay trip:should remove error messages', function(){
		setTrip(2);
		removeError(form["fromDate"]);
		removeError(form["fromPlace"]);
		removeError(form["toPlace"]);
		removeError(form["count"]);
		removeError(form["toDate"]);
		expect(form["fromDate"].nextElementSibling.innerHTML).toEqual('');
		expect(form["toDate"].nextElementSibling.innerHTML).toEqual('');
		expect(form["fromPlace"].nextElementSibling.innerHTML).toEqual('');
		expect(form["toPlace"].nextElementSibling.innerHTML).toEqual('');
		expect(form["count"].nextElementSibling.innerHTML).toEqual('');
	});
	
});
describe('Search results',function(){
	var form;
	var response;
	beforeAll(function(){
		
		spyOn(document, "getElementById").and.callFake(function(id) {
			if(id == "searchFlight"){
			 form = document.createElement("form");
			 form.appendChild(createFormElement("fromDate","2019-02-15"))
			 form.appendChild(createFormElement("toDate",""))
			 form.appendChild(createFormElement("fromPlace","chennai"))
			 form.appendChild(createFormElement("count","1"))
			 form.appendChild(createFormElement("toPlace","delhi"))
			 return form;
			}else if(id == "responseData"){
				response = document.createElement("div")
				return response;
			}else if(id == "returnDate" || id == "departDate"){
				var div = document.createElement("div");
				return div.appendChild(document.createElement("div"));
			}else{
				return document.createElement("div");
			}
		});
		spyOn(document, "getElementsByClassName").and.callFake(function(cls) {
			return [document.createElement("div")]
		});
	});
	
	it('onewaytrip:should show search result', function(){
		setTrip(1);
		search();
		expect(livetrips.length).not.toEqual(0);
		
	});
	it('onewaytrip:should show search result', function(){
		setTrip(2);
		search();
		expect(livetrips.length).not.toEqual(0);
		
	});
 })
describe('No search results found',function(){
	var form;
	var response;
	beforeAll(function(){
		
		spyOn(document, "getElementById").and.callFake(function(id) {
			if(id == "searchFlight"){
			 form = document.createElement("form");
			 form.appendChild(createFormElement("fromDate","2020-02-16"))
			 form.appendChild(createFormElement("toDate","2020-02-17"))
			 form.appendChild(createFormElement("fromPlace","chennai"))
			 form.appendChild(createFormElement("count","1"))
			 form.appendChild(createFormElement("toPlace","delhi"))
			 return form;
			}else if(id == "responseData"){
				response = document.createElement("div")
				return response;
			}else if(id == "returnDate" || id == "departDate"){
				var div = document.createElement("div");
				return div.appendChild(document.createElement("div"));
			}else{
				return document.createElement("div");
			}
		});
		spyOn(document, "getElementsByClassName").and.callFake(function(cls) {
			return [document.createElement("div")]
		});
	});
	
	it('onewaytrip :should show no results found', function(){
		setTrip(1);
		search();
		expect(livetrips.length).toEqual(0);
		
	});
	it('twowaytrip :should show no results found', function(){
		setTrip(2);
		search();
		expect(livetrips.length).toEqual(0);
		
	});
 })