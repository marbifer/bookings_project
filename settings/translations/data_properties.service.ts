import { Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams } from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import { CustomHttp } from '../../services/http-wrapper';
import myGlobals = require('../../../app');
import { Location } from '@angular/common';
import {LoadingGif } from '../../bworkspace/filedetail/loading_gif.service';
import { Translations } from './translations';
import { Core } from '../../core/core';
import { DataPagination } from './../pagination-mappings/data_pagination.service';

declare var jQuery: any;
declare var $: any;

////////////////////////////////////////////////////
/// Properties translations (Simple List) ///

@Injectable()
export class DataPropertiesTranslations{

//Data translations
translations: any;
search_translations: any = '';
total_page: any;
current_page : any;

//Delete single Currency
list_id = []; 
toggle_status = true;

//New Rates
list_new_rate = [];
new_rates = [];
rate_id:any = '';
rate_new:any = '';
id_currency:any;

    constructor(public http:Http, public router: Router, public location: Location,
                public load: LoadingGif, public _data_pagination: DataPagination) {}

////////////////////////////////////////
/// Get All translations Data ///
get_translations(letter, numberAndType){
    this.load.show_loading_gif_bw(); //Show loading gif
    this.search_translations = letter;
    this._data_pagination.search_map_categories = letter;

    this._data_pagination.current_page = numberAndType.page;
    this.current_page =  numberAndType.page;
    let url = myGlobals.host+'/api/admin/settings/template_translation/search';

    let body=JSON.stringify({ template_translation: this.search_translations, page_number: numberAndType.page, items_for_page: 10 });
    console.log('Body del request de translations: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
     .map(response => {
          
            this._data_pagination.last_page = response.json().list_template_translation_count;
            this._data_pagination.total_page = response.json().list_template_translation_count;
            this._data_pagination.numbers_of_pages = Math.ceil(this._data_pagination.last_page/10); //11÷10

            this._data_pagination.firstof_page = Math.ceil(numberAndType.page/this._data_pagination.limit_per_pages)*this._data_pagination.limit_per_pages-6;        

            this._data_pagination.limit = this._data_pagination.numbers_of_pages;

            this._data_pagination.current_page = numberAndType.page;
            
            this.translations = []; //Clean array
            this.load.hide_loading_gif_bw(); //Remove loading gif
          	this.translations = response.json().list_template_translation;
            console.log('ESTOOOOO:::::<><><>  '+JSON.stringify(response.json()));
            this.id_currency = this.translations.code;
            jQuery('.results-bar-wrapper, #translations').fadeIn();
            console.log('translations: ' + JSON.stringify(this.translations));              
   
            return this._data_pagination; //Send back response to the call of the method to use as event_type variable                 
            }, error => {}
      ); 
}

} //Close class get_translations