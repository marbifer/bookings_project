import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable, ViewChild} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {CustomHttp} from '../../../../services/http-wrapper';
import myGlobals = require('../../../../../app');
import {Location} from '@angular/common';
import {LoadingGif} from '../../../../bworkspace/filedetail/loading_gif.service';
import {RolloverAutocompletes} from '../../../../customers/rollovers-dropdown.service';
import {Users} from '../../../list-users/users';
import {DataPropertiesListUsers} from '../../../list-users/data_properties.service';
import {Core} from '../../../../core/core';
import {DataPagination} from '../../../../settings/pagination-mappings/data_pagination.service';
import {filters} from '../../../../customers/filters'; //Model Filters agencies list
//import {ObjectListExtProviders} from '../../../list-users/user-detail/object-list-ext-prov';

declare var jQuery: any;
declare var $: any;
export var ObjectExtProvider;

@Injectable()
export class editUserDetail{

  @ViewChild('pagination') myPag;

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
  count_users_data_table: any;
  count_users_data_form: any;
  full_object_table = [];
  full_object_table_mod = [];

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
  agency_code_data_form = [];
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
  create_agency_user = []; //Form create New Agency User Exist
  agency_name_new_agency_user = []; //Form create New Agency User Exist
  agency_email_user = []; //Form create New Agency User Exist
  agency_tax_number_user = []; //Form create New Agency User Exist
  hide_create_new_agency_users = []; //User Exist
  language_new = [];
  updated_form: any;
  state_validate_city_user_exist = true; //Form User Exist

  //Message error for form Create New Agency User exist
  field_error_new_agency = [];
  message_new_agency_user = [];
  field_error_agency_email = [];
  message_new_agency_mail_user = [];
  message_new_agency_tax_user = [];
  field_error_tax = [];

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
  create_agency_new_user: boolean = false; //Form create New Agency User Exist
  agency_code_after_save: any; //Form create New Agency New User after save
  agency_name_new_agency_new_user: any; //Form create New Agency New User
  agency_email_new_user: any; //Form create New Agency New User
  agency_tax_number_new_user: any; //Form create New Agency New User
  hide_create_new_agency_new_user: boolean = true; //New User
  language_new_user: any = '';
  state_validate_city_new_user = true; //Form New User field City

  //Message error for form Create New Agency New User
  error_new_agency_name_new_user: any;
  field_error_new_agency_new_user: any;
  message_new_agency_new_user: any;
  message_agency_email_new_user: any;
  field_error_agency_email_new_user: any;
  error_new_agency_email_new_user: any;
  message_tax_new_user: any;
  field_error_tax_new_user: any;
  error_tax_new_user: any;

  //Request Autocomplete City field (User Detail)
  city_name: string="";
  is_selected = true; //Verify if user select autocomplete option
  city_code: string="";
  singleArray = [];
  list_of_city = [];
  list_of_codes_city = [];
  filteredListCityUser = []; //Form user exist
  length_of_filteredList = []; //Length of filtered list of autocomplete city User exist
  length_of_filteredListNewUser: any; //Length of filtered list of autocomplete city New User
  filteredListCityNewUser = []; //Form new User
  elementRef;
  to_show_row;
  block_edit = false;
  error_map: any;
  list_of_codes_agency = [];
  list_of_agency= [];

  //Request Autocomplete City field (Users)
  relation_name_users = [];
  city_code_user = [];

  //Request Autocomplete City field (New Users)
  relation_name_new_users: any;
  city_code_new_user: string="";

  //Request Autocomplete Agency field (User Detail)
  agency_name: string="";
  state_validate_agency_user_exist = true; //Form User Exist field Agency
  state_validate_agency_new_user = true; //Form New User field Agency
  agency_auto_code_new_user = ''; //Code selected of agency field on autocomplete
  agency_auto_code_user = [];
  filteredListAgencyUser = [];
  filteredListAgencyNewUser = []; //New User
  relation_name_new_user_agency: any; //Autocomplete field agency New User
  length_of_filteredListAgencyNewUser: any; //New User
  agency_name_data_form_auto = []; //Autocomplete field agency
  relation_name_users_agency = []; //Autocomplete field agency User Exist

  //Request Dropdown Language Field(Users)
  language_name = [];
  language_li: any;
  language_code = []; //User Exist
  language_code_new_user: any; //New User
  language_code_new_user_default: any; //New User

  //General Errors Message
  general_error_agencies: string = '';
  general_error_agencies_save: string = ''; //Request 6 general error Save

  //Errors Message autocomplete
  general_error_city: string=''; //Request autocomplete
  exist_error_city: any; //Request autocomplete
  field_city: string=''; //Request autocomplete
  field_city_user= []; //Request autocomplete
  message_city: string=''; //Request autocomplete
  general_error_agency: string=''; //Request autocomplete Agency User Exist
  general_error_agency_new_user: string=''; //Request autocomplete AgencNew User
  exist_error_agency: any; //Request error specific error Save

  //Specific errors 1er Form after Save
  exist_error_agency_save: any; //Request error specific error Save
  field_error_city: any; //Field specific error Save to field City
  error_field;
  field_error = []; //Field specific error Save to field Name and E-mail
  message_name: string=''; //Message specific error Save to field Name
  message_email: string=''; //Message specific error Save to field E-mail
  message_city_save: string=''; //Message specific error After Save to field City

  //Errors FORM USER EXIST after Save
  field_error_user: any;
  field_error_first_name: any;
  field_error_last_name: any;
  field_error_email: any;
  field_error_agency: any; //Field specific error Save to field Agency
  field_agency_user: any;  //Field specific error Save to field Agency
  message_last_name: string=''; //Message specific error Save to field Last Name
  message_city_user = [];  //Message specific error to field City
  message_agency_user = [];  //Message specific error to field Agency
  only_error = []; //Show error only in edited user exist

  //Errors FORM NEW USER after Save
  error_first_name_new_user: any;
  error_last_name_new_user: any;
  error_email_new_user: any;
  error_password_new_user: any;
  message_name_new_user: string=''; //Message specific error Save to field First Name
  message_last_name_new_user: string=''; //Message specific error Save to field Last Name
  message_email_new_user: string=''; //Message specific error Save to field E-mail
  message_pass_new_user: string=''; //Message specific error Save to field Password
  message_city_new_user: string='';  //Message specific error to field City
  message_agency_new_user: string='';  //Message specific error to field City
  only_error_new: any; //Show error only in edited new user

  //Validation for all E-mails fields
  validation_email_filter = [];//Form Create New Agency Form User Exist
  validation_email_filter_agency: any; //Form Create New Agency Forn New Users
  validation_email_filter_users = []; //Form User Exist
  validation_email_filter_new_users: any; //Form New User
  email_regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

constructor(
  public http: Http,
  public _loc: Location,
  public params: RouteParams,
  public router: Router,
  public _service: DataPropertiesListUsers,
  public load: LoadingGif,
  public _rol: RolloverAutocompletes,
  public _data_pagination: DataPagination,
  public _filters_agencies: filters/*,
  public _obj_prov: ObjectListExtProviders */
) {}

keyup_field_email_agency(form, i){
  //Agency Detail: validation for E-mail Field form Create New Agency(User Exist)
   if(form == 'agency'){
     if(!this.email_regex.test(this.agency_email_user[i])) {
     this.validation_email_filter[i] = false;
     //Show error message on input HTML
     } else {
       this.validation_email_filter[i] = true; //Clean message
     }
   }

   //Agency Detail: validation for E-mail Field form Create New Agency(New User)
   if(form == 'agency-new'){
     if(!this.email_regex.test(this.agency_email_new_user)) {
     this.validation_email_filter_agency = false;
     //Show error message on input HTML
     } else {
       this.validation_email_filter_agency = true; //Clean message
     }
   }

   //Section New User: validation for E-mail Field
   if(form == 'new-user'){
     if(!this.email_regex.test(this.email_new_user)) {
     this.validation_email_filter_new_users = false;
     //Show error message on input HTML
     } else {
       this.validation_email_filter_new_users = true; //Clean message
     }
   }

   //Section New User: validation for E-mail Field
   if(form == 'users'){
     if(!this.email_regex.test(this.email_user_new[i])) {
     this.validation_email_filter_users[i] = false;
     //Show error message on input HTML
     } else {
       this.validation_email_filter_users[i] = true; //Clean message
     }
   }
}

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
            console.log('RESPUESTA INLINE USERS(CITY): ' + JSON.stringify(response.json()));
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
                    this.length_of_filteredList = []; //Clean
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
                    this.length_of_filteredListNewUser = ''; //Clean
                  }
                  this.filteredListCityUser = []; //Clean list of City User Exist
                  this.filteredListCityNewUser = []; //Clean list of City New User
              }
            } else {
              for(var i=0; i < response.json().location_list.length; i++) {
                this.list_of_codes_city[i] = response.json().location_list[i].code;
                this.list_of_city[i] = response.json().location_list[i].name;
              }
                //Filter list Autocomplete City field
                console.log('city name Autocomplete: ' + JSON.stringify(this.city_name));
                switch(handlerEvent) {
                    case 'users':
                      this.filteredListCityUser[this.i_user] = this.list_of_city;
                      this.length_of_filteredList[this.i_user] = this.list_of_city.length; //Get length of list of city
                      console.log('Verificar array field city User Exist: ' + JSON.stringify(this.filteredListCityUser));
                      break;

                    case 'new-user':
                      this.filteredListCityNewUser = this.list_of_city;
                      this.length_of_filteredListNewUser = this.list_of_city.length; //Get length of list of city
                      console.log('Verificar array field city New user: ' + this.filteredListCityNewUser);
                } //End switch
              console.log('Lista de códigos de City:' + this.list_of_codes_city);
            }
          }, error => {}
      );
  }

post_forgedSession(userCode){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      var url;
      url = myGlobals.host+'/api/admin/customers/user/forge';
        let body=JSON.stringify({
          user_code: userCode,
          file : ''
        });
    return this.http.post( url, body ,{headers: headers, withCredentials:true} )
      .map(
        response => {
           let resp = response.json().redirect_url;
           return resp;
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

  this.get_list_city(city_name, handlerEvent, i, e); //Call request function
  this.message_city_user = []; //Hide message User exist
  this.message_city_new_user = ''; //Hide message New User
  jQuery('#city-user' + i).removeClass('border-errors'); //User exist
  jQuery('#city-user-new').removeClass('border-errors'); //New User
  console.log('filteredListCityNewUser del Keyup get data new user: ' + this.filteredListCityNewUser);
}

//Select form User Exist and Form New User
select(item, code, handlerEvent){
  this.city_code = code;
  switch(handlerEvent) {
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
  this.filteredListCityUser = []; //User exist
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
  this.state_validate_city_user_exist = true; //Form User Exist
  this.state_validate_city_new_user = true; //Form New User
  this.message_agency_user = []; //Hide message field Agency
  jQuery('.city-user').removeClass('border-errors'); //User exist
}

///////////////////////////////////////////////
/// Remove All Autocompletes of User Detail ///
remove_autocomplete(){
  this.only_error = []; //Hide message error User Exist
  this.only_error_new = false; //Hide message error User Exist
  this.error_first_name_new_user = ''; //Hide specific message New User
  this.error_password_new_user = ''; //Hide specific message New User
  this.message_name_new_user = ''; //Hide specific error New User
  this.message_last_name_new_user = ''; //Hide specific error New User
  this.message_email_new_user = ''; //Hide specific error New User
  this.message_pass_new_user = ''; //Hide specific error New User
  this.filteredListCityUser.length = 0; //Form User Exist
  this.length_of_filteredList = []; //Form User Exist
  this.field_error_agency = []; //Form User Exist
  this.filteredListCityNewUser.length = 0; //Form New user
  this.length_of_filteredListNewUser = ''; //Form New User

  //Properties for Autocomplete Agency
  this.length_of_filteredListAgencyNewUser = ''; //Form New User
  this.filteredListAgencyNewUser.length = 0; //Form New user
  this.general_error_agency_new_user = ''; //Hide error general New User
  this.filteredListAgencyUser.length = 0; //Form User Exist
  this.general_error_agency = ''; //Hide error general User Exist

  jQuery('.first-name, .last-name, .agency, .new-agency-name, .tax-number').removeClass('border-errors'); //User Exist
  jQuery('.first-name-new, .last-name-new, .password-new, #agency-user-new, #city-user-new, .new-agency-name-new-user, .tax-number-new-user').removeClass('border-errors'); //New User
}

/////////////////////////////////////////////////////////////////////////////////////////////
/// Request data list Field AGENCY(Autocomplete) ///
get_list_agency(agency_name, handlerEvent, i, e) {
  this.i_user = i; //Store iteration because is not working inside request due scope
  this.list_of_agency = []; //Clean array
  this.list_of_codes_agency = []; //Clean array
  let url = myGlobals.host + '/api/admin/agency_autocomplete';
  let body=JSON.stringify({ agency: agency_name, autocomplete_items_count: 20 });
  console.log('BODY: ' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });
      this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe(
          response => {
            console.log('RESPUESTA INLINE USERS(AGENCY): ' + JSON.stringify(response.json()));
            this.agency_name = response.json().agency_list;
            if(handlerEvent == 'users'){
              this.general_error_agency = response.json().error_data.general_error; //Error User exist
            }
            else if(handlerEvent == 'new-user'){
              this.general_error_agency_new_user = response.json().error_data.general_error; //Error New User
            }

            this.exist_error_agency = response.json().error_data.exist_error;
            if(this.general_error_agency != '' || this.general_error_agency_new_user != ''){
              console.log('Error general: ' + JSON.stringify(this.general_error_agency));
              //Show generic error in HTML with ngIf in general_error_agency
              jQuery('#agency-user' + this.i_user).addClass('border-errors');
              jQuery('#agency-user-new').addClass('border-errors');
            }
            if(this.exist_error_agency == true){
              for(var l=0; l<response.json().error_data.error_field_list.length; l++){
                  var agency_men = response.json().error_data.error_field_list[l].field;
              }
                this.filteredListAgencyUser = []; //Clean list of Agency User Exist
                this.filteredListAgencyNewUser = []; //Clean list of Agency New User
            } else {
              for(var i=0; i < response.json().agency_list.length; i++) {
                this.list_of_codes_agency[i] = response.json().agency_list[i].code;
                this.list_of_agency[i] = response.json().agency_list[i].name;
              }
              //Filter list Autocomplete Agency field
              console.log('agency name: ' + JSON.stringify(this.agency_name));
               switch(handlerEvent) {
                  case 'users':
                    this.filteredListAgencyUser[this.i_user] = this.list_of_agency;
                    this.length_of_filteredList[this.i_user] = this.list_of_agency.length; //Get length of list of agency
                    console.log('Verificar array field agency: ' + JSON.stringify(this.filteredListAgencyUser));
                    break;

                  case 'new-user':
                    this.filteredListAgencyNewUser = this.list_of_agency;
                    this.length_of_filteredListAgencyNewUser = this.list_of_agency.length; //Get length of list of Agency
                    console.log('Verificar array field field Agency New user: ' + this.filteredListAgencyNewUser);
                } //End switch
              console.log('lista de códigos:' + this.list_of_codes_agency);
            }
          }, error => {}
      );
  }

/////////////////////////////////////////////////////////////////////
/// Implementation Autocomplete for field Agency with event click ///
filter_agency_name_click(agency_name, handlerEvent, i, e){
  e.preventDefault();
  this.field_error_agency = []; //Clean message
  this.message_agency_user = []; //Hide message User exist
  this.message_agency_new_user = ''; //Hide message New User
  agency_name = '';
  this.get_list_agency(agency_name, handlerEvent, i, e); //Call request function
  jQuery('#agency-user' + i).removeClass('border-errors'); //User exist
  jQuery('#agency-user-new').removeClass('border-errors'); //New User
}

/////////////////////////////////////////////////////////////////////
/// Implementation Autocomplete for field Agency with event keyup ///
filter_agency_name(agency_name, handlerEvent, i, e){
  e.preventDefault();
  //Validation for field City
  var validate_agency = /[A-Za-z\s]/;
  //Form User Exist
  if(handlerEvent == 'users'){
    if(!validate_agency.test(this.relation_name_users_agency[i])){
      this.state_validate_agency_user_exist = false;
    } else {
      this.state_validate_agency_user_exist = true;
      this.agency_auto_code_user[i] = 'error'; //If invalid character broke agency code
    }
  }

  //Form New User
  if(handlerEvent == 'new-user'){
    if(!validate_agency.test(this.relation_name_new_user_agency)){
      this.state_validate_agency_new_user = false;
    } else {
      this.state_validate_agency_new_user = true;
      this.agency_auto_code_new_user = 'error'; //If invalid character broke agency code
    }
  }

  this.length_of_filteredList = []; //Form User Exist field City
  this.length_of_filteredListNewUser = ''; //Form New User field City
  this.get_list_agency(agency_name, handlerEvent, i, e); //Call request function
  this.message_agency_user = []; //Hide message User exist
  this.message_agency_new_user = ''; //Hide message New User
  jQuery('#agency-user' + i).removeClass('border-errors'); //User exist
  jQuery('#agency-user-new').removeClass('border-errors'); //New User
  console.log('filteredListAgencyNewUser del Keyup get data new user: ' + this.filteredListAgencyNewUser);
  this.filteredListAgencyUser.length = 0; //Form User Exist field City
  this.filteredListAgencyNewUser.length = 0; //Form New user field City
  this.length_of_filteredListAgencyNewUser = ''; //Form New User field Agency
}

//Select field Agency
select_agency(item, code, handlerEvent){
  this.agency_code = code;
  switch(handlerEvent) {
    case 'users':
      this.filteredListAgencyUser = [];
         break;
    case 'new-user':
      this.filteredListAgencyNewUser = [];
}
  this.is_selected = true;
}

//Select agency form user exist and form New User
select_agency_user(i, item, code){
  this.relation_name_users_agency[i] = item; //User exist
  this.relation_name_new_user_agency = item; //New User
  this.agency_auto_code_user[i] = code; //User exist
  this.agency_auto_code_new_user = code; //New User
  console.log('agency code user: ' + this.agency_auto_code_user[i]);
  console.log('agency code NEW user: ' + this.agency_auto_code_new_user);
  this.length_of_filteredList = []; //User exist field City
  this.message_agency_user = []; //Hide message User exist
  this.filteredListAgencyUser = []; //User exist field Agency
  this.length_of_filteredListNewUser = ''; //New User field City
  this.filteredListAgencyNewUser = []; //New User field Agency
  this.length_of_filteredListAgencyNewUser = ''; //New User field Agency
  this.state_validate_agency_new_user = true; //New User enabled save
  this.is_selected = true;
  jQuery('#agency-user' + i).removeClass('border-errors'); //User exist
}

remove_message_agency(){
  this.field_error_agency = []; //User Exist
  this.field_agency_user = []; //User Exist
  this.length_of_filteredList = []; //User Exist
  this.length_of_filteredListNewUser = ''; //New User
  this.state_validate_agency_user_exist = true; //Form User Exist
  this.state_validate_agency_new_user = true; //Form New User
}


//////////////////////////////////////////
/// Show and hide form create New user ///
show_form_create_new_agency(i, user){
  if(user == 'user'){
    this.hide_create_new_agency_users[i] = false;
    this.create_agency_user[i] = true;
    jQuery('#create-agency-users' + i).show();
  } else if(user == 'new-user'){
    this.hide_create_new_agency_new_user = false;
    this.create_agency_new_user = true;
    jQuery('#create-agency-users-new').show();
  }
}

hide_form_create_new_agency(i, user){
  this.agency_name_new_agency_new_user = ''; //Clean input Form New User
  this.agency_email_new_user = ''; //Clean input Form New User
  this.agency_tax_number_new_user = ''; //Clean input Form New User

  this.agency_name_new_agency_user = []; //Clean input form User Exist
  this.agency_email_user = []; //Clean input User Exist
  this.agency_tax_number_user = []; //Clean input User Exist

  if(user == 'user'){
    this.hide_create_new_agency_users[i] = undefined;
    this.create_agency_user[i] = false;
    jQuery('#create-agency-users' + i).hide();
  } else if(user == 'new-user'){
    this.hide_create_new_agency_new_user = true;
    this.create_agency_new_user = false;
    jQuery('#create-agency-users-new').hide();
  }
}
//////////////// END ALL METHODS AGENCY AUTOCOMPLETE /////////////////

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
            .map(
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
                this.agency_code_data_form[i] = this.user_detail.agency_code;
                this.location_data_form[i] = this.user_detail.location;
                this.bookings_data_form[i] = this.user_detail.bookings;
                this.status_data_form[i] = this.user_detail.status;
                this.forged_session_data_form[i] = this.user_detail.forged_session;
                this.registered_data_form[i] = this.user_detail.registered;
                this.code_data_form[i] = this.user_detail.code;
                console.log('lenguaje: ' + this.language_data_form[i]);
                this.count_users_data_form = this.user_detail.length; //Count
                console.log('CANTIDAD TABLE USERS66: ' + this.count_users_data_form);

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
          this.message_name_new_user = ''; //Hide specific error New User
          this.message_last_name_new_user = ''; //Hide specific error New User
          this.message_email_new_user = ''; //Hide specific error New User
          this.message_pass_new_user = ''; //Hide specific error New User

          return 'NEW USER';
        }, error => {}
    );
} //Close request get data get_data_users_new

  //////////////////////////////////////////////////////////
  //Ocultar los mensajes de error si el usuario cancela ///
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
      this.message_name_new_user = '';
      this.message_last_name_new_user = '';
      this.message_email_new_user = '';
      this.message_pass_new_user = '';
      this.error_first_name_new_user = '';
      this.error_last_name_new_user = '';
      this.error_email_new_user = '';
      this.error_password_new_user = '';
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
    agency_code: this.agency_auto_code_new_user,
    is_admin: this.is_admin_new_user,
    is_comissionable: this.is_comissionable_new_user,
    user_access: this.user_access_new_user,
    never_disable: this.never_disable_new_user,
    create_agency: this.create_agency_new_user,
    agency_name: this.agency_name_new_agency_new_user,
    agency_email: this.agency_email_new_user,
    agency_tax_number: this.agency_tax_number_new_user,
    language: this.language_code_new_user, //Send language code
    send_mail: send_mail
  });

  console.log('Code del lenguaje' + this.language_code_new_user);
  console.log('body EDIT SECTION NEW USERS' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });

    if(this.state_validate_city_new_user == true || this.state_validate_agency_new_user == true){

      this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe(
          response => {
            console.log('RESPONSE EDIT NEW USERS: ' + JSON.stringify(response.json()));
            this.updated_form = response.json().updated;
            this.agency_code_after_save = response.json().agency_code;
            if (this.updated_form == true){
                this.after_save_form_user_new(this.first_name_new_user, this.middle_name_new_user, this.last_name_new_user, this.email_new_user, this.office_phone_new_user, this.mobile_phone_new_user, this.address_user_new_user, this.city_code_user, this.zip_new_user, this.password_new_user, this.agency_code_new_user, this.is_admin_new_user_save, this.is_comissionable_new_user, this.user_access_new_user, this.never_disable_new_user, this.language_code_new_user);

                jQuery('#success-alert-user-new').fadeIn('slow'); //Show message success
                setTimeout(() => {
                  jQuery('#success-alert-user-new').animate({opacity: 0}, 2000).animate({height: "0px", padding: "0px"}, 2000); //Hide message success

                    setTimeout(() => {
                      this.updated_form = false; //Hide message success
                          setTimeout(() => {
                            $('#new-user-button').trigger('click'); //Close new user form
                            this._service.get_list_users({page: this._service.current_page}).subscribe();

                            //////////////////////////////////////////////////////////
                            /// If user create New agency, go to agency after save ///Esto lo pidió Pablo
                            if(this.create_agency_new_user == true){
                              //Create URL with params from model:(filter.ts)
                              this._filters_agencies.replace_string(); //Change "/" to "-"

                              this.router.navigate(['/App', 'AgencyDetail', {
                                  list_come_from: 'users',
                                  id: this.agency_code_after_save,
                                  status: this._filters_agencies.status,
                                  name: this._filters_agencies.name,
                                  tax_number: this._filters_agencies.tax_number,
                                  email: this._filters_agencies.email,
                                  phone_number: this._filters_agencies.phone_number,
                                  city: this._filters_agencies.city,
                                  state: this._filters_agencies.state,
                                  country: this._filters_agencies.country,
                                  address: this._filters_agencies.address,
                                  zip: this._filters_agencies.zip,
                                  has_bookings: this._filters_agencies.has_bookings,
                                  date_created_from:  this._filters_agencies.date_created_from,
                                  date_created_to: this._filters_agencies.date_created_to,
                                  order: this._filters_agencies.order,
                                  asc: this._filters_agencies.asc,
                                  number_of_page: this._filters_agencies.number_of_page
                              }]);
                              this._filters_agencies.undo_replace_string();  //Undo "/" to "-"
                            } //Close if

                           }, 400);
                    }, 750);
                }, 1500);
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
                  this.field_error_agency = response.json().error_data.error_field_list[n].field;
                  this.error_email_new_user = response.json().error_data.error_field_list[n].field;
                  this.error_password_new_user = response.json().error_data.error_field_list[n].field;
                  this.error_new_agency_name_new_user = response.json().error_data.error_field_list[n].field;
                  this.error_new_agency_email_new_user = response.json().error_data.error_field_list[n].field;
                  this.field_error_tax_new_user = response.json().error_data.error_field_list[n].field;
                  this.error_tax_new_user = response.json().error_data.error_field_list[n].field;

                  if(this.error_first_name_new_user == 'first_name'){
                    this.only_error_new = true;
                    //Error Message for First Name if update fails from backend
                    this.message_name_new_user = response.json().error_data.error_field_list[n].message;
                    jQuery('.first-name-new').addClass('border-errors');
                    console.log('first-name-new: ' + this.message_name_new_user);
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
                    this.message_email_new_user = response.json().error_data.error_field_list[n].message;
                    jQuery('.email-new-user').addClass('border-errors');
                    console.log('E-mail user new: ' + this.message_email_new_user);
                  }
                  if(this.error_password_new_user == 'password'){
                    this.only_error_new = true;
                    //Error Message for field Password if update fails from backend
                    this.message_pass_new_user = response.json().error_data.error_field_list[n].message;
                    jQuery('.password-new').addClass('border-errors');
                    console.log('Password user new: ' + this.message_pass_new_user);
                  }
                  if(this.field_error_agency == 'agency'){
                    this.field_agency_user = 'agency'; //Show agency error if empty field
                    this.only_error_new = true;
                    //Error Message for field Agency if update fails from backend
                    this.message_agency_new_user = response.json().error_data.error_field_list[n].message;
                    this.general_error_agency = ''; //Clean mesagge general error User Exist
                    this.general_error_agency_new_user = ''; //Clean mesagge general error New User
                    jQuery('#agency-user-new').addClass('border-errors');
                    console.log('Agency New user: ' + this.message_agency_new_user);
                  }
                  //Errors form Create New Agency
                  if(this.error_new_agency_name_new_user == 'agency_name'){
                    this.field_error_new_agency_new_user = 'agency_name'; //Show agency error if empty field
                    this.only_error_new = true;
                    //Error Message for field Agency Name if update fails from backend
                    this.message_new_agency_new_user = response.json().error_data.error_field_list[n].message;
                    this.general_error_agency = ''; //Clean mesagge general error User Exist
                    this.general_error_agency_new_user = ''; //Clean mesagge general error New User
                    jQuery('#new-agency-name-new-user').addClass('border-errors');
                    console.log('Agency New user: ' + this.message_new_agency_new_user);
                  }
                  if(this.error_new_agency_email_new_user == 'agency_email'){
                    this.field_error_agency_email_new_user = 'agency_email'; //Show agency error if empty field
                    this.only_error_new = true;
                    //Error Message for field Agency E-mail if update fails from backend
                    this.message_agency_email_new_user = response.json().error_data.error_field_list[n].message;
                    this.general_error_agency = ''; //Clean mesagge general error User Exist
                    this.general_error_agency_new_user = ''; //Clean mesagge general error New User
                    jQuery('#agency-email-new-user').addClass('border-errors');
                    console.log('Agency New user: ' + this.message_agency_email_new_user);
                  }
                  if(this.error_tax_new_user == 'agency_tax_number'){
                    this.field_error_tax_new_user = 'agency_tax_number'; //Show tax number error if empty field
                    this.only_error_new = true;
                    //Error Message for field Tax Number if update fails from backend
                    this.message_tax_new_user = response.json().error_data.error_field_list[n].message;
                    this.general_error_agency = ''; //Clean mesagge general error User Exist
                    this.general_error_agency_new_user = ''; //Clean mesagge general error New User
                    jQuery('#tax-number-new-user').addClass('border-errors');
                    console.log('Tax Number New user: ' + this.message_tax_new_user);
                  }
                }
              }
              //If there is error scroll to alert error element
              var go_to_element_position = $('body').scrollTop() + $('#scrollToError').offset().top - $('#scrollToError').height();
              $("body").animate({scrollTop: go_to_element_position}, 2000, 'swing'); //Scroll to top after get error on save
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
      this.relation_name_new_users = ''; //Field City
      this.relation_name_new_user_agency = ''; //Field Agency
      this.zip_new_user = '';
      this.password_new_user = '';
      this.is_admin_new_user = this.is_admin_new_user_backup;
      this.is_comissionable_new_user = this.is_comissionable_new_user_backup;
      this.user_access_new_user = this.user_access_new_user_backup;
      this.language_new_user = this.language_new_user_default;
      this.agency_name_new_agency_new_user = '';
      this.agency_email_new_user = '';
      this.agency_tax_number_new_user = '';
      this.error_first_name_new_user = '';
      this.field_error_email = '';
      this.message_name_new_user ='';
      this.message_last_name_new_user ='';
      this.message_email_new_user ='';
      this.message_pass_new_user ='';

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
      this.validation_email_filter_new_users = true; //Form New User field E-mail
      this.validation_email_filter_agency = true; //Form New User Create New Agency
      this.hide_form_create_new_agency('', 'new-user'); //Hide form Create New Agency

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

////////////////////////////////////////////////////////////////////////
/// Request Save data Edit Form Section USERS Exist of Agency Detail ///
save_form_users(send_mail, i){
  this.length_of_filteredList = []; //Clean array
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
  if(this.relation_name_users_agency[i] == undefined){
    var field_agency = '#agency-user' + i;
    this.agency_auto_code_user[i] = this.user_detail.agency_code;
  }
  if(this.relation_name_users_agency[i] == ''){
    this.agency_auto_code_user[i] = undefined;
  }
  if(this.password_new[i] == '' || this.password_new[i] == undefined){
    var password = '#password' + i;
    this.password_new[i] = jQuery(password).val();
  }
  if(this.language_new[i] == '' || this.language_new[i] == undefined){
    var language = '#language' + i;
    this.language_code[i] = '';
  }
  if(this.agency_name_new_agency_user[i] == undefined){
    this.agency_name_new_agency_user[i] = '';
  }
  if(this.agency_email_user[i] == undefined){
    this.agency_email_user[i] = '';
  }
  if(this.agency_tax_number_user[i] == undefined){
    this.agency_tax_number_user[i] = '';
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
    agency_code: this.agency_auto_code_user[i],
    is_admin: this.is_admin_data_form[i],
    is_comissionable: this.is_comissionable_data_form[i],
    user_access: this.user_access_data_form[i],
    never_disable: this.never_disable_data_form[i],
    create_agency: this.create_agency_user[i],
    agency_name: this.agency_name_new_agency_user[i],
    agency_email: this.agency_email_user[i],
    agency_tax_number: this.agency_tax_number_user[i],
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
                          this._service.get_list_users({page: this._service.current_page}).subscribe();
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
                  this.field_error_user =  response.json().error_data.error_field_list[m].field;

                  if(this.field_error_user == 'first_name'){
                    this.field_error_first_name = 'first_name';
                    this.only_error[i] = true;
                    //Error Message for First Name if update fails from backend
                    this.message_name = response.json().error_data.error_field_list[m].message;
                    jQuery('#first-name' + i).addClass('border-errors');
                    console.log('first-name: ' + this.message_name);
                  }
                  if(this.field_error_user == 'last_name'){
                    this.field_error_last_name = 'last_name';
                    this.only_error[i] = true;
                    //Error Message for field Last Name if update fails from backend
                    this.message_name = response.json().error_data.error_field_list[m].message;
                    jQuery('#last-name' + i).addClass('border-errors');
                    console.log('Last Name: ' + this.message_name);
                  }
                  if(this.field_error_user == 'email'){
                    this.field_error_email = 'email';
                    this.only_error[i] = true;
                    //Error Message for field Email if update fails from backend
                    this.message_name = response.json().error_data.error_field_list[m].message;
                    jQuery('#email-user' + i).addClass('border-errors');
                    console.log('E-mail user: ' + this.message_name);
                  }
                  if(this.field_error_user == 'city'){
                    this.field_error_city = 'city'
                    //Error Message for field City if update fails from backend
                    this.message_city_user[i] = response.json().error_data.error_field_list[m].message;
                    jQuery('#city-user').addClass('border-errors');
                    console.log('City user: ' + this.message_city_user[i]);
                  }
                  if(this.field_error_user == 'agency'){
                     this.field_error_agency[i] = 'agency';
                     this.only_error[i] = true;
                    //Error Message for field Agency if update fails from backend
                    this.message_agency_user[i] = response.json().error_data.error_field_list[m].message;
                    this.general_error_agency = ''; //Clean mesagge general error User Exist
                    this.general_error_agency_new_user = ''; //Clean mesagge general error New User
                    jQuery('#agency-user' + i).addClass('border-errors');
                    console.log('Agency user: ' + this.message_agency_user[i]);
                  }
                  //Errors form Create New Agency
                  if(this.field_error_user == 'agency_name'){
                     this.field_error_new_agency[i] = 'agency_name';
                     this.only_error[i] = true;
                    //Error Message for field Agency Name if update fails from backend
                    this.message_new_agency_user = response.json().error_data.error_field_list[m].message;
                    this.general_error_agency = ''; //Clean mesagge general error User Exist
                    this.general_error_agency_new_user = ''; //Clean mesagge general error New User
                    jQuery('#new-agency-name' + i).addClass('border-errors');
                    console.log('Agency Name user: ' + this.message_new_agency_user);
                  }
                  if(this.field_error_user == 'agency_email'){
                     this.field_error_agency_email[i] = 'agency_email';
                     this.only_error[i] = true;
                    //Error Message for field Agency E-mail if update fails from backend
                    this.message_new_agency_mail_user = response.json().error_data.error_field_list[m].message;
                    this.general_error_agency = ''; //Clean mesagge general error User Exist
                    this.general_error_agency_new_user = ''; //Clean mesagge general error New User
                    jQuery('#new-agency-email' + i).addClass('border-errors');
                    console.log('Agency Mail user: ' + this.message_new_agency_mail_user);
                  }
                  if(this.field_error_user == 'agency_tax_number'){
                     this.field_error_tax[i] = 'agency_tax_number';
                     this.only_error[i] = true;
                    //Error Message for field Tax Number if update fails from backend
                    this.message_new_agency_tax_user = response.json().error_data.error_field_list[m].message;
                    this.general_error_agency = ''; //Clean mesagge general error User Exist
                    this.general_error_agency_new_user = ''; //Clean mesagge general error New User
                    jQuery('#tax-number' + i).addClass('border-errors');
                    console.log('Tax number user: ' + this.message_new_agency_tax_user);
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
      this.length_of_filteredList = [];
      jQuery('#city-user' + i).addClass('border-errors');
    } //Close if
  } //Close save_form_users

  ////////////////////////////////////////////////////
  /// UPDATED AFTER SAVE Second form Section USERS ///
  after_save_form_user(i, first_name, middle_name, last_name, email, office_phone, mobile_phone, address, city_code, zip, password, agency_code, is_admin, is_comissionable, user_access, never_disable, language){
    this.load.hide_loading_gif(); //Remove loading gif
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
  cancel_edit_form_user(i){
      this.first_name_new[i] = this.first_name_data_form[i];
      this.middle_name_new[i] = this.middle_name_data_form[i];
      this.last_name_new[i] = this.last_name_data_form[i];
      this.email_user_new[i] = this.email_data_form[i];
      this.office_phone_new[i] = this.office_phone_data_form[i];
      this.mobile_phone_new[i] = this.mobile_phone_data_form[i];
      this.address_user_new[i] = this.address_data_form[i];
      this.city_code_user[i] = this.relation_name_users[i]; //Code selected of city field on autocomplete
      this.relation_name_users[i] = this.location_data_form[i];
      this.agency_auto_code_user[i]  = this.relation_name_users_agency[i]; //Code selected of Agency field on autocomplete
      this.relation_name_users_agency[i] =   this.agency_name_data_form[i];
      this.zip_user_new[i] = this.zip_data_form[i];
      this.password_new[i] = this.password_data_form[i];
      this.agency_code[i] = this.agency_code;
      this.is_admin[i] = this.is_admin_data_form[i];
      this.is_comissionable[i] = this.is_comissionable_data_form[i];
      this.user_access[i] = this.user_access_data_form[i];
      this.agency_name_new_agency_user[i] = [],
      this.agency_email_user[i] = [],
      this.agency_tax_number_user[i] = [],
      this.language_new[i] = this.language_data_form[i]

      /// Property never_disable (Checkbox)
      if(this.never_disable_data_form[i] != this.never_disable_data_form_backup[i]){
         var never_disable_user = '#checkbox-never' + i;
        $(never_disable_user).trigger('click');
        this.never_disable_data_form[i] = this.never_disable_data_form_backup[i];
      }

      //Field City: Hide message and red border after Cancel
      jQuery('#city-user' + i).removeClass('border-errors');
      this.message_city_user[i] = '';
      this.validation_email_filter_users[i] = true; //Form User Exist field E-mail
      this.validation_email_filter[i] = true; //Form User Exist Create New Agency
      this.trigger_radio_buttons_users(i);
      this.hide_form_create_new_agency(i, 'user'); //Hide form Create New Agency

  } //Close cancel_edit_form_user

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

} //Close class editUserDetail



