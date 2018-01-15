import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {CustomHttp} from '../../../services/http-wrapper';
import myGlobals = require('../../../../app');
import {Location} from '@angular/common';
import {LoadingGif} from '../../../bworkspace/filedetail/loading_gif.service';
import {RolloverAutocompletes} from '../../../customers/rollovers-dropdown.service';
import {InternalData} from '../../all-internal-data/internal-data';
import {DataPropertiesInternalData} from '../../all-internal-data/data_properties.service';
import {Core} from '../../../core/core';

declare var jQuery: any;
declare var $: any;
export var ObjectExtProvider;

@Injectable()
export class editInternalData{

  general_error_amenities : any;

  //Request Get Data to generate forms
  languages : any;
  is_default: boolean;
  code: string;
  name: string;

  amenity_code: string;
  is_filtrable: boolean;
  list_translations:any = [];

  updated_form: any;
  general_error: any;
  error: any = [];
  updated_form_error: any = [];
  save_amenity : boolean = false;
  save_amenity_error : boolean = false;
  hasError : boolean = false;
  amenity_translation:any;
  myUrl: any;
  internal_type_request: any; //Unification Internal Data
  general_error_new: any;
  edit_errors: any = [];
  
    // edit_errors: { 
  //   lang : any[] 
  // }; 

constructor(
  public http: Http, 
  public location: Location, 
  public _service: DataPropertiesInternalData, 
  public load: LoadingGif, 
  public _rol: RolloverAutocompletes
  ) {

  if (this.location.path().indexOf(";") != -1 ) {
        this.myUrl = this.location.path().slice(0,this.location.path().indexOf(";"));
    } else {
        this.myUrl = this.location.path();
    }
}

get_languages_forms(){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      var url; 

      if(this.internal_type_request == 'amenities'){ //Verify which Internal Data it is
        url = myGlobals.host+'/api/admin/language_autocomplete';
      }
      else if(this.internal_type_request == 'accessibilities'){
        url = myGlobals.host+'/api/admin/language_autocomplete';
      }
      else if(this.internal_type_request == 'attraction_categories'){
        url = myGlobals.host+'/api/admin/language_autocomplete';
      }
      else if(this.internal_type_request == 'chains'){
        url = myGlobals.host+'/api/admin/language_autocomplete';
      }
      else if(this.internal_type_request == 'classifications'){
        url = myGlobals.host+'/api/admin/language_autocomplete';
      }
      else if(this.internal_type_request == 'hotel_categories'){
        url = myGlobals.host+'/api/admin/language_autocomplete';
      }

      return this.http.get( url, {headers: headers, withCredentials:true} )
        .subscribe(
          response => {
            this.languages = response.json().languages;
            // this.is_default = this.languages.is_default;
            // this.code = this.languages.code;
            // this.name = this.languages.name;
            return this.languages;
          }, error => {}
      );
  } 

edit_internal_amenity(index, code) {
  this.list_translations = [];
  var i;
  for ( i = 0; i < this.languages.length; ++i) {
     this.list_translations.push( {
      object_code : '',
      lang_code:this.languages[i].code,
      lang_name:this.languages[i].name,
      name:$('#'+this.languages[i].code+index).val(),
      description:$('#description'+this.languages[i].code+index).val()
    });
  }

  this.load.show_loading_gif(); //Loading gif
  var url; 
  var body;

  if(this.internal_type_request == 'amenities'){ //Verify which Internal Data it is
    url = myGlobals.host+'/api/admin/internal_data/amenity/save';
    body = JSON.stringify({amenity_code: code, is_filtrable: false, list_translations: this.list_translations});
  }
  else if(this.internal_type_request == 'accessibilities'){
    url = myGlobals.host+'/api/admin/internal_data/accessibility/save';
    body = JSON.stringify({accessibility_code: code, is_filtrable: false, list_translations: this.list_translations});
  }
  else if(this.internal_type_request == 'attraction_categories'){
    url = myGlobals.host +'/api/admin/internal_data/attraction_category/save';
    body = JSON.stringify({attraction_category_code: code, is_filtrable: false, list_translations: this.list_translations});
  }
  else if(this.internal_type_request == 'chains'){
    url = myGlobals.host +'/api/admin/internal_data/chain/save';
    body = JSON.stringify({chain_code: code, is_filtrable: false, list_translations: this.list_translations});
  }
  else if(this.internal_type_request == 'classifications'){
    url = myGlobals.host +'/api/admin/internal_data/classification/save';
    body = JSON.stringify({classification_code: code, is_filtrable: false, list_translations: this.list_translations});
  }
  else if(this.internal_type_request == 'hotel_categories'){
    url = myGlobals.host +'/api/admin/internal_data/hotel_category/save';
    body = JSON.stringify({hotel_category_code: code, is_filtrable: false, list_translations: this.list_translations});
  }

  console.log('body Internal Data edit: ' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });

     return this.http.post( url, body, {headers: headers, withCredentials:true})
        .map(
          response => {
              console.log('Respuesta del edit de internaldata: '+JSON.stringify(response));
           this.updated_form = response.json().updated;
           this.updated_form_error[index] = false;
           this.load.hide_loading_gif(); //Remove loading gif
           if (this.updated_form == true){
                for (var i = 0; i < this.languages.length; ++i) {
                    $('.error'+this.languages[i].name+index).hide();
                }

                jQuery('#success-alert-internal-amenity-edit').fadeIn('slow'); //Show message success
                setTimeout(() => {
                  jQuery('#success-alert-internal-amenity-edit').animate({opacity: 0}, 2500).animate({height: "0px", padding: "0px"}, 2500); //Hide message success
                    setTimeout(() => {
                      this.updated_form = false; //Hide message success
                          setTimeout(() => {
                            var letter = this._service.search_all_internal_data; //Store letter
                            $('#'+index+'icon-edit').trigger('click'); //Close new user form
                            this._service.clearCollapsables();
                            this._service.get_all_internal_data(letter,{ page : this._service.current_page })
                           .subscribe();
                           }, 500);
                    }, 1500);
                }, 500);
            } else {
                this.updated_form_error[index] = true;
               for (var i = 0; i < this.languages.length; ++i) {
                   if ( this.languages[i].name != 'English' ) {
                      $('.error'+this.languages[i].name).hide();
                   } else {
                      jQuery('#'+this.languages[i].code+index).addClass('border-errors');
                   }
               }
                return response.json().error_data.general_error;
                
            }        
          }, error => {}
      );
}

save_internal_amenity() {
  this.list_translations = [];
  var i;
  for ( i = 0; i < this.languages.length; ++i) {
     this.list_translations.push( {
      object_code : '',
      lang_code:this.languages[i].code,
      lang_name:this.languages[i].name,
      name:$('#'+this.languages[i].name).val(),
      description:$('#description'+this.languages[i].name).val()
    });
  }
  this.load.show_loading_gif(); //Loading gif

  var url; 
  var body;

  if(this.internal_type_request == 'amenities'){ //Verify which Internal Data it is
    url = myGlobals.host+'/api/admin/internal_data/amenity/save';
    body = JSON.stringify({amenity_code: '', is_filtrable: false, list_translations: this.list_translations});
  }
  else if(this.internal_type_request == 'accessibilities'){
    url = myGlobals.host+'/api/admin/internal_data/accessibility/save';
    body = JSON.stringify({accessibility_code: '', is_filtrable: false, list_translations: this.list_translations});
  }
  else if(this.internal_type_request == 'attraction_categories'){
    url = myGlobals.host +'/api/admin/internal_data/attraction_category/save';
    body = JSON.stringify({attraction_category_code: '', is_filtrable: false, list_translations: this.list_translations});
  }
  else if(this.internal_type_request == 'chains'){
    url = myGlobals.host +'/api/admin/internal_data/chain/save';
    body = JSON.stringify({chain_code: '', is_filtrable: false, list_translations: this.list_translations});
  }
  else if(this.internal_type_request == 'classifications'){
    url = myGlobals.host +'/api/admin/internal_data/classification/save';
    body = JSON.stringify({classification_code: '', is_filtrable: false, list_translations: this.list_translations});
  }
  else if(this.internal_type_request == 'hotel_categories'){
    url = myGlobals.host +'/api/admin/internal_data/hotel_category/save';
    body = JSON.stringify({hotel_category_code: '', is_filtrable: false, list_translations: this.list_translations});
  }

  console.log('body Internal Data Amenities:' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });

    return  this.http.post( url, body, {headers: headers, withCredentials:true})
        .map(
          response => {
            console.log(JSON.stringify(response));
             for (var i = 0; i < this.languages.length; ++i) {
                 $('.error'+this.languages[i].name).hide();
             }
           this.save_amenity = response.json().updated;
           this.load.hide_loading_gif(); //Remove loading gif
           if (this.save_amenity == true){
                 this.save_amenity_error = false;
                 setTimeout(() => {
                  jQuery('#success-alert-internal-amenity-new').animate({opacity: 0}, 2500).animate({height: "0px", padding: "0px"}, 2500); //Hide message success
                    setTimeout(() => {
                          setTimeout(() => {
                            var letter = this._service.search_all_internal_data; //Store letter
                            this.save_amenity = false;
                            this._service.get_all_internal_data(letter,{ page : this._service.current_page })
                           .subscribe(()=>{
                              this._service.clearCollapsables(); 
                              $('#new-amenity-button').trigger('click'); //Close new user form
                           });
                           }, 500);
                    }, 1500);
                 }, 500);
            } else {
               jQuery('#danger-alert-internal-amenity-new').animate({opacity: 1}, 2500).animate({height: "0px", padding: "0px"}, 2500); //Hide message success
               this.save_amenity_error = true;
               for (var i = 0; i < this.languages.length; ++i) {
                   if ( this.languages[i].name != 'English' ) {
                      $('.error'+this.languages[i].name).hide();
                   } else {
                      $('.error'+this.languages[i].name).show();
                      $('#'+this.languages[i].name).addClass('border-errors');
                      this.general_error_new = response.json().error_data.general_error;
                   }
               }
            }
          }, error => {}
      );

      //this.field_city_user = [];
      //jQuery('#city-user-new').addClass('border-errors');
      //this.location.go(this.myUrl+';cp='+this._service.current_page);  
}

get_internal_data_translations(code) {
  this.load.show_loading_gif(); //Loading gif

  var url; 
  var body;
  if(this.internal_type_request == 'amenities'){ //Verify which Internal Data it is
    url = myGlobals.host +'/api/admin/internal_data/amenity/get_data';
    body = JSON.stringify({amenity_code: code});
  }
  else if(this.internal_type_request == 'accessibilities'){
    url = myGlobals.host +'/api/admin/internal_data/accessibility/get_data';
    body = JSON.stringify({accessibility_code: code});
  }
  else if(this.internal_type_request == 'attraction_categories'){
    url = myGlobals.host +'/api/admin/internal_data/attraction_category/get_data';
    body = JSON.stringify({attraction_category_code: code});
  }
  else if(this.internal_type_request == 'chains'){
    url = myGlobals.host +'/api/admin/internal_data/chain/get_data';
    body = JSON.stringify({chain_code: code});
  }
  else if(this.internal_type_request == 'classifications'){
    url = myGlobals.host +'/api/admin/internal_data/classification/get_data';
    body = JSON.stringify({classification_code: code});
  }
  else if(this.internal_type_request == 'hotel_categories'){
    url = myGlobals.host +'/api/admin/internal_data/hotel_category/get_data';
    body = JSON.stringify({hotel_category_code: code});
  }

  let headers = new Headers({ 'Content-Type': 'application/json' });

   return this.http.post( url, body, {headers: headers, withCredentials:true})
        .map(
          response => {
            this.amenity_translation = response.json().list_translations;
            this.load.hide_loading_gif(); //Remove loading gif
            return  this.amenity_translation;
          }, error => {}
      );

      //this.field_city_user = [];
      //jQuery('#city-user-new').addClass('border-errors');
      //this.location.go(this.myUrl+';cp='+this._service.current_page);  
  }
}