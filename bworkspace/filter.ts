////////////////////////////////////////
/// Travtion Search(Backend Model) /////

export class filter {
	id_bookings:string;

	file_detail_record_locator: string;
	book_detail_id_bookings: string;
	filter_by_bookings_or_files: string;

	//Date filters
	date_created_from: any;
  	date_created_to: any;
  	date_travel_from: any;
  	date_travel_to: any;
	number_of_page: number;
  	//Other filters
	passenger_name: any = [];
	reservation_code_locator: any = [];
	will_auto_cancel: any = [];
	status: any = []; //Must be integers
	service_type: any = [];
	provider: any = [];
	agency_user: any = [];
	destination: any = [];
	//Sorting
	order: string;
  	asc: boolean;

	constructor(){
		this.id_bookings = "";
		this.filter_by_bookings_or_files = "";
		this.date_created_from = "";
  		this.date_created_to = "";
  		this.date_travel_from = "";
  		this.date_travel_to = "";

  		//Other filters
		this.passenger_name = [];
		this.reservation_code_locator = [];
		this.will_auto_cancel = [];
		this.status = []; 
		this.service_type = [];
		this.provider = [] ;
		this.agency_user = [];
		this.destination = [];
		//Sorting
		this.order = "";
  		this.asc = true;
	}

	clearFilter() {
		this.id_bookings = "";
		this.filter_by_bookings_or_files = "";
		this.date_created_from = "";
  		this.date_created_to = "";
  		this.date_travel_from = "";
  		this.date_travel_to = "";

  		//Other filters
		this.passenger_name =[];
		this.reservation_code_locator =[];
		this.will_auto_cancel =[];
		this.status =[]; //Must be integers
		this.service_type =[];
		this.provider =[];
		this.agency_user =[];
		this.destination =[];
	}
	//Bworkspace URL
	create_url(){
		if ( this.number_of_page == 0 || this.number_of_page == NaN  || this.number_of_page == undefined){
			this.number_of_page = 1;
		}
		var status_without_empty = '';
		if(this.status != undefined && this.status != null && this.status != ''){
			status_without_empty = this.status.filter(function(n){ return n != undefined }); //Filter Status: Remove empty spaces from array elements
		}
		var service_without_empty = '';
		if(this.service_type != undefined && this.service_type != null && this.service_type != ''){
			service_without_empty = this.service_type.filter(function(n){ return n != undefined }); //Filter service_type: Remove empty spaces from array elements
		}
		var provider_without_empty = '';
		if(this.provider != undefined && this.provider != null && this.provider != ''){
			provider_without_empty = this.provider.filter(function(n){ return n != undefined }); //Filter provider: Remove empty spaces from array elements
		}
		
		
		var full_url = 'id_bookings='+ this.id_bookings +';search_type='+ this.filter_by_bookings_or_files + ';passenger_name='+ this.passenger_name + ';reservation_code_locator='+ this.reservation_code_locator + ';will_auto_cancel='+ this.will_auto_cancel + 
		';status='+ status_without_empty + ';service_type='+ service_without_empty + ';provider='+ provider_without_empty + ';agency_user='+ this.agency_user + ';destination='+ this.destination + ';date_created_from='+ this.date_created_from +
		';date_created_to=' + this.date_created_to +';date_travel_from='+ this.date_travel_from + ';date_travel_to='+ this.date_travel_to +';order='+ this.order + ';asc='+ this.asc + ';number_of_page='+ this.number_of_page;
		return full_url;
	}

	//Change "/" to "-"
	replace_string(){
		/*if (this.date_created_from !=null){
    		this.date_created_from=this.date_created_from.replace("/", "-");
    		this.date_created_from=this.date_created_from.replace("/", "-");
  		}
  		if (this.date_created_to !=null){
    		this.date_created_to=this.date_created_to.replace("/", "-");
   		    this.date_created_to=this.date_created_to.replace("/", "-");
  		}
  		if (this.date_travel_from !=null){
    		this.date_travel_from=this.date_travel_from.replace("/", "-");
    		this.date_travel_from=this.date_travel_from.replace("/", "-");
 		}
  		if (this.date_travel_to !=null){
    		this.date_travel_to =this.date_travel_to.replace("/", "-");
    		this.date_travel_to =this.date_travel_to.replace("/", "-");
  		}*/
	}

	//Undo "-" to "/"
	undo_replace_string(){
		/*if (this.date_created_from !=null){
    		this.date_created_from=this.date_created_from.replace("-", "/");
    		this.date_created_from=this.date_created_from.replace("-", "/");
  		}
  		/*if (this.date_created_to !=null){
    		this.date_created_to=this.date_created_to.replace("-", "/");
   		    this.date_created_to=this.date_created_to.replace("-", "/");
  		}
  		if (this.date_travel_from !=null){
    		this.date_travel_from=this.date_travel_from.replace("-", "/");
    		this.date_travel_from=this.date_travel_from.replace("-", "/");
 		}
  		if (this.date_travel_to !=null){
    		this.date_travel_to =this.date_travel_to.replace("-", "/");
    		this.date_travel_to =this.date_travel_to.replace("-", "/");
  		}*/
	}

}

