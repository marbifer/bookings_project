import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import myGlobals = require('../../../app');
import { Location } from '@angular/common';
import {filters} from '../filters';

declare var jQuery: any;
declare var $: any;

@Injectable()
export class ModalFiltersServiceUsers {

    response_filters: any[]; //Request: Property filters
    filter_name_array: string[];
    filter_surname_array: string[];
    filter_email_array: any[];
    filter_agency_array: any[];
    filter_phone_number_array: any[];
    filter_address_array: any[];
    filter_city_array: any[];
    filter_state_array: string[];
    filter_country_array: string[];
    filter_zip_array: string[];
    filter_status_array: any[];
    filter_has_bookings_array: any[];
    come_from_modal=true;
    edit_filter = ''; //Pill name
    event_type = 'new'; //New pill or edit pill
    iteration: number; //i number
    filter_book: string = '';
    filter_status: string = '';

    //Properties NgModel of modal_filters.ts
    content_input_name: string = '';
    content_input_name_backup: any;
    content_input_surname: string = '';
    content_input_surname_backup: any;
    content_input_email: string = '';
    content_input_email_backup: any;
    content_input_phone: string = '';
    content_input_phone_backup; any;
    content_input_agency: string = '';
    content_input_agency_backup: any;
    content_input_address: string = '';
    content_input_address_backup: any;
    content_input_city: string = '';
    content_input_city_backup: any;
    content_input_state: string = '';
    content_input_state_backup: any;
    content_input_country: string = '';
    content_input_country_backup: any;
    content_input_zip: string = '';
    content_input_zip_backup: any;
    content_input_has_bookings: string;

    showPaginationFilter:boolean  = true;
    triggerInfo:any = false;

    constructor() {
        this.filter_name_array = new Array();
        this.filter_surname_array = new Array();
        this.filter_agency_array = new Array();
        this.filter_email_array = new Array();
        this.filter_phone_number_array = new Array();
        this.filter_city_array = new Array();
        this.filter_state_array = new Array();
        this.filter_country_array  = new Array();
        this.filter_address_array = new Array();
        this.filter_city_array = new Array();
        this.filter_zip_array = new Array();
        this.filter_status_array = new Array();
        this.filter_has_bookings_array = new Array();
    }

    clearModalFilter() {
        this.filter_name_array = [];
        this.filter_surname_array = [];
        this.filter_agency_array = [];
        this.filter_email_array = [];
        this.filter_phone_number_array = [];
        this.filter_city_array = [];
        this.filter_state_array = [];
        this.filter_country_array  = [];
        this.filter_address_array = [];
        this.filter_city_array = [];
        this.filter_zip_array = [];
        this.filter_status_array = [];
        this.filter_has_bookings_array = [];
    }

}// close class ModalFiltersService



