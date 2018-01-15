import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable , NgZone , ChangeDetectorRef  } from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import {CustomHttp} from '../../../services/http-wrapper';
import myGlobals = require('../../../../app');
import { Location } from '@angular/common';
import {LoadingGif} from '../../../bworkspace/filedetail/loading_gif.service';
import {InternalProviders} from '../internal-providers';
import {DataPropertiesInternalProviders} from '../data_properties.service';
import {Core} from '../../../core/core';

declare var jQuery: any;
declare var $: any;


@Injectable()
export class editInternalProviders{

//Inline Int. Providers Request Get Data
int_providers: any;


name = [];
days_to_cxl = [];
city = [];
city_code = [];
zip = [];
email = [];
mobile_phone = [];
address = [];
legend = [];
legend_hotel = [];
legend_attraction = [];
legend_transfer = [];
legend_ife = [];
legend_flight = [];
legend_car = [];
legend_package = [];
legend_cruise = [];
legend_insurance = [];
voucher_payable = [];
voucher_observations = [];
voucher_emergency_contact = [];


//Inline Int. Providers Request Save new Data
name_new = "";
days_to_cxl_new = "";
city_new = "";
city_code_new = "";
zip_new = "";
email_new: any;
mobile_phone_new = "";
address_new = "";
legend_new = "";
legend_hotel_new = "";
legend_attraction_new = "";
legend_transfer_new = "";
legend_ife_new = "";
legend_flight_new = "";
legend_car_new = "";
legend_package_new = "";
legend_cruise_new = "";
legend_insurance_new = "";
voucher_payable_new = "";
voucher_observations_new = "";
voucher_emergency_contact_new = "";

//City autocomplete
city_name: string="";
is_selected = true; //Verify if user select autocomplete option
city_id: any;
singleArray = [];
list_of_city = [];
list_of_codes_city = [];
filteredListCity = []; //Form agency(first form)
filteredListCityUser = []; //Form user exist
length_of_filteredList ; //Length of filtered list of autocomplete city
filteredListCityNewUser = []; //Form new User
elementRef;
to_show_row;
block_edit = false;
relation_name = [];
error_map: any;

//Errors Message autocomplete
general_error_city: string=''; //Request autocomplete
exist_error_city: any; //Request autocomplete
field_city: string=''; //Request autocomplete
field_city_user= []; //Request autocomplete
message_city: any=''; //Request autocomplete
message_city_new: any=''; //Request autocomplete
field_error_city: any = []; //Field specific error Save to field City
field_error_city_new: any = ''; //Field specific error Save to field City
field_name_err_new: any = '';
field_email_err_new: any = '';
field_phone_err_new: any = '';
//Message errors
general_error_prov: string=''; //Request get data
general_error_prov_save: string = ''; //Request general error Save
exist_error_prov_save: any; //Request error specific error Save
field_error_name=[]; //Field specific error Save to field Name
field_error_days=[]; //Field specific error Save to field Days to Cancel
message_name=[]; //Message specific error Save to field Name
message_days=[]; //Message specific error Save to field Days to Cancel
state_validate_city = true; //First form Agency

hideButton:any = [];
updated_form:any;
field_name_err:any = [];
field_email_err:any = [];
field_phone_err:any = [];
updated_form_error:any = [];
updated_form_error_new:any = [];

index:any;

//Validation for all E-mails fields fornt
validation_email_filter: any;
validation_email_filter_keyup = [];
validation_email_filter_keyup_new: any
email_regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

// Notification rules
notification_rules:any;
notification_rules_length:any;
// Price rules
price_rules:any;
price_rules_length:any;

constructor( private ref: ChangeDetectorRef , public http: Http, public _loc:Location, public _providers_service: DataPropertiesInternalProviders,
             public load: LoadingGif , public params : RouteParams , private zone: NgZone ) {}


 keyup_field_email_int_prov(values, ipid){
   //Internal Providers Exist: validation for E-mail Field Internal Provideres exist
   if(values == 'int'){
     if(!this.email_regex.test(this.email[ipid])) {
     this.validation_email_filter_keyup[ipid] = false;
     //Show error message on input HTML
     } else {
       this.validation_email_filter_keyup[ipid] = true; //Clean message
     }
   }
   if(values == 'int-new'){
     if(!this.email_regex.test(this.email_new)) {
     this.validation_email_filter_keyup_new = false;
     //Show error message on input HTML
     } else {
       this.validation_email_filter_keyup_new = true; //Clean message
     }
   }
   else{
    //Internal Providers: validation for field E-mail
    /*if(!this.email_regex.test(values)) {
         this.validation_email_filter = false;
         //Show error message on input HTML
         jQuery('#field-email'+ ipid).addClass('border-errors');
         // this.field_email_err[ipid] = response.json().error_data.error_field_list[i].message;
       } else {
         this.validation_email_filter = true; //Clean message
       } */
   }
}

/////////////////////////////////////////////////////////////////////////
/// Remove All Autocompletes of Internal Providers and clean messages ///
remove_autocomplete(){
}

post_preload_internal_provider(ipid){
  let headers = new Headers({ 'Content-Type': 'application/json' });
  var url;
  url = myGlobals.host+'/api/admin/settings/internal_provider/get_data';
  let body=JSON.stringify({
    id: ipid
  });
	return this.http.post( url, body ,{headers: headers, withCredentials:true} )
    .map(
	    response => {
	    	this.name[ipid] = response.json().name;
			this.days_to_cxl[ipid] =response.json().days_to_cxl;
			this.city[ipid] =response.json().city;
			this.city_code[ipid] =response.json().city_code;
			this.zip[ipid] =response.json().zip;
			this.email[ipid] =response.json().email;
			this.mobile_phone[ipid] =response.json().mobile_phone;
			this.address[ipid] =response.json().address;
			this.legend[ipid] =response.json().legend;
			this.legend_hotel[ipid] =response.json().legend_hotel;
			this.legend_attraction[ipid] =response.json().legend_attraction;
			this.legend_transfer[ipid] =response.json().legend_transfer;
			this.legend_ife[ipid] =response.json().legend_ife;
			this.legend_flight[ipid] =response.json().legend_flight;
			this.legend_car[ipid] =response.json().legend_car;
			this.legend_package[ipid] =response.json().legend_package;
			this.legend_cruise[ipid] =response.json().legend_cruise;
			this.legend_insurance[ipid] =response.json().legend_insurance;
			this.voucher_payable[ipid] =response.json().voucher_payable;
			this.voucher_observations[ipid] =response.json().voucher_observations;
			this.voucher_emergency_contact[ipid] =response.json().voucher_emergency_contact;
	    	console.log('post_preload_internal_provider<><><><><><><><<> :::  '+JSON.stringify(response));
	    }, error => {
	    }
	);
}

save_int_prov( ipid ){
  console.log("Phone para el back: "+this.mobile_phone[ipid]);
	this.load.show_loading_gif();
	// alert(this.days_to_cxl[ipid]);
	// alert(this.city[ipid]);
	let headers = new Headers({ 'Content-Type': 'application/json' });
	var url;
	url = myGlobals.host+'/api/admin/settings/internal_provider/update';
	let body=JSON.stringify({
		id : ipid,
		name : this.name[ipid],
		days_to_cxl : this.days_to_cxl[ipid],
		city : this.city[ipid],
		city_code : this.city_code[ipid],
		zip : this.zip[ipid],
		email : this.email[ipid],
		mobile_phone : this.mobile_phone[ipid],
		address : this.address[ipid],
		legend : this.legend[ipid],
		legend_hotel : this.legend_hotel[ipid],
		legend_attraction : this.legend_attraction[ipid],
		legend_transfer : this.legend_transfer[ipid],
		legend_ife : this.legend_ife[ipid],
		legend_flight : this.legend_flight[ipid],
		legend_car : this.legend_car[ipid],
		legend_package : this.legend_package[ipid],
		legend_cruise : this.legend_cruise[ipid],
		legend_insurance : this.legend_insurance[ipid],
		voucher_payable : this.voucher_payable[ipid],
		voucher_observations : this.voucher_observations[ipid],
		voucher_emergency_contact : this.voucher_emergency_contact[ipid]
	});
	return this.http.post( url, body ,{headers: headers, withCredentials:true} )
    .map(
	    response => {

			this.load.hide_loading_gif();
             this.updated_form = response.json().updated;
                if (response.json().updated == true){
                  this.updated_form_error[ipid] = false;
                // for (var i = 0; i < this.languages.length; ++i) {
                //     $('.error'+this.languages[i].name+index).hide();
                // }
                jQuery('#success-alert-internal-provider').fadeIn('slow'); //Show message success
                setTimeout(() => {
                  jQuery('#success-alert-internal-provider').animate({opacity: 0}, 2500).animate({height: "0px", padding: "0px"}, 2500); //Hide message success
                    setTimeout(() => {
                        this.updated_form = false; //Hide message success
                          setTimeout(() => {
                            $("#cancel_edit_int_prov"+ipid).click();
                             for (var i = 0; i < this._providers_service.internal_provider.length; ++i) {
                               this.hideButton[this._providers_service.internal_provider[i].id] = false;
                             }
                            this.hideButton[ipid] = false;
                            this._providers_service.get_internal_providers(this._providers_service.search_internal_providers,{ page : this._providers_service.current_page })
                           .subscribe();
                           }, 1000);
                    }, 3000);
                }, 1000);
            } else {
                // let goTo = $('#edit-row-expandable'+ipid).offset().top;
                // $("html, body").animate({scrollTop: goTo}, 1500, 'swing', ()=> {
                  for (var i = 0; i < response.json().error_data.error_field_list.length; ++i) {
                    if ( response.json().error_data.error_field_list[i].field == "name" ) {
                      jQuery('#field-name'+ ipid).addClass('border-errors');
                      this.field_name_err[ipid] = response.json().error_data.error_field_list[i].message;
                    }
                    if ( response.json().error_data.error_field_list[i].field == "email" ) {
                      jQuery('#field-email'+ ipid).addClass('border-errors');
                      this.field_email_err[ipid] = response.json().error_data.error_field_list[i].message;
                    }
                    if ( response.json().error_data.error_field_list[i].field == "phone" ) {
                      jQuery('#field-phone'+ ipid).addClass('border-errors');
                      this.field_phone_err[ipid] = response.json().error_data.error_field_list[i].message;
                    }
                  }
                // });
                this.updated_form_error[ipid] = true;
                // return response.json().error_data.general_error;
            }
	    		// alert(JSON.stringify(response));
	    }, error => {}
	);
}


save_int_prov_new(){
  this.load.show_loading_gif();
  let headers = new Headers({ 'Content-Type': 'application/json' });
  var url;
  url = myGlobals.host+'/api/admin/settings/internal_provider/update';
  let body=JSON.stringify({
    id : '',
    name : this.name_new,
    days_to_cxl : this.days_to_cxl_new,
    city : this.city_new,
    city_code : this.city_code_new,
    zip : this.zip_new,
    email : this.email_new,
    mobile_phone : this.mobile_phone_new,
    address : this.address_new,
    legend : this.legend_new,
    legend_hotel : this.legend_hotel_new,
    legend_attraction : this.legend_attraction_new,
    legend_transfer : this.legend_transfer_new,
    legend_ife : this.legend_ife_new,
    legend_flight : this.legend_flight_new,
    legend_car : this.legend_car_new,
    legend_package : this.legend_package_new,
    legend_cruise : this.legend_cruise_new,
    legend_insurance : this.legend_insurance_new,
    voucher_payable : this.voucher_payable_new,
    voucher_observations : this.voucher_observations_new,
    voucher_emergency_contact : this.voucher_emergency_contact_new
  });

  console.log('BODY NEW INT: '+body);
  return this.http.post( url, body ,{headers: headers, withCredentials:true} )
    .map(
      response => {
              console.log('save new: '+JSON.stringify(response));
              this.load.hide_loading_gif();
              this.updated_form = response.json().updated;
                if (response.json().updated == true){
                  this.updated_form_error_new = false;
                // for (var i = 0; i < this.languages.length; ++i) {
                //     $('.error'+this.languages[i].name+index).hide();
                // }
                jQuery('#success-alert-internal-provider').fadeIn('slow'); //Show message success
                setTimeout(() => {
                  jQuery('#success-alert-internal-provider').animate({opacity: 0}, 2500).animate({height: "0px", padding: "0px"}, 2500); //Hide message success
                    setTimeout(() => {
                        this.updated_form = false; //Hide message success
                          setTimeout(() => {
                            for (var i = 0; i < this._providers_service.internal_provider.length; ++i) {
                              this.hideButton[this._providers_service.internal_provider[i].id] = false;
                            }
                            this._providers_service.get_internal_providers(this._providers_service.search_internal_providers,{ page : this._providers_service.current_page })
                           .subscribe();
                            $("#cancel_edit_int_prov").click();
                           }, 1000);
                    }, 3000);
                }, 1000);
            } else {
                // let goTo = $('#field-name'+ipid).offset().top ;
                // $("html, body").animate({scrollTop: goTo}, 1000, 'swing', ()=> {
                //   for (var i = 0; i < response.json().error_data.error_field_list.length; ++i) {
                //     if ( response.json().error_data.error_field_list[i].field == "name" ) {
                //       jQuery('#field-name'+ ipid).addClass('border-errors');
                //       this.field_name_err_new = response.json().error_data.error_field_list[i].message;
                //     }
                //     if ( response.json().error_data.error_field_list[i].field == "email" ) {
                //       jQuery('#field-email'+ ipid).addClass('border-errors');
                //       this.field_email_err_new = response.json().error_data.error_field_list[i].message;
                //     }
                //     if ( response.json().error_data.error_field_list[i].field == "phone" ) {
                //       jQuery('#field-phone'+ ipid).addClass('border-errors');
                //       this.field_phone_err_new = response.json().error_data.error_field_list[i].message;
                //     }
                //   }
                // });
                let goTo = $('#field-name').offset().top ;
                $("html, body").animate({scrollTop: goTo}, 1500, 'swing', ()=> {
                  this.updated_form_error_new = true;
                  for (var i = 0; i < response.json().error_data.error_field_list.length; ++i) {
                    if ( response.json().error_data.error_field_list[i].field == "name" ) {
                      jQuery('#field-name').addClass('border-errors');
                      this.field_name_err_new = response.json().error_data.error_field_list[i].message;
                    }
                    if ( response.json().error_data.error_field_list[i].field == "email" ) {
                      jQuery('#field-email').addClass('border-errors');
                      this.field_email_err_new = response.json().error_data.error_field_list[i].message;
                    }
                    if ( response.json().error_data.error_field_list[i].field == "phone" ) {
                      jQuery('#field-phone').addClass('border-errors');
                      this.field_phone_err_new = response.json().error_data.error_field_list[i].message;
                    }
                  }
                });

                return response.json().error_data.general_error;
            }
          // alert(JSON.stringify(response));
      }, error => {}
  );
}
/////////////////////////////////////////////////////////////////////////////////////////////
/// Request data list Field City(Autocomplete) ///
get_list_city(city_name , i , e) {
  this.index = i;
  console.log(i);
  this.list_of_city = []; //Clean array
  this.list_of_codes_city = []; //Clean array
  let url = myGlobals.host+'/api/admin/city_autocomplete';
  let body=JSON.stringify({ city: city_name, autocomplete_items_count: 5 });
  console.log('BODY: ' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });
    this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe(
          response => {
            console.log('RESPUESTA INLINE AGENCIES(CITY): ' + JSON.stringify(response.json()));
            this.city_name = response.json().location_list;
            this.general_error_city = response.json().error_data.general_error;
            this.exist_error_city = response.json().error_data.exist_error;
            if(this.general_error_city != ''){
              console.log('Error general: ' + JSON.stringify(this.general_error_city));
              console.log('Error general row: ' + (this.to_show_row));
              //Show generic error in HTML with ngIf in general_error_city
            }
            if(this.exist_error_city == true){
              for(var l=0; l<response.json().error_data.error_field_list.length; l++){
                  var city_men = response.json().error_data.error_field_list[0].field;

               if(city_men == 'city'){
                  //Error Message for field City if update fails from backend
                    // for(var f=0; f<response.json().error_data.error_field_list.length; f++){
                  this.field_city = response.json().error_data.error_field_list[l].field;
                  if ( this.index == '' ) {
                    this.field_error_city_new = this.field_city;
                  } else {
                      this.field_error_city[this.index] = this.field_city;
                      // this.notifyOther(i);
                      // this.ref.detectChanges();
                  }
                  this.message_city = response.json().error_data.error_field_list[l].message;
                  this.message_city_new = response.json().error_data.error_field_list[l].message;
                    // }
                  this.filteredListCity = []; //Clean list of City First Form Agency
                  this.length_of_filteredList = this.list_of_city.length; //Get length of list of city
                }
              }
            } else {
                if ( this.index == '' ) {
                    this.field_error_city_new = '';
                    // this.field_error_city_new = this.field_city;
                } else {
                    // this.field_error_city[i] = this.field_city;
                    this.field_error_city[i] = ''; //Clean message
                }

                for(var i=0; i < response.json().location_list.length; i++) {
                  this.list_of_codes_city[i] = response.json().location_list[i].code;
                  this.list_of_city[i] = response.json().location_list[i].name;
                }
                //Filter list Autocomplete City field
                console.log('city name: ' + JSON.stringify(this.city_name));

                this.filteredListCity = this.list_of_city.filter(function(el){
                return el.toLowerCase().indexOf(city_name.toLowerCase()) > -1;
              }.bind(this));
            }
          }, error => {}
      );
  }



///////////////////////////////////////////////////////////////////
/// Implementation Autocomplete for field City with event click ///
filter_city_name_click(city_name, i, e){
  e.preventDefault();
  this.field_error_city[i] = '';
  city_name = '';
  // jQuery('#city').removeClass('border-errors'); //Form Agency
  this.get_list_city(city_name, i, e); //Call request function
}

///////////////////////////////////////////////////////////////////
/// Implementation Autocomplete for field City with event keyup ///
filter_city_name(city_name, i, e) {
  e.preventDefault();
  //Validation for field City
  var validate_city = /[A-Za-z\s]/;
  if(!validate_city.test(this.city[i])){
    this.state_validate_city = false; //First Form Agency
  } else {
    this.state_validate_city = true;
    this.city_id = 'error'; //If invalid character broke city code
  }

  var letter_or_number = this.city[i]; //Store letter
  console.log('filteredListCityNewUser del Keyup get data new user: ' + this.filteredListCityNewUser);
   this.get_list_city(city_name, i, e); //Call request function
  // jQuery('#city').removeClass('border-errors'); //Form Agency
}

//Select city form user exist
select_city(i, item, code){
  if ( i == '' ) {
    this.city_new = item;
    this.city_code_new  = code;
  }
  this.relation_name[i] = item; //User exist
  this.city[i] = item; //User exist
  this.city_code[i] = code; //User exist
  this.message_city = []; //Hide message User exist
  this.filteredListCity = []; //User exist
  this.filteredListCityUser = []; //User exist
  this.length_of_filteredList = []; //User Exist
  this.filteredListCityNewUser = []; //New User
  this.state_validate_city = true; //New User enabled save
  this.is_selected = true;
  jQuery('#city' + i).removeClass('border-errors'); //User exist
}


get_notification_rules(id){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      var url;
       let body=JSON.stringify({ id: id});
        url = myGlobals.host+'/api/admin/settings/internal_provider/notifications';
      return this.http.post( url, body , {headers: headers, withCredentials:true} )
        .map(
          response => {
                  console.log(response.json());
            this.notification_rules_length = response.json().list_notifications.length;
            this.notification_rules = response.json().list_notifications;
             console.log('notification_rules: '+JSON.stringify(this.notification_rules));
            return this.notification_rules;
          }, error => {}
      );
}

get_price_rules(id){
      var url;
        url = myGlobals.host+'/api/admin/settings/internal_provider/price_rules';
       let body=JSON.stringify({ id: id});
      console.log('BODY: ' + body);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      return  this.http.post( url, body, {headers: headers, withCredentials:true})
        .map(
          response => {
                  console.log(response.json());
            this.price_rules_length = response.json().list_price_rules.length;
            this.price_rules = response.json().list_price_rules;
             console.log('price_rules: '+JSON.stringify(this.price_rules));
            return this.price_rules;
          }, error => {}
      );
}



} //Close class editInternalProviders



