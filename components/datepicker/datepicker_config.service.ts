import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import myGlobals = require('../../../app');
import { Location } from '@angular/common';
import { Observable } from "rxjs/Observable"
import { Subject }    from 'rxjs/Subject';

declare var jQuery: any;
declare var $: any;

@Injectable()
export class datepickerConfig {
   
    //Date Range
    datepicker_name: string; //Text name Datepickers

    constructor() {}

    init_configuration(type){
        if(type == 'step4'){ //Copy and paste as new conditional for new calls 
            this.datepicker_name = 'DAYS';        
        }
        if(type == 'step_1_general' || type ==  'date_step_1_hotel' || type ==  'date_step_1_transfer' || type ==  'date_step_1_car' || type ==  'date_step_1_insurance'){ 
            this.datepicker_name = 'Service Dates';        
        }

        //Copy and paste HERE as new conditional for new calls              
    }

}//Close class datepickerConfig



