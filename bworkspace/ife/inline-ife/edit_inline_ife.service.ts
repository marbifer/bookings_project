import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import {CustomHttp} from '../../../services/http-wrapper';
import myGlobals = require('../../../../app');
import { Location } from '@angular/common';
import {LoadingGif} from '../../../bworkspace/filedetail/loading_gif.service';
import {Ife} from '../ife';
import {Core} from '../../../core/core';

declare var jQuery: any;
declare var $: any;

@Injectable()
export class editIfe{

/// STEP 1 ///
//General
serviceName_general:any;
serviceDateStart_general:any;
serviceDateEnd_general:any;
descriptionGeneral:any;

//Hotel
serviceName_hotel:any;
serviceDateStart_hotel:any;
serviceDateEnd_hotel:any;
address_hotel:any;
room_type_hotel:any;
description_hotel:any;

//Transfer
serviceName_transfer:any;
serviceDateStart_transfer:any;
serviceDateEnd_transfer:any;
description_transfer:any;
from_transfer:any;
to_transfer:any;
provided_by_transfer:any;
city_transfer:any;
pickUp_transfer:any;
dropOff_transfer:any;

//Car
serviceName_car:any;
serviceDateStart_car:any;
serviceDateEnd_car:any;
car_details:any;
service_description_car:any; //Field Rental Company
car_insurance:any;

//Insurance
serviceName_insurance:any;
serviceDateStart_insurance:any;
serviceDateEnd_insurance:any;
place_coverage_insurance:any;
policy_detail_insurance:any;
service_description_insurance:any;

// city
field_error_city:any;
i_user:any;
list_of_city:any;
list_of_codes_city:any;
field_city:any;
city_name:any;
exist_error_city:any;
general_error_city:any;
message_city:any;
length_of_filteredList:any;
filteredListCityNew:any;
state_validate_city_new:any;
is_selected:any;
city_code_new:any;

constructor( public http: Http, public _loc:Location, public load: LoadingGif) {}

/////////////////////////////////////////////////////////////////////////////////////////////
/// Request data list Field City(Autocomplete) ////// LUucho este request y métodos ya no irían porque lo estamos llamando con el componente y servicio que vimos en la call :p /////
/*get_list_city(city_name, handlerEvent, i, e) {
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
              // console.log('Error general row: ' + (this.to_show_row));
              //Show generic error in HTML with ngIf in general_error_city
            } if(this.exist_error_city == true){
              for(var l=0; l<response.json().error_data.error_field_list.length; l++){
                  var city_men = response.json().error_data.error_field_list[l].field;
              }
               if(city_men == 'city'){
                  //Error Message for field City if update fails from backend
                 if(handlerEvent == 'new-user'){
                    var p = this.i_user; //Store iteration in short variable
                    for(var g=0; g<response.json().error_data.error_field_list.length; g++){
                      var store_field = response.json().error_data.error_field_list[g].field;
                      this.field_error_city = store_field;
                      this.message_city = response.json().error_data.error_field_list[g].message;
                      console.log('this.field_city_user[i]: ' +  this.field_error_city);
                      console.log('this.message_city_user[i]: ' +   this.message_city);
                    }
                    jQuery('#city-user-new').addClass('border-errors');
                    this.length_of_filteredList = ''; //Clean
                  }
                  this.filteredListCityNew = []; //Clean list of City New User
              }
            } else {
              for(var i=0; i < response.json().location_list.length; i++) {
                this.list_of_codes_city[i] = response.json().location_list[i].code;
                this.list_of_city[i] = response.json().location_list[i].name;
              }
                //Filter list Autocomplete City field
                console.log('city name Autocomplete: ' + JSON.stringify(this.city_name));
                switch(handlerEvent) {
                    case 'new-user':
                      this.filteredListCityNew = this.list_of_city;
                      this.length_of_filteredList = this.list_of_city.length; //Get length of list of city
                      console.log('Verificar array field city New user: ' + this.filteredListCityNew);
                } //End switch
              console.log('Lista de códigos de City:' + this.list_of_codes_city);
            }
          }, error => {}
      );
  }



filter_city_name_click(city_name, handlerEvent, i, e){
  e.preventDefault();
  this.field_error_city = []; //Clean message
  this.message_city = []; //Hide message User exist
  city_name = '';
  this.get_list_city(city_name, handlerEvent, i, e); //Call request function
  jQuery('#city-user' + i).removeClass('border-errors'); //User exist
  jQuery('#city-user-new').removeClass('border-errors'); //New User
}


//Select city form user exist
select_city_user(i, item, code){
  this.city_transfer = item; //New User
  this.message_city = []; //Hide message User exist
  this.filteredListCityNew = []; //New User
  this.state_validate_city_new = true; //New User enabled save
  this.is_selected = true;
  jQuery('#city-user-new').removeClass('border-errors'); //User exist
}


///////////////////////////////////////////////////////////////////
/// Implementation Autocomplete for field City with event keyup ///
filter_city_name(city_name, handlerEvent, i, e){
  e.preventDefault();
  //Validation for field City
  var validate_city = /[A-Za-z\s]/;
  //Form New User
  if(handlerEvent == 'new-user'){
    if(!validate_city.test(this.city_transfer)){
      this.state_validate_city_new = false;
    } else {
      this.state_validate_city_new = true;
      this.city_code_new = 'error'; //If invalid character broke city code
    }
  }

  this.get_list_city(city_name, handlerEvent, i, e); //Call request function
  this.message_city = ''; //Hide message New User
  jQuery('#city-user-new').removeClass('border-errors'); //New User
  console.log('filteredListCityNewUser del Keyup get data new user: ' + this.filteredListCityNew);
}*/


} 



