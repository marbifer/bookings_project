import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable, ViewChild} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {CustomHttp} from '../../../../services/http-wrapper';
import myGlobals = require('../../../../../app');
import {Location} from '@angular/common';
import {LoadingGif} from '../../../../bworkspace/filedetail/loading_gif.service';
import {RolloverAutocompletes} from '../../../../customers/rollovers-dropdown.service';
import {PriceRules} from '../../../price-rules/price-rules';
import {DataPropertiesPriceRules} from '../../../price-rules/data_properties.service';
import {Core} from '../../../../core/core';
import {DataPagination} from '../../../../settings/pagination-mappings/data_pagination.service';
import { Subject } from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import { Subscription } from "rxjs";

declare var jQuery: any;
declare var $: any;
export var ObjectExtProvider;

@Injectable()
export class editPriceRules{

  @ViewChild('pagination') myPag;

  //////////////////// PRICE RULES /////////////////////
  //Inline Price Rules Detail Request Get Data: Table Price Rules
  updated_form: any;
  state_validate_auto_price_exist = true; //Form Price Rules exist
  //state_validate_city_new_user = true; //Form New Price Rules

  //Request Autocompletes
  length_of_filteredList = []; //Length of filtered list of autocomplete city User exist
  elementRef;
  block_edit = false;

  //General Errors Message
  general_error_agencies: string = ''; 
  general_error_price_rules_save: string = ''; 

  //Errors Message autocompletes
  general_error_autocompletes: string=''; //Request All autocompletes Price Rules Exist
  general_error_autocompletes_new_user: string=''; //Request All autocompletes New Price Rules 
  exist_error_agency: any; //Request error specific error Save

  //Errors FORM PRICE RULES EXIST after Save
  i_rules = [];
  updated_form_price_rules = [];
  field_error_price_rules: any; 
  exist_error_price_rules_save: any; 
  field_error_rule_name: any; 
  message_name: any; //Field Rule Name Price Rules Exist
  message_effective_date_start: any; //Datepicker effective start Price Rules Exist
  message_effective_date_end: any; //Datepicker effective End Price Rules Exist
  message_amount_start: any; //Price Range Amount Start Price Rules Exist
  message_amount_end: any; //Price Range Amount End Price Rules Exist
  message_days_before_to: any; //Days Before To Price Rules Exist
  message_service_date_start: any; //Datepicker Service Start Price Rules Exist
  message_service_date_end: any; //Datepicker Service End Price Rules Exist
  message_amount: any; //Dropdown Input Amount Price Rules Exist
  message_amount_symbol: any; //Button Amount percentage Price Rules Exist
  message_autocompletes = []; //Message from Front-end All Autocompletes Price Rules Exist
  only_error = []; //Show error only in edited user exist

  //Errors FORM NEW PRICE RULES after Save
  only_error_new: any; //Show error only in edited new user 
  eraser: any;

  //Inline properties ngModel Price Rules Exist
  price_rule_code: any;
  price_rule_code_row = [];
  price_detail: any;
  rule_name = [];
  effective_date_start = [];
  effective_date_end = [];
  rule_type = [];
  agencies = []; 
  external_providers = [];  
  internal_providers = [];  
  destinations = [];  
  currency_default_symbol = [];
  amount_end = [];
  amount_start = [];
  amount_type = [];
  amount_symbol = [];
  amount = [];
  validation_amount = [];
  validation_price_range_start = [];
  validation_price_range_end = [];
  days_before_service_starts_from = [];
  days_before_service_starts_to = [];
  service_date_start = [];
  service_date_end = [];
  rule_name_edit = []; 
  amount_start_edit = []; //Fields Price Range
  amount_end_edit = []; //Fields Price Range  
  currency_default_symbol_edit = []; //Fields Price Range 
  days_before_service_starts_from_edit = []; 
  days_before_service_starts_to_edit = []; 
  amount_edit = []; //Dropdown Amount 
  amount_symbol_edit = []; //Dropdown Amount
  currency_symbols = []; //Dropdown Amount 
  currency_code = []; //Dropdown Amount 
  show_detail: boolean;
  remove_class = [];

  error_autocomplete_to_send = 0;

  //Section Service Type
  change_text_button_service_type = []; //Buttons Section Service Type
  store_name_icons_type_service = []; //Buttons with Icons Section Service Type
  services_button_all_types = []; //Buttons Al types Section Service Type
  services_all_add_remove = [];

  //Service Type Hotel
  hotels = [];
  hotels_array_apply = [];
  apply_not_apply_hotels = [];
  hotels_array_not_apply = [];

  //Service Type Attraction
  attractions = [];
  attractions_array_apply = [];
  apply_not_apply_attractions = [];
  attractions_array_not_apply = [];

  //Service Type Transfer     
  transfers = [];
  transfers_array_apply = [];
  apply_not_apply_transfers = [];
  transfers_array_not_apply = [];

  //Service Type Car    
  cars = []; 
  cars_array_apply = [];
  apply_not_apply_cars = [];
  cars_array_not_apply = [];

  //Service Type Cruise       
  cruises = []; 
  cruises_array_apply = [];
  apply_not_apply_cruises = [];
  cruises_array_not_apply = [];

  //Service Type Flight        
  flights = []; 
  flights_array_apply = [];
  apply_not_apply_flights = [];
  flights_array_not_apply = [];

  //Service Type Package     
  packages = [];  
  packages_array_apply = [];
  apply_not_apply_packages = [];
  packages_array_not_apply = [];

  //Service Type Insurance     
  insurances = [];
  insurances_array_apply = [];
  apply_not_apply_insurances = [];
  insurances_array_not_apply = [];

  //Agencies
  agencies_array_apply = [];
  agencies_array_not_apply = [];
  apply_not_apply_agencies = [];

  //Internal Providers
  int_prov_array_apply = [];
  int_prov_array_not_apply = [];
  apply_not_apply_int_prov = [];

  //External Providers
  ext_prov_array_apply = [];
  ext_prov_array_not_apply = [];
  apply_not_apply_ext_prov = [];

  //Destinations
  destination_array_apply = [];
  destination_array_not_apply = [];
  apply_not_apply_destination = [];

  eraserChange: Subject<string> = new Subject<string>();
  emptyObject: Subject<string> = new Subject<string>();
  update_edit_object: Subject<string> = new Subject<string>();

constructor(
  public http: Http, 
  public _loc: Location, 
  public _service: DataPropertiesPriceRules, 
  public load: LoadingGif, 
  public _rol: RolloverAutocompletes, 
  public _data_pagination: DataPagination
) {}

close_form_price_rules(){
  for(var x=0; x<this.remove_class.length; x++){
     this.remove_class[x] = true; //Close form price rules exist
   }
}

////////////////////////////////////////////////////////////////////////////
/// Request Get data Price Rules Detail(FORM DATA Price rules existing ) ///
get_data_price_rules(price_rule_code, i){
      this.price_rule_code = price_rule_code; 
      //this.update_edit_object.next(price_rule_code); //Send update to suscriber, llama al observable y llama al subcomponent(price-detail-subcomponente.ts) 
      console.log('i: '+ JSON.stringify(i));
      console.log('ID DE PRICE RULES: ' + JSON.stringify(this.price_rule_code));

      //this.remove_message_city();
      this.price_rule_code = price_rule_code;
      console.log('i: '+ JSON.stringify(i));
      console.log('ID DE PRICE RULES: ' + JSON.stringify(this.price_rule_code));
      let url = myGlobals.host + '/api/admin/settings/price_rule/detail';
      let body = JSON.stringify({ price_rule_code: price_rule_code });
      console.log('BODY PRICE RULES EXIST FORM: ' + body);
      let headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post( url, body, {headers: headers, withCredentials:true})
      .subscribe(
        response => {
          console.log('RESPUESTA: DATA PRICE RULES DETAIL: ' + JSON.stringify(response.json()));
          this.price_detail = response.json().price_rule;
          this.price_rule_code_row[i] = this.price_detail.code;
          this.rule_name[i] = this.price_detail.name;
          this.effective_date_start[i] = this.price_detail.effective_date_start;
          this.effective_date_end[i] = this.price_detail.effective_date_end;
          this.rule_type[i] = this.price_detail.rule_type;
          this.services_button_all_types[i] = this.price_detail.services.all;
          this.store_name_icons_type_service[i] = this.price_detail.services.service_type;
          this.services_all_add_remove[i] = this.price_detail.services.all_add_remove;

          ////////////////////////////////////
          /// SECTION SERVICE TYPE: HOTELS ///
          if(this.store_name_icons_type_service[i] == 1){
              this.hotels[i] = this.price_detail.services.all_add_remove;
              if(this.hotels[i] == 'add'){ 
                this.hotels_array_apply[i] = this.price_detail.services.element_codes_and_types; //Code Hotels
              }
              if(this.hotels[i] == 'remove'){ 
                this.hotels_array_not_apply[i] = this.price_detail.services.element_codes_and_types; //Code Hotels
              } 
          }
          /////////////////////////////////////////
          /// SECTION SERVICE TYPE: ATTRACTIONS ///
          else if(this.store_name_icons_type_service[i] == 2){
              this.transfers[i] = this.price_detail.services.all_add_remove;
              if(this.attractions[i] == 'add'){ 
                this.attractions_array_apply[i] = this.price_detail.services.element_codes_and_types; //Code Attractions
              }
              if(this.attractions[i] == 'remove'){ 
                this.attractions_array_not_apply[i] = this.price_detail.services.element_codes_and_types; //Code Attractions
              }
          }

          ///////////////////////////////////////
          /// SECTION SERVICE TYPE: TRANSFERS ///
          else if(this.store_name_icons_type_service[i] == 3){
              this.transfers[i] = this.price_detail.services.all_add_remove;
              if(this.transfers[i] == 'add'){ 
                this.transfers_array_apply[i] = this.price_detail.services.element_codes_and_types; //Code Tranfers
              }
              if(this.transfers[i] == 'remove'){ 
                this.transfers_array_not_apply[i] = this.price_detail.services.element_codes_and_types; //Code Transfers
              }
          }

          //////////////////////////////////
          /// SECTION SERVICE TYPE: CARS ///
          else if(this.store_name_icons_type_service[i] == 7){
              this.cars[i] = this.price_detail.services.all_add_remove;
              if(this.cars[i] == 'add'){ 
                this.cars_array_apply[i] = this.price_detail.services.element_codes_and_types; //Code Tranfers
              }
              if(this.cars[i] == 'remove'){ 
                this.cars_array_not_apply[i] = this.price_detail.services.element_codes_and_types; //Code Transfers
              }
          }
          
          /////////////////////////////////////
          /// SECTION SERVICE TYPE: CRUISES ///
          else if(this.store_name_icons_type_service[i] == 8){
              this.cruises[i] = this.price_detail.services.all_add_remove;
              if(this.cruises[i] == 'add'){ 
                this.cruises_array_apply[i] = this.price_detail.services.element_codes_and_types; //Code Cruises
              }
              if(this.cruises[i] == 'remove'){ 
                this.cruises_array_not_apply[i] = this.price_detail.services.element_codes_and_types; //Code Cruises
              }
          }

          /////////////////////////////////////////
          /// SECTION SERVICE TYPE: FLIGHTS/AIR ///
          else if(this.store_name_icons_type_service[i] == 9){
              this.flights[i] = this.price_detail.services.all_add_remove;
              if(this.flights[i] == 'add'){ 
                this.flights_array_apply[i] = this.price_detail.services.element_codes_and_types; //Code Fligths
              }
              if(this.flights[i] == 'remove'){ 
                this.flights_array_not_apply[i] = this.price_detail.services.element_codes_and_types; //Code Fligths
              }
          }

          //////////////////////////////////////
          /// SECTION SERVICE TYPE: PACKAGES ///
          else if(this.store_name_icons_type_service[i] == 10){
              this.packages[i] = this.price_detail.services.all_add_remove;
              if(this.packages[i] == 'add'){ 
                this.packages_array_apply[i] = this.price_detail.services.element_codes_and_types; //Code Packages
              }
              if(this.packages[i] == 'remove'){ 
                this.packages_array_not_apply[i] = this.price_detail.services.element_codes_and_types; //Code Packages
              }
          }

          ////////////////////////////////////////
          /// SECTION SERVICE TYPE: INSURANCES ///
          else if(this.store_name_icons_type_service[i] == 11){
              this.insurances[i] = this.price_detail.services.all_add_remove;
              if(this.insurances[i] == 'add'){ 
                this.insurances_array_apply[i] = this.price_detail.services.element_codes_and_types; //Code Insurances
              }
              if(this.insurances[i] == 'remove'){ 
                this.insurances_array_not_apply[i] = this.price_detail.services.element_codes_and_types; //Code Insurances
              }
          }

          ////////////////////////
          /// SECTION AGENCIES ///
          this.agencies[i] = this.price_detail.agencies.all_add_remove;
          if(this.agencies[i] == 'add'){ 
            this.agencies_array_apply[i] = this.price_detail.agencies.element_codes; //Code agencies
          }
          if(this.agencies[i] == 'remove'){ 
            this.agencies_array_not_apply[i] = this.price_detail.agencies.element_codes; //Code agencies
          }

          //////////////////////////////
          /// SECTION INT. PROVIDERS ///
          this.internal_providers[i] = this.price_detail.internal_providers.all_add_remove;
          if(this.internal_providers[i] == 'add'){ 
            this.int_prov_array_apply[i] = this.price_detail.internal_providers.element_codes; //Code Int. Providers
          }
          if(this.internal_providers[i] == 'remove'){ 
            this.int_prov_array_not_apply[i] = this.price_detail.internal_providers.element_codes; //Code Int. Providers
          }

          //////////////////////////////
          /// SECTION EXT. PROVIDERS ///
          this.external_providers[i] = this.price_detail.external_providers.all_add_remove;
          if(this.external_providers[i] == 'add'){ 
            this.ext_prov_array_apply[i] = this.price_detail.external_providers.element_codes; //Code Ext. Providers
          }
          if(this.external_providers[i] == 'remove'){ 
            this.ext_prov_array_not_apply[i] = this.price_detail.external_providers.element_codes; //Code Ext. Providers
          }

          ////////////////////////////
          /// SECTION DESTINATIONS ///
          this.destinations[i] = this.price_detail.destinations.all_add_remove;
          if(this.destinations[i] == 'add'){ 
            this.destination_array_apply[i] = this.price_detail.destinations.element_codes_and_types; //Code Destinations
          }
          if(this.destinations[i] == 'remove'){ 
            this.destination_array_not_apply[i] = this.price_detail.destinations.element_codes_and_types; //Code Destinations
          }

          this.amount_type[i] = this.price_detail.amount_type; //Price range
          this.amount_start[i] = this.price_detail.amount_start; //Price range
          this.amount_end[i] = this.price_detail.amount_end; //Price range
          this.currency_default_symbol[i] = this.price_detail.currency_default_symbol; //Price range
          this.amount_symbol[i] = this.price_detail.amount_symbol; //Amount Code currency
          this.amount[i] = this.price_detail.amount; //Amount
          this.days_before_service_starts_from[i] = this.price_detail.days_before_service_starts_from;
          this.days_before_service_starts_to[i] = this.price_detail.days_before_service_starts_to; 
          this.service_date_start[i] = this.price_detail.service_date_start;
          this.service_date_end[i] = this.price_detail.service_date_end;

          //Datepicker Set input values Section Effective Start
          var locale = "en-us"; //For All dates
          var effective_start = '#effective-start' + i;

          this.effective_date_start[i] = new Date(this.effective_date_start[i]); //Full time standard
          this.effective_date_start[i] = this.effective_date_start[i].toISOString(); //ISO format
          var date = new Date(this.effective_date_start[i]);
          var year:any = date.getFullYear();          
          var dt:any = date.getDate();
          var objDate = new Date(this.effective_date_start[i]),
          month:any = objDate.toLocaleString(locale, { month: "short" });

          if (dt < 10) {dt = '0' + dt;}
          if (month < 10) {month = '0' + month;}
          this.effective_date_start[i] = dt+'-' + month + '-'+year; 

          jQuery('#effective-start' + i).val(this.effective_date_start[i]);
          jQuery('#effective-start' + i).datepicker('update');
          jQuery('.datepicker-effective input:first-child').val(this.effective_date_start[i]);

          //Datepicker Effective End
          var effective_end = '#effective-end' + i;

          this.effective_date_end[i] = new Date(this.effective_date_end[i]); //Full time standard
          this.effective_date_end[i] = this.effective_date_end[i].toISOString(); //ISO format

          var date2 = new Date(this.effective_date_end[i]);
          var year2:any = date2.getFullYear();
          var dt2:any = date2.getDate();
          var objDate2 = new Date(this.effective_date_end[i]),
          month2:any = objDate2.toLocaleString(locale, { month: "short" }); 

          if (dt2 < 10) {dt2 = '0' + dt2;}
          if (month2 < 10) {month2 = '0' + month2;}
          this.effective_date_end[i] = dt2+'-' + month2 + '-'+year2;

          jQuery('#effective-end' + i).val(this.effective_date_end[i]);
          jQuery('#effective-end' + i).datepicker('update');
          jQuery('.datepicker-effective input:last-child').val(this.effective_date_end[i]);

          //Datepicker Set input values Section Service Start
          var service_start = '#service-start' + i;

          this.service_date_start[i] = new Date(this.service_date_start[i]); //Full time standard
          this.service_date_start[i] = this.service_date_start[i].toISOString(); //ISO format
          var date3 = new Date(this.service_date_start[i]);
          var year3:any = date3.getFullYear();
          var dt3:any = date3.getDate();
          var objDate3 = new Date( this.service_date_start[i]),
          month3:any = objDate3.toLocaleString(locale, { month: "short" }); 

          if (dt3 < 10) {dt3 = '0' + dt3;}
          if (month3 < 10) {month3 = '0' + month3;}
          this.service_date_start[i] = dt3+'-' + month3 + '-'+year3; 

          jQuery('#service-start' +i).val(this.service_date_start[i]);
          jQuery('#service-start' + i).datepicker('update');

          //Datepicker Service End
          var service_end = '#service-end' + i;

          this.service_date_end[i] = new Date(this.service_date_end[i]); //Full time standard
          this.service_date_end[i] = this.service_date_end[i].toISOString(); //ISO format
          var date4 = new Date(this.service_date_end[i]);
          var year4:any = date4.getFullYear();
          var dt4:any = date4.getDate();
          var objDate4 = new Date( this.service_date_end[i]),
          month4:any = objDate4.toLocaleString(locale, { month: "short" }); 

          if (dt4 < 10) {dt4 = '0' + dt4;}
          if (month4 < 10) {month4 = '0' + month4;}
          this.service_date_end[i] = dt4+'-' + month4 + '-'+year4; 

          jQuery('#service-end' +i).val(this.service_date_end[i]);
          jQuery('#service-end' + i).datepicker('update');

          jQuery('.datepicker-service input:first-child').val(this.service_date_start[i]);
          jQuery('.datepicker-service input:last-child').val(this.service_date_end[i]);

           /////////////////////////////////////////////////////////////////////////////////
          /// Indicated default state of Buttons to make work autocomplete at first time ///
          //// Section Service Type: Hotels ////
          if(this.hotels[i] == 'add'){ 
             this.apply_not_apply_hotels[i] = 'apply'; 
          }
           if(this.hotels[i] == 'remove'){            
            this.apply_not_apply_hotels[i] = 'not_apply';
          }

          //// Section Service Type: Attractions ////
          if(this.attractions[i] == 'add'){ 
             this.apply_not_apply_attractions[i] = 'apply'; 
          }
           if(this.attractions[i] == 'remove'){            
            this.apply_not_apply_attractions[i] = 'not_apply';
          }

          //// Section Service Type: Transfers ////
          if(this.transfers[i] == 'add'){ 
             this.apply_not_apply_transfers[i] = 'apply'; 
          }
           if(this.transfers[i] == 'remove'){            
            this.apply_not_apply_transfers[i] = 'not_apply';
          }

          //// Section Service Type: Cars ////
          if(this.cars[i] == 'add'){ 
             this.apply_not_apply_cars[i] = 'apply'; 
          }
           if(this.cars[i] == 'remove'){            
            this.apply_not_apply_cars[i] = 'not_apply';
          }

          //// Section Service Type: Cruises ////
          if(this.cruises[i] == 'add'){ 
             this.apply_not_apply_cruises[i] = 'apply'; 
          }
           if(this.cruises[i] == 'remove'){            
            this.apply_not_apply_cruises[i] = 'not_apply';
          }

          //// Section Service Type: Flights ////
          if(this.flights[i] == 'add'){ 
             this.apply_not_apply_flights[i] = 'apply'; 
          }
           if(this.flights[i] == 'remove'){            
            this.apply_not_apply_flights[i] = 'not_apply';
          }

          //// Section Service Type: Packages ////
          if(this.packages[i] == 'add'){ 
             this.apply_not_apply_packages[i] = 'apply'; 
          }
           if(this.packages[i] == 'remove'){            
            this.apply_not_apply_packages[i] = 'not_apply';
          }

          //// Section Service Type: Insurances ////
          if(this.insurances[i] == 'add'){ 
             this.apply_not_apply_insurances[i] = 'apply'; 
          }
           if(this.insurances[i] == 'remove'){            
            this.apply_not_apply_insurances[i] = 'not_apply';
          }

          //// Section Agencies ////
          if(this.agencies[i] == 'add'){ 
             this.apply_not_apply_agencies[i] = 'apply'; 
          }
           if(this.agencies[i] == 'remove'){            
            this.apply_not_apply_agencies[i] = 'not_apply';
          }

          /// Section Int. Providers ///
          if(this.internal_providers[i] =='add'){ 
             this.apply_not_apply_int_prov[i] = 'apply';
          }
           if(this.internal_providers[i] == 'remove'){            
            this.apply_not_apply_int_prov[i] = 'not_apply';
          }

          /// Section Ext. Providers ///
          if(this.external_providers[i] == 'add'){ 
             this.apply_not_apply_ext_prov[i] = 'apply';
          }
           if(this.external_providers[i] == 'remove'){            
            this.apply_not_apply_ext_prov[i] = 'not_apply';
          }

          /// Section Destinations ///
          if(this.destinations[i] == 'add'){ 
            this.apply_not_apply_destination[i] = 'apply';
          }
           if(this.destinations[i] == 'remove'){            
            this.apply_not_apply_destination[i] = 'not_apply';
          }
          
          /*this.count_price_data_form = this.price_detail.length; //Count
          console.log('COUNT TABLE PRICE RULES: ' + this.count_price_data_form); */
        }, error => {}
    ); 

} //Close request get data get_data_price_rules

/////////////////////////////////////////////////////////////////////////
/// Set form empty Data Price Rules Detail(FORM DATA NEW Price rules) ///
set_new_price_rules(){
    var i = 99;
    this.price_rule_code_row[i] = undefined;
    this.rule_name[i] = undefined;
    //this.effective_date_start[i] = this.price_detail.effective_date_start;
    //this.effective_date_end[i] = this.price_detail.effective_date_end;
    this.rule_type[i] = 1;
    this.services_button_all_types[i] = true;
    this.store_name_icons_type_service[i] = 'all';
    this.services_all_add_remove[i] = undefined;

    // SECTION AGENCIES 
    this.agencies[i] = 'all';
    
    // SECTION INT. PROVIDERS 
    this.internal_providers[i] = 'all';
   
    // SECTION EXT. PROVIDERS 
    this.external_providers[i] = 'all';         

    // SECTION DESTINATIONS 
    this.destinations[i] = 'all';         

    this.amount_type[i] = 1; //Price range
    this.amount_start[i] = undefined; //Price range
    this.amount_end[i] = undefined //Price range
    this.currency_default_symbol[i] = '$'; //Price range
    this.amount_symbol[i] = '$'; //Amount
    this.amount[i] = undefined; //Amount
    this.days_before_service_starts_from[i] = undefined;
    this.days_before_service_starts_to[i] = undefined; 

    //Button Cancel: Set properties and DatePickers(Form New Price Rules)
    this.rule_name_edit[i] = undefined;
    this.amount_start_edit[i] = undefined;
    this.amount_end_edit[i] = undefined;
    this.days_before_service_starts_from_edit[i] = undefined;
    this.days_before_service_starts_to_edit[i] = undefined;
    this.amount_edit[i] = undefined;
    this.effective_date_start[i] = '';
    this.effective_date_end[i] = '';
    this.service_date_start[i] = '';
    this.service_date_end[i] = '';
    jQuery('#effective-start' + i).val('');
    jQuery('#effective-end' + i).val('');
    jQuery('#service-start' + i).val('');
    jQuery('#service-end' + i).val('');
       
} //Close method set_new_price_rules


//////////////////////////
/// ICONS SERVICE TYPE ///
select_services(type_services, i){
  if(type_services == 'hotel'){
    this.change_text_button_service_type[i] = 'Hotels';
    this.store_name_icons_type_service[i] = 1;
    this.services_button_all_types[i] = false;

  }
  else if(type_services == 'attraction'){
    this.change_text_button_service_type[i] = 'Attractions';
    this.store_name_icons_type_service[i] = 2;
    this.services_button_all_types[i] = false;
  }
  else if(type_services == 'transfer'){
    this.change_text_button_service_type[i] = 'Transfers';
    this.store_name_icons_type_service[i] = 3;
    this.services_button_all_types[i] = false;
  }
  else if(type_services == 'car'){
    this.change_text_button_service_type[i] = 'Cars';
    this.store_name_icons_type_service[i] = 7;
    this.services_button_all_types[i] = false;
  }
  else if(type_services == 'cruise'){
    this.change_text_button_service_type[i] = 'Cruises';
    this.store_name_icons_type_service[i] = 8;
    this.services_button_all_types[i] = false;
  }
  else if(type_services == 'air'){
    this.change_text_button_service_type[i] = 'Fligths';
    this.store_name_icons_type_service[i] = 9;
    this.services_button_all_types[i] = false;
  }
  else if(type_services == 'package'){
    this.change_text_button_service_type[i] = 'Packages';
    this.store_name_icons_type_service[i] = 10;
    this.services_button_all_types[i] = false;
  }
  else if(type_services == 'insurance'){
    this.change_text_button_service_type[i] = 'Insurances';
    this.store_name_icons_type_service[i] = 11;
    this.services_button_all_types[i] = false;
  }
  else if(type_services == 'all'){ //Button All types
    this.services_button_all_types[i] = true;
    this.store_name_icons_type_service[i] = false;
  } 
}

  //////////////////////////////////////////
  /// Select item of autocomplete HOTELS ///
  select_hotel_button(hotels, i){
   this.error_autocomplete_to_send = this.error_autocomplete_to_send+1;
    if(hotels == 'all'){
      this.hotels[i] = 'all';
      this.services_all_add_remove[i] = 'all';
    }
    else if(hotels == 'add'){
      this.hotels[i] = 'add';
      this.services_all_add_remove[i] = 'add';
      this.apply_not_apply_hotels[i] = 'apply';
    }
    else if(hotels == 'remove'){
      this.hotels[i] = 'remove';
      this.services_all_add_remove[i] = 'remove';
      this.apply_not_apply_hotels[i] = 'not_apply';
    }
  }

  ///////////////////////////////////////////////
  /// Select item of autocomplete ATTRACTIONS ///
  select_attraction_button(attractions, i){
    this.error_autocomplete_to_send = this.error_autocomplete_to_send+1;
    if(attractions == 'all'){
      this.attractions[i] = 'all';
      this.services_all_add_remove[i] = 'all';
    }
    else if(attractions == 'add'){
      this.attractions[i] = 'add';
      this.services_all_add_remove[i] = 'add';
      this.apply_not_apply_attractions[i] = 'apply';
    }
    else if(attractions == 'remove'){
      this.attractions[i] = 'remove';
      this.services_all_add_remove[i] = 'remove';
      this.apply_not_apply_attractions[i] = 'not_apply';
    }
  }

  /////////////////////////////////////////////
  /// Select item of autocomplete TRANSFERS ///
  select_transfer_button(transfers, i){
    this.error_autocomplete_to_send = this.error_autocomplete_to_send+1;
    if(transfers == 'all'){
      this.transfers[i] = 'all';
      this.services_all_add_remove[i] = 'all';
    }
    else if(transfers == 'add'){
      this.transfers[i] = 'add';
      this.services_all_add_remove[i] = 'add';
      this.apply_not_apply_transfers[i] = 'apply';
    }
    else if(transfers == 'remove'){
      this.transfers[i] = 'remove';
      this.services_all_add_remove[i] = 'remove';
      this.apply_not_apply_transfers[i] = 'not_apply';
    }
  }

  ////////////////////////////////////////
  /// Select item of autocomplete CARS ///
  select_car_button(cars, i){
    this.error_autocomplete_to_send = this.error_autocomplete_to_send+1;
    if(cars == 'all'){
      this.cars[i] = 'all';
      this.services_all_add_remove[i] = 'all';
    }
    else if(cars == 'add'){
      this.cars[i] = 'add';
      this.services_all_add_remove[i] = 'add';
      this.apply_not_apply_cars[i] = 'apply';
    }
    else if(cars == 'remove'){
      this.cars[i] = 'remove';
      this.services_all_add_remove[i] = 'remove';
      this.apply_not_apply_cars[i] = 'not_apply';
    }
  }

  ///////////////////////////////////////////
  /// Select item of autocomplete CRUISES ///
  select_cruise_button(cruises, i){
    this.error_autocomplete_to_send = this.error_autocomplete_to_send+1;
    if(cruises == 'all'){
      this.cruises[i] = 'all';
      this.services_all_add_remove[i] = 'all';
    }
    else if(cruises == 'add'){
      this.cruises[i] = 'add';
      this.services_all_add_remove[i] = 'add';
      this.apply_not_apply_cruises[i] = 'apply';
    }
    else if(cruises == 'remove'){
      this.cruises[i] = 'remove';
      this.services_all_add_remove[i] = 'remove';
      this.apply_not_apply_cruises[i] = 'not_apply';
    }
  }

  ///////////////////////////////////////////
  /// Select item of autocomplete FLIGHTS ///
  select_flight_button(flights, i){
    this.error_autocomplete_to_send = this.error_autocomplete_to_send+1;
    if(flights == 'all'){
      this.flights[i] = 'all';
      this.services_all_add_remove[i] = 'all';
    }
    else if(flights == 'add'){
      this.flights[i] = 'add';
      this.services_all_add_remove[i] = 'add';
      this.apply_not_apply_flights[i] = 'apply';
    }
    else if(flights == 'remove'){
      this.flights[i] = 'remove';
      this.services_all_add_remove[i] = 'remove';
      this.apply_not_apply_flights[i] = 'not_apply';
    }
  }

  ////////////////////////////////////////////
  /// Select item of autocomplete PACKAGES ///
  select_package_button(packages, i){
    this.error_autocomplete_to_send = this.error_autocomplete_to_send+1;
    if(packages == 'all'){
      this.packages[i] = 'all';
      this.services_all_add_remove[i] = 'all';
    }
    else if(packages == 'add'){
      this.packages[i] = 'add';
      this.services_all_add_remove[i] = 'add';
      this.apply_not_apply_packages[i] = 'apply';
    }
    else if(packages == 'remove'){
      this.packages[i] = 'remove';
      this.services_all_add_remove[i] = 'remove';
      this.apply_not_apply_packages[i] = 'not_apply';
    }
  }

  //////////////////////////////////////////////
  /// Select item of autocomplete INSURANCES ///
  select_insurance_button(insurances, i){
    this.error_autocomplete_to_send = this.error_autocomplete_to_send+1;
    if(insurances == 'all'){
      this.insurances[i] = 'all';
      this.services_all_add_remove[i] = 'all';
    }
    else if(insurances == 'add'){
      this.insurances[i] = 'add';
      this.services_all_add_remove[i] = 'add';
      this.apply_not_apply_insurances[i] = 'apply';
    }
    else if(insurances == 'remove'){
      this.insurances[i] = 'remove';
      this.services_all_add_remove[i] = 'remove';
      this.apply_not_apply_insurances[i] = 'not_apply';
    }
  }

////////////////////////////////////////////////////
/// Select item of autocomplete Section Agencies /// 
select_agencies_button(agencies, i){
  this.error_autocomplete_to_send = this.error_autocomplete_to_send+1;
  if(agencies == 'all'){
    this.agencies[i] = 'all';
  }
  else if(agencies == 'add'){
    this.agencies[i] = 'add';
    this.apply_not_apply_agencies[i] = 'apply';
  }
  else if(agencies == 'remove'){
    this.agencies[i] = 'remove';
    this.apply_not_apply_agencies[i] = 'not_apply';
  }
}

/////////////////////////////////////////////////
/// Select item of autocomplete Int. Provider ///
select_int_prov_button(int_prov, i){
  this.error_autocomplete_to_send = this.error_autocomplete_to_send+1;
  if(int_prov == 'all'){
    this.internal_providers[i] = 'all';
  }
  else if(int_prov == 'add'){
    this.internal_providers[i] = 'add';
    this.apply_not_apply_int_prov[i] = 'apply';
  }
  else if(int_prov == 'remove'){
    this.internal_providers[i] = 'remove';
    this.apply_not_apply_int_prov[i] = 'not_apply';
  }
}

/////////////////////////////////////////////////
/// Select item of autocomplete Ext. Provider ///
select_ext_prov_button(ext_prov, i){
  this.error_autocomplete_to_send = this.error_autocomplete_to_send+1;
  if(ext_prov == 'all'){
    this.external_providers[i] = 'all';
  }
  else if(ext_prov == 'add'){
    this.external_providers[i] = 'add';
    this.apply_not_apply_ext_prov[i] = 'apply';
  }
  else if(ext_prov == 'remove'){
    this.external_providers[i] = 'remove';
    this.apply_not_apply_ext_prov[i] = 'not_apply';
  }
}

////////////////////////////////////////////////
/// Select item of autocomplete Destinations ///
select_destination_button(destination, i){
  this.error_autocomplete_to_send = this.error_autocomplete_to_send+1;
  if(destination == 'all'){
    this.destinations[i] = 'all';
  }
  else if(destination == 'add'){
    this.destinations[i] = 'add';
    this.apply_not_apply_destination[i] = 'apply';
  }
  else if(destination == 'remove'){
    this.destinations[i] = 'remove';
    this.apply_not_apply_destination[i] = 'not_apply';
  }
}

//////////////////////////////////////
/// All sections and Autocompletes ///
remove_item(type, i, z){
  if(type == 'hotels'){
    if(this.apply_not_apply_hotels[i] == 'apply'){ //Button Add Service Type Hotels
      this.hotels_array_apply[i].splice(z, 1); 
    }
    else if(this.apply_not_apply_hotels[i] == 'not_apply'){ //Button Indicate And exception
      this.hotels_array_not_apply[i].splice(z, 1);
    }
  }
  if(type == 'attractions'){
    if(this.apply_not_apply_attractions[i] == 'apply'){ //Button Add Service Type Attractions
      this.attractions_array_apply[i].splice(z, 1); 
    }
    else if(this.apply_not_apply_attractions[i] == 'not_apply'){ //Button Indicate And exception
      this.attractions_array_not_apply[i].splice(z, 1);
    }
  }
  if(type == 'transfers'){
    if(this.apply_not_apply_transfers[i] == 'apply'){ //Button Add Service Type Transfers
      this.transfers_array_apply[i].splice(z, 1); 
    }
    else if(this.apply_not_apply_transfers[i] == 'not_apply'){ //Button Indicate And exception
      this.transfers_array_not_apply[i].splice(z, 1);
    }
  }
  if(type == 'cars'){
    if(this.apply_not_apply_cars[i] == 'apply'){ //Button Add Service Type Cars
      this.cars_array_apply[i].splice(z, 1); 
    }
    else if(this.apply_not_apply_cars[i] == 'not_apply'){ //Button Indicate And exception
      this.cars_array_not_apply[i].splice(z, 1);
    }
  }
  if(type == 'cruises'){
    if(this.apply_not_apply_cruises[i] == 'apply'){ //Button Add Service Type Cruises
      this.cruises_array_apply[i].splice(z, 1); 
    }
    else if(this.apply_not_apply_cruises[i] == 'not_apply'){ //Button Indicate And exception
      this.cruises_array_not_apply[i].splice(z, 1);
    }
  }
  if(type == 'packages'){
    if(this.apply_not_apply_packages[i] == 'apply'){ //Button Add Service Type Packages
      this.packages_array_apply[i].splice(z, 1); 
    }
    else if(this.apply_not_apply_packages[i] == 'not_apply'){ //Button Indicate And exception
      this.packages_array_not_apply[i].splice(z, 1);
    }
  }
  if(type == 'insurances'){
    if(this.apply_not_apply_insurances[i] == 'apply'){ //Button Add Service Type Insurances
      this.packages_array_apply[i].splice(z, 1); 
    }
    else if(this.apply_not_apply_insurances[i] == 'not_apply'){ //Button Indicate And exception
      this.insurances_array_not_apply[i].splice(z, 1);
    }
  }
  else if(type == 'agencies'){
    if(this.apply_not_apply_agencies[i] == 'apply'){ //Button Add Agencies
      this.agencies_array_apply[i].splice(z, 1); 
    }
    else if(this.apply_not_apply_agencies[i] == 'not_apply'){ //Button Indicate And exception
      this.agencies_array_not_apply[i].splice(z, 1);
    }
  }
  else if(type == 'int_provider'){
    if(this.apply_not_apply_int_prov[i] == 'apply'){ //Button Add Int. Providers
      this.int_prov_array_apply[i].splice(z, 1);
    }
    else if(this.apply_not_apply_int_prov[i] == 'not_apply'){ //Button Indicate And exception
      this.int_prov_array_not_apply[i].splice(z, 1);
    }
  }
  else if(type == 'ext_provider'){
    if(this.apply_not_apply_ext_prov[i] == 'apply'){ //Button Add Ext. Providers
      this.ext_prov_array_apply[i].splice(z, 1);
    }
    else if(this.apply_not_apply_ext_prov[i] == 'not_apply'){ //Button Indicate And exception
      this.ext_prov_array_not_apply[i].splice(z, 1);
    }
  }
  else if(type == 'destination'){
    if(this.apply_not_apply_destination[i] == 'apply'){ //Button Add Destinations
      this.destination_array_apply[i].splice(z, 1);
    } 
    else if(this.apply_not_apply_destination[i] == 'not_apply'){ //Button Indicate And exception
      this.destination_array_not_apply[i].splice(z, 1);
    }
  }
}

  //////////////////////////////////////////////////
  /// Select Buttons of Section Calculation Mode ///
  select_buttons_calculation(number, i){
    $('[data-toggle="dropdown"]').parent().removeClass('open');
    this.validation_amount[i] = true; //Clean border error
    this.message_amount = ''; //Clean message
    if(number == 1){ //fixed_value
      this.amount_type[i] = 1;
      //this.amount[i] = '';
    }
    else if(number == 2){ //percentage
      this.amount_type[i] = 2;
      //this.amount[i] = '';
    }
  }

  ///////////////////////////////////////////////////////////////////
  /// Validation: inputs section Amount(Dropdown) and Price Range ///
  keyup_field_amount_and_price_range(type, i){
    var inputs = jQuery('#new-amount' + i);
    var inputs_price_range_start = jQuery('#new-price-range-start' + i);
    var inputs_price_range_end = jQuery('#new-price-range-end' + i);
    let rate_regex = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/g;

    //Dropdown Amount
    if(type == 'amount'){
      if(this.amount_edit[i] != '' && (!rate_regex.test(this.amount_edit[i]) || inputs.hasClass('ng-invalid'))) {
        this.validation_amount[i] = false;
      }else {
        this.validation_amount[i] = true; //Clean message
      }
    }

    //Inputs section Price Range
    else if(type == 'range_start'){
      if(this.amount_start_edit[i] != '' && (!rate_regex.test(this.amount_start_edit[i]) || inputs_price_range_start.hasClass('ng-invalid'))) {
        this.validation_price_range_start[i] = false;
      } else {
        this.validation_price_range_start[i] = true; //Clean message
      }
    }

    else if(type == 'range_end'){
      if(this.amount_end_edit[i] != '' && (!rate_regex.test(this.amount_end_edit[i]) || inputs_price_range_end.hasClass('ng-invalid'))) {
        this.validation_price_range_end[i] = false;
      } else {
        this.validation_price_range_end[i] = true; //Clean message
      }
    }   
  }

  ///////////////////////////////////////////
  /// Select Buttons of Section Rule Type ///
  select_buttons_rule_type(number, i){
    if(number == 0){
      this.rule_type[i] = 0;
    }
    else if(number == 1){
      this.rule_type[i] = 1;
    }
    else if(number == 2){
      this.rule_type[i] = 2;
    }
  }

/////////////////////////////////////////////////////////////////////////////////////////////
/// Request data list Field Amount(Dropdown) ///
get_list_currency(i) {
  let url = myGlobals.host+'/api/admin/currency_symbol_autocomplete';
  let headers = new Headers({ 'Content-Type': 'application/json' });

      this.http.get( url, {headers: headers, withCredentials:true})
        .subscribe(
          response => {
            console.log('RESPUESTA INLINE PRICE RULES(AMOUNT DROPDOWN): ' + JSON.stringify(response.json()));
            this.currency_symbols[i] = response.json().currency_symbols;
          }, error => {}
      );
  }

  ///////////////////////////////////////////////////////////////////
  /// Section PRICE RULES EXIST: Select field Amount for Dropdown ///
  select_currency(name, code, i){
      this.amount_symbol[i] = name;
      console.log('Select currency name: ' + this.currency_default_symbol[i]);
      this.currency_code[i] = code;
      console.log('Select currency code: ' + this.currency_code[i]);
  }

///////////////////////////////////////////////////////////////////////////////////
/// Request Save data Edit Form Section PRICE RULES Exist of Price rules Detail ///
save_form_price_rules(send_mail, i){ 
  if(this.rule_name_edit[i] == undefined){ //If user did not change value set property with Data from the value
    var rule_name = '#rule-name' + i;
    this.rule_name_edit[i] = jQuery(rule_name).val();
  }
  if(this.amount_start_edit[i] == undefined){ //Price Range
    var amount_start_edit = '#new-price-range-start' + i;
    this.amount_start_edit[i] = jQuery(amount_start_edit).val();
  }
  if(this.amount_end_edit[i] == undefined){ //Price Range
    var amount_end_edit = '#new-price-range-end' + i;
    this.amount_end_edit[i] = jQuery(amount_end_edit).val();
  }
  if(this.amount_edit[i] == undefined){ //Amount
    var amount_edit = '#new-amount' + i;
    this.amount_edit[i] = jQuery(amount_edit).val();
  }
  if(this.days_before_service_starts_to_edit[i] == undefined){ //Days Before To
    var days_before_service_starts_to_edit = '#days-to' + i;
    this.days_before_service_starts_to_edit[i] = jQuery(days_before_service_starts_to_edit).val();
  }

  if(i == 99){ //Form New Price Rules
    if(this.amount_symbol[i] == '$'){ //Currency Code    
      this.currency_code[i] = 1;
    }
  }

  //Datepicker Effective Start
  var effective_start = '#effective-start' + i;
  var effective_date_start_numbers = jQuery(effective_start).val();
  if(effective_date_start_numbers != ''){
    effective_date_start_numbers = new Date(effective_date_start_numbers); //Full time standard
    effective_date_start_numbers = effective_date_start_numbers.toISOString(); //ISO format
    var date = new Date(effective_date_start_numbers);
    var year:any = date.getFullYear();
    var month:any = date.getMonth()+1;
    var dt:any = date.getDate();

    if (dt < 10) {dt = '0' + dt;}
    if (month < 10) {month = '0' + month;}
    effective_date_start_numbers  = year+'-' + month + '-'+dt;
  } else if(effective_date_start_numbers == '' || effective_date_start_numbers == undefined){
    effective_date_start_numbers = '';
  }//Close else if 

  //Datepicker Effective End
  var effective_end = '#effective-end' + i;
  var effective_date_end_numbers = jQuery(effective_end).val();
  if(effective_date_end_numbers != ''){
    effective_date_end_numbers = new Date(effective_date_end_numbers); //Full time standard
    effective_date_end_numbers = effective_date_end_numbers.toISOString(); //ISO format
    var date2 = new Date(effective_date_end_numbers);
    var year2:any = date2.getFullYear();
    var month2:any = date2.getMonth()+1;
    var dt2:any = date2.getDate();

    if (dt2 < 10) {dt2 = '0' + dt2;}
    if (month2 < 10) {month2 = '0' + month2;}
    effective_date_end_numbers = year2+'-' + month2 + '-'+dt2;
  } else if(effective_date_end_numbers == '' || effective_date_end_numbers == undefined){
    effective_date_end_numbers = '';
  }//Close else if 

  //Datepicker Service Start
  var service_start = '#service-start' + i;
  var service_date_start_numbers = jQuery(service_start).val();
  if(service_date_start_numbers != '' ){
    service_date_start_numbers = new Date(service_date_start_numbers); //Full time standard
    service_date_start_numbers = service_date_start_numbers.toISOString(); //ISO format
    var date3 = new Date(service_date_start_numbers);
    var year3:any = date3.getFullYear();
    var month3:any = date3.getMonth()+1;
    var dt3:any = date3.getDate();

    if (dt3 < 10) {dt3 = '0' + dt3;}
    if (month3 < 10) {month3 = '0' + month3;}
    service_date_start_numbers = year3+'-' + month3 + '-'+dt3; 
  } else if(service_date_start_numbers == '' || service_date_start_numbers == undefined){
    service_date_start_numbers = '';
  }//Close else if 

  //Datepicker Service End
  var service_end = '#service-end' + i;
  var service_date_end_numbers = jQuery(service_end).val();
  if(service_date_end_numbers != '' ){   
    service_date_end_numbers = new Date(service_date_end_numbers); //Full time standard
    service_date_end_numbers = service_date_end_numbers.toISOString(); //ISO format
    var date4 = new Date(service_date_end_numbers);
    var year4:any = date4.getFullYear();
    var month4:any = date4.getMonth()+1;
    var dt4:any = date4.getDate();

    if (dt4 < 10) {dt4 = '0' + dt4;}
    if (month4 < 10) {month4 = '0' + month4;}
    service_date_end_numbers = year4+'-' + month4 + '-'+dt4; 
  }else if(service_date_end_numbers == '' || service_date_end_numbers == undefined){
    service_date_end_numbers = '';
  }//Close else if

  //Service Type
  var hotel_apply_or_not_apply; //Hotels
  if(this.hotels[i] == 'add'){
    hotel_apply_or_not_apply = this.hotels_array_apply[i];
  }
  else if(this.hotels[i] == 'remove'){
    hotel_apply_or_not_apply = this.hotels_array_not_apply[i];
  }

  var attraction_apply_or_not_apply; //Attractions
  if(this.attractions[i] == 'add'){
    attraction_apply_or_not_apply = this.attractions_array_apply[i];
  }
  else if(this.attractions[i] == 'remove'){
    attraction_apply_or_not_apply = this.attractions_array_not_apply[i];
  }

  var transfer_apply_or_not_apply; //Transfers
  if(this.transfers[i] == 'add'){
    transfer_apply_or_not_apply = this.transfers_array_apply[i];
  }
  else if(this.transfers[i] == 'remove'){
    transfer_apply_or_not_apply = this.transfers_array_not_apply[i];
  }

  var car_apply_or_not_apply; //Cars
  if(this.cars[i] == 'add'){
    car_apply_or_not_apply = this.cars_array_apply[i];
  }
  else if(this.cars[i] == 'remove'){
    car_apply_or_not_apply = this.cars_array_not_apply[i];
  }

  var cruise_apply_or_not_apply; //Cruises
  if(this.cruises[i] == 'add'){
    cruise_apply_or_not_apply = this.cruises_array_apply[i];
  }
  else if(this.cruises[i] == 'remove'){
    cruise_apply_or_not_apply = this.cruises_array_not_apply[i];
  }

  var flight_apply_or_not_apply; //Flights
  if(this.flights[i] == 'add'){
    flight_apply_or_not_apply = this.flights_array_apply[i];
  }
  else if(this.flights[i] == 'remove'){
    flight_apply_or_not_apply = this.flights_array_not_apply[i];
  }

  var package_apply_or_not_apply; //Packages
  if(this.packages[i] == 'add'){
    package_apply_or_not_apply = this.packages_array_apply[i];
  }
  else if(this.packages[i] == 'remove'){
    package_apply_or_not_apply = this.packages_array_not_apply[i];
  }

  var insurance_apply_or_not_apply; //Insurances
  if(this.insurances[i] == 'add'){
    insurance_apply_or_not_apply = this.insurances_array_apply[i];
  }
  else if(this.insurances[i] == 'remove'){
    insurance_apply_or_not_apply = this.insurances_array_not_apply[i];
  }

  //Agencies
  var agency_apply_or_not_apply; 
  if(this.agencies[i] == 'add'){
    agency_apply_or_not_apply = this.agencies_array_apply[i];
  }
  else if(this.agencies[i] == 'remove'){
    agency_apply_or_not_apply = this.agencies_array_not_apply[i];
  }

  //External Providers
  var ext_prov_apply_or_not_apply; 
  if(this.external_providers[i] == 'add'){
    ext_prov_apply_or_not_apply = this.ext_prov_array_apply[i];
  }
  else if(this.external_providers[i] == 'remove'){
    ext_prov_apply_or_not_apply = this.ext_prov_array_not_apply[i];
  }

  //Internal Providers
  var int_prov_apply_or_not_apply; 
  if(this.internal_providers[i] == 'add'){
    int_prov_apply_or_not_apply = this.int_prov_array_apply[i];
  }
  else if(this.internal_providers[i] == 'remove'){
    int_prov_apply_or_not_apply = this.int_prov_array_not_apply[i];
  }

  //Destinations
  var destination_apply_or_not_apply; 
  if(this.destinations[i] == 'add'){
    destination_apply_or_not_apply = this.destination_array_apply[i];
  }
  else if(this.destinations[i] == 'remove'){
    destination_apply_or_not_apply = this.destination_array_not_apply[i];
  }

  this.load.show_loading_gif(); //Loading gif
  let url = myGlobals.host+'/api/admin/settings/price_rule/save';
  let body = JSON.stringify({
    "price_rule": {
      "effective_date_start": effective_date_start_numbers,
      "effective_date_end": effective_date_end_numbers,
      "days_before_service_starts_from": this.days_before_service_starts_from_edit[i],
      "days_before_service_starts_to": this.days_before_service_starts_to_edit[i],
      "service_date_start": service_date_start_numbers,
      "service_date_end": service_date_end_numbers,
      "rule_type": this.rule_type[i],
      "agencies": {
        "element_codes": agency_apply_or_not_apply,
        "all_add_remove": this.agencies[i] 
      },
      "external_providers": {
        "element_codes": ext_prov_apply_or_not_apply,  
        "all_add_remove": this.external_providers[i]
      },
      "internal_providers": {
        "element_codes": int_prov_apply_or_not_apply,
        "all_add_remove": this.internal_providers[i]
      },
      "destinations": {
        "element_codes_and_types": destination_apply_or_not_apply,
        "all_add_remove": this.destinations[i]
      },
      "services": {
        "all": this.services_button_all_types[i],
        "service_type": this.store_name_icons_type_service[i],
        "all_add_remove": this.services_all_add_remove[i],
        "element_codes_and_types": 
          hotel_apply_or_not_apply,
          attraction_apply_or_not_apply,
          transfer_apply_or_not_apply,
          car_apply_or_not_apply,
          cruise_apply_or_not_apply,
          flight_apply_or_not_apply,
          package_apply_or_not_apply,
          insurance_apply_or_not_apply
      },

      "currency_default_symbol": this.currency_default_symbol[i],
      "amount_start": this.amount_start_edit[i], 
      "amount_end": this.amount_end_edit[i], 
      "amount": this.amount_edit[i], 
      "amount_type": this.amount_type[i],
      "amount_symbol": this.currency_code[i],
      "code": this.price_rule_code_row[i],
      "name": this.rule_name_edit[i]
    },
    "send_mail": false
  });

  console.log('body EDIT SECTION PRICE RULES: ' + body);
  let headers = new Headers({ 'Content-Type': 'application/json'});

  if(this.state_validate_auto_price_exist == true){    

      this.http.post(url, body, {headers: headers, withCredentials:true})
        .subscribe(
          response => {
            console.log('RESPONSE EDIT PRICE RULES: ' + JSON.stringify(response.json()));
            this.updated_form_price_rules[i] = response.json().updated;
            if (this.updated_form_price_rules[i] == true){
               this.load.hide_loading_gif(); //Remove loading gif  
                //this.after_save_form_price_rules(i, this.first_name_new[i], this.middle_name_new[i], this.last_name_new[i], this.email_user_new[i], this.office_phone_new[i], this.mobile_phone_new[i], this.address_user_new[i], this.city_code_user[i], this.zip_user_new[i], this.password_new[i], this.agency_code[i], this.is_admin[i], this.is_comissionable_new[i], this.user_access_new[i], this.never_disable_new[i], this.language_new[i]);

                jQuery('#success-alert-price-rules' + i).fadeIn('slow'); //Show message success
                setTimeout(() => {
                  jQuery('#success-alert-price-rules' + i).animate({opacity: 0}, 1000).animate({height: "0px", padding: "0px"}, 1000); //Hide message success

                    setTimeout(() => {
                      this.updated_form_price_rules[i] = false; //Hide message success
                        setTimeout(() => {
                          this.remove_class[i] = true; //Close Price Rules Exist form
                          if(i == 99){
                            jQuery('#new-pricerules-button').trigger("click"); //Close form New Price Rules
                          }
                          this._service.get_price_rules(this._service.search_price_rules,{ page : this._service.current_page}).subscribe();                            
                         }, 1000);
                    }, 1700);
                }, 4000);
            } else {
              this.load.hide_loading_gif(); //Remove loading gif
              this.exist_error_price_rules_save = response.json().error_data.exist_error; //Specific message
              this.general_error_price_rules_save = response.json().error_data.general_error;
              console.log('Error general: ' + JSON.stringify(this.general_error_price_rules_save));
              console.log('Error específico: ' + JSON.stringify(this.exist_error_price_rules_save));
              if(this.general_error_price_rules_save != ''){
                //Show generic error in HTML with ngIf in general_error_price_rules_save
              } else if(this.exist_error_price_rules_save == true){
                var error_field = response.json().error_data.error_field_list;
                for(var m = 0; m<error_field.length; m++){
                  this.field_error_price_rules =  response.json().error_data.error_field_list[m].field;

                if(this.field_error_price_rules == 'name'){
                    this.only_error[i] = true;
                    //Error Message for Rule Name if update fails from backend
                    this.message_name = response.json().error_data.error_field_list[m].message;
                    jQuery('#rule-name' + i).addClass('border-errors');
                    console.log('rule-name: ' + this.message_name);
                  }
                  if(this.field_error_price_rules == 'effective_date_start'){
                    this.only_error[i] = true;
                    //Error Message for Datepicker Effective date start if update fails from backend
                    this.message_effective_date_start = response.json().error_data.error_field_list[m].message;
                    jQuery('#effective-start' + i).addClass('border-errors');
                    console.log('Effective date start: ' + this.message_effective_date_start);
                  }
                  if(this.field_error_price_rules == 'effective_date_end'){
                    this.only_error[i] = true;
                    //Error Message for Datepicker Effective date End if update fails from backend
                    this.message_effective_date_end = response.json().error_data.error_field_list[m].message;
                    jQuery('#effective-end' + i).addClass('border-errors');
                    console.log('Effective date End: ' + this.message_effective_date_end);
                  }
                  if(this.field_error_price_rules == 'amount_start'){ //Section Price Range
                    //Error Message for field Amount Start if update fails from backend
                    this.message_amount_start = response.json().error_data.error_field_list[m].message;
                    jQuery('#new-price-range-start' + i).addClass('border-errors');
                    console.log('Amount Start: ' + this.message_amount_start);
                  } 
                  if(this.field_error_price_rules == 'amount_end'){ //Section Price Range
                     this.only_error[i] = true;
                    //Error Message for field Amount End if update fails from backend
                    this.message_amount_end = response.json().error_data.error_field_list[m].message;
                    jQuery('#new-price-range-end' + i).addClass('border-errors');
                    console.log('Amount End: ' + this.message_amount_end);
                  }
                  if(this.field_error_price_rules == 'days_before_service_starts_to'){ 
                     this.only_error[i] = true;
                    //Error Message for field Days Before To if update fails from backend
                    this.message_days_before_to = response.json().error_data.error_field_list[m].message;
                    jQuery('#days-to' + i).addClass('border-errors');
                    console.log('Days Before To: ' + this.message_days_before_to);
                  }
                  if(this.field_error_price_rules == 'service_date_start'){
                    this.only_error[i] = true;
                    //Error Message for Datepicker Service date start if update fails from backend
                    this.message_service_date_start = response.json().error_data.error_field_list[m].message;
                    jQuery('#service-start' + i).addClass('border-errors');
                    console.log('Service date start: ' + this.message_service_date_start);
                  }
                  if(this.field_error_price_rules == 'service_date_end'){
                    this.only_error[i] = true;
                    //Error Message for Datepicker Service date end if update fails from backend
                    this.message_service_date_end = response.json().error_data.error_field_list[m].message;
                    jQuery('#service-end' + i).addClass('border-errors');
                    console.log('Service date End: ' + this.message_service_date_end);
                  }
                  if(this.field_error_price_rules == 'amount'){
                    this.only_error[i] = true;
                    //Error Message for field Amount if update fails from backend
                    this.message_amount = response.json().error_data.error_field_list[m].message;
                    jQuery('#new-amount' + i).addClass('border-errors');
                    console.log('Amount: ' + this.message_amount);
                  }
                  //All Autocompletes: Message from Back-End 
                  /*if(this.field_error_price_rules == 'city'){ 
                    //Error Message for All Autocompletes if update fails from backend
                    this.message_autocompletes[i] = response.json().error_data.error_field_list[m].message;
                    jQuery('#agency-user' + i).addClass('border-errors');
                    console.log('Autocompletes: ' + this.message_autocompletes[i]);
                  }*/                
                }
              }
              //If there is error scroll to alert error element  
              var go_to_element_position = $('body').scrollTop() + $('#scrollToError'+ i).offset().top - $('#scrollToError'+ i).height();             
              $("body").animate({scrollTop: go_to_element_position}, 1500, 'swing'); //Scroll to top after get error on save 
            }
          }, error => {}
      );
    } else {
      this.load.hide_loading_gif(); //Remove loading gif
      this.field_error_price_rules = 'invalidPriceRules';
      this.length_of_filteredList = [];
      jQuery('#agency-user' + i).addClass('border-errors');
    } //Close if
  } //Close save_form_price_rules

  /////////////////////////////////////////////////
  /// UPDATED AFTER SAVE form PRICE RULES EXIST ///
  /*after_save_form_price_rules(i, first_name, middle_name, last_name, email, office_phone, mobile_phone, address, city_code, zip, password, agency_code, is_admin, is_comissionable, user_access, never_disable, language){
    this.load.hide_loading_gif(); //Remove loading gif
  }*/

  //////////////////////////////////////////////////
  /// Click Button Cancel/close Form Price Rules ///
  cancel_edit_price_rules(i){
    if(i != 99){
      this.rule_name_edit[i] = this.rule_name[i];
      this.amount_start_edit[i] = this.amount_start[i];
      this.amount_end_edit[i] = this.amount_end[i];
      this.days_before_service_starts_from_edit[i] = this.days_before_service_starts_from[i];
      this.days_before_service_starts_to_edit[i] = this.days_before_service_starts_to[i];
      this.amount_edit[i] = this.amount[i];

      //Cancel All Radio buttons
      //Service Type Hotel
      this.hotels[i] = [];
      this.hotels_array_apply[i] = [];
      this.apply_not_apply_hotels[i] = [];
      this.hotels_array_not_apply[i] = [];

      //Service Type Attraction
      this.attractions[i] = [];
      this.attractions_array_apply[i] = [];
      this.apply_not_apply_attractions[i] = [];
      this.attractions_array_not_apply[i] = [];

      //Service Type Transfer     
      this.transfers[i] = [];
      this.transfers_array_apply[i] = [];
      this.apply_not_apply_transfers[i] = [];
      this.transfers_array_not_apply[i] = [];

      //Service Type Car    
      this.cars[i] = []; 
      this.cars_array_apply[i] = [];
      this.apply_not_apply_cars[i] = [];
      this.cars_array_not_apply[i] = [];

      //Service Type Cruise       
      this.cruises[i] = []; 
      this.cruises_array_apply[i] = [];
      this.apply_not_apply_cruises[i] = [];
      this.cruises_array_not_apply[i] = [];

      //Service Type Flight        
      this.flights[i] = []; 
      this.flights_array_apply[i] = [];
      this.apply_not_apply_flights[i] = [];
      this.flights_array_not_apply[i] = [];

      //Service Type Package     
      this.packages[i] = [];  
      this.packages_array_apply[i] = [];
      this.apply_not_apply_packages[i] = [];
      this.packages_array_not_apply[i] = [];

      //Service Type Insurance     
      this.insurances[i] = [];
      this.insurances_array_apply[i] = [];
      this.apply_not_apply_insurances[i] = [];
      this.insurances_array_not_apply[i] = [];

      //Agencies
      this.agencies_array_apply[i] = [];
      this.agencies_array_not_apply[i] = [];
      this.apply_not_apply_agencies[i] = [];

      //Internal Providers
      this.int_prov_array_apply[i] = [];
      this.int_prov_array_not_apply[i] = [];
      this.apply_not_apply_int_prov[i] = [];

      //External Providers
      this.ext_prov_array_apply[i] = [];
      this.ext_prov_array_not_apply[i] = [];
      this.apply_not_apply_ext_prov[i]= [];

      //Destinations
      this.destination_array_apply[i] = [];
      this.destination_array_not_apply[i] = [];
      this.apply_not_apply_destination[i] = [];
      this.validation_amount[i] = true; //Clean Border error
      this.validation_price_range_start[i] = true; //Clean Border error
      this.validation_price_range_end[i] = true; //Clean Border error
      this.remove_class[i] = true; //Close Form Price Rules Edit
      this.get_data_price_rules(this.price_rule_code, i); //Call request again

      /////////////////////////////////////////////////////
      /// Empty messages and border errors after cancel ///
      this.message_name = '';
      this.general_error_price_rules_save = '';
      this.only_error[i] = false;
      jQuery('#rule-name' + i).removeClass('border-errors');

      this.message_effective_date_start = '';
      jQuery('#effective-start' + i).removeClass('border-errors');

      this.message_effective_date_end = '';
      jQuery('#effective-end' + i).removeClass('border-errors');

      this.message_amount_start = '';
      jQuery('#new-price-range-start' + i).removeClass('border-errors');

      this.message_amount_end = '';
      jQuery('#new-price-range-end' + i).removeClass('border-errors');

      this.message_service_date_start = '';
      jQuery('#service-start' + i).removeClass('border-errors');

      this.message_service_date_end = '';
      jQuery('#service-end' + i).removeClass('border-errors');

      this.message_amount = '';
      jQuery('#new-amount' + i).removeClass('border-errors');
    } else if(i == 99){
      this.set_new_price_rules();
      jQuery('#new-pricerules-button').trigger("click"); //Close form New Price Rules
    } //Close If

  }//Close cancel_edit_price_rules

  remove_data(title){
    this.eraser = title;
    this.eraserChange.next(this.eraser); //Send update to suscriber
  }

  open_new_detail(){
    this.emptyObject.next(''); //Send update to suscriber
    this.set_new_price_rules();
  }

} //Close class editUserDetail



