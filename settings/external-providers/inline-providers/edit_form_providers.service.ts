import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import {CustomHttp} from '../../../services/http-wrapper';
import myGlobals = require('../../../../app');
import { Location } from '@angular/common';
import {LoadingGif} from '../../../bworkspace/filedetail/loading_gif.service';
import {ExternalProviders} from '../external-providers';
import {DataPropertiesProviders} from '../data_properties.service';
import {Core} from '../../../core/core';

declare var jQuery: any;
declare var $: any;

@Injectable()
export class editExternalProviders{

//Inline Ext. Providers Request Get Data
field_name = [];
status: any;
days_to_cxl = [];
search_only_logged = [];
is_msrp_mandatory = [];
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
replace_voucher_data = [];

//Inline Ext. Providers Request Save new Data
field_name_new = [];
days_to_cxl_new = [];
search_only_logged_new = [];
is_msrp_mandatory_new = [];
legend_new = [];
legend_hotel_new = [];
legend_attraction_new = [];
legend_transfer_new = [];
legend_ife_new = [];
legend_flight_new = [];
legend_car_new = [];
legend_package_new = [];
legend_cruise_new = [];
legend_insurance_new = [];
voucher_payable_new = [];
voucher_observations_new = [];
voucher_emergency_contact_new = [];
replace_voucher_data_new = [];
//Message errors
general_error_prov: string=''; //Request get data
general_error_prov_save: string = ''; //Request general error Save
exist_error_prov_save: any; //Request error specific error Save
field_error_name=[]; //Field specific error Save to field Name
field_error_days=[]; //Field specific error Save to field Days to Cancel
message_name=[]; //Message specific error Save to field Name
message_days=[]; //Message specific error Save to field Days to Cancel

constructor( public http: Http, public _loc:Location, public _providers_service: DataPropertiesProviders, public load: LoadingGif) {}

/////////////////////////////////////////////////////
/// Methods Inline editing for External Providers ///
/////////////////////////////////////////////////////
open_form_prov(i, id_ext_prov){
  var open_form = '#edit-row-expandable' + i;
  var hide_pencil = '#pencil-prov' + i;
  jQuery(hide_pencil).hide();
  jQuery(open_form).show('slow');

      /////////////////////////////////////////////////////////////////////////////////////////////
      /// Request Get data External Providers ///
      this._providers_service.id_ext_prov = id_ext_prov;
      console.log('ID provider inline: '+ JSON.stringify(this._providers_service.id_ext_prov)); 
      let url = myGlobals.host+'/api/admin/settings/external_provider/get_data';
      let body=JSON.stringify({ id: id_ext_prov });
      console.log('BODY: ' + body);
      let headers = new Headers({ 'Content-Type': 'application/json' });

          this.http.post( url, body, {headers: headers, withCredentials:true})
            .subscribe( 
              response => { 
                console.log('RESPUESTA INLINE EXT. PROVIDERS: ' + JSON.stringify(response.json()));
                this.field_name[i] = response.json().name;
                this.days_to_cxl[i] = response.json().days_to_cxl;
                this.search_only_logged[i] = response.json().search_only_logged;
                this.is_msrp_mandatory[i] = response.json().is_msrp_mandatory;
                this.legend[i] = response.json().legend;
                this.legend_hotel[i] = response.json().legend_hotel;
                this.legend_attraction[i] = response.json().legend_attraction;
                this.legend_transfer[i] = response.json().legend_transfer;
                this.legend_ife[i] = response.json().legend_ife;
                this.legend_flight[i] = response.json().legend_flight;
                this.legend_car[i] = response.json().legend_car;
                this.legend_package[i] = response.json().legend_package;
                this.legend_cruise[i] = response.json().legend_cruise;
                this.legend_insurance[i] = response.json().legend_insurance;
                this.voucher_payable[i] = response.json().voucher_payable;
                this.voucher_observations[i] = response.json().voucher_observations;
                this.voucher_emergency_contact[i] = response.json().voucher_emergency_contact;
                this.replace_voucher_data[i] = response.json().replace_voucher_data;
                this.general_error_prov = response.json().error_data.general_error;
                if(this.general_error_prov != ''){
                  console.log('Error general: ' + JSON.stringify(this.general_error_prov));
                  //Show generic error in HTML with ngIf in general_error_prov
                } 
                //Implementation Radio buttons: Select Radio option by default based on response 
                if(this.search_only_logged[i] == true){
                    $('#option-logged-yes' + i).trigger('click');
                }else if(this.search_only_logged[i] == false){
                    $('#option-logged-no' + i).trigger('click');
                } 
                if(this.is_msrp_mandatory[i] == true){
                   $('#option-mandatory-yes' + i).trigger('click');
                }else if(this.is_msrp_mandatory[i] == false){
                   $('#option-mandatory-no' + i).trigger('click');
                }   
                if(this.replace_voucher_data[i] == true){
                   $('#option-voucher-yes' + i).trigger('click');
                }else if(this.replace_voucher_data[i] == false){
                   $('#option-voucher-no' + i).trigger('click');
                }
              }, error => {}
          );
      } // Close method open_form_prov

/////////////////////////////////////////////////////////////////////////
/// Request Save data Edit Form External Providers ///
save_ext_prov(id_ext_prov, status, i){
  if(this.field_name_new[i] == undefined){ //If user did not change value set property with Data from the value
    var name = '#field-name' + i;
    this.field_name_new[i] = jQuery(name).val();
  }
  if(this.days_to_cxl_new[i] == undefined){
    var days_to_cancel = '#field-days' + i;
    this.days_to_cxl_new[i] = jQuery(days_to_cancel).val();
  }

  ////////////////////
  ///RADIO BUTTONS ///
  var only_logged = "optionlogged" + i;
  this.search_only_logged_new[i] = $('input[name=' + only_logged + ']:radio:checked').val(); //Get value from selected Radio Logged

  var mandatory = "optionmandatory" + i;
  this.is_msrp_mandatory_new[i] = $('input[name=' + mandatory + ']:radio:checked').val(); //Get value from selected Radio Mandatory
  console.log('Mandatory select: ' + this.is_msrp_mandatory_new[i]); 
  var voucher = "optionvoucher" + i;
  this.replace_voucher_data_new[i] = $('input[name=' + voucher + ']:radio:checked').val(); //Get value from selected Radio Voucher
                                 
  this.load.show_loading_gif(); //Loading gif
  let updated_form;
  var name_array = this.field_name_new[i];
  let url = myGlobals.host+'/api/admin/settings/external_provider/update';
  
  let body=JSON.stringify({
    id: id_ext_prov, 
    name: name_array,
    status: status, 
    search_only_logged: this.search_only_logged_new[i], 
    days_to_cxl: this.days_to_cxl_new[i], 
    is_msrp_mandatory: this.is_msrp_mandatory_new[i],
    legend: this.legend_new[i],
    legend_hotel: this.legend_hotel_new[i],
    legend_attraction: this.legend_attraction_new[i],
    legend_transfer: this.legend_transfer_new[i],
    legend_ife: this.legend_ife_new[i],
    legend_flight: this.legend_flight_new[i],
    legend_car: this.legend_car_new[i],
    legend_package: this.legend_package_new[i],
    legend_cruise: this.legend_cruise_new[i],
    legend_insurance: this.legend_insurance_new[i],
    voucher_payable: this.voucher_payable_new[i],
    voucher_observations: this.voucher_observations_new[i],
    voucher_emergency_contact: this.voucher_emergency_contact_new[i],
    replace_voucher_data: this.replace_voucher_data_new[i] 
  });
  console.log('body inline mappings' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });

      this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe( 
          response => {
            console.log('RESPONSE inline EXT. PROV SAVE: ' + JSON.stringify(response.json()));
            updated_form = response.json().updated;   
            if (updated_form == true){
              //this._providers_service.get_external_providers('search', this._providers_service.search_ext_provider, 1)
              //.map(json_response =>  
                this.after_save_ext_prov(i, this.field_name_new[i], this.days_to_cxl_new[i], this.legend_new[i], this.legend_hotel_new[i], this.legend_attraction_new[i], this.legend_transfer_new[i], this.legend_ife_new[i], this.legend_flight_new[i], this.legend_car_new[i], this.legend_package_new[i], this.legend_cruise_new[i], this.legend_insurance_new[i], this.voucher_payable_new[i], this.voucher_observations_new[i], this.voucher_emergency_contact_new[i]);    
            }else {
              this.load.hide_loading_gif(); //Remove loading gif
              this.exist_error_prov_save = response.json().error_data.exist_error;
              this.general_error_prov_save = response.json().error_data.general_error; 
              console.log('Error general: ' + JSON.stringify(this.general_error_prov_save));
              console.log('Error específico: ' + JSON.stringify(this.exist_error_prov_save)); 
              if(this.general_error_prov_save != ''){
                //Show generic error in HTML with ngIf in general_error_prov_save
              } else if(this.exist_error_prov_save == true){
                var x = response.json().error_data.error_field_list;
                for(var m = 0; m<x.length; m++){
                  this.field_error_name[i] = response.json().error_data.error_field_list[m].field;
                  this.field_error_days[i] = response.json().error_data.error_field_list[m].field;
                  if(this.field_error_name[i] == 'name'){
                    //Error Message for Name if update fails from backend
                    this.message_name[i] = response.json().error_data.error_field_list[m].message;
                    jQuery('.field-name').addClass('border-errors');
                    console.log('name: ' + this.message_name);
                  } 
                  if(this.field_error_days[i] == 'days_to_cxl'){
                    //Error Message for Days To cancel if update fails from backend
                    this.message_days[i] = response.json().error_data.error_field_list[m].message;
                    jQuery('.field-days').addClass('border-errors');
                    console.log('days: ' + this.message_days );
                  }
                }         
              }
             }
          }, error => {}
      ); 
  } //Close save_ext_prov

after_save_ext_prov(i, name, days, legend, leg_hotel, leg_attraction, leg_transfer, leg_ife, leg_air, leg_car, leg_package, leg_cruise, leg_insurance, payable, observations, emergency){
   this.load.hide_loading_gif(); //Remove loading gif
   this.cancel_edit_ext_prov(i, name, days, legend, leg_hotel, leg_attraction, leg_transfer, leg_ife, leg_air, leg_car, leg_package, leg_cruise, leg_insurance, payable, observations, emergency);
   
}

///////////////////////////////////////////////////////
/// Click Button Cancel/close inline Ext. Providers ///
cancel_edit_ext_prov(i, name, days, legend, leg_hotel, leg_attraction, leg_transfer, leg_ife, leg_air, leg_car, leg_package, leg_cruise, leg_insurance, payable, observations, emergency){ 
    this.field_name_new[i] = name;
    this.days_to_cxl_new[i] = days;
    this.legend_new[i] = legend;
    this.legend_hotel_new[i] = leg_hotel;
    this.legend_attraction_new[i] = leg_attraction;
    this.legend_transfer_new[i] = leg_transfer;
    this.legend_ife_new[i] = leg_ife;
    this.legend_flight_new[i] = leg_air;
    this.legend_car_new[i] = leg_car;
    this.legend_package_new[i] = leg_package;
    this.legend_cruise_new[i] = leg_cruise;
    this.legend_insurance_new[i] = leg_insurance;
    this.voucher_payable_new[i] = payable;
    this.voucher_observations_new[i] = observations;
    this.voucher_emergency_contact_new[i] = emergency;
    
    var open_form = '#edit-row-expandable' + i;
    var hide_pencil = '#pencil-prov' + i;
    jQuery(hide_pencil).show();
    jQuery(open_form).hide();
}

} //Close class editExternalProviders



