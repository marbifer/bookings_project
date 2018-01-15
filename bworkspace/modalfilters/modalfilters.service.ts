import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import myGlobals = require('../../../app');
import { Location } from '@angular/common';
import {LoadingGif} from '../filedetail/loading_gif.service';
import {filter} from '../filter';
import { Observable } from "rxjs/Observable"
import { Subject }    from 'rxjs/Subject';

declare var jQuery: any;
declare var $: any;

@Injectable()
export class ModalFiltersService {

    private notify = new Subject<any>();
    notifyObservable = this.notify.asObservable();

    response_filters: any[]; //Request: Property filters
    filter_pax_array: string[];
    filter_loc_array: string[];
    filter_auto_cancel_array: any[];
    filter_status_array: any[];
    filter_service_array: any[];
    filter_provider_array: any[];
    filter_agency_array: string[];
    filter_destination_array: string[];
    filter_created_from_array: any[];
    filter_created_to_array: any[];
    filter_service_from_array: any[];
    filter_service_to_array: any[];
    come_from_modal=true;
    edit_filter = ''; //Pill name
    event_type = 'new'; //New pill or edit pill
    iteration: number; //i number
    filter_cancel: any = '';
    filter_status = [];
    filter_service = [];
    filter_provider = [];

    //Properties NgModel of modal_filters.ts
    content_input_pax: string = '';
    content_input_pax_backup: any;
    content_input_loc: string = '';
    content_input_loc_backup: any;
    content_input_agency: string = '';
    content_input_agency_backup: any;
    content_input_destination: string = '';
    content_input_destination_backup: any;
    content_input_created_from: any = '';
    content_input_created_from_backup: any;
    content_input_created_to: any = '';
    content_input_created_to_backup: any;
    content_input_service_from: any = '';
    content_input_service_from_backup: any;
    content_input_service_to: any = '';
    content_input_service_to_backup: any;

constructor() {
    this.filter_pax_array = new Array();
    this.filter_loc_array = new Array();
    this.filter_auto_cancel_array = new Array();
    this.filter_status_array = new Array();
    this.filter_service_array = new Array();
    this.filter_provider_array = new Array();
    this.filter_agency_array = new Array();
    this.filter_destination_array  = new Array();
    this.filter_created_from_array = new Array();
    this.filter_created_to_array = new Array();
    this.filter_service_from_array = new Array();
    this.filter_service_to_array = new Array();
}

clearModalFilters() {
    this.filter_pax_array = [];
    this.filter_loc_array = [];
    this.filter_auto_cancel_array = [];
    this.filter_status_array = [];
    this.filter_service_array = [];
    this.filter_provider_array = [];
    this.filter_agency_array = [];
    this.filter_destination_array = [];
    this.filter_created_from_array = [];
    this.filter_created_to_array = [];
    this.filter_service_from_array = [];
    this.filter_service_to_array = [];
}

    notifyOther(data: any) {
        if (data) {
          this.notify.next(data);
        }
    }
}//Close class ModalFiltersService



