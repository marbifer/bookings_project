/////////////////////////////////////////////////
/// Travtion Search(Backend Model) List Users ///

export class filtersUser {
	user_detail_id_users: string;
	filter_by_users: string;

	//Date filters
	date_created_from: string;
    date_created_to: string;
	number_of_page: number;
  	//Other filters
	status: any[]; //Must be integers
	name: string[];
	surname: string[];
	last_name: string[];
	agency: any[];
	email: string[];
	phone_number: string[];
	city: string[];
	state: string[];
	country: string[];
	address: string[];
	zip: string[];
	has_bookings: any[];
	//Sorting
	order: string;
    asc: boolean;

	constructor(){
		this.filter_by_users = "";
		this.date_created_from = "";
  	    this.date_created_to = "";

  	//Other filters
		this.status = new Array(); //Must be integers
		this.name = new Array();
		this.surname = new Array();
		this.agency = new Array();
		this.email = new Array();
		this.phone_number = new Array();
		this.city = new Array();
		this.state = new Array();
		this.country = new Array();
		this.address = new Array();
		this.zip = new Array();
		this.has_bookings = new Array();
		//Sorting
		this.order = "";
  	    this.asc = true;
	}

	//Clear Filter
	clearFilter () {
		this.filter_by_users = "";
		this.date_created_from = "";
  		this.date_created_to = "";

  	//Other filters
		this.status = [];
		this.name = [];
		this.surname = [];
		this.agency = [];
		this.email = [];
		this.phone_number = [];
		this.city = [];
		this.state = [];
		this.country = [];
		this.address = [];
		this.zip = [];
		this.has_bookings = []; 
	}
	//List Agencies URL
	create_url(){
		var full_url = 'search_type='+ this.filter_by_users + ';status='+ this.status + ';name='+ this.name  + ';surname='+ this.surname + ';agency='+ this.agency + ';email='+ this.email +
		';phone_number='+ this.phone_number + ';city='+ this.city + ';state='+ this.state + ';country='+ this.country + ';address='+ this.address + ';zip='+ this.zip + ';has_bookings='+ this.has_bookings +
		';date_created_from='+ this.date_created_from + ';date_created_to=' + this.date_created_to + ';order='+ this.order + ';asc='+ this.asc + ';number_of_page='+ this.number_of_page;
		return full_url;
	}

	//Change "/" to "-"
	replace_string(){
		if (this.date_created_from !=null){
    		this.date_created_from=this.date_created_from.replace("/", "-");
    		this.date_created_from=this.date_created_from.replace("/", "-");
  		}
  		if (this.date_created_to !=null){
    		this.date_created_to=this.date_created_to.replace("/", "-");
   		    this.date_created_to=this.date_created_to.replace("/", "-");
  		}
	}

	//Undo "/" to "-"
	undo_replace_string(){
		if (this.date_created_from !=null){
    		this.date_created_from=this.date_created_from.replace("-", "/");
    		this.date_created_from=this.date_created_from.replace("-", "/");
  		}
  		if (this.date_created_to !=null){
    		this.date_created_to=this.date_created_to.replace("-", "/");
   		    this.date_created_to=this.date_created_to.replace("-", "/");
  		}
	}

}

