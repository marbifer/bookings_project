import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import myGlobals = require('../../../../app');
import { Location } from '@angular/common';
import {LoadingGif} from '../../filedetail/loading_gif.service';
import {BookingDetail} from '../../bookingdetail/bookingdetail';
import {DataPropertiesBookings} from '../../bookingdetail/data_properties.service';
import {filter} from '../../filter';

declare var jQuery: any;
declare var $: any;

@Injectable()
export class InternalComments{

comment_response: any;

constructor( public http:Http, public _loc:Location, public _propertiesb: DataPropertiesBookings, public load: LoadingGif, public _filters: filter) {
}

/////////////////////////////////////////
/// Save data Edit Internal Comments ///
save_internal_comments(send_mail){
    var new_comment = this._propertiesb.book_internal_comments; //Store new Comment in variable
    this.load.show_loading_gif(); //Loading gif
    let updated_comment;
    let url = myGlobals.host+'/api/admin/booking_workspace/booking_detail/edit/internal_comment';
    let body=JSON.stringify({id_booking: this._propertiesb.id_bookings, internal_comment: new_comment, send_mail: send_mail});
    console.log('INTERNAL COMMENTS BODY: ' + body);

    let headers = new Headers({ 'Content-Type': 'application/json' });
    this.http.post( url, body, {headers: headers, withCredentials:true})
    .subscribe( 
        response =>  {
            console.log('Response COMMENTS: ' + JSON.stringify(response.json()));
            updated_comment = response.json().updated;
            this.load.hide_loading_gif(); //Remove loading gif
            if (updated_comment == true){
              this._propertiesb.get_booking_detail(this._propertiesb.id_bookings).subscribe();
              this._propertiesb.book_internal_comments = new_comment;
              this.cancel_editing_internal_comments(new_comment); //Cancel or Close edit Internal Comments
              } else {
              this._propertiesb.exist_error_comm = response.json().error_data.exist_error;
              this._propertiesb.general_error_comm = response.json().error_data.general_error;
              if(this._propertiesb.general_error_comm != ''){
                //Show generic error in HTML with ngIf
                jQuery('.well, .well2').addClass('border-loc');
                jQuery('#editing-comments').hide();
                jQuery('#prueba').removeClass('collapsed')
              }
             }
        }, error => {

      }
    );
  }//Close edit_internal_comments

//////////////////////////////////////////////////////
/// Methods Inline editing for Internal Comments /////
//////////////////////////////////////////////////////
/// Inline editing: Buttons Save, Cancel ///
rollover_icons_save_cancel_comm(editing){
   var icon_inline = 'div#' + editing;
   jQuery(icon_inline).tooltip('show');
}
mouseleave_icons_save_cancel_comm(editing){
  var icon_inline = 'div#' + editing;
  jQuery(icon_inline).tooltip('hide');
}

    edit_internal_comments(){ //Mouseover
        if(this._propertiesb.stop_event_int_comments == true){ //Habilita el mouseover
            //jQuery('#comm').css('background', 'gray');  
            jQuery('#comm i').addClass('pencil-editable');
            jQuery('.textarea-holder textarea').addClass('td-editable');
        }
    }
    no_edit_internal_comments(){ //Mouseleave 
        //jQuery('#comm').css('background', 'none');
        jQuery('.well').css("backgroundColor", "transparent");
        jQuery('#comm i').removeClass('pencil-editable');
        jQuery('.textarea-holder textarea').removeClass('td-editable');
    }
    editing_internal_comments(e){ //Click div    
        if(this._propertiesb.no_editing_b == false){ //Inhabilita los demás para edición(sólo el clickeado puede ser editado)
            if(this._propertiesb.stop_event_int_comments == true){
                this._propertiesb.no_editing_b = true;
                this._propertiesb.hide_comment = true;
                jQuery('#inline-comments-default').hide();
                jQuery('#inline-comments').show();
                jQuery('#editing-comments').show();
                jQuery('.textarea-holder textarea').removeClass('td-editable');
                jQuery('.well').show().addClass('border-comm');
                jQuery('#inline-comments textarea').show().addClass('border-comm');
                jQuery('#comm').hide();
                 e.preventDefault();
                jQuery('.button-comments, .message-comm, #editing-comments').show();
                jQuery('#internalCommentsTable').addClass('in');
            }
        }
    }
    
    cancel_editing_internal_comments(cancel_comm){ //Click Icon-cancel/close 
        jQuery('.message-comm, #editing-comments').hide();
        jQuery('#inline-comments-default, #comm').show();
        jQuery('.well').removeClass('border-comm');
        jQuery('#inline-comments textarea').removeClass('border-comm');
        jQuery('#internalCommentsTable').removeClass('in');
        jQuery('.textarea-holder textarea').removeClass('td-editable');
        this._propertiesb.stop_event_int_comments = true;
        this._propertiesb.no_editing_b = false;
        this._propertiesb.hide_comment = false;
        this._propertiesb.close_comment = true;
        this._propertiesb.book_internal_comments = cancel_comm;
    }

    show_internal_comments(){
        jQuery('#internalCommentsTable').show();
    }

    handle_collapse(){
        jQuery('#internalCommentsTable').toggleClass('hide-internal-comments');
    }

} //Close class Internal Comments



