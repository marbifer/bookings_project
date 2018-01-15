import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import myGlobals = require('../../../../app');
import { Location } from '@angular/common';
import {LoadingGif} from '../../filedetail/loading_gif.service';
import {FileDetail} from '../../filedetail/filedetail';
import {DataProperties} from '../../filedetail/data_properties.service';
import {filter} from '../../filter';

declare var jQuery: any;
declare var $: any;

@Injectable()
export class RecordLocator{

constructor( public http:Http, public _loc:Location, public _properties: DataProperties, public load: LoadingGif, public _filters: filter) {
}

/////////////////////////////////////////////////
/// Save data Edit RECORD LOCATOR ///
save_locator(send_mail){
  var new_locator = jQuery('#loc').val(); //Store new name in variable
  this.load.show_loading_gif(); //Loading gif
  let updated_loc;
  let url = myGlobals.host+'/api/admin/booking_workspace/file_detail/edit/locator';
  let body=JSON.stringify({record_locator_file_old: this._properties.record_locator_saved, record_locator_file_new: new_locator, send_mail : send_mail});
  console.log('body de LOC1' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });

      this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe( 
          response => {
            console.log('JSON-LOC1: ' + JSON.stringify(response.json()));
            updated_loc=response.json().is_updated;
            if (updated_loc == true){
              this._properties.get_file_detail(this._properties.record_locator_saved);
              this._properties.file_detail_locator=new_locator;
              var get_url = this._filters.create_url(); 
              this._loc.go('/app/bworkspace/filedetail;record_locator='+ new_locator +';'+ get_url);
              var ul= window.location.href; //Store currenly URL
              window.location.href = ul; //Redirect URL
              this.cancel_editing_record(); //Cancel or Close edit Locator

        ////////////////////////////////////////////////////
        ////////// New request updated data ////////////////  
        let url = myGlobals.host+'/api/admin/user_admin/user_file_detail';
        let body=JSON.stringify({record_locator_file: this._properties.file_detail_locator}); //New locator
        console.log('2do body: ' + body);
        let headers = new Headers({ 'Content-Type': 'application/json' });

            this.http.post( url, body, {headers: headers, withCredentials:true})
              .subscribe( 
                response => {
                  console.log('JSON-LOC2: ' + JSON.stringify(response.json()));
                  this._properties.file_detail=response.json().file_detail;
                  console.log('filedetail: ' + JSON.stringify(this._properties.file_detail));
                  this._properties.file_detail_data = this._properties.file_detail;
                  this._properties.file_detail_book = this._properties.file_detail.bookings; //Get Data Individual Bookings
                  this._properties.file_detail_logs = this._properties.file_detail.list_logs; //Get Data LOGS
                  this._properties.file_detail_passenger_name = this._properties.file_detail.lead_passenger_name_first; //Edit Passenger First Name
                  this._properties.file_detail_passenger_lastname = this._properties.file_detail.lead_passenger_name_last; //Edit Passenger Last Name
                  this._properties.file_detail_locator = this._properties.file_detail.record_locator; //Edit Record Locator
                  this.load.hide_loading_gif(); //Remove loading gif
              }, error => {
              }
            ); 
            ///////////// Close request updated /////////////
            }else {
              this.load.hide_loading_gif(); //Remove loading gif
              this._properties.general_error_loc = response.json().error_data.general_error;
              this._properties.exist_error_loc = response.json().error_data.exist_error;
              if(this._properties.general_error_loc != ''){
                //Show generic error in HTML with ngIf
                jQuery('#loc').addClass('border-errors');
              } else if(this._properties.general_error_loc == ''){
                this._properties.field_loc = response.json().error_data.error_field_list[0].field;
                this._properties.message_loc = response.json().error_data.error_field_list[0].message;
                if(this._properties.field_loc == 'locator'){
                  //Error Message for First Name if update fails from backend
                  jQuery('#loc').tooltip('toggle');
                  jQuery('#loc').addClass('border-errors');
                  jQuery('#tool-error-loc').append(this._properties.message_loc);
                }
              }
             }
          }, error => {
        }
      ); 
  } //Close save_locator

/////////////////////////////////////////////////////////////////
/// Methods Inline editing for Record Locator ///

////////////////////////////////////////////
/// Inline editing: Buttons Save, Cancel ///
rollover_icons_save_cancel(editing){
   var icon_inline = 'div#' + editing;
   jQuery(icon_inline).tooltip('show');
}
mouseleave_icons_save_cancel(editing){
  var icon_inline = 'div#' + editing;
  jQuery(icon_inline).tooltip('hide');
}

    edit_locator(){ //Mouseover
        if(this._properties.stop_event_loc == true){ //Habilita el mouseover y el fondo azul
            //jQuery('.pencil1').css('background', 'gray');
            jQuery('#edit-locator').css({ backgroundColor: "#b0d8ff", padding: "5px"});
            jQuery('#record-locator-td').addClass('td-editable');
            jQuery('#pencil-loc').addClass('pencil-editable');
        }
    }
    no_edit_locator(){ //Mouseleave
        //jQuery('.pencil1').css('background', 'none');
        jQuery('#edit-locator').css("backgroundColor", "transparent");
        jQuery('#record-locator-td').removeClass('td-editable');
        jQuery('#pencil-loc').removeClass('pencil-editable');
    }
    editing_record(){ //Click div
    if(this._properties.no_editing == false){ //Inhabilita los demás para edición(sólo el clickeado puede ser editado)
        if(this._properties.stop_event_loc == true){
            this._properties.no_editing = true;
            //jQuery('.show-grid').addClass('inline-up');
            //jQuery('#editing-locator').show();
            jQuery('#editLocator').show();
            jQuery('#record-locator-td').removeClass('td-editable');
            //jQuery('#pencil-loc').show().addClass('white-loc');
            jQuery('.pencil1').hide();
            jQuery('#edit-locator').hide(); //Preprare edit Locator
            jQuery('#loc').show();
            this._properties.stop_event_loc = false; //Inhabilita el mouseover y el fondo azul una vez se da click para editar
        }
    }
}
    
    cancel_editing_record(){ //Click Icon-cancel/close
        //jQuery('.show-grid').removeClass('inline-up');
        //jQuery('#editing-locator').hide(); 
        jQuery('#editLocator').hide();
        //jQuery('#pencil-loc').show().removeClass('white-loc');
        jQuery('.pencil1').show();
        jQuery('#loc').hide(); //Clean input
        jQuery('#edit-locator').show(); 
        this._properties.file_detail_locator = this._properties.file_detail_loc_backup; //Store old Locator
        this._properties.stop_event_loc = true;
        this._properties.no_editing = false;
    }

///////////////////////////////////////////
/// Clean Record Locator field to edit ////
    clean_input_loc(){
        $('#loc').removeClass('border-loc');
    }

}// close class recordlocator



