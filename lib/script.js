// some functions
		function dynamicSort(property) {
			var sortOrder = 1;
			if(property[0] === "-") {
				sortOrder = -1;
				property = property.substr(1, property.length - 1);
			}
			return function (a,b) {
				// check if they are numbers :)
				var numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
				if(numberRegex.test(a[property]) && numberRegex.test(a[property])){ 
					return sortOrder * (a[property] - b[property]);
				}else {
					var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
					return result * sortOrder;
				}
			}
		}
		
		
		// thank you www.phpjs.org
		function base64_encode(data){var b64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var o1,o2,o3,h1,h2,h3,h4,bits,i=0,ac=0,enc="",tmp_arr=[];if(!data){return data}do{o1=data.charCodeAt(i++);o2=data.charCodeAt(i++);o3=data.charCodeAt(i++);bits=o1<<16|o2<<8|o3;h1=bits>>18&0x3f;h2=bits>>12&0x3f;h3=bits>>6&0x3f;h4=bits&0x3f;tmp_arr[ac++]=b64.charAt(h1)+b64.charAt(h2)+b64.charAt(h3)+b64.charAt(h4)}while(i<data.length);enc=tmp_arr.join('');var r=data.length%3;return(r?enc.slice(0,r-3):enc)+'==='.slice(r||3)}
		function base64_decode(data){var b64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var o1,o2,o3,h1,h2,h3,h4,bits,i=0,ac=0,dec="",tmp_arr=[];if(!data){return data}data+='';do{h1=b64.indexOf(data.charAt(i++));h2=b64.indexOf(data.charAt(i++));h3=b64.indexOf(data.charAt(i++));h4=b64.indexOf(data.charAt(i++));bits=h1<<18|h2<<12|h3<<6|h4;o1=bits>>16&0xff;o2=bits>>8&0xff;o3=bits&0xff;if(h3==64){tmp_arr[ac++]=String.fromCharCode(o1)}else if(h4==64){tmp_arr[ac++]=String.fromCharCode(o1,o2)}else{tmp_arr[ac++]=String.fromCharCode(o1,o2,o3)}}while(i<data.length);dec=tmp_arr.join('');return dec}
		
		// done with functions let the game begin
		$(document).ready(function(){
		
		
		
			// update table function
			function updateTable(values) {
				sort = $("#myForm input[name=r]:checked").val();
				//alert(sort);
				ord = $("#myForm input[name=ord]:checked").val();
				values = values.sort(dynamicSort(ord+sort)); // sort it
				var content='';
				var count = 1;
				var to_count = $("#myForm input[name=count]:checked").val();
				for(var i=0; i < values.length; i++){
					if(to_count)
						content += "<tr><td>"+ count++ +"</td>";
					else	
						content += "<tr>";
					for(var j=0; j < values[i].length; j++){
						content += "<td title='double click to edit' class='dblclick' x='"+i+"' y='"+j+"'>" + values[i][j] + "</td>";
					}
					content += "</tr>";
				}
					if(to_count)						
						$("#content").hide().html("<table class='tb_border' cellspacing='0'><tr><th>No</th>" + head + "</tr>" + content + "</table>").show(500); 		
					else
						$("#content").hide().html("<table class='tb_border' cellspacing='0'><tr>" + head + "</tr>" + content + "</table>").show(500); 		
			}

			function updateRadio() {
				var radio = '';
				var input = $("#myForm input[type=text]").serializeArray();
				for(var i = 0; i < input.length; i++){
					radio += "<input type='radio' class='updt' name='r' id='r"+i+"' value='"+i+"'";
					if(i==0) 
						radio +=" checked='1'";				
					radio += "><label for='r"+i+"'>by "+ input[i].name +"</label> <br/>";
				}
				$("#myForm #rad").html(radio);			
			}

			
		
			values = [];
			var key=0;
			var head = '';
			var is_added = 0;

			// lets add the radio buttons
			updateRadio();

			
			// check for any saved data
			if($("#save").val() != ''){
				values = JSON.parse(base64_decode($("#save").val()));
				key = values.length;
			}
			
			
			// now grab the data from the form on submit
			$("#myForm").submit(function(){
				
				$.each($('#myForm').serializeArray(), function(i, field) {
					if((field.name != 'r') && (field.value != '') && (field.name != 'ord') && (field.name != 'count')){
						if(is_added == 0)
							head += "<th>" + field.name + "</th>";
						if(!values[key]){
							values[key] = [field.value];
						} else {
							values[key].push(field.value);
						}
					}
				});	
				key++;is_added++;

				$('#myForm input[type=text]').val(""); // clear the input 
				// now we start to build the result
				
				updateTable(values);
					
				$("#save").val(base64_encode(JSON.stringify(values)));
					
				// and we are done !! now go -g-e-t- -s-o-m-e s-l-e-e-p- watch Spartacus Wor on demand !! :>
				return false; // stop the form
			});
			//  the hide befor print
			$("#print").click(function(){
				$('.hide').hide();
				window.print();
				$('.hide').show();
			});
			
			// live edit
			$(".dblclick").live("dblclick",function() { // any idea why on() doesn't work here? email me 
				 $(this).editable(function(value,settings) {
					// console.log(value);
					var x = $(this).attr("x");
					var y = $(this).attr("y");
					values[x][y] = value;
					updateTable(values)
					return(value);
				 },{
					tooltip   : "Doubleclick to edit...",
					event     : "focus.dblclick",
					style  : "inherit"
				 }).trigger("focus");
			});
			
			$(".updt").on("click",function(){
				updateTable(values);
			});
			// now we make the right click Add and Edit options
			$(".ipt").contextMenu({
					menu: 'myMenu'
				},
				function(action, el, pos) {
					if(action == 'edit'){
						// we get a new name and update the input attributes 
						var n = prompt("Name of the input", $(el).attr("name"));
						if(n != null){
							$(el).attr("name",n);
							$(el).attr("placeholder",n);
						}
						
					}
					if(action == 'add'){
						// we add a new input
						var n = prompt("Name of the input");
						if(n != null){
							$("#input").append("<td><input type='text' class='ipt' name='"+ n +"' placeholder='"+ n +"'></td>");
						}
					}
					if(action == 'delete'){
						// simply remove it
						$(el).remove();
					}
					
					updateRadio();
				});
			// export to excel
			// we need some php here it's hosted by master-land.net
			$("#exportToExcel").click(function() {									   
				var data='<table>'+$(".tb_border").html()+'</table>';
				$('body').prepend("<form method='post' action='http://master-land.net/services/exporttoexcel.php' style='display:none' id='ReportTableData'><input type='text' name='tableData' value='"+data+"' ></form>");
				 $('#ReportTableData').submit().remove();
				 return false;
			});

			
		});