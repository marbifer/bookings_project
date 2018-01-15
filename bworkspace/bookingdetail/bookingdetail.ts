import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, NgZone} from '@angular/core';
import {Widget} from '../../core/widget/widget';
import {RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {Idle, DEFAULT_INTERRUPTSOURCES} from 'ng2-idle/core'; //For timeout
import {DialogRef} from 'angular2-modal';
import {Observable} from 'rxjs/Observable';
import {CustomHttp} from '../../services/http-wrapper';
import {NKDatetime} from 'ng2-datetime/ng2-datetime'; //Datepicker
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NgClass} from '@angular/common';
import {Modal, BS_MODAL_PROVIDERS as MODAL_P} from 'angular2-modal/plugins/bootstrap'; //Modal
import {Core} from '../../core/core';
import {Location} from '@angular/common';
import myGlobals = require('../../../app');
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';
import {RolloverAutocompletes} from '../../customers/rollovers-dropdown.service';
import {DataPropertiesBookings} from '../../bworkspace/bookingdetail/data_properties.service';
import {ConfirmationAndStatus} from '../../bworkspace/bookingdetail/inlineediting/edit_confirmation_status.service';
import {InternalComments} from '../../bworkspace/bookingdetail/inlineediting/edit_internal_comments.service';
import {CommLogSubcomponent} from '../../bworkspace/bookingdetail/communication-log.subcomponent'; //Subcomponent Communication Logs
import {TitleService} from '../../core/navbar/titles.service';
import {modal_cancel_bookings} from './modalcancel/modal_cancel_b';
import {modal_delete_bookings} from './modaldelete/modal_delete_b';
import {ModalAgencyBooking} from './modal_agency';
import {modal_compose} from '../modalcompose/modal_compose';
import {filter} from '../filter';
import {DOMAIN} from '../../../app';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/map'; 

declare var jQuery: any;
declare var $: any;
 
@Component({
  selector: '[bookingdetail]',
  template: require('./bookingdetail.html'),
  directives: [ROUTER_DIRECTIVES, [NgClass], NKDatetime, CommLogSubcomponent, [Widget]],
  styles: [require('./bookingdetail.scss')],
  providers:[MODAL_P, Modal, modal_cancel_bookings, modal_delete_bookings, ModalAgencyBooking, modal_compose, CommLogSubcomponent]
})
 
export class BookingDetail {

current_url = this._loc.path(); //Current Url 
title_page: any; //Title page
voucher:string;
invoice:string;
warningVisible: boolean = false;
private subscription: Subscription;
id_bookings:any;
progressBarVal: any = 0;
ocultarProgress:boolean = true;
hoverPencil: boolean= false;
editReference: boolean = false;
iframe = [];
reference_error:boolean = true;
reference_error_message:any="";

constructor( 
  public http: Http, 
  public params: RouteParams, 
  public router: Router, 
  public _modal_cancel_b: modal_cancel_bookings, 
  private ngZone: NgZone, 
  public _rol: RolloverAutocompletes,
  public _modal_delete_b: modal_delete_bookings, 
  public modal: Modal, 
  viewContainer: ViewContainerRef, 
  public _propertiesb: DataPropertiesBookings, 
  public _filters: filter,
  public _titleService: TitleService, 
  public _loc: Location, 
  public conf: ConfirmationAndStatus, 
  public comments: InternalComments,
  public _modal_compose: modal_compose, 
  public load: LoadingGif,
  public _comm_log: CommLogSubcomponent
) {

   this._filters.id_bookings =  this.params.get('id_bookings');         
  this._propertiesb.get_booking_detail(this._filters.id_bookings).map(data => { 
    this._propertiesb.post_bookingDetail_logs(this._filters.id_bookings);
  }).map(data => { 
  this._propertiesb.post_bookingDetail_communication_logs(this._filters.id_bookings)/*.subscribe(data => { 
      setTimeout(()=>{ //Este caódigo es por Pablo cambia de parecer y quiere que el Iframe se carge antes de dar doble click(favor no borrar)
          for (let i = 0; i < this._propertiesb.booking_detail_communication_logs.length; i++) {
            var com_detail = '#' + i + 'communicationLogDetail';

            //Gonza primero tiene que cargar el Iframe y después ocultarlo con el toggleClass(por eso saqué la clase communication-log-detail-hidden de la línea 1296 del HTML)
            var iframeid = '#' + i + 'htmlDetail';
            var iframe_el = $('#' + i + 'htmlDetail');
            var iframedoc = iframe_el[0].contentDocument;
            iframedoc.open();
            iframedoc.writeln(this._propertiesb.html[i]);
            iframedoc.close();

            jQuery(com_detail).toggleClass('communication-log-detail-hidden');
      } //Close for
     }, 500); //Close setTimeout
  }); */
}).subscribe(); 

 //Store params from URL in model:(filter.ts)
  this._filters.filter_by_bookings_or_files = params.get('search_type');

  this._filters.file_detail_record_locator = params.get('record_locator'); //Record Locator of File Detail
 
  var passenger = params.get('passenger_name');
  this._filters.passenger_name= passenger.toString().split(',');

  var reservation = params.get('reservation_code_locator');
  this._filters.reservation_code_locator = reservation.toString().split(',');

  var auto_cancel = params.get('will_auto_cancel');
  this._filters.will_auto_cancel = auto_cancel.toString().split(','); //El .push Ponía una coma en la URL, por eso se cambia a un split
  //this._filters.will_auto_cancel.push(auto_cancel);

  var status = params.get('status');
  this._filters.status = status.toString().split(',');

  var type = params.get('service_type');
  this._filters.service_type = type.toString().split(',');

  var provider = params.get('provider');
  this._filters.provider = provider.toString().split(',');

  var agency_user = params.get('agency_user');
  this._filters.agency_user = agency_user.toString().split(',');

  var destination = params.get('destination'); 
  this._filters.destination = destination.toString().split(','); 

  this._filters.date_created_from = params.get('date_created_from');
  this._filters.date_created_to = params.get('date_created_to'); 
  this._filters.date_travel_from = params.get('date_travel_from'); 
  this._filters.date_travel_to = params.get('date_travel_to'); 
  this._filters.order = params.get('order');
  var boolean_asc = (params.get('asc') === "true");
  this._filters.asc = boolean_asc;
  this._filters.number_of_page = Number(params.get('number_of_page')); 

  //Modal Cancel
  modal.defaultViewContainer = viewContainer;

  // Store imported Title in local title
  this.title_page = _titleService.title_page;
  this.changeMyTitle(); //Update Title   
} //Close constructor

changeMyTitle() {
  this._titleService.change('Booking Workspace');
}

ngOnInit(){
  this._propertiesb.booking_detail_data = ''; //Empty property to stop show Data from previous
  this._propertiesb.stop_event_agency = true; //Set true to open modal on second time
  this._propertiesb.book_agency_name = ''; //Clean typeName before load Data
  this._propertiesb.book_detail_conf_status = ''; //Clean Confirmation Status before load Data
  this.load.show_loading_gif_book(); 
    jQuery( "body" ).on( "click", function() {
      jQuery('#conf-status').tooltip('hide');
      //jQuery('#pass, #pass-lastname, #conf-status').tooltip('hide'); 
  });

  //Refresh page after click go back button in the Browser
  (<any>window).onhashchange = function() {
    //window.location.reload(); 
  }

  /////////////////////////////////////////////
  /// Open component at the top of the page ///
  $('html, body').animate({
    scrollTop: $("#scrollToHere").offset().top
  }, 0);

  this.verifyCtrl();

  this.subscription = this.conf.notifyObservable.subscribe((res) => {
    this.warningVisible = false;
  });


  if ( this.params.get('action') == 'print' ) {
    this.printPage();
  }

} //Close ngOnInit

ctrlVal : boolean = false;
verifyCtrl() {
  document.body.addEventListener('keydown', (e) => {
        this.ctrlVal = e.ctrlKey;
  });​​​​​​​
  document.body.addEventListener('keyup', (e) => {
        this.ctrlVal = e.ctrlKey;
  });​​​​​​​

}

   /// Create rute for opening in a new tab ///
   fileDetailLocation(): string {
     return '/app/bworkspace/filedetail;list_come_from=right_click;record_locator=' + this._filters.file_detail_record_locator +';' + this._filters.create_url();
   }

mouseEnter(){
  this._propertiesb.inactiveColor = "#dcdcdc";
}

go_file_detail(record_locator, e) {
  this._filters.file_detail_record_locator = record_locator; //Store current record locator
  switch (e.which) {
     case 1: 

      if (this.ctrlVal == true) {
        $('#fileOpener').attr("href", DOMAIN+this.fileDetailLocation());
        $('#fileOpener').trigger({
            type: 'mousedown',
            which: 3
        });
      }
       else {
          //Create URL with params from model:(filter.ts)
          this._filters.replace_string(); //Change "/" to "-"

          this.router.navigate(['/App', 'FileDetail', {
              list_come_from: 'b_detail',
              search_type: this._filters.filter_by_bookings_or_files,
              record_locator: record_locator,
              passenger_name: this._filters.passenger_name,
              reservation_code_locator: this._filters.reservation_code_locator,
              will_auto_cancel: this._filters.will_auto_cancel,
              status: this._filters.status,
              provider: this._filters.provider,
              agency_user: this._filters.agency_user,
              destination: this._filters.destination,
              date_created_from:  this._filters.date_created_from,
              date_created_to: this._filters.date_created_to,      
              date_travel_from:  this._filters.date_travel_from,
              date_travel_to: this._filters.date_travel_to,
              order: this._filters.order,
              asc: this._filters.asc,
              number_of_page: this._filters.number_of_page
          }]);
          this._filters.undo_replace_string();  //Undo "/" to "-"
      }
      break;
            case 2:
            e.preventDefault();
            $('#fileOpener').attr("href", DOMAIN+this.fileDetailLocation());
            $('#bookingOpener').css('text-decoration', 'none !important');
            $('#fileOpener').trigger({
                type: 'mousedown',
                which: 3
            });
            break;
    case 3:
            $('#fileOpener').attr("href", DOMAIN+this.fileDetailLocation());
            $('#fileOpener').trigger({
                type: 'mousedown',
                which: 3
            });
            break;
      }
}

/////////////////////////////////////////////////
/// Get Data Booking Detail /// 
get_booking_detail(id_bookings){
  this._propertiesb.get_booking_detail(id_bookings).subscribe();
}

///////////////////////
///Open Cancel Modal///
 open_confirm(modal_cancel_bookings){
    this.modal.confirm()
      .size('sm')
      .isBlocking(true)
      .showClose(true)
      .component(modal_cancel_bookings)
      .open();
  }

////////////////////////
///Open Compose Modal///
open_compose(modal_compose){
    this.modal.confirm()
    .size('sm')
    .isBlocking(true)
    .showClose(true)
    .component(modal_compose)
    .open();
}


//button "Cancel Booking"
cancel_booking_detail(){
  this.open_confirm(modal_cancel_bookings);
}

///////////////////////////////////////
/////// Open Compose Mail Modal ///////
open_compose_modal(){
  this.open_compose(modal_compose);
}

/////////////////////////////////////////////////////
/// Button "Close" Booking Detail ///
close_booking_detail(){
  //this._filters.id_bookings = "";
  //this._filters.book_detail_id_bookings = "";

  //Go back to Bworkspace with URL with params from model:(filter.ts)
  //this._filters.replace_string(); //Change "/" to "-"

  console.log('number_of_page : ' + this._filters.number_of_page);
  //Go back to Bworkspace with URL with params from model:(filter.ts)
  this._filters.replace_string(); //Change "/" to "-"
  var get_url = this._filters.create_url(); 
  console.log('/app/bworkspace;' + get_url);
  this._loc.go('/app/bworkspace;'+ get_url);
  window.location.reload(); 
  this._filters.undo_replace_string();  //Undo "/" to "-" 

  /*if (this._filters.passenger_name == "") {
    this._filters.passenger_name = [];
    //this._filters.passenger_name.length = 0;
  } 
  if (this._filters.reservation_code_locator == "") {
    this._filters.reservation_code_locator = [];
  //this._filters.reservation_code_locator.length = 0;
   }
 if ( this._filters.will_auto_cancel == "") {
    this._filters.will_auto_cancel = [];
    //this._filters.will_auto_cancel.length = 0;
   }
  if (this._filters.status  == ""  ) {
    this._filters.status = [];
    //this._filters.status.length = 0;
   }
 if ( this._filters.service_type  == ""  ) {
    this._filters.service_type = [];
    //this._filters.service_type.length = 0;
   }
 if ( this._filters.provider  == ""  ) {
    this._filters.provider = [];
    //this._filters.provider.length = 0;
   }
 if ( this._filters.agency_user  == ""  ) {
    this._filters.agency_user = [];
    //this._filters.agency_user.length = 0;
   }
 if ( this._filters.destination == ""  ) {
    this._filters.destination = [];
    //this._filters.destination.length = 0;
  }

  var get_url = this._filters.create_url(); 

  //this.router.navigateByUrl('/app/bworkspace;'+ get_url);

  //console.log('/app/bworkspace;' + get_url);
  this._loc.go('/app/bworkspace;'+ get_url);
  window.location.reload(); 
  this._filters.undo_replace_string();  //Undo "/" to "-" */
}

///////////////////////
///Open Delete Modal///
 open_delete(modal_delete_bookings){
    this.modal.confirm()
      .size('sm')
      .isBlocking(true)
      .showClose(true)
      .component(modal_delete_bookings)
      .open();
  }

//button "Delete Booking"
delete_booking_detail(){
  this.open_delete(modal_delete_bookings);
}

////////////////////////////////////////////////
/// Icons(print, mail, etc) for Booking Detail ///
action_icons_detail(icons){
  var icon = 'i.' + icons;
  jQuery(icon).addClass('color-action-buttons');
  jQuery(icon).tooltip('show');
}
mouseleave_icons_detail(icons){
  var icon = 'i.' + icons;
  jQuery(icon).removeClass('color-action-buttons');
  jQuery(icon).tooltip('hide');
}

//////////////////////////////
/// Rollover automcomplete ///
mouseover_color_text(text){ 
  this._rol.mouseover_color_text(text);
}
mouseleave_color_text(text){ 
  this._rol.mouseleave_color_text(text);
}

/////////////////////////////////////////////////////
/// Save data Edit Confirmation Number and Status ///
save_confirmation_status(send_mail){
  this.conf.save_confirmation_status(send_mail); //Call save_confirmation_status from edit_confirmation_status.service.ts
} //Close Confirmation Number and Status

////////////////////////////////////////////////////////////////
/// Call Methods Inline Editing Confirmation Number ans Status ///
edit_confirmation_status(){ //Mouseover
  this.conf.edit_confirmation_status(); 
}
no_edit_confirmation_status(){ //Mouseleave
  this.conf.no_edit_confirmation_status(); 
}
editing_confirmation_status(){ //Click div
  this.warningVisible = true;
  this.conf.editing_confirmation_status(); 
}
cancel_editing_confirmation_status(){
  this.warningVisible = false;
  this.conf.cancel_editing_confirmation_status(); 
}

///////////////////////////////////////////
/// Clean Record Locator field to edit ////
clean_input_confirmation_status(){
  this.conf.clean_input_confirmation_status();
  //this._propertiesb.general_error_loc = '';
}

/////////////////////////////////////////////////
/// Save data Edit Lead Passenger ///
/*save_passenger(send_mail, record_locator: string){
  this.editpass.save_passenger(send_mail, record_locator); //Call save_passenger from editpassenger.services.ts
}*/

///////////////////////////////////////////////////////////////////
/// Inline Editing PASSENGER DETAILS ///
/*edit_passenger(){ //Mouseover
  this.editpass.edit_passenger(); 
}
no_edit_passenger(){ //Mouseleave
  this.editpass.no_edit_passenger();
}
editing_passenger(edit){ //Click div
  this.editpass.editing_passenger(edit);
}

cancel_editing_passenger(){ //Click Icon-cancel/close
  this.editpass.cancel_editing_passenger();
}*/

/////////////////////////////////////////////////////
/// Clean First Name and Last Name fields to edit ///
/*clean_input_pass(){
  this.editpass.clean_input_pass();
}
clean_input_last(){
  this.editpass.clean_input_last();
}*/

//////////////////////////////////////////////////////////////////////////////
/// Inline Editing Prices ///
edit_prices(){ //Mouseover
  //jQuery('.pencil2').css('background', 'gray');
  jQuery('.no-bold').css({ backgroundColor: "#b0d8ff", padding: "0px"});
  jQuery('#prices-td').addClass('td-editable');
  jQuery('#pencil2').addClass('pencil-editable');

  //jQuery('.edit-td').css('background', 'gray');
  jQuery('.costs-td .text-left h4').css({ backgroundColor: "#b0d8ff", padding: "1px 0"});
}
no_edit_prices(){ //Mouseleave
  jQuery('.pencil2').css('background', 'none');
  jQuery('.no-bold').css("backgroundColor", "transparent");

  //jQuery('.edit-td').css('background', 'none');
  jQuery('.costs-td .text-left h4').css("backgroundColor", "transparent");
  jQuery('#prices-td').removeClass('td-editable');
  jQuery('#pencil2').removeClass('pencil-editable');
}
editing_prices(){ //Click div
  if(this._propertiesb.no_editing == false){
    this._propertiesb.no_editing = true;
    //jQuery('.show-grid').addClass('inline-up');
    //jQuery('.save-cancel').show();
    //jQuery('td').addClass('td-editable');
    //jQuery('#prices1').addClass('border-editing-table border-editing-icon');
    //jQuery('#prices2, #prices3').addClass('border-editing-table');
    /*if(jQuery(window).width() < 1131) {
      jQuery('#blue').addClass('border-editing-pencil');
    }*/
    //jQuery('#prices4').addClass('border-editing-table border-editing-pencil');
    jQuery('#editing-prices').show();
    jQuery('.pencil2').hide();
    jQuery('#prices-td').removeClass('td-editable');
  }  
}
cancel_editing_prices(){ //Click Icon-cancel/close
  //jQuery('.show-grid').removeClass('inline-up');
  //jQuery('.save-cancel').hide();
  //jQuery('td').removeClass('td-editable');
  /*jQuery('#prices1').removeClass('border-editing-table border-editing-icon');
  jQuery('#prices2, #prices3').removeClass('border-editing-table');
  if (jQuery(window).width() < 1131) {
    jQuery('#blue').removeClass('border-editing-pencil');
  }
  jQuery('#prices4').removeClass('border-editing-table border-editing-pencil');*/
  jQuery('#editing-prices').hide();
  jQuery('.pencil2').show();
  this._propertiesb.no_editing = false; 
}

////////////////////////////////////////////////////////////////////////////
/// Inline Editing AGENCY DETAILS AND LOCATOR //////
edit_agency(){ //Mouseover  
    //jQuery('.agency-details-pencil').css('background', 'gray');
    jQuery('#edit-agency').css({ backgroundColor: "#b0d8ff", padding: "5px"});
    jQuery('.edit-agency-details').css({ backgroundColor: "#b0d8ff", padding: "5px"});
    jQuery('.agency-details-pencil i').addClass('pencil-editable');
    jQuery('#agencyDetails-td').addClass('td-editable');
}
no_edit_agency(){ //Mouseleave
  jQuery('.agency-details-pencil').css('background', 'none');
  jQuery('.edit-agency-details').css({ backgroundColor: "transparent"});
  jQuery('.agency-details-pencil i').removeClass('pencil-editable');
  jQuery('#agencyDetails-td').removeClass('td-editable');
}

edit_locator(){ //Mouseover  
    jQuery('#created-loc-pencil').css('background', 'gray');
    jQuery('#edit-agency').css({ backgroundColor: "#b0d8ff", padding: "5px"});
}
no_edit_locator(){ //Mouseleave
  jQuery('#created-loc-pencil').css('background', 'none');
  jQuery('#edit-agency').removeClass('editing');
}

editing_agency_locator(){ //Click td(table) 
  jQuery("modal-backdrop").show(); //Show modal two click
  if(this._propertiesb.no_editing == false){
    if(this._propertiesb.stop_event_agency == true){
      this.open_modal_agency(ModalAgencyBooking);      
      this._propertiesb.stop_event_agency = false;
    }
  }
}

edit_passenger_detail(){
    jQuery('#pencil-pass-detail i').addClass('pencil-editable');
    jQuery('.passenger-details-td').addClass('td-editable');
}

no_edit_passenger_detail(){
  jQuery('#pencil-pass-detail i').removeClass('pencil-editable');
  jQuery('.passenger-details-td').removeClass('td-editable');
}

//////////////////////////////
/// Open Modal Agency ///
open_modal_agency(ModalAgencyBooking){
  this.modal.confirm()
      .size('md')
      .isBlocking(true)
      .showClose(true)
      .component(ModalAgencyBooking)
      .open();
      jQuery('#editing-agency').show();
}

////////////////////////////////////////
/// Save data Edit Internal Comments ///
save_internal_comments(send_mail){
  this.comments.save_internal_comments(send_mail); //Call save_internal_comments from edit_internal_comments.service.ts
} 


/////////////////////////////////////////////////////
/// Call Methods Inline Editing Internal Comments ///
edit_internal_comments(){ //Mouseover
  this.comments.edit_internal_comments(); 
}
no_edit_internal_comments(){ //Mouseleave
  this.comments.no_edit_internal_comments(); 
}
editing_internal_comments(e){ //Click div
  this.comments.editing_internal_comments(e); 
}
cancel_editing_internal_comments(backup_comment){
  this.comments.cancel_editing_internal_comments(backup_comment); 
}
show_internal_comments(){
  this.comments.show_internal_comments();
}
handle_collapse(){
  this.comments.handle_collapse();
}

////////////////////////////////////////////
/// Inline editing: Buttons Save, Cancel ///
rollover_icons_save_cancel_comm(editing){
   this.comments.rollover_icons_save_cancel_comm(editing); //Call rollover_icons_save_cancel_comm from edit_confirmation_status.service.ts
}
mouseleave_icons_save_cancel_comm(editing){
  this.comments.mouseleave_icons_save_cancel_comm(editing); //Call rollover_icons_save_cancel_comm from edit_confirmation_status.service.ts
}

////////////////////////////////////////////
/// Inline editing: Buttons Save, Cancel ///
rollover_icons_save_cancel(editing){
   this.conf.rollover_icons_save_cancel(editing); //Call rollover_icons_save_cancel from edit_internal_comments.service.ts
}
mouseleave_icons_save_cancel(editing){
  this.conf.mouseleave_icons_save_cancel(editing); //Call mouseleave_icons_save_cancel from edit_internal_comments.service.ts
}

//////////////////
///Icon loading///
show_loading_gif_book(){
  //Show loading gif before get data
  this.load.show_loading_gif_book();
}

hide_loading_gif_book(){
  //Hide loading gif
  this.load.hide_loading_gif_book();
}

///////////////////////////////////////
/// Request download voucher //////////
download_voucher(){
  if ( this._propertiesb.inactiveColor == "" ) {
      this.ocultarProgress = false;
      this.progressBarVal = 0;
      var inter = setInterval(()=>{
        this.progressBarVal = this.progressBarVal + 0.01;
      } , 0 );
      let url = myGlobals.host+'/api/admin/booking_workspace/booking_detail/voucher';
      let body=JSON.stringify({ id_booking: this._propertiesb.id_bookings});
      console.log('Body del request del voucher: ' + body);
      let headers = new Headers({ 'Content-Type': 'application/json' });

      return this.http.post( url, body, {headers: headers, withCredentials:true})
      .subscribe(
          response => {
            console.log('boking_detail/voucher: '+JSON.stringify(response.json()));
                  this.voucher = response.json().booking_detail_voucher;
                    clearInterval(inter);
                    this.progressBarVal = 100;
                    setTimeout(()=>{
                      this.ocultarProgress = true;
                    } , 3000);
                      if (response.json().error_data.exist_error == false)
                  {              
                    var save = document.createElement('a');  
                    save.href = myGlobals.host+this.voucher;; 
                    save.setAttribute('download', response.json().booking_detail_voucher_name);
                    save.target = '_blank'; 
                    document.body.appendChild(save);
                    save.click();
                    document.body.removeChild(save);
                  }
          }, error => {}
      );
}
}

///////////////////////////////////////
/// Request download invoice //////////
download_invoice(){
    let url = myGlobals.host+'/api/admin/booking_workspace/file_detail/invoice';
    let body=JSON.stringify({ record_locator_file: this._propertiesb.record_locator_actual});
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .subscribe(
        response => {
                this.invoice = response.json().file_detail_invoice;
                if (response.json().error_data.exist_error == false)
                {
                  var save = document.createElement('a');
                  save.setAttribute('download', response.json().file_detail_invoice_name);
                  save.href = myGlobals.host+this.invoice;
                  save.target = '_blank'; 
                  document.body.appendChild(save);
                  save.click();
                  document.body.removeChild(save);
                }
        }, error => {}
    );
}

checkCancellation(){
    if (jQuery('#cancellationSlide').hasClass('active')) {
        jQuery('.cancellation-alert-container').slideDown();
    } else {
        jQuery('.cancellation-alert-container').slideUp();
    }
}

printPage(){
    if ( this.params.get("action") == "print" ) { 
        setTimeout(()=>{
          window.print();
        }, 4000);   
    } else {
        window.print();
    }
}

openCommunicationLog(i , code ){

    this.load.show_loading_gif_book(); //Remove loading gif
    let url = myGlobals.host+'/api/admin/communication/body';
    let body=JSON.stringify({ id_communication: code });
    console.log('body cancel: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    this.http.post( url, body, {headers: headers, withCredentials:true})
    .subscribe( 
        response => {
            this.load.hide_loading_gif_book(); //Remove loading gif
            this._propertiesb.html[i] = response.json().communication_body;
            console.log('COMMUNICATION LOGS:   '+JSON.stringify(response.json()));            
        }, error => {}
    );

    this.iframe[i] = true;
    var com_detail = '#' + i + 'communicationLogDetail';
    jQuery(com_detail).toggleClass('communication-log-detail-hidden');

    //Descomentando estas dos líneas, y el {{comLogs.xml}} del html, se trae el mail, pero arrastrando estilos del admin
    /*/var detail = '#' + i + 'divDetail';
    jQuery(detail).append(this._propertiesb.html[i]);*/

    //Estas líneas de acá abajo son para que se carguen los iframes con su respectivo html de backend
    setTimeout(()=>{
      var iframeid = '#' + i + 'htmlDetail';
      var iframe_el = jQuery(iframeid);
      var iframedoc = iframe_el[0].contentDocument;
      iframedoc.open();
      iframedoc.writeln(this._propertiesb.html[i]);
      iframedoc.close();
    } , 250);
}


addHover() {
  this.hoverPencil = true;
  jQuery('.reference').addClass('td-editable');
  //jQuery('.reference h1 span').css({ backgroundColor: "#b0d8ff", padding: "5px"});
  jQuery('.reference h1').css({ backgroundColor: "#b0d8ff"});
  jQuery('.reference .fa-pencil').addClass('pencil-editable');
}
takeHover(){
  this.hoverPencil = false;
  jQuery('.reference').removeClass('td-editable');
  //jQuery('.reference h1 span').css({ backgroundColor: "transparent", padding: "5px"});
  jQuery('.reference h1').css({ backgroundColor: "transparent"});
  jQuery('.reference .fa-pencil').removeClass('pencil-editable');
}

save_reference_number(send_email){
  this.load.show_loading_gif(); //Loading gif

  // this._propertiesb.book_agency_reference;
  let headers = new Headers({ 'Content-Type': 'application/json' });
  var url; 
  url = myGlobals.host+'/api/admin/booking_workspace/booking_detail/edit/locator_agency';
  let body=JSON.stringify({
    id_booking: this._propertiesb.id_bookings,
    locator_agency: this._propertiesb.book_agency_reference,
    send_mail: send_email
  });
  this.http.post( url, body ,{headers: headers, withCredentials:true} )
    .map(
      response => {
          console.log(response.json());
            this._propertiesb.book_agency_reference_bkp = this._propertiesb.book_agency_reference;
            this.reference_error_message = "";
            this.reference_error = response.json().updated;
            if ( this.reference_error == true ) {
              this.editReference = false;
          } else {
            this.editReference = true;
            for (var i = 0; i < response.json().error_data.error_field_list.length; ++i) {
              if ( response.json().error_data.error_field_list[i].field == "locator_agency" ) {
                this.reference_error_message = response.json().error_data.error_field_list[i].message;
              }
            }
          }
          this.load.hide_loading_gif(); //Remove loading gif
      }, error => {}
  ).subscribe();
}

toggleRefInput() {
  jQuery('.reference').removeClass('td-editable');
  if ( this.editReference == true ) {
    this.editReference = false;
  } else {
    this.editReference = true;
  }
}

focusInputReference(){
  if ( this.reference_error == false ) {
    this.reference_error = true;
    this.reference_error_message = '';
  }
}

toggleAutocancel(bool){
  this.load.show_loading_gif(); //Loading gif
    let headers = new Headers({ 'Content-Type': 'application/json' });
    var url; 
    url = myGlobals.host+'/api/admin/booking_workspace/booking_detail/edit/auto_cancel';
    let body=JSON.stringify({
      id_booking: this._propertiesb.id_bookings,
      is_auto_cancel : bool
    });
    this.http.post( url, body ,{headers: headers, withCredentials:true} )
      .map(
        response => {
                this.load.hide_loading_gif(); 
                if ( response.json().error_data.exist_error  == false ) {
                  this._propertiesb.is_auto_cancel = bool;
                }
        }, error => {}
    ).subscribe();
  }
  
  cancel_editing_reference_number(){
    this.editReference = false;
    this._propertiesb.book_agency_reference = this._propertiesb.book_agency_reference_bkp;
  }
}//Close class BookingDetail
