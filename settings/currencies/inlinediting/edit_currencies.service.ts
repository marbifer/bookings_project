import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import {CustomHttp} from '../../../services/http-wrapper';
import myGlobals = require('../../../../app');
import { Location } from '@angular/common';
import {LoadingGif} from '../../../bworkspace/filedetail/loading_gif.service';
import {Currencies} from '../currencies';
import {DataPropertiesCurrencies} from '../data_properties.service';
import {Core} from '../../../core/core';

declare var jQuery: any;
declare var $: any;

@Injectable()
export class editCurrencies{

//Request Autocomplete relationships field (Mappings Amenities)
currenciename: string="";
is_selected = true; //Verify if user select autocomplete option

field_name_new = [];
field_error_name = [];
message_name = [];

public relationShipsCode = "";
public singleArray = [];
public list_of_relationships = [];
public list_of_codes_relationships = [];
public filteredListRelationships = [];
public elementRef;
public to_show_row;
public block_edit = false;
public relation_name;
public error_ame: any;

general_error_cur: string=''; //Request autocomplete
general_error_cur_save: string; //Request general error Save
exist_error_cur_save: any; //Request error specific Save


constructor(
  public http: Http, public _loc:Location, public _currencies_service: DataPropertiesCurrencies, public load: LoadingGif) {}

/*
/////////////////////////////////////////////////////
/// Save data Edit Confirmation Number and Status ///
save_currencies(id_cur, status, i){
  if(this.field_name_new[i] == undefined || this.field_name_new[i] == ''){ //If user did not change value set property with Data from the value
    var name = '#field-name';
    this.field_name_new[i]  = jQuery(name).val();
  }

  this.load.show_loading_gif(); //Loading gif
  let updated_currencies;
  var name_array = this.field_name_new[i];
  var id_cur = this._currencies_service.id_currency;
  let url = myGlobals.host+'/api/admin/settings/currency/new_rate_update';

  let body=JSON.stringify({
    code: id_cur,
    name: name_array
  });
  console.log('Id de la moneda ' + this._currencies_service.id_currency);
  console.log('body new rate currencies' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });

      this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe( 
          response => {
            console.log('RESPONSE currencies SAVE: ' + JSON.stringify(response.json()));
            updated_currencies = response.json().updated;  

            if (updated_currencies == true){
              this._currencies_service.get_currencies('search', this._currencies_service.search_currencies, 1)
              .map(json_response =>  
                this.after_save_cur(i, this.field_name_new[i]));
                //var get_url = this._filters.create_url(); 
                //this._loc.go('/app/bworkspace/bookingdetail;id_bookings='+ new_list_relationship);
                //var ul= window.location.href; //Store currenly URL
                //window.location.href = ul; //Redirect URL  
              }else {
              this.load.hide_loading_gif(); //Remove loading gif
              this.exist_error_cur_save = response.json().error_data.exist_error;
              this.general_error_cur_save = response.json().error_data.general_error;
              console.log('Error general: ' + JSON.stringify(this.general_error_cur_save));  
                if(this.general_error_cur_save != ''){
                  //Show generic error in HTML with ngIf
                } else if(this.exist_error_cur_save == true){
                  var x = response.json().error_data.error_field_list;
                  for(var m = 0; m<x.length; m++){
                    this.field_error_name[i] = response.json().error_data.error_field_list[m].field;
                    if(this.field_error_name[i] == 'name'){
                      this.message_name[i] = response.json().error_data.error_field_list[m].message;
                      jQuery('.field-name').addClass('border-prov');
                      console.log('name: ' + this.message_name);
                    }
                  }
                }
              }

          }, error => {}
      ); 
  } //Close save_relationships_map

after_save_cur(i, name){
   this.load.hide_loading_gif(); //Remove loading gif
   this.close_all();
}

cancel_edit_cur(i, name){
    this.field_name_new[i] = name;

    jQuery('.field-name').val('');
}*/

close_all(){
    jQuery('.relationShips-ame, .map-inline, .margin-amenities').hide();
    jQuery('#original-relationship, .original, .pencil-ame').show();
    jQuery('.relationShips-ame').removeClass('border-map');
    this.to_show_row =-1;
    this.block_edit = false;
    this.general_error_cur_save = ''; //Empty property to avoid show error message request Save
    this.general_error_cur = ''; //Empty property to avoid show error message request Autocomplete
    this.is_selected = false;
}

} //Close class relationShipsCurrencies



