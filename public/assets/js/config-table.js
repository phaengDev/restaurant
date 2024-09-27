

var handleSelectTable = function() {
	"use strict";
	
	$(document).on('click', '[data-toggle="select-table"]', function(e) {
		e.preventDefault();
		
		var targetTable = $(this).closest('.pos-table');
		
		if ($(targetTable).hasClass('in-use')) {
			$('[data-toggle="select-table"]').not(this).closest('.pos-table').removeClass('selected');
			$(targetTable).toggleClass('selected');
			$('#pos').toggleClass('pos-sidebar-mobile-toggled');
		}
	});
};

$(document).ready(function() {
	handleSelectTable();
});

var handleFilter=function(){"use strict";
    $(document).on('click','.pos-menu [data-filter]',function(e){
        e.preventDefault();
        var targetType=$(this).attr('data-filter');
        $(this).addClass('active');
        $('.pos-menu [data-filter]').not(this).removeClass('active');
        if(targetType=='all'){
            $('.pos-content [data-type]').removeClass('d-none');
        }else{$('.pos-content [data-type="'+targetType+'"]').removeClass('d-none');
            $('.pos-content [data-type]').not('.pos-content [data-type="'+targetType+'"]').addClass('d-none');
        }});
    };
    $(document).ready(function(){
        handleFilter();
    });