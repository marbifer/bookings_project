import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, NgZone} from '@angular/core';
import {Widget} from '../../core/widget/widget';
import {RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import { Idle, DEFAULT_INTERRUPTSOURCES } from 'ng2-idle/core'; //For timeout
import { DialogRef } from 'angular2-modal';
import {Observable} from 'rxjs/Observable';
import {CustomHttp} from '../../services/http-wrapper';
import {NKDatetime} from 'ng2-datetime/ng2-datetime'; //Datepicker
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NgClass} from '@angular/common';
import { Modal, BS_MODAL_PROVIDERS as MODAL_P} from 'angular2-modal/plugins/bootstrap'; //Modal
import {Core} from '../../core/core';
import { Location } from '@angular/common';
import myGlobals = require('../../../app');
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';
import {DataProperties} from '../../bworkspace/filedetail/data_properties.service';
import {RecordLocator} from '../../bworkspace/filedetail/inlineediting/editlocator.service';
import {EditPassenger} from '../../bworkspace/filedetail/inlineediting/editpassenger.service';
import {EditPayments} from '../../bworkspace/filedetail/inlineediting/editpayments.service';
import {TitleService} from '../../core/navbar/titles.service';
import {modal_cancel} from './modalcancel/modal_cancel';
import {ModalAgency} from './modal_agency';
import {modal_compose} from '../modalcompose/modal_compose';
import {filter} from '../filter';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: '[filedetail]',
  template: require('./filedetail.html'),
  directives: [ROUTER_DIRECTIVES, [NgClass], NKDatetime, [Widget]],
  styles: [require('./filedetail.scss')],
  providers:[MODAL_P, Modal, modal_cancel, ModalAgency, modal_compose]
})
 
export class FileDetail {

current_url = this._loc.path(); //Current url 
title_page: any; //Title page
invoice: string;
voucher: string;

//Control width of screens
view_port_width = true;
it_come_from: any; //Indicate if user comes from cliking agency name
//Progress bar
progressBarVal: any = 0;
ocultarProgress:boolean = true;
myUrl:any;
addPaymentButtonHidden:boolean=false;

iframe = [];

constructor( 
    public http: Http, 
    public params: RouteParams, 
    public router: Router, 
    public modal: Modal,
    viewContainer: ViewContainerRef, 
    public _loc: Location, 
    public _properties: DataProperties, 
    public loc: RecordLocator, 
    public editpass: EditPassenger, 
    public editpayments: EditPayments, 
    public load: LoadingGif, 
    private ngZone: NgZone,
    public _titleService: TitleService, 
    public _modal_cancel: modal_cancel,
    public _modal_compose: modal_compose, 
    public _filters: filter
) {

  this._properties.get_file_detail(this.params.get('record_locator'))
  .map( response => {
    this._properties.post_fileDetail_logs(this.params.get('record_locator'))  
  }).map( response => {
    this._properties.post_fileDetail_communication_logs(this.params.get('record_locator'))/*.subscribe(data => {
    setTimeout(()=>{ 
          for (let i = 0; i < this._properties.file_detail_communication_logs.length; i++) {
            var com_detail = '#' + i + 'communicationLogDetail';

            //Gonza primero tiene que cargar el Iframe y después ocultarlo con el toggleClass(por eso saqué la clase communication-log-detail-hidden de la línea 1296 del HTML)
            var iframeid = '#' + i + 'htmlDetail';
            var iframe_el = $('#' + i + 'htmlDetail');
            var iframedoc = iframe_el[0].contentDocument;
            iframedoc.open();
            iframedoc.writeln(this._properties.html[i]);
            iframedoc.close();

            jQuery(com_detail).toggleClass('communication-log-detail-hidden');
      } //Close for
     }, 500); //Close setTimeout
    });*/
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

  //var type = params.get('service_type');
  //this._filters.service_type = type.toString().split(',');

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

  //Store imported Title in local title
  this.title_page = _titleService.title_page;
  this.changeMyTitle(); //Update Title

  //ReSize event
    window.onresize = (e) => {
        ngZone.run(() => {
            this.get_size(); 
        });
    };  
} //Close constructor

changeMyTitle() {
  this._titleService.change('Booking Workspace');
}

ngOnInit(){ 

  if (this._loc.path().indexOf(";") != -1 ) {
      this.myUrl = this._loc.path().slice(0,this._loc.path().indexOf(";"));
  } else {
      this.myUrl = this._loc.path();
  }

  this.editpayments.get_payments().subscribe();
  this.editpayments.get_currency_types().map( resp => {
    this.editpayments.currency_name = resp.list_currencys[0].currency_symbol;
    this.editpayments.currency_type = resp.list_currencys[0].currency_code;
    this.editpayments.payment_name = resp.list_types[0].payment_type_name;
    this.editpayments.payment_type = resp.list_types[0].payment_type_code;
  }).subscribe();

  this.it_come_from = this.params.get('list_come_from');
  this._properties.file_detail_data = ''; //Empty property to stop show Data from previous
  this._properties.stop_event_agency = true; //Set true to open modal on second time
  this._properties.file_detail_locator = ''; //Clean Record Locator before load Data
  this._properties.file_detail_passenger_name = ''; //Clean Passenger Name before load Data
  this._properties.file_detail_passenger_lastname = ''; //Clean Passenger Last Name before load Data
  this.load.show_loading_gif(); 
    jQuery( "body" ).on( "click", function() {
    jQuery('#pass, #pass-lastname, #loc, .tool-container-empty').tooltip('hide'); 
  });
  jQuery( "#pass" ).on( "click", function() {
    jQuery('.tool-container-empty').hide();
  });

  //Refresh page after click go back button in the Browser
  (<any>window).onhashchange = function() {
    window.location.reload(); 
  }

  this.get_size();

  /////////////////////////////////////////////
  /// Open component at the top of the page ///
  $('html, body').animate({
    scrollTop: $("#scrollToHere").offset().top
  }, 0);
  
  if ( this.params.get('action') == 'addPayment' ) {
    this.go_addPayment();
  }
  if ( this.params.get('action') == 'print' ) {
    this.printPage();
  }

  $('#paymentsDate').change(()=>{
    jQuery('#paymentsDate').datepicker('hide');
  });

}//Close ngOnInit

///////////////////////////////////////////////////////
/// Method for alocate div container of File Detail ///
get_size(){
  var viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0); //width of viewport
  if(viewport_width < 1200){
    this.view_port_width = false;
  }else if(viewport_width > 1200) {
    this.view_port_width = true;
  }
}

/////////////////////////////////////////////////
/// Get Data File Detail ///
get_file_detail(record_locator: string){
  this._properties.get_file_detail(record_locator); //Call get_file_detail from data_properties.services.ts
}

///////////////////////
///Open Cancel Modal///
 open_confirm(modal_cancel){
    this.modal.confirm()
      .size('sm')
      .isBlocking(true)
      .showClose(true)
      .component(modal_cancel)
      .open();
  }

  open_compose(modal_compose){
    this.modal.confirm()
    .size('sm')
    .isBlocking(true)
    .showClose(true)
    .component(modal_compose)
    .open();
}

//Button "Cancel File"
cancel_file_detail(){
  this.open_confirm(modal_cancel);
}

/////////////////////////////////////////////////////
/// Button "Close" File Detail ///
close_file_detail(){
  //Go back to Bworkspace with URL with params from model:(filter.ts)
  if(this.it_come_from == 'b_detail'){ //if comes from clicking agency name go to booking workspace         
    this._filters.replace_string(); //Change "/" to "-"
    var get_url = this._filters.create_url(); 
    this.router.navigateByUrl('/app/bworkspace/bookingdetail;'+ get_url);
    /*this._loc.go('/app/bworkspace/bookingdetail;'+ get_url);
    window.location.reload(); */
    this._filters.undo_replace_string();  //Undo "/" to "-"               
  } else if(this.it_come_from == '' || this.it_come_from == undefined){ //if comes from clicking agency name go to booking workspace   
    this._filters.replace_string(); //Change "/" to "-"
    var get_url = this._filters.create_url(); 
    this.router.navigateByUrl('/app/bworkspace;'+ get_url);
    // this._loc.go('/app/bworkspace;'+ get_url);
    // window.location.reload(); 
    this._filters.undo_replace_string();  //Undo "/" to "-"
  } 
}

///////////////////////////////////////////////
/// Icons(print, mail, etc) for File Detail ///
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

/////////////////////////////////////////////////
/// Save data Edit RECORD LOCATOR ///
save_locator(send_mail){
  this.loc.save_locator(send_mail); //Call save_locator from editlocator.services.ts
} //Close save_locator

////////////////////////////////////////////////////////////////
/// Call Methods Inline Editing Record Locator ///
edit_locator(){ //Mouseover
  this.loc.edit_locator(); //Call save_locator from editlocator.services.ts 
}
no_edit_locator(){ //Mouseleave
  this.loc.no_edit_locator(); 
}
editing_record(){ //Click div
  this.loc.editing_record(); 
}
cancel_editing_record(){
  this.loc.cancel_editing_record(); 
}

///////////////////////////////////////////
/// Clean Record Locator field to edit ////
clean_input_loc(){
  this.loc.clean_input_loc();
  this._properties.general_error_loc = '';
}

/////////////////////////////////////////////////
/// Save data Edit Lead Passenger ///
save_passenger(send_mail, record_locator: string){
  this.editpass.save_passenger(send_mail, record_locator); //Call save_passenger from editpassenger.services.ts
}

///////////////////////////////////////////////////////////////////
/// Inline Editing PASSENGER DETAILS ///
edit_passenger(){ //Mouseover
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
}

/////////////////////////////////////////////////////
/// Clean First Name and Last Name fields to edit ///
clean_input_pass(){
  this.editpass.clean_input_pass();
}
clean_input_last(){
  this.editpass.clean_input_last();
}

//////////////////////////////////////////////////////////////////////////////
/// Inline Editing Prices ///
edit_prices(){ //Mouseover
  jQuery('.pencil2').css('background', 'gray');
  jQuery('.no-bold').css({ backgroundColor: "#b0d8ff", padding: "0px"});

  //jQuery('.edit-td').css('background', 'gray');
  jQuery('.costs-td .text-left h4').css({ backgroundColor: "#b0d8ff", padding: "0px"});
}
no_edit_prices(){ //Mouseleave
  jQuery('.pencil2').css('background', 'none');
  jQuery('.no-bold').css("backgroundColor", "transparent");

  //jQuery('.edit-td').css('background', 'none');
  jQuery('.costs-td .text-left h4').css("backgroundColor", "transparent");
}
editing_prices(){ //Click div
  if(this._properties.no_editing == false){
    this._properties.no_editing = true;
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
  this._properties.no_editing = false; 
}

////////////////////////////////////////////////////////////////////////////
/// Inline Editing AGENCY DETAILS //////
edit_agency(){ //Mouseover
    //jQuery('.pencil4').css('background', 'gray');
    jQuery('#edit-agency').css({ backgroundColor: "#b0d8ff", padding: "5px"});
    jQuery('#agency1').addClass('td-editable');
    jQuery('#pencil-agen').addClass('pencil-editable');
}
no_edit_agency(){ //Mouseleave
  //jQuery('.pencil4').css('background', 'none');
  jQuery('#edit-agency').css("backgroundColor", "transparent");
  jQuery('#agency1').removeClass('td-editable');
  jQuery('#pencil-agen').removeClass('pencil-editable');
}
editing_agency(){ //Click td(table) 
  jQuery("modal-backdrop").show(); //Show modal two click
  if(this._properties.no_editing == false){
    if(this._properties.stop_event_agency == true){
      this.open_modal_agency(ModalAgency);
      jQuery('.pencil-agency').hide();
      //jQuery('.pencil4 i').hide();
      jQuery('#agencyDetails-td').removeClass('td-editable');
      this._properties.stop_event_agency = false;
    }
  }
}

//////////////////////////////////////////////////////
/// Icon Folder mouseover Table Bookings and Files ///
mouseover_icon_folder(i){ 
  /*var icon_b = '#' + i + 'icon-b';
  jQuery(icon_b).show();
  var withEllipsis = '#' + i + 'ellipsisIcon';
  jQuery(withEllipsis).css('display', 'block');*/
  var icon_b = '#' + i + 'icon-b';
  jQuery(icon_b).addClass('hovered-folder-icon');
  var withEllipsis = '#' + i + 'ellipsisIcon';
  jQuery(withEllipsis).addClass('hovered-ellipsis-icon');
}

mouseleave_icon_folder(){
  /*jQuery('.fa-folder-open-o').hide();
  jQuery('#book .ellipsis-icon-wrapper').removeClass('open');
  jQuery('#book .ellipsis').removeClass('focused-ellipsis-icon');
  jQuery('#book .ellipsis').hide();*/
  jQuery('.fa-folder-open-o').removeClass('hovered-folder-icon');
  jQuery('#book .ellipsis-wrapper').removeClass('open');
  jQuery('#book .ellipsis').removeClass('focused-ellipsis-icon');
  jQuery('#book .ellipsis').removeClass('hovered-ellipsis-icon');
}

focusEllipsis(i){
  var withEllipsis = '#' + i + 'ellipsisIcon';
  jQuery(withEllipsis).toggleClass('focused-ellipsis-icon');
}

removeOpenedEllipsis(i){
  var withEllipsis = '#' + i + 'ellipsisIcon';
  jQuery(withEllipsis).removeClass('focused-ellipsis-icon');
  jQuery('#book .ellipsis-wrapper').removeClass('open');
}

//////////////////////////////
/// Open Modal Agency ///
open_modal_agency(ModalAgency){
  this.modal.confirm()
      .size('md')
      .isBlocking(true)
      .showClose(true)
      .component(ModalAgency)
      .open();
      jQuery('#editing-agency').show();
}

////////////////////////////////////////////
/// Inline editing: Buttons Save, Cancel ///
rollover_icons_save_cancel(editing){
   this.loc.rollover_icons_save_cancel(editing); //Call rollover_icons_save_cancel from editlocator.services.ts
}
mouseleave_icons_save_cancel(editing){
  this.loc.mouseleave_icons_save_cancel(editing); //Call mouseleave_icons_save_cancel from editlocator.services.ts
}

//////////////////
///Icon loading///
show_loading_gif(){
  //Show loading gif before get data
  this.load.show_loading_gif();
}

hide_loading_gif(){
  //Hide loading gif
  this.load.hide_loading_gif();
}


///////////////////////////////////////
/// Request download invoice //////////
download_invoice(){
  let url = myGlobals.host+'/api/admin/booking_workspace/file_detail/invoice';
    let body=JSON.stringify({ record_locator_file: this._properties.record_locator_saved});
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

///////////////////////////////////////
/// Request download invoice //////////
download_voucher(){
  if ( this._properties.inactiveColor == "" ) {
      this.ocultarProgress = false;
      this.progressBarVal = 0;
      var inter = setInterval(()=>{
        this.progressBarVal = this.progressBarVal + 0.01;
      } , 0 );
      let url = myGlobals.host+'/api/admin/booking_workspace/file_detail/voucher';
      let body=JSON.stringify({ record_locator_file: this._properties.record_locator_saved});
      console.log('Body del request del voucher: ' + body);
      let headers = new Headers({ 'Content-Type': 'application/json' });

      return this.http.post( url, body, {headers: headers, withCredentials:true})
      .subscribe(
          response => {
                  clearInterval(inter);
                  this.progressBarVal = 100;
                  setTimeout(()=>{
                    this.ocultarProgress = true;
                  } , 3000);
                  console.log('RESPONSE: ' + JSON.stringify(response.json()));
                  this.voucher = response.json().file_detail_voucher;
                  if (response.json().error_data.exist_error == false)
                  {                 
                    var save = document.createElement('a');  
                    save.href = myGlobals.host+this.voucher;; 
                    save.setAttribute('download', response.json().file_detail_voucher_name);
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
download_voucher_booking(id){
  let url = myGlobals.host+'/api/admin/booking_workspace/booking_detail/voucher';
    let body=JSON.stringify({ record_locator_booking: id});
    console.log('Body del request del voucher: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .subscribe(
        response => {
                this.voucher = response.json().booking_detail_voucher;
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

///////////////////////////////////////
/// Request download invoice //////////
user_forged(){
  let url = myGlobals.host+'/api/admin/customers/user/forge';
    let body=JSON.stringify({ user_code: '', file: this._properties.record_locator_saved});
    console.log('Body del request del voucher: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .subscribe(
        response => {
          var url= response.json().redirect_url;
          console.log("URL : "+url);
                if ( url !=""){
                  var a = document.createElement("a");
                  a.target = "_blank";
                  a.href = 'http'+url;
                  a.click();
                }

        }, error => {}
    );
}

open_booking_detail(id_booking){
  this.router.navigate(['/App', 'BookingDetail', {
    search_type: this._filters.filter_by_bookings_or_files,
    id_bookings: id_booking, //Bookings 
    passenger_name: this._filters.passenger_name,
    reservation_code_locator: this._filters.reservation_code_locator,
    will_auto_cancel: this._filters.will_auto_cancel,
    status: this._filters.status,
    service_type: this._filters.service_type,
    provider: this._filters.provider,
    agency_user: this._filters.agency_user, 
    destination: this._filters.destination,
    date_created_from: this._filters.date_created_from,
    date_created_to: this._filters.date_created_to,
    date_travel_from: this._filters.date_travel_from,
    date_travel_to: this._filters.date_travel_to,
    order: this._filters.order,
    asc: this._filters.asc,
    number_of_page:  this._filters.number_of_page
    }]);
}

///////////////////////////////////////
/////// Open Compose Mail Modal ///////
open_compose_modal(){
    this.open_compose(modal_compose);
}

go_addPayment(){
    let goTo = $('#payments-heading').offset().top - 100;
    $("html, body").animate({scrollTop: goTo}, 1000, 'swing', function() { 
      $('#new-amenity-button').click();
    });
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

//////////////////////////////////////////
/// Open Communication Log File Detail ///
openCommunicationLog(i , code){
  //jQuery('.communication-log-detail').slideToggle('slow');
    this.load.show_loading_gif(); //Remove loading gif
   let url = myGlobals.host+'/api/admin/communication/body';
    let body=JSON.stringify({ id_communication: code });
    console.log('body cancel: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    this.http.post( url, body, {headers: headers, withCredentials:true})
    .subscribe( 
        response => {
            this.load.hide_loading_gif(); //Remove loading gif
            this._properties.html[i] = response.json().communication_body;
            console.log('COMMUNICATION LOGS:   '+JSON.stringify(response.json()));            
        }, error => {}
    );


    this.iframe[i] = true;

    var com_detail = '#' + i + 'communicationLogDetail';
    jQuery(com_detail).toggleClass('communication-log-detail-hidden');
    
    //Descomentando estas dos líneas, y el {{comLogs.xml}} del html, se trae el mail, pero arrastrando estilos del admin
    /*/var detail = '#' + i + 'divDetail';
    jQuery(detail).append(this._properties.html[i]);*/

    //Estas líneas de acá abajo son para que se carguen los iframes con su respectivo html de backend
    setTimeout(()=>{
      var iframeid = '#' + i + 'htmlDetail';
      var iframe_el = jQuery(iframeid);
      var iframedoc = iframe_el[0].contentDocument;
      iframedoc.open();
      iframedoc.writeln(this._properties.html[i]);
      iframedoc.close();
    }, 250);
}

toggleAutocancel( id , bool  , i ){
  this.load.show_loading_gif(); //Loading gif
    let headers = new Headers({ 'Content-Type': 'application/json' });
    var url; 
    url = myGlobals.host+'/api/admin/booking_workspace/booking_detail/edit/auto_cancel';
    let body=JSON.stringify({
      id_booking: id,
      is_auto_cancel : bool
    });
    this.http.post( url, body ,{headers: headers, withCredentials:true} )
      .map(
        response => {
                this.load.hide_loading_gif(); 
                if ( response.json().error_data.exist_error  == false ) {
                  this._properties.is_auto_cancel[i] = bool;
                }
        }, error => {}
    ).subscribe();
  }

addIfeServ(record, name, lastname){
  let bwUrl = this.myUrl.substring(this.myUrl.indexOf("bworkspace") + "bworkspace".length   , -1);
  window.open(myGlobals.DOMAIN+bwUrl+"/ife;reservation_code_locator="+record+";name="+name+";lastname="+lastname);
}
selectCurrency(curr , name){
  this.editpayments.currency_name = name;
  this.editpayments.currency_type = curr;
}

selectPayment(paymentType , name){
  this.editpayments.payment_name = name;
  this.editpayments.payment_type = paymentType;
}

post_payment(sendMail) {
  this.editpayments.post_payment(sendMail)
  .map( resp => {
    if ( resp == "no"){
      setTimeout(()=>{
        this.closeNewPayment();
      } , 2000);
    }
  })
  .subscribe();
}

paymentDateFocus(){
  if ( this.editpayments.paymentsDate_error != '') {
    this.editpayments.payment_error = '';
  }
  this.editpayments.paymentsDate_error = '';
  $('html, body').one("scroll", ()=> {
    jQuery('#paymentsDate').datepicker('remove');
  });
}

focusAmount(){
  if ( this.editpayments.paymentsAmount_error != '') {
    this.editpayments.payment_error = '';
  }
  this.editpayments.paymentsAmount_error = '';
}

emptyPaymentInputs(){
  $("#successAlertHidden").hide();
  this.addPaymentButtonHidden = true;
  this.editpayments.payment_amount = "";
  this.editpayments.payment_date = "";
  this.editpayments.payment_description = "";
}

closeNewPayment(){
  this.addPaymentButtonHidden = false;
  this.editpayments.payment_error = '';
  $("#new-amenity-button").click();
  this.editpayments.payment_amount = "";
  this.editpayments.payment_date = "";
  this.editpayments.payment_description = "";
  this.editpayments.payment_name = this.editpayments.list_types[0].payment_type_name;
  this.editpayments.payment_type = this.editpayments.list_types[0].payment_type_code;
  this.editpayments.currency_name = this.editpayments.list_currencys[0].currency_symbol;
  this.editpayments.currency_type = this.editpayments.list_currencys[0].currency_code;
  $("#paymentsDate").val('');
  // jQuery('#addPaymentTable').removeClass('in');
}

}//Close class FileDetail
