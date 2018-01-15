import { Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams } from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import { CustomHttp } from '../../../../services/http-wrapper';
import myGlobals = require('../../../../../app');
import { Location } from '@angular/common';
import { LoadingGif } from '../../../../bworkspace/filedetail/loading_gif.service';
import { MappingsCategories } from '../mappings';
import { DataPropertiesMapCategories } from '../data_properties.service';
import { Core } from '../../../../core/core';

declare var jQuery: any;
declare var $: any;

@Injectable()
export class relationShipsMappingsCategories{

//Request Autocomplete relationships field (Mappings)
categoryname: string="";
is_selected = true; //Verify if user select autocomplete option

public relationShipsCode = "";
public singleArray = [];
public list_of_relationships = [];
public list_of_codes_relationships = [];
public filteredListRelationships = [];
public elementRef;
public to_show_row;
public block_edit = false;
public relation_name;
public error_map: any;

general_error_map: string=''; //Request autocomplete
general_error_map_save: string; //Request general error Save
exist_error_map_save: string; //Request error specific Save
mappings_type_request: any;

constructor(
  public http: Http, 
  public _loc:Location, 
  public _map_categories_service: DataPropertiesMapCategories, 
  public load: LoadingGif) {}

///////////////////////////////////////////////////////////
/// Request data list Mappings Categories(Autocomplete) ///
get_list_relationships_map(relationship_code) { 
  this.list_of_relationships = []; //Clean array
  this.list_of_codes_relationships = []; //Clean array
  var url;
    if(this.mappings_type_request=='hotel_categories'){ //Verify which mappings categories it is
        url = myGlobals.host+'/api/admin/mappings/hotel_category/edit/update_autocomplete'; //Guardo la URL completa para el listado correspondiente
    }
    else if(this.mappings_type_request=='attraction_categories'){
        url = myGlobals.host+'/api/admin/mappings/attraction_category/edit/update_autocomplete';
    }
    else if(this.mappings_type_request=='amenities'){
        url = myGlobals.host+'/api/admin/mappings/amenities/edit/update_autocomplete';
    }
    else if(this.mappings_type_request=='chains'){
        url = myGlobals.host+'/api/admin/mappings/chains/edit/update_autocomplete';
    }
    else if(this.mappings_type_request=='mealplans'){
      url = myGlobals.host+'/api/admin/mappings/mealplans/edit/update_autocomplete';
    }
    

    let body=JSON.stringify({ relationships: relationship_code });
    console.log('BODY: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

        this.http.post( url, body, {headers: headers, withCredentials:true})
          .subscribe( 
            response => { 
              console.log('RESPUESTA INLINE MAPPINGS TEST: ' + JSON.stringify(response.json()));
              this.categoryname = response.json().list_relationships;
              this.general_error_map = response.json().error_data.general_error;
              if(this.general_error_map != ''){
                console.log('Error general: ' + JSON.stringify(this.general_error_map));
                console.log('Error general row: ' + (this.to_show_row)); 
                //Show generic error in HTML with ngIf in general_error_map
                jQuery('.relationShips-map').addClass('editable-with-errors');
                this.filteredListRelationships = []; //Clean array
              }else {
                for(var i=0; i < response.json().list_relationships.length; i++) {
                  this.list_of_codes_relationships[i] = response.json().list_relationships[i].code;
                  this.list_of_relationships[i] = response.json().list_relationships[i].name;
                  //Filter list Autocomplete Relationships field   
                  this.filteredListRelationships = this.list_of_relationships.filter(function(el){
                    return el.toLowerCase().indexOf(relationship_code.toLowerCase()) > -1;
                  }.bind(this));
                } 
              }       
            }, error => {}
        );
  }

/////////////////////////////////////////////////////
/// Save data Edit Confirmation Number and Status ///
save_relationships_map(rel_code, prov_code, cod, i){
  if(this.general_error_map == '') {
    if(this.is_selected == false) { //If user select option store selected option in rel_code to save
      rel_code = this.relation_name;
    }
    this.error_map = i;
    this.load.show_loading_gif(); //Loading gif
    let updated_relation_map;

    var url;
      if(this.mappings_type_request=='hotel_categories'){ //Verify which mappings categories it is
          url = myGlobals.host+'/api/admin/mappings/hotel_category/edit/save'; //Guardo la URL completa del listado correspondiente
      }
      else if(this.mappings_type_request=='attraction_categories'){
          url = myGlobals.host+'/api/admin/mappings/attraction_category/edit/save';
      }
      else if(this.mappings_type_request=='amenities'){
          url = myGlobals.host+'/api/admin/mappings/amenities/edit/save';
      }
      else if(this.mappings_type_request=='chains'){
          url = myGlobals.host+'/api/admin/mappings/chains/edit/save';
      }
      else if(this.mappings_type_request=='mealplans'){
        url = myGlobals.host+'/api/admin/mappings/mealplans/edit/save';
    }
    
    let body=JSON.stringify({code_internal_autocomplete: rel_code, provider_code: prov_code, code: cod});
    console.log('body SAVE inline mappings: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

        this.http.post( url, body, {headers: headers, withCredentials:true})
          .subscribe( 
            response => {
              console.log('RESPONSE inline mappings SAVE TEST: ' + JSON.stringify(response.json()));
              updated_relation_map=response.json().updated;        
              if (updated_relation_map == true){
                this._map_categories_service.get_mappings_categories(this._map_categories_service.search_map_categories, {page: 1})
                .map(json_response =>  
                  this.after_save_relationship()).subscribe();    
                } else {
                this.load.hide_loading_gif(); //Remove loading gif
                this.exist_error_map_save = response.json().error_data.exist_error;
                this.general_error_map_save = response.json().error_data.general_error;
                console.log('Error general: ' + JSON.stringify(this.general_error_map_save));  
                if(this.general_error_map_save != ''){
                  //Show generic error in HTML with ngIf
                  jQuery('.relationShips-map').addClass('editable-with-errors');
                } 
               }
            }, error => {}
        );
      } //Close first if 
  } //Close save_relationships_map

after_save_relationship(){
   this.load.hide_loading_gif(); //Remove loading gif
   this.close_all();
}

////////////////////////////////////////////////////////////////////////////
/// Implementation Autocomplete for field Relationships with event click /// 
filter_category_name_click(relationship_code, row_index) {
  this.to_show_row = row_index;
  this.get_list_relationships_map(''); //Call request function
  jQuery('.relationShips-map').removeClass('editable-with-errors');
  jQuery('.error-message-inline').hide();
}

////////////////////////////////////////////////////////////////////////////
/// Implementation Autocomplete for field Relationships with event keyup /// 
filter_category_name(relationship_code, row_index) {
  if (this.relation_name !== ""){ 
      this.to_show_row= row_index;
      var letter_or_number = this.relation_name; //Store letter
      this.get_list_relationships_map(letter_or_number); //Call request function
      jQuery('.relationShips-map').removeClass('editable-with-errors');
  }else{
    this.filteredListRelationships = [];
  }
}

select(item, code){
  this.relation_name = item;
  this.relationShipsCode = code;
  this.filteredListRelationships = [];
  this.is_selected = true;
}

handleClick(event){
   var clickedComponent = event.target;
   var inside = false;
   do {
       if (clickedComponent === this.elementRef.nativeElement) {
           inside = true;
       }
      clickedComponent = clickedComponent.parentNode;
   } while (clickedComponent);
    if(!inside){
        this.filteredListRelationships = [];
    }
}

//////////////////////////////////////////////////////
/// Methods Inline editing for Mappings Categories ///
//////////////////////////////////////////////////////
edit_relationships(data, pencil, id, buttons, list_map, default_relation, i){
  jQuery('.relationShips-map').removeClass('editable-with-errors'); //Remove border error
  jQuery('.relationShips-map, .save-cancel').hide();
    this.relation_name = default_relation;
    jQuery('.pencil-map, .original').show();
    jQuery('#'+ data).hide();
    jQuery('#'+ pencil).hide();
    jQuery('#'+ id).show();
    jQuery('#'+ buttons).show();
    jQuery('#'+ list_map).show();
    jQuery('#editing-mappings'+ i).show();
    this.general_error_map_save = ''; //Clean property
    this.general_error_map = ''; //Clean property
    this.filteredListRelationships = []; //Clean array
}

///////////////////////////////////////////////
/// Click Icon-cancel/close inline Mappings ///
cancel_edit_relationships(relationship_default){ 
  this.close_all();
}

close_all(){
    jQuery('.relationShips-map, .inline-wrapper, .margin-categories').hide();
    jQuery('#original-relationship, .original, .pencil-map').show();
    jQuery('.relationShips-map').removeClass('editable-with-errors');
    jQuery('.sc-icons').tooltip('hide'); //Hide tooltip "Save"
    this.to_show_row =-1;
    this.block_edit = false;
    this.general_error_map_save = ''; //Empty property to avoid show error message request Save
    this.general_error_map = ''; //Empty property to avoid show error message request Autocomplete
    this.is_selected = false;
}

////////////////////////////////////////////
/// Inline editing: Buttons Save, Cancel ///
rollover_icons_save_cancel(editing){
   jQuery(editing).tooltip('show');
}

} //Close class relationShipsMappings



