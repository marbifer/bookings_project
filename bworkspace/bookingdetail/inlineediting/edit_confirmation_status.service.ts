import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import myGlobals = require('../../../../app');
import { Location } from '@angular/common';
import {LoadingGif} from '../../filedetail/loading_gif.service';
import {BookingDetail} from '../../bookingdetail/bookingdetail';
import {DataPropertiesBookings} from '../../bookingdetail/data_properties.service';
import {filter} from '../../filter';
import { Observable } from "rxjs/Observable"
import { Subject }    from 'rxjs/Subject';
declare var jQuery: any;
declare var $: any;

@Injectable()
export class ConfirmationAndStatus{

dropdown_response: any;
warningVisible: boolean = false;

  private notify = new Subject<any>();
  notifyObservable = this.notify.asObservable();



constructor( public http: Http, public _loc: Location, public _propertiesb: DataPropertiesBookings, public load: LoadingGif, public _filters: filter) {
}

/////////////////////////////////////////////////////
/// Dropdown Reservation Status ///
dropdown_request(){
    let url = myGlobals.host+'/api/admin//booking_workspace/booking_detail/edit/confirmation_number_get_actual_status';
    let body=JSON.stringify({id_booking: this._propertiesb.id_bookings});
    console.log('DROPDOWN BODY: ' + body);

    let headers = new Headers({ 'Content-Type': 'application/json' });
    this.http.post( url , body , {headers: headers, withCredentials:true})
    .subscribe( 
        response =>  {
            console.log('JSON Response-Confirmation: ' + JSON.stringify(response.json()));
            this.dropdown_response = response.json().list_status;
            console.log('lista de status: ' + JSON.stringify(this.dropdown_response));
            this._propertiesb.status_code =  response.json().actual_status.code;
            console.log('Code actual: ' + JSON.stringify(this._propertiesb.status_code));
            this._propertiesb.book_detail_status_code_backup = this._propertiesb.status_code;
            this.load.hide_loading_gif();
        }, error => {

      }
    );
  }//Close dropdown_request

notifyOther(data: any) {
        if (data) {
          this.notify.next(data);
        }
    }
/////////////////////////////////////////////////////
/// Save data Edit Confirmation Number and Status ///
save_confirmation_status(send_mail){
  var new_confirmation_number = jQuery('#conf-status').val(); //Store new name in variable
  this.load.show_loading_gif(); //Loading gif
  let updated_confirmation_num;
  let url = myGlobals.host+'/api/admin//booking_workspace/booking_detail/edit/confirmation_number_status';
  
  let body=JSON.stringify({id_booking: this._propertiesb.id_bookings, confirmation_number: new_confirmation_number, status_code: this._propertiesb.status_code, send_mail: send_mail});
  console.log('body confirmation' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });

      this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe( 
          response => {
            this.notifyOther('...');
            console.log('RESPONSE confirmation number SAVE: ' + JSON.stringify(response.json()));
            updated_confirmation_num=response.json().updated;
            if (updated_confirmation_num == true){
              this._propertiesb.get_booking_detail(this._propertiesb.id_bookings).subscribe(()=>{
                 this.warningVisible = false;
              });
              this._propertiesb.book_detail_conf_status = new_confirmation_number;
              this.cancel_editing_confirmation_status(); //Clean inputs after saver       
              }else {
              this.load.hide_loading_gif(); //Remove loading gif
              this._propertiesb.general_error_conf = response.json().error_data.general_error;
              console.log('Error general: ' + JSON.stringify(this._propertiesb.general_error_conf));
              this._propertiesb.exist_error_conf = response.json().error_data.exist_error;
              if(this._propertiesb.general_error_conf != ''){
                //Show generic error in HTML with ngIf
                jQuery('#conf-status').addClass('border-loc');
              } else if(this._propertiesb.general_error_conf == ''){
                this._propertiesb.field_conf = response.json().error_data.error_field_list[0].field;
                this._propertiesb.message_conf = response.json().error_data.error_field_list[0].message;
                if(this._propertiesb.field_conf == 'confirmation_number'){
                  //Error Message if update fails from backend
                  jQuery('#conf-status').tooltip('toggle');
                  jQuery('#conf-status').addClass('border-loc');
                  jQuery('#tool-error-conf').append(this._propertiesb.message_conf);
                }
              }
             }
        }, error => {
        }
      ); 
  } //Close save_confirmation_status

//////////////////////////////////////////////////////
/// Methods Inline editing for Confirmation Number ///
//////////////////////////////////////////////////////
/// Inline editing: Buttons Save, Cancel ///
rollover_icons_save_cancel(editing){
   var icon_inline = 'div#' + editing;
   jQuery(icon_inline).tooltip('show');
}
mouseleave_icons_save_cancel(editing){
  var icon_inline = 'div#' + editing;
  jQuery(icon_inline).tooltip('hide');
}

    edit_confirmation_status(){ //Mouseover
        if(this._propertiesb.stop_event_conf_status == true){ //Habilita el mouseover y el fondo azul
            //jQuery('#conf1, #locator-res').css('background', 'gray');
            /*jQuery('.pencil1').css('background', 'gray');*/
            jQuery('.edit-locator').css({ backgroundColor: "#b0d8ff", padding: "5px"});
            jQuery('#confirmation-number-td').addClass('td-editable');
            jQuery('#reservationStatus-td').addClass('td-editable');
            jQuery('#pencil-loc').addClass('pencil-editable');
        }
    }
    no_edit_confirmation_status(){ //Mouseleave
        jQuery('#conf1, #locator-res').css('background', 'none');
        /*jQuery('.pencil').css('background', 'none');*/
        jQuery('#font-number').css("backgroundColor", "transparent");
        jQuery('.edit-locator').css("backgroundColor", "transparent");
        jQuery('#confirmation-number-td, #reservationStatus-td').removeClass('td-editable');
        jQuery('#pencil-loc').removeClass('pencil-editable');
    }
    editing_confirmation_status(){ //Click div
    if(this._propertiesb.no_editing_b == false){ //Inhabilita los demás para edición(sólo el clickeado puede ser editado)
        if(this._propertiesb.stop_event_conf_status == true){
            this._propertiesb.no_editing_b = true;
            /*jQuery('#conf-status').show().addClass('inline-up-conf');
            jQuery('.show-grid').addClass('inline-up');
            jQuery('#editing-locator, #dropdownMenu1').show();
            jQuery('#pencil-loc').show().addClass('white-loc');
            jQuery('#font-number').hide(); //Preprare Confirmation Number
            jQuery('#book-status').hide(); //Preprare Status
            jQuery('.edit-locator').hide(); //Preprare Status
            jQuery('#conf-status').show().removeClass('border-loc');*/
            jQuery('#editLocator').show();
            jQuery('.pencil1').hide();
            jQuery('#confirmation-number-td, #reservationStatus-td').removeClass('td-editable');
            jQuery('.edit-locator').hide(); //Preprare edit Locator
            jQuery('#conf-status, #dropdownMenu1').show();
            this._propertiesb.stop_event_conf_status = false; //Inhabilita el mouseover y el fondo azul una vez se da click para editar
            
            //Call request Dropdown Status
            this.dropdown_request();
        }
    }
}
    
    cancel_editing_confirmation_status(){ //Click Icon-cancel/close
        /*jQuery('.show-grid').removeClass('inline-up');
        jQuery('#conf-status').removeClass('inline-up-conf');
        jQuery('#editing-locator').hide(); 
        jQuery('#pencil-loc').show().removeClass('white-loc');
        jQuery('#font-number, #book-status').show(); 
        jQuery('input#conf-status, #dropdownMenu1').hide(); //Clean input*/
        jQuery('#editLocator').hide();
        jQuery('.pencil1').show();
        jQuery('#conf-status, #dropdownMenu1').hide(); //Clean input
        jQuery('.edit-locator').show();
        this._propertiesb.book_detail_conf_status = this._propertiesb.book_detail_conf_status_backup; //Store old Confirmation Number
        this._propertiesb.stop_event_conf_status = true;
        this._propertiesb.no_editing_b = false;
        this._propertiesb.status_b = this._propertiesb.status_backup;
        this._propertiesb.status_code = this._propertiesb.book_detail_status_code_backup;
    }

//////////////////////////////////////////////////////////
/// Clean Confirmation Number and Status field to edit ///
clean_input_confirmation_status(){
    $('#conf-status').removeClass('border-loc');
}

//////////////////////////////////////////////
/// Select Reservation Status for Dropdown ///
select_status(status_name, status_code){
    this._propertiesb.status_b = status_name;
    this._propertiesb.status_code = status_code;
}

} //Close class ConfirmationAndStatus



