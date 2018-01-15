import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable, Output} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {CustomHttp} from '../../../services/http-wrapper';
import myGlobals = require('../../../../app');
import {Location} from '@angular/common';
import {LoadingGif} from '../../../bworkspace/filedetail/loading_gif.service';
import {MappingsCategories} from './mappings';
import {myPagination} from '../../pagination-mappings/pagination.subcomponent';
import {DataPagination} from '../../pagination-mappings/data_pagination.service';
import {Core} from '../../../core/core';

declare var jQuery: any;
declare var $: any;

////////////////////////////////////////////////////
/// Properties Mappings Categories (Simple List) ///
////////////////////////////////////////////////////
@Injectable()
export class DataPropertiesMapCategories{

//Data Mapping Categories
mappings_categories: any;
search_map_categories: any = '';
current_page: any;

routeForNavigation :any;

numbers_of_pages : any;
//Delete single Mapping
list_id = []; 
toggle_status = true;

mappings_type_request_data: any;

    constructor(
        public http:Http, 
        public router: Router, 
        public location: Location, 
        public load: LoadingGif, 
        public _data_pagination: DataPagination
    ) {}

////////////////////////////////////////
/// Get All Mappings Categories Data ///
get_mappings_categories(letter, numberAndType){
    this.load.show_loading_gif_bw(); //Show loading gif
    console.log('Letra seleccionada en data raw: ' + letter);
    this._data_pagination.search_map_categories = letter;
    console.log('Letra seleccionada en data: ' + this._data_pagination.search_map_categories);
    this._data_pagination.current_page = numberAndType.page;
    console.log('página actual data properties service: ' + this._data_pagination.current_page);

    var url;
    var body;
    if(this.mappings_type_request_data == 'hotel_categories'){ //Verify which mappings categories it is
        url = myGlobals.host+'/api/admin/mappings/hotel_category/search'; //Guardo la URL completa del listado correspondiente
        body=JSON.stringify({ category_provider: this.search_map_categories, page_number: this._data_pagination.current_page, items_for_page: 10 });
    }
    else if(this.mappings_type_request_data == 'attraction_categories'){
        url = myGlobals.host+'/api/admin/mappings/attraction_category/search';
        body=JSON.stringify({ category_provider: this.search_map_categories, page_number: this._data_pagination.current_page, items_for_page: 10 });
    }
    else if(this.mappings_type_request_data == 'amenities'){
        url = myGlobals.host+'/api/admin/mappings/amenities/search';
        body=JSON.stringify({ amenity_provider: this.search_map_categories, page_number: this._data_pagination.current_page, items_for_page: 10 });
    }
    else if(this.mappings_type_request_data == 'chains'){
        url = myGlobals.host+'/api/admin/mappings/chains/search';
        body=JSON.stringify({ chain_provider: this.search_map_categories, page_number: this._data_pagination.current_page, items_for_page: 10 });
    }   
    else if(this.mappings_type_request_data == 'mealplans'){
        url = myGlobals.host+'/api/admin/mappings/mealplans/search';
        body=JSON.stringify({ mealplan_provider: this.search_map_categories, page_number: this._data_pagination.current_page, items_for_page: 10 });
    }   
    
    console.log('Body del request del Mappings Categories: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
     .map(response => {
        this.mappings_categories = []; //Clean array
        this.load.hide_loading_gif_bw(); //Remove loading gif

        if(this.mappings_type_request_data == 'hotel_categories'){ //Verify which mappings categories it is
            this._data_pagination.last_page = response.json().list_category_count;
            this.mappings_categories = response.json().list_category; //Guardo la URL completa del listado correspondiente
            this._data_pagination.total_page = response.json().list_category_count;
        }
        else if(this.mappings_type_request_data == 'attraction_categories'){
            this._data_pagination.last_page = response.json().list_category_count;
            this.mappings_categories = response.json().list_category;
            this._data_pagination.total_page = response.json().list_category_count;
        }
        else if(this.mappings_type_request_data == 'amenities'){
            this._data_pagination.last_page = response.json().list_amenity_count;
            this.mappings_categories = response.json().list_amenity;
            this._data_pagination.total_page = response.json().list_amenity_count;
        }
        else if(this.mappings_type_request_data == 'chains'){
            this._data_pagination.last_page = response.json().list_chain_count;
            this.mappings_categories = response.json().list_chain;
            this._data_pagination.total_page = response.json().list_chain_count;
        }
        else if(this.mappings_type_request_data == 'mealplans'){
            this._data_pagination.last_page = response.json().list_mealplan_count;
            this.mappings_categories = response.json().list_mealplan;
            this._data_pagination.total_page = response.json().list_mealplan_count;
        }

        console.log('COUNT: ' + JSON.stringify(this._data_pagination.last_page)); 
        //Total amount of number of pages 
        this._data_pagination.numbers_of_pages = Math.ceil(this._data_pagination.last_page/10); //11÷10
        this.numbers_of_pages  = Math.ceil(this._data_pagination.last_page/10);
        this._data_pagination.limit = this._data_pagination.numbers_of_pages;
        this._data_pagination.current_page = numberAndType.page;   
        this.current_page = numberAndType.page;   

        this._data_pagination.firstof_page = Math.ceil(numberAndType.page/this._data_pagination.limit_per_pages)*this._data_pagination.limit_per_pages-6;        

        console.log('response mappings TEST: ' + JSON.stringify(response.json()));  
        jQuery('.results-bar-wrapper, #mappings').fadeIn();
        console.log('MAPPINGS CATEGORIES: ' + JSON.stringify(this.mappings_categories));              
   
        return this._data_pagination; //Send back response to the call of the method to use as event_type variable                 
        }, error => {}
    ); 
}

} //Close class DataPropertiesMapCategories