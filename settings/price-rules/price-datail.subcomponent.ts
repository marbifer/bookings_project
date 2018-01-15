import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, OnInit, NgZone, Input, Output, ViewChild, OnDestroy} from '@angular/core';
import {Widget} from '../../core/widget/widget';
import {RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {Idle, DEFAULT_INTERRUPTSOURCES} from 'ng2-idle/core'; //For timeout
import {DialogRef} from 'angular2-modal';
import {Observable} from 'rxjs/Observable';
import {CustomHttp} from '../../services/http-wrapper';
import myGlobals = require('../../../app');
//import {NKDatetime} from 'ng2-datetime/ng2-datetime'; //Datepicker
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NgClass} from '@angular/common';
import {Modal, BS_MODAL_PROVIDERS as MODAL_P} from 'angular2-modal/plugins/bootstrap'; //Modal
import {Core} from '../../core/core';
import {Location} from '@angular/common';
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';
import {DataPropertiesPriceRules} from './data_properties.service';
import {editPriceRules} from './price-rules-detail/inline-price-rules/edit_price_rules.service'; //Inline Editing Price rules
import {ServiceType} from './../price-rules/price-rules-detail/service-type-subcomponent/service-type.subcomponent'; // Price Rules Inline Editing Service Type
import {Autocomplete} from './price-rules-detail/autocomplete-subcomponent/autocomplete.subcomponent';
import {TitleService} from '../../core/navbar/titles.service';
import {myPagination} from './../pagination-mappings/pagination.subcomponent';
import {DataPagination} from './../pagination-mappings/data_pagination.service';

declare var jQuery: any;
declare var $: any;

////////////////////
/// Price Rules ////
@Component({
  selector: 'price-detail',
  template: require('./price-datail-subcomponent.html'),
  styles: [require('./price-datail-subcomponent.scss')],
  //encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, [Widget], [myPagination], Autocomplete, ServiceType],
  providers: [MODAL_P, Modal, DataPagination] 
})

export class PriceDetailSubcomponent {   

    constructor(
      public _data_pagination: DataPagination, 
      public pag: myPagination, 
      public http: Http, 
      public params: RouteParams, 
      public router: Router, 
      public _titleService: TitleService,
      public modal: Modal, 
      public load: LoadingGif, viewContainer: ViewContainerRef, 
      public location: Location, 
      private ngZone: NgZone, 
      public _edit_price: editPriceRules,
      public _service: DataPropertiesPriceRules, 
      public _autocompletes: Autocomplete,
      public _service_type: ServiceType
    ) {
      modal.defaultViewContainer = viewContainer; //Modal   
    } //Close constructor

@Input() send_detail_data;
@Input() show_detail_send;
@Input() i;

ngOnInit(){ 
  /*$('.effective-start').datepicker({
    orientation: "bottom auto"
  });*/

  ///////////////////////////////////
  /// Detect if user is scrolling ///
  /*$('html, body').scroll(function(e) {
    if ($(this).is(':animated')) {
      //console.log('scroll happen by animate');
    } else if (e.originalEvent) {
      // scroll happen manual scroll
      //console.log('scroll happen manual scroll');
      jQuery('.effective-start').datepicker('remove');
      jQuery('.effective-end').datepicker('remove');
      jQuery('.service-start').datepicker('remove');
      jQuery('.service-end').datepicker('remove');
    } else {
      // scroll happen by call
      //console.log('scroll happen by call');
    }
  });*/

} //Close ngOnInit

  select_services(type_services, i){
    this._edit_price.select_services(type_services, i);
  }

  select_hotel_button(hotels, i){ 
    this._edit_price.select_hotel_button(hotels, i);
  }

  select_attraction_button(attractions, i){
    this._edit_price.select_attraction_button(attractions, i);
  }

  select_transfer_button(transfers, i){
    this._edit_price.select_transfer_button(transfers, i);
  }

  select_car_button(cars, i){
    this._edit_price.select_car_button(cars, i);
  }

  select_cruise_button(cruises, i){
    this._edit_price.select_cruise_button(cruises, i);
  }

  select_flight_button(flights, i){
    this._edit_price.select_flight_button(flights, i);
  }

  select_package_button(packages, i){
    this._edit_price.select_package_button(packages, i);
  }

  select_insurance_button(insurances, i){
    this._edit_price.select_insurance_button(insurances, i);
  }
  
  select_agencies_button(agencies, i){
    this._edit_price.select_agencies_button(agencies, i);
  }

  select_int_prov_button(int_prov, i){
    this._edit_price.select_int_prov_button(int_prov, i);
  }

  select_ext_prov_button(ext_prov, i){
    this._edit_price.select_ext_prov_button(ext_prov, i);
  }

  select_destination_button(destination, i){
    this._edit_price.select_destination_button(destination, i);
  }

  select_buttons_calculation(number, i){
    this._edit_price.select_buttons_calculation(number, i);
  }

  select_buttons_rule_type(number, i){
    this._edit_price.select_buttons_rule_type(number, i);
  }

  remove_item(type, i, z){
    this._edit_price.remove_item(type, i, z);
  }

  cancel_edit_price_rules(i){
    this._edit_price.cancel_edit_price_rules(i);
  }

  select_currency(name, code, i){
    this._edit_price.select_currency(name, code, i);
  }

  save_form_price_rules(send_mail, i){
    this._edit_price.save_form_price_rules(send_mail, i);
  }

  ///////////////////////////////////////////////////////
  /// Method Focus for all SECTION: Table Price Rules ///
  focus_price_rules(i) {
    jQuery('.rule-name, .effective-start, .effective-end, .new-price-range-start, .new-price-range-end, .days-to, .service-start, .service-end, .new-amount').removeClass('border-errors'); //Table Price Rules Exist
    //Hide message errors
    this._edit_price.message_name = '';
    this._edit_price.message_amount_start = '';
    this._edit_price.message_amount_end = '';
    this._edit_price.field_error_price_rules = '';
    this._edit_price.message_effective_date_start = '';
    this._edit_price.message_effective_date_end = '';
    this._edit_price.message_days_before_to = '';
    this._edit_price.message_service_date_start = '';
    this._edit_price.message_service_date_end = '';
    this._edit_price.message_amount = '';
    this._edit_price.general_error_price_rules_save = '';
  }

  //////////////////////////////////////////////////////
  /// Method Blur for all sections: Form Price Rules ///
  blur_name(){
    jQuery('.rule-name, .effective-start, .effective-end, .new-price-range-start, .new-price-range-end, .days-to, .service-start, .service-end, .new-amount').removeClass('border-errors'); //Table Price Rulest Users
    //jQuery(''.rule-name, .effective-start, .effective-end, .new-price-range-start, .new-price-range-end, .days-to, .service-start, .service-end, .new-amount').removeClass('border-errors'); //Table New Price Rules
  }

//////////////////////////////
/// Add line in Datepicker ///
line_picker(){
  jQuery('#new-row').remove();
  var selector_row ='table.table-condensed thead tr:nth-child(2)';
  jQuery(selector_row).after('<tr id="new-row"><td id="no-space" colspan="7"><hr class="line-date"></td></tr>'); 

  $('html, body').one("scroll", function() {
      jQuery('.effective-start').datepicker('remove');
      jQuery('.effective-end').datepicker('remove');
      jQuery('.service-start').datepicker('remove');
      jQuery('.service-end').datepicker('remove');
  });
}

/////////////////////////////////////////////
/// Icons of the table for Ext. Providers ///
mouseover_icons(icons){
    var icon = 'i.' + icons;
    jQuery(icon).tooltip('show');
}
mouseleave_icons(icons){
    var icon = 'i.' + icons;
    jQuery(icon).tooltip('hide');
}

} // Close class Price Rules