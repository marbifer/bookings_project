import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import myGlobals = require('../../../../app');
import {LoadingGif} from '../../filedetail/loading_gif.service';
import {FileDetail} from '../../filedetail/filedetail';
import {DataProperties} from '../../filedetail/data_properties.service';

declare var jQuery: any;
declare var $: any;

@Injectable()
export class EditPayments{
// Get request
// Payments
payments:any = [];
days_until_services_start:any;
amount_due:any;
amount_paid:any;
amount_total:any;
// Currencies
list_types:any = [];
list_currencys:any = [];

//Post request
currency_name:any;
payment_name:any;
currency_type:any;
payment_type:any;
payment_date:any;
payment_description:any;
payment_amount:any;
send_mail:boolean;

//Errors
payment_error:any='';
paymentsAmount_error:any='';
paymentsDate_error:any='';
paymentsAmount_error_front:any='';

constructor( public http:Http, public _properties: DataProperties, public load: LoadingGif) {
}


get_payments(){
  let headers = new Headers({ 'Content-Type': 'application/json' });
  var url; 
  url = myGlobals.host+'/api/admin/booking_workspace/file_detail/payments';
  let body=JSON.stringify({
    record_locator_file: this._properties.record_locator_saved
  });
  return this.http.post( url, body ,{headers: headers, withCredentials:true} )
    .map(
      response => {
              this.payments = response.json().payments;
              this.days_until_services_start = response.json().payments.days_until_services_start;
              this.amount_due = response.json().payments.amount_due;
              this.amount_paid = response.json().payments.amount_paid;
              this.amount_total = response.json().payments.amount_total;

              console.log(response.json());
              console.log(response.json().payments.list_payments);
      }, error => {}
  );
}


get_currency_types(){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      var url; 
        url = myGlobals.host+'/api/admin/booking_workspace/file_detail/edit/payment/get_types_and_currencies';
      return this.http.get( url, {headers: headers, withCredentials:true} )
        .map(
          response => {
            this.list_types = response.json().list_types;
            this.list_currencys = response.json().list_currencys;
             console.log('++++++++++++ '+JSON.stringify(response.json()));
            return {list_types : this.list_types , list_currencys : this.list_currencys}
          }, error => {}
      );
} 


post_payment(sendMail){
  //Datepicker Service Start
  var payment_date = jQuery('#paymentsDate').val();
  if(payment_date != '' ){
    payment_date = new Date(payment_date); //Full time standard
    payment_date = payment_date.toISOString(); //ISO format
    var date3 = new Date(payment_date);
    var year3:any = date3.getFullYear();
    var month3:any = date3.getMonth()+1;
    var dt3:any = date3.getDate();

    if (dt3 < 10) {dt3 = '0' + dt3;}
    if (month3 < 10) {month3 = '0' + month3;}
    payment_date = year3+'-' + month3 + '-'+dt3; 
  } else if(payment_date == '' || payment_date == undefined){
    payment_date = '';
  }//Close else if 

  let headers = new Headers({ 'Content-Type': 'application/json' });
  var url; 
  url = myGlobals.host+'/api/admin/booking_workspace/file_detail/edit/payment/save';
  let body=JSON.stringify({
    record_locator_file: this._properties.record_locator_saved,
    currency_code: this.currency_type,
    amount: this.payment_amount,
    payment_type: this.payment_type,
    date: payment_date,
    description: this.payment_description,
    send_mail: sendMail
  });
  return this.http.post( url, body ,{headers: headers, withCredentials:true} )
    .map(
      response => {
          console.log(response.json());
          this.payment_error =  response.json().error_data.exist_error;
          if ( this.payment_error == true ){
            for (var i = 0; i < response.json().error_data.error_field_list.length; ++i) {
              if ( response.json().error_data.error_field_list[i].field == 'date' )
              this.paymentsDate_error = response.json().error_data.error_field_list[i].message
            }
            for (var i = 0; i < response.json().error_data.error_field_list.length; ++i) {
              if ( response.json().error_data.error_field_list[i].field == 'amount' )
              this.paymentsAmount_error = response.json().error_data.error_field_list[i].message
            }
            return "yes"
          } else {
              jQuery('#successAlertHidden').fadeIn('slow'); //Show message success
              setTimeout(()=>{
                jQuery('#successAlertHidden').animate({opacity: 0}, 1000).animate({height: "0px", padding: "0px"}, 1000); //Hide message success
              } , 1500);
              this.get_payments().subscribe();
            return "no"
          }

      }, error => {}
  );
}

keyup_field_amount(type, i){
    var inputs = jQuery('#amount');
    let rate_regex = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/g;

    //Dropdown Amount
    if(type == 'amount'){
      if(this.payment_amount != '' && (!rate_regex.test(this.payment_amount) || inputs.hasClass('ng-invalid'))) {
        this.paymentsAmount_error_front = true; //Clean message
      }else {
        this.paymentsAmount_error_front = false;
      }
    }
  }

} // close class EditPassenger

