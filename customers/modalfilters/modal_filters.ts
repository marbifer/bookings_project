import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, OnInit } from '@angular/core';
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
import { Modal, BS_MODAL_PROVIDERS as MODAL_P } from 'angular2-modal/plugins/bootstrap'; //Modal
import {Core} from '../../core/core';
import { Location } from '@angular/common';
import myGlobals = require('../../../app');
import {Agencies} from '../../customers/list-agencies/agencies';
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';
import {ModalFiltersServiceAgencies} from '../../customers/modalfilters/modalfilters.service'; //Service
import {DataPropertiesListAgencies} from '../list-agencies/data_properties.service'; //Service
import {filters} from '../filters';

declare var jQuery: any;
declare var $: any;

/////////////////
///Modal cancel//
@Component({
  selector: 'modal_filters',
  template: require('./modal_filters.html'),
  /*encapsulation: ViewEncapsulation.None,*/
  directives: [ROUTER_DIRECTIVES, [Widget]],
  styles: [require('./modal_filters.scss')]
})

export class ModalFiltersAgencies {

fromRefresh: boolean;
ready_for_close = true; //Close modal and return Bworkspace
number_of_page = 1;
validation_email_filter: any;

constructor(
  public http: Http, 
  public params: RouteParams, 
  public router: Router, 
  public modal: Modal, 
  public load: LoadingGif, 
  viewContainer: ViewContainerRef, 
  public _filter: filters,
  public _filter_service: ModalFiltersServiceAgencies, 
  public _service: DataPropertiesListAgencies, 
  public _loc: Location
) {
  modal.defaultViewContainer = viewContainer; //Modal Filters
}
ngOnInit() {
    //////////////////////////////////////////
    /// Close Modal Filters with key Scape ///
    jQuery(document).keyup(function(event){
      if(event.which == 27){
        jQuery("modal-backdrop").remove();
    }
  });
  ////////////////////////////////////////////////////////
  /// Recover selected Pills after close Modal Filters ///
  if(this._filter_service.filter_name_array.length>0){
    jQuery('.li-agency').addClass('active-items');
  }
  if(this._filter_service.filter_email_array.length>0){
    jQuery('.li-email').addClass('active-items');
  }
  if(this._filter_service.filter_phone_number_array.length>0){
    jQuery('.li-phone').addClass('active-items');
  }
  if(this._filter_service.filter_tax_number_array.length>0){
    jQuery('.li-tax').addClass('active-items');
  }
  if(this._filter_service.filter_address_array.length>0 || this._filter_service.filter_city_array.length>0 || this._filter_service.filter_state_array.length>0 || this._filter_service.filter_country_array.length>0 || this._filter_service.filter_zip_array.length>0){
    jQuery('.li-location').addClass('active-items');
  }
  if(this._filter_service.filter_has_bookings_array.length>0){
    jQuery('.li-book').addClass('active-items');
  }
  if(this._filter_service.filter_status_array.length>0){
    jQuery('.li-status').addClass('active-items');
  }

  ////////////////////////////////////////
  /// Edit Pills after open every Pill ///
  if(this._filter_service.event_type == 'edit'){ //Check if edit or new pill
    if(this._filter_service.edit_filter == 'agency_name'){ //Verify wich pill 
      this.show_filter_agency();
    }
    if(this._filter_service.edit_filter == 'email'){ //Verify wich pill 
      this.show_filter_email();
    }
    if(this._filter_service.edit_filter == 'phone'){ //Verify wich pill 
      this.show_filter_phone_number();
    }
    if(this._filter_service.edit_filter == 'tax'){ //Verify wich pill 
      this.show_filter_tax_number();
    }
    if(this._filter_service.edit_filter == 'location'){ //Verify wich pill 
      this.show_filter_location();
    }
    if(this._filter_service.edit_filter == 'bookings'){ //Verify wich pill 
      this.show_filter_bookings();
    }
    if(this._filter_service.edit_filter == 'status'){ //Verify wich pill 
      this.show_filter_status();
    }
  }

} //Close ngOnInit

////////////////////////////
/// Modal refresh method ///
refreshModalFilters(){
  this._filter_service.clearModalFilter();
  this._filter.clearFilter();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
/// Button 'search' for modal filters and return List Agencies(Close when click out side of Modal) ///
search(filtering_state){
  this.load.show_loading_gif_bw(); //Show loading gif
  //Store array from service(modalfilters.service.ts) in array model(filters.ts)
  this._filter.name = this._filter_service.filter_name_array;
  this._filter.email = this._filter_service.filter_email_array;
  this._filter.phone_number = this._filter_service.filter_phone_number_array;
  this._filter.tax_number = this._filter_service.filter_tax_number_array;
  this._filter.address = this._filter_service.filter_address_array;
  this._filter.city = this._filter_service.filter_city_array;
  this._filter.state = this._filter_service.filter_state_array;
  this._filter.country = this._filter_service.filter_country_array;
  this._filter.zip = this._filter_service.filter_zip_array;
  this._filter.has_bookings = this._filter_service.filter_has_bookings_array;
  this._filter.status = this._filter_service.filter_status_array;

  // Control variable
  this.fromRefresh = false;

  var selected_page;
  if(filtering_state=='is_new_filtering'){
    selected_page=1;
  }else if(filtering_state=='no_filtering'){
    selected_page=this._filter.number_of_page;
  }
  console.log("List agencies: "+this._filter.name);
  setTimeout(()=>{
    this._service.get_list_agencies( {page: selected_page})
    .map(data => 
      {
           // this._filter_service.notifyOther(data);
           if ( data.total_page > 1 ) {
              this._filter_service.showPaginationFilter = true;
              this._filter_service.triggerInfo = true;
              setTimeout(()=>{
                this._filter_service.triggerInfo = false;
              } , 1000)
          } else {
             this._filter_service.showPaginationFilter = false;
          }
      }).subscribe(); //Call request function
    this._filter.replace_string(); //Change "/" to "-"
    var get_url = this._filter.create_url();
    console.log('/app/customers/list-agencies;' + get_url);
    this._loc.go('/app/customers/list-agencies;'+ get_url);
    console.log('Antes del remove: ' + this._filter_service.content_input_agency);
    this.remove_modal_filters();
    console.log('Después del remove: ' + this._filter_service.content_input_agency);   
  } , 500)
} // Close method search

////////////////////////////
/// EVENTS MODAL FILTERS ///
////////////////////////////
//// FILTER AGENCY NAME ////
show_filter_agency(){
  if(this._filter_service.event_type == 'new'){
    this._filter_service.content_input_agency = '';
    jQuery('#filter-Agency').val(''); //Clean input Agency, I(Fernanda) don't empty NgModel because is useful for edit function
  } else if(this._filter_service.event_type == 'edit'){
    this._filter_service.content_input_agency = this._filter_service.filter_name_array[this._filter_service.iteration]; //Recover Data from Pill
    this._filter_service.content_input_agency_backup = this._filter_service.content_input_agency; //Recover Pill form URL and store in Backup
  }
  jQuery(".column-agency-name").show();
  jQuery(".column-filters, .column-email, .column-phone, .column-tax, .column-location, .column-bookings, .column-status").hide();
  //jQuery('.li-agency, .li-email, .li-phone, .li-tax, .li-location, .li-book, .li-status').removeClass('active-items');
  this.ready_for_close = false;
}

agency_enter(e){ //Filter with key Enter
  if (e.which == 13) {
      this.save_agency();
  }
}

///////////////////////
//// FILTER E-MAIL ////
show_filter_email(){
  if(this._filter_service.event_type == 'new'){
    this._filter_service.content_input_email = '';
    jQuery('#filter-Email').val(''); //Clean input E-mail
  }
  else if(this._filter_service.event_type == 'edit'){
    this._filter_service.content_input_email = this._filter_service.filter_email_array[this._filter_service.iteration]; //Recover Data from Pill
    this._filter_service.content_input_email_backup = this._filter_service.content_input_email;
  }
  jQuery(".column-email").show();
  jQuery(".column-filters, .column-agency-name, .column-phone, .column-tax, .column-location, .column-bookings, .column-status").hide();
  //jQuery('.li-agency, .li-email, .li-phone, .li-tax, .li-location, .li-book, .li-status').removeClass('active-items');
  this.ready_for_close = false;
}

email_enter(e){ //Filter with key Enter
  if (e.which == 13) {
      this.save_email();
  }
}

///////////////////////////
/// FILTER PHONE NUMBER ///
show_filter_phone_number(){
  if(this._filter_service.event_type == 'new'){
    this._filter_service.content_input_phone = '';
    jQuery('#filter-Phone').val(''); //Clean input E-mail
  }
  else if(this._filter_service.event_type == 'edit'){
    this._filter_service.content_input_phone = this._filter_service.filter_phone_number_array[this._filter_service.iteration]; //Recover Data from Pill
    this._filter_service.content_input_phone_backup = this._filter_service.content_input_phone;
  }
  jQuery(".column-phone").show();
  jQuery(".column-filters, .column-agency-name, .column-email, .column-tax, .column-location, .column-bookings, .column-status").hide();
  //jQuery('.li-agency, .li-email, .li-phone, .li-tax, .li-location, .li-book, .li-status').removeClass('active-items');
  this.ready_for_close = false;
}

phone_enter(e){ //Filter with key Enter
  if (e.which == 13) {
      this.save_phone_number();
  }
}

/////////////////////////
/// FILTER TAX NUMBER ///
show_filter_tax_number(){
  if(this._filter_service.event_type == 'new'){
    this._filter_service.content_input_tax = '';
    jQuery('#filter-Tax').val(''); //Clean input Tax Number
  }
  else if(this._filter_service.event_type == 'edit'){
    this._filter_service.content_input_tax = this._filter_service.filter_tax_number_array[this._filter_service.iteration]; //Recover Data from Pill
    this._filter_service.content_input_tax_backup = this._filter_service.content_input_tax;
  }
  jQuery(".column-tax").show();
  jQuery(".column-filters, .column-agency-name, .column-email, .column-phone, .column-location, .column-bookings, .column-status").hide();
  //jQuery('.li-agency, .li-email, .li-phone, .li-tax, .li-location, .li-book, .li-status').removeClass('active-items');
  this.ready_for_close = false;
}

tax_enter(e){ //Filter with key Enter
  if (e.which == 13) {
      this.save_tax();
  }
}

///////////////////////
/// FILTER LOCATION ///
show_filter_location(){
  if(this._filter_service.event_type == 'new'){
    jQuery('#filter-Address').val(''); //Clean input Address
    jQuery('#filter-City').val(''); //Clean input City
    jQuery('#filter-State').val(''); //Clean input State
    jQuery('#filter-Country').val(''); //Clean input Country
    jQuery('#filter-Zip').val(''); //Clean input Zip
    this._filter_service.content_input_address = '';
    this._filter_service.content_input_city = '';
    this._filter_service.content_input_state = '';
    this._filter_service.content_input_country = '';
    this._filter_service.content_input_zip = '';

  }else if(this._filter_service.event_type == 'edit'){ 
    //Recover Data from Pill
    if(this._filter_service.filter_address_array[this._filter_service.iteration] == undefined){
      this._filter_service.content_input_address = '';
    } else if(this._filter_service.filter_address_array[this._filter_service.iteration] != undefined){
      this._filter_service.content_input_address = this._filter_service.filter_address_array[this._filter_service.iteration];
      this._filter_service.content_input_address_backup = this._filter_service.content_input_address;
    }
    if(this._filter_service.filter_city_array[this._filter_service.iteration] == undefined){
      this._filter_service.content_input_city = '';
    } else if(this._filter_service.filter_city_array[this._filter_service.iteration] != undefined){
      this._filter_service.content_input_city = this._filter_service.filter_city_array[this._filter_service.iteration];
      this._filter_service.content_input_city_backup = this._filter_service.content_input_city;
    }
    if(this._filter_service.filter_state_array[this._filter_service.iteration] == undefined){
      this._filter_service.content_input_state = '';
    } else if(this._filter_service.filter_state_array[this._filter_service.iteration] != undefined){
      this._filter_service.content_input_state = this._filter_service.filter_state_array[this._filter_service.iteration];
      this._filter_service.content_input_state_backup = this._filter_service.content_input_state; 
    }
    if(this._filter_service.filter_country_array[this._filter_service.iteration] == undefined){
      this._filter_service.content_input_country = '';
    } else if(this._filter_service.filter_country_array[this._filter_service.iteration] != undefined){
      this._filter_service.content_input_country = this._filter_service.filter_country_array[this._filter_service.iteration];
      this._filter_service.content_input_country_backup = this._filter_service.content_input_country;
    }
    if(this._filter_service.filter_zip_array[this._filter_service.iteration] == undefined){
      this._filter_service.content_input_zip = '';
    } else if(this._filter_service.filter_zip_array[this._filter_service.iteration] != undefined){
      this._filter_service.content_input_zip = this._filter_service.filter_zip_array[this._filter_service.iteration];
      this._filter_service.content_input_zip_backup = this._filter_service.content_input_zip;
    }          
    
  }
  jQuery(".column-location").show();
  jQuery(".column-filters, .column-agency-name, .column-email, .column-phone, .column-tax, .column-bookings, .column-status").hide();
  //jQuery('.li-agency, .li-email, .li-phone, .li-tax, .li-location, .li-book, .li-status').removeClass('active-items');
  this.ready_for_close = false;
}

location_enter(e){ //Filter with key Enter
  if (e.which == 13) {
      this.save_location();
  }
}

///////////////////////
/// FILTER BOOKINGS ///
show_filter_bookings(){
  jQuery(".column-bookings").show();
  jQuery(".column-filters, .column-agency-name, .column-email, .column-phone, .column-tax, .column-location, .column-status").hide();
  //jQuery('.li-agency, .li-email, .li-phone, .li-tax, .li-location, .li-book, .li-status').removeClass('active-items');
  this.ready_for_close = false;

  if(this._filter_service.event_type == 'new'){
    this._filter_service.filter_book = '';
  }else if(this._filter_service.event_type == 'edit'){
    if(this._filter_service.filter_has_bookings_array[0] == true){
      this._filter_service.filter_book = 'has-book';
    }else if(this._filter_service.filter_has_bookings_array[0] == false){
      this._filter_service.filter_book = 'never-book';
    }
  }
}

/////////////////////
/// FILTER STATUS ///
show_filter_status(){
  jQuery(".column-status").show();
  jQuery(".column-filters, .column-agency-name, .column-email, .column-phone, .column-tax, .column-location, .column-bookings").hide();
  //jQuery('.li-agency, .li-email, .li-phone, .li-tax, .li-location, .li-book, .li-status').removeClass('active-items');
  this.ready_for_close = false;

  if(this._filter_service.event_type == 'new'){
    this._filter_service.filter_status = '';
  }else if(this._filter_service.event_type == 'edit'){
    if(this._filter_service.filter_status_array[0] == true){
      this._filter_service.filter_status = 'enabled';
    }else if(this._filter_service.filter_status_array[0] == false){
      this._filter_service.filter_status = 'disabled';
    }
  }
}

//////////////////////////////////////////////
/// SAVE, UPDATED AND DELETE FILTER AGENCY ///
save_agency(){
  if(this._filter_service.content_input_agency != ''){
    this._filter_service.filter_name_array.push(this._filter_service.content_input_agency);
    this._filter_service.content_input_agency_backup = this._filter_service.content_input_agency; //Check if backup have same Data   
    this.search('is_new_filtering'); //Call request search
  }
  this.ready_for_close = false;
  this.remove_modal_filters();
  this._filter_service.come_from_modal=true; //Filter come from modal
}

//Edit input Agency
update_input_agency(){
  if(this._filter_service.content_input_agency != '' && this._filter_service.content_input_agency != this._filter_service.content_input_agency_backup){
    this._filter_service.filter_name_array[this._filter_service.iteration] = this._filter_service.content_input_agency;
    this._filter_service.content_input_agency_backup = this._filter_service.content_input_agency;
    this.search('is_new_filtering'); //Call request search

    this.ready_for_close = false;
    for (var i=0; i<2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
    this._filter_service.come_from_modal=true; //Filter come from modal
  }
}

//Delete Pill Agency and delete search
delete_content_input_agency(){
  if(this._filter_service.content_input_agency != ''){ //Delete only if not empty
      this._filter_service.content_input_agency = ''; //Clean Input Agency
      this._filter_service.filter_name_array.splice(this._filter_service.iteration, 1);
      this.search('is_new_filtering'); //Call request with removed Pill filter
      this.ready_for_close = false;
    for (var i=0; i<2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
    this._filter_service.come_from_modal=true; //Filter come from modal
  }
}

//////////////////////////
/// SAVE FILTER E-MAIL ///
save_email(){
   if(this._filter_service.content_input_email != '') {
     this._filter_service.filter_email_array.push(this._filter_service.content_input_email);
     this._filter_service.content_input_email_backup = this._filter_service.content_input_email;
     this.search('is_new_filtering'); //Call request search
   } 
   this.ready_for_close = false;
   this.remove_modal_filters();
   this._filter_service.come_from_modal = true;  
} //Close method save_email

keyup_field_email(){
   //Filters validation for E-mail Field                 
   if(this._filter_service.content_input_email != '') {
     //this.validation_email_filter = false;
     //Show error message on input(id="label-email") HTML
   } else {
     //this.validation_email_filter = true; //Clean message
     jQuery('#label-email').removeClass('border-errors');
   }  
}

//Edit input E-mail
update_input_mail(){
  if(this._filter_service.content_input_email != '' && this._filter_service.content_input_email_backup != this._filter_service.content_input_email){
    this._filter_service.filter_email_array 
    this._filter_service.content_input_email_backup = this._filter_service.content_input_email;
    this.search('is_new_filtering'); //Call request search

    this.ready_for_close = false;
    for (var i=0; i < 2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
    this._filter_service.come_from_modal=true; //Filter come from modal
    }
}

//Delete Pill E-mail and delete search
delete_content_input_mail(){
  if(this._filter_service.content_input_email != ''){ //Delete only if not empty
    this._filter_service.content_input_email = ''; //Clean Input E-mail
    this._filter_service.filter_email_array.splice(this._filter_service.iteration, 1);
    this.search('is_new_filtering'); //Call request with removed Pill filter
    this.ready_for_close = false;
    for (var i=0; i < 2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
    this._filter_service.come_from_modal=true; //Filter come from modal
  }
}

////////////////////////////////
/// SAVE FILTER PHONE NUMBER ///
save_phone_number(){
  if(this._filter_service.content_input_phone != ''){
    this._filter_service.filter_phone_number_array.push(this._filter_service.content_input_phone);
    this._filter_service.content_input_phone_backup = this._filter_service.content_input_phone;
    this.search('is_new_filtering'); //Call request search
  }
  this.ready_for_close = false;
  this.remove_modal_filters();
  this._filter_service.come_from_modal=true;
}

//Edit input Phone Number
update_input_phone(){
  if(this._filter_service.content_input_phone != '' && this._filter_service.content_input_phone != this._filter_service.content_input_phone_backup){
    this._filter_service.filter_phone_number_array[this._filter_service.iteration] = this._filter_service.content_input_phone;
    this._filter_service.content_input_phone_backup = this._filter_service.content_input_phone;
    this.search('is_new_filtering'); //Call request search

    this.ready_for_close = false;
    for (var i=0; i < 2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
    this._filter_service.come_from_modal=true; //Filter come from modal
  }
}

//Delete Pill Phone Number and delete search
delete_content_input_phone(){
  if(this._filter_service.content_input_phone != ''){ //Delete only if not empty
    this._filter_service.content_input_phone = ''; //Clean Input Phone Number
    this._filter_service.filter_phone_number_array.splice(this._filter_service.iteration, 1);
    this.search('is_new_filtering'); //Call request with removed Pill filter
    this.ready_for_close = false;
    for (var i=0; i < 2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
      this._filter_service.come_from_modal=true; //Filter come from modal
    }
 }

//////////////////////////////
/// SAVE FILTER TAX NUMBER ///
save_tax(){
  if(this._filter_service.content_input_tax != ''){
    this._filter_service.filter_tax_number_array.push(this._filter_service.content_input_tax);
    this._filter_service.content_input_tax_backup = this._filter_service.content_input_tax;
    this.search('is_new_filtering'); //Call request search
  }
  this.ready_for_close = false;
  this.remove_modal_filters();
  this._filter_service.come_from_modal=true;
}

//Edit input Tax Number
update_input_tax(){
  if(this._filter_service.content_input_tax != '' && this._filter_service.content_input_tax != this._filter_service.content_input_tax_backup){
    this._filter_service.filter_tax_number_array[this._filter_service.iteration] = this._filter_service.content_input_tax;
    this.search('is_new_filtering'); //Call request search
    this._filter_service.content_input_tax_backup = this._filter_service.content_input_tax;

    this.ready_for_close = false;
    for (var i=0; i < 2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
    this._filter_service.come_from_modal=true; //Filter come from modal
  }
}

//Delete Pill Tax Number and delete search
delete_content_input_tax(){
  if(this._filter_service.content_input_tax != ''){ //Delete only if not empty
    this._filter_service.content_input_tax = ''; //Clean Input Tax Number
    this._filter_service.filter_tax_number_array.splice(this._filter_service.iteration, 1);
    this.search('is_new_filtering'); //Call request with removed Pill filter
    this.ready_for_close = false;
    for (var i=0; i < 2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
    this._filter_service.come_from_modal=true; //Filter come from modal
  } 
}

////////////////////////////
/// SAVE FILTER LOCATION ///
save_location(){
  if(this._filter_service.content_input_address != '' && this._filter_service.content_input_address != undefined){
    this._filter_service.filter_address_array.push(this._filter_service.content_input_address);
    this._filter_service.content_input_address_backup = this._filter_service.content_input_address;
    //this.search('is_new_filtering'); //Call request search
  }
  if(this._filter_service.content_input_address == '' || this._filter_service.content_input_address == undefined){
    //this._filter_service.filter_address_array.splice(this._filter_service.iteration, 1);
    this._filter_service.content_input_address = '';
  }

  if(this._filter_service.content_input_city != '' && this._filter_service.content_input_city != undefined){
    this._filter_service.filter_city_array.push(this._filter_service.content_input_city);
    this._filter_service.content_input_city_backup = this._filter_service.content_input_city;
    //this.search('is_new_filtering'); //Call request search
  }
  if(this._filter_service.content_input_city == '' || this._filter_service.content_input_city == undefined){
    //this._filter_service.filter_city_array.splice(this._filter_service.iteration, 1);
    this._filter_service.content_input_city = '';
  }

  if(this._filter_service.content_input_state != '' && this._filter_service.content_input_state != undefined){
    this._filter_service.filter_state_array.push(this._filter_service.content_input_state);
    this._filter_service.content_input_state_backup = this._filter_service.content_input_state;
    //this.search('is_new_filtering'); //Call request search
  }
  if(this._filter_service.content_input_state == '' || this._filter_service.content_input_state == undefined){
    //this._filter_service.filter_state_array.splice(this._filter_service.iteration, 1);
    this._filter_service.content_input_state = '';
  }

  if(this._filter_service.content_input_country != '' && this._filter_service.content_input_country != undefined){
    this._filter_service.filter_country_array.push(this._filter_service.content_input_country);
    this._filter_service.content_input_country_backup = this._filter_service.content_input_country;
    //this.search('is_new_filtering'); //Call request search
  }
  if(this._filter_service.content_input_country == '' || this._filter_service.content_input_country == undefined){
    //this._filter_service.filter_country_array.splice(this._filter_service.iteration, 1);
    this._filter_service.content_input_country = '';
  }

  if(this._filter_service.content_input_zip != '' && this._filter_service.content_input_zip != undefined){
    this._filter_service.filter_zip_array.push(this._filter_service.content_input_zip);
    this._filter_service.content_input_zip_backup = this._filter_service.content_input_zip;
    //this.search('is_new_filtering'); //Call request search
  }
  if(this._filter_service.content_input_zip == '' || this._filter_service.content_input_zip == undefined){
    //this._filter_service.filter_zip_array.splice(this._filter_service.iteration, 1);
    this._filter_service.content_input_zip = '';
  }
  this.ready_for_close = false;
  this.remove_modal_filters();
  this._filter_service.come_from_modal=true;
  this.search('is_new_filtering'); //Call request search
}

//Edit inputs Address, City, State, Country and Zip
update_inputs_location(){
  if(this._filter_service.content_input_address.length > 0 && this._filter_service.content_input_address_backup != this._filter_service.content_input_address || this._filter_service.content_input_city.length > 0 && this._filter_service.content_input_city_backup != this._filter_service.content_input_city || this._filter_service.content_input_state.length > 0 && this._filter_service.content_input_state_backup != this._filter_service.content_input_state || this._filter_service.content_input_country.length > 0 && this._filter_service.content_input_country_backup != this._filter_service.content_input_country || this._filter_service.content_input_zip.length > 0 && this._filter_service.content_input_zip_backup != this._filter_service.content_input_zip){
    
    if(this._filter_service.content_input_address != '' && this._filter_service.content_input_address != undefined && this._filter_service.content_input_address != this._filter_service.content_input_address_backup){
      this._filter_service.filter_address_array[this._filter_service.iteration] = this._filter_service.content_input_address;
      this._filter_service.content_input_address_backup = this._filter_service.content_input_address; //Check if backup have same Data  
    } 
    if(this._filter_service.content_input_address == '' || this._filter_service.content_input_address == undefined){
      this._filter_service.filter_address_array.splice(this._filter_service.iteration, 1);
      this._filter_service.content_input_address = '';
    }

    if(this._filter_service.content_input_city != '' && this._filter_service.content_input_city != undefined && this._filter_service.content_input_city != this._filter_service.content_input_city_backup){
      this._filter_service.filter_city_array[this._filter_service.iteration] = this._filter_service.content_input_city;
      this._filter_service.content_input_city_backup = this._filter_service.content_input_city; 
    } 
    if(this._filter_service.content_input_city == '' || this._filter_service.content_input_city == undefined){
      this._filter_service.filter_city_array.splice(this._filter_service.iteration, 1);
      this._filter_service.content_input_city = '';
    }

    if(this._filter_service.content_input_state != '' && this._filter_service.content_input_state != undefined && this._filter_service.content_input_state != this._filter_service.content_input_state_backup){
      this._filter_service.filter_state_array[this._filter_service.iteration] = this._filter_service.content_input_state;
      this._filter_service.content_input_state_backup = this._filter_service.content_input_state; 
    }
    if(this._filter_service.content_input_state == '' || this._filter_service.content_input_state == undefined){
      this._filter_service.filter_state_array.splice(this._filter_service.iteration, 1);
      this._filter_service.content_input_state = '';
    }

    if(this._filter_service.content_input_country != '' && this._filter_service.content_input_country != undefined && this._filter_service.content_input_country != this._filter_service.content_input_country_backup){
      this._filter_service.filter_country_array[this._filter_service.iteration] = this._filter_service.content_input_country;
      this._filter_service.content_input_country_backup = this._filter_service.content_input_country; 
    } 
    if(this._filter_service.content_input_country == '' || this._filter_service.content_input_country == undefined){
      this._filter_service.filter_country_array.splice(this._filter_service.iteration, 1);
      this._filter_service.content_input_country = '';
    }

    if(this._filter_service.content_input_zip != '' && this._filter_service.content_input_zip != undefined && this._filter_service.content_input_zip != this._filter_service.content_input_zip_backup){
      this._filter_service.filter_zip_array[this._filter_service.iteration] = this._filter_service.content_input_zip;
      this._filter_service.content_input_zip_backup = this._filter_service.content_input_zip;    
    } 
    if(this._filter_service.content_input_zip == '' || this._filter_service.content_input_zip == undefined){
      this._filter_service.filter_zip_array.splice(this._filter_service.iteration, 1);
      this._filter_service.content_input_zip = '';
    }

    this.ready_for_close = false;
    for (var i=0; i<2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
    this._filter_service.come_from_modal=true; //Filter come from modal
    this.search('is_new_filtering'); //Call request search
  }
}

//Delete Pill Location and delete search
delete_content_inputs_location(){
  if(this._filter_service.content_input_address != '' || this._filter_service.content_input_city != '' || this._filter_service.content_input_state != '' || this._filter_service.content_input_country != '' || this._filter_service.content_input_zip != ''){ //Delete only if not empty
    this._filter_service.content_input_address = ''; //Clean Input Address
    this._filter_service.filter_address_array.splice(this._filter_service.iteration, 1);

    this._filter_service.content_input_city = ''; //Clean Input City
    this._filter_service.filter_city_array.splice(this._filter_service.iteration, 1);

    this._filter_service.content_input_state = ''; //Clean Input State
    this._filter_service.filter_state_array.splice(this._filter_service.iteration, 1);

    this._filter_service.content_input_country = ''; //Clean Input Country
    this._filter_service.filter_country_array.splice(this._filter_service.iteration, 1);

    this._filter_service.content_input_zip = ''; //Clean Input Zip
    this._filter_service.filter_zip_array.splice(this._filter_service.iteration, 1);

    this.search('is_new_filtering'); //Call request with removed Pill filter
    this.ready_for_close = false;
    for (var i=0; i < 2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
    this._filter_service.come_from_modal=true; //Filter come from modal
  }
}

////////////////////////////
/// SAVE FILTER BOOKINGS ///
save_bookings(has_never){
  this._filter_service.filter_has_bookings_array[0] = has_never;
  this.search('is_new_filtering'); //Call request search
  this.ready_for_close = false;
  this.remove_modal_filters();
  this._filter_service.come_from_modal=true;
}

//////////////////////////
/// SAVE FILTER STATUS ///
save_status(status){
  this._filter_service.filter_status_array[0]=status;
  this.search('is_new_filtering'); //Call request search
  this.ready_for_close = false;
  this.remove_modal_filters();
  this._filter_service.come_from_modal=true;
}

/////////////////////////////////////////////////////////
/// Button 'close' for modal and return List Agencies ///
remove_modal_filters(){
  if(this._filter_service.filter_name_array.length>0){ 
    jQuery('.li-agency').addClass('active-items');
  }
  if(this._filter_service.filter_email_array.length>0){
    jQuery('.li-email').addClass('active-items');
  }
  if(this._filter_service.filter_phone_number_array.length>0){
    jQuery('.li-phone').addClass('active-items');
  }
  if(this._filter_service.filter_tax_number_array.length>0){
    jQuery('.li-tax').addClass('active-items');
  }
  if(this._filter_service.filter_address_array.length>0 || this._filter_service.filter_city_array.length>0 || this._filter_service.filter_state_array.length>0 || this._filter_service.filter_country_array.length>0 || this._filter_service.filter_zip_array.length>0){
    jQuery('.li-location').addClass('active-items');
  }
  if(this._filter_service.filter_has_bookings_array.length>0){
    jQuery('.li-book').addClass('active-items');
  }
  if(this._filter_service.filter_status_array.length>0){
    jQuery('.li-status').addClass('active-items');
  }

  if(this.ready_for_close == true){
    jQuery("modal-backdrop").remove();
    jQuery("body").removeClass('modal-open');
  } else {
    jQuery(".column-filters").show();
    jQuery(".column-agency-name, .column-email, .column-phone, .column-tax, .column-location, .column-bookings, .column-status").hide();
    this.ready_for_close = true;
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////
/// Button 'close' for modal and return List Agencies(Close when click out side of Modal) ///
close_modal_filters(){
  this.remove_modal_filters();
}

} //Close class ModalFilters
