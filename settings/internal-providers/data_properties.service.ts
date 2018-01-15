import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable , Inject} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {CustomHttp} from '../../services/http-wrapper';
import myGlobals = require('../../../app');
import {Location} from '@angular/common';
import {LoadingGif } from '../../bworkspace/filedetail/loading_gif.service';
import {InternalProviders} from './internal-providers';
import {Core} from '../../core/core';
import {DataPagination} from './../pagination-mappings/data_pagination.service';

declare var jQuery: any;
declare var $: any;

////////////////////////////////////////////////////
/// Properties Price Rules (Simple List) ///
@Injectable()
export class DataPropertiesInternalProviders{

//Data Price Rules
internal_provider: any;
search_internal_providers: any = '';
total_page: any;
current_page : any;

//Delete single Currency
list_id = []; 
toggle_status = true;

    constructor(
        public http:Http, 
        public router: Router, 
        public location: Location,
        public load: LoadingGif,
        public _data_pagination: DataPagination
    ) {}

////////////////////////////////////////
/// Get All Price Rules Data ///
get_internal_providers(letter, numberAndType){
    this.load.show_loading_gif_bw(); //Show loading gif
    this.search_internal_providers = letter;
    this._data_pagination.search_map_categories = letter;

    this._data_pagination.current_page = numberAndType.page;
    this.current_page =  numberAndType.page;
    let url = myGlobals.host+'/api/admin/settings/internal_provider/search';

    let body=JSON.stringify({ internal_provider: this.search_internal_providers, page_number: numberAndType.page, items_for_page: 10 });
    console.log('Body del request de price rules: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
     .map(response => {
          
            this._data_pagination.last_page = response.json().list_internal_provider_count;
            this._data_pagination.total_page = response.json().list_internal_provider_count;
            this._data_pagination.numbers_of_pages = Math.ceil(this._data_pagination.last_page/10); //11÷10
            this._data_pagination.firstof_page = Math.ceil(numberAndType.page/this._data_pagination.limit_per_pages)*this._data_pagination.limit_per_pages-6;        

            this._data_pagination.limit = this._data_pagination.numbers_of_pages;
            this._data_pagination.current_page = numberAndType.page;
            this.current_page = numberAndType.page;
            this.total_page = response.json().list_internal_provider_count;
            
            this.internal_provider = []; //Clean array
            this.load.hide_loading_gif_bw(); //Remove loading gif
          	this.internal_provider = response.json().list_internal_provider;
            // jQuery('.results-bar-wrapper, #priceRules').fadeIn();
            console.log('/*/* internal providers */*/: ' + JSON.stringify(this.internal_provider));              
            console.log('/*/* lenght */*/: ' + JSON.stringify( this.internal_provider.length));              
           
            return this._data_pagination; //Send back response to the call of the method to use as event_type variable                 
            }, error => {}
      ); 
}

} //Close class get_internal_providers