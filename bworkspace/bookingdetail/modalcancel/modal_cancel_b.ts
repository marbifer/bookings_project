import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef } from '@angular/core';
import {Widget} from '../../../core/widget/widget';
import {RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import { Idle, DEFAULT_INTERRUPTSOURCES } from 'ng2-idle/core'; //For timeout
import { DialogRef } from 'angular2-modal';
import {Observable} from 'rxjs/Observable';
import {CustomHttp} from '../../../services/http-wrapper';
import {NKDatetime} from 'ng2-datetime/ng2-datetime'; //Datepicker
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NgClass} from '@angular/common';
import { Modal, BS_MODAL_PROVIDERS as MODAL_P } from 'angular2-modal/plugins/bootstrap'; //Modal
import {Core} from '../../../core/core';
import { Location } from '@angular/common';
import myGlobals = require('../../../../app');
import {BookingDetail} from '../../bookingdetail/bookingdetail';
import {LoadingGif} from '../../../bworkspace/filedetail/loading_gif.service';
import {DataPropertiesBookings} from '../../../bworkspace/bookingdetail/data_properties.service';
//import {RecordLocator} from '../../../bworkspace/filedetail/inlineediting/editlocator.service';
//import {EditPassenger} from '../../../bworkspace/filedetail/inlineediting/editpassenger.service';

declare var jQuery: any;
declare var $: any;
///////////////////////////////////
/// Modal cancel Booking Detail ///
@Component({
  selector: 'modal_cancel_bookings',
  template: require('./modal_cancel_b.html'),
  //encapsulation: ViewEncapsulation.None,  
  styles: [require('./modal_cancel_b.scss')],
  directives: [ROUTER_DIRECTIVES, [Widget]],
  providers:[] //Import class
})

export class modal_cancel_bookings {

//Response button "yes" modal for Cancel Bookings
response_cancel_b: any;
state_bookings: boolean;
state_bookings_success: boolean=false;
state_bookings_error: boolean=false;
state_bookings_close:boolean=false;

constructor(
  public modal: Modal, public load: LoadingGif,
  public http: Http, public _propertiesb: DataPropertiesBookings, 
  public params: RouteParams, /*public router: Router,
  public _loc:Location, public loc: RecordLocator(inline editing), public editpass: EditPassenger, */ 
  viewContainer: ViewContainerRef) {
  modal.defaultViewContainer = viewContainer; //Modal Cancel 
}

///////////////////////////////////////////////////
/// Method Cancel button "Yes" for modal Cancel ///
cancel_bookings(){
  this.load.show_loading_gif(); //Show loading gif
  jQuery('#msg-failed-b').hide(); 
  var id_bookings = this._propertiesb.id_bookings.toString();
  console.log('Lo que te mando: '  + id_bookings);
	let url = myGlobals.host+'/api/admin/booking_workspace/booking_detail/cancel';

  let body=JSON.stringify({ id: id_bookings });
  console.log('body: ' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });
      this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe( 
          response => {
            this.state_bookings_close = true;
          	this.response_cancel_b = response.json();
            console.log('Cancel BOOKING response: ' + JSON.stringify(this.response_cancel_b));
            this.state_bookings = (JSON.stringify(this.response_cancel_b.canceled)  ==  "true" ); //Save state
            console.log('Cancel BOOKING save state: ' + this.state_bookings);
            if(this.state_bookings == true){ 
              this._propertiesb.get_booking_detail(this.params.get("id_bookings")).subscribe();
              this.state_bookings_success =true;
              this.state_bookings_error = false;
               console.log('canceló ok');   
              jQuery('#msg-success-b').fadeIn('slow'); //show message success
              jQuery('#width-cancel-bookings').hide(); //Hide modal buttons
              jQuery('#close-modal-b').show(); //Show button close modal
            }else if(this.state_bookings == false){ 
              this.state_bookings_success = false;
              this.state_bookings_error = true;
              console.log('NO canceló'); 
              jQuery('#msg-failed-b').fadeIn('slow');//show message failed
            }       
              this.load.hide_loading_gif(); //Remove loading gif
          }, error => {
          }
      ); 
}

//Button 'NO' for modal and return Booking detail
remove_modal_booking(){
  jQuery("modal-backdrop").hide();
  jQuery("body").removeClass('modal-open');
}

}//Close class modal_cancel_bookings