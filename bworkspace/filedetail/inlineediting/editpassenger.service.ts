import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import myGlobals = require('../../../../app');
import {LoadingGif} from '../../filedetail/loading_gif.service';
import {FileDetail} from '../../filedetail/filedetail';
import {DataProperties} from '../../filedetail/data_properties.service';

declare var jQuery: any;
declare var $: any;

@Injectable()
export class EditPassenger{

constructor( public http:Http, public _properties: DataProperties, public load: LoadingGif) {
}
/////////////////////////////////////////////////
/// Save data Edit Lead Passenger ///
save_passenger(send_mail, record_locator: string){
  var new_name = jQuery('#pass').val(); //Store new First name in variable
  var new_lastname = jQuery('#pass-lastname').val(); //Store new Last name in variable
  if(new_name == ''){ //Validate Passenger field empty
    this.validate_pass_name(); //Error Message for First Name empty from Front-End
  } else {
  this.load.show_loading_gif(); //Loading gif
  let updated;
	let url = myGlobals.host+'/api/admin/booking_workspace/file_detail/edit/pax';
  
  let body=JSON.stringify({record_locator_file: this._properties.record_locator_saved, pax_name_first: new_name, pax_name_last: new_lastname, send_mail: send_mail});
  console.log(body);
  let headers = new Headers({ 'Content-Type': 'application/json' });

      this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe( 
          response => {     
            console.log('JSON-PASS: ' + JSON.stringify(response.json()));
            this._properties.exist_error_pass = response.json().error_data.exist_error;
            updated = response.json().is_updated;
            this.load.hide_loading_gif(); //Remove loading gif
            if (updated == true){  
              this._properties.get_file_detail(this._properties.record_locator_saved).subscribe();
              this._properties.file_detail_passenger_name = new_name;
              this._properties.file_detail_passenger_lastname = new_lastname;
              this.cancel_editing_passenger(); //Cancel or Close edit passsenger
            }else {
              if(this._properties.exist_error_pass == true){
                this._properties.field_pass = response.json().error_data.error_field_list[0].field;
                this._properties.message = response.json().error_data.error_field_list[0].message;
                if(this._properties.field_pass == 'pax_name_first'){
                  //Error Message for First Name if update fails from backend
                  jQuery('#pass').tooltip('toggle');
                  jQuery('#pass').addClass('border-pass');
                  jQuery('#tool-error').append(this._properties.message);
                }
              }
            }
          }, error => {
        }    
      );
    } 
  }

///////////////////////////////////////////////////////////////////
/// Methods Inline Editing PASSENGER DETAILS ///
    edit_passenger(){ //Mouseover
        if(this._properties.stop_event_pax == true){
            jQuery('.pencil3, .pencil-pass').css('background', 'gray');
            jQuery('#edit-pass, #edit-pass-last, #name').css({ backgroundColor: "#b0d8ff", padding: "5px"});
            jQuery('.passenger-data span').css({ backgroundColor: "#b0d8ff", padding: "5px"});
            jQuery('#edit-passenger-td').addClass('td-editable');
            jQuery('#pencil-pass').addClass('pencil-editable');
        }
    }
    no_edit_passenger(){ //Mouseleave
        jQuery('.pencil3, .pencil-pass').css('background', 'none');
        jQuery('#edit-pass, #edit-pass-last, #name').css("backgroundColor", "transparent");
        jQuery('.passenger-data span').css("backgroundColor", "transparent");
        jQuery('#edit-passenger-td').removeClass('td-editable');
        jQuery('#pencil-pass').removeClass('pencil-editable');
    }
    editing_passenger(edit){ //Click div
        if(this._properties.no_editing == false){ 
            if(this._properties.stop_event_pax == true){
                this._properties.no_editing = true;
                jQuery('#editing-passenger').show();
                jQuery('#edit-passenger-td').addClass('td-editable');
                jQuery('.pencil-pass').hide();
                jQuery('.passenger-data').hide();
                jQuery('#lead, #edit-pass, #edit-pass-last, #name').hide(); //Prepare edit Lead passenger
                jQuery('#pass, #pass-lastname, #first, #last').show();
                jQuery('.edit-passenger').show();
                jQuery('#pass, #pass-lastname').removeClass('border-pass');
                jQuery('#editPassenger .error-empty-frontend').hide();
                this._properties.stop_event_pax = false;
            }
        }
    }

    cancel_editing_passenger(){ //Click Icon-cancel/close
        jQuery('#editing-passenger, .tool-container-empty, #editPassenger .error-empty-frontend').hide();
        jQuery('.pencil-pass').show();
        jQuery('.passenger-data').show();
        jQuery('#first, #edit-pass, input#pass, #last, #edit-pass-last, input#pass-lastname').hide(); //Clean input
        jQuery('.edit-passenger').hide();
        jQuery('#lead, #name').show();
        this._properties.file_detail_passenger_name = this._properties.file_detail_passname_backup; //Store old Passenger
        this._properties.file_detail_passenger_lastname = this._properties.file_detail_passlast_backup;
        this._properties.stop_event_pax = true;
        this._properties.no_editing = false;
    }

    /////////////////////////////////////////////////////
    /// Clean First Name and Last Name fields to edit ///
    clean_input_pass(){
        $('#pass').removeClass('border-pass');
    }
    clean_input_last(){
        $('#pass-lastname').removeClass('border-pass');
    }

///////////////////////////////////////
/// Styles Validate Passenger field ///
    validate_pass_name(){
        jQuery('.tool-container-empty').show();
        jQuery('#editPassenger .error-empty-frontend').show();
        jQuery('#tool-error-empty').tooltip('toggle');
        jQuery('#pass').addClass('border-pass');                  
    }

} // close class EditPassenger

