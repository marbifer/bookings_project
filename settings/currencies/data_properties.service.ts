import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import {CustomHttp} from '../../services/http-wrapper';
import myGlobals = require('../../../app');
import { Location } from '@angular/common';
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';
import {Currencies} from './currencies';
import {Core} from '../../core/core';
import {DataPagination} from './../pagination-mappings/data_pagination.service';

declare var jQuery: any;
declare var $: any;

////////////////////////////////////////////////////
/// Properties Currencies (Simple List) ///

@Injectable()
export class DataPropertiesCurrencies{

//Data Currencies
currencies: any;
search_currencies: any = '';
total_page: any;
current_page : any;
numbers_of_pages : any;
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
/// Get All Currencies Data ///
get_currencies(letter, numberAndType){
    this.load.show_loading_gif_bw(); //Show loading gif
    this.search_currencies = letter;
    this._data_pagination.search_map_categories = letter;

    this._data_pagination.current_page = numberAndType.page;
    this.current_page =  numberAndType.page;
    let url = myGlobals.host+'/api/admin/settings/currency/search';

    let body=JSON.stringify({ currency: this.search_currencies, page_number: numberAndType.page, items_for_page: 10 });
    console.log('Body del request de Currencies: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
     .map(response => {
          
            this._data_pagination.last_page = response.json().list_currency_count;
            this._data_pagination.total_page = response.json().list_currency_count;

            this._data_pagination.numbers_of_pages = Math.ceil(this._data_pagination.last_page/10); //11÷10
            this.numbers_of_pages = Math.ceil(this._data_pagination.last_page/10); //11÷10

            this._data_pagination.limit = this._data_pagination.numbers_of_pages;

            this._data_pagination.current_page = numberAndType.page;
            
            this._data_pagination.firstof_page = Math.ceil(numberAndType.page/this._data_pagination.limit_per_pages)*this._data_pagination.limit_per_pages-6;        
            this.currencies = []; //Clean array
            this.load.hide_loading_gif_bw(); //Remove loading gif
          	this.currencies = response.json().list_currency;
            this.id_currency = this.currencies.id;
            jQuery('.bg-title-cur, #currencies').fadeIn();
            console.log('CURRENCIES: ' + JSON.stringify(this.currencies));              
   
            return this._data_pagination; //Send back response to the call of the method to use as event_type variable                 
            }, error => {}
      ); 
}

} //Close class get_currencies