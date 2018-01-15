import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, OnInit, NgZone , Input, Output, ViewChild , OnDestroy} from '@angular/core';
import {Widget} from '../../core/widget/widget';
import {RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {Idle, DEFAULT_INTERRUPTSOURCES} from 'ng2-idle/core'; //For timeout
import {DialogRef} from 'angular2-modal';
import {Observable} from 'rxjs/Observable';
import {CustomHttp} from '../../services/http-wrapper';
import myGlobals = require('../../../app');
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NgClass} from '@angular/common';
import {Core} from '../../core/core';
import {Location} from '@angular/common';
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';


declare var jQuery: any;
declare var $: any;

////////////////////
/// IFE ////
@Component({
  selector: 'dropdown-currency',
  template: require('./dropdown_currency.html'),
  styles: [require('./dropdown_currency.scss')],
  //encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, [Widget]],
  providers: []
})

export class dropdownCurrency {
    is_default :any;
    currency_symbols: any; //Dropdown Provider Cost
    currency_code:any ;  //Dropdown Provider Cost 4 by default
    dropdown_symbol:any; //Dropdown Provider Cost '$'
    currency_default_symbol = [];

    constructor(
      public http: Http,
      public params: RouteParams,
      public router: Router,
      public load: LoadingGif, 
      viewContainer: ViewContainerRef,
      public location: Location,
      private ngZone: NgZone
    ) {

} //Close constructor

@Input() currency_code_from_parent;

ngOnInit(){ 
  this.currency_code = this.currency_code_from_parent;
  this.dropdown_symbol = '$'; //Dropdown Provider Cost '$'
} //Close ngOnInit

/////////////////////////////////////////////////////////////////////////////////////////////
/// Request data list Fields Provider Cost, Taxes, Client Sale and It will cost(Dropdowns) ///
get_list_currency() {
  let url = myGlobals.host+'/api/admin/currency_symbol_autocomplete';
  let headers = new Headers({ 'Content-Type': 'application/json' });

      this.http.get( url, {headers: headers, withCredentials:true})
        .subscribe(
          response => {
            console.log('RESPUESTA IFE STEP 3(Provider Cost DROPDOWN): ' + JSON.stringify(response.json()));
            this.currency_symbols = response.json().currency_symbols;
            //this.is_default = this.currency_symbols.is_default;
          }, error => {}
      );
  }

 ////////////////////////////////////////////////////////////////////////////////////////////////////////
 /// Section IFE SPEP 3: Select field Provider, Taxes, Client Sale and It will cost Cost for Dropdown ///
  select_currency(name, code){
      this.dropdown_symbol = name;
      console.log('Select currency name: ' +  this.dropdown_symbol);
      this.currency_code = code;
      console.log('Select currency code: ' + this.currency_code);
  }

} // Close class dropdownCurrency
