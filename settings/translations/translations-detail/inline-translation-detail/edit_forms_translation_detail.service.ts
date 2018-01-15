import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {CustomHttp} from '../../../../services/http-wrapper';
import myGlobals = require('../../../../../app');
import {Location} from '@angular/common';
import {LoadingGif} from '../../../../bworkspace/filedetail/loading_gif.service';
import {RolloverAutocompletes} from '../../../../customers/rollovers-dropdown.service';
import {Translations} from '../../../translations/translations';
import {DataPropertiesTranslations} from '../../../translations/data_properties.service';
import {Core} from '../../../../core/core';

declare var jQuery: any;
declare var $: any;
export var ObjectExtProvider;

@Injectable()
export class editTranslations{

  general_error_amenities : any;

  //Request Get Data to generate forms
  languages : any;
  list_translations : any;

 list_texts_translations = [
    {
    translations_for_language: [
    {
    code:String,
    name:String
    }
    ],
    code:String,
    name:String
    }
    ];

    list_texts_translationsPost = [
    {
    translations_for_language: [
    {
    code:String,
    name:String
    }
    ],
    code:String,
    name:String
    }
    ];

    updated_form:any;
  // is_default: boolean;
  // code: string;
  // name: string;

  // amenity_code: string;
  // is_filtrable: boolean;
  // list_translations:any = [];

  // updated_form: any;
  // general_error: any;
  // error: any = [];
  // updated_form_error: any;
  // save_amenity : boolean = false;
  // save_amenity_error : boolean = false;
  // hasError : boolean = false;


  // amenity_translation:any;
  // myUrl: any;
  // internal_type_request: any; //Unification Internal Data
 
constructor(public http: Http, public location: Location, public _service: DataPropertiesTranslations, public load: LoadingGif, public _rol: RolloverAutocompletes) {
}

get_languages_forms(){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      var url; 
        url = myGlobals.host+'/api/admin/language_autocomplete';
      return this.http.get( url, {headers: headers, withCredentials:true} )
        .subscribe(
          response => {
            this.languages = response.json().languages;
             console.log('++++++++++++ '+JSON.stringify(this.languages));
            return this.languages;
          }, error => {}
      );
  } 


get_translation_detail(id){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      var url; 
      url = myGlobals.host+'/api/admin/settings/template_translation/detail';
        let body=JSON.stringify({
          template_id: id
        });
    return this.http.post( url, body ,{headers: headers, withCredentials:true} )
      .subscribe(
        response => {
          this.list_translations = response.json().list_texts_translations; 
          console.log('--NAME '+JSON.stringify(response.json()));
          console.log('-------------- '+JSON.stringify(this.list_translations));
        }, error => {}
    );
}

post_translation_detail(){
// list_texts_translations
// translations_for_language
      // this.list_texts_translationsPost.push(list_texts_translations);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      var url; 
      url = myGlobals.host+'/api/admin/settings/template_translation/save';
      let body=JSON.stringify({
        list_texts_translations: this.list_translations
      });
    return this.http.post( url, body ,{headers: headers, withCredentials:true} )
      .map(
        response => {
               this.updated_form = response.json().updated;

                myGlobals.alertTravtion(JSON.stringify(response));
                if (response.json().updated == true){
                // for (var i = 0; i < this.languages.length; ++i) {
                //     $('.error'+this.languages[i].name+index).hide();
                // }

                jQuery('#success-alert-translation-detail').fadeIn('slow'); //Show message success
                setTimeout(() => {
                  jQuery('#success-alert-translation-detail').animate({opacity: 0}, 2500).animate({height: "0px", padding: "0px"}, 2500); //Hide message success
                    setTimeout(() => {
                        this.updated_form = false; //Hide message success
                          setTimeout(() => {
                            // this._service.get_all_internal_data(letter,{ page : this._service.current_page })
                           // .subscribe();
                           }, 1000);
                    }, 3000);
                }, 1000);
            } else {
                // this.updated_form_error[index] = true;
                // jQuery('#'+this.languages[i].code+index).addClass('border-errors');
                // return response.json().error_data.general_error;
                
            }  
        }, error => {}
    );
}




}