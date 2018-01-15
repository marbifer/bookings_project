import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {CustomHttp} from '../../../../services/http-wrapper';
import myGlobals = require('../../../../../app');
import {Location} from '@angular/common';
import {LoadingGif} from '../../../../bworkspace/filedetail/loading_gif.service';
import {RolloverAutocompletes} from '../../../../customers/rollovers-dropdown.service';
import {Agencies} from '../../../list-agencies/agencies';
import {DataPropertiesListAgencies} from '../../../list-agencies/data_properties.service';
import {AgencyDetail} from '../../../list-agencies/agency-detail/agency-detail';
import {Core} from '../../../../core/core';
import {ObjectListExtProviders} from '../../../list-agencies/agency-detail/object-list-ext-prov';

declare var jQuery: any;
declare var $: any;
export var ObjectExtProvider;

@Injectable()
export class editAgencyDetail{

  //Inline Agency Detail Request Get Data: First section: Form and Search and Results
  agency_detail: any;
  name : any;
  name_legal: any;
  address: any;
  city: any;
  location_code: any;
  zip: any;
  phone_number: any;
  email: any;
  tax_number: any;
  license_number: any;
  show_result_cutoff: any;
  how_handle_bookings_cutoff: any;
  status_avail_agency_cutoff: any;
  how_handle_available_bookings: any;
  cutoff_hotel_days: number;
  cutoff_attraction_days: number;
  cutoff_transfer_days: number;
  cutoff_car_days: number;
  cutoff_cruise_days: number;
  cutoff_flight_days: number;
  cutoff_package_days: number;
  cutoff_insurance_days: number;
  credit: any;
  credit_used: any;
  credit_tolerance: any;
  updated_form: any;
  /*status: boolean;
  registered: any;*/

  //Inline Agency Detail Request Save new Data
  name_new: any;
  email_new: any;
  name_legal_new = '';
  address_new = '';
  city_new = '';
  zip_new = '';
  phone_number_new = '';
  tax_number_new = '';
  license_number_new = '';
  show_result_cutoff_backup: any;
  how_handle_bookings_cutoff_backup: any;
  status_avail_agency_cutoff_backup: any;
  how_handle_available_bookings_backup: any;
  cutoff_hotel_days_new = '';
  cutoff_attraction_days_new = '';
  cutoff_transfer_days_new = '';
  cutoff_car_days_new = '';
  cutoff_cruise_days_new = '';
  cutoff_flight_days_new = '';
  cutoff_package_days_new = '';
  cutoff_insurance_days_new = '';
  credit_new = '';
  credit_used_new = '';
  credit_tolerance_new = '';
  state_validate_city = true; //First form Agency
 

  //Inline Agency Detail Request Get Data: Second section: Table Ext. Providers
  list_external_providers: any;
  count_prov: any;
  count_not: any;
  count_users_data_table: any;
  count_users_data_form: any;
  count_price: any;
  status_services_array = []; //Store full array of array
  full_object_table = [];
  full_object_table_mod = [];
  general_error_ext_prov: string =''; //General error message section Ext. Providers

  //Inline Agency Detail Request Get Data: Thirth section: Table Not. Rules
  list_notifications: any;
  exist_error_not_rules: any = '';
  general_error_not_rules: any = '';

  //Inline Agency Detail Request Get Data: Fourth section: Table Users
  id_user_list: any;
  list_users: any;
  first_name = [];
  middle_name = [];
  last_name = [];
  email_user = [];
  office_phone = [];
  mobile_phone = [];
  location_users = [];
  address_user = [];
  password = [];
  agency_code = [];
  forged_session = [];
  registered = [];
  is_admin = [];
  is_comissionable = [];
  user_access = [];
  never_disable = [];
  language = [];
  remove_class = [];
  id_user = [];
  updated_form_user = [];

  //Inline Agency Detail Request Get Data: Fourth section: Data Form Users Exist
  user_detail: any;
  office_phone_data_form = [];
  address_data_form = [];
  password_data_form = [];
  is_admin_data_form = [];
  is_comissionable_data_form = [];
  user_access_data_form = [];
  never_disable_data_form = [];
  never_disable_data_form_backup = [];
  language_data_form = [];
  first_name_data_form = [];
  middle_name_data_form = [];
  last_name_data_form = [];
  email_data_form = [];
  mobile_phone_data_form = [];
  zip_data_form = [];
  agency_name_data_form = [];
  location_data_form = [];
  bookings_data_form = [];
  status_data_form = [];
  forged_session_data_form = [];
  registered_data_form = [];
  code_data_form = [];
  i_user: any;

  //Inline Agency Detail Section Users Exist: Request Save new Data
  first_name_new = [];
  middle_name_new = [];
  last_name_new = [];
  email_user_new = [];
  office_phone_new = [];
  mobile_phone_new = [];
  address_user_new = [];
  zip_user_new = [];
  password_new = [];
  is_comissionable_new = []; 
  user_access_new = []; 
  never_disable_new = []; 
  never_disable_backup = [];
  language_new = [];
  state_validate_city_user_exist = true; //Form User Exist

  //Agency Detail Request Get Data: Fifth section: Form NEW USERS
  is_admin_new_user: any = '';
  is_admin_new_user_backup: any = '';
  is_comissionable_new_user: any = '';
  is_comissionable_new_user_backup: any = '';
  user_access_new_user: any = '';
  user_access_new_user_backup: any = '';
  never_disable_new_user: any = '';
  never_disable_backup_new_user: any = '';
  language_new_user_default: any = '';

  //Inline Agency Detail Section New User: Request Save form Data
  first_name_new_user: any = '';
  middle_name_new_user: any = '';
  last_name_new_user: any = '';
  email_new_user: any = '';
  office_phone_new_user: any = '';
  mobile_phone_new_user: any = '';
  address_user_new_user: any = '';
  password_new_user: any = '';
  zip_new_user: any = '';
  agency_code_new_user: any; 
  is_admin_new_user_save: any;
  never_disable_backup_new_user_save: any;
  language_new_user: any = '';
  state_validate_city_new_user = true; //Form User Exist

  //Agency Detail Request Get Data: Sixth section: Table Price Rules
  list_rules: any;
  exist_error_price_rules: any = '';
  general_error_price_rules: any = '';

  //Request Autocomplete City field (Agency Detail)
  city_name: string="";
  is_selected = true; //Verify if user select autocomplete option
  city_code: string="";
  singleArray = [];
  list_of_city = [];
  list_of_codes_city = [];
  filteredListCity = []; //Form agency(first form)
  filteredListCityUser = []; //Form user exist
  length_of_filteredList = []; //Length of filtered list of autocomplete city
  filteredListCityNewUser = []; //Form new User
  elementRef;
  to_show_row;
  block_edit = false;
  relation_name;
  error_map: any;

  //Request Autocomplete City field (Users)
  relation_name_users = [];
  city_code_user = [];

  //Request Autocomplete City field (New Users)
  relation_name_new_users: any;
  city_code_new_user: string="";

  //Request Dropdown Language Field(Users)
  language_name = [];
  language_li: any;
  language_code = []; //User Exist
  language_code_new_user: any; //New User
  language_code_new_user_default: any; //New User

  //General Errors Message
  general_error_agencies: string =''; //Request 1 get data: section: Form and Search and Results
  general_error_agencies_save: string = ''; //Request 6 general error Save

  //Errors Message autocomplete
  general_error_city: string=''; //Request autocomplete
  exist_error_city: any; //Request autocomplete
  field_city: string=''; //Request autocomplete
  field_city_user= []; //Request autocomplete
  message_city: string=''; //Request autocomplete

  //Specific errors 1er Form after Save
  exist_error_agency_save: any; //Request error specific error Save
  field_error_city: any; //Field specific error Save to field City
  error_field;
  field_error = []; //Field specific error Save to field Name and E-mail
  field_error_hotel: any; //Cut-Off: Field specific error Save to field Hotel
  field_error_attrac: any; //Cut-Off: Field specific error Save to field Attraction
  field_error_transfer: any; //Cut-Off: Field specific error Save to field Transfer
  field_error_car: any; //Cut-Off: Field specific error Save to field Car
  field_error_cruise: any; //Cut-Off: Field specific error Save to field Cruise
  field_error_flight: any; //Cut-Off: Field specific error Save to field Flight
  field_error_pack: any; //Cut-Off: Field specific error Save to field Package
  field_error_insurance: any; //Cut-Off: Field specific error Save to field Insurance
  message_name: string=''; //Message specific error Save to field Name
  message_email: string=''; //Message specific error Save to field E-mail
  message_city_save: string=''; //Message specific error After Save to field City
  message_credit: string=''; //Message specific error After Save to field Credit
  message_credit_used: string=''; //Message specific error After Save to field Credit Used
  message_credit_tolerance: string=''; //Message specific error After Save to field Credit Tolerance

  //Errors Message Cut-Off fields after Save
  message_cutoff_days_hotel: string='';
  message_cutoff_days_attrac: string='';
  message_cutoff_days_transfer: string='';
  message_cutoff_days_car: string='';
  message_cutoff_days_cruise: string='';
  message_cutoff_days_flight: string='';
  message_cutoff_days_package: string='';
  message_cutoff_days_insurance: string='';

  //Errors FORM USER EXIST after Save
  field_error_first_name: any;
  field_error_last_name: any;
  field_error_email: any;
  message_last_name: string=''; //Message specific error Save to field Last Name
  message_city_user = [];  //Message specific error to field City
  only_error = []; //Show error only in edited user exist

  //Errors FORM NEW USER after Save
  error_first_name_new_user: any;
  error_last_name_new_user: any;
  error_email_new_user: any;
  error_password_new_user: any;
  message_last_name_new_user: string=''; //Message specific error Save to field Last Name
  message_city_new_user: string='';  //Message specific error to field City
  only_error_new: any; //Show error only in edited new user
  
  //Validation for all E-mails fields
  validation_email_filter: any; //Form Agency
  validation_email_filter_users = []; //Form User Exist
  validation_email_filter_new_users: any; //Form New User
  email_regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; //Regular Expresión By Pablo.

  //Validation fields Section Credit
  validation_credit: any;
  validation_credit_used: any;
  validation_credit_tolerance: any;

constructor(
  public http: Http, 
  public _loc: Location, 
  public _service: DataPropertiesListAgencies, 
  public _data_pagination: DataPropertiesListAgencies, 
  public load: LoadingGif, 
  public _rol: RolloverAutocompletes, 
  public _obj_prov: ObjectListExtProviders
) {}

 keyup_field_email_agency(form, i){
   this.remove_autocomplete(); //Clean inputs
   //Agency Detail: validation for E-mail Field First form Agency 
   if(form == 'agency'){
     if(!this.email_regex.test(this.email_new)) {
       this.validation_email_filter = false;
       //Show error message on input(id="email-agency") HTML
     } else {
       this.validation_email_filter = true; //Clean message
     }
   }

   //Section New User: validation for E-mail Field 
   if(form == 'new-user'){
     if(!this.email_regex.test(this.email_new_user)) {
     this.validation_email_filter_new_users = false;
     //Show error message on input(id="email-agency") HTML
     } else {
       this.validation_email_filter_new_users = true; //Clean message
     }
   }

   //Section New User: validation for E-mail Field 
   if(form == 'users'){
     if(!this.email_regex.test(this.email_user_new[i])) {
     this.validation_email_filter_users[i] = false;
     //Show error message on input(id="email-agency") HTML
     } else {
       this.validation_email_filter_users[i] = true; //Clean message
     }
   }
}

////////////////////////////////////////////////////////////////////////////////////
/// Request 1 Get data Agency Detail(First section: Form and Search and Results) ///
get_data_agency_detail(id_agency){
      this._service.id_agency = id_agency;
      console.log('ID Agency inline: '+ JSON.stringify(this._service.id_agency));
      let url = myGlobals.host+'/api/admin/customers/agency/detail';
      let body = JSON.stringify({ id_agency: id_agency });
      console.log('BODY: ' + body);
      let headers = new Headers({ 'Content-Type': 'application/json' });

          return this.http.post( url, body, {headers: headers, withCredentials:true})
            .map(
              response => {
                console.log('RESPUESTA INLINE AGENCY DETAIL: ' + JSON.stringify(response.json()));
                this.agency_detail = response.json().agency_detail;
                this.name = this.agency_detail.name;
                this.credit = this.agency_detail.credit;
                this.credit_used = this.agency_detail.credit_used;
                this.credit_tolerance = this.agency_detail.credit_tolerance;
                this.name_legal = this.agency_detail.name_legal;
                this.address = this.agency_detail.address;
                this.city = this.agency_detail.location;
                this.location_code = this.agency_detail.location_code;
                this.zip = this.agency_detail.zip;
                this.phone_number = this.agency_detail.phone_number;
                this.email = this.agency_detail.email;
                this.tax_number = this.agency_detail.tax_number;
                this.license_number = this.agency_detail.license_number;
                this.show_result_cutoff = this.agency_detail.show_result_cutoff;
                this.show_result_cutoff_backup = this.agency_detail.show_result_cutoff;
                this.how_handle_bookings_cutoff = this.agency_detail.how_handle_bookings_cutoff;
                this.how_handle_bookings_cutoff_backup = this.agency_detail.how_handle_bookings_cutoff;
                this.status_avail_agency_cutoff = this.agency_detail.status_avail_agency_cutoff;
                this.status_avail_agency_cutoff_backup = this.agency_detail.status_avail_agency_cutoff;
                this.how_handle_available_bookings = this.agency_detail.how_handle_available_bookings;
                this.how_handle_available_bookings_backup = this.agency_detail.how_handle_available_bookings;
                this.cutoff_hotel_days = this.agency_detail.cutoff_hotel_days;
                this.cutoff_attraction_days = this.agency_detail.cutoff_attraction_days;
                this.cutoff_transfer_days = this.agency_detail.cutoff_transfer_days;
                this.cutoff_car_days = this.agency_detail.cutoff_car_days;
                this.cutoff_cruise_days = this.agency_detail.cutoff_cruise_days;
                this.cutoff_flight_days = this.agency_detail.cutoff_flight_days;
                this.cutoff_package_days = this.agency_detail.cutoff_package_days;
                this.cutoff_insurance_days = this.agency_detail.cutoff_insurance_days;
                this.relation_name = this.city;
                /*this.logo = this.agency_detail.logo;
                this.users = this.agency_detail.users;
                this.credit = this.agency_detail.credit;
                this.status = this.agency_detail.status;
                this.registered = this.agency_detail.registered;*/

                this.general_error_agencies = response.json().error_data.general_error;
                if(this.general_error_agencies != ''){
                  console.log('Error general: ' + JSON.stringify(this.general_error_agencies));
                  //Show generic error in HTML with ngIf in general_error_agencies
                }
                return this.agency_detail;
              }, error => {}
          );
      } //Close request get data get_data_agency_detail

/////////////////////////////////////////////////////////////////////////////////////////////
/// Request data list Field City(Autocomplete) ///
get_list_city(city_name, handlerEvent, i, e) {
  this.i_user = i; //Store iteration because is not working inside request due scope
  this.list_of_city = []; //Clean array
  this.list_of_codes_city = []; //Clean array
  this.field_city = ''; //Clean array
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
            } if(this.exist_error_city == true){
              for(var l=0; l<response.json().error_data.error_field_list.length; l++){
                  var city_men = response.json().error_data.error_field_list[l].field;
              }
               if(city_men == 'city'){
                  //Error Message for field City if update fails from backend
                  if(handlerEvent == 'agency'){
                    for(var f=0; f<response.json().error_data.error_field_list.length; f++){
                      this.field_city = response.json().error_data.error_field_list[f].field;
                      this.message_city = response.json().error_data.error_field_list[f].message;
                      console.log('Agency: ' + f);
                    }
                    jQuery('#city').addClass('border-errors');
                  }else if(handlerEvent == 'users'){
                    var p = this.i_user; //Store iteration in short variable
                    for(var g=0; g<response.json().error_data.error_field_list.length; g++){
                      var store_field = response.json().error_data.error_field_list[g].field;
                      this.field_city_user[p] = store_field;
                      this.message_city_user[p] = response.json().error_data.error_field_list[g].message;
                      console.log('this.field_city_user[i]: ' +  this.field_city_user[p]);
                      console.log('this.message_city_user[i]: ' +   this.message_city_user[p]);
                    }
                    jQuery('#city-user' + p).addClass('border-errors');
                    this.length_of_filteredList = []; //Clean list autocomplete
                  }
                  else if(handlerEvent == 'new-user'){
                    var p = this.i_user; //Store iteration in short variable
                    for(var g=0; g<response.json().error_data.error_field_list.length; g++){
                      var store_field = response.json().error_data.error_field_list[g].field;
                      this.field_error_city = store_field;
                      this.message_city_new_user = response.json().error_data.error_field_list[g].message;
                      console.log('this.field_city_user[i]: ' +  this.field_error_city);
                      console.log('this.message_city_user[i]: ' +   this.message_city_new_user);
                    }
                    jQuery('#city-user-new').addClass('border-errors');
                  }
                  this.filteredListCity = []; //Clean list of City First Form Agency
                  this.filteredListCityUser = []; //Clean list of City User Exist
                  this.filteredListCityNewUser = []; //Clean list of City New User
              }
            } else {
              for(var i=0; i < response.json().location_list.length; i++) {
                this.list_of_codes_city[i] = response.json().location_list[i].code;
                this.list_of_city[i] = response.json().location_list[i].name;
              }
              //Filter list Autocomplete City field
              console.log('city name: ' + JSON.stringify(this.city_name));
               switch(handlerEvent) {
                  case 'agency':
                    this.filteredListCity = this.list_of_city.filter(function(el){
                    return el.toLowerCase().indexOf(city_name.toLowerCase()) > -1;
                  }.bind(this));
                    break;

                  case 'users':
                    this.filteredListCityUser[this.i_user] = this.list_of_city;
                    this.length_of_filteredList[this.i_user] = this.list_of_city.length; //Get length of list of city
                    console.log('Verificar array: ' + JSON.stringify(this.filteredListCityUser));
                    break;

                  case 'new-user':
                    this.filteredListCityNewUser = this.list_of_city;
                    console.log('filteredListCityNewUser del request get data new user: ' + this.filteredListCityNewUser);
                } //End switch
              console.log('lista de códigos:' + this.list_of_codes_city);
            }
          }, error => {}
      );
  }

///////////////////////////////////////////////////////////////////
/// Implementation Autocomplete for field City with event click ///
filter_city_name_click(city_name, handlerEvent, i, e){
  e.preventDefault();
  this.field_error_city = []; //Clean message
  this.message_city_user = []; //Hide message User exist
  this.message_city_new_user = ''; //Hide message New User
  city_name = '';
  this.get_list_city(city_name, handlerEvent, i, e); //Call request function
  jQuery('#city-user' + i).removeClass('border-errors'); //User exist
  jQuery('#city-user-new').removeClass('border-errors'); //New User 
}

///////////////////////////////////////////////////////////////////
/// Implementation Autocomplete for field City with event keyup ///
filter_city_name(city_name, handlerEvent, i, e){
  e.preventDefault();
  
  //Validation for field City
  var validate_city = /[A-Za-z\s]/;
  if(!validate_city.test(this.relation_name)){ 
    this.state_validate_city = false; //First Form Agency 
  } else {
    this.state_validate_city = true;
    this.city_code = 'error'; //If invalid character broke city code
  }

  //Form User Exist 
  if(handlerEvent == 'users'){
    if(!validate_city.test(this.relation_name_users[i])){ 
      this.state_validate_city_user_exist = false;  
    } else {
      this.state_validate_city_user_exist = true;
      this.city_code_user[i] = 'error'; //If invalid character broke city code
    }
  }

  //Form New User 
  if(handlerEvent == 'new-user'){
    if(!validate_city.test(this.relation_name_new_users)){ 
      this.state_validate_city_new_user = false;  
    } else {
      this.state_validate_city_new_user = true;
      this.city_code_new_user = 'error'; //If invalid character broke city code
    }
  }

  var letter_or_number = this.relation_name; //Store letter
  this.get_list_city(city_name, handlerEvent, i, e); //Call request function
  this.message_city_user = []; //Hide message User exist
  this.message_city_new_user = ''; //Hide message New User
  jQuery('#city').removeClass('border-errors'); //Form Agency
  jQuery('#city-user' + i).removeClass('border-errors'); //User exist
  jQuery('#city-user-new').removeClass('border-errors'); //New User
  console.log('filteredListCityNewUser del Keyup get data new user: ' + this.filteredListCityNewUser); 
}

 //////////////////////////////
/// Clean inputs with keyup ///
clean_field(){
  this.remove_autocomplete();
}

//Select First form Agency and search and Results
select(item, code, handlerEvent){
  this.relation_name = item;
  this.city_code = code;
  switch(handlerEvent) {
    case 'agency':
      this.filteredListCity = [];
        break;
    case 'users':
      this.filteredListCityUser = [];
         break;
    case 'new-user':
      this.filteredListCityNewUser = [];
}
  this.is_selected = true;
}

//Select city form user exist
select_city_user(i, item, code){
  this.relation_name_users[i] = item; //User exist
  this.relation_name_new_users = item; //New User
  this.city_code_user[i] = code; //User exist
  this.city_code_new_user = code; //New User
  console.log('city code user: ' + this.city_code_user[i]);
  console.log('city code NEW user: ' + this.city_code_new_user);
  this.message_city_user = []; //Hide message User exist
  this.filteredListCity = []; //User exist
  this.filteredListCityUser = []; //User exist
  this.length_of_filteredList = []; //User Exist
  this.filteredListCityNewUser = []; //New User
  this.state_validate_city_new_user = true; //New User enabled save
  this.is_selected = true;
  jQuery('#city-user' + i).removeClass('border-errors'); //User exist 
}

close_form_user(){
  for(var x=0; x<this.remove_class.length; x++){
     this.remove_class[x] = true; //Close form
   }
}

remove_message_city(){
  this.field_error_city = [];
  this.field_city_user = [];
  this.state_validate_city = true; //Fisrt form Agency
  this.state_validate_city_user_exist = true; //Form User Exist
  this.state_validate_city_new_user = true; //Form New User
}

/////////////////////////////////////////////////
/// Remove All Autocompletes of Agency Detail ///
remove_autocomplete(){
  this.only_error = []; //Hide message error User Exist
  this.only_error_new = ""; //Hide message error User Exist
  jQuery('#name, .first-name, .last-name').removeClass('border-errors'); //User Exist
  jQuery('.first-name-new, .last-name-new, .password-new').removeClass('border-errors'); //New User
  this.message_name = ''; //Hide specific message First form Agency
  this.message_email = ''; //Hide specific message First form Agency
  this.validation_email_filter == true; //Form Agency
  this.field_city = ''; //Hide specific message First form Agency
  this.field_error = []; //Hide general error message First form Agency
  this.error_first_name_new_user = ''; //Hide specific message New User
  this.error_password_new_user = ''; //Hide specific message New User
  this.message_last_name_new_user = ''; //Hide specific error New User
  this.filteredListCity.length = 0; //First form Agency
  this.filteredListCityUser.length = 0; //Form User Exist
  this.filteredListCityNewUser.length = 0; //Form New user
  this.length_of_filteredList = []; 
  this.validation_credit = true; //Field credit First form Agency
  this.message_credit = ''; //Field credit First form Agency
  this.validation_credit_used = true; //Field used form Agency
  this.message_credit_used  = ''; //Field used form Agency
  this.validation_credit_tolerance = true; //Field tolerance form Agency
  this.message_credit_tolerance = ''; //Field tolerance form Agency
  //this.validation_email_filter_new_users = true; //Border error and message Form New user 
}

//////////////////////////////////////////////////////////////////////////////////
/// Request 2 Get data Agency Detail(Second section: Table External providers) ///
get_data_ext_providers(id_agency){
      this._service.id_agency = id_agency;
      console.log('ID Agency inline: '+ JSON.stringify(this._service.id_agency));
      let url = myGlobals.host+'/api/admin/customers/agency/detail/external_providers';
      let body = JSON.stringify({ id_agency: id_agency });
      console.log('BODY: ' + body);
      let headers = new Headers({ 'Content-Type': 'application/json' });

          return this.http.post( url, body, {headers: headers, withCredentials:true})
            .map(
              response => {
                console.log('RESPUESTA AGENCY DETAIL: Ext. Prov: ' + JSON.stringify(response.json()));
                this.list_external_providers = response.json().list_external_providers;
                this.count_prov = this.list_external_providers.length; //Count
                console.log('CANTIDAD EXT. PROV: ' + this.count_prov);

                this.general_error_agencies = response.json().error_data.general_error;
                if(this.general_error_agencies != ''){
                  console.log('Error general: ' + JSON.stringify(this.general_error_agencies));
                  //Show generic error in HTML with ngIf in general_error_agencies
                }
                for(var i=0; i<this.count_prov; i++){ //Store object status toggle
                  this.status_services_array[i] = this.list_external_providers[i].status_services;
                }
                return this.list_external_providers;
              }, error => {}
          );
      } //Close request get data get_data_ext_providers

/////////////////////////////////////////////////////////////
/// Request Toggles enabled-disabled Table Ext. Providers ///
enabled_disabled_toggles(provider_code, service_type, status, i, z, service_type_name){
  if(status != 2){ //If isn't 2(cross), can be toggled
    if(status == 0){
      status = 1;
    }else if(status == 1){
      status = 0;
    }

    // Edited Object from request
    this.full_object_table = this.list_external_providers;
    this.full_object_table[i].status_services[z] = {
        "service_type_code": service_type,
        "status": status,
        "service_type_name": service_type_name
    }
      console.log('CRUISE-PACKAGE: ' + JSON.stringify(this.full_object_table[i].status_services[z]));

    // Object requested by backend(unnecessary properties deleted)
    for(var m=0; m<this.count_prov; m++){
      this.full_object_table_mod[m] = {
        "provider_code": this.full_object_table[m].id,
        "status_service": []
      }

      for(var s=0; s<this.full_object_table[m].status_services.length; s++){
        this.full_object_table_mod[m].status_service[s] = {
          "service_type_code": this.full_object_table[m].status_services[s].service_type_code,
          "status": this.full_object_table[m].status_services[s].status
        }
      }
    } //Close for

    let url = myGlobals.host+'/api/admin/customers/agency/external_provider/service_change_status';
    let body=JSON.stringify({ agency_id: this._service.id_agency, service_status_list: this.full_object_table_mod});
    console.log('Body request TOGGLES Ext. Providers: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .subscribe(
        response => {
          console.log('RESPUESTA AGENCY DETAIL: Ext. Prov TOGGLES: ' + JSON.stringify(response.json()));
          this.get_data_ext_providers(this._service.id_agency).subscribe();
        }, error => {}
    );
  } //Close if
} //Close request enabled_disabled_toggles

///////////////////////////////////////////////////////////////////////////////////
/// Request 3 Get data Agency Detail(Thirth section: Table Notificaction Rules) ///
get_data_not_rules(id_agency){
      this._service.id_agency = id_agency;
      console.log('ID Agency inline: '+ JSON.stringify(this._service.id_agency));
      let url = myGlobals.host+'/api/admin/customers/agency/detail/notifications';
      let body = JSON.stringify({ id_agency: id_agency });
      console.log('BODY: ' + body);
      let headers = new Headers({ 'Content-Type': 'application/json' });

          return this.http.post( url, body, {headers: headers, withCredentials:true})
            .map(
              response => {
                console.log('RESPUESTA AGENCY DETAIL: Not. Rules: ' + JSON.stringify(response.json()));
                this.list_notifications = response.json().list_notifications;
                this.count_not = this.list_notifications.length; //Count
                console.log('CANTIDAD NOT. RULES: ' + this.count_not);

                this.general_error_ext_prov = response.json().error_data.general_error;
                if(this.general_error_ext_prov != ''){
                  console.log('Error general: ' + JSON.stringify(this.general_error_ext_prov));
                  //Show generic error in HTML with ngIf in general_error_agencies
                }
                return this.list_notifications;
              }, error => {}
          );
      } //Close request get data get_data_not_rules

////////////////////////////////////////////////////
/// Request icon delete TABLE NOTIFICATION RULES ///
delete_not_rules(code_rules){
  this.load.show_loading_gif(); //Loading gif
  let updated_not_rules;
  var notification_code = code_rules;
  console.log('código de notification: ' + notification_code);
    let url = myGlobals.host+'/api/admin/customers/agency/notification/delete';
    let body=JSON.stringify({ agency_code: this._service.id_agency, notification_code: notification_code});
    console.log('Lo que mando: Delete Not. Rules: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

      return this.http.post( url, body, {headers: headers, withCredentials:true})
      .subscribe(
        response => {
          console.log('RESPUESTA DELETE: NOTIFICATION RULES: ' + JSON.stringify(response.json()));
          updated_not_rules = response.json().updated;
          this.exist_error_not_rules = response.json().error_data.exist_error;
          this.general_error_not_rules = response.json().error_data.general_error;
          if(this.general_error_not_rules != ''){
              this.load.hide_loading_gif(); //Remove loading gif
              console.log('Error general: ' + JSON.stringify(this.general_error_not_rules));
              //Show generic error in HTML with ngIf in general_error_not_rules
          }else{
            this.get_data_not_rules(this._service.id_agency).subscribe();
          }
        }, error => {}
    );
}

////////////////////////////////////////////////////////////////////////////////////
/// Request 4 Get data Agency Detail(Fourth section: TABLE DATA Users existing) ///
get_data_users(id_agency, i){
      this._service.id_agency = id_agency;
      console.log('ID Agency inline USERS EXIST: '+ JSON.stringify(this._service.id_agency));
      let url = myGlobals.host+'/api/admin/customers/agency/detail/users';
      let body = JSON.stringify({ id_agency: id_agency });
      console.log('BODY USERS EXIST: ' + body);
      let headers = new Headers({ 'Content-Type': 'application/json' });
          return this.http.post( url, body, {headers: headers, withCredentials:true})
            .map(
              response => {
                console.log('RESPUESTA AGENCY DETAIL: Table Users: ' + JSON.stringify(response.json()));
                this.list_users = response.json().list_users;
                console.log('list_users: ' + JSON.stringify(this.list_users));

                if(this.list_users.length > 0){ //If list user is not empty
                  this.first_name[i] = this.list_users[i].first_name;
                  this.middle_name[i] = this.list_users[i].middle_name;
                  this.last_name[i] = this.list_users[i].last_name;
                  this.email_user[i] = this.list_users[i].email;
                  this.mobile_phone[i] = this.list_users[i].mobile_phone;
                  this.location_users[i] = this.list_users[i].location;
                  this.address_user[i] = this.list_users[i].address;
                  this.password[i] = this.list_users[i].password;
                  this.is_admin[i] = this.list_users[i].is_admin;
                  this.is_comissionable[i] = this.list_users[i].is_comissionable;
                  this.user_access[i] = this.list_users[i].user_access;
                  this.never_disable[i] = this.list_users[i].never_disable;
                  this.never_disable_backup[i] = this.list_users[i].never_disable;
                  this.language[i] = this.list_users[i].language;
                  this.agency_code[i] = this.list_users[i].agency_code;
                  this.forged_session[i] = this.list_users[i].forged_session;
                  this.registered[i] = this.list_users[i].registered;
                  this.id_user[i] = this.list_users[i].code;
                  this.relation_name_users[i] = this.location_users[i];
                  console.log('lenguaje: ' + this.language[i]);
                } 

                this.count_users_data_table = this.list_users.length; //Count
                console.log('CANTIDAD TABLE USERS: ' + this.count_users_data_table);              

                this.general_error_agencies = response.json().error_data.general_error;
                if(this.general_error_agencies != ''){
                  console.log('Error general: ' + JSON.stringify(this.general_error_agencies));
                  //Show generic error in HTML with ngIf in general_error_agencies
                }
                return this.list_users;
              }, error => {}
          );
      } //Close request get data get_data_users

///////////////////////////////////////////////////////////////////////////////////
/// Request 5 Get data Agency Detail(Fourth section: FORM DATA Users existing ) ///
get_data_users_form(id_user, i){
  this.remove_message_city();
      this.id_user = id_user;
      console.log('i: '+ JSON.stringify(i));
      console.log('ID DE USUARIO: ' + JSON.stringify(this.id_user));
      let url = myGlobals.host+'/api/admin/customers/user/detail';
      let body = JSON.stringify({ id_user: id_user });
      console.log('BODY USERS EXIST FORM: ' + body);
      let headers = new Headers({ 'Content-Type': 'application/json' });
          return this.http.post( url, body, {headers: headers, withCredentials:true})
            .subscribe(
              response => {
                console.log('RESPUESTA: DATA FORM Users DETAIL: ' + JSON.stringify(response.json()));
                this.user_detail = response.json().user_detail;
                this.office_phone_data_form[i] = this.user_detail.office_phone;
                this.address_data_form[i] = this.user_detail.address;
                this.password_data_form[i] = this.user_detail.password
                this.is_admin_data_form[i] = this.user_detail.is_admin;
                this.is_comissionable_data_form[i] = this.user_detail.is_comissionable;
                this.user_access_data_form[i] = this.user_detail.user_access;
                this.never_disable_data_form[i] = this.user_detail.never_disable;
                this.never_disable_data_form_backup[i] = this.user_detail.never_disable;
                this.language_data_form[i] = this.user_detail.language;
                this.first_name_data_form[i] = this.user_detail.first_name;
                this.middle_name_data_form[i] = this.user_detail.middle_name;
                this.last_name_data_form[i] = this.user_detail.last_name;
                this.email_data_form[i] = this.user_detail.email;
                this.mobile_phone_data_form[i] = this.user_detail.mobile_phone;
                this.agency_name_data_form[i] = this.user_detail.agency_name;
                this.location_data_form[i] = this.user_detail.location;
                this.bookings_data_form[i] = this.user_detail.bookings;
                this.status_data_form[i] = this.user_detail.status;
                this.forged_session_data_form[i] = this.user_detail.forged_session;
                this.registered_data_form[i] = this.user_detail.registered;
                this.code_data_form[i] = this.user_detail.code;
                console.log('lenguaje: ' + this.language_data_form[i]);
                this.count_users_data_form = this.user_detail.length; //Count
                console.log('CANTIDAD TABLE USERS: ' + this.count_users_data_form);

                this.general_error_agencies = response.json().error_data.general_error;
                if(this.general_error_agencies != ''){
                  console.log('Error general: ' + JSON.stringify(this.general_error_agencies));
                  //Show generic error in HTML with ngIf in general_error_agencies
                }
                return this.user_detail;
              }, error => {}
          );
      } //Close request get data get_data_users_form

/////////////////////////////////////////////////////////////////////////
/// Request 6 Get data Agency Detail(Fourth section: Form NEW Users) ///
get_data_users_new(){
  this.cancel_edit_form_new_user('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
  let url = myGlobals.host+'/api/admin/customers/user/new';
  let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.get( url, { headers: headers, withCredentials:true})
      .map(
        response => {
          console.log('RESPUESTA AGENCY DETAIL: Form Users NEW: ' + JSON.stringify(response.json()));
          this.is_admin_new_user = response.json().is_admin;
          this.is_admin_new_user_backup = response.json().is_admin;
          this.is_comissionable_new_user = response.json().is_comissionable;
          this.is_comissionable_new_user_backup = response.json().is_comissionable;
          this.user_access_new_user = response.json().user_access;
          this.user_access_new_user_backup = response.json().user_access;
          this.never_disable_new_user = response.json().never_disable;
          this.never_disable_backup_new_user = response.json().never_disable;
          this.language_new_user_default = response.json().language;
          this.language_code_new_user_default = response.json().language_code;

          //Hide message and red border after Cancel
          $('.first-name-new, .last-name-new, .email-new-user, .password-new').removeClass('border-errors');
          this.general_error_agencies_save = ''; //Hide generic message
          this.error_first_name_new_user = ''; //Hide specific message
          this.error_password_new_user = ''; //Hide specific message
          this.message_last_name_new_user = ''; //Hide specific error

          return 'NEW USER';
        }, error => {}
    );
} //Close request get data get_data_users_new

//////////////////////////////////////////////////////////////////////////
/// Request 7 Get data Agency Detail(Fifth section: Table Price Rules) ///
get_data_price_rules(id_agency){
      this._service.id_agency = id_agency;
      console.log('ID Agency inline: '+ JSON.stringify(this._service.id_agency));
      let url = myGlobals.host+'/api/admin/customers/agency/detail/price_rules';
      let body = JSON.stringify({ id_agency: id_agency });
      console.log('BODY: ' + body);
      let headers = new Headers({ 'Content-Type': 'application/json' });

          return this.http.post( url, body, {headers: headers, withCredentials:true})
            .map(
              response => {
                console.log('RESPUESTA AGENCY DETAIL: Table Price Rules: ' + JSON.stringify(response.json()));
                this.list_rules = response.json().list_price_rules;
                this.count_price = this.list_rules.length; //Count
                console.log('CANTIDAD TABLE PRICE RULES: ' + this.count_price);

                this.general_error_agencies = response.json().error_data.general_error;
                if(this.general_error_agencies != ''){
                  console.log('Error general: ' + JSON.stringify(this.general_error_agencies));
                  //Show generic error in HTML with ngIf in general_error_agencies
                }
                return this.list_rules;
              }, error => {}
          );
      } //Close request get data get_data_price_rules

/////////////////////////////////////////////
/// Request icon delete TABLE PRICE RULES ///
delete_price_rules(code_rules){
  this.load.show_loading_gif(); //Loading gif
  let updated_price_rules;
  var price_code = code_rules;
  console.log('código de price rules: ' + price_code);
    let url = myGlobals.host+'/api/admin/customers/agency/price_rule/delete';
    let body=JSON.stringify({ agency_code: this._service.id_agency, price_rule_code: price_code});
    console.log('Lo que mando: Delete Price Rules: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

      return this.http.post( url, body, {headers: headers, withCredentials:true})
      .subscribe(
        response => {
          console.log('RESPUESTA DELETE: PRICE RULES: ' + JSON.stringify(response.json()));
          updated_price_rules = response.json().updated;
          this.exist_error_price_rules = response.json().error_data.exist_error;
          this.general_error_price_rules = response.json().error_data.general_error;
          if(this.general_error_price_rules != ''){
              this.load.hide_loading_gif(); //Remove loading gif
              console.log('Error general: ' + JSON.stringify(this.general_error_price_rules));
              //Show generic error in HTML with ngIf in general_error_price_rules
          }else{
            this.get_data_price_rules(this._service.id_agency).subscribe();
          }
        }, error => {}
    );
}

////////////////////////////////////////////////////////////////////////////////
/// Request Save data Edit Form and Search and results Section Agency Detail ///
save_agency_detail(send_mail){
  if(this.name_new == undefined){ //If user did not change value set property with Data from the value
    var name = '#name';
    this.name_new = jQuery(name).val();
  }
  if(this.name_legal_new == ''){
    var name_legal = '#legal-name';
    this.name_legal_new = jQuery(name_legal).val();
  }
  if(this.email_new == undefined){
    var email = '#email-agency';
    this.email_new = jQuery(email).val();
  }
  if(this.tax_number_new == ''){
    var tax_number = '#tax';
    this.tax_number_new = jQuery(tax_number).val();
  }
  if(this.phone_number_new == ''){
    var phone_number = '#phone';
    this.phone_number_new = jQuery(phone_number).val();
  }
  if(this.address_new == ''){
    var address = '#address';
    this.address_new = jQuery(address).val();
  }
  if(this.zip_new == ''){
    var zip = '#zip';
    this.zip_new = jQuery(zip).val();
  }
  if(this.license_number_new == ''){
    var license_number = '#licence-number';
    this.license_number_new = jQuery(license_number).val();
  }
  if(this.cutoff_hotel_days_new == ''){
    var cutoff_hotel_days = '#days-hotel';
    this.cutoff_hotel_days_new = jQuery(cutoff_hotel_days).val();
  }
  if(this.cutoff_attraction_days_new == ''){
    var cutoff_attraction_days = '#attraction';
    this.cutoff_attraction_days_new = jQuery(cutoff_attraction_days).val();
  }
  if(this.cutoff_transfer_days_new == ''){
    var cutoff_transfer_days = '#transfer';
    this.cutoff_transfer_days_new = jQuery(cutoff_transfer_days).val();
  }
  if(this.cutoff_car_days_new == ''){
    var cutoff_car_days = '#car';
    this.cutoff_car_days_new = jQuery(cutoff_car_days).val();
  }
  if(this.cutoff_cruise_days_new == ''){
    var cutoff_cruise_days = '#cruise';
    this.cutoff_cruise_days_new = jQuery(cutoff_cruise_days).val();
  }
  if(this.cutoff_flight_days_new == ''){
    var cutoff_flight_days = '#flight';
    this.cutoff_flight_days_new = jQuery(cutoff_flight_days).val();
  }
  if(this.cutoff_package_days_new == ''){
    var cutoff_package_days = '#package';
    this.cutoff_package_days_new = jQuery(cutoff_package_days).val();
  }
  if(this.cutoff_insurance_days_new == ''){
    var cutoff_insurance_days = '#insurance';
    this.cutoff_insurance_days_new = jQuery(cutoff_insurance_days).val();
  }
  if(this.credit_new == ''){
    var credit_ = '#credit-new';
    this.credit_new = jQuery(credit_).val();
  }
  if(this.credit_used_new == ''){
    var credit_used = '#credit-used';
    this.credit_used_new = jQuery(credit_used).val();
  }
  if(this.credit_tolerance_new == ''){
    var credit_tolerance = '#credit-tolerance';
    this.credit_tolerance_new = jQuery(credit_tolerance).val();
  }

  this.load.show_loading_gif(); //Loading gif
  let url = myGlobals.host+'/api/admin/customers/agency/edit/save';

  let body=JSON.stringify({
    id: this._service.id_agency,
    name: this.name_new,
    name_legal: this.name_legal_new,
    email: this.email_new,
    tax_number: this.tax_number_new,
    phone_number: this.phone_number_new,
    city_code: this.city_code, //Code selected of city field on autocomplete
    address: this.address_new,
    zip: this.zip_new,
    license_number: this.license_number_new,
    cutoff_hotel_days: this.cutoff_hotel_days_new,
    cutoff_attraction_days: this.cutoff_attraction_days_new,
    cutoff_transfer_days: this.cutoff_transfer_days_new,
    cutoff_car_days: this.cutoff_car_days_new,
    cutoff_cruise_days: this.cutoff_cruise_days_new,
    cutoff_flight_days: this.cutoff_flight_days_new,
    cutoff_package_days: this.cutoff_package_days_new,
    cutoff_insurance_days: this.cutoff_insurance_days_new,
    show_result_cutoff: this.show_result_cutoff,
    how_handle_bookings_cutoff: this.how_handle_bookings_cutoff,
    status_avail_agency_cutoff: this.status_avail_agency_cutoff,
    how_handle_available_bookings: this.how_handle_available_bookings,
    credit: this.credit_new,
    credit_used: this.credit_used_new,
    credit_tolerance: this.credit_tolerance_new,
    send_mail: send_mail
  });

  console.log('body EDIT AGENCY DETAIL' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });
      
      if(this.state_validate_city == true){

        this.http.post( url, body, {headers: headers, withCredentials:true})
          .subscribe(
            response => {
              console.log('RESPONSE EDIT AGENCY DETAIL: ' + JSON.stringify(response.json()));
              this.updated_form = response.json().updated;
              if (this.updated_form == true){
                    this.after_save_form_agency(
                    this.name_new, this.name_legal_new, this.email_new, this.tax_number_new, this.phone_number_new,
                    this.city_code, this.address_new, this.zip_new, this.license_number_new, this.cutoff_hotel_days_new,
                    this.cutoff_attraction_days_new, this.cutoff_transfer_days_new, this.cutoff_car_days_new, this.cutoff_cruise_days_new,
                    this.cutoff_flight_days_new, this.cutoff_package_days_new, this.cutoff_insurance_days_new, this.show_result_cutoff,
                    this.how_handle_bookings_cutoff, this.status_avail_agency_cutoff, this.how_handle_available_bookings, this.credit_new, this.credit_used_new, this.credit_tolerance_new
                  );

                  jQuery('#success-alert').fadeIn('slow'); //Show message success
                  setTimeout(() => {
                    jQuery('#success-alert').animate({opacity: 0}, 3000).animate({height: "0px", padding: "0px"}, 3000); //Hide message success

                      setTimeout(() => {
                        this.updated_form = false; //Hide message success
                        jQuery('#close-agency').trigger('click'); //Back to list agencies after hide success message
                      }, 6000);
                  }, 4000);
              }else{
                $( "html, body" ).stop().animate({scrollTop:0}, 1500, 'swing'); //Scroll to top after  get error on save 
                this.load.hide_loading_gif(); //Remove loading gif
                this.exist_error_agency_save = response.json().error_data.exist_error;
                this.general_error_agencies_save = response.json().error_data.general_error;
                console.log('Error general: ' + JSON.stringify(this.general_error_agencies_save));
                console.log('Error específico: ' + JSON.stringify(this.exist_error_agency_save));
                if(this.general_error_agencies_save != ''){
                  //Show generic error in HTML with ngIf in general_error_agencies_save
                } else if(this.exist_error_agency_save == true){
                  this.error_field = response.json().error_data.error_field_list;
                  for(var x = 0; x<this.error_field.length; x++){
                    this.field_error[x] = this.error_field[x].field;
                    this.field_error_city[x] = this.error_field[x].field;

                    if(this.field_error[x] == 'name'){
                      //Error Message for Name if update fails from backend
                      this.message_name = response.json().error_data.error_field_list[x].message;
                      jQuery('#name').addClass('border-errors');
                      console.log('name: ' + this.message_name);
                    }
                    if(this.field_error[x] == 'email'){
                      //Error Message for field E-mail if update fails from backend
                      this.message_email = response.json().error_data.error_field_list[x].message;
                      jQuery('#email').addClass('border-errors');
                      console.log('email: ' + this.message_email );
                    }
                    if(this.field_error_city == 'city'){
                      //Error Message for field City if update fails from backend
                      this.message_city_save = response.json().error_data.error_field_list[x].message;
                      jQuery('#city').addClass('border-errors');
                      console.log('City: ' + this.message_city_save);
                    }
                    //Error Message for fields Cut Offs Days if update fails from backend
                    if(this.field_error[x] == 'cutoff_hotel_days'){
                      this.field_error_hotel = this.error_field[x].field;
                      this.message_cutoff_days_hotel = response.json().error_data.error_field_list[x].message;
                      console.log('Days Hotel: ' + this.message_cutoff_days_hotel);
                    }
                    if(this.field_error[x] == 'cutoff_attraction_days'){
                      this.field_error_attrac = this.error_field[x].field;
                      this.message_cutoff_days_attrac = response.json().error_data.error_field_list[x].message;
                      console.log('Days attraction: ' + this.message_cutoff_days_attrac);
                    }
                    if(this.field_error[x] == 'cutoff_transfer_days'){
                      this.field_error_transfer = this.error_field[x].field;
                      this.message_cutoff_days_transfer = response.json().error_data.error_field_list[x].message;
                      console.log('Days Transfer: ' + this.message_cutoff_days_transfer);
                    }
                    if(this.field_error[x] == 'cutoff_car_days'){
                      this.field_error_car = this.error_field[x].field;
                      this.message_cutoff_days_car = response.json().error_data.error_field_list[x].message;
                      console.log('Days Car: ' + this.message_cutoff_days_car);
                    }
                    if(this.field_error[x] == 'cutoff_cruise_days'){
                      this.field_error_cruise = this.error_field[x].field;
                      this.message_cutoff_days_cruise = response.json().error_data.error_field_list[x].message;
                      console.log('Days Cruise: ' + this.message_cutoff_days_cruise);
                    }
                    if(this.field_error[x] == 'cutoff_flight_days'){
                      this.field_error_flight = this.error_field[x].field;
                      this.message_cutoff_days_flight = response.json().error_data.error_field_list[x].message;
                      console.log('Days Flight: ' + this.message_cutoff_days_flight);
                    }
                    if(this.field_error[x] == 'cutoff_package_days'){
                      this.field_error_pack = this.error_field[x].field;
                      this.message_cutoff_days_package = response.json().error_data.error_field_list[x].message;
                      console.log('Days Package: ' + this.message_cutoff_days_package);
                    }
                    if(this.field_error[x] == 'cutoff_insurance_days'){
                      this.field_error_insurance = this.error_field[x].field;
                      this.message_cutoff_days_insurance = response.json().error_data.error_field_list[x].message;
                      console.log('Days Insurance: ' + this.message_cutoff_days_insurance);
                    }
                    if(this.field_error[x] == 'credit'){
                      //Error Message for field Credit if update fails from backend
                      this.message_credit = response.json().error_data.error_field_list[x].message;
                      jQuery('#credit-new').addClass('border-errors');                                           
                      console.log('Credit: ' + this.message_credit);
                    }
                    if(this.field_error[x] == 'credit_used'){ 
                      //Error Message for field Credit Used if update fails from backend                
                      this.message_credit_used = response.json().error_data.error_field_list[x].message;
                      jQuery('#credit-used').addClass('border-errors'); 
                      console.log('Credit Used: ' + this.message_credit_used);
                    }
                    if(this.field_error[x] == 'credit_tolerance'){
                      //Error Message for field Tolerance Used if update fails from backend 
                      this.message_credit_tolerance = response.json().error_data.error_field_list[x].message;
                      jQuery('#credit-tolerance').addClass('border-errors'); 
                      console.log('Credit Tolerance: ' + this.message_credit_tolerance);
                    }
                  }
                }
              }
            }, error => {}
      );
    } else {
      this.load.hide_loading_gif(); //Remove loading gif
      this.field_error_city = 'invalid';
      jQuery('#city').addClass('border-errors');
    } //Close if
  } //Close save_agency_detail

  //////////////////////////////////////////////
  /// RADIO BUTTONS: Change State First form ///
  change_state_cutoff(state){
      this.show_result_cutoff = state;
  }
  change_state_bookings(state){
    this.how_handle_bookings_cutoff = state;
  }
  change_state_avaible_agency(state){
    this.status_avail_agency_cutoff = state;
  }
  change_state_avaible_book(state){
    this.how_handle_available_bookings = state;
  }

  //////////////////////////////////////////////////////////////////
  /// UPDATED AFTER SAVE 1er form and Section Search and Results ///
  after_save_form_agency(name, name_legal, email, tax_number, phone_number, city_code, address, zip, license_number, cutoff_hotel_days, cutoff_attraction_days, cutoff_transfer_days, cutoff_car_days, cutoff_cruise_days, cutoff_flight_days, cutoff_package_days, cutoff_insurance_days, show_result_cutoff, how_handle_bookings_cutoff, status_avail_agency_cutoff, how_handle_available_bookings, credit, credit_used, credit_tolerance){
    this.load.hide_loading_gif(); //Remove loading gif
    //this.cancel_edit_form_agency(name, name_legal, email, tax_number, phone_number, city_code, address, zip, license_number, cutoff_hotel_days, cutoff_attraction_days, cutoff_transfer_days, cutoff_car_days, cutoff_cruise_days, cutoff_flight_days, cutoff_package_days, cutoff_insurance_days, show_result_cutoff, how_handle_bookings_cutoff, status_avail_agency_cutoff, how_handle_available_bookings);
  }

/////////////////////////////////////////////////////////////
/// Click Button Cancel/close Form and Search and results ///
cancel_edit_form_agency(i, name, name_legal, email, tax_number, phone_number, city_code, address, zip, license_number, cutoff_hotel_days, cutoff_attraction_days, cutoff_transfer_days, cutoff_car_days, cutoff_cruise_days, cutoff_flight_days, cutoff_package_days, cutoff_insurance_days, show_result_cutoff, how_handle_bookings_cutoff, status_avail_agency_cutoff, how_handle_available_bookings, credit, credit_used, credit_tolerance){
    this.name_new = name;
    this.name_legal_new =  name_legal;
    this.email_new = email;
    this.tax_number_new = tax_number;
    this.phone_number_new = phone_number;
    this.city_code = city_code;
    this.relation_name = this.city;
    this.address_new = address;
    this.zip_new = zip;
    this.license_number_new = license_number;
    this.cutoff_hotel_days_new = cutoff_hotel_days;
    this.cutoff_attraction_days_new = cutoff_attraction_days;
    this.cutoff_transfer_days_new = cutoff_transfer_days;
    this.cutoff_car_days_new = cutoff_car_days;
    this.cutoff_cruise_days_new = cutoff_cruise_days;
    this.cutoff_flight_days_new = cutoff_flight_days;
    this.cutoff_package_days_new = cutoff_package_days;
    this.cutoff_insurance_days_new =  cutoff_insurance_days;
    this.show_result_cutoff = this.show_result_cutoff_backup;
    this.how_handle_bookings_cutoff = this.how_handle_bookings_cutoff_backup;
    this.status_avail_agency_cutoff = this.status_avail_agency_cutoff_backup;
    this.how_handle_available_bookings = this.how_handle_available_bookings_backup;
    this.credit_new = this.credit;
    this.credit_used_new = this.credit_used;
    this.credit_tolerance_new = this.credit_tolerance;

    this.trigger_radio_buttons();
    this.focus_days();
    this.focus_name();
    this.focus_email();
    this.focus_city();
    this.focus_new_user();
    this.focus_users(i);

    jQuery('#close-agency').trigger('click'); //Back to list agencies after hide success message
    this.validation_email_filter = true; //Hide message First Form Agency

  } //Close cancel_edit_form_agency

  trigger_radio_buttons(){
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Implementation Radio buttons: Select Radio option by default SECTION AGENCY AN SEARCH AND RESULTS ///
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Property show_result_cutoff ///
    if(this.show_result_cutoff == true){
      $('#yes').trigger('click');
    } else if(this.show_result_cutoff == false) {
      $('#no').trigger('click');
    }

    /// Property how_handle_bookings_cutoff
    if(this.how_handle_bookings_cutoff == 1){
      $('#allow-without-payment').trigger('click');
    } else if(this.how_handle_bookings_cutoff == 2) {
      $('#require-payment').trigger('click');
    } else if(this.how_handle_bookings_cutoff == 3) {
      $('#require-payment-or-credit').trigger('click');
    } else if(this.how_handle_bookings_cutoff == 4) {
      $('#book-on-request').trigger('click');
    } else if(this.how_handle_bookings_cutoff == 5) {
      $('#booking-not-allowed').trigger('click');
    }

    /// Property status_avail_agency_cutoff
    if(this.status_avail_agency_cutoff == true){
      $('#available').trigger('click');
    } else if(this.status_avail_agency_cutoff == false) {
      $('#on-request').trigger('click');
    }

    /// Property how_handle_available_bookings
    if(this.how_handle_available_bookings == 1){
      $('#without-payment').trigger('click');
    } else if(this.how_handle_available_bookings == 2) {
      $('#require-payment-avaible').trigger('click');
    } else if(this.how_handle_available_bookings == 3) {
      $('#require-pay-avaible').trigger('click');
    } else if(this.how_handle_available_bookings == 4) {
      $('#book-on-request-avaible').trigger('click');
    } else if(this.how_handle_available_bookings == 5) {
      $('#book-is-not-allowed').trigger('click');
    }
  } //Close method trigger_radio_buttons

  //Ocultar los mensajes de error si el usuario cancela
  focus_name() {
      jQuery('#name').removeClass('border-errors');
      jQuery('.first-name').removeClass('border-errors'); //Table Users
      this.message_name = '';
      this.field_error = []; //Hide message error
  }
  focus_email(){
      jQuery('#email').removeClass('border-errors');
      this.message_email = '';
      this.field_error = []; //Hide message error
  }
  focus_city(){
      jQuery('#city').removeClass('border-errors');
      this.message_city = '';
      this.message_city = ''; //Hide message error
  }
  focus_days(){
      jQuery('#days-hotel, #attraction, #transfer, #car, #cruise, #flight, #package, #insurance').removeClass('border-errors');
      this.message_cutoff_days_hotel = '';
      this.message_cutoff_days_attrac = '';
      this.message_cutoff_days_transfer = '';
      this.message_cutoff_days_car = '';
      this.message_cutoff_days_cruise = '';
      this.message_cutoff_days_flight = '';
      this.message_cutoff_days_package = '';
      this.message_cutoff_days_insurance = '';
      this.field_error = []; //Hide message error
  }

  //Table Users Exist
  focus_users(i) {
      jQuery('.first-name, .last-name, .email-user').removeClass('border-errors'); //Table Users
      //Hide message errors
      this.message_name = '';
      this.field_error_first_name = '';
      this.field_error_last_name = '';
      this.field_error_email = '';
  }

  //Form New User
  focus_new_user() {
      jQuery('.first-name-new, .last-name-new, .email-new-user, .password-new').removeClass('border-errors'); //Table Users
      //Hide message errors
      this.message_last_name_new_user = '';
      this.error_first_name_new_user = '';
      this.error_last_name_new_user = '';
      this.error_email_new_user = '';
      this.error_password_new_user = '';
  }

  ////////////////////////////////////////////////////////
  /// Validation: inputs section Credit for first form ///
  keyup_fields_credit(type){
    this.remove_autocomplete(); //Clean input
    var input_credit = jQuery('#credit-new');
    var input_credit_used = jQuery('#credit-used');
    var input_credit_tolerance = jQuery('#credit-tolerance');
    let rate_regex_credit = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/g;

    //Input Credit
    if(type == 'credit'){
      if(this.credit != '' && (!rate_regex_credit.test(this.credit) || input_credit.hasClass('ng-invalid'))) {
        this.validation_credit = false;
      }else {
        this.validation_credit = true; //Clean message
      }
    }

    //Input Credit Used
    else if(type == 'credit-used'){
      if(this.credit_used != '' && (!rate_regex_credit.test(this.credit_used) || input_credit_used.hasClass('ng-invalid'))) {
        this.validation_credit_used = false;
      } else {
        this.validation_credit_used = true; //Clean message
      }
    }

    //Input Credit Tolerance
    else if(type == 'credit-tolerance'){
      if(this.credit_tolerance != '' && (!rate_regex_credit.test(this.credit_tolerance) || input_credit_tolerance.hasClass('ng-invalid'))) {
        this.validation_credit_tolerance = false;
      } else {
        this.validation_credit_tolerance = true; //Clean message
      }
    }   
  }

/////////////////////////////////////////////////////////////////////
/// Request Save data Edit Form Section NEW USER of Agency Detail ///
save_form_new_user(send_mail){
  if(this.language_new_user == '' || this.language_new_user == undefined){
    this.language_code_new_user = this.language_code_new_user_default;
  }

  this.load.show_loading_gif(); //Loading gif
  let url = myGlobals.host+'/api/admin/customers/user/save';

  let body=JSON.stringify({
    id: '', //Mandar el id del usuario vacío en este caso de NUEVO usuario
    first_name: this.first_name_new_user,
    middle_name: this.middle_name_new_user,
    last_name: this.last_name_new_user,
    email: this.email_new_user,
    password:  this.password_new_user,
    office_phone: this.office_phone_new_user,
    mobile_phone: this.mobile_phone_new_user,
    address: this.address_user_new_user,
    city_code: this.city_code_new_user,
    zip: this.zip_new_user,
    agency_code: this._service.id_agency,
    is_admin: this.is_admin_new_user,
    is_comissionable: this.is_comissionable_new_user,
    user_access: this.user_access_new_user,
    never_disable: this.never_disable_new_user,
    language: this.language_code_new_user, //Send language code
    send_mail: send_mail
  });

  console.log('Code del lenguaje' + this.language_code_new_user);
  console.log('body EDIT SECTION NEW USERS' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });

    if(this.state_validate_city_new_user == true){

      this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe(
          response => {
            console.log('RESPONSE EDIT NEW USERS: ' + JSON.stringify(response.json()));
            this.updated_form = response.json().updated;
            if (this.updated_form == true){
                this.after_save_form_user_new(this.first_name_new_user, this.middle_name_new_user, this.last_name_new_user, this.email_new_user, this.office_phone_new_user, this.mobile_phone_new_user, this.address_user_new_user, this.city_code_user, this.zip_new_user, this.password_new_user, this.agency_code_new_user, this.is_admin_new_user_save, this.is_comissionable_new_user, this.user_access_new_user, this.never_disable_new_user, this.language_code_new_user);

                jQuery('#success-alert-user-new').fadeIn('slow'); //Show message success
                setTimeout(() => {
                  jQuery('#success-alert-user-new').animate({opacity: 0}, 2500).animate({height: "0px", padding: "0px"}, 2500); //Hide message success

                    setTimeout(() => {
                      this.updated_form = false; //Hide message success
                          setTimeout(() => {
                            $('#new-user-button').trigger('click'); //Close new user form
                            this.get_data_users(this._service.id_agency, 0).subscribe();
                           }, 3500);
                    }, 3000);
                }, 5000);
            }else {
              this.load.hide_loading_gif(); //Remove loading gif
              this.exist_error_agency_save = response.json().error_data.exist_error;
              this.general_error_agencies_save = response.json().error_data.general_error;
              console.log('Error general: ' + JSON.stringify(this.general_error_agencies_save));
              if(this.general_error_agencies_save != ''){
                //Show generic error in HTML with ngIf in general_error_agencies_save
              } else if(this.exist_error_agency_save == true){
                var error_field = response.json().error_data.error_field_list;
                for(var n=0; n<error_field.length; n++){
                  this.error_first_name_new_user = response.json().error_data.error_field_list[n].field;
                  this.error_last_name_new_user = response.json().error_data.error_field_list[n].field;
                  this.field_error_city = response.json().error_data.error_field_list[n].field;
                  this.error_email_new_user = response.json().error_data.error_field_list[n].field;
                  this.error_password_new_user = response.json().error_data.error_field_list[n].field;

                  if(this.error_first_name_new_user == 'first_name'){
                    this.only_error_new = true;
                    //Error Message for First Name if update fails from backend
                    this.message_last_name_new_user = response.json().error_data.error_field_list[n].message;
                    jQuery('.first-name-new').addClass('border-errors');
                    console.log('first-name-new: ' + this.message_last_name_new_user);
                  }
                  if(this.error_last_name_new_user == 'last_name'){
                    this.only_error_new = true;
                    //Error Message for field Last Name if update fails from backend
                    this.message_last_name_new_user = response.json().error_data.error_field_list[n].message;
                    jQuery('.last-name-new').addClass('border-errors');
                    console.log('last-name-new: ' + this.message_last_name_new_user );
                  }
                  if(this.field_error_city == 'city'){
                    //Error Message for field City if update fails from backend
                    this.message_city_new_user = response.json().error_data.error_field_list[n].message;
                    jQuery('#city-user-new').addClass('border-errors');
                    console.log('City-user-new: ' + this.message_city_new_user);
                  }
                  if(this.error_email_new_user == 'email'){
                    this.only_error_new = true;
                    //Error Message for field Email if update fails from backend
                    this.message_last_name_new_user = response.json().error_data.error_field_list[n].message;
                    jQuery('.email-new-user').addClass('border-errors');
                    console.log('E-mail user new: ' + this.message_last_name_new_user);
                  }
                  if(this.error_password_new_user == 'password'){
                    this.only_error_new = true;
                    //Error Message for field Password if update fails from backend
                    this.message_last_name_new_user = response.json().error_data.error_field_list[n].message;
                    jQuery('.password-new').addClass('border-errors');
                    console.log('Password user new: ' + this.message_last_name_new_user);
                  }
                }
              }
              //If there is error scroll to alert error element  
              var go_to_element_position = $('body').scrollTop() + $('#scrollToError').offset().top - $('#scrollToError').height();             
              $("body").animate({scrollTop: go_to_element_position}, 1500, 'swing'); //Scroll to top after get error on save 
            }
          }, error => {}
      );
    } else {
      this.load.hide_loading_gif(); //Remove loading gif
      this.field_error_city = 'invalidNewUser';
      //this.field_city_user = [];
      jQuery('#city-user-new').addClass('border-errors');
    } //Close if
  } //Close save_form_new_user

  ////////////////////////////////////////////////////
  /// UPDATED AFTER SAVE Second form Section USERS ///
  after_save_form_user_new(first_name, middle_name, last_name, email, office_phone, mobile_phone, address, city_code, zip, password, agency_code, is_admin, is_comissionable, user_access, never_disable, language){
    this.load.hide_loading_gif(); //Remove loading gif
    //this.cancel_edit_form_new_user(first_name, middle_name, last_name, email, office_phone, mobile_phone, address, city_code, zip, password, agency_code, is_admin, is_comissionable, user_access, never_disable, language);
  }

  //////////////////////////////////////////////////////////////
  /// SIMIL RADIO BUTTONS: Change State FORM TABLE NEW USERS ///
  change_state_is_admin_new_user(state){
      this.is_admin_new_user = state;
  }
  change_state_is_comissionable_new_user(state){
    this.is_comissionable_new_user = state;
  }
  change_state_user_access_new_user(state){
    this.user_access_new_user = state;
  }

  ///////////////////////////////////////////////
  /// Click Button Cancel/close Form New User ///
  cancel_edit_form_new_user(first_name, middle_name, last_name, email, office_phone, mobile_phone, address, city_code, zip, password, agency_code, is_admin, is_comissionable, user_access, never_disable, language){
      this.first_name_new_user = '';
      this.middle_name_new_user = '';
      this.last_name_new_user = '';
      this.email_new_user = '';
      this.office_phone_new_user = '';
      this.mobile_phone_new_user = '';
      this.address_user_new_user = '';
      this.city_code_new_user = ''; //Code selected of city field on autocomplete
      this.relation_name_new_users = '';
      this.zip_new_user = '';
      this.password_new_user = '';
      this.is_admin_new_user = this.is_admin_new_user_backup;
      this.is_comissionable_new_user = this.is_comissionable_new_user_backup;
      this.user_access_new_user = this.user_access_new_user_backup;
      this.language_new_user = this.language_new_user_default;
      this.error_first_name_new_user = '';
      this.field_error_email = '';
      this.message_last_name_new_user = '';

      /// Property never_disable (Checkbox)
      if(this.never_disable_new_user != this.never_disable_backup_new_user){
         var never_disable_new_user = '#checkbox';
        $(never_disable_new_user).trigger('click');
        this.never_disable_new_user = this.never_disable_backup_new_user;
        console.log(this.never_disable_new_user);
      }

      //Close/Hide New User form
      $('#new-user-button').trigger('click'); //Hide form New User
      $('.first-name-new, .last-name-new, .email-new-user, .password-new').removeClass('border-errors');
      $('#city-user-new').removeClass('border-errors'); //New User
      this.general_error_agencies_save = ''; //Hide generic message
      this.message_city_new_user = ''; //Hide message New User
      this.validation_email_filter_new_users = true; //Hide message field E-mail New User

  } //Close cancel_edit_form_new_user

  trigger_radio_buttons_new_users(){
      ////////////////////////////////////////////////////////////////////////////////////////
      /// Implementation Simil Radio buttons: Select Radio option by default for NEW USERS ///
      ////////////////////////////////////////////////////////////////////////////////////////
      /// Property is_admin ///
      if(this.is_admin_new_user == true){
        $('#yes-admin-new').trigger('click');
        console.log('Debería ser true: ' + this.is_admin_new_user);
      } else if(this.is_admin_new_user == false){
        $('#yes-admin-new').trigger('click');
        console.log('Debería ser false: ' + this.is_admin_new_user);
      }

      /// Property is_comissionable
      if(this.is_comissionable_new_user == true){
        $('#commissionable').trigger('click');
        console.log('Debería ser true: ' + this.is_comissionable_new_user);
      } else if(this.is_comissionable_new_user == false){
        $('#net').trigger('click');
        console.log('Debería ser false: ' + this.is_comissionable_new_user);
      }

      /// Property user_access
      if(this.user_access_new_user === 1){
        $('#front').trigger('click');
        console.log('Debería ser 1: ' + this.user_access_new_user);
      } else if(this.user_access_new_user === 2){
        $('#web-service').trigger('click');
        console.log('Debería ser 2: ' + this.user_access_new_user);
      } else if(this.user_access_new_user === 3){
        $('#white-label').trigger('click');
        console.log('Debería ser 3: ' + this.user_access_new_user);
      }

  } //Close trigger_radio_buttons_new_users


/////////////////////////////////////////////////////////////////////////////////////////////
/// Request data list Field Language(Dropdown) ///
get_list_language() {
  let url = myGlobals.host+'/api/admin/language_autocomplete';
  let headers = new Headers({ 'Content-Type': 'application/json' });

      this.http.get( url, {headers: headers, withCredentials:true})
        .subscribe(
          response => {
            console.log('RESPUESTA INLINE AGENCIES(LANGUAGE): ' + JSON.stringify(response.json()));
            this.language_name = response.json().languages;
          }, error => {}
      );
  }

  editing_language(){ //Click div
    jQuery('#dropdownMenu1').show();
    jQuery('#dropdownMenu2').show();

    //Call request Dropdown List Language
    this.get_list_language();
  }

  ///////////////////////////////////////////////////////////////
  /// Section USERS EXIST: Select field Language for Dropdown ///
  select_language(language_name, language_code, i){
      this.language_new[i] = language_name;
      console.log('Select language name: ' + this.language_new[i]);
      this.language_code[i] = language_code;
      console.log('Select language code: ' + this.language_code[i]);
  }

  ////////////////////////////////////////////////////////////
  /// Section NEW USER: Select field Language for Dropdown ///
  select_language_new_user(language_name, language_code){
      this.language_new_user = language_name;
      this.language_code_new_user = language_code;
      console.log('Select language code new user: ' + this.language_code_new_user);
  }

//////////////////////////////////////////////////////////////////
/// Request Save data Edit Form Section USERS of Agency Detail ///
save_form_users(send_mail, i){
  if(this.first_name_new[i] == undefined){ //If user did not change value set property with Data from the value
    var first_name = '#first-name' + i;
    this.first_name_new[i] = jQuery(first_name).val();
  }
  if(this.middle_name_new[i] == ''){
    var middle_name = '#middle-name' + i;
    this.middle_name_new[i] = jQuery(middle_name).val();
  }
  if(this.last_name_new[i] == undefined){ //Required
    var last_name = '#last-name' + i;
    this.last_name_new[i] = jQuery(last_name).val();
  }
  if(this.email_user_new[i] == undefined){ //Required
    var email_user = '#email-user' + i;
    this.email_user_new[i] = jQuery(email_user).val();
  }
  if(this.office_phone_new[i] == ''){
    var office_phone = '#office-phone' + i;
    this.office_phone_new[i] = jQuery(office_phone).val();
  }
  if(this.mobile_phone_new[i] == ''){
    var mobile_phone = '#mobile-phone' + i;
    this.mobile_phone_new[i] = jQuery(mobile_phone).val();
  }
  if(this.address_user_new[i] == ''){
    var address_user = '#address-user' + i;
    this.address_user_new[i] = jQuery(address_user).val();
  }
  if(this.password_new[i] == '' || this.password_new[i] == undefined){
    var password = '#password' + i;
    this.password_new[i] = jQuery(password).val();
  }
  if(this.language_new[i] == '' || this.language_new[i] == undefined){
    var language = '#language' + i;
    this.language_code[i] = '';
  }

  this.load.show_loading_gif(); //Loading gif
  let url = myGlobals.host+'/api/admin/customers/user/save';

  let body=JSON.stringify({
    id: this.id_user, //Send User id
    first_name: this.first_name_new[i],
    middle_name: this.middle_name_new[i],
    last_name: this.last_name_new[i],
    email: this.email_user_new[i],
    office_phone: this.office_phone_new[i],
    mobile_phone: this.mobile_phone_new[i],
    address: this.address_user_new[i],
    city_code: this.city_code_user[i], //Code selected of city field on autocomplete
    zip: this.zip_user_new[i],
    password: this.password_new[i],
    agency_code: this._service.id_agency,
    is_admin: this.is_admin_data_form[i],
    is_comissionable: this.is_comissionable_data_form[i],
    user_access: this.user_access_data_form[i],
    never_disable: this.never_disable_data_form[i],
    language: this.language_code[i], //Send language code
    send_mail: send_mail
  });

  console.log('body EDIT SECTION USERS' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });

  if(this.state_validate_city_user_exist == true){ 
      this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe(
          response => {
            console.log('RESPONSE EDIT USERS: ' + JSON.stringify(response.json()));
            this.updated_form_user[i] = response.json().updated;
            if (this.updated_form_user[i] == true){
                this.after_save_form_user(i, this.first_name_new[i], this.middle_name_new[i], this.last_name_new[i], this.email_user_new[i], this.office_phone_new[i], this.mobile_phone_new[i], this.address_user_new[i], this.city_code_user[i], this.zip_user_new[i], this.password_new[i], this.agency_code[i], this.is_admin[i], this.is_comissionable_new[i], this.user_access_new[i], this.never_disable_new[i], this.language_new[i]);

                jQuery('#success-alert-user' + i).fadeIn('slow'); //Show message success
                setTimeout(() => {
                  jQuery('#success-alert-user' + i).animate({opacity: 0}, 1000).animate({height: "0px", padding: "0px"}, 1000); //Hide message success

                    setTimeout(() => {
                      this.updated_form_user[i] = false; //Hide message success
                        setTimeout(() => {
                          this.remove_class[i] = true; //Close User Exist form                        
                          this.get_data_users(this._service.id_agency, 0).subscribe();  
                         }, 1000);
                    }, 1700);
                }, 4000);
            }else {
              this.load.hide_loading_gif(); //Remove loading gif
              this.exist_error_agency_save = response.json().error_data.exist_error;
              this.general_error_agencies_save = response.json().error_data.general_error;
              console.log('Error general: ' + JSON.stringify(this.general_error_agencies_save));
              console.log('Error específico: ' + JSON.stringify(this.exist_error_agency_save));
              if(this.general_error_agencies_save != ''){
                //Show generic error in HTML with ngIf in general_error_agencies_save
              } else if(this.exist_error_agency_save == true){
                var error_field = response.json().error_data.error_field_list;
                for(var m = 0; m<error_field.length; m++){
                  //this.field_error = response.json().error_data.error_field_list[m].field;
                  this.field_error_first_name = response.json().error_data.error_field_list[m].field;
                  this.field_error_last_name = response.json().error_data.error_field_list[m].field;
                  this.field_error_city = response.json().error_data.error_field_list[m].field;
                  this.field_error_email = response.json().error_data.error_field_list[m].field;

                  if(this.field_error_first_name == 'first_name'){
                    this.only_error[i] = true;
                    //Error Message for First Name if update fails from backend
                    this.message_name = response.json().error_data.error_field_list[m].message;
                    jQuery('#first-name' + i).addClass('border-errors');
                    console.log('first-name: ' + this.message_name);
                  }
                  if(this.field_error_last_name == 'last_name'){
                    this.only_error[i] = true;
                    //Error Message for field Last Name if update fails from backend
                    this.message_name = response.json().error_data.error_field_list[m].message;
                    jQuery('#last-name' + i).addClass('border-errors');
                    console.log('Last Name: ' + this.message_name );
                  }
                  if(this.field_error_email == 'email'){
                    this.only_error[i] = true;
                    //Error Message for field Email if update fails from backend
                    this.message_name = response.json().error_data.error_field_list[m].message;
                    jQuery('#email-user' + i).addClass('border-errors');
                    console.log('E-mail user: ' + this.message_name);
                  }
                  if(this.field_error_city == 'city'){
                    //Error Message for field City if update fails from backend
                    this.message_city_user[i] = response.json().error_data.error_field_list[m].message;
                    jQuery('#city-user').addClass('border-errors');
                    console.log('City user: ' + this.message_city_user[i]);
                  }
                }
              }
              //If there is error scroll to alert error element  
              var go_to_element_position = $('body').scrollTop() + $('#scrollToError'+i).offset().top - $('#scrollToError'+i).height();             
              $("body").animate({scrollTop: go_to_element_position}, 1500, 'swing'); //Scroll to top after get error on save 
            }
          }, error => {}
      );
    } else {
      this.load.hide_loading_gif(); //Remove loading gif
      this.field_error_city = 'invalidUserExist';
      this.field_city_user[i] = [];
      jQuery('#city-user' + i).addClass('border-errors');
    } //Close if
  } //Close save_form_users

  ////////////////////////////////////////////////////
  /// UPDATED AFTER SAVE Second form Section USERS ///
  after_save_form_user(i, first_name, middle_name, last_name, email, office_phone, mobile_phone, address, city_code, zip, password, agency_code, is_admin, is_comissionable, user_access, never_disable, language){
    this.load.hide_loading_gif(); //Remove loading gif
    //this.cancel_edit_form_user(i, first_name, middle_name, last_name, email, office_phone, mobile_phone, address, city_code, zip, password, agency_code, is_admin, is_comissionable, user_access, never_disable, language);
  }

  ///////////////////////////////////////////////////////////////////
  /// SIMIL RADIO BUTTONS: Change State FORM TABLE USERS EXISTING ///
  change_state_is_admin(state, i){
      this.is_admin_data_form[i] = state;
  }
  change_state_is_comissionable(state, i){
    this.is_comissionable_data_form[i] = state;
  }
  change_state_user_access(state, i){
    this.user_access_data_form[i] = state;
  }

  /////////////////////////////////////////////////////////////
  /// Click Button Cancel/close Form and Search and results ///
  cancel_edit_form_user(i, first_name, middle_name, last_name, email, office_phone, mobile_phone, address, city_code, zip, password, agency_code, is_admin, is_comissionable, user_access, never_disable, language){
      this.first_name_new[i] = this.first_name_data_form[i];
      this.middle_name_new[i] = this.middle_name_data_form[i];
      this.last_name_new[i] = this.last_name_data_form[i];
      this.email_user_new[i] = this.email_data_form[i];
      this.office_phone_new[i] = this.office_phone_data_form[i];
      this.mobile_phone_new[i] = this.mobile_phone_data_form[i];
      this.address_user_new[i] = this.address_data_form[i];
      this.city_code_user[i] = this.relation_name_users[i]; //Code selected of city field on autocomplete
      this.relation_name_users[i] = this.location_data_form[i];
      this.zip_user_new[i] = this.zip_data_form[i];
      this.password_new[i] = this.password_data_form[i];
      this.agency_code[i] = this.agency_code;
      this.is_admin[i] = this.is_admin_data_form[i];
      this.is_comissionable[i] = this.is_comissionable_data_form[i];
      this.user_access[i] = this.user_access_data_form[i];
      this.language_new[i] = this.language_data_form[i]

      /// Property never_disable (Checkbox)
      if(this.never_disable_data_form[i] != this.never_disable_data_form_backup[i]){
         var never_disable_user = '#checkbox' + i;
        $(never_disable_user).trigger('click');
        this.never_disable_data_form[i] = this.never_disable_data_form_backup[i];
      }

      //Field City: Hide message and red border after Cancel
      jQuery('#city-user' + i).removeClass('border-errors');
      this.message_city_user[i] = '';
      this.validation_email_filter_users = []; //Hide message error field E-mail Form User Exist

      this.trigger_radio_buttons_users(i);

  } //Close cancel_edit_form_agency

  trigger_radio_buttons_users(i){
      ////////////////////////////////////////////////////////////////////////////////////
      /// Implementation Simil Radio buttons: Select Radio option by default for USERS ///
      ////////////////////////////////////////////////////////////////////////////////////
      /// Property is_admin ///
      if(this.is_admin_data_form[i] == true){
        $('#yes-admin').trigger('click');
      } else if(this.is_admin_data_form[i] == false){
        $('#no-admin').trigger('click');
      }

      /// Property is_comissionable
      if(this.is_comissionable_data_form[i] == true){
        $('#commissionable').trigger('click');
      } else if(this.is_comissionable_data_form[i] == false){
        $('#net').trigger('click');
      }

      /// Property user_access
      if(this.user_access_data_form[i] == 1){
        $('#front').trigger('click');
      } else if(this.user_access_data_form[i] == 2){
        $('#web-service').trigger('click');
      } else if(this.user_access_data_form[i] == 3){
        $('#white-label').trigger('click');
      }

  } //Close trigger_radio_buttons_users


//////////////////////////////////////////////////////////
/// Request icons enabled-suspended-disabled for users ///
enabled_disabled_toggles_users(status, id){
    var status;
    this.id_user = []; //Clean array
    this.id_user.push(id);
    var single_id = this.id_user;

    let url = myGlobals.host+'/api/admin/customers/user/change_status';
    let body=JSON.stringify({ status: status, list_user_code: id });
    console.log('Body del request del enabled-disabled: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .subscribe(
        response => {
            console.log('RESPUESTA AGENCY DETAIL: Users TOGGLES: ' + JSON.stringify(response.json()));
            this.get_data_users(this._service.id_agency, 0).subscribe();
        }, error => {}
    );
} //Close enabled_disabled_toggles for users


////////////////////////////////////////////////////////////////////////////
/// //Clean inputs after click another open Agency Detail for First Form ///
empty_values(){
  jQuery('#name').val(''); 
  jQuery('#legal-name').val(''); 
  jQuery('#address').val(''); 
  jQuery('#city').val('');
  jQuery('#zip').val('');
  jQuery('#phone').val('');
  jQuery('#email-agency').val('');
  jQuery('#tax').val('');
  jQuery('#licence-number').val('');
}

} //Close class editAgencyDetail



