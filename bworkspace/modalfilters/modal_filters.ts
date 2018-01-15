import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, OnInit , OnDestroy } from '@angular/core';
import {Widget} from '../../core/widget/widget';
import {RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import { Idle, DEFAULT_INTERRUPTSOURCES } from 'ng2-idle/core'; //For timeout
import { DialogRef } from 'angular2-modal';
import {Observable} from 'rxjs/Observable';
import {CustomHttp} from '../../services/http-wrapper';
//import {NKDatetime} from 'ng2-datetime/ng2-datetime'; //Datepicker
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NgClass} from '@angular/common';
import { Modal, BS_MODAL_PROVIDERS as MODAL_P } from 'angular2-modal/plugins/bootstrap'; //Modal
import {Core} from '../../core/core';
import { Location } from '@angular/common';
import myGlobals = require('../../../app');
import {BookingDetail} from '../bookingdetail/bookingdetail';
import {FileDetail} from '../filedetail/filedetail';
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';
import {ModalFiltersService} from '../../bworkspace/modalfilters/modalfilters.service'; //Service
import {filter} from '../../bworkspace/filter'; //Service

declare var jQuery: any;
declare var $: any;

/////////////////
///Modal cancel//
@Component({
  selector: 'modal_filters',
  template: require('./modal_filters.html'),
  //encapsulation: ViewEncapsulation.None,
  styles: [require('./modal_filters.scss')],
  directives: [ROUTER_DIRECTIVES, [Widget]]
})

export class ModalFilters {

ready_for_close = true; //Close modal and return Bworkspace
pepe='';
test;

constructor(
  public http: Http, 
  public params: RouteParams, 
  public router: Router,
  public modal: Modal, 
  public load: LoadingGif, 
  viewContainer: ViewContainerRef,
  public _filter_service: ModalFiltersService, 
  public _filter: filter
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
 
  ////////////////////////////////////////////
  /// DATEPICKERS CREATED DATE FROM AND TO ///  
  // var _this = this;
  var locale = "en-us";
  $("#date_created_from2").datepicker({autoclose: true, format: "dd-M-yyyy", endDate: new Date()}).on('changeDate', (e)=>{  
    this._filter_service.content_input_created_from = e.format(); 
    if(this._filter_service.content_input_created_to != ''){ //If different from empty
      var from = new Date(this._filter_service.content_input_created_from);
      var to = new Date( this._filter_service.content_input_created_to);  
      if(from > to){ //If Date from is bigger than Date To        
        from.setDate(from.getDate() + 7); //Add seven Days to Date Create To     
        var month = from.toLocaleString(locale, { month: "short" }); //Get Short name of Month      
       this._filter_service.content_input_created_to = from.getDate()+'-'+ month +'-'+ from.getFullYear();
      }
    }
      
  }); //Close first function
  
  $("#date_created_to2").datepicker({autoclose: true, format: "dd-M-yyyy", endDate: new Date()}).on('changeDate', (e)=>{ 
    this._filter_service.content_input_created_to = e.format(); 

    if(this._filter_service.content_input_created_from != ''){ //If different from empty
      var from = new Date(this._filter_service.content_input_created_from);
      var to = new Date( this._filter_service.content_input_created_to);  
      if(from > to){ //If Date from is bigger than Date To        
        to.setDate(to.getDate() - 7); //Add seven Days to Date Create To     
        var month = to.toLocaleString(locale, { month: "short" }); //Get Short name of Month      
       this._filter_service.content_input_created_from = to.getDate()+'-'+ month +'-'+ to.getFullYear();
      }
    }

    $('#date_created_from2').datepicker('destroy');
    setTimeout(()=>{
      $('#date_created_from2').datepicker({autoclose: true, format: "dd-M-yyyy", endDate:  this._filter_service.content_input_created_to}); 
    } , 200);
  }); 

  /////////////////////////////////////////////
  /// DATEPICKERS SERVICE DATES FROM AND TO ///  
  $("#date_travel_from2").datepicker({autoclose: true, format: "dd-M-yyyy"}).on('changeDate', (e)=>{  
    this._filter_service.content_input_service_from = e.format(); 
    if(this._filter_service.content_input_service_to != ''){ //If different from empty
      var from = new Date(this._filter_service.content_input_service_from);
      var to = new Date( this._filter_service.content_input_service_to);  
      if(from > to){ //If Date from is bigger than Date To        
        from.setDate(from.getDate() + 7); //Add seven Days to Date Create To     
        var month = from.toLocaleString(locale, { month: "short" }); //Get Short name of Month        
       this._filter_service.content_input_service_to = from.getDate()+'-'+ month +'-'+ from.getFullYear();
      }
    }
     $('#date_travel_to2').datepicker('destroy');
    setTimeout(()=>{
       $('#date_travel_to2').datepicker({autoclose: true, format: "dd-M-yyyy", startDate: this._filter_service.content_input_service_from});      
    } , 200);
  }); //Close first function

  $("#date_travel_to2").datepicker({autoclose: true, format: "dd-M-yyyy"}).on('changeDate', (e)=>{  
    this._filter_service.content_input_service_to = e.format();    
  });
  
   // jQuery('#date_travel_to2').focusout(()=>{
   //     myGlobals.alertTravtion(this._filter_service.content_input_service_to );
   // })
  ////////////////////////////////////////////////////////
  /// Recover selected Pills after close Modal Filters ///
  if(this._filter_service.filter_created_from_array.length>0){
    jQuery('.li-created-date').addClass('active-items');
  }
  if(this._filter_service.filter_created_to_array.length>0){
    jQuery('.li-created-date').addClass('active-items');
  }
  if(this._filter_service.filter_service_from_array.length>0){
    jQuery('.li-service-date').addClass('active-items');
  }
  if(this._filter_service.filter_service_to_array.length>0){
    jQuery('.li-service-date').addClass('active-items');
  }
  if(this._filter_service.filter_pax_array.length>0){
    jQuery('.li-pax').addClass('active-items');
  }
  if(this._filter_service.filter_loc_array.length>0){
    jQuery('.li-loc').addClass('active-items');
  }
  if(this._filter_service.filter_auto_cancel_array.length>0){
    jQuery('.li-cancel').addClass('active-items');
  }
  if(this._filter_service.filter_status_array.length>0){
    jQuery('.li-status').addClass('active-items');
  }
  if(this._filter_service.filter_service_array.length>0){
    jQuery('.li-service').addClass('active-items');
  }
  if(this._filter_service.filter_provider_array.length>0){
    jQuery('.li-provider').addClass('active-items');
  }
  if(this._filter_service.filter_agency_array.length>0){
    jQuery('.li-agency').addClass('active-items');
  }
  if(this._filter_service.filter_destination_array.length>0){
    jQuery('.li-destination').addClass('active-items');
  }

  ////////////////////////////////////////
  /// Edit Pills after open every Pill ///
  if(this._filter_service.event_type == 'edit'){ //Check if edit or new pill
    if(this._filter_service.edit_filter == 'created-from'){ //Verify wich pill 
      this.show_filter_created_date();
    }
    if(this._filter_service.edit_filter == 'created-to'){ //Verify wich pill 
      this.show_filter_created_date();
    }
    if(this._filter_service.edit_filter == 'service-from'){ //Verify wich pill 
      this.show_filter_service_date();
    }
    if(this._filter_service.edit_filter == 'service-to'){ //Verify wich pill 
      this.show_filter_service_date();
    }
    if(this._filter_service.edit_filter == 'pax'){ //Verify wich pill 
      this.show_filter_pax();
    }
    if(this._filter_service.edit_filter == 'loc'){ //Verify wich pill 
      this.show_filter_loc();
    }
    if(this._filter_service.edit_filter == 'auto_cancel'){ //Verify wich pill 
      this.show_filter_auto_cancel();
    }
    if(this._filter_service.edit_filter == 'status'){ //Verify wich pill 
      this.show_filter_status();
    }
    if(this._filter_service.edit_filter == 'service'){ //Verify wich pill 
      this.show_filter_service();
    }
    if(this._filter_service.edit_filter == 'provider'){ //Verify wich pill 
      this.show_filter_provider();
    }
    if(this._filter_service.edit_filter == 'agency'){ //Verify wich pill 
      this.show_filter_agency();
    }
    if(this._filter_service.edit_filter == 'destination'){ //Verify wich pill 
      this.show_filter_destination();
    }
  }
} //Close ngOnInit

refreshModalFilters() {
  this._filter_service.clearModalFilters();
  this._filter.clearFilter();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
/// Button 'search' for modal filters and return List Agencies(Close when click out side of Modal) ///
search(filtering_state){
  // this.load.show_loading_gif_bw(); //Show loading gif
  //Store array from service(modalfilters.service.ts) in array model(filters.ts)
  this._filter.date_created_from = this._filter_service.filter_created_from_array;
  this._filter.date_created_to = this._filter_service.filter_created_to_array;
  this._filter.date_travel_from = this._filter_service.filter_service_from_array;
  this._filter.date_travel_to = this._filter_service.filter_service_to_array;
  this._filter.passenger_name = this._filter_service.filter_pax_array;
  this._filter.reservation_code_locator = this._filter_service.filter_loc_array;
  this._filter.will_auto_cancel = this._filter_service.filter_auto_cancel_array;
  this._filter.status = this._filter_service.filter_status_array;
  this._filter.service_type = this._filter_service.filter_service_array;
  this._filter.provider = this._filter_service.filter_provider_array;
  this._filter.agency_user = this._filter_service.filter_agency_array;
  this._filter.destination = this._filter_service.filter_destination_array;

  //Control variable
  //this.fromRefresh = false;

  var selected_page;
  if(filtering_state == 'is_new_filtering'){
    selected_page = 1;
  }else if(filtering_state == 'no_filtering'){
    selected_page = this._filter.number_of_page;
  }
  console.log("List bookings: " + this._filter.passenger_name);
  /*setTimeout(()=>{
    this._service.get_list_agencies( {page: selected_page})
    .map(data => {
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
  } , 500)*/
} // Close method search


/////////////////////////////
/// Events modal Filters ////
///////////////////////////////////////
/// FILTER CREATED DATE FROM AND TO ///
show_filter_created_date(){
  if(this._filter_service.event_type == 'new'){
    this._filter_service.content_input_created_from = '';
    this._filter_service.content_input_created_to = '';
    jQuery('#date_created_from2').val(''); //Clean input Created From, I(Fernanda) don't empty NgModel because is useful for edit function 
    jQuery('#date_created_to2').val(''); //Clean input Created To
  } else if(this._filter_service.event_type == 'edit'){
    this._filter_service.content_input_created_from = this._filter_service.filter_created_from_array[this._filter_service.iteration]; //Recover Data from Pill
    this._filter_service.content_input_created_from_backup = this._filter_service.content_input_created_from; //Recover Pill form URL and store in Backup
    
    this._filter_service.content_input_created_to = this._filter_service.filter_created_to_array[this._filter_service.iteration]; //Recover Data from Pill
    this._filter_service.content_input_created_to_backup = this._filter_service.content_input_created_to; //Recover Pill form URL and store in Backup
  }

  jQuery(".column-created-date").show();
  jQuery(".column-filters, .column-locator, .column-auto-cancel, .column-status, .column-service, .column-agency, .column-destination, .column-service-date").hide();
  this.ready_for_close = false; 
}

/*pax_enter(e){ //Filter with key Enter
  if (e.which == 13) {
      this.save_pax();
  }
}*/

////////////////////////////////////////
/// FILTER SERVICE DATES FROM AND TO ///
show_filter_service_date(){
  if(this._filter_service.event_type == 'new'){
    this._filter_service.content_input_service_from = '';
    this._filter_service.content_input_service_to = '';
    jQuery('#date_travel_from2').val(''); //Clean input Service From
    jQuery('#date_travel_to2').val(''); //Clean input Service To
  } else if(this._filter_service.event_type == 'edit'){
    this._filter_service.content_input_service_from = this._filter_service.filter_service_from_array[this._filter_service.iteration]; //Recover Data from Pill
    this._filter_service.content_input_service_from_backup = this._filter_service.content_input_service_from; //Recover Pill form URL and store in Backup
    
    this._filter_service.content_input_service_to = this._filter_service.filter_service_to_array[this._filter_service.iteration]; //Recover Data from Pill
    this._filter_service.content_input_service_to_backup = this._filter_service.content_input_service_to; //Recover Pill form URL and store in Backup
  }

  jQuery(".column-service-date").show();
  jQuery(".column-filters, .column-locator, .column-auto-cancel, .column-status, .column-service, .column-agency, .column-destination, .column-created-date").hide();
  this.ready_for_close = false; 
}

/*pax_enter(e){ //Filter with key Enter
  if (e.which == 13) {
      this.save_pax();
  }
}*/


/////////////////////////////
/// FILTER PASSENGER NAME ///
show_filter_pax(){
  if(this._filter_service.event_type == 'new'){
    this._filter_service.content_input_pax = '';
    jQuery('#inputPax').val(''); //Clean input Passenger, I(Fernanda) don't empty NgModel because is useful for edit function 
  } else if(this._filter_service.event_type == 'edit'){
    this._filter_service.content_input_pax = this._filter_service.filter_pax_array[this._filter_service.iteration]; //Recover Data from Pill
    this._filter_service.content_input_pax_backup = this._filter_service.content_input_pax; //Recover Pill form URL and store in Backup
  }
  jQuery(".column-passenger").show();
  jQuery(".column-filters, .column-locator, .column-auto-cancel, .column-status, .column-service, .column-agency, .column-destination, .column-created-date, .column-service-date").hide();
  this.ready_for_close = false; 
}

pax_enter(e){ //Filter with key Enter
  if (e.which == 13) {
      this.save_pax();
  }
}

//////////////////////
/// FILTER LOCATOR ///
show_filter_loc(){
  if(this._filter_service.event_type == 'new'){
    this._filter_service.content_input_loc = ''; //Clean input Confirmation Number or Record Locator
    jQuery('#inputLoc').val(''); //Clean input Confirmation Number or Record Locator
  } else if(this._filter_service.event_type == 'edit'){
    this._filter_service.content_input_loc = this._filter_service.filter_loc_array[this._filter_service.iteration]; //Recover Data from Pill
    this._filter_service.content_input_loc_backup = this._filter_service.content_input_loc; //Recover Pill form URL and store in Backup
  }
  jQuery(".column-locator").show();
  jQuery(".column-filters, .column-passenger, .column-auto-cancel, .column-status, .column-service, .column-provider, .column-agency, .column-destination, .column-created-date, .column-service-date").hide();
  this.ready_for_close = false; 
}

loc_enter(e){ //Filter with key Enter
  if (e.which == 13) {
      this.save_loc();
  }
}

//////////////////////////
/// FILTER AUTO CANCEL ///
show_filter_auto_cancel(){
  jQuery(".column-auto-cancel").show();
  jQuery(".column-filters, .column-passenger, .column-locator, .column-status, .column-service, .column-provider, .column-agency, .column-destination").hide();
  this.ready_for_close = false; 

  if(this._filter_service.event_type == 'new'){
    this._filter_service.filter_cancel = '';
  }else if(this._filter_service.event_type == 'edit'){
    this._filter_service.filter_cancel = this._filter_service.filter_auto_cancel_array[0];
  }
}

/////////////////////
/// FILTER STATUS ///
show_filter_status(){
  jQuery(".column-status").show();
  jQuery(".column-filters, .column-passenger, .column-locator, .column-auto-cancel, .column-service, .column-provider, .column-agency, .column-destination, .column-created-date, .column-service-date").hide();
  this.ready_for_close = false; 

  if(this._filter_service.event_type == 'new'){
    this._filter_service.filter_status = [];
  } 
  else if(this._filter_service.event_type == 'edit'){  
    for(var x=0; x<this._filter_service.filter_status_array.length; x++){
      this._filter_service.filter_status[x] = this._filter_service.filter_status_array[x];
    }
  }
}

///////////////////////////
/// FILTER SERVICE TYPE ///
show_filter_service(){
  jQuery(".column-service").show();
  jQuery(".column-filters, .column-passenger, .column-locator, .column-auto-cancel, .column-status, .column-provider, .column-agency, .column-destination, .column-created-date, .column-service-date").hide();
  this.ready_for_close = false;

  if(this._filter_service.event_type == 'new'){
    this._filter_service.filter_service = [];
  } 
  else if(this._filter_service.event_type == 'edit'){  
    for(var x=0; x<this._filter_service.filter_service_array.length; x++){
      this._filter_service.filter_service[x] = this._filter_service.filter_service_array[x];
    }
  } 
}

///////////////////////
/// FILTER PROVIDER ///
show_filter_provider(){
  jQuery(".column-provider").show();
  jQuery(".column-filters, .column-passenger, .column-locator, .column-auto-cancel, .column-status, .column-service, .column-agency, .column-destination, .column-created-date, .column-service-date").hide();
  this.ready_for_close = false; 

  if(this._filter_service.event_type == 'new'){
    this._filter_service.filter_provider = [];
  } 
  else if(this._filter_service.event_type == 'edit'){  
    for(var x=0; x<this._filter_service.filter_provider_array.length; x++){
      this._filter_service.filter_provider[x] = this._filter_service.filter_provider_array[x];
    }
  } 
}

/////////////////////////////
/// FILTER AGENCY OR USER ///
show_filter_agency(){
  if(this._filter_service.event_type == 'new'){
    this._filter_service.content_input_agency = ''; 
    jQuery('#inputAgency').val(''); //Clean input Agency/User
  } else if(this._filter_service.event_type == 'edit'){
    this._filter_service.content_input_agency = this._filter_service.filter_agency_array[this._filter_service.iteration]; //Recover Data from Pill
    this._filter_service.content_input_agency_backup = this._filter_service.content_input_agency;
  }
  jQuery(".column-agency").show();
  jQuery(".column-filters, .column-passenger, .column-locator, .column-auto-cancel, .column-status, .column-service, .column-provider, .column-destination, .column-created-date, .column-service-date").hide();
  this.ready_for_close = false; 
}

agency_enter(e){ //Filter with key Enter
  if (e.which == 13) {
      this.save_agency();
  }
}

//////////////////////////
/// FILTER DESTINATION ///
show_filter_destination(){
  if(this._filter_service.event_type == 'new'){
    this._filter_service.content_input_destination = ''; 
    jQuery('#inputDestination').val(''); //Clean input Destination
  } else if(this._filter_service.event_type == 'edit'){
    this._filter_service.content_input_destination = this._filter_service.filter_destination_array[this._filter_service.iteration]; //Recover Data from Pill
    this._filter_service.content_input_destination_backup = this._filter_service.content_input_destination;
  }
  jQuery(".column-destination").show();
  jQuery(".column-filters, .column-passenger, .column-locator, .column-auto-cancel, .column-status, .column-service, .column-provider, .column-agency, .column-created-date, .column-service-date").hide();
  this.ready_for_close = false; 
}

destination_enter(e){ //Filter with key Enter
  if (e.which == 13) {
      this.save_destination();
  }
}

////////////////////////////////////////////
/// SAVE FILTER CREATED DATE FROM AND TO ///
save_created_date(){
  //CREATED FROM
  this._filter_service.content_input_created_from = $('#date_created_from2').val();
  if(this._filter_service.content_input_created_from != '' && this._filter_service.content_input_created_from != undefined){
    this._filter_service.filter_created_from_array[0] = this._filter_service.content_input_created_from;
  } 

  //CREATED TO
  this._filter_service.content_input_created_to = $('#date_created_to2').val();
  if(this._filter_service.content_input_created_to != '' && this._filter_service.content_input_created_to != undefined){
    this._filter_service.filter_created_to_array[0] = this._filter_service.content_input_created_to;
  } 

  this.ready_for_close = false;
  this.remove_modal_filters();
  this._filter_service.come_from_modal = true; //Filter come from modal 
}

//Edit input Created From and To
update_input_created_from_to(){
  if(this._filter_service.content_input_created_from != '' && this._filter_service.content_input_created_from != this._filter_service.content_input_created_from_backup || this._filter_service.content_input_created_to != '' && this._filter_service.content_input_created_to != this._filter_service.content_input_created_to_backup){
    
      if(this._filter_service.content_input_created_from != '' && this._filter_service.content_input_created_from != undefined && this._filter_service.content_input_created_from != this._filter_service.content_input_created_from_backup){
        //Created From
        this._filter_service.filter_created_from_array[this._filter_service.iteration] = this._filter_service.content_input_created_from;
        this._filter_service.content_input_created_from_backup = this._filter_service.content_input_created_from;
      }

      if(this._filter_service.content_input_created_to != '' && this._filter_service.content_input_created_to != undefined && this._filter_service.content_input_created_to != this._filter_service.content_input_created_to_backup){
        //Created To
        this._filter_service.filter_created_to_array[this._filter_service.iteration] = this._filter_service.content_input_created_to;
        this._filter_service.content_input_created_to_backup = this._filter_service.content_input_created_to;
      }

      this.ready_for_close = false;
      for (var i=0; i<2; i++){ //At second time close modal filters
        this.remove_modal_filters();
      }
      this._filter_service.come_from_modal = true; //Filter come from modal
      this._filter_service.notifyOther('notifing...'); //Call request search
  }
}

//Delete Pill Created From and delete search
delete_content_input_created_from_to(){
  if(this._filter_service.content_input_created_from != '' || this._filter_service.content_input_created_to != ''){ //Delete only if not empty
      this._filter_service.content_input_created_from = ''; //Clean Input Created From
      this._filter_service.filter_created_from_array.splice(this._filter_service.iteration, 1);

      this._filter_service.content_input_created_to = ''; //Clean Input Created To
      this._filter_service.filter_created_to_array.splice(this._filter_service.iteration, 1); 

      this._filter_service.notifyOther('notifing...'); //Call request with removed Pill filter
      this.ready_for_close = false;

    for (var i=0; i<2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
    this._filter_service.come_from_modal = true; //Filter come from modal
  }
}

/////////////////////////////////////////////
/// SAVE FILTER SERVICE DATES FROM AND TO ///
save_service_date(){
  //SERVICE FROM
  this._filter_service.content_input_service_from = $('#date_travel_from2').val();
  if(this._filter_service.content_input_service_from != '' && this._filter_service.content_input_service_from != undefined){
    this._filter_service.filter_service_from_array[0] = this._filter_service.content_input_service_from;
  } 

  //SERVICE TO
  this._filter_service.content_input_service_to = $('#date_travel_to2').val();
  if(this._filter_service.content_input_service_to != '' && this._filter_service.content_input_service_to != undefined){
    this._filter_service.filter_service_to_array[0] = this._filter_service.content_input_service_to;
  } 

  this.ready_for_close = false;
  this.remove_modal_filters();
  this._filter_service.come_from_modal = true; //Filter come from modal 
}

//Edit input Service From and To
update_input_service_from_to(){
  if(this._filter_service.content_input_service_from != '' && this._filter_service.content_input_service_from != this._filter_service.content_input_service_from_backup || this._filter_service.content_input_service_to != '' && this._filter_service.content_input_service_to != this._filter_service.content_input_service_to_backup){
    
      if(this._filter_service.content_input_service_from != '' && this._filter_service.content_input_service_from != undefined){
        //Service From
        this._filter_service.filter_service_from_array[this._filter_service.iteration] = this._filter_service.content_input_service_from;
        this._filter_service.content_input_service_from_backup = this._filter_service.content_input_service_from;
      }

      if(this._filter_service.content_input_service_to != '' && this._filter_service.content_input_service_to != undefined){
        //Service To
        this._filter_service.filter_service_to_array[this._filter_service.iteration] = this._filter_service.content_input_service_to;
        this._filter_service.content_input_service_to_backup = this._filter_service.content_input_service_to;
      }

      this._filter_service.notifyOther('notifing...'); //Call request search
      this.ready_for_close = false;

      for (var i=0; i<2; i++){ //At second time close modal filters
        this.remove_modal_filters();
      }
      this._filter_service.come_from_modal = true; //Filter come from modal
  }
}

//Delete Pill Service From and delete search
delete_content_input_service_from_to(){
  if(this._filter_service.content_input_service_from != '' || this._filter_service.content_input_service_to != ''){ //Delete only if not empty
      this._filter_service.content_input_service_from = ''; //Clean Input Service From
      this._filter_service.filter_service_from_array.splice(this._filter_service.iteration, 1);

      this._filter_service.content_input_service_to = ''; //Clean Input Service To
      this._filter_service.filter_service_to_array.splice(this._filter_service.iteration, 1); 

      this._filter_service.notifyOther('notifing...'); //Call request with removed Pill filter
      this.ready_for_close = false;

    for (var i=0; i<2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
    this._filter_service.come_from_modal = true; //Filter come from modal
  }
}

///////////////////////
/// SAVE FILTER PAX ///
save_pax(){
  if(this._filter_service.content_input_pax != ''){
    this._filter_service.filter_pax_array.push(this._filter_service.content_input_pax);
  } 
  this.ready_for_close = false;
  this.remove_modal_filters();
  this._filter_service.come_from_modal = true; //Filter come from modal 
  //this._filter_service.notifyOther('notifing...'); //Call request search
}

//Edit input Passsenger Name
update_input_pax(){
  if(this._filter_service.content_input_pax != '' && this._filter_service.content_input_pax != this._filter_service.content_input_pax_backup){
    this._filter_service.filter_pax_array[this._filter_service.iteration] = this._filter_service.content_input_pax;
    this._filter_service.content_input_pax_backup = this._filter_service.content_input_pax;
    this._filter_service.notifyOther('notifing...'); //Call request search
    this.ready_for_close = false;

    for (var i=0; i<2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
    this._filter_service.come_from_modal = true; //Filter come from modal
  }
}

//Delete Pill Passsenger Name and delete search
delete_content_input_pax(){
  if(this._filter_service.content_input_pax != ''){ //Delete only if not empty
      this._filter_service.content_input_pax = ''; //Clean Input Passsenger Name
      this._filter_service.filter_pax_array.splice(this._filter_service.iteration, 1); 
      this._filter_service.notifyOther('notifing...'); //Call request with removed Pill filter
      this.ready_for_close = false;

    for (var i=0; i<2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
    this._filter_service.come_from_modal=true; //Filter come from modal
  }
}

///////////////////////////
/// SAVE FILTER LOCATOR ///
save_loc(){
  if(this._filter_service.content_input_loc != ''){
    this._filter_service.filter_loc_array.push(this._filter_service.content_input_loc); 
  }
  this.ready_for_close = false;
  this.remove_modal_filters();
  this._filter_service.come_from_modal=true; 
  //this._filter_service.notifyOther('notifing...'); //Call request search
}

//Edit input Confirmation Number or Record Locator
update_input_loc(){
  if(this._filter_service.content_input_loc != '' && this._filter_service.content_input_loc != this._filter_service.content_input_loc_backup){
    this._filter_service.filter_loc_array[this._filter_service.iteration] = this._filter_service.content_input_loc;
    this._filter_service.content_input_loc_backup = this._filter_service.content_input_loc;
    this._filter_service.notifyOther('notifing...'); //Call request search
    this.ready_for_close = false;

    for (var i=0; i<2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
    this._filter_service.come_from_modal=true; //Filter come from modal
  }
}

//Delete Pill Confirmation Number or Record Locator and delete search
delete_content_input_loc(){
  if(this._filter_service.content_input_loc != ''){ //Delete only if not empty
      this._filter_service.content_input_loc = ''; //Clean Input Confirmation Number or Record Locator
      this._filter_service.filter_loc_array.splice(this._filter_service.iteration, 1);
      this._filter_service.notifyOther('notifing...'); //Call request with removed Pill filter
      this.ready_for_close = false;

    for (var i=0; i<2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
    this._filter_service.come_from_modal=true; //Filter come from modal
  }
}

///////////////////////////////
/// SAVE FILTER AUTO CANCEL ///
save_auto_cancel(yes_no){
  this._filter_service.filter_auto_cancel_array[0] = yes_no; //YES OR NOT
  this.ready_for_close = false;
  this.remove_modal_filters();
  this._filter_service.come_from_modal = true; 
  //this._filter_service.notifyOther('notifing...'); //Call search request
}

//////////////////////////
/// SAVE FILTER STATUS ///
save_status(status, i){
  this._filter_service.filter_status_array[i] = status; //List of status 
  this.ready_for_close = false;
  this.remove_modal_filters();
  this._filter_service.come_from_modal = true; 
  //this._filter_service.notifyOther('notifing...'); //Call request search
}

////////////////////////////////
/// SAVE FILTER SERVICE TYPE ///
save_service_type(service_type, i){
  this._filter_service.filter_service_array[i] = service_type; //List of Service Type 
  this.ready_for_close = false;
  this.remove_modal_filters();
  this._filter_service.come_from_modal=true; 
  //this._filter_service.notifyOther('notifing...'); //Call request search
}

////////////////////////////////////
/// SAVE FILTER PROVIDER OR USER ///
save_provider(provider, i){
  this._filter_service.filter_provider_array[i] = provider; //List of Providers
  this.ready_for_close = false;
  this.remove_modal_filters();
  this._filter_service.come_from_modal=true; 
  //this._filter_service.notifyOther('notifing...'); //Call request search
}

//////////////////////////////////
/// SAVE FILTER AGENCY OR USER ///
save_agency(){
  if(this._filter_service.content_input_agency != ''){
    this._filter_service.filter_agency_array.push(this._filter_service.content_input_agency); 
  }
  this.ready_for_close = false;
  this.remove_modal_filters();
  this._filter_service.come_from_modal=true; 
  //this._filter_service.notifyOther('notifing...'); //Call request search
}

//Edit input Agency or User
update_input_agency(){
  if(this._filter_service.content_input_agency != '' && this._filter_service.content_input_agency != this._filter_service.content_input_agency_backup){
    this._filter_service.filter_agency_array[this._filter_service.iteration] = this._filter_service.content_input_agency;
    this._filter_service.content_input_agency_backup = this._filter_service.content_input_agency;
    this._filter_service.notifyOther('notifing...'); //Call request search
    this.ready_for_close = false;

    for (var i=0; i<2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
    this._filter_service.come_from_modal=true; //Filter come from modal
  }
}

//Delete Pill Agency or User and delete search
delete_content_input_agency(){
  if(this._filter_service.content_input_agency != ''){ //Delete only if not empty
      this._filter_service.content_input_agency = ''; //Clean Input Agency or User
      this._filter_service.filter_agency_array.splice(this._filter_service.iteration, 1);
      this._filter_service.notifyOther('notifing...'); //Call request with removed Pill filter
      this.ready_for_close = false;

    for (var i=0; i<2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
    this._filter_service.come_from_modal=true; //Filter come from modal
  }
}

///////////////////////////////
/// SAVE FILTER DESTINATION ///
save_destination(){
  if(this._filter_service.content_input_destination != ''){
    this._filter_service.filter_destination_array.push(this._filter_service.content_input_destination); 
  }
  this.ready_for_close = false;
  this.remove_modal_filters();
  this._filter_service.come_from_modal=true; 
  //this._filter_service.notifyOther('notifing...'); //Call request search
}

//Edit input Destination
update_input_destination(){
  if(this._filter_service.content_input_destination != '' && this._filter_service.content_input_destination != this._filter_service.content_input_destination_backup){
    this._filter_service.filter_destination_array[this._filter_service.iteration] = this._filter_service.content_input_destination;
    this._filter_service.content_input_destination_backup = this._filter_service.content_input_destination;
    this._filter_service.notifyOther('notifing...'); //Call request search
    this.ready_for_close = false;

    for (var i=0; i<2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
    this._filter_service.come_from_modal=true; //Filter come from modal
  }
}

//Delete Pill Destination and delete search
delete_content_input_destination(){
  if(this._filter_service.content_input_destination != ''){ //Delete only if not empty
      this._filter_service.content_input_destination = ''; //Clean Input Destination
      this._filter_service.filter_destination_array.splice(this._filter_service.iteration, 1);
      this._filter_service.notifyOther('notifing...'); //Call request with removed Pill filter
      this.ready_for_close = false;

    for (var i=0; i<2; i++){ //At second time close modal filters
      this.remove_modal_filters();
    }
    this._filter_service.come_from_modal = true; //Filter come from modal
  }
}

////////////////////////////////
/// SEARCH BOOKINGS OR FILES ///
search_book_or_files(type){
  this._filter.filter_by_bookings_or_files = type;
  this.ready_for_close = false;
  this.remove_modal_filters(); //Close and Return Items Filters
  this._filter_service.come_from_modal = true; //Filter come from modal 

  //Store from array modal to filter modal
  this._filter.date_created_from = this._filter_service.filter_created_from_array;
  this._filter.date_created_to = this._filter_service.filter_created_to_array;
  this._filter.date_travel_from = this._filter_service.filter_service_from_array;
  this._filter.date_travel_to = this._filter_service.filter_service_to_array;

  this._filter_service.notifyOther('notifing...'); //Call request search
  this.remove_modal_filters(); //Close and Return Booking Worspace
}

//////////////////////////////////////////////////////
/// Button 'close' for modal and return Bworkspace ///
remove_modal_filters(){
  if(this._filter_service.filter_created_from_array.length>0){ 
    jQuery('.li-created-date').addClass('active-items');
  }
  if(this._filter_service.filter_created_to_array.length>0){ 
    jQuery('.li-created-date').addClass('active-items');
  }
  if(this._filter_service.filter_service_from_array.length>0){ 
    jQuery('.li-service-date').addClass('active-items');
  }
  if(this._filter_service.filter_service_to_array.length>0){ 
    jQuery('.li-service-date').addClass('active-items');
  }
  if(this._filter_service.filter_pax_array.length>0){ 
    jQuery('.li-pax').addClass('active-items');
  }
  if(this._filter_service.filter_loc_array.length>0){
    jQuery('.li-loc').addClass('active-items');
  }
  if(this._filter_service.filter_auto_cancel_array.length>0){
    jQuery('.li-cancel').addClass('active-items');
  }
  if(this._filter_service.filter_status_array.length>0){
    jQuery('.li-status').addClass('active-items');
  }
  if(this._filter_service.filter_service_array.length>0){
    jQuery('.li-service').addClass('active-items');
  }
  if(this._filter_service.filter_provider_array.length>0){
    jQuery('.li-provider').addClass('active-items');
  }
  if(this._filter_service.filter_agency_array.length>0){
    jQuery('.li-agency').addClass('active-items');
  }
  if(this._filter_service.filter_destination_array.length>0){
    jQuery('.li-destination').addClass('active-items');
  }

  if(this.ready_for_close == true){
    jQuery("modal-backdrop").remove();
    jQuery("body").removeClass('modal-open');
  } else {
    jQuery(".column-filters").show();
    jQuery(".column-passenger, .column-locator, .column-auto-cancel, .column-status, .column-service, .column-provider, .column-agency, .column-destination, .column-created-date, .column-service-date").hide();
    this.ready_for_close = true;  
  }
}

//////////////////////////////////////////////////////////////////////////////////////////
/// Button 'close' for modal and return Bworkspace(Close when click out side of Modal) ///
close_modal_filters(){ 
  this.remove_modal_filters();        
}

///////////////////////////////
/// Add line in Datepicker ///
line_picker(){
  jQuery('#new-row').remove();
  var selector_row ='table.table-condensed thead tr:nth-child(2)';
  jQuery(selector_row).after('<tr id="new-row"><td id="no-space" colspan="7"><hr class="line-date"></td></tr>'); 
}



}//Close class ModalFilters