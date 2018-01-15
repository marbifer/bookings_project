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
import {FileDetail} from '../../filedetail/filedetail';
import {LoadingGif} from '../../../bworkspace/filedetail/loading_gif.service';
import {DataProperties} from '../../../bworkspace/filedetail/data_properties.service';
//import {RecordLocator} from '../../../bworkspace/filedetail/inlineediting/editlocator.service';
//import {EditPassenger} from '../../../bworkspace/filedetail/inlineediting/editpassenger.service';

declare var jQuery: any;
declare var $: any;

/////////////////
///Modal cancel//
@Component({
  selector: 'modal_compose',
  template: require('./modal_compose.html'),
  //encapsulation: ViewEncapsulation.None,
  styles: [require('./modal_compose.scss')],
  directives: [ROUTER_DIRECTIVES, [Widget]],
  providers:[] //Import class
})

export class modal_compose {

//Response button "yes" modal for Cancel Bookings of Files
response_cancel: any;
    
constructor(
    public http: Http,
    public params: RouteParams,
    public router: Router,
    public modal: Modal,
    public load: LoadingGif,
    public _loc:Location,
    public _properties: DataProperties,
    viewContainer: ViewContainerRef
) {modal.defaultViewContainer = viewContainer;} //Modal Compose 

/*
////////////////////////////////////////////
/// Method Cancel button "Yes" for modal ///
cancel_bookings_of_files(){
  this.load.show_loading_gif(); //Show loading gif
  jQuery('#msg-failed').hide(); 
  var record_locator = this._properties.record_locator_saved;
	let url = myGlobals.host+'/api/admin/booking_workspace/file_detail/cancel';

  let body=JSON.stringify({ record_locator_file : record_locator });
  console.log('body: ' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });
      this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe( 
          response => {
          	this.response_cancel = response.json();
            console.log('Cancel filedetail reponse: ' + JSON.stringify(this.response_cancel));
            var state_files = JSON.stringify(this.response_cancel.canceled); //Save state
            console.log('Cancel filedetail save state: ' + state_files);
            if(state_files == 'true'){    
              jQuery('#msg-success').fadeIn('slow'); //show message success
              this.load.hide_loading_gif(); //Remove loading gif
              jQuery('#width-cancel-file').hide(); //Hide modal buttons
              jQuery('#close-modal').show(); //Show button close modal
            }else if(state_files == 'false'){ 
              jQuery('#msg-failed').fadeIn('slow');//show message failed
              this.load.hide_loading_gif(); //Remove loading gif
            }        
          }, error => {
          }
      ); 
}*/

    //Button 'NO' for modal and return file detail
    remove_modal(){
        jQuery("modal-backdrop").hide();
        jQuery(".modal-backdrop").hide();
        jQuery("body").removeClass('modal-open');
        //this.router.navigate([this.filedetail.current_url]); //Save url
    }

}//Close class cancel_modal