import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import myGlobals = require('../../../app');
import {Location} from '@angular/common';
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';
import {RolloverAutocompletes} from '../../customers/rollovers-dropdown.service';
import {Users} from './users';
import {filtersUser} from '../filtersUsers'; //Model Backend
import {Core} from '../../core/core';
import {DataPagination} from '../../settings/pagination-mappings/data_pagination.service';

declare var jQuery: any;
declare var $: any;
export var filter: string="";

///////////////////////////////////////////////////
/// Properties List Users (Simple List) ///

@Injectable()
export class DataPropertiesListUsers{

//Data List Users
list_users: any;
search_users: any = '';
count_users_data_table: any;

//Pagination
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
//toggle_status = true;
toggle_status:any;
general_toggle_status = 2;

//Select All(checkboxes)
select_all_status = true;

//Inline editing User Detail(Form User Exist)
id_agency: any;

constructor(
    public http: Http, 
    public load: LoadingGif, 
    public _rol: RolloverAutocompletes,
    public _filters: filtersUser, 
    public _loc: Location,  
    public _data_pagination: DataPagination
) {}

///////////////////////////////////////
/// Get All List Users Data ///
get_list_users(number_of_page){
    this.load.show_loading_gif_bw(); //Show loading gif
    this._data_pagination.current_page = number_of_page.page;
    let url = myGlobals.host+'/api/admin/customers/user/search';
    let body = JSON.stringify({ filters: JSON.stringify(this._filters), page_number: this._data_pagination.current_page , users_for_page: 10 });
    console.log('Body List USERS: ' + body);
    console.log('FILTROSssSSssSSsssSS ' + JSON.stringify(this._filters));

    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post(url, body, {headers: headers, withCredentials:true})
        .map( response => {
            console.log('RESPUESTAAAA>>>>> '+JSON.stringify(response.json()));
            this.load.hide_loading_gif_bw(); //Remove loading gif
            this._data_pagination.last_page = response.json().users_count;
            this._data_pagination.total_page = response.json().users_count;
            this.total_page = response.json().users_count;
            //Total amount of number of pages 
            this._data_pagination.numbers_of_pages = Math.ceil(this._data_pagination.total_page/10); //11÷10
            this._data_pagination.limit = this._data_pagination.numbers_of_pages;
            this.number_of_pages = Math.ceil(this._data_pagination.total_page/10); 
            this._data_pagination.current_page = number_of_page.page; //Store selected page on filter object
            this.current_page = number_of_page.page;
            this.list_users = []; //Clean array
            this._filters.number_of_page =  this._data_pagination.current_page; //Store selected page on filter object
            
            this._data_pagination.firstof_page = Math.ceil(number_of_page.page/this._data_pagination.limit_per_pages)*this._data_pagination.limit_per_pages-6;          
            this.list_users = response.json().users;
            console.log('USERS data table: ' + JSON.stringify(this.list_users));
            this.count_users_data_table = this.list_users.length; //Count
            console.log('CANTIDAD TABLE USERS88: ' + this.count_users_data_table);
            /*if(event_type=='select' || event_type=='next' || event_type=='prev' ){
              this._filters.replace_string(); //Change "/" to "-"
              var get_url = this._filters.create_url(); 
              console.log('/app/customers/list-agencies;' + get_url);
              this._loc.go('/app/customers/list-agencies;'+ get_url);
            }*/
            return this._data_pagination; //Send back response to the call of the method to use as event_type variable    
        }, error => {
        }
      ); 
    }
} //Close class DataPropertiesListUsers