import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter,Input,  ElementRef, OnInit,OnChanges,SimpleChange, SimpleChanges, NgZone , ViewChild , OnDestroy} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {Idle, DEFAULT_INTERRUPTSOURCES} from 'ng2-idle/core'; //For timeout
import {DialogRef} from 'angular2-modal';
import myGlobals = require('../../../../../app');
import {RolloverAutocompletes} from '../../../../customers/rollovers-dropdown.service';
import {Observable} from 'rxjs/Observable';
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NgClass} from '@angular/common';
import {Modal, BS_MODAL_PROVIDERS as MODAL_P} from 'angular2-modal/plugins/bootstrap'; //Modal
import {Location} from '@angular/common';
//import {DataPropertiesPriceRules} from './data_properties.service';
import {editPriceRules} from '../inline-price-rules/edit_price_rules.service'; //Inline Editing Price rules

declare var jQuery: any;
declare var $: any;

/////////////////////////////////
/// Price Rules Autocompletes ///
@Component({
  selector: 'autocomplete-subcomponent',
  template: require('./autocomplete-subcomponent.html'),
  directives: [ROUTER_DIRECTIVES],
  providers: [MODAL_P],
  styles: [require('./autocomplete-subcomponent.scss')]
})

export class Autocomplete {

    //Request Autocomplete City field (Users)
    i_user: any;
    remove_class = [];
    list_of_name_autocomplete = [];
    list_of_codes_autocomplete = [];
    list_of_types_autocomplete = [];
    relation_name_autocomplete = []; //Autocomplete field agency User Exist
    agency_auto_code_user :any;
    autocomplete_name: string="";
    is_selected = true; //Verify if user select autocomplete option
    agency_code = [];
    list_auto: any;
    filteredListAutocomplete = []; //Form Price Rules
    length_of_filteredList : any;
    disabled_autocomplete: boolean;
    //length_of_filteredListAgencyNewUser: any; //New User
    //length_of_filteredListNewUser: any; //Length of filtered list of autocomplete city New User
    //filteredListAgencyNewUser = []; //Form new User
    state_validate_agency_user_exist = true; //Form User Exist
    //state_validate_agency_new_user = true; //Form New User field City 

    //Request Autocomplete City field (New Users)
    //relation_name_new_user_agency: any; //Autocomplete field agency New User
    //agency_auto_code_new_user = ''; //Code selected of agency field on autocomplete
    create_agency_user = []; //Form create New Agency User Exist
    //create_agency_new_user: boolean = false; //Form create New Agency User Exist

    //Errors Message autocomplete
    only_error = []; //Show error only in edited user exist
    //only_error_new: any; //Show error only in edited new user

    general_error_autocompletes: string=''; //Request autocomplete
    general_error_auto_hotels: string=''; //Request autocomplete
    general_error_auto_attractions: string='';
    general_error_auto_transfers: string=''; //No tiene Autocomplete
    general_error_auto_cars: string='';
    general_error_auto_cruises: string=''; //No tiene Autocomplete
    general_error_auto_fligths: string='';
    general_error_auto_packages: string='';
    general_error_auto_insurances: string=''; //No tiene Autocomplete
    general_error_auto_agencies: string=''; 
    general_error_auto_int_prov: string='';
    general_error_auto_ext_prov: string='';
    general_error_auto_destinations: string='';
    //general_error_autocompletes_new_user: string=''; //Request autocomplete AgencNew User
    exist_error_autocompletes: any; //Request error specific error Save
    field_agency: string=''; //Request autocomplete
    field_agency_user= []; //Request autocomplete
    message_agency: string=''; //Request autocomplete
    message_agency_user = [];  //Message specific error to field City

    //Specific errors Autocompletes
    specific_error_hotels: string='';
    specific_error_attractions: string;
    specific_error_transfers: string;
    specific_error_cars: string;
    specific_error_cruises: string;
    specific_error_flights: string;
    specific_error_packages: string;
    specific_error_insurances: string;
    specific_error_agencies: string;
    specific_error_int_provider: string;
    specific_error_ext_provider: string;
    specific_error_destinations: string;

    //Specific errors Form after Save
    field_error_agency: any; //Field specific error Save to field City
    message_agency_save: string=''; //Message specific error After Save to field City
    //message_agency_new_user: string='';  //Message specific error to field City

    constructor(
        public http: Http, 
        public _rol: RolloverAutocompletes, 
        public _edit_price: editPriceRules
    ) {

        this._edit_price.eraserChange.subscribe((name_of_item_menu) => {  
            this.length_of_filteredList = '';        
            console.log('llegó: ' + name_of_item_menu);
            //this.showPagination = true;        
        });
    }

    @Input() value_of_input;
    @Input() indexer;
    @Input() pr_rules_type_request_data;
    @Input() get_error_from_parent;

    ngOnChanges() {
     this.get_error_from_parent = '';
     this.relation_name_autocomplete = [];
    }//Close ngOnChanges

    ngOnInit(){} //Close ngOnInit
   
    /////////////////////////////////////////////////////////////////////////////////////////////
    /// Request data list All Autocompletes ///
    get_list_autocompletes(autocomplete_name, handlerEvent, i, e) {
      this.i_user = i; //Store iteration because is not working inside request due scope
      this.list_of_name_autocomplete = []; //Clean array
      this.list_of_codes_autocomplete = []; //Clean array
      this.list_of_types_autocomplete = [];

      var url;
      var body;
      if(this.pr_rules_type_request_data == 'hotels'){ //Verify which Price Rules it is
          url = myGlobals.host + '/api/admin/hotel_autocomplete'; //Guardo la URL completa del Autocomplete correspondiente
          body=JSON.stringify({ hotel: autocomplete_name, autocomplete_items_count: 20 });
      }
      else if(this.pr_rules_type_request_data == 'attractions'){ //Verify which Price Rules it is
          url = myGlobals.host + '/api/admin/attraction_autocomplete'; //Guardo la URL completa del Autocomplete correspondiente
          body=JSON.stringify({ attraction: autocomplete_name, autocomplete_items_count: 20 });
      }
      else if(this.pr_rules_type_request_data == 'transfers'){ //Verify which Price Rules it is
          url = myGlobals.host + '/api/admin/transfer_autocomplete'; //Guardo la URL completa del Autocomplete correspondiente
          body=JSON.stringify({ transfer: autocomplete_name, autocomplete_items_count: 20 });
      }
      else if(this.pr_rules_type_request_data == 'cars'){ //Verify which Price Rules it is
          url = myGlobals.host + '/api/admin/car_agency_autocomplete'; //Guardo la URL completa del Autocomplete correspondiente
          body=JSON.stringify({ car_agency: autocomplete_name, autocomplete_items_count: 20 });
      }
      else if(this.pr_rules_type_request_data == 'cruises'){ //Verify which Price Rules it is
          url = myGlobals.host + '/api/admin/cruise_autocomplete'; //Guardo la URL completa del Autocomplete correspondiente
          body=JSON.stringify({ cruise: autocomplete_name, autocomplete_items_count: 20 });
      }
      else if(this.pr_rules_type_request_data == 'flights'){ //Verify which Price Rules it is
          url = myGlobals.host + '/api/admin/airline_autocomplete'; //Guardo la URL completa del Autocomplete correspondiente
          body=JSON.stringify({ airline: autocomplete_name, autocomplete_items_count: 20 });
      }
      else if(this.pr_rules_type_request_data == 'packages'){ //Verify which Price Rules it is
          url = myGlobals.host + '/api/admin/package_autocomplete'; //Guardo la URL completa del Autocomplete correspondiente
          body=JSON.stringify({ package: autocomplete_name, autocomplete_items_count: 20 });
      }
      else if(this.pr_rules_type_request_data == 'insurances'){ //Verify which Price Rules it is
          url = myGlobals.host + '/api/admin/insurance_autocomplete'; //Guardo la URL completa del Autocomplete correspondiente
          body=JSON.stringify({ insurance: autocomplete_name, autocomplete_items_count: 20 });
      }

      else if(this.pr_rules_type_request_data == 'agencies'){ //Verify which Price Rules it is
          url = myGlobals.host + '/api/admin/agency_autocomplete'; //Guardo la URL completa del Autocomplete correspondiente
          body=JSON.stringify({ agency: autocomplete_name, autocomplete_items_count: 20 });
      }
      else if(this.pr_rules_type_request_data == 'int_provider'){
          url = myGlobals.host + '/api/admin/internal_provider_autocomplete'; //Guardo la URL completa del Autocomplete correspondiente
          body=JSON.stringify({ internal_provider: autocomplete_name, autocomplete_items_count: 20 });
      }
      else if(this.pr_rules_type_request_data == 'ext_provider'){
          url = myGlobals.host + '/api/admin/external_provider_autocomplete'; //Guardo la URL completa del Autocomplete correspondiente
          body=JSON.stringify({ external_provider: autocomplete_name, autocomplete_items_count: 20 });
      }
      else if(this.pr_rules_type_request_data == 'destination'){
          url = myGlobals.host + '/api/admin/destination_autocomplete'; //Guardo la URL completa del Autocomplete correspondiente
          body=JSON.stringify({ destination: autocomplete_name, autocomplete_items_count: 20 });
      }
           
      console.log('Body del request del Autocompletes: ' + body);
      let headers = new Headers({ 'Content-Type': 'application/json' });
          this.http.post( url, body, {headers: headers, withCredentials:true})
            .subscribe(
              response => {
                console.log('RESPUESTA AUTOCOMPLETE(PRICE RULES): ' + JSON.stringify(response.json()));
                this.general_error_autocompletes = response.json().error_data.general_error; 

                if(this.pr_rules_type_request_data == 'hotels'){ //Verify which Price Rules it is                 
                    this.list_auto = response.json().hotel_list; //Guardo la URL completa del listado correspondiente
                    this.general_error_auto_hotels = response.json().error_data.general_error; //Error Price Rules exist
                     console.log(' this.general_error_auto_hotels: ' + JSON.stringify(this.general_error_auto_hotels));
                }
                else if(this.pr_rules_type_request_data == 'attractions'){ //Verify which Price Rules it is                 
                    this.list_auto = response.json().attraction_list; //Guardo la URL completa del listado correspondiente
                    this.general_error_auto_attractions = response.json().error_data.general_error; 
                }
                else if(this.pr_rules_type_request_data == 'transfers'){ //Verify which Price Rules it is                 
                    this.list_auto = response.json().transfer_list; //Guardo la URL completa del listado correspondiente
                    this.general_error_auto_transfers = response.json().error_data.general_error; 
                }
                else if(this.pr_rules_type_request_data == 'cars'){ //Verify which Price Rules it is                 
                    this.list_auto = response.json().car_agency_list; //Guardo la URL completa del listado correspondiente
                    this.general_error_auto_cars = response.json().error_data.general_error; 
                }
                else if(this.pr_rules_type_request_data == 'cruises'){ //Verify which Price Rules it is                 
                    this.list_auto = response.json().cruise_list; //Guardo la URL completa del listado correspondiente
                    this.general_error_auto_cruises = response.json().error_data.general_error; //Error User exist
                }
                else if(this.pr_rules_type_request_data == 'flights'){ //Verify which Price Rules it is                 
                    this.list_auto = response.json().airline_list; //Guardo la URL completa del listado correspondiente
                    this.general_error_auto_fligths = response.json().error_data.general_error; 
                }
                else if(this.pr_rules_type_request_data == 'packages'){ //Verify which Price Rules it is                 
                    this.list_auto = response.json().package_list; //Guardo la URL completa del listado correspondiente
                    this.general_error_auto_packages = response.json().error_data.general_error; 
                }
                else if(this.pr_rules_type_request_data == 'insurances'){ //Verify which Price Rules it is                 
                    this.list_auto = response.json().insurance_list; //Guardo la URL completa del listado correspondiente
                    this.general_error_auto_insurances = response.json().error_data.general_error; 
                }

                else if(this.pr_rules_type_request_data == 'agencies'){ //Verify which Price Rules it is                 
                    this.list_auto = response.json().agency_list; //Guardo la URL completa del listado correspondiente
                    this.general_error_auto_agencies = response.json().error_data.general_error; 
                }
                else if(this.pr_rules_type_request_data == 'int_provider'){ //Verify which Price Rules it is                  
                    this.list_auto = response.json().internal_provider_list; //Guardo la URL completa del listado correspondiente
                    this.general_error_auto_int_prov = response.json().error_data.general_error; 
                }
                else if(this.pr_rules_type_request_data == 'ext_provider'){ //Verify which Price Rules it is                 
                    this.list_auto = response.json().external_provider_list; //Guardo la URL completa del listado correspondiente
                    this.general_error_auto_ext_prov = response.json().error_data.general_error; 
                }
                else if(this.pr_rules_type_request_data == 'destination'){ //Verify which Price Rules it is                 
                    this.list_auto = response.json().destination_list; //Guardo la URL completa del listado correspondiente
                    this.general_error_auto_destinations = response.json().error_data.general_error; 
                }
                
                //if(handlerEvent == 'users'){
                  
                //}
                //else if(handlerEvent == 'new-user'){
                //  this.general_error_autocompletes_new_user = response.json().error_data.general_error; //Error New User 
                //}
                
                this.get_error_from_parent = response.json().error_data.exist_error;
                if(this.general_error_auto_hotels != '' || this.general_error_auto_attractions != '' || this.general_error_auto_transfers != '' || this.general_error_auto_cars != '' || this.general_error_auto_cruises != '' || this.general_error_auto_fligths != '' || this.general_error_auto_packages != '' || this.general_error_auto_insurances != '' || this.general_error_auto_agencies != '' || this.general_error_auto_int_prov != '' || this.general_error_auto_ext_prov != '' || this.general_error_auto_destinations != ''){
                  console.log('Error general: ' + JSON.stringify(this.general_error_auto_hotels));
                  //Show generic error in HTML with ngIf in general_error_autocompletes
                } 
                if(this.get_error_from_parent == true){
                  //for(var l=0; l<response.json().error_data.error_field_list.length; l++){
                      if(this.pr_rules_type_request_data == 'hotels'){ //Verify which Price Rules it is
                          this.specific_error_hotels = 'hotels'; 
                          console.log(' this.specific_error_hotels: ' + JSON.stringify(this.general_error_auto_hotels));
                          //var hotel_men = response.json().error_data.error_field_list[l].field;
                      }
                      else if(this.pr_rules_type_request_data == 'attractions'){ //Verify which Price Rules it is
                          this.specific_error_attractions = 'attractions'; 
                          //var attraction_men = response.json().error_data.error_field_list[l].field;
                      }
                      else if(this.pr_rules_type_request_data == 'transfers'){ //Verify which Price Rules it is
                          this.specific_error_transfers = 'transfers'; 
                         // var transfer_men = response.json().error_data.error_field_list[l].field;
                      }
                      else if(this.pr_rules_type_request_data == 'cars'){ //Verify which Price Rules it is
                          this.specific_error_cars = 'cars'; 
                          //var car_men = response.json().error_data.error_field_list[l].field;
                      }
                      else if(this.pr_rules_type_request_data == 'cruises'){ //Verify which Price Rules it is
                          this.specific_error_cruises = 'cruises'; 
                          //var cruise_men = response.json().error_data.error_field_list[l].field;
                      }
                      else if(this.pr_rules_type_request_data == 'flights'){ //Verify which Price Rules it is
                          this.specific_error_flights = 'flights'; 
                          //var flight_men = response.json().error_data.error_field_list[l].field;
                      }
                      else if(this.pr_rules_type_request_data == 'packages'){ //Verify which Price Rules it is
                          this.specific_error_packages = 'packages';
                          //var package_men = response.json().error_data.error_field_list[l].field;
                      }
                      else if(this.pr_rules_type_request_data == 'insurances'){ //Verify which Price Rules it is
                          this.specific_error_insurances = 'insurances';
                          //var insurance_men = response.json().error_data.error_field_list[l].field;
                      }

                      else if(this.pr_rules_type_request_data == 'agencies'){ //Verify which Price Rules it is
                          this.specific_error_agencies = 'agencies';
                          //var agency_men = response.json().error_data.error_field_list[l].field;
                      }
                      else if(this.pr_rules_type_request_data == 'int_provider'){ //Verify which Price Rules it is
                          this.specific_error_int_provider = 'int_provider';
                          //var int_prov_men = response.json().error_data.error_field_list[l].field;
                      }
                      else if(this.pr_rules_type_request_data == 'ext_provider'){ //Verify which Price Rules it is
                          this.specific_error_ext_provider = 'ext_provider';
                         // var ext_prov_men = response.json().error_data.error_field_list[l].field;
                      }
                      else if(this.pr_rules_type_request_data == 'destination'){ //Verify which Price Rules it is
                          this.specific_error_destinations = 'destination';
                          //var destination = response.json().error_data.error_field_list[l].field;
                      }
                  //}
                    this.filteredListAutocomplete = []; //Clean list of Autocomplete
                   // this.filteredListAgencyNewUser = []; //Clean list of Agency New User
                } else {
                  //Autocomplete: Service Type: Hotels
                  if(this.pr_rules_type_request_data == 'hotels'){ //Verify which Price Rules it is
                      for(var i=0; i < response.json().hotel_list.length; i++) {                         
                          this.list_of_codes_autocomplete[i] = response.json().hotel_list[i].code;
                          this.list_of_name_autocomplete[i] = response.json().hotel_list[i].name;
                          this.list_of_types_autocomplete[i] = 'NO';                     
                      }
                   }

                   //Autocomplete: Service Type: Hotels
                   if(this.pr_rules_type_request_data == 'attractions'){ //Verify which Price Rules it is
                      for(var i=0; i < response.json().attraction_list.length; i++) {                         
                          this.list_of_codes_autocomplete[i] = response.json().attraction_list[i].code;
                          this.list_of_name_autocomplete[i] = response.json().attraction_list[i].name;  
                          this.list_of_types_autocomplete[i] = 'NO';                          
                      }
                   }

                   //Autocomplete: Service Type: Transfers
                   if(this.pr_rules_type_request_data == 'transfers'){ //Verify which Price Rules it is
                      for(var i=0; i < response.json().transfer_list.length; i++) {                         
                          this.list_of_codes_autocomplete[i] = response.json().transfer_list[i].code;
                          this.list_of_name_autocomplete[i] = response.json().transfer_list[i].name;
                          this.list_of_types_autocomplete[i] = 'NO';                            
                      }
                   }

                   //Autocomplete: Service Type: Cars
                   if(this.pr_rules_type_request_data == 'cars'){ //Verify which Price Rules it is
                      for(var i=0; i < response.json().car_agency_list.length; i++) {                         
                          this.list_of_codes_autocomplete[i] = response.json().car_agency_list[i].code;
                          this.list_of_name_autocomplete[i] = response.json().car_agency_list[i].name; 
                          this.list_of_types_autocomplete[i] = 'NO';                           
                      }
                   }

                   //Autocomplete: Service Type: Cruises
                   if(this.pr_rules_type_request_data == 'cruises'){ //Verify which Price Rules it is
                      for(var i=0; i < response.json().cruise_list.length; i++) {                         
                          this.list_of_codes_autocomplete[i] = response.json().cruise_list[i].code;
                          this.list_of_name_autocomplete[i] = response.json().cruise_list[i].name;  
                          this.list_of_types_autocomplete[i] = 'NO';                          
                      }
                   }

                   //Autocomplete: Service Type: Flights
                   if(this.pr_rules_type_request_data == 'flights'){ //Verify which Price Rules it is
                      for(var i=0; i < response.json().flight_list.length; i++) {                         
                          this.list_of_codes_autocomplete[i] = response.json().flight_list[i].code;
                          this.list_of_name_autocomplete[i] = response.json().flight_list[i].name; 
                          this.list_of_types_autocomplete[i] = 'NO';                           
                      }
                   }

                   //Autocomplete: Service Type: Packages
                   if(this.pr_rules_type_request_data == 'packages'){ //Verify which Price Rules it is
                      for(var i=0; i < response.json().package_list.length; i++) {                         
                          this.list_of_codes_autocomplete[i] = response.json().package_list[i].code;
                          this.list_of_name_autocomplete[i] = response.json().package_list[i].name;   
                          this.list_of_types_autocomplete[i] = 'NO';                         
                      }
                   }

                   //Autocomplete: Service Type: Insurances
                   if(this.pr_rules_type_request_data == 'insurances'){ //Verify which Price Rules it is
                      for(var i=0; i < response.json().insurance_list.length; i++) {                         
                          this.list_of_codes_autocomplete[i] = response.json().insurance_list[i].code;
                          this.list_of_name_autocomplete[i] = response.json().insurance_list[i].name;  
                          this.list_of_types_autocomplete[i] = 'NO';                          
                      }
                   }

                  //Autocomplete: Agencies
                  if(this.pr_rules_type_request_data == 'agencies'){ //Verify which Price Rules it is
                      for(var i=0; i < response.json().agency_list.length; i++) {                         
                          this.list_of_codes_autocomplete[i] = response.json().agency_list[i].code;
                          this.list_of_name_autocomplete[i] = response.json().agency_list[i].name;   
                          this.list_of_types_autocomplete[i] = 'NO';                         
                      }
                    }

                  //Autocomplete: Internal Provider   
                  if(this.pr_rules_type_request_data == 'int_provider'){ //Verify which Price Rules it is
                    for(var i=0; i < response.json().internal_provider_list.length; i++) {                        
                        this.list_of_codes_autocomplete[i] = response.json().internal_provider_list[i].code;
                        this.list_of_name_autocomplete[i] = response.json().internal_provider_list[i].name;  
                        this.list_of_types_autocomplete[i] = 'NO';                          
                      }
                  }

                  //Autocomplete: External Provider   
                  if(this.pr_rules_type_request_data == 'ext_provider'){ //Verify which Price Rules it is
                      for(var i=0; i < response.json().external_provider_list.length; i++) {                        
                        this.list_of_codes_autocomplete[i] = response.json().external_provider_list[i].code;
                        this.list_of_name_autocomplete[i] = response.json().external_provider_list[i].name; 
                        this.list_of_types_autocomplete[i] = 'NO';                           
                      }
                   }

                   //Autocomplete: Destinations 
                  if(this.pr_rules_type_request_data == 'destination'){ //Verify which Price Rules it is
                      for(var i=0; i < response.json().destination_list.length; i++) {
                      this.list_of_name_autocomplete[i] = response.json().destination_list[i].type;                         
                        this.list_of_codes_autocomplete[i] = response.json().destination_list[i].code;
                        this.list_of_name_autocomplete[i] = response.json().destination_list[i].name; 
                        this.list_of_types_autocomplete[i] = response.json().destination_list[i].type;                     
                      }
                   }
                   
                  //Filter list Autocomplete 
                  console.log('Autocomplete name: ' + JSON.stringify(this.autocomplete_name));
                                     
                  this.filteredListAutocomplete = this.list_of_name_autocomplete;
                  this.length_of_filteredList = this.list_of_name_autocomplete.length; //Get length of list of agency
                  console.log('Verificar array field agency: ' + JSON.stringify(this.filteredListAutocomplete));
                  console.log('length_of_filteredList: ' + JSON.stringify(this.length_of_filteredList));
                        
                   /*case 'new-user':
                     this.filteredListAgencyNewUser = this.list_of_name_autocomplete;
                     this.length_of_filteredListAgencyNewUser = this.list_of_name_autocomplete.length; //Get length of list of Agency
                     console.log('Verificar array field field Agency New user: ' + this.filteredListAgencyNewUser); */
                  //End switch
                  console.log('lista de códigos del Autocomplete:' + this.list_of_codes_autocomplete); 
                }
              }, error => {}
          );
      }

    /////////////////////////////////////////////////////////////////////
    /// Implementation Autocomplete for field Agency with event click ///
    filter_auto_name_click(autocomplete_name, handlerEvent, i, e){
        if(this.pr_rules_type_request_data != 'transfers' && this.pr_rules_type_request_data != 'cruises' && this.pr_rules_type_request_data != 'insurances'){  
          e.preventDefault();
          this.field_error_agency = []; //Clean message
          this.message_agency_user = []; //Hide message User exist
          //this.message_agency_new_user = ''; //Hide message New User
          autocomplete_name = '';
          this.get_list_autocompletes(autocomplete_name, handlerEvent, i, e); //Call request function
          //jQuery('#agency-user' + i).removeClass('border-errors'); //User exist
          //jQuery('#agency-user-new').removeClass('border-errors'); //New User
        }else {
            this.disabled_autocomplete = false;
            jQuery('#'+ this.pr_rules_type_request_data + '-price' + this.indexer).attr("disabled", "disabled");
        }
    }

    /////////////////////////////////////////////////////////
    /// Implementation All Autocompletes with event keyup ///
    filter_auto_name(autocomplete_name, handlerEvent, i, e){
        if(this.pr_rules_type_request_data != 'transfers' && this.pr_rules_type_request_data != 'cruises' && this.pr_rules_type_request_data != 'insurances'){ 
          e.preventDefault();
          //Validation for field City
          var validate_agency = /[A-Za-z\s]/;
          //Form User Exist 
          if(handlerEvent == 'price_exist'){
            if(!validate_agency.test(this.relation_name_autocomplete[i])){ 
              this._edit_price.state_validate_auto_price_exist = false;  
            } else {
              this._edit_price.state_validate_auto_price_exist = true;
              this.agency_auto_code_user = 'error'; //If invalid character broke agency code
            }
         } else{
             this.disabled_autocomplete = false;
             jQuery('#'+ this.pr_rules_type_request_data + '-price' + this.indexer).attr("disabled", "disabled");
         }
      }

      //Form New User 
      //if(handlerEvent == 'new-user'){
      //  if(!validate_agency.test(this.relation_name_new_user_agency)){ 
       //   this.state_validate_agency_new_user = false;  
       // } else {
     //     this.state_validate_agency_new_user = true;
      //    this.agency_auto_code_new_user = 'error'; //If invalid character broke agency code
      //  }
      //}

      this.length_of_filteredList = ''; //Form User Exist field City
      //this.length_of_filteredListNewUser = ''; //Form New User field City
      this.get_list_autocompletes(autocomplete_name, handlerEvent, i, e); //Call request function
      this.message_agency_user = []; //Hide message User exist
      //this.message_agency_new_user = ''; //Hide message New User
      //jQuery('#agency-user' + i).removeClass('border-errors'); //User exist
      //jQuery('#agency-user-new').removeClass('border-errors'); //New User
      //console.log('filteredListAgencyNewUser del Keyup get data new user: ' + this.filteredListAgencyNewUser); 
      this.filteredListAutocomplete.length = 0; //Form User Exist field City
      //this.filteredListAgencyNewUser.length = 0; //Form New user field City
      //this.length_of_filteredListAgencyNewUser = ''; //Form New User field Agency
    }

    //Select field Agency
    select_agency(item, code, handlerEvent){
      this.agency_code = code;
     // switch(handlerEvent) {
       // case 'users':
          this.filteredListAutocomplete = [];
        //     break;
       // case 'new-user':
        //  this.filteredListAgencyNewUser = [];
   // }
      this.is_selected = true;
    }

    //Select option form Price Rules exist and form New Price Rules
    select_autocomplete(item, code, type){
        if(this.pr_rules_type_request_data == 'hotels'){ //Verify which Price Rules it is
            if(this._edit_price.apply_not_apply_hotels[this.indexer] == 'apply'){
                if(this._edit_price.hotels_array_apply[this.indexer] == undefined){           
                    this._edit_price.hotels_array_apply[this.indexer] = []; 
                }
                this._edit_price.hotels_array_apply[this.indexer].push({name: item, code: code }); 
                console.log('array hotels: ' + JSON.stringify(this._edit_price.hotels_array_apply[this.indexer])); 
            }
            else if(this._edit_price.apply_not_apply_hotels[this.indexer] == 'not_apply'){
                if(this._edit_price.hotels_array_not_apply[this.indexer] == undefined){
                    this._edit_price.hotels_array_not_apply[this.indexer] = [];                
                }                
                this._edit_price.hotels_array_not_apply[this.indexer].push({name: item, code: code }); 
                 console.log('array hotels: ' + JSON.stringify(this._edit_price.hotels_array_not_apply[this.indexer])); 
            }
        }

        else if(this.pr_rules_type_request_data == 'attractions'){ //Verify which Price Rules it is
            if(this._edit_price.apply_not_apply_attractions[this.indexer] == 'apply'){
                if(this._edit_price.attractions_array_apply[this.indexer] == undefined){           
                    this._edit_price.attractions_array_apply[this.indexer] = []; 
                }
                this._edit_price.attractions_array_apply[this.indexer].push({name: item, code: code }); 
                console.log('array attractions: ' + JSON.stringify(this._edit_price.attractions_array_apply[this.indexer])); 
            }
            else if(this._edit_price.apply_not_apply_attractions[this.indexer] == 'not_apply'){
                if(this._edit_price.attractions_array_not_apply[this.indexer] == undefined){
                    this._edit_price.attractions_array_not_apply[this.indexer] = [];                
                }                
                this._edit_price.attractions_array_not_apply[this.indexer].push({name: item, code: code }); 
                 console.log('array attractions: ' + JSON.stringify(this._edit_price.attractions_array_not_apply[this.indexer])); 
            }
        }

        else if(this.pr_rules_type_request_data == 'transfers'){ //Verify which Price Rules it is
            if(this._edit_price.apply_not_apply_transfers[this.indexer] == 'apply'){
                if(this._edit_price.transfers_array_apply[this.indexer] == undefined){           
                    this._edit_price.transfers_array_apply[this.indexer] = []; 
                }
                this._edit_price.transfers_array_apply[this.indexer].push({name: item, code: code }); 
                console.log('array transfers: ' + JSON.stringify(this._edit_price.transfers_array_apply[this.indexer])); 
            }
            else if(this._edit_price.apply_not_apply_transfers[this.indexer] == 'not_apply'){
                if(this._edit_price.transfers_array_not_apply[this.indexer] == undefined){
                    this._edit_price.transfers_array_not_apply[this.indexer] = [];                
                }                
                this._edit_price.transfers_array_not_apply[this.indexer].push({name: item, code: code }); 
                 console.log('array transfers: ' + JSON.stringify(this._edit_price.transfers_array_not_apply[this.indexer])); 
            }
        }

        else if(this.pr_rules_type_request_data == 'cars'){ //Verify which Price Rules it is
            if(this._edit_price.apply_not_apply_cars[this.indexer] == 'apply'){
                if(this._edit_price.cars_array_apply[this.indexer] == undefined){           
                    this._edit_price.cars_array_apply[this.indexer] = []; 
                }
                this._edit_price.cars_array_apply[this.indexer].push({name: item, code: code }); 
                console.log('array cars: ' + JSON.stringify(this._edit_price.cars_array_apply[this.indexer])); 
            }
            else if(this._edit_price.apply_not_apply_cars[this.indexer] == 'not_apply'){
                if(this._edit_price.cars_array_not_apply[this.indexer] == undefined){
                    this._edit_price.cars_array_not_apply[this.indexer] = [];                
                }                
                this._edit_price.cars_array_not_apply[this.indexer].push({name: item, code: code }); 
                 console.log('array cars: ' + JSON.stringify(this._edit_price.cars_array_not_apply[this.indexer])); 
            }
        }

        else if(this.pr_rules_type_request_data == 'cruises'){ //Verify which Price Rules it is
            if(this._edit_price.apply_not_apply_cruises[this.indexer] == 'apply'){
                if(this._edit_price.cruises_array_apply[this.indexer] == undefined){           
                    this._edit_price.cruises_array_apply[this.indexer] = []; 
                }
                this._edit_price.cruises_array_apply[this.indexer].push({name: item, code: code }); 
                console.log('array cruises: ' + JSON.stringify(this._edit_price.cruises_array_apply[this.indexer])); 
            }
            else if(this._edit_price.apply_not_apply_cruises[this.indexer] == 'not_apply'){
                if(this._edit_price.cruises_array_not_apply[this.indexer] == undefined){
                    this._edit_price.cruises_array_not_apply[this.indexer] = [];                
                }                
                this._edit_price.cruises_array_not_apply[this.indexer].push({name: item, code: code }); 
                 console.log('array cruises: ' + JSON.stringify(this._edit_price.cruises_array_not_apply[this.indexer])); 
            }
        }

        else if(this.pr_rules_type_request_data == 'flights'){ //Verify which Price Rules it is
            if(this._edit_price.apply_not_apply_flights[this.indexer] == 'apply'){
                if(this._edit_price.flights_array_apply[this.indexer] == undefined){           
                    this._edit_price.flights_array_apply[this.indexer] = []; 
                }
                this._edit_price.flights_array_apply[this.indexer].push({name: item, code: code }); 
                console.log('array flights: ' + JSON.stringify(this._edit_price.flights_array_apply[this.indexer])); 
            }
            else if(this._edit_price.apply_not_apply_flights[this.indexer] == 'not_apply'){
                if(this._edit_price.flights_array_not_apply[this.indexer] == undefined){
                    this._edit_price.flights_array_not_apply[this.indexer] = [];                
                }                
                this._edit_price.flights_array_not_apply[this.indexer].push({name: item, code: code }); 
                 console.log('array flights: ' + JSON.stringify(this._edit_price.flights_array_not_apply[this.indexer])); 
            }
        }

        else if(this.pr_rules_type_request_data == 'packages'){ //Verify which Price Rules it is
            if(this._edit_price.apply_not_apply_packages[this.indexer] == 'apply'){
                if(this._edit_price.packages_array_apply[this.indexer] == undefined){           
                    this._edit_price.packages_array_apply[this.indexer] = []; 
                }
                this._edit_price.packages_array_apply[this.indexer].push({name: item, code: code }); 
                console.log('array packages: ' + JSON.stringify(this._edit_price.packages_array_apply[this.indexer])); 
            }
            else if(this._edit_price.apply_not_apply_packages[this.indexer] == 'not_apply'){
                if(this._edit_price.packages_array_not_apply[this.indexer] == undefined){
                    this._edit_price.packages_array_not_apply[this.indexer] = [];                
                }                
                this._edit_price.packages_array_not_apply[this.indexer].push({name: item, code: code }); 
                 console.log('array packages: ' + JSON.stringify(this._edit_price.packages_array_not_apply[this.indexer])); 
            }
        }

        else if(this.pr_rules_type_request_data == 'insurances'){ //Verify which Price Rules it is
            if(this._edit_price.apply_not_apply_insurances[this.indexer] == 'apply'){
                if(this._edit_price.insurances_array_apply[this.indexer] == undefined){           
                    this._edit_price.insurances_array_apply[this.indexer] = []; 
                }
                this._edit_price.insurances_array_apply[this.indexer].push({name: item, code: code }); 
                console.log('array insurances: ' + JSON.stringify(this._edit_price.insurances_array_apply[this.indexer])); 
            }
            else if(this._edit_price.apply_not_apply_insurances[this.indexer] == 'not_apply'){
                if(this._edit_price.insurances_array_not_apply[this.indexer] == undefined){
                    this._edit_price.insurances_array_not_apply[this.indexer] = [];                
                }                
                this._edit_price.insurances_array_not_apply[this.indexer].push({name: item, code: code }); 
                 console.log('array insurances: ' + JSON.stringify(this._edit_price.insurances_array_not_apply[this.indexer])); 
            }
        }

        else if(this.pr_rules_type_request_data == 'agencies'){ //Verify which Price Rules it is
            if(this._edit_price.apply_not_apply_agencies[this.indexer] == 'apply'){
                if(this._edit_price.agencies_array_apply[this.indexer] == undefined){           
                    this._edit_price.agencies_array_apply[this.indexer] = []; 
                }
                this._edit_price.agencies_array_apply[this.indexer].push({name: item, code: code }); 
                console.log('array agencies: ' + JSON.stringify(this._edit_price.agencies_array_apply[this.indexer])); 
            }
            else if(this._edit_price.apply_not_apply_agencies[this.indexer] == 'not_apply'){
                if(this._edit_price.agencies_array_not_apply[this.indexer] == undefined){
                    this._edit_price.agencies_array_not_apply[this.indexer] = [];                
                }                
                this._edit_price.agencies_array_not_apply[this.indexer].push({name: item, code: code }); 
                 console.log('array agencies: ' + JSON.stringify(this._edit_price.agencies_array_not_apply[this.indexer])); 
            }
        }
        else if(this.pr_rules_type_request_data == 'int_provider'){ //Verify which Price Rules it is
            if(this._edit_price.apply_not_apply_int_prov[this.indexer] == 'apply'){
                if(this._edit_price.int_prov_array_apply[this.indexer] == undefined){
                this._edit_price.int_prov_array_apply[this.indexer] = [];
            }
                this._edit_price.int_prov_array_apply[this.indexer].push({name: item, code : code });
                console.log('array int_providers: ' + JSON.stringify(this._edit_price.int_prov_array_apply[this.indexer])); 
                
            }
            else if(this._edit_price.apply_not_apply_int_prov[this.indexer] == 'not_apply'){
                if(this._edit_price.int_prov_array_not_apply[this.indexer] == undefined){
                    this._edit_price.int_prov_array_not_apply[this.indexer] = [];
                }
                this._edit_price.int_prov_array_not_apply[this.indexer].push({name: item, code : code });
                console.log('array int_providers: ' + JSON.stringify(this._edit_price.int_prov_array_not_apply[this.indexer]));       
            }
        }
        else if(this.pr_rules_type_request_data == 'ext_provider'){ //Verify which Price Rules it is
            if(this._edit_price.apply_not_apply_ext_prov[this.indexer] == 'apply'){
                if(this._edit_price.ext_prov_array_apply[this.indexer] == undefined){
                    this._edit_price.ext_prov_array_apply[this.indexer] = [];
                }
                this._edit_price.ext_prov_array_apply[this.indexer].push({name: item, code : code });
                console.log('array ext_providers: ' + JSON.stringify(this._edit_price.ext_prov_array_apply[this.indexer]));
            } 
            else if(this._edit_price.apply_not_apply_ext_prov[this.indexer] == 'not_apply'){
                if(this._edit_price.ext_prov_array_not_apply[this.indexer] == undefined){
                    this._edit_price.ext_prov_array_not_apply[this.indexer] = [];
                }
                this._edit_price.ext_prov_array_not_apply[this.indexer].push({name: item, code : code });
                console.log('array ext_providers: ' + JSON.stringify(this._edit_price.ext_prov_array_not_apply[this.indexer]));
            }
        }
        else if(this.pr_rules_type_request_data == 'destination'){ //Verify which Price Rules it is
            if(this._edit_price.apply_not_apply_destination[this.indexer] == 'apply'){
                if(this._edit_price.destination_array_apply[this.indexer] == undefined){
                    this._edit_price.destination_array_apply[this.indexer] = [];
                }
                this._edit_price.destination_array_apply[this.indexer].push({name: item, code: code, type: type});  
                console.log('array destinations: ' + JSON.stringify(this._edit_price.destination_array_apply[this.indexer]));
            }
            else if(this._edit_price.apply_not_apply_destination[this.indexer] == 'not_apply'){
                if(this._edit_price.destination_array_not_apply[this.indexer] == undefined){
                    this._edit_price.destination_array_not_apply[this.indexer] = [];
                }
                this._edit_price.destination_array_not_apply[this.indexer].push({name: item, code: code, type: type});
                console.log('array destinations: ' + JSON.stringify(this._edit_price.destination_array_not_apply[this.indexer]));
            }
        }

        this.relation_name_autocomplete = item; //Price Rule exist
        //this.relation_name_new_user_agency = item; //New User
        this.agency_auto_code_user = code; //User exist
        //this.agency_auto_code_new_user = code; //New User
        console.log('agency code user: ' + this.agency_auto_code_user);
        console.log('relation_name_autocomplete: ' + this.relation_name_autocomplete);
        //console.log('agency code NEW user: ' + this.agency_auto_code_new_user);
        this.length_of_filteredList = ''; //User exist field City
        this.message_agency_user = []; //Hide message User exist
        this.filteredListAutocomplete = []; //User exist field Agency
        //this.length_of_filteredListNewUser = ''; //New User field City
        // this.filteredListAgencyNewUser = []; //New User field Agency
        //this.length_of_filteredListAgencyNewUser = ''; //New User field Agency
        //this.state_validate_agency_new_user = true; //New User enabled save
        this.is_selected = true;
        jQuery('#agency-user' + this.indexer).removeClass('border-errors'); //User exist  
    }


    remove_message_agency(){ console.log('remove_message_agency');
      this.field_error_agency = []; //User Exist
      this.field_agency_user = []; //User Exist
      this.length_of_filteredList = ''; //User Exist
      //this.length_of_filteredListNewUser = ''; //New User
      this.state_validate_agency_user_exist = true; //Form User Exist
      //this.state_validate_agency_new_user = true; //Form New User
    }


    //////////////////////////////////////////
    /// Show and hide form create New user ///
    show_form_create_new_agency(i, user){
      if(user == 'user'){
        this.create_agency_user[i] = true;
        jQuery('#create-agency-users' + i).show();
      }/* else if(user == 'new-user'){
        this.create_agency_new_user = true;
        jQuery('#create-agency-users-new').show();
      } */
    }

    hide_form_create_new_agency(i, user){
      /*this.agency_name_new_agency_new_user = ''; //Clean input Form New User
      this.agency_email_new_user = ''; //Clean input Form New User
      this.agency_tax_number_new_user = ''; //Clean input Form New User
      
      this.agency_name_new_agency_user = []; //Clean input form User Exist
      this.agency_email_user = []; //Clean input User Exist
      this.agency_tax_number_user = []; //Clean input User Exist*/

      if(user == 'user'){
        this.create_agency_user[i] = false;
        jQuery('#create-agency-users' + i).hide();
      } /*else if(user == 'new-user'){
        this.create_agency_new_user = false;
        jQuery('#create-agency-users-new').hide();
      }*/
    }

    close_form_user(){
      for(var x=0; x<this.remove_class.length; x++){
         this.remove_class[x] = true; //Close form
       }
    }

    //////////////////////////////////////////////////
    /// Service Rollover Automcomplete or Dropdown ///
    mouseover_color_text(text){
        this._rol.mouseover_color_text(text);
    }
    mouseleave_color_text(text){
        this._rol.mouseleave_color_text(text);
    }//////////////// END ALL METHODS AGENCY AUTOCOMPLETE /////////////////

} // Close class Autocomplete