import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import myGlobals = require('../../../app');
import { Location } from '@angular/common';
import { Observable } from "rxjs/Observable"
import { Subject }    from 'rxjs/Subject';

declare var jQuery: any;
declare var $: any;

@Injectable()
export class autocompleteConfig {
    url: any;
    items_count: any;
    name: any;
    general_error: any;
    exist_error: any;
    body_key: any;

    constructor() {}

    init_configuration(type){
        if(type == 'providers'){ //Copy and paste as new conditional for new calls
            this.url = '/api/admin/internal_provider_autocomplete'; //myGlobals.host+ '/api/admin/internal_provider_autocomplete'
            this.items_count = 5; //Autocomplete_items_count of body
            this.name = 'internal_provider_list'; //e.g.: response.json().internal_provider_list
            this.general_error = 'general_error'; 
            this.exist_error = 'exist_error';
            this.body_key = 'internal_provider'; //Change variable of Body
        }
        if (type == 'city') {
            this.url = '/api/admin/city_autocomplete'; //myGlobals.host+ '/api/admin/internal_provider_autocomplete'
            this.items_count = 5; //Autocomplete_items_count of body
            this.name = 'location_list'; //e.g.: response.json().location_list
            this.general_error = 'general_error'; 
            this.exist_error = 'exist_error';
            this.body_key = 'city'; //Change variable of Body
        }
        if (type == 'administrators') {
            this.url = '/api/admin/user_not_admin_autocomplete'; //myGlobals.host+ '/api/admin/internal_provider_autocomplete'
            this.items_count = 5; //Autocomplete_items_count of body
            this.name = 'users_list'; //e.g.: response.json().users
            this.general_error = 'general_error'; 
            this.exist_error = 'exist_error';
            this.body_key = 'user'; //Change variable of Body
        }
    }

}//Close class autocompleteConfig



