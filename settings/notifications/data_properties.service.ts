import { Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable, Output } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams } from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import { CustomHttp } from '../../services/http-wrapper';
import myGlobals = require('../../../app');
import { Location } from '@angular/common';
import { LoadingGif } from '../../bworkspace/filedetail/loading_gif.service';
import { Notifications } from './notifications';
import { myPagination } from '../../settings/pagination-mappings/pagination.subcomponent';
import { DataPagination } from '../pagination-mappings/data_pagination.service';
import { Core } from '../../core/core';

declare var jQuery: any;
declare var $: any;

///////////////////////////////////////////////////
/// Properties Notifications (Simple List) ///
@Injectable()
export class DataPropertiesNotifications{

//Data External Providers
notifications: any;
search_notifications: any = '';

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
id_notification: any;

    constructor(
        public http:Http,
        public router: Router,
        public location: Location,
        public load: LoadingGif,
        public _data_pagination: DataPagination
    ) {}

///////////////////////////////////
/// Get All notifications Data ///
get_notifications(letter, numberAndType){
    this.load.show_loading_gif_bw(); //Show loading gif
    this.search_notifications = letter;
    this._data_pagination.search_map_categories = letter;

    this._data_pagination.current_page = numberAndType.page;
    this.current_page =  numberAndType.page;
    let url = myGlobals.host+'/api/admin/settings/notification_rule/search';

    let body=JSON.stringify({
        name: this.search_notifications,
        page_number: numberAndType.page,
        notification_rules_for_page: 10
    });

    console.log('Body del request de notifications: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .map(
        response => {
            
            this._data_pagination.last_page = response.json().notification_rules_count;
            this._data_pagination.total_page = response.json().notification_rules_count;

            this._data_pagination.numbers_of_pages = Math.ceil(this._data_pagination.last_page/10); //11÷10
            this.numbers_of_pages = Math.ceil(this._data_pagination.last_page/10); //11÷10

            this._data_pagination.limit = this._data_pagination.numbers_of_pages;

            this._data_pagination.current_page = numberAndType.page;
                    
            this._data_pagination.firstof_page = Math.ceil(numberAndType.page/this._data_pagination.limit_per_pages)*this._data_pagination.limit_per_pages-6;        
            this.notifications = []; //Clean array
            this.load.hide_loading_gif_bw(); //Remove loading gif
            this.notifications = response.json().notification_rules;
            this.id_notification = this.notifications.id;
            jQuery('.bg-title-cur, #notificationsTable').fadeIn();
            console.log('notifications: ' + JSON.stringify(this.notifications));              
        
            return this._data_pagination; //Send back response to the call of the method to use as event_type variable                 
        }, error => {}
    ); 
}

} //Close class DataPropertiesNotifications