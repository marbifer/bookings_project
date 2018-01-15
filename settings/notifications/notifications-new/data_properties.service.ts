import { Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import myGlobals = require('../../../../app');
import { Location } from '@angular/common';
import { LoadingGif } from '../../../bworkspace/filedetail/loading_gif.service';
import { Notifications } from '../notifications';
import { Core } from '../../../core/core';
import { DataPagination } from '../../pagination-mappings/data_pagination.service';

declare var jQuery: any;
declare var $: any;

///////////////////////////////////////////////////
/// Properties External Providers (Simple List) ///
@Injectable()
export class DataPropertiesNotificationsNew{

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
    public load: LoadingGif, 
    public _data_pagination: DataPagination
) {}


} //Close class DataPropertiesNotifications