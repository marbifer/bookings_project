import { Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable, Output } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams } from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import { CustomHttp } from '../../../services/http-wrapper';
import myGlobals = require('../../../../app');
import { Location } from '@angular/common';
import { LoadingGif } from '../../../bworkspace/filedetail/loading_gif.service';
import { UserActivityLog } from './user-activity-log';
import { myPagination } from '../../../settings/pagination-mappings/pagination.subcomponent';
import { DataPagination } from '../../../settings/pagination-mappings/data_pagination.service';
import { Core } from '../../../core/core';

declare var jQuery: any;
declare var $: any;

//////////////////////////////////////////////
/// Properties Activity Logs (Simple List) ///
//////////////////////////////////////////////
@Injectable()
export class DataPropertiesUserActivityLog{

	//Data List Activity Logs
	list_activity_logs: any;
	id_user = [];
	date_range_start = '';
	date_range_end = '';

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

	constructor(
        public http:Http, 
        public router: Router, 
        public location: Location, 
        public load: LoadingGif, 
        public _data_pagination: DataPagination
    ) {}

//////////////////////////////
/// Get List Activity Logs ///
get_activity_logs(id_user, numberAndType){
    this.load.show_loading_gif_bw(); //Show loading gif
    this.id_user = id_user;
    this._data_pagination.current_page = numberAndType.page;
    console.log('página actual data properties service: ' + this._data_pagination.current_page);
    let url = myGlobals.host+'/api/admin/customers/user/activity_log';

    let body = JSON.stringify({id_user: id_user, date_start: this.date_range_start, date_end: this.date_range_end, page_number: numberAndType.page, elements_for_page: 10});
    console.log('Body List Activity Logs: ' + body);
    console.log('número de páginas ' + this.number_of_pages);

    let headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post( url, body, {headers: headers, withCredentials:true})
        .map( response => {
            console.log('RESPONSE ACTIVITY LOG USERS: ' + JSON.stringify(response.json()));
            this.load.hide_loading_gif_bw(); //Remove loading gif
            this._data_pagination.last_page = response.json().count_logs;
            this._data_pagination.total_page = response.json().count_logs;
            //Total amount of number of pages 
            this._data_pagination.numbers_of_pages = Math.ceil(this._data_pagination.total_page/10); //11÷10
            this._data_pagination.limit = this._data_pagination.numbers_of_pages; 
            this.last_page = response.json().count_logs;
            this.total_page = response.json().count_logs;
            //Total amount of number of pages 
            this._data_pagination.firstof_page = Math.ceil(numberAndType.page/this._data_pagination.limit_per_pages)*this._data_pagination.limit_per_pages-6;        
          
            this.current_page = numberAndType.page;
            this.number_of_pages = Math.ceil(this.total_page/10); //11÷10
            this.limit = this.number_of_pages;

            this.list_activity_logs = []; //Clean array           
          	this.list_activity_logs = response.json().log_list; 
           
            return this._data_pagination; //Send back response to the call of the method to use as event_type variable    
        }, error => {
        }
      ); 
    }

} //Close class DataPropertiesUserActivityLog