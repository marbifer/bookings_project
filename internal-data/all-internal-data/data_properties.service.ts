import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {CustomHttp} from '../../services/http-wrapper';
import myGlobals = require('../../../app');
import {Location} from '@angular/common';
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';
import {InternalData} from './internal-data';

// Pagination
import {myPagination} from '../../settings/pagination-mappings/pagination.subcomponent';
import {DataPagination} from '../../settings/pagination-mappings/data_pagination.service';
//import {myPaginationAmenities} from '../pagination-mappings-amenities/pagination.subcomponent';
import {Core} from '../../core/core';

declare var jQuery: any;
declare var $: any;

//////////////////////////////////////////////////
/// Properties All internal Data (Simple List) ///
@Injectable()
export class DataPropertiesInternalData {

    //Internal Data
    amenities: any;
    search_all_internal_data: any = '';

    //Pagination
    current_page: any;
    total_page: any;
    numbers_of_pages: any;
    array_pages=[];
    limit: any; 
    count_items: any; 
    last_page: any; 
    limit_per_pages: number = 7;
    firstof_page = 1; //First page of following page
    next_pages_u : any;
    blocker_next = false; //Stop propagation

    //Delete single Mapping
    list_id = []; 
    toggle_status = true;
    is_filtrable_status = true;
    internal_type_request_data: any;
    showTd:any = [];
    constructor(
        public http:Http, 
        public router: Router, 
        public location: Location, 
        public load: LoadingGif,
        public _data_pagination: DataPagination
    ) {}

////////////////////////////
/// Get All Interna Data ///
get_all_internal_data(letter, numberAndType){
    this.load.show_loading_gif_bw(); //Show loading gif
    this.search_all_internal_data = letter;
    this._data_pagination.current_page = numberAndType.page;
    console.log('página actual data properties service: ' + this._data_pagination.current_page);
    var url;
    var body;
    if(this.internal_type_request_data == 'amenities'){
        url = myGlobals.host+'/api/admin/internal_data/amenity/search';
        body = JSON.stringify({ amenity_name: this.search_all_internal_data, page_number: this._data_pagination.current_page, items_for_page: 10 });
    }
    else if(this.internal_type_request_data == 'accessibilities'){
        url = myGlobals.host+'/api/admin/internal_data/accessibility/search';
        body = JSON.stringify({ accessibility_name: this.search_all_internal_data, page_number: this._data_pagination.current_page, items_for_page: 10 });
    }
    else if(this.internal_type_request_data == 'attraction_categories'){
        url = myGlobals.host+'/api/admin/internal_data/attraction_category/search';
        body=JSON.stringify({ attraction_category_name: this.search_all_internal_data, page_number: this._data_pagination.current_page, items_for_page: 10 });
    }
    else if(this.internal_type_request_data == 'chains'){
        url = myGlobals.host+'/api/admin/internal_data/chain/search';
        body=JSON.stringify({ chain_name: this.search_all_internal_data, page_number: this._data_pagination.current_page, items_for_page: 10 });
    }
    else if(this.internal_type_request_data == 'classifications'){
        url = myGlobals.host+'/api/admin/internal_data/classification/search';
        body=JSON.stringify({ classification_name: this.search_all_internal_data, page_number: this._data_pagination.current_page, items_for_page: 10 });
    }
    else if(this.internal_type_request_data == 'hotel_categories'){
        url = myGlobals.host+'/api/admin/internal_data/hotel_category/search';
        body=JSON.stringify({ hotel_category_name: this.search_all_internal_data, page_number: this._data_pagination.current_page, items_for_page: 10 });
    }

    console.log('Body del request del Mappings amenities: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    this.current_page = numberAndType.page;

    return this.http.post( url, body, {headers: headers, withCredentials:true})    
     .map(response => {
        this.amenities = []; //Clean array
        this.load.hide_loading_gif_bw(); //Remove loading gif

        if(this.internal_type_request_data == 'amenities'){
            this._data_pagination.last_page = response.json().list_amenity_count;
            this.amenities = response.json().list_amenity;
            this._data_pagination.total_page = response.json().list_amenity_count;
            this.last_page = response.json().list_amenity_count;
            this.total_page = response.json().list_amenity_count;
        }
        else if(this.internal_type_request_data == 'accessibilities'){
            this._data_pagination.last_page = response.json().list_accessibility_count;
            this.amenities = response.json().list_accessibility;
            this._data_pagination.total_page = response.json().list_accessibility_count;
            this.last_page = response.json().list_accessibility_count;
            this.total_page = response.json().list_accessibility_count;
        }
        else if(this.internal_type_request_data == 'attraction_categories'){
            this._data_pagination.last_page = response.json().list_attraction_category_count;
            this.amenities = response.json().list_attraction_category;
            this._data_pagination.total_page = response.json().list_attraction_category_count;
            this.total_page = response.json().list_attraction_category_count;            
         } 
         else if(this.internal_type_request_data == 'chains'){
            this._data_pagination.last_page = response.json().list_chain_count;
            this.amenities = response.json().list_chain;
            this._data_pagination.total_page = response.json().list_chain_count;
            this.total_page = response.json().list_chain_count;            
         }
         else if(this.internal_type_request_data == 'classifications'){
            this._data_pagination.last_page = response.json().list_classification_count;
            this.amenities = response.json().list_classification;
            this._data_pagination.total_page = response.json().list_classification_count;
            this.total_page = response.json().list_classification_count;            
         } 
         else if(this.internal_type_request_data == 'hotel_categories'){
            this._data_pagination.last_page = response.json().list_hotel_category_count;
            this.amenities = response.json().list_hotel_category;
            this._data_pagination.total_page = response.json().list_hotel_category_count;
            this.total_page = response.json().list_hotel_category_count;            
         }      
        console.log('List of amenities: ' + JSON.stringify(this.amenities));  
        console.log('COUNT: ' + JSON.stringify(this._data_pagination.total_page)); 
        //Total amount of number of pages 
        this._data_pagination.numbers_of_pages = Math.ceil(this._data_pagination.total_page/10); //11÷10
        this.numbers_of_pages  = Math.ceil(this._data_pagination.total_page/10); //11÷10
        this._data_pagination.limit = this._data_pagination.numbers_of_pages;
        this._data_pagination.firstof_page = Math.ceil(numberAndType.page/this._data_pagination.limit_per_pages)*this._data_pagination.limit_per_pages-6;        
        this._data_pagination.current_page = numberAndType.page;
            
        jQuery('.bg-title-ame, #amenities').fadeIn(); 
        return  this._data_pagination; //Send back response to the call of the method to use as event_type variable          
    }, error => {}
  ); 
}

clearCollapsables() {
    for (var q = 0; q < this.amenities.length; ++q) {
        this.showTd[q] = false;
    }
}

} //Close class DataPropertiesInternalData