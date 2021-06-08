var Humworks = function(){
	
	var _componentModal = function(onload,p,pc, hasDots) {
		if (pc.length) {
			pc.slick({
				dots: hasDots,
		        infinite: false,
		        adaptiveHeight: true,
		        slidesToShow: 1,
		        slidesToScroll: 1,
		        draggable: false
			});
			pc.slick('setPosition');
			pc.on('beforeChange', function(event, slick, currentSlide, nextSlide){
				if(currentSlide == 0){
					$('#add-new_app').parsley().validate("basic-app-info"); 
					if (!$('#add-new_app').parsley().isValid("basic-app-info")) {
						event.preventDefault();
		            }
				}else if(currentSlide == 1 && nextSlide > 1){
					$('#add-new_app').parsley().validate("security-app-info"); 
					if (!$('#add-new_app').parsley().isValid("security-app-info")) {
						event.preventDefault();
		            }					
				}
			});
		}
	}
	
	var _generateRandomSecId = function(){
		$(".gen-sec-id").click(function(){
			var t = $(this).data("type");
			 $.getJSON("/api/apps/generate",{type: t},function(data){
				 if(t=="id"){
					 $("#appUniqueId").val(data.key);
				 }else{
					 $("#appSecretCode").val(data.key);
				 }
			 });
		});
	}
	
	var _fill = function(s,t){	 
   	 s.keyup(function(){
   		 var rurl = $(this).val()+ ""+t.data("suffix");
   		 t.val(rurl);
   	 })    	 
    };
	
	var _componentFooTable = function($s){
 	   if (!$().footable) {
 	        console.warn('Warning - footable.min.js is not loaded.');
 	        return;
 	    }
 	   	$s.footable();
	};
	
	var _componentSelect2 = function(s, d) {
        if (!$().select2) {
            console.warn('Warning - select2.min.js is not loaded.');
            return;
        }
        s.select2({
            dropdownParent: d
        });
    };
	
    var _croppiee = function(){
   	   var basic = $("#main-cropper").croppie({
   		  viewport: { width: 167, height: 167, type: 'square' },
   		  boundary: { width: 450, height: 250 },
   		  showZoomer: false,
   		});

   		function readFile(input) {
   		  if (input.files && input.files[0]) {
   		    var reader = new FileReader();

   		    reader.onload = function(e) {
   		      $("#main-cropper").croppie("bind", {
   		        url: e.target.result
   		      })
//   		      .then(function(){
//  		    	  $('.cr-slider').attr({'min':0.5000, 'max':1.0});
//  		      });
   		    };
   		    reader.readAsDataURL(input.files[0]);
   		  }
   		}
       	$("#logo-image-hws").on("change", function() {
       		if (!window.FileReader) {
       	        return;
       	    }
       		if (this.files != null && this.files.length > 0){
       			function truncate(n, len) {
       			    var ext = n.substring(n.lastIndexOf(".") + 1, n.length).toLowerCase();
       			    var filename = n.replace('.' + ext,'');
       			    if(filename.length <= len) {
       			        return n;
       			    }
       			    filename = filename.substr(0, len) + (n.length > len ? ' ..... ' : '');
       			    return filename + '.' + ext;
       			};
   	    		var size =   (this.files[0].size / 1024 / 1024).toFixed(2);
   	    		var fileName = this.files[0].name;
   	    		if (size > 10) { 
   	  	            $('#size-exceed').show();
   	  	            $('.save').attr("disabled", true);
   	  	            readFile(this);
   	  	        } else {
   	  	        	$('.dz-clickable').hide();
   	  	        	$(".filename").replaceWith( "<span class='filename' style='user-select: none;'>"+truncate(fileName, 12)+"</span>" );
   	  	        	$('#main-cropper').show();
   	  	        	$('#size-exceed').hide();
   	  	        	$('.save').attr("disabled", false);
   	  	        	readFile(this);
   	  	        }
       		}
     	});			
   	}
	
    var _saveLogo = function(){
   		$('.save').on('click',function(e){
   			var fileInput = document.getElementsByClassName("file-progress-extensions");
   			if(fileInput[0].files.length > 0) {
   				var fileName = fileInput[0].files[0].name;
				$('#result-wrapper').prepend('<img src="" id="result" style=" width: 300px; height: 300px;top: 100px; left: 0px;">');
				$("#main-cropper").croppie("result", {
					type: "canvas",
					size: "viewport",
					circle: false
				}).then(function(resp) {
					$("#result").attr("src", resp);
					$("#result").hide();
				}).then(function(){
					var file = document.getElementById("result").src;
					$('#encodedImage').val(file);
					$('#fileName').val(fileName);
				});
   			}
   		});
    }
    var _load = function(s,d){
   	 $.get('/assets/templates/view-loader.mte.html', function(template, textStatus, jqXhr) {
   		 s.html(Mustache.render($(template).filter(d).html()));
   	 });
    }     
    var _getData = function(){
   	 $(document).on("click",'.action-item',function(){   
   		 _load($("#view-app-details"), "#view-loader-template");
   		 switch($(this).data("action")){
   		 	case "view":
   		 			getJSON('/api/apps/'+$(this).data('id'),function(data){
   		 				$.get('/assets/templates/view-app.mte.html', function(template, textStatus, jqXhr) {
   		 					window.setTimeout(function(){$("#view-app-details").html(Mustache.render($(template).filter('#view-app-details-template').html(), data))}, 800);
   		 		        });   		 				
   		 			});
   		 			var target = $(this).attr('data-target');
   		 			$(target).addClass('show');
   		 		break;
   		 	case "permissions":
   		 			var id = $(this).data("id");
   		 			var name = $(this).data("name");
   		 			$("#app-icon-8987").attr("src","/apps/"+id+"/content/img");
   		 			$("#app-name-8987").text(name);
		 			var target = $(this).attr('data-target');
		 			var perm = $(this).data('permissions');
		 			if(perm.length > 0){
		 				for(var i of perm){
		 					$(':checkbox[value="' + i + '"]').prop("checked","true");
		 				}
		 			}
   		 			$(target).addClass('show');
   		 			$("#f_app_permissions").attr("action", "/apps/"+id+"/permissions");
   		 		break;
   		 	default:
   		 		
   		 }
   	 });
    };  
    var _confirm = function(s,t){
     	if (!$().confirm) {
 	        console.warn('Warning - confirm is not loaded.');
 	        return;
 	    }
 		$(document).on("click", ".dr-leave", function(e){
 			var $target = $(this).attr('href');
 			$.confirm({          
 				 title: $(this).data("title"),
 			     content: $(this).data("content"), 			    
 	     		 autoClose: 'cancel|15000',
 	             keyboardEnabled : true,
 	             buttons: {
 	                 proceed: {
 	                 	btnClass: 'btn-red',
 	                 	text: $(this).data("action"),
 	                 	action: function(){
 	                 		location.href = $target;
 	                 	}
 	                 },
 	                 cancel: {
 	                 	text: 'Cancel'
 	                 }
 	             }
 	         });
 			e.preventDefault();
 		});
    }    
    var _validation = function(){
    	$('.gen-sec-id').on("click", function() {
    		$(this).closest('.form-group').find('.form-control').removeClass("parsley-error");
    		$(this).closest('.form-group').find('.parsley-required').hide();
    	});
    	$('.select-appGrantTypes').on('change', function(){
    		$(this).removeClass("parsley-error");
    		$(this).closest('.form-group').find('.parsley-required').hide();    		
    	});
    	$('.select-appScopes').on('change', function(){
    		$(this).removeClass("parsley-error");
    		$(this).closest('.form-group').find('.parsley-required').hide();    		
    	});
    	if($('#encodedImage').val() != null && $('#encodedImage').val() != '') {
    		$('#logo-image-hws').prop('required',false);
    	} 
    }
	return {
		init: function(){
			_componentFooTable($('.table-togglable'));
			_componentModal(false,$('.add-new-application'),$('.add-new-application .hmwks-slider-w'), true);
			_componentSelect2($('select.select-appType'), $('.add-new-application'));
			_componentSelect2($('select.select-appGrantTypes'), $('.add-new-application'));
			_componentSelect2($('select.select-appScopes'), $('.add-new-application'));
			_croppiee();
			_confirm($('.dr-leave'),'Delete');
			_getData();
			_fill($("#appUrl"), $("#redirectUrl"));
			_generateRandomSecId();
			_saveLogo();
			_validation();
		}
	}
}();