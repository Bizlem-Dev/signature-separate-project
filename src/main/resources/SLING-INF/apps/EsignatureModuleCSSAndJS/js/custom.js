
var Email= document.getElementById("email").value;
//var Email="nilesh@gmail.com";
var group;

$(function() {
	 getGroupName('working-group-DropdownClass');
	
    });


$(document).ready(function() {
	callFunctionDataSourceFetchData();
	
});


$('body').on('click', '.add-form-receiver', function() {
    var data = $('.receiver-section-copy').html();
    $('.append-receiver-section').append(data);
});

$('body').on('click', '.delete-receiver-from', function() {
	$(this).parents('.copy-from-section').remove();
});

$('body').on('click', '.companys-set-up', function() {
  	var data = $(".companys-set-up:checked").val();
	if(data == 'companys-set-up'){
		$('.approver-section').css('display','block');  
	}else{
		$('.approver-section').css('display','none');  
	}
});

$('body').on('click', '.access-code-set-up', function() {
  	var data = $(".access-code-set-up:checked").val();
	if(data == 'access-code-set-up'){
		
	 $(this).parents('.form-group').find('.withen-40-byte-characters').css('display','block');
		//$('.withen-40-byte-characters').css('display','block');  
	}else{
		 $(this).parents('.form-group').find('.withen-40-byte-characters').css('display','block');
		//$('.withen-40-byte-characters').css('display','none');  
	}
});


var imageJson="";

var mainJson={};

function excelFileUpload(){	
	 
	var fileName=document.getElementById("fileUploadDocuments").value;
	var cleanName=fileName.split('\\').pop();
	
	var f=document.getElementById("fileUploadDocuments").files;
	var isJsonValid=IsJsonString(JSON.stringify(f));
		if(isJsonValid){
			
			if (window.FileReader && window.Blob) {
			    // All the File APIs are supported.
			if(f.length>0){
				var reader=new FileReader();
				console.log("cleanName: "+cleanName);
			 	
			 	var str="File Name";
			 	str=str.fontcolor("black");
			 	document.getElementById("filenameId").innerHTML=str+" : "+cleanName;
				
	reader.readAsDataURL(f[0]);
	reader.onloadend=function(){
//		console.log(reader.result);
		var filename=cleanName;
		var filedata=reader.result;
		
		var fd= filedata.substr(0, filedata.indexOf(",")+1);
		var fdata= filedata.replace(fd, "");
		   mainJson.email=encodeURI(Email);
		   mainJson.Email=encodeURI(Email);
		   mainJson.filename=filename;
		   mainJson.filedata=encodeURI(fdata);
		   mainJson.group=group;
			
			var json = JSON.stringify(mainJson);
             console.log("uploadedData: "+json);
			$.ajax({

				url : "/portal/servlet/service/FileUploadedStandardSaveData",
				type : 'POST',
				async:false,
				data:JSON.stringify(mainJson),
				contentType: "application/json",
				success : function(dataRes) {
					console.log("Data Saved! " +dataRes);
					
					var isJsonValid=IsJsonString(dataRes);
					if(isJsonValid){
						imageJson=dataRes;
					var jsonStr = dataRes;
					jsonStr = JSON.parse(jsonStr);
					
					if(jsonStr.hasOwnProperty("status")){
						var status=jsonStr.status;
						var message=jsonStr.message;
						
						if(status=="success"){
							
							if(jsonStr.hasOwnProperty("imageArray")){
								var imageArray=jsonStr.imageArray;
								
								 var successMsg = "Document SuccessFully Uploaded!"
		 								$('#successUploadFileId').css('color','green');
		 								document.getElementById("successUploadFileId").innerHTML = successMsg;
								
							}
							
	 					} // json status success
						else{
							$('#successUploadFileId').css('color','red');
							document.getElementById("successUploadFileId").innerHTML = message;
						}
					}
					
					} // is json valid check
					
				} // success function close
				
			}); // function on click
			
		}// json valid check
			}// length check
		}  // blob check
		}
}

$('body').on('change','#fileUploadDocuments', function (e) {
		
	 document.getElementById("filenameId").innerHTML="";
	 document.getElementById("successUploadFileId").innerHTML ="";
	 
	 excelFileUpload();
		 
		 
 });

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function callServletSaveData(mainJson){
	
	$.ajax({
		
		    type: "POST",
	        url: "/portal/servlet/service/saveSignaturedata",
	        async: false,
	        data:JSON.stringify(mainJson),
	        contentType: "application/json",
	        success: function (data) {
	        	console.log("savedData: "+data);
	        }
		
	});
	
}

function getGroupName(selectclass){
	
	$.ajax({ 
	type: 'GET',
	url: '/portal/servlet/service/GroupSignatureServlet?email='+Email,
	async:false,
	success: function (dataa) {
	console.log(dataa);
	var json = JSON.parse(dataa);
	console.log("group json: "+JSON.stringify(json));
	
	var x = document.getElementsByClassName(selectclass);

	for(var i=0; i<x.length; i++){
	x[i].innerHTML="";
	
	if(json.length>0){
	for(var j=0; j<json.length; j++){
		
		if(json[j].hasOwnProperty("groupname")){
			var key =json[j].groupname;
			
			x[i].options[x[i].options.length] = new Option(key, key);
		}
	
	} // for close
	
	}else{
	x[i].options[x[i].options.length] = new Option("no group", "no group");
	}

	}
	group =document.getElementById("working-group-Dropdown-idDrop").value;
	console.log("group inside "+group);
	
	}
	});
	}



var dataTableCount = 0;
function callFunctionDataSourceFetchData(){	
var urlLink="";
	
		$.ajax({
		url : "/portal/servlet/service/getalldocument?email="+Email+"&group="+group,
		type : 'GET',
		success : function(data) {
			console.log("data: " + data);
			
			var isJsonValid=IsJsonString(data);
			if(isJsonValid){
				var obj = JSON.parse(data);
				obj = obj.data;
				var table = $('#list-all').DataTable({
					data: obj,
					columns: [
					{ data: 'esignatureId', title: 'Id' },
					{ data: 'status', title: 'status' },
					{ data: 'templatename', title: 'Document Name' },
					{ data: 'customerId', title: 'Owner' },
					{title: '' }
					],
					columnDefs: [
						{
							targets: -1,
							render: function(data, type, full, meta){
							
							data ='<button  title="Send Reminder!" id="first" class="btn btn-success" style="margin-right: 5px;"><i class="fa fa-bell"></i></button><button title="view Document!" id="second" class="btn btn-info" style="margin-right: 5px;"><i class="fa fa-eye"></i></button><button title="Signed Document!" id="third" class="btn btn-danger" style="margin-right: 5px;"><i class="fa fa-download"></i></button>';

							return data;
							}
							} 
						]
				});
				
				$('#list-all tbody').on( 'click', '#first', function () {
					var data = table.row( $(this).parents('tr') ).data();
			        data["email"]=Email;
			        data["group"]=group;
			       
                      console.log("data * "+JSON.stringify(data));
			        $.ajax({
			    		url : "/portal/servlet/service/getalldocument.sendreminder",
			    		type : 'POST',
			    		async:false,
						data : JSON.stringify(data),
						contentType:"application/json",	
			    		success : function(output) {
			    			alert("1");
			    			console.log("output: " + JSON.stringify(output));
			    		}
			    		});
			    });
				
				$('#list-all tbody').on( 'click', '#second', function () {
					var data = table.row( $(this).parents('tr') ).data();
			        console.log("data "+data["slingdocumentpath"]);
			        console.log("JSON "+JSON.stringify(data));
			        var filenamewithext="";
                      if(data.hasOwnProperty("DocumentUrl")){
                    		if(data["DocumentUrl"].lastIndexOf('/')!=-1){
                    			filenamewithext = data["DocumentUrl"].substr(data["DocumentUrl"].lastIndexOf('/') + 1);
	                    		console.log("filenamewithext "+filenamewithext);
                    		}
                      var link = document.createElement('a');
                      document.body.appendChild(link);
                      link.setAttribute('href', data["DocumentUrl"]);
                      link.setAttribute('download', filenamewithext);
                      link.click();
				     }
			    });
				
				$('#list-all tbody').on( 'click', '#third', function () {
					var data = table.row( $(this).parents('tr') ).data();
			        console.log("data "+data["slingdocumentpath"]);
			        console.log("JSON "+JSON.stringify(data));
			        var filenamewithext="";
			        if(data.hasOwnProperty("SignedDocumentUrl")){
			        	if(data["SignedDocumentUrl"].lastIndexOf('/')!=-1){
			        		filenamewithext = data["SignedDocumentUrl"].substr(data["SignedDocumentUrl"].lastIndexOf('/') + 1);
	                    		console.log("filenamewithext "+filenamewithext);
			        	}
                          var link = document.createElement('a');
                          document.body.appendChild(link);
                          link.setAttribute('href', data["SignedDocumentUrl"]);
                          link.setAttribute('download', filenamewithext);
                          link.setAttribute('target', '_blank'); 
                          link.click();
    				     }

			    });
				
			}
		}
	});
	
		
}








