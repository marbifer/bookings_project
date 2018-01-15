import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef , OnInit ,  OnDestroy } from '@angular/core';
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
import {RecordLocator} from '../../../bworkspace/filedetail/inlineediting/editlocator.service';
import {EditPassenger} from '../../../bworkspace/filedetail/inlineediting/editpassenger.service';

declare var jQuery: any;
declare var $: any;

/////////////////
///Modal cancel//
@Component({
  selector: 'modal_cancel',
  template: require('./modal_cancel.html'),
  //encapsulation: ViewEncapsulation.None,
  styles: [require('./modal_cancel.scss')],
  directives: [ROUTER_DIRECTIVES, [Widget]],
  providers:[] //Import class
})

export class modal_cancel {

//Response button "yes" modal for Cancel Bookings of Files
response_cancel: any;
state_filesTemplateSuccess:boolean = true;
state_filesTemplateError:boolean = true;
state_buttonClose:boolean = true;
state_files:boolean = true;
closeModal:boolean = true;

constructor(
  public http: Http, public params: RouteParams, public router: Router,
  public modal: Modal, public load: LoadingGif,public _loc:Location, 
  public loc: RecordLocator, public _properties: DataProperties,
  public editpass: EditPassenger, viewContainer: ViewContainerRef) {
  modal.defaultViewContainer = viewContainer; //Modal Cancel 
}

ngOnInit(){
  // jQuery('#msg-success').hide();
  // jQuery('#close-modal').hide();
  // jQuery('#msg-failed').hide();
}
////////////////////////////////////////////
/// Method Cancel button "Yes" for modal ///
cancel_bookings_of_files(){
  // jQuery('#msg-success').hide();
  // jQuery('#close-modal').hide();
  // jQuery('#msg-failed').hide();

  this.load.show_loading_gif(); //Show loading gif
  // jQuery('#msg-failed').hide(); 
  var record_locator = this._properties.record_locator_saved;
	let url = myGlobals.host+'/api/admin/booking_workspace/file_detail/cancel';

  let body=JSON.stringify({ record_locator_file : record_locator });
  console.log('body: ' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });
      this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe( 
          response => {
            this.state_buttonClose = false
            // this.closeModal = true;
          	this.response_cancel = response.json();
            console.log('Cancel filedetail reponse: ' + JSON.stringify(this.response_cancel));
            this.state_files = (JSON.stringify(this.response_cancel.canceled)  == "true"); //Save state
            console.log('Cancel filedetail save state: ' + this.state_files);
            if(this.state_files == true){  
              this._properties.get_file_detail(this.params.get('record_locator')).subscribe();
              this.state_filesTemplateSuccess = false;
              // jQuery('#width-cancel-file').hide(); //Hide modal buttons
              // jQuery('#close-modal').show(); //Show button close modal
              // jQuery('#msg-success').fadeIn('slow'); //show message success
              // jQuery('#msg-success').show(); //show message success
              this.load.hide_loading_gif(); //Remove loading gif
            }else if(this.state_files == false){ 
              this.state_filesTemplateError = false;
              // jQuery('#width-cancel-file').hide(); //Hide modal buttons
              // jQuery('#close-modal').show(); //Show button close modal
              // jQuery('#msg-failed').fadeIn('slow');//show message failed
              // jQuery('#msg-failed').show();//show message failed
              this.load.hide_loading_gif(); //Remove loading gif
            }        
          }, error => {
          }
      ); 
}

//Button 'NO' for modal and return file detail
remove_modal(){
  this.state_filesTemplateError = true;
  this.state_filesTemplateSuccess = true;
  this.state_buttonClose = true;
  // this.state_filesTemplateSuccess = false;
  // this.state_filesTemplateError = false;
  // jQuery('#msg-success').hide();
  // jQuery('#close-modal').hide();
  // jQuery('#msg-failed').hide();
  this.closeModal = false;

  jQuery("modal-backdrop").hide();
  jQuery("body").removeClass('modal-open');
  //this.router.navigate([this.filedetail.current_url]); //Save url
}

}//Close class cancel_modal