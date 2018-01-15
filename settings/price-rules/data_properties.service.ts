import { Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams } from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import { CustomHttp } from '../../services/http-wrapper';
import myGlobals = require('../../../app');
import { Location } from '@angular/common';
import {LoadingGif } from '../../bworkspace/filedetail/loading_gif.service';
import { PriceRules } from './price-rules';
import { Core } from '../../core/core';
import { DataPagination } from './../pagination-mappings/data_pagination.service';

declare var jQuery: any;
declare var $: any;

////////////////////////////////////////////////////
/// Properties Price Rules (Simple List) ///

@Injectable()
export class DataPropertiesPriceRules{

//Data Price Rules
price_rules: any;
search_price_rules: any = '';
total_page: any;
current_page: any;
count_price_rules: any;

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
get_price_rules(letter, numberAndType){
    this.load.show_loading_gif_bw(); //Show loading gif
    this.search_price_rules = letter;
    this._data_pagination.search_map_categories = letter;

    this._data_pagination.current_page = numberAndType.page;
    this.current_page =  numberAndType.page;
    let url = myGlobals.host+'/api/admin/settings/price_rule/search';

    let body=JSON.stringify({ price_rule: this.search_price_rules, page_number: numberAndType.page, items_for_page: 10 });
    console.log('Body del request de price rules: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
     .map(response => {
          
            this._data_pagination.last_page = response.json().list_price_rule_count;
            this._data_pagination.total_page = response.json().list_price_rule_count;
            this._data_pagination.numbers_of_pages = Math.ceil(this._data_pagination.last_page/10); //11÷10

            this._data_pagination.firstof_page = Math.ceil(numberAndType.page/this._data_pagination.limit_per_pages)*this._data_pagination.limit_per_pages-6;        
            this._data_pagination.limit = this._data_pagination.numbers_of_pages;
            this._data_pagination.current_page = numberAndType.page;
            this.current_page = numberAndType.page;
            this.total_page = response.json().list_price_rule_count;
            
            this.price_rules = []; //Clean array
            this.load.hide_loading_gif_bw(); //Remove loading gif
          	this.price_rules = response.json().list_price_rule;
            this.count_price_rules = this.price_rules.length; //Count
            jQuery('.results-bar-wrapper, #priceRules').fadeIn();
            console.log('Price Rules: ' + JSON.stringify(this.price_rules));              
   
            return this._data_pagination; //Send back response to the call of the method to use as event_type variable                 
            }, error => {}
      ); 
}

} //Close class get_price_rules