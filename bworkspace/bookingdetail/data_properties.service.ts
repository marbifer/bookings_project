import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import myGlobals = require('../../../app');
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';
import {BookingDetail} from '../bookingdetail/bookingdetail';

declare var jQuery: any;
declare var $: any;

/////////////////////////////////////////////////////////////////
/// Properties Booking Detail ///

@Injectable()
export class DataPropertiesBookings {

//Data Booking Detail
booking_detail;
booking_detail_data = 'sample data'; //Store JSON
service_type: any;
record_locator_actual= '';
book_is_online: boolean;

//Hotels Service
book_agency_name: any;
book_agency_operator: any;
book_agency_reference: any;
book_agency_reference_bkp: any;
book_agency_email: any;
book_agency_phone: any;
book_service_name_hotel: any;
book_service_image = myGlobals.DOMAIN_IMG + '/assets/images/0-th.jpg';
book_service_address: any;
book_service_phone: any;
list_pass_rooms: any
list_pass_details: any;
provider_comments: any;
count_rooms_hotel: any;

//Packages and Attraction Service
list_pass_pack: any;
pass_title_packages: any;
pass_category_packages: any;
book_service_pack: any;

//Internal comments
book_internal_comments: any;
book_internal_comments_backup: any;
id_bookings: any; //Create ID for export to class modal_cancel_bookings and class modal_delete_bookings
status_b: any;
status_code: any;

//Prices
price_provider_cost: any;
price_net_rate: any;
price_client_commision: any;
price_client_sale: any;
//Cancellation Prices
cancellation_provider_cost: any;
cancellation_net_rate: any;
cancellation_client_commision: any;
cancellation_client_sale: any;
cancellation_is_informed_by_provider: boolean;

//Data ACTIVITY SECURITY LOG(Booking Detail)
booking_detail_logs: any;

//Disable button Cancel Booking
disable_booking_b = false; //It's enabled

//Inline Editing Confirmation Number and Status
status_backup: any; //Store a backup Status in case user cancel selection
book_detail_conf_status: any; //Edit Record Confirmation ans Status
book_detail_conf_status_backup: any; //Store old Confirmation ans Status
book_detail_status_code_backup: any; //Store a backup Status Code in case user cancel selection
stop_event_conf_status = true; //Avoid duplicate inputs
no_editing_b = false;

//Inline Editing Internal Comments
stop_event_int_comments = true; //Avoid duplicate inputs
hide_comment: any = false;
close_comment: any = false;

//Inline Editing Passenger

//Inline editing Agency Details
no_editing = false;
booking_detail_agency: any;
stop_event_agency = true;
record_locator ="";

//Errors Message to Passenger(Booking Detail)

//Errors Message to Confirmation Number (Booking Detail)
exist_error_conf: any;
field_conf: string='';
general_error_conf ='';
message_conf: string='';

//Errors Message to Internal Comments (Booking Detail)
exist_error_comm: any;
field_comm: string='';
general_error_comm ='';
message_comm: string='';
inactiveColor:string= '';
response_json_files:any;

//communication log
booking_detail_communication_logs: any;
booking_detail_communication_logs_count: any;
html = [];

// Autocancel
is_auto_cancel:boolean;
auto_cancel_date:any;

viewAutomaticCancellator:boolean=false;

constructor(public http:Http, public load: LoadingGif) {}
/////////////////////////////////////////////////
/// Get Data Booking Detail ///
get_booking_detail(id_bookings){
  this.load.show_loading_gif_book(); //Remove loading gif
  this.id_bookings = id_bookings; //Store current ID bookings
	let url = myGlobals.host+'/api/admin/booking_workspace/booking_detail';
  let body=JSON.stringify({ id: id_bookings });
  console.log('body cancel: ' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });

   return  this.http.post( url, body, {headers: headers, withCredentials:true})
          .map( 
          response => {
            this.load.hide_loading_gif_book(); //Remove loading gif
          	this.booking_detail=response.json().booking_detail;
            console.log('respuesta BOOKING DETAIL: ' +  JSON.stringify(this.booking_detail));
            console.log('RESPONSE BOOKING DETAIL: ' +  JSON.stringify(response.json()));

            //Get Data Booking Detail
            this.booking_detail_data = this.booking_detail;
            //States for Reservation Status 
            this.status_b = this.booking_detail.reservation_status;
            this.status_backup =  this.status_b;
            this.book_detail_conf_status = this.booking_detail.confirmation_number;
            this.book_detail_conf_status_backup = this.book_detail_conf_status;
            this.record_locator_actual = this.booking_detail.record_locator;

            //Get Data Prices
            //Price
            this.price_provider_cost = this.booking_detail.price.provider_cost;
            this.price_net_rate = this.booking_detail.price.net_rate;
            this.price_client_commision = this.booking_detail.price.client_commision;
            this.price_client_sale = this.booking_detail.price.client_sale;
            //Cancellation Price
            this.cancellation_provider_cost = this.booking_detail.cancellation_price.provider_cost;
            this.cancellation_net_rate = this.booking_detail.cancellation_price.net_rate;
            this.cancellation_client_commision = this.booking_detail.cancellation_price.client_commision;
            this.cancellation_client_sale = this.booking_detail.cancellation_price.client_sale;
            this.cancellation_is_informed_by_provider = this.booking_detail.cancellation_price.is_informed_by_provider;
                     
            //Get Data Agency Details
            this.book_agency_name = this.booking_detail.agency_details.name;
            this.book_agency_operator = this.booking_detail.agency_details.operator_ag;
            this.book_agency_reference = this.booking_detail.agency_details.reference_code;
            this.book_agency_reference_bkp = this.booking_detail.agency_details.reference_code;
            this.book_agency_email = this.booking_detail.agency_details.email;
            this.book_agency_phone = this.booking_detail.agency_details.phone;

            //Get Data Service Details
            this.service_type = this.booking_detail.service_type;
            this.book_service_name_hotel = this.booking_detail.service.name;
            this.book_service_image = this.booking_detail.service.image;
            this.book_service_address = this.booking_detail.service.address;
            this.book_service_phone = this.booking_detail.service.phone;
            this.book_service_pack = this.booking_detail.service; //Packages and Attraction

            //Get Data Passenger Details Hotels
            this.list_pass_rooms = this.booking_detail.service.list_rooms;
            this.count_rooms_hotel = this.booking_detail.service.list_rooms_count - 1;
            
            //Get Data Passenger Details Packages
            this.pass_title_packages = this.booking_detail.service.service_name;
            this.pass_category_packages = this.booking_detail.service.category;
            this.list_pass_pack = this.booking_detail.list_passenger_details;

            //Get Data Policies
            this.provider_comments = this.booking_detail.provider_comments;       

            //Get Data LOGS
            //this.booking_detail_logs = this.booking_detail.list_logs;

            //Get Data Internal Comments
            this.book_internal_comments = this.booking_detail.internal_comments;
            this.book_internal_comments_backup = this.booking_detail.internal_comments; 
            this.book_is_online =  this.booking_detail.is_online;          

            this.is_auto_cancel = this.booking_detail.is_auto_cancel;
            this.auto_cancel_date = this.booking_detail.auto_cancel_date;
            
            if ( this.booking_detail.allow_voucher == false ) {
               this.inactiveColor = "#dcdcdc";
            } else {
               this.inactiveColor = "";
            }
            ////////////////////////////////////////////////////////////
            /// Button Cancel disabled because previosly is disabled ///
            var cancel_disabled_b = JSON.stringify(this.booking_detail.allow_cancel); 
            console.log('Variable cancel_disabled: ' + cancel_disabled_b );
            if(cancel_disabled_b == 'true'){
              this.disable_booking_b = false; 
            } else if(cancel_disabled_b == 'false'){
              jQuery('.button-cancel-f').addClass('disabled'); 
              this.disable_booking_b = true;
            }

            let date = new Date();
            let dd = date.getDate();
            let mm = date.getMonth(); //January is 0!
            let yyyy = date.getFullYear();
            let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            let today=dd+'-'+monthNames[date.getMonth()]+'-'+yyyy;
            if ( this.booking_detail.date_created == this.auto_cancel_date || this.auto_cancel_date <= today ){
              this.viewAutomaticCancellator = false;
            } else {
              this.viewAutomaticCancellator = true;
            }
            console.log('Variable cancel_disabled: ' + cancel_disabled_b);
          }, error => {
        }
      ); 
}


post_bookingDetail_logs(bid){
  let headers = new Headers({ 'Content-Type': 'application/json' });
  var url; 
  url = myGlobals.host+'/api/admin/booking_workspace/booking_detail/logs';
  let body=JSON.stringify({
    id: bid
  });
   this.http.post( url, body ,{headers: headers, withCredentials:true} )
    .subscribe(
      response => {
            this.booking_detail_logs = response.json().booking_detail_logs;
      }, error => {}
  );
}

/*post_bookingDetail_communication_logs(bid){
  let headers = new Headers({ 'Content-Type': 'application/json' });
  var url; 
  url = myGlobals.host+'/api/admin/booking_workspace/booking_detail/communication_log';
  let body=JSON.stringify({
    id_booking: bid
  });
  console.log("BODY Communication log: "+body);
   this.http.post( url, body ,{headers: headers, withCredentials:true} )
    .subscribe(
      response => {
        console.log('COMMUNICATION LOGS:   '+JSON.stringify(response.json()));            
            this.booking_detail_communication_logs = response.json().list_communication_log;
            this.booking_detail_communication_logs_count = response.json().list_communication_log_count;
            this.xml = this.booking_detail_communication_logs.code;
             
            console.log('NO SE => ' + this.xml);
            
      }, error => {}
    );*/

post_bookingDetail_communication_logs(bid){
    let url = myGlobals.host+'/api/admin/booking_workspace/booking_detail/communication_log';
    let body=JSON.stringify({ id_booking: bid });
    console.log('body cancel: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    this.http.post( url, body, {headers: headers, withCredentials:true})
    .subscribe( 
        response => {
            this.load.hide_loading_gif_book(); //Remove loading gif
            console.log('COMMUNICATION LOGS:   '+JSON.stringify(response.json()));            
            this.booking_detail_communication_logs = response.json().list_communication_log;
            this.booking_detail_communication_logs_count = response.json().list_communication_log_count;
            // for (var i = 0; i < this.booking_detail_communication_logs.length; i++) {
            //     console.log("HTML"+ this.booking_detail_communication_logs[i].html);
            //     this.html[i] = this.booking_detail_communication_logs[i].html;
            // }
        }, error => {}
    );
}

} // close class DataPropertiesBookings