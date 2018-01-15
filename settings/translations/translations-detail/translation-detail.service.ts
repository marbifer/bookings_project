import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {CustomHttp} from '../../../services/http-wrapper';
import myGlobals = require('../../../../app');
import {Location} from '@angular/common';
import {LoadingGif} from '../../../bworkspace/filedetail/loading_gif.service';
import {RolloverAutocompletes} from '../../../customers/rollovers-dropdown.service';
import {Translations} from '../../translations/translations';
import {DataPropertiesTranslations} from '../../translations/data_properties.service';
import {Core} from '../../../core/core';

declare var jQuery: any;
declare var $: any;
export var ObjectExtProvider;

import { Observable } from "rxjs/Observable"
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class translationDetailService{

private notify = new Subject<any>();
notifyObservable$ = this.notify.asObservable();

  //Request Get Data to generate forms
 
constructor(public http: Http, public location: Location, public _service: DataPropertiesTranslations, public load: LoadingGif, public _rol: RolloverAutocompletes) {
}

notifyOther(data: any) {
	if (data) {
	  this.notify.next(data);
	}
}
    
}