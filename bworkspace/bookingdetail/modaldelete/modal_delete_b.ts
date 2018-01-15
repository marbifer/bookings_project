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

/////////////////////////////
/// Modal Delete Bookings ///
@Component({
  selector: 'modal_delete_bookings',
  template: require('./modal_delete_b.html'),
  //encapsulation: ViewEncapsulation.None,  
  styles: [require('./modal_delete_b.scss')],
  directives: [ROUTER_DIRECTIVES, [Widget]],
  providers:[] //Import class
})

export class modal_delete_bookings {

//Response button "yes" modal for Delete Booking Detail
response_delete_b: any;
    
constructor(
  public modal: Modal, public load: LoadingGif, public http: Http, /*public params: RouteParams, public router: Router,
  public _loc:Location, public loc: RecordLocator, public editpass: EditPassenger, */ 
  viewContainer: ViewContainerRef, public _propertiesb: DataPropertiesBookings) {
  modal.defaultViewContainer = viewContainer; //Modal Delete 
}

///////////////////////////////////////////////////
/// Method Delete button "Yes" for modal Delete ///
delete_bookings(){
  this.load.show_loading_gif(); //Show loading gif
  jQuery('#msg-failed-delete-b').hide(); 
  var id_bookings = this._propertiesb.id_bookings;
	let url = myGlobals.host+'/api/admin/booking_workspace/booking_detail/delete';

  let body=JSON.stringify({ id : id_bookings });
  console.log('body: ' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });
      this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe( 
          response => {
          	this.response_delete_b = response.json();
            console.log('Delete BOOKING reponse: ' + JSON.stringify(this.response_delete_b));
            var state_bookings = JSON.stringify(this.response_delete_b.deleted); //Save state
            console.log('Cancel filedetail save state: ' + state_bookings);
            if(state_bookings == 'true'){
              console.log('SI BORRÓ');     
              jQuery('#msg-success-delete-b').fadeIn('slow'); //show message success
              this.load.hide_loading_gif(); //Remove loading gif
              jQuery('#width-delete-bookings').hide(); //Hide modal buttons
              jQuery('#close-modal-delete-b').show(); //Show button close modal
            }else if(state_bookings == 'false'){ 
              console.log('NO borró'); 
              jQuery('#msg-failed-delete-b').fadeIn('slow');//show message failed
              this.load.hide_loading_gif(); //Remove loading gif
            }        
          }, error => {
          }
      ); 
}

//Button 'NO' for modal Delete and return Booking detail
remove_modal_booking(){
  jQuery("modal-backdrop").hide();
  jQuery("body").removeClass('modal-open');
}



}//Close class modal_delete_bookings