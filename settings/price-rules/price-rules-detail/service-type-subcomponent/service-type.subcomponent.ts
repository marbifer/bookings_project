 import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, Input,Pipe, ElementRef, OnInit, OnChanges, SimpleChange, NgZone , ViewChild , OnDestroy} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {Idle, DEFAULT_INTERRUPTSOURCES} from 'ng2-idle/core'; //For timeout
import {DialogRef} from 'angular2-modal';
import myGlobals = require('../../../../../app');
import {RolloverAutocompletes} from '../../../../customers/rollovers-dropdown.service';
import {Observable} from 'rxjs/Observable';
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NgClass} from '@angular/common';
import {Modal, BS_MODAL_PROVIDERS as MODAL_P} from 'angular2-modal/plugins/bootstrap'; //Modal
import {Location} from '@angular/common';
//import {DataPropertiesPriceRules} from './data_properties.service';
import {editPriceRules} from '../inline-price-rules/edit_price_rules.service'; //Inline Editing Price rules
import {Autocomplete} from '../../price-rules-detail/autocomplete-subcomponent/autocomplete.subcomponent';
import {CapitalizeFirstPipe } from './capitalizefirst.pipe';

declare var jQuery: any;
declare var $: any;

/////////////////////////////////////////
/// Price Rules SECTION: Service Type ///
@Component({
  pipes: [CapitalizeFirstPipe],
  selector: 'servicetype-subcomponent',
  template: require('./service-type-subcomponent.html'),
  directives: [ROUTER_DIRECTIVES, Autocomplete],
  providers: [MODAL_P],
  styles: [require('./service-type-subcomponent.scss')]
})

export class ServiceType {

  constructor(
    public http: Http, 
    public _rol: RolloverAutocompletes, 
    public _edit_price: editPriceRules, 
    public _autocompletes: Autocomplete
 ) {}

  @Input() i;
  @Input() service_type_type;
  @Input() title;

  ngOnInit(){} //Close ngOnInit 
} // Close class ServiceType