import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import myGlobals = require('../../../app');
import { Location } from '@angular/common';
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';
import {ExternalProviders} from './external-providers';
import {Core} from '../../core/core';
import {DataPagination} from '../pagination-mappings/data_pagination.service';

declare var jQuery: any;
declare var $: any;

///////////////////////////////////////////////////
/// Properties External Providers (Simple List) ///
@Injectable()
export class DataPropertiesProviders{

//Data External Providers
external_providers: any;
search_ext_provider: any = '';

//Pagination
current_page: any;
total_page: any;
numbers_of_pages: any;
array_pages=[];
limit : any; 
count_items : any; 
last_page : any; 
limit_per_pages:number = 7;
firstof_page = 1; //First page of following page
next_pages_u : any;
blocker_next = false; //Stop propagation

//Toggle Enable/Disabled
list_id = []; 
toggle_status = true;

//Select All(checkboxes)
select_all_status = true;

//Inline editing Ext. Providers(Form)
id_ext_prov: any;

constructor(
    public http:Http, 
    public load: LoadingGif, 
    public _data_pagination: DataPagination
) {}

///////////////////////////////////////
/// Get All External Providers Data ///
get_external_providers(letter, numberAndType){
    this.load.show_loading_gif_bw(); //Show loading gif
    this.search_ext_provider = letter;
    this._data_pagination.current_page = numberAndType.page;
    this.current_page = numberAndType.page;
    console.log('página actual data properties service: ' + this._data_pagination.current_page);
    let url = myGlobals.host+'/api/admin/settings/external_provider/search';

    let body=JSON.stringify({ external_provider: this.search_ext_provider, page_number: this._data_pagination.current_page , items_for_page: 10 });
    console.log('Body del request del EXTERNAL PROVIDERS: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
        .map( response => {
            this.load.hide_loading_gif_bw(); //Remove loading gif
            this._data_pagination.last_page = response.json().list_external_provider_count;
            
            this._data_pagination.total_page = response.json().list_external_provider_count;
            console.log('COUNT: ' + JSON.stringify(this._data_pagination.total_page)); 
            //Total amount of number of pages 
            this._data_pagination.numbers_of_pages = Math.ceil(this._data_pagination.total_page/10); //11÷10
            this.numbers_of_pages = Math.ceil(this._data_pagination.total_page/10); //11÷10
            this._data_pagination.limit = this._data_pagination.numbers_of_pages;
            this._data_pagination.current_page = numberAndType.page;

            this._data_pagination.firstof_page = Math.ceil(numberAndType.page/this._data_pagination.limit_per_pages)*this._data_pagination.limit_per_pages-6;        

            this.external_providers = []; //Clean array
            
          	this.external_providers=response.json().list_external_provider;
            console.log('response providers: ' + JSON.stringify(response.json()));   
            jQuery('.results-bar-wrapper, #ext-providers').fadeIn();
            console.log('EXTERNAL PROVIDERS: ' + JSON.stringify(this.external_providers));
            return this._data_pagination; //Send back response to the call of the method to use as event_type variable                 
        }, error => {
        }
      ); 
    }
} //Close class DataPropertiesProviders