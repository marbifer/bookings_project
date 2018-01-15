import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import myGlobals = require('../../../app');
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';
import {FileDetail} from '../filedetail/filedetail';

declare var jQuery: any;
declare var $: any;

/////////////////////////////////////////////////////////////////
/// Properties File Detail ///

@Injectable()
export class DataProperties{

//Data File Detail
file_detail: any;
file_reseravtion: any ='sample data';
file_detail_data = 'sample data'; //Store JSON
file_detail_book : any; //Store Booking Data from JSON
record_locator_saved : any; //Create record locator for export to class modal_cancel
hide_list_status = false; //Setted (Reservation Status) list as false to hide it
status_canceled: any;
status_confirmed: any;
status_confirmed_without_locator_external: any;
status_on_request: any;
status_confirmed_with_voucher_released: any;
status_pending: any;
status_confirmed_payment_on_destination: any;
status_cancelation_pending: any;


//Data ACTIVITY SECURITY LOG(File Detail)
file_detail_logs: any;
file_detail_communication_logs: any;
file_detail_communication_logs_count: any;
list_logs_count:any;
html = [];

//Disable button Cancel File
disable_file = false; //It's inabled

//Inline Editing Passenger
no_editing = false;
file_detail_passenger_name: any; //Edit First Name
file_detail_passenger_lastname: any; //Edit Last Name
file_detail_passname_backup: any; //Store old Passenger
file_detail_passlast_backup: any; //Store old Passenger
stop_event_pax = true; //Avoid duplicate inputs

//Inline Editing Record Locator
file_detail_locator: any; //Edit Record Locator
file_detail_loc_backup: any; //Store old Locator
stop_event_loc = true; //Avoid duplicate inputs

//Inline editing Agency Details
file_detail_agency: any;
stop_event_agency = true;

//Errors Message to Passenger(File Detail)
exist_error_pass: boolean;
field_pass: string='';
message: string='';

//Errors Message to Record Locator (File Detail)
exist_error_loc: any;
field_loc: string='';
general_error_loc ='';
message_loc: string='';
inactiveColor:string= '';

// Autocancel
is_auto_cancel = [];
auto_cancel_date = [];


constructor(public http:Http, public load: LoadingGif) {}
/////////////////////////////////////////////////
/// Get Data File Detail ///
get_file_detail(record_locator: string){
  this.load.show_loading_gif(); //Remove loading gif
  this.record_locator_saved = record_locator; //Store current record locator
	let url = myGlobals.host+'/api/admin/booking_workspace/file_detail';
  ///////////////////////
  ///Parameter filters///
  let body=JSON.stringify({ record_locator_file: record_locator });
  console.log('Body del request del filedetail: ' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });

    return  this.http.post( url, body, {headers: headers, withCredentials:true})
        .map( 
          response => {
            this.hide_list_status = true; //Show List Status
            this.load.hide_loading_gif(); //Remove loading gif
          	this.file_detail=response.json().file_detail;
            console.log('Mi filedetail: ' + JSON.stringify(this.file_detail));
            if ( this.file_detail.allow_voucher == false ) {
               this.inactiveColor = "#dcdcdc";
            } else {
               this.inactiveColor = "";
            }
            this.file_detail_data = this.file_detail;
            this.file_detail_book = this.file_detail.bookings; //Get Data Individual Bookings
            // this.file_detail_logs = this.file_detail.list_logs; //Get Data LOGS
            this.file_detail_passenger_name = this.file_detail.lead_passenger_name_first; //Edit Passenger First Name
            this.file_detail_passenger_lastname = this.file_detail.lead_passenger_name_last; //Edit Passenger Last Name
            this.file_detail_passname_backup = this.file_detail_passenger_name; //Store old Passenger Name
            this.file_detail_passlast_backup = this.file_detail_passenger_lastname;  //Store old Passenger Last Name
            this.file_detail_locator = this.file_detail.record_locator; //Edit Record Locator
            this.file_detail_loc_backup = this.file_detail_locator; //Store old Locator
            this.file_detail_agency = this.file_detail.agency_details; //Edit Agency

              for (var  m  = 0;  m  < this.file_detail_book.length ; m++  ) {
                  this.is_auto_cancel[m] = this.file_detail_book[m].is_auto_cancel;
                  this.auto_cancel_date[m] = this.file_detail_book[m].auto_cancel_date;
              }

            //States for Reservation Status
            this.file_reseravtion = this.file_detail.bookings_status;
            ////////////////////////////////////////////////////////////
            /// Button Cancel disabled because previosly is disabled ///
            var cancel_disabled = JSON.stringify(this.file_detail.allow_cancel); 
            console.log('Variable cancel_disabled: ' + cancel_disabled );
            if(cancel_disabled == 'true'){
              jQuery('.button-cancel-f').addClass('disabled'); 
              this.disable_file = true; 
            } else if(cancel_disabled == 'false'){
              this.disable_file = false;
            }
          }, error => {
        }
      ); 
}

post_fileDetail_logs(bid){
  let headers = new Headers({ 'Content-Type': 'application/json' });
  var url; 
  url = myGlobals.host+'/api/admin/booking_workspace/file_detail/logs';
  let body=JSON.stringify({
    record_locator_file: bid
  });
   this.http.post( url, body ,{headers: headers, withCredentials:true} )
    .subscribe(
      response => {
        console.log('ESTE:::: <><><><><><>:::   '+JSON.stringify(response.json().list_logs));
            this.list_logs_count = response.json().list_logs_count;
            this.file_detail_logs = response.json().list_logs;
      }, error => {}
  );
}

post_fileDetail_communication_logs(bid){
  let headers = new Headers({ 'Content-Type': 'application/json' });
  var url; 
  url = myGlobals.host+'/api/admin/booking_workspace/file_detail/communication_log';
  let body=JSON.stringify({
    record_locator_file: bid
  });
  console.log("BODY Communication log: "+body);
   this.http.post( url, body ,{headers: headers, withCredentials:true} )
    .subscribe(
      response => {
        console.log('COMMUNICATION LOGS:   '+JSON.stringify(response.json()));            
            this.file_detail_communication_logs = response.json().list_communication_log;
            this.file_detail_communication_logs_count = response.json().list_communication_log_count;
            for (var i = 0; i < this.file_detail_communication_logs.length; i++) {
                this.html[i] = this.file_detail_communication_logs[i].html;
            }
      }, error => {}
  );
}

} // close class DataProperties

