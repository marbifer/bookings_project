import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import myGlobals = require('../../../app');
import { Location } from '@angular/common';
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';
import {RolloverAutocompletes} from '../../customers/rollovers-dropdown.service';
import {Agencies} from './agencies';
import {filters} from '../filters'; //Model Backend
import {Core} from '../../core/core';
import {DataPagination} from '../../settings/pagination-mappings/data_pagination.service';

declare var jQuery: any;
declare var $: any;
export var filter: string="";

///////////////////////////////////////////////////
/// Properties List Agencies (Simple List) ///

@Injectable()
export class DataPropertiesListAgencies{

//Data List Agencies
list_agencies: any;

//Pagination
search_map_agencies : any;
current_page: any;
total_page: any;
number_of_pages: any;
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

//Inline editing Agency Detail(Form)
id_agency: any;

constructor(public http:Http, public load: LoadingGif, public _rol: RolloverAutocompletes, public _filters: filters,
 public _loc: Location,  public _data_pagination: DataPagination) {}

///////////////////////////////////////
/// Get All List Agencies Data ///
get_list_agencies(numberAndType){
    this.load.show_loading_gif_bw(); //Show loading gif
    this._data_pagination.current_page = numberAndType.page;
    console.log('página actual data properties service: ' + this._data_pagination.current_page);
    let url = myGlobals.host+'/api/admin/customers/agency/search';

    let body=JSON.stringify({ filters: JSON.stringify(this._filters), page_number: this._data_pagination.current_page, agencys_for_page: 10 });
    console.log('Body List Agencies: ' + body);
    console.log('FILTROS ' + JSON.stringify(this._filters));
    console.log('número de páginas ' + this.number_of_pages);

    let headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post( url, body, {headers: headers, withCredentials:true})
        .map( response => {
            console.log('RESPONSE FILTROS33: ' + JSON.stringify(response.json()));
            this.load.hide_loading_gif_bw(); //Remove loading gif
            this._data_pagination.last_page = response.json().agencys_count;
            this._data_pagination.total_page = response.json().agencys_count;
            //Total amount of number of pages 
            this._data_pagination.numbers_of_pages = Math.ceil(this._data_pagination.total_page/10); //11÷10
            this._data_pagination.limit = this._data_pagination.numbers_of_pages; 
            this.last_page = response.json().agencys_count;
            this.total_page = response.json().agencys_count;
            //Total amount of number of pages 
            this._data_pagination.firstof_page = Math.ceil(numberAndType.page/this._data_pagination.limit_per_pages)*this._data_pagination.limit_per_pages-6;        
          
            this.current_page = numberAndType.page;
            this.number_of_pages = Math.ceil(this.total_page/10); //11÷10
            this.limit = this.number_of_pages;

            this.list_agencies = []; //Clean array
            this._filters.number_of_page=this.current_page; //Store selected page on filter object
            
          	this.list_agencies = response.json().agencies;
            this.id_agency =  this.list_agencies.id; 
           
            return this._data_pagination; //Send back response to the call of the method to use as event_type variable    
        }, error => {
        }
      ); 
    }
} //Close class DataPropertiesListAgencies