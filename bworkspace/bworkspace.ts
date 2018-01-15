import {Component, ViewEncapsulation, ViewContainerRef, OnInit, NgZone , ViewChild ,  ChangeDetectorRef , OnDestroy } from '@angular/core';
import {Widget} from '../core/widget/widget';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {Idle, DEFAULT_INTERRUPTSOURCES} from 'ng2-idle/core'; //For timeout
import {DialogRef} from 'angular2-modal';
import {Observable} from 'rxjs/Observable';
import {CustomHttp} from './../services/http-wrapper';
import myGlobals = require('./../../app');
import {NKDatetime} from 'ng2-datetime/ng2-datetime'; //Datepicker
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import { Location} from '@angular/common';
import {TitleService} from '../core/navbar/titles.service';
import {Modal, BS_MODAL_PROVIDERS as MODAL_P} from 'angular2-modal/plugins/bootstrap'; //Modal
import {filter} from './filter'; //Model Backend
import {ModalFilters} from './modalfilters/modal_filters'; //modal_filters.ts
import {filters as fil} from '../../app/customers/filters'; //Model Filters agencies list
import {ModalFiltersService} from './modalfilters/modalfilters.service'; //Service
import {LoadingGif} from '../bworkspace/filedetail/loading_gif.service';
import {DOMAIN} from '../../app';
import {myPagination} from './../settings/pagination-mappings/pagination.subcomponent';
import {DataPagination} from './../settings/pagination-mappings/data_pagination.service';
import {Subscription} from 'rxjs/Subscription';

declare var jQuery: any;
declare var $: any;
export  var filters: string="";

@Component({
  selector: '[bworkspace]',
  template: require('./bworkspace.html'),
  //encapsulation: ViewEncapsulation.None, //Luciano al quitar este encapsulation se rompen los estilos del Datepicker, fijate que si lo descomentas los estilos cambian como está en el wireframe, habría que ver cómo hacer para que no se rompan los estilos
  directives: [ROUTER_DIRECTIVES, NKDatetime, [Widget], myPagination],
  styles: [require('./vsearch.scss')],
  providers: [MODAL_P, Modal, ModalFilters, DataPagination]
})

export class Bworkspace {

private subscription: Subscription;

//Pagination
@ViewChild('pagination') myPag;
limit_per_pages:number = 7;

//Bookings and Files
response_json: any;
response_json_files: any;
numbers_of_pages: number;
number_of_page: number; //filter parameter
array_pages=[];
current_page: any;
clicked: any; //Click active
next_pages_u : any;
next_count = 1; //+1 when click next
firstof_page = 1; //First page of following page
blocker_next = false; //Stop propagation
blocker_prev = false; //Stop propagation
blocker_next_f = false; //Stop propagation
blocker_prev_f = false; //Stop propagation
limit : any; 
count_items: any; 
last_page: any; 
query_type: any; 
event_type: any;
asc = true; //Ascendent true or false
sort_state = false; //Sort state on off
sort_arrow_down = false; //Arrows
order: any; //Sort currentsave
ngoninit_status: boolean; //If true means it's first time(used in sort)
selected_type: any; //Show selected search buttons  

//Icons Tables Bookings and Files Booking Workspace 
show_icons_book = false;
show_icons_files = false;

//Sort filters icons Bookings
sort_state_record = false;
sort_state_service = false;
sort_state_service_name = false;
sort_state_lead = false;
sort_state_service_provider = false;
sort_state_service_agency = false;
sort_state_booking_start_date = false; 
sort_state_booking_end_date = false;   
sort_state_reservation = false;
sort_state_auto = false;
sort_state_service_confimation = false;
sort_state_service_creation_date = false;

//Sort filters icons Files
sort_state_record_f = false;
sort_state_lead_f = false;
sort_state_creation_date = false; 
sort_state_last_updated = false; 
sort_state_number_service = false;
sort_state_service_agency_f = false;
sort_state_file_start_date = false; 
sort_state_file_end_date = false;   
sort_state_number_nights = false;
sort_state_number_passengers = false;

//Date-range and filter by Bookings or Files
filter_by_bookings_or_files: string;
date_created_from: any;
date_created_to: any;
date_travel_from: any;
date_travel_to: any;
book_first_time = false;

//Modal Filters Travtion Search
response_filters; //Response all Filters
passenger_name: string[];
reservation_code_locator: string[];
will_auto_cancel: any[];
status: any[];
service_type: any[];
provider: any[];
agency_user: string[];
destination: string[];

showPagination : boolean = false;
allowVoucher_css:any= [];
allowVoucher_css_booking : any = [];

//Title page
title_page: any;
voucherBooking:any;

//Control width of screens
view_port_width_bw = true;
voucherFile:any; 
eventPage:any;

// Autocancel
is_auto_cancel = [];
auto_cancel_date = [];
myUrl:any;
url:any;

constructor(
  public _data_pagination: DataPagination, 
  public router: Router, 
  public http: Http, 
  public params: RouteParams, 
  public location: Location, 
  public _titleService: TitleService, 
  public modal: Modal, 
  viewContainer: ViewContainerRef, 
  public load: LoadingGif, 
  public _modal_filters: ModalFilters, 
  public _filter_service: ModalFiltersService, 
  public _filters: filter,
  public _filters_agencies: fil,  
  private ngZone: NgZone,
  private cd: ChangeDetectorRef
){
  //Modal Filters
  modal.defaultViewContainer = viewContainer;
  
  //Store imported Title in local title
  this.title_page = _titleService.title_page;
  this.changeMyTitle(); //Update Title
  this.get_size(); //Call Method for alocate modal Filters in right column 
 
   //ReSize event
    window.onresize = (e) => {
        ngZone.run(() => {
            this.get_size(); 
        });
    };
} //Close constructor

changeMyTitle() {
  this._titleService.change('Booking Workspace');
  console.log('booking Title: ' + this._titleService.title_page);
}
 
ngOnInit(): void {

 if (this.location.path() == '/app/bworkspace') {
      this.restartFilter();
  }

if (this.location.path().indexOf(";") != -1 ) {
      this.myUrl = this.location.path().slice(0,this.location.path().indexOf(";"));
  } else {
      this.myUrl = this.location.path();
  }
  
  this.ngoninit_status = true;
  this.array_pages.length = 0; //Empty array bookings
  ///////////////////////////  
  ///Datepicker date-range///
  /*jQuery('.input-daterange input').each(function() {
    jQuery(this).datepicker("clearDates");
  });

   ///////////////////////////////////
  /// Detect if user is scrolling ///
  $('body').scroll(function(e) {
    if ($(this).is(':animated')) {
      //console.log('scroll happen by animate');
    } else if (e.originalEvent) {
      //scroll happen manual scroll
      //console.log('scroll happen manual scroll');
      jQuery('#date_created_from').datepicker('remove');
      jQuery('#date_created_to').datepicker('remove');
      jQuery('#date_travel_from').datepicker('remove');
      jQuery('#date_travel_to').datepicker('remove');
    } else {
      // scroll happen by call
      //console.log('scroll happen by call');
    }
  }); */
  
  //////////////////////////////////////////////////////
  /// By defaults order by Creation Date to Bookings ///
  var filter_by_bookings_or_files = this.params.get('search_type');
  if(filter_by_bookings_or_files == null){
      /////////////////////////////////////////////////////////////////////////
      /// If first time Call request filters and files by default with sort ///
    // this.get_all_filters('');
    $('#creation_date').trigger('click');
  }else{
    ////////////////////////////////////////////////////
    /// If have parameters only Call request filters ///
    this.get_all_filters('');  
  }

   this.subscription = this._filter_service.notifyObservable.subscribe((res) => {
           this.sort_all(this._filters.filter_by_bookings_or_files, this._filters.date_created_from, this._filters.date_created_to, this._filters.date_travel_from, this._filters.date_travel_to, 'creation_date'); 
           $('.white_b').hide(); 
           $('.white_f').hide(); 
            //this._filters.status = this._filters.status.filter((a)=> {return a != null});
            // if( this._filters.filter_by_bookings_or_files == 'Bookings' || this.book_first_time == false){
        //     if( this._filters.filter_by_bookings_or_files == 'Bookings' ){
        //       // this.book_first_time = true;
        //       //alert( this.book_first_time);
        //       //If first time Call request filters and Bookings by default with sort
        //        this.sort_all('Bookings', this._filters.date_created_from, this._filters.date_created_to, this._filters.date_travel_from, this._filters.date_travel_to, 'creation_date'); 
        //        $('.white_b').hide();              
        //     } else {

        //     this.search( //Call requets
        //     this._filters.filter_by_bookings_or_files, //Send search by Bookings or Files to search method
        //     this._filters.date_created_from, 
        //     this._filters.date_created_to, 
        //     this._filters.date_travel_from, 
        //     this._filters.date_travel_to, 
        //     this._filters.order, 
        //     this._filters.asc , 
        //     this._filters.number_of_page,
        //     ''
        //   );
        // }//Close else
    });

   setTimeout(()=>{
     if  (Number(this.params.get('number_of_page')) == 0 ) {
        this._filters.number_of_page = 1;
     } else {
        this._filters.number_of_page = Number(this.params.get('number_of_page'));
     }
   });
    this.verifyCtrl();

    jQuery('.white_f').hide(); 
    jQuery('.white_b').hide(); 

} //Close ngOnInit

check_who_voucher() {
  let currentResponse = [];
  if (this.response_json_files == undefined ) {
    currentResponse = this.response_json;
  } else {
    currentResponse = this.response_json_files;
  }
  for (var u = 0; u < currentResponse.length ; ++u) {
    if ( currentResponse[u].allow_voucher == false) {
      // $("#a"+u).addClass("dv_a");
      // $("#li"+u).addClass("dv_li");
      this.allowVoucher_css[u] = true;
      // this.cd.detectChanges();
    }
  }
}
ctrlVal : boolean = false;

verifyCtrl() {
  document.body.addEventListener('keydown', (e) => {
        this.ctrlVal = e.ctrlKey;
  });​​​​​​​
  document.body.addEventListener('keyup', (e) => {
        this.ctrlVal = e.ctrlKey;
  });​​​​​​​
}

current_page_change(data){
  this.search( //Call requets
            this._filters.filter_by_bookings_or_files, //Send search by Bookings or Files to search method
            this._filters.date_created_from, 
            this._filters.date_created_to, 
            this._filters.date_travel_from, 
            this._filters.date_travel_to, 
            this._filters.order, 
            this._filters.asc, data.selectedPage,
            ''
          );
  this.save_filter_data(data.selectedPage , '');
  // var get_url = this._filters.create_url();             
  // this.location.go('/app/bworkspace;' + get_url); 
  //Acá ejecuta el request en forma de observable, primero hace get_mappings y sólo cuando termina de hacer ese método retorna para seguir haciendo lo que está dentro del .map que es el método pagination_mappings que está dentro del subcomponent   
}


restartFilter(){
  this._modal_filters.refreshModalFilters();
  // this.get_all_filters(); 
}
/////////////////////////////////////////////////////////
/// Method for alocate modal Filters in right column  ///
get_size(){
  //Get dimension
  var viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0); //width of viewport
  var viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0); //height of viewport
  var margin_left_for_modal = viewport_width - 320 - 296; //Calculate viewport minus modal width minus 296
  var m = margin_left_for_modal + 'px !important';

  $('.modal-propia').css('margin-left', m);
  if ($('.modal-dialog').css("width") != "none" ){
    $('.modal-dialog').css('width', 'none');   
  }

  //////////////////////////////////////////////////
  /// Alocate div container of Booking Workspace ///
  if(viewport_width < 1200){
    this.view_port_width_bw = false;
  }else if(viewport_width > 1200) {
    this.view_port_width_bw = true;
  }
}

/////////////////////////////////////////////////////////////////////////////////////////
///                                      TRAVTION SEARCH                              ///
/////////////////////////////////////////////////////////////////////////////////////////
verify_filters(fromSort){
      /// Store parameters from URL ///
      var filter_by_bookings_or_files = this.params.get('search_type');
      var filter_passenger_name = this.params.get('passenger_name');
      var filter_reservation_code_locator = this.params.get('reservation_code_locator');
      var filter_will_auto_cancel = this.params.get('will_auto_cancel');
      var filter_status = this.params.get('status');
      var filter_service_type = this.params.get('service_type');
      var filter_provider = this.params.get('provider');
      var filter_agency_user = this.params.get('agency_user');
      var filter_destination = this.params.get('destination');
      var filter_created_from = this.params.get('date_created_from');
      var filter_created_to = this.params.get('date_created_to'); 
      var filter_travel_from = this.params.get('date_travel_from');
      var filter_travel_to = this.params.get('date_travel_to'); 
      var filter_order = this.params.get('order');
      this._filters.number_of_page = Number(this.params.get('number_of_page'));
      var boolean_asc = (this.params.get('asc') === "true");
      this._filters.asc = boolean_asc;

      //Ckeck if there is a parameter in URL
      if(filter_by_bookings_or_files !=null || filter_passenger_name !=null || filter_reservation_code_locator !=null || 
        filter_will_auto_cancel !=null || filter_status !=null || filter_service_type !=null || filter_provider !=null ||
        filter_agency_user !=null || filter_destination !=null || filter_created_from !=null || filter_created_to !=null || 
        filter_travel_from !=null || filter_travel_to !=null || filter_order !=null) {

          //Hide Date-Range if no Dates
          if( filter_created_from != '' || filter_created_to != ''){
            jQuery('.from_c, .to_c, #icon_c').fadeIn();
            jQuery('.datepicker-created, .datepicker-created input, .datepicker-created i').css('display', 'inline-block').fadeIn();
          }
          if(filter_travel_from != '' || filter_travel_to != ''){
            jQuery('.from_t, .to_t, #icon_t').fadeIn();
            jQuery('.datepicker-travel, .datepicker-travel input, .datepicker-travel i').css('display', 'inline-block').fadeIn();
          }
          
          //Store parameters from url in model(filter.ts) properties
          this._filters.filter_by_bookings_or_files = filter_by_bookings_or_files;
          if(filter_passenger_name != '') {
            this._filters.passenger_name = filter_passenger_name.toString().split(','); 
            this._filter_service.filter_pax_array = filter_passenger_name.toString().split(','); 
            
          }
          if(filter_reservation_code_locator != '') {
            this._filters.reservation_code_locator = filter_reservation_code_locator.toString().split(',');
            this._filter_service.filter_loc_array = filter_reservation_code_locator.toString().split(',');
         }
          if(filter_will_auto_cancel != '') {
            this._filters.will_auto_cancel[0]=filter_will_auto_cancel;
            this._filter_service.filter_auto_cancel_array[0]=filter_will_auto_cancel;  
          }
          if(filter_status != '') {
            this._filters.status = filter_status.toString().split(',');
            this._filter_service.filter_status_array = filter_status.toString().split(',');

          }
          if(filter_service_type != '') {
            this._filters.service_type = filter_service_type.toString().split(',');
            this._filter_service.filter_service_array = filter_service_type.toString().split(',');
         }
          if(filter_provider != '') {
            this._filters.provider = filter_provider.toString().split(',');
            this._filter_service.filter_provider_array = filter_provider.toString().split(',');
          }
          if(filter_agency_user != '') {
            this._filters.agency_user = filter_agency_user.toString().split(',');
            this._filter_service.filter_agency_array = filter_agency_user.toString().split(',');
          }
          if(filter_destination != '') {
            this._filters.destination = filter_destination.toString().split(',');
            this._filter_service.filter_destination_array= filter_destination.toString().split(',');
          }
          this._filters.date_created_from = filter_created_from;
          this._filters.date_created_to = filter_created_to;
          this._filters.date_travel_from = filter_travel_from;
          this._filters.date_travel_to = filter_travel_to;
                  
          //Show dates on Datepicker and show other filters
          this.passenger_name = this._filters.passenger_name; 
          this.reservation_code_locator = this._filters.reservation_code_locator;
          this.will_auto_cancel = this._filters.will_auto_cancel;
          this.status = this._filters.status;
          this.service_type = this._filters.service_type;
          this.provider = this._filters.provider;
          this.agency_user = this._filters.agency_user;
          this.destination = this._filters.destination;
          this.date_created_from = this._filters.date_created_from;
          this.date_created_to = this._filters.date_created_to;
          this.date_travel_from = this._filters.date_travel_from;
          this.date_travel_to = this._filters.date_travel_to;
          this.number_of_page = this._filters.number_of_page;
          this._filter_service.come_from_modal = false;
          this._modal_filters.search('no_filtering');

          //Set input values
          /*jQuery('.from_c').val(this.date_created_from);
          jQuery('.to_c').val(this.date_created_to);

          jQuery('.from_t').val(this.date_travel_from);
          jQuery('.to_t').val(this.date_travel_to);

          jQuery('.datepicker-created input:first-child').val(this.date_created_from);
          jQuery('.datepicker-created input:last-child').val(this.date_created_to);

          jQuery('.datepicker-travel input:first-child').val(this.date_travel_from);
          jQuery('.datepicker-travel input:last-child').val(this.date_travel_to);*/

          this._filter_service.come_from_modal= false;
          
          if (fromSort == '') {
            this.search( //Call requets
              this._filters.filter_by_bookings_or_files, //Send search by Bookings or Files to search method
              this._filters.date_created_from, 
              this._filters.date_created_to, 
              this._filters.date_travel_from, 
              this._filters.date_travel_to, 
              this._filters.order, 
              this._filters.asc , '' , ''
            );   
          }
        } //Close if check
      else{ //Call request if first time and no params open Booking Workspace
          if ( fromSort == '' ) {
             this.search('Files', '', '', '', '', 'creation_date', 'false' , '' , '');
          }
      }
         
} //Close verify_filters method

///////////////////////////////////
/// Request Filters data ///
get_all_filters(fromSort){
  let url_get_filters = myGlobals.host+'/api/admin/booking_workspace/get_filters';
  let headers = new Headers({ 'Content-Type': 'application/json' });

      this.http.get( url_get_filters, { headers: headers, withCredentials:true})
          .subscribe( 
            response => {
              this.response_filters = response.json().filters; //Local response
              this._filter_service.response_filters = this.response_filters; //Response for share to service(modalfilters.service.ts) 
              console.log('REQUEST ALL FILTERS:' + JSON.stringify(this.response_filters));
              this.verify_filters(fromSort);  
            }, error => {
          }
        );
  }
////////////////////////////////////////////////////////////////////////
/// GET DATA FROM DATA BASE ///
server_query(q_type, ev_type, number_of_page, date_create_from, date_create_to, date_travel_from, date_travel_to, order_sort, asce, selectPage, toDelete){
  //this._filters.status = this._filters.status.filter( (a)=> {return a != null});
  // let url;
  if(q_type == 'Bookings'){
    this.url = myGlobals.host+'/api/admin/booking_workspace/bookings/search';
    this.show_icons_files = false;
    this.selected_type = 'Bookings';
    
  } else if(q_type == 'Files'){
    this.url = myGlobals.host+'/api/admin/booking_workspace/files/search';
    this.show_icons_book = false;
    this.selected_type = 'Files';
  }

  var pageNumber;
  var items_for_pages;
  var num_of_page = number_of_page;
  var event_type = ev_type; //Type of event: search, next, select, etc...
  var order = order_sort; //Sorting for Bookings end Files.
  this.date_created_from = date_create_from;
  this.date_created_to = date_create_to;
  this.date_travel_from = date_travel_from;
  this.date_travel_to = date_travel_to;
  this.number_of_page = number_of_page;
  
  //Datepicker Created Date Start(FROM) 
  if(this._filters.date_created_from.length > 0){

    this.date_created_from = new Date(this._filters.date_created_from); //Full time standard
    this.date_created_from = this.date_created_from.toISOString(); //ISO format
    var date = new Date(this.date_created_from);
    var year:any = date.getFullYear();
    var month:any = date.getMonth()+1;
    var dt:any = date.getDate();

    if (dt < 10) {dt = '0' + dt;}
    if (month < 10) {month = '0' + month;}
    this.date_created_from = year+'-' + month + '-'+dt; 
  } 

  //Datepicker Created Date End(TO)
  if(this._filters.date_created_to.length > 0){
  this.date_created_to = new Date(this._filters.date_created_to); //Full time standard
  this.date_created_to = this.date_created_to.toISOString(); //ISO format
  var date2 = new Date(this.date_created_to);
  var year2:any = date2.getFullYear();
  var month2:any = date2.getMonth()+1;
  var dt2:any = date2.getDate();

  if (dt2 < 10) {dt2 = '0' + dt2;}
  if (month2 < 10) {month2 = '0' + month2;}
    this.date_created_to = year2+'-' + month2 + '-'+dt2; 
  }

  //Datepicker Service Date Start(FROM) 
  if(this._filters.date_travel_from.length > 0){
    this.date_travel_from = new Date(this._filters.date_travel_from); //Full time standard //volver
    this.date_travel_from = this.date_travel_from.toISOString(); //ISO format
    var date3 = new Date(this.date_travel_from);
    var year3:any = date3.getFullYear();
    var month3:any = date3.getMonth()+1;
    var dt3:any = date3.getDate();

    if (dt3 < 10) {dt3 = '0' + dt3;}
    if (month3 < 10) {month3 = '0' + month3;}
    this.date_travel_from = year3+'-' + month3 + '-'+dt3; 
  } 

  //Datepicker Service Date End(TO)
  if(this._filters.date_travel_to.length > 0){
    this.date_travel_to = new Date(this._filters.date_travel_to); //Full time standard
    this.date_travel_to = this.date_travel_to.toISOString(); //ISO format
    var date4 = new Date(this.date_travel_to);
    var year4:any = date4.getFullYear();
    var month4:any = date4.getMonth()+1;
    var dt4:any = date4.getDate();

    if (dt4 < 10) {dt4 = '0' + dt4;}
    if (month4 < 10) {month4 = '0' + month4;}
    this.date_travel_to = year4+'-' + month4 + '-'+dt4; 
  }

   if ( this.date_created_from != "" ) {
      this._filters.date_created_from = this.date_created_from;
   } else {
      this._filters.date_created_from = [];
   }
    if ( this.date_created_to != "" ) {
      this._filters.date_created_to = this.date_created_to;
   } else {
      this._filters.date_created_to = [];
   }
    if ( this.date_travel_from != "" ) {
      this._filters.date_travel_from = this.date_travel_from;
   } else {
      this._filters.date_travel_from = [];
   }
    if ( this.date_travel_to != "" ) {
      this._filters.date_travel_to = this.date_travel_to;
   } else {
      this._filters.date_travel_to = [];
   }

   if ( this._filters.date_travel_to != "" ) {
      this._filters.date_travel_to = this.date_travel_to;
   } else {
      this._filters.date_travel_to = [];
   }

  this._filters.order = order_sort;
  this._filters.asc = asce;

  this._filters.filter_by_bookings_or_files = q_type; //Store search type "Bookings or Files" in model(filter.ts)

  this.save_filter_data('', toDelete);

  //Modify JSON body
  switch(q_type) {
    case 'Bookings':
        items_for_pages = 'bookings_for_page';
        break;
    case 'Files':    
        items_for_pages = 'files_for_page';
        break;
  }

  if ( selectPage != '') {
    this._data_pagination.current_page = selectPage;
    pageNumber = selectPage;
  }
   else {
    this._data_pagination.current_page = 1;
    pageNumber = 1;
    // this._data_pagination.current_page = num_of_page;
    // pageNumber = num_of_page;
  }


  /////////////////////////
  /// Parameter filters /// 
  let body = JSON.stringify({ page_number: pageNumber, [items_for_pages]: myGlobals.elements_for_page, filters: this._filters});
  let headers = new Headers({ 'Content-Type': 'application/json' });
  //let headers  = new Headers({ 'Accept': 'q=0.8;application/json;q=0.9' });
  console.log('request body: ' + body);

   return   this.http.post( this.url, body, {headers: headers, withCredentials:true})
        .subscribe( 
          response => {
            console.log('Respuesta: ' + JSON.stringify(response.json()));
            if(q_type == 'Bookings'){
              this.response_json=response.json().bookings;
              this.count_items = response.json().bookings_count;
              this._data_pagination.last_page = response.json().bookings_count;
              this._data_pagination.total_page = response.json().bookings_count;
              for (var  m = 0;  m < this.response_json.length ; m++) {
                    this.is_auto_cancel[m] = this.response_json[m].is_auto_cancel;
                    this.auto_cancel_date[m] = this.response_json[m].auto_cancel_date;
              }
            }else if(q_type == 'Files'){
              this.response_json_files=response.json().files;
              this.response_json_files=response.json().files;

              this.count_items = response.json().files_count;
              this._data_pagination.last_page = response.json().files_count;
              this._data_pagination.total_page = response.json().files_count;
            }
            this._data_pagination.numbers_of_pages = Math.ceil(this._data_pagination.last_page/10); //11÷10
            if (this._data_pagination.numbers_of_pages > 1){
              this.showPagination = true;
            } else {
              this.showPagination = false;
            }
            this._data_pagination.firstof_page = Math.ceil(pageNumber/this._data_pagination.limit_per_pages)*this._data_pagination.limit_per_pages-6;        
            this._data_pagination.limit = this._data_pagination.numbers_of_pages;
            this._data_pagination.current_page = pageNumber;
            console.log('PRUEBAA: ' + this.count_items);
            //Total amount of number of pages 
            this.numbers_of_pages= Math.ceil(this.count_items/myGlobals.elements_for_page); //11÷10
            this.limit = this.numbers_of_pages;

              // if ( selectPage != '' ){
              //    this.eventPage = 'select';
              // } else {
                 this.eventPage = 'search';
              // }
                
            console.log("this._data_pagination:  " +JSON.stringify( this._data_pagination));

            this.recursive_check_pagination(this._data_pagination);
            //Call function pagination
         //   this.pagination(event_type, q_type);
            //Call function show_table
            this.show_table(q_type);
            setTimeout(()=>{
              this.load.hide_loading_gif_bw(); //Hide loading gif 
            })
            setTimeout(()=>{
              this.check_who_voucher();
            } , 1000);
            return this._data_pagination;
          }, error => {
            }
      );     
}

recursive_check_pagination(data){
     if ( this.myPag != undefined  ){
        if ( data.numbers_of_pages > 1 ) {
            this.myPag.pagination_mappings({ event:this.eventPage, _data_pagination: data });
        } else {
           this.showPagination = false;
        }
    } else {
        setTimeout(()=>{
            this.recursive_check_pagination(data);
        }, 400);
    }
}


user_forged_file(id){
  let url = myGlobals.host+'/api/admin/customers/user/forge';
    let body=JSON.stringify({ user_code: '', file: id});
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

  /////////////////////////////////////////////////////////////////////////////////
  /// SEARCH BY BOOKINGS AND FILES ///
  search(q_type, date_create_from, date_create_to, date_travel_from, date_travel_to, order, ascen, selectPage, toDelete){
    console.log('FROM CREATE: ' + date_create_from);
    console.log('FROM TRAVEL: ' + date_travel_from);
    console.log('TO CREATE: ' + date_create_to);
    console.log('TO TRAVEL: ' + date_travel_to);
    this.query_type = q_type; //Bookings or Files
    this.event_type = 'search';
    this.load.show_loading_gif_bw(); //Show loading gif 
    this.array_pages.length = 0; //Empty array bookings

    //Store array from service(modalfilters.service.ts) in array model(filter.ts) 
    this._filters.passenger_name = this._filter_service.filter_pax_array;
    this._filters.reservation_code_locator = this._filter_service.filter_loc_array;
    this._filters.will_auto_cancel = this._filter_service.filter_auto_cancel_array;
    this._filters.status = this._filter_service.filter_status_array;
    this._filters.service_type = this._filter_service.filter_service_array;
    this._filters.service_type = this._filters.service_type.filter(function(n){ return n != undefined}); //Filter service_type: Remove empty spaces from array elements
    this._filters.provider = this._filter_service.filter_provider_array;
    this._filters.agency_user = this._filter_service.filter_agency_array;
    this._filters.destination = this._filter_service.filter_destination_array;
  
    //Verify if exist number of page in parameter
    var filter_number_p = this.params.get('number_of_page');
    if(filter_number_p != null && Number(filter_number_p) != NaN && filter_number_p != ''){
      var number_of_page = Number(filter_number_p);
      this.current_page = Number(filter_number_p);
    }else{
      var number_of_page = 1;
      this.current_page = 1;
    }
    this.firstof_page = 1;
    this.asc = ascen;
    var order_sort = order; //Sorting for Bookins and Files.
    // if ( $(jQuery('.white_f')).is(":hidden") ) {
      
    // }
    // jQuery('.white_f').hide(); 
    // jQuery('.white_b').hide(); 
    //Call method to get data from data base
    this.server_query(this.query_type, this.event_type, number_of_page, date_create_from, date_create_to, date_travel_from, date_travel_to, order_sort, this.asc, selectPage, toDelete);   
  }

  ////////////////////////////////////
  ///SELECT PAGE BOOKINGS AND FILES///
  select(ev, q_type, date_create_from, date_create_to, date_travel_from, date_travel_to, order_, selectPage){
    this.query_type = q_type; //Bookings or Files
    this.event_type = 'select';
    this.load.show_loading_gif_bw(); //Show loading gif 
    this.current_page = ev; //Current page
    var order_sort = this.order;
    //Call method to get data from data base
    this.server_query( this.query_type, this.event_type, this.current_page, date_create_from, date_create_to, date_travel_from, date_travel_to, order_sort, this.asc , selectPage , '');   
  }

////////////////////////////////////////////
/// Show NEXT 7 pages BOOKINGS AND FILES ///
next_pages(q_type, date_create_from, date_create_to, date_travel_from, date_travel_to, order_, selectPage){ 
  this.query_type = q_type; //Bookings or Files
  this.event_type = 'next_pages';
  this.load.show_loading_gif_bw(); //Show loading gif
  var order_sort = this.order; //Sorting for Bookins end Files.
  var blocker_next_bf; 
  var blocker_prev_bf;
  //Disable buttons prev-next
  if(q_type == 'Bookings'){
   blocker_next_bf = 'blocker_next'; 
   blocker_prev_bf = 'blocker_prev';   
  } else if(q_type == 'Files'){
   blocker_next_bf = 'blocker_next_f'; 
   blocker_prev_bf = 'blocker_prev_f';
  }
  if(this[blocker_next_bf] == false){
    this[blocker_prev_bf] == false;
    this.next_count++; //+1 when click next
    this.array_pages.length = 0; //Empty array bookings
    this.next_pages_u = this.limit_per_pages + 1; //Current page from 8
    this.firstof_page = this.firstof_page + this.limit_per_pages; //1 + 7
    this.last_page = this.firstof_page + this.limit_per_pages - 1; //8+7-1
    this.current_page = this.firstof_page; //Current page

    //Call method to get data from data base
    this.server_query(this.query_type, this.event_type, this.current_page, date_create_from, date_create_to, date_travel_from, date_travel_to, order_sort, this.asc , selectPage , '');
  }else { //At the end and try click again 
      this.load.hide_loading_gif_bw(); //Hide loading gif 
    }  
  } 

////////////////////////////////////////////
/// Show PREV 7 pages BOOKINGS AND FILES ///
prev_pages(q_type, date_create_from, date_create_to, date_travel_from, date_travel_to, order_, selectPage){
  this.query_type = q_type; //Bookings or Files
  this.event_type = 'prev_pages';
  this.load.show_loading_gif_bw(); //Show loading gif 
  var order_sort = this.order; //Sorting for Bookins and Files.
  var blocker_next_bf; 
  var blocker_prev_bf;
  //Disable buttons prev-next
  if(q_type == 'Bookings'){
    blocker_next_bf = 'blocker_next'; 
    blocker_prev_bf = 'blocker_prev';   
  } else if(q_type == 'Files'){
    blocker_next_bf = 'blocker_next_f'; 
    blocker_prev_bf = 'blocker_prev_f';
  }
  if(this[blocker_prev_bf] == false){ 
    this[blocker_next_bf] = false;
    this.next_count--; //+1 when click next
    this.array_pages.length = 0; //Empty array bookings
    this.next_pages_u = this.limit_per_pages + 1; //Current page from 8
    this.firstof_page = this.firstof_page - this.limit_per_pages; //8-7
    this.last_page = this.firstof_page + this.limit_per_pages - 1; //8+7-1
    this.current_page = this.firstof_page; //Current page

    //Call method to get data from data base
    this.server_query(this.query_type, this.event_type, this.current_page, date_create_from, date_create_to, date_travel_from, date_travel_to, order_sort, this.asc, selectPage, '');   
  }else { //At the end and try click again 
      this.load.hide_loading_gif_bw(); //Hide loading gif 
    }   
  }

open_booking_detail(id_bookings, event, i){
  //var service_without_empty = this._filters.service_type.filter(function(n){ return n != undefined });
  this._filters.book_detail_id_bookings = id_bookings;
  this._filters.id_bookings = id_bookings;

  switch (event.which) {
      case 1:
             
          if (this.ctrlVal == true) {
            $('#bookingOpener' + i).attr("href", DOMAIN+this.bookingDetailLocation());
            $('#bookingOpener' + i).trigger({
                type: 'mousedown',
                which: 3
            });
          }
         else {
            //Create URL with params from model:(filter.ts)
            this._filters.replace_string(); //Change "/" to "-"
            this.router.navigate(['/App', 'BookingDetail', {
            search_type: this._filters.filter_by_bookings_or_files,
            id_bookings: id_bookings, //Bookings 
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
            number_of_page: this._filters.number_of_page
          }]);
            this._filters.undo_replace_string();  //Undo "/" to "-"  
        }
      break;
  case 2:
          event.preventDefault();
          $('#bookingOpener' + i).attr("href", DOMAIN+this.bookingDetailLocation());
          $('#bookingOpener' + i).css('text-decoration', 'none');
          $('#bookingOpener' + i).trigger({
              type: 'mousedown',
              which: 3
          });
          break;
  case 3:
          $('#bookingOpener' + i).attr("href", DOMAIN+this.bookingDetailLocation());
          $('#bookingOpener' + i).css('text-decoration', 'none');
          $('#bookingOpener' + i).trigger({
              type: 'mousedown',
              which: 3
          });
          break;
    }
}

open_file_detail(record_locator: string, event, i){
  this._filters.file_detail_record_locator = record_locator;
  switch (event.which) {
        case 1:
               
                if (this.ctrlVal == true) {
                  $('#fileOpener' + i).attr("href", DOMAIN+this.fileDetailLocation());
                  $('#fileOpener' + i).trigger({
                      type: 'mousedown',
                      which: 3
                  });
                }
               else {
                this._filters.file_detail_record_locator = record_locator;
                //Create URL with params from model:(filter.ts)
                this._filters.replace_string(); //Change "/" to "-"
                this.router.navigate(['/App', 'FileDetail', { 
                search_type: this._filters.filter_by_bookings_or_files,
                record_locator: record_locator,
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
                number_of_page: this._filters.number_of_page
             }]);
                this._filters.undo_replace_string();  //Undo "/" to "-"  
                  }
            break;
        case 2:
                event.preventDefault();
                $('#fileOpener' + i).attr("href", DOMAIN+this.fileDetailLocation());
                $('#bookingOpener' + i).css('text-decoration', 'none !important');
                $('#fileOpener' + i).trigger({
                    type: 'mousedown',
                    which: 3
                });
                break;
        case 3:
                $('#fileOpener' + i).attr("href", DOMAIN+this.fileDetailLocation());
                $('#fileOpener' + i).trigger({
                    type: 'mousedown',
                    which: 3
                });
                break;
    }
  //console.log( filters+ ' , '+this.date_created_from+'->'+this.date_created_from+' , '+
  //this.date_travel_from+'->'+this.date_travel_to+' , '+this.order+' asc '+this.asc);
}

save_filter_data(selectedPage, toDelete){
  if (this.order != null){
    this.order = this.order.replace(/ /gi, '');
    this._filters.order = this.order;
  }
  if (this.passenger_name != null){
     if(this._filter_service.come_from_modal == true){ //if filters come from modal
      this.passenger_name = this._filters.passenger_name;
     }else{ //if filters come from ngOnInit URL REFRESH
         if (toDelete == '') {
            this._filters.passenger_name = this.passenger_name;
         }
    }
  }
  if (this.reservation_code_locator != null){
    if(this._filter_service.come_from_modal == true){ //if filters come from modal
      this.reservation_code_locator = this._filters.reservation_code_locator;
     }else{ //if filters come from ngOnInit URL REFRESH
      if (toDelete == '') {
        this._filters.reservation_code_locator = this.reservation_code_locator;
         }
    }
  }
  if(this.will_auto_cancel != null){
    if(this._filter_service.come_from_modal == true){ //if filters come from modal
      this.will_auto_cancel = this._filters.will_auto_cancel;
     }else{ //if filters come from ngOnInit URL REFRESH
      if ( toDelete == '' ) {
        this._filters.will_auto_cancel = this.will_auto_cancel;
         }
    }
  }
  if(this.status != null){
    if(this._filter_service.come_from_modal == true){ //if filters come from modal
      this.status = this._filters.status;
     }else{ //if filters come from ngOnInit URL REFRESH
      if (toDelete == '') {
        this._filters.status = this.status;
      }
    }
  }
  if(this.service_type != null){
    if(this._filter_service.come_from_modal == true){ //if filters come from modal
      this.service_type = this._filters.service_type;
     }else{ //if filters come from ngOnInit URL REFRESH
      if ( toDelete == '' ) {
        this._filters.service_type = this.service_type;
         }
    }
  }
  if(this.provider != null){
    if(this._filter_service.come_from_modal == true){ //if filters come from modal
      this.provider = this._filters.provider;
     }else{ //if filters come from ngOnInit URL REFRESH
      if ( toDelete == '' ) {
        this._filters.provider = this.provider;
         }
    }
  }
  if(this.agency_user != null) {
    if(this._filter_service.come_from_modal == true){ //if filters come from modal
      this.agency_user = this._filters.agency_user;
     }else{ //if filters come from ngOnInit URL REFRESH
      if ( toDelete == '' ) {
        this._filters.agency_user = this.agency_user;
         }
    }
  }
  if(this.destination != null) {
    if(this._filter_service.come_from_modal == true){ //if filters come from modal
      this.destination = this._filters.destination;
     }else{ //if filters come from ngOnInit URL REFRESH
      if ( toDelete == '' ) {
        this._filters.destination = this.destination;
         }
    }
  }
  if (this.date_created_from != null){
    this._filters.date_created_from = this.date_created_from;
  }
  if (this.date_created_to != null){
    this._filters.date_created_to = this.date_created_to;
  }
  if (this.date_travel_from != null){
    this._filters.date_travel_from = this.date_travel_from;
  }
  if (this.date_travel_to != null){
    this._filters.date_travel_to=this.date_travel_to;
  }
  if (this.number_of_page != null){

    if ( selectedPage != '' ){
      this._filters.number_of_page = selectedPage;
    } else {
      this._filters.number_of_page = this.number_of_page;
    }
  }
  

  this._filters.asc = this.asc;
  this._filters.replace_string();
  //Get URL from model:(filter.ts)  
  var get_url = this._filters.create_url();  
  setTimeout(()=>{
    this.location.go('/app/bworkspace;' + get_url); 
  });           
  
  this._filters.undo_replace_string();                 
}


////////////////////////////////////////////////////////////////////////////////
/// PAGINATION METHOD ///
pagination(event_type, q_type){ 
  var blocker_next_bf; 
  var blocker_prev_bf;
  var next_bf;
  var prev_bf;
  //Disable buttons prev-next
  if(q_type == 'Bookings'){
    blocker_next_bf = 'blocker_next'; 
    blocker_prev_bf = 'blocker_prev';
    next_bf = '#next_b'; 
    prev_bf = '#prev_b'; 
  } else if(q_type == 'Files'){
    blocker_next_bf = 'blocker_next_f'; 
    blocker_prev_bf = 'blocker_prev_f';
    next_bf = '#next_f'; 
    prev_bf = '#prev_f'; 
  }
  //Modify JSON body
  switch(event_type) {
    case 'search':
    this.array_pages.length = 0; //Empty array bookings
    ////////////////////////////////////
    /// SEARCH BY BOOKINGS AND FILES ///     
    if(this.limit>=this.limit_per_pages){ //If there is more than 7 pages show next button.
      this[blocker_prev_bf] = true;
      this[blocker_next_bf] = false;
      jQuery('.points').show();
      jQuery(next_bf).removeClass('disabled');
      
      for(var i=1;i<=this.limit_per_pages;i++){
        this.array_pages.push(i);
        this.clicked = 'clicked';
      } //Close for
    }else { //If less left than seven page
      this[blocker_next_bf] = true;
      this[blocker_prev_bf] = true;
      jQuery('.points').hide();
      jQuery(next_bf).addClass('disabled');
      jQuery(prev_bf).addClass('disabled');
      for(var i=1;i<=this.limit;i++){
        this.array_pages.push(i);
        this.clicked = 'clicked';
      }
    }
      break;
      //////////////////////////////////////////////////////////////////
    case 'select':
      //////////////////////////////////////
      /// SELECT PAGE BOOKINGS AND FILES ///
      if(this.current_page>this.limit_per_pages){ //If current page is higher than 7 show prev button.
        jQuery(prev_bf).removeClass('disabled');
          this[blocker_prev_bf] = false;
        }else {
          jQuery(prev_bf).addClass('disabled');
          this[blocker_prev_bf] = true;
        }
        break;
        ////////////////////////////////////////////////////////////////////
      case 'next_pages':
        ////////////////////////////////////
        /// NEXT PAGE BOOKINGS AND FILES ///
        if(this.numbers_of_pages>this.last_page){ //If more than 7 pages show next button.
          jQuery(next_bf).removeClass('disabled');
          jQuery(prev_bf).removeClass('disabled');
         
          this[blocker_prev_bf] = false;
          jQuery('.points').show();
          for(var i=this.firstof_page; i<=this.last_page; i++){
            this.array_pages.push(i);
          }
        }else { //If at the end remove Next
          jQuery(next_bf).addClass('disabled');
          jQuery(prev_bf).removeClass('disabled');
          jQuery('.points').hide();
          this[blocker_next_bf] = true;
          this[blocker_prev_bf] = false;
          for(var i=this.firstof_page; i<=this.numbers_of_pages; i++){
            this.array_pages.push(i);
          }
        }
        break;
        ////////////////////////////////////////////////////////////////
      case 'prev_pages':
        ////////////////////////////////////
        /// PREV PAGE BOOKINGS AND FILES ///
        if(this.firstof_page>this.limit_per_pages){ //If more than 7 pages show prev button.
          jQuery(prev_bf).removeClass('disabled');
          jQuery(next_bf).removeClass('disabled');
          this[blocker_next_bf] = false;
          jQuery('.points').show();
          for(var i=this.firstof_page; i<=this.last_page; i++){
            this.array_pages.push(i);
          }
        }else { //If at the begin remove Prev
          jQuery(prev_bf).addClass('disabled');
          jQuery(next_bf).removeClass('disabled');
          this[blocker_prev_bf] = true;
          jQuery('.points').show();
          for(var i=this.firstof_page; i<=this.last_page; i++){
            this.array_pages.push(i);
          }
        }    
        break;
  } //Close switch

} //Close pagination

///////////////////////////////
/// Add line in Datepicker ///
line_picker(){
    jQuery('#new-row').remove();
    var selector_row ='table.table-condensed thead tr:nth-child(2)';
    jQuery(selector_row).after('<tr id="new-row"><td id="no-space" colspan="7"><hr class="line-date"></td></tr>');
}
////////////////////////////////////
/// Animation buttons Datepicker ///
f_cant = 0;
picker_created(event){  
   if(this.f_cant==0){
      this.f_cant = 1;
      jQuery('.from_c, .to_c, #icon_c').fadeIn();
      //Text from and to datepicker
      jQuery('.from_c').val('FROM'); 
      jQuery('.to_c').val('TO');


      jQuery('.datepicker-created, .datepicker-created input, .datepicker-created i').css('display', 'inline-block').fadeIn();
      jQuery('.datepicker-created input:first-child').val('FROM'); 
      jQuery('.datepicker-created input:last-child').val('TO'); 
    }else {
      this.f_cant = 0;
      jQuery('.from_c, .to_c, #icon_c').fadeOut();
      jQuery(".from_c, .to_c").val(""); //Clean inputs

      jQuery('.datepicker-created, .datepicker-created input, .datepicker-created i').fadeOut();
      jQuery(".datepicker-created input").val(""); //Clean inputs
    }  
  }
  t_cant = 0;
  picker_travel(event){
   if(this.t_cant==0){
      this.t_cant = 1;
      jQuery('.from_t, .to_t, #icon_t').css('display', 'inline-block').fadeIn();
      jQuery('.from_t').val('FROM');
      jQuery('.to_t').val('TO');

      jQuery('.datepicker-travel, .datepicker-travel input, .datepicker-travel i').css('display', 'inline-block').fadeIn();
      jQuery('.datepicker-travel input:first-child').val('FROM'); 
      jQuery('.datepicker-travel input:last-child').val('TO');
    }else {
      this.t_cant = 0;
      jQuery('.from_t, .to_t, #icon_t').fadeOut();
      jQuery(".from_t, .to_t").val(""); //Clean inputs

      jQuery('.datepicker-travel, .datepicker-travel input, .datepicker-travel i').fadeOut();
      jQuery(".datepicker-travel input").val(""); //Clean inputs
    }
  }

//////////////////////////////////////////////////////
/// Icons(print, mail, etc) for Booking Worksapace ///
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

mouseover_icon_folder_f(i){ 
  /*var icon_f = '#' + i + 'icon-f';
  jQuery(icon_f).show();
  var withEllipsis = '#' + i + 'ellipsisIconF';
  jQuery(withEllipsis).css('display', 'block');*/
  var icon_f = '#' + i + 'icon-b';
  jQuery(icon_f).addClass('hovered-folder-icon');
  var withEllipsis = '#' + i + 'ellipsisIcon';
  jQuery(withEllipsis).addClass('hovered-ellipsis-icon');
}

mouseleave_icon_folder_f(){
  /*jQuery('.fa-folder-open-o').hide();
  jQuery('#files .ellipsis-icon-wrapper').removeClass('open');
  jQuery('#files .ellipsis').removeClass('focused-ellipsis-icon');
  jQuery('#files .ellipsis').hide();*/
  jQuery('.fa-folder-open-o').removeClass('hovered-folder-icon');
  jQuery('#files .ellipsis-wrapper').removeClass('open');
  jQuery('#files .ellipsis').removeClass('focused-ellipsis-icon');
  jQuery('#files .ellipsis').removeClass('hovered-ellipsis-icon');
}

focusEllipsis(i){
  var withEllipsis = '#' + i + 'ellipsisIcon';
  var withEllipsisF = '#' + i + 'ellipsisIconF';
  jQuery(withEllipsis).toggleClass('focused-ellipsis-icon');
  jQuery(withEllipsisF).toggleClass('focused-ellipsis-icon');
}

removeOpenedEllipsis(i){
  var withEllipsis = '#' + i + 'ellipsisIcon';
  var withEllipsisF = '#' + i + 'ellipsisIconF';
  jQuery(withEllipsis).removeClass('focused-ellipsis-icon');
  jQuery(withEllipsisF).removeClass('focused-ellipsis-icon');
  jQuery('#files .ellipsis-wrapper').removeClass('open');
  jQuery('#book .ellipsis-wrapper').removeClass('open');
}


  ////////////////////////
  /// Events Open sort ///
  sort_open(){
    if(this.sort_state == false){
      if(this.query_type == 'Bookings'){
        //Icons sort
        jQuery('.white_b').fadeIn('slow'); 
        jQuery('.white_f').fadeOut('slow'); 
      } else if(this.query_type == 'Files'){
        jQuery('.white_f').fadeIn('slow'); 
        jQuery('.white_b').fadeOut('slow'); 
      }
      this.sort_state = true; //Change state 
    } else if(this.sort_state == true) {
      this.sort_state = false; //Change state 
      jQuery('.white_b, .white_f').fadeOut('slow'); 
    } 
  } //Close sort_open

////////////////////////////////////////////
/// Icons sorting for Booking Worksapace ///
/*mouseover_icons_sort(text, icon){
  var text_selector = 'div#' + text;
  var icon_selector = text_selector + ' .' + icon;
  jQuery(text_selector).addClass('color-action-sorts');
  jQuery(icon_selector).addClass('color-action-sorts');
}
mouseleave_icons_sort(text, icon){
  var text_selector = 'div#' + text;
  var icon_selector = text_selector + ' .' + icon;
  jQuery(text_selector).removeClass('color-action-sorts');
  jQuery(icon_selector).removeClass('color-action-sorts');
}*/

mouseover_icons_sort(holder, icon){
  var text_selector = 'div#' + holder + ' p';
  var icon_selector = 'div#' + holder + ' .' + icon;
  jQuery(text_selector).addClass('color-action-sorts');
  jQuery(icon_selector).addClass('color-action-sorts');
}
mouseleave_icons_sort(holder, icon){
  var text_selector = 'div#' + holder + ' p';
  var icon_selector = 'div#' + holder + ' .' + icon;
  jQuery(text_selector).removeClass('color-action-sorts');
  jQuery(icon_selector).removeClass('color-action-sorts');
}

  ////////////////////////////////////////////////
  /// Methods open sub-parameters for BOOKINGS ///

  falseAllItems(){ //Set false all items
    /////////////////
    /// Bookings ///
    this.sort_state_record = false;
    this.sort_state_service = false;
    this.sort_state_service_name = false;
    this.sort_state_lead = false;
    this.sort_state_service_provider = false;
    this.sort_state_service_agency = false;
    this.sort_state_booking_start_date = false; 
    this.sort_state_booking_end_date = false;   
    this.sort_state_reservation = false;
    this.sort_state_auto = false;   
    this.sort_state_service_confimation = false;
    this.sort_state_service_creation_date = false;

    //////////////
    /// Files ///
    this.sort_state_record_f = false;
    this.sort_state_lead_f = false;
    this.sort_state_creation_date = false;
    this.sort_state_last_updated = false;
    this.sort_state_number_service = false; 
    this.sort_state_service_agency_f = false;
    this.sort_state_file_start_date = false; 
    this.sort_state_file_end_date = false;   
    this.sort_state_number_nights = false;
    this.sort_state_number_passengers = false;
  }

  hide_all_parameters(){
    this.falseAllItems();
    jQuery('.sub-service, .sub-reservation, .sub-auto-cancel, .arrows').hide();
    this.remove_active();
  }  

  //Remove class active
  remove_active(){
    jQuery('.line').removeClass('active_b');
  }
  
sort_all(q_type, date_create_from, date_create_to, date_travel_from, date_travel_to, order){
  this.order = order;
  var white;
  if(q_type == 'Bookings'){
      white = '.white_b';
      jQuery('.white_b').show();
      jQuery('.white_f').hide();

    switch(order) {
    ///////////////////////////////////////////
    /// SORTING ALL METHODS(ICONS) BOOKINGS ///  
      case 'record_locator':
          var property_state = 'sort_state_record';
          var button_sort = '#record_b';
          var arrow_id = '#arrow-record';
          var arrow_inside = button_sort + ' .arrows';
          break;
      case 'service_type':
          var property_state = 'sort_state_service';
          var button_sort = '#service_type_b';
          var arrow_id = '#arrow-serv-type';
          var arrow_inside = button_sort + ' .arrows';
          break;
      case 'service_name':
          var property_state = 'sort_state_service_name';
          var button_sort = '#service_name_b';
          var arrow_id = '#arrow-serv-name';
          var arrow_inside = button_sort + ' .arrows';
          break;
      case 'lead_passenger':
          var property_state = 'sort_state_lead';
          var button_sort = '#lead_b';
          var arrow_id = '#arrow-lead';
          var arrow_inside = button_sort + ' .arrows';
          break;
      case 'provider_name':
          var property_state = 'sort_state_service_provider';
          var button_sort = '#provider_b';
          var arrow_id = '#arrow-prov';
          var arrow_inside = button_sort + ' .arrows';
          break;
      case 'agency_operator':
          var property_state = 'sort_state_service_agency';
          var button_sort = '#agency_b';
          var arrow_id = '#arrow-agency';
          var arrow_inside = button_sort + ' .arrows';
          break;
      case 'service_start_date': 
          var property_state = 'sort_state_booking_start_date'; 
          var button_sort = '#booking-start-date';
          var arrow_id = '#arrow-booking-start-date';
          var arrow_inside = button_sort + ' .arrows';
          break;
      case 'service_end_date': 
          var property_state = 'sort_state_booking_end_date'; 
          var button_sort = '#booking-end-date';
          var arrow_id = '#arrow-booking-end-date';
          var arrow_inside = button_sort + ' .arrows';
          break;
      case 'status':
          var property_state = 'sort_state_reservation';
          var button_sort = '#reservation_b';
          var arrow_id = '#arrow-reservation';
          var arrow_inside = button_sort + ' .arrows';
          break;
      case 'auto_cancel':
          var property_state = 'sort_state_auto';
          var button_sort = '#auto';
          var arrow_id = '#arrow-auto-cancel';
          var arrow_inside = button_sort + ' .arrows';
          break;
      case 'confirmation_number':
          var property_state = 'sort_state_service_confimation';
          var button_sort = '#confimation';
          var arrow_id = '#arrow-confirm';
          var arrow_inside = button_sort + ' .arrows';
          break;
      case 'creation_date':
          var property_state = 'sort_state_service_creation_date';
          var button_sort = '#creation';
          var arrow_id = '#arrow-creation';
          var arrow_inside = button_sort + ' .arrows';
          break;      
    } //Close switch

  } else if(q_type == 'Files'){
      white = '.white_f';
      jQuery('.white_f').show();
      jQuery('.white_b').hide();

    switch(order) {
      ////////////////////////////////////////
      /// SORTING ALL METHODS(ICONS) FILES ///
      case 'record_locator':
          var property_state = 'sort_state_record_f';
          var button_sort = '#record_f';
          var arrow_id = '#arrow-record_f';
          var arrow_inside = button_sort + ' .arrows' ;
          break;
      case 'lead_passenger':
          var property_state = 'sort_state_lead_f';
          var button_sort = '#lead_f';
          var arrow_id = '#arrow-lead_f';
          var arrow_inside = button_sort + ' .arrows';
          break;
      case 'creation_date':
          var property_state = 'sort_state_creation_date';
          var button_sort = '#creation_date';
          var arrow_id = '#arrow-creation_date';
          var arrow_inside = button_sort + ' .arrows';
          break;
      case 'last_updated':
          var property_state = 'sort_state_last_updated';
          var button_sort = '#last_updated';
          var arrow_id = '#arrow-last-updated';
          var arrow_inside = button_sort + ' .arrows';
          break;
      case 'number_of_services':
          var property_state = 'sort_state_number_service';
          var button_sort = '#number_serv';
          var arrow_id = '#arrow-number-serv';
          var arrow_inside = button_sort + ' .arrows';
          break;
      case 'agency_operator':
          var property_state = 'sort_state_service_agency_f';
          var button_sort = '#agency_f';
          var arrow_id = '#arrow-agency_f';
          var arrow_inside = button_sort + ' .arrows';
          break;
      case 'file_start_date': 
          var property_state = 'sort_state_file_start_date'; 
          var button_sort = '#file-start-date';  
          var arrow_id = '#arrow-file-start-date';
          var arrow_inside = button_sort + ' .arrows';
          break;
      case 'file_end_date': 
          var property_state = 'sort_state_file_end_date'; 
          var button_sort = '#file-end-date'; 
          var arrow_id = '#arrow-file-end-date'; 
          var arrow_inside = button_sort + ' .arrows';
          break;

      case 'number_of_nights':
          var property_state = 'sort_state_number_nights';
          var button_sort = '#number_nights';
          var arrow_id = '#arrow-number-nights';
          var arrow_inside = button_sort + ' .arrows';
          break;
      case 'number_of_passengers':
          var property_state = 'sort_state_number_passengers';
          var button_sort = '#number_passen';
          var arrow_id = '#arrow-number-passen';
          var arrow_inside = button_sort + ' .arrows';
          break;      
     } //Close switch
  } //Close else if
         
    var state = this[property_state]; //Save current state
    this.hide_all_parameters(); //False and hide all items
    this[property_state] = state; //Recover real state
    var active_text_b = button_sort + ' .text_icon';
    var active_icon_b = button_sort + ' .fa'; 
    jQuery('.text_icon').removeClass('active_text_b');
    jQuery('.fa').removeClass('active_icon_b');
    if(this[property_state] == false){
      this[property_state] = true;
      this.sort_arrow_down = true;
      jQuery(button_sort).addClass('active_b');
      jQuery(active_text_b).addClass('active_text_b');
      jQuery(active_icon_b).addClass('active_icon_b');
      jQuery(arrow_id).show();
      jQuery('.fa-sort-desc').show();
      jQuery('.fa-sort-asc').hide();
      this.asc = false;
      this.get_all_filters('yes'); 
      this.search(q_type, date_create_from, date_create_to, date_travel_from, date_travel_to, order, this.asc , '', '');
        if(this.ngoninit_status == false){ //Show sort only if not first time(ngOnInit)
          jQuery(white).show(); 
        }
        this.ngoninit_status = false;
    } else {
      this[property_state] = false;
      this.sort_arrow_down = false;
      jQuery(button_sort).addClass('active_b');
      jQuery(active_text_b).addClass('active_text_b');
      jQuery(active_icon_b).addClass('active_icon_b');
      jQuery('.fa-sort-asc').show();
      jQuery(arrow_inside).show();
      jQuery('.fa-sort-desc').hide();
      this.asc = true; 
      this.get_all_filters('yes');
      this.search(q_type, date_create_from, date_create_to, date_travel_from, date_travel_to, order, this.asc , '', ''); 
      jQuery(white).show();
    }
  } //Close sort_all

  //////////////////////////////////////////////////////////////////////
  /// Event Show Tables ///
  show_table(q_type){
    if(q_type == 'Bookings'){
      this.load.hide_loading_gif_bw(); //Hide loading gif     
      jQuery('#book, .sort, #title-bookings').show();
      jQuery('#files, .title_files').hide();
      console.log('se oculta title files');
    } else if(q_type == 'Files'){
      this.load.hide_loading_gif_bw(); //Hide loading gif 
      jQuery('#files, .sort, .title_files, span').show();
      jQuery('#book, #title-bookings').hide();
      console.log('se oculta title bookings');
    } 
  } //Close show_table

/////////////////////////////////
/// Show icons table Bookings ///
show_icons_bookings(){
  var inputs = jQuery('.check-b');
  var count_true = 0;
      for(var i=0; i<inputs.length; i++){
          var checked = $('#checkbox' + i).is(":checked"); 
          if(checked == true){
            count_true++; //Count checkbox checked
            this.show_icons_book = true;
          }
      } 
      if(inputs.length == count_true){//If all inputs are check
          console.log('estan todos seleccionados');            
          this.show_icons_book = true;
      } else if(count_true == 0){ //If all inputs are unchecked
          console.log('estan todos deseleccionados');           
          this.show_icons_book = false;
      }
}

//////////////////////////////
/// Show icons table Files ///
showIconsFiles(){
  var inputs = jQuery('.check-f');
  var count_true = 0;
      for(var i=0; i<inputs.length; i++){
          var checked = $('#checkbox-f' + i).is(":checked"); 
          if(checked == true){
            count_true++; //Count checkbox checked
            this.show_icons_files = true;
          }
      } 
      if(inputs.length == count_true){//If all inputs are check
          console.log('estan todos seleccionados');            
          this.show_icons_files = true;
      } else if(count_true == 0){ //If all inputs are unchecked
          console.log('estan todos deseleccionados');           
          this.show_icons_files = false;
      }
}

///////////////////////////////
/// FILTERS TRAVTION SEARCH ///
///////////////////////////////

edit_pill(pill, e, i){
  e.stopPropagation();
  this._filter_service.event_type = 'edit';
  this.open_filters(ModalFilters);
  this._filter_service.edit_filter = pill; //Identify Pill is editing 
  this._filter_service.iteration = i;
}

 //////////////////////////////
/// Open Modal input Search ///
open_modal_filters(){
  this._filter_service.event_type = 'new';
  this.open_filters(ModalFilters);
}

////////////////////////////
/// Open Filter By Modal ///
 open_filters(ModalFilters){
    this.modal.alert()
      .size('propia')
      .isBlocking(true)
      .keyboard(300)
      .showClose(true)
      .component(ModalFilters)
      .open().then(result => { result.result.then(() => {}, () => {}); });
  }

 /////////////////////
 /// Input Filters ///
  remove_filter(e, filter_pro){
    e.stopPropagation();
    this._filter_service[filter_pro] = '';
     jQuery('#' + filter_pro).hide(); 
  }

  remove_filter_array(e, filter_pro, i){
    e.stopPropagation();

    /////////////////////////////////////////////////////////////
    /// Just in case of array empty element without remove it ///
    if(filter_pro == 'filter_status_array'){ //Filter STATUS
      console.log('Antes del splice: ' + this._filter_service[filter_pro]);
      this._filter_service[filter_pro][i] = undefined;
      console.log('Después del splice: ' + this._filter_service[filter_pro]);
    } else if(filter_pro == 'filter_service_array'){ //Filter SERVICE TYPE
      console.log('Antes del splice: ' + this._filter_service[filter_pro]);
      this._filter_service[filter_pro][i] = undefined;
      console.log('Después del splice: ' + this._filter_service[filter_pro]);
    } else if(filter_pro == 'filter_provider_array'){ //Filter PROVIDER
      console.log('Antes del splice: ' + this._filter_service[filter_pro]);
      this._filter_service[filter_pro][i] = undefined;
      console.log('Después del splice: ' + this._filter_service[filter_pro]);
    } else if(filter_pro != 'filter_status_array' && filter_pro != 'filter_service_array' && filter_pro != 'filter_provider_array') {
      console.log('Antes del splice: ' + this._filter_service[filter_pro]);
      this._filter_service[filter_pro].splice(i, 1);
      console.log('Después del splice: ' + this._filter_service[filter_pro]);
    }

    //Ckeck if All elements are undefined and remove All elements
    if( this._filter_service[filter_pro].every(element => element === undefined)){
        this._filter_service[filter_pro]=[];
    }

    /////////////////////////////////////////////
    /// Call request with removed Pill filter ///
    if(this.query_type == 'Files'){
      this.search('Files', '', '', '', '', 'creation_date', 'false', 1, 'toDelete'); 
    }else if(this.query_type == 'Bookings'){
      this.search('Bookings', '', '', '', '', 'creation_date', 'false', 1, 'toDelete'); 
    }
    
  }

/*Create rute for opening in a new tab */
   fileDetailLocation(): string {
     return '/app/bworkspace/filedetail;record_locator=' + this._filters.file_detail_record_locator +';' + this._filters.create_url();
   }

   bookingDetailLocation(): string {
     return '/app/bworkspace/bookingdetail;id_bookings=' + this._filters.book_detail_id_bookings +';' + this._filters.create_url();
   }

    //////////////////////////////////////////
    /// OPEN AGENCY DETAIL WITH CTRL+CLICK ///
    currentLocation(): string {
      console.log('/app/customers/list-agencies/agency-detail;list_come_from=right_click;id='+ this._filters_agencies.agency_detail_id_agencies+';' + this._filters_agencies.create_url());
      return '/app/customers/list-agencies/agency-detail;list_come_from=right_click;id='+ this._filters_agencies.agency_detail_id_agencies+';' + this._filters_agencies.create_url();
    }

  //////////////////////////////////////////////////////////////////////////////
  /// Go to agency detail after click agency name link in Bookings and Files ///
  go_to_agency_detail(id_agency, event, i){
  this._filters_agencies.agency_detail_id_agencies = id_agency;

  switch (event.which) {
        case 1:
        event.preventDefault();
             
  //Create URL with params from model:(filter.ts)
  this._filters_agencies.replace_string(); //Change "/" to "-"

    this.router.navigate(['/App', 'AgencyDetail', {
        list_come_from: 'bw',
        id: id_agency,
        status: this._filters_agencies.status,
        name: this._filters_agencies.name,
        tax_number: this._filters_agencies.tax_number,
        email: this._filters_agencies.email,
        phone_number: this._filters_agencies.phone_number,
        city: this._filters_agencies.city,
        state: this._filters_agencies.state,
        country: this._filters_agencies.country,
        address: this._filters_agencies.address,
        zip: this._filters_agencies.zip,
        has_bookings: this._filters_agencies.has_bookings,
        date_created_from:  this._filters_agencies.date_created_from,
        date_created_to: this._filters_agencies.date_created_to,
        order: this._filters_agencies.order,
        asc: this._filters_agencies.asc,
        number_of_page: this._filters_agencies.number_of_page,
        fromUserLink : 'n'
    }]);
    this._filters_agencies.undo_replace_string();  //Undo "/" to "-"

            break;
        case 2:
            event.preventDefault();
            $('#agency-opener' + i).attr("href", myGlobals.DOMAIN+this.currentLocation());
            $('#agency-opener' + i).trigger({
                type: 'mousedown',
                which: 2
            });
            break;
        case 3:
            $('#agency-opener' + i).attr("href", myGlobals.DOMAIN+this.currentLocation());
            $('#agency-opener' + i).trigger({
                type: 'mousedown',
                which: 3
            });
            break;
    } //Close switch
}


///////////////////////////////////////
/// Request download invoice //////////
download_invoice(record_locator){
  let url = myGlobals.host+'/api/admin/booking_workspace/file_detail/invoice';
    let body=JSON.stringify({ record_locator_file: record_locator});
    let headers = new Headers({ 'Content-Type': 'application/json' });
    
    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .subscribe(
        response => {
                if (response.json().error_data.exist_error == false)
                {
                  var save = document.createElement('a');
                  save.setAttribute('download', response.json().file_detail_invoice_name);
                  save.href = myGlobals.host+response.json().file_detail_invoice;
                  save.target = '_blank'; 
                  document.body.appendChild(save);
                  save.click();
                  document.body.removeChild(save);
                }

        }, error => {}
    );
}

/// Request download voucher booking //////////
download_voucher_booking(id , i ){
    if ( this.allowVoucher_css[i] != true ){
      console.log('ID de Booking para vaucher: '+id);
      let url = myGlobals.host+'/api/admin/booking_workspace/booking_detail/voucher';
      let body=JSON.stringify({ id_booking: id });
      console.log('Body del request del voucher: ' + body);
      let headers = new Headers({ 'Content-Type': 'application/json' });

      return this.http.post( url, body, {headers: headers, withCredentials:true})
      .subscribe(
          response => {
            console.log('boking/voucher response: '+JSON.stringify(response.json()));
                  this.voucherBooking = response.json().booking_detail_voucher;
                  if (response.json().error_data.exist_error == false)
                  {                 
                    var save = document.createElement('a');  
                    save.href = myGlobals.host+this.voucherBooking;; 
                    save.setAttribute('download', response.json().booking_detail_voucher_name);
                    save.target = '_blank'; 
                    document.body.appendChild(save);
                    save.click();
                    document.body.removeChild(save);
                  }
          }, error => {}
      );
  }
}

/// Request download voucher file //////////
download_voucher_file(id , i){
     console.log("ID para file_detail/voucher: "+id);
     if ( this.allowVoucher_css[i] != true ){
      let url = myGlobals.host+'/api/admin/booking_workspace/file_detail/voucher';
        let body=JSON.stringify({ record_locator_file: id });
        console.log('Body del request del voucher: ' + body);
        let headers = new Headers({ 'Content-Type': 'application/json' });

        return this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe(
            response => {
                    console.log('file_detail/voucher RESPONSE: ' + JSON.stringify(response.json()));
                    this.voucherFile = response.json().file_detail_voucher;
                    if (response.json().error_data.exist_error == false)
                    {                 
                      var save = document.createElement('a');  
                      save.href = myGlobals.host+this.voucherFile;; 
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


actionButton_file(record_locator , action){
  this._filters.file_detail_record_locator = record_locator;
  //Create URL with params from model:(filter.ts)
  this._filters.replace_string(); //Change "/" to "-"
  this.router.navigate(['/App', 'FileDetail', { 
  search_type: this._filters.filter_by_bookings_or_files,
  record_locator: record_locator,
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
  action: action
  }]);
  this._filters.undo_replace_string();
}



actionButton_booking(id_bookings, action ){
  this._filters.book_detail_id_bookings = id_bookings;
  //Create URL with params from model:(filter.ts)
  this._filters.replace_string(); //Change "/" to "-"
  this.router.navigate(['/App', 'BookingDetail', {
  search_type: this._filters.filter_by_bookings_or_files,
  id_bookings: id_bookings, //Bookings 
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
  number_of_page:  this._filters.number_of_page,
  action : action
  }]);
  this._filters.undo_replace_string();  //Undo "/" to "-"  
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
                  this.is_auto_cancel[i] = bool;
                }
        }, error => {}
    ).subscribe();
  }

addIfeServ(record, name, lastname){

  this._filters.status = this._filters.status.filter(function(n){ return n != undefined}); //Remove empty spaces from array elements
  this._filters.service_type = this._filters.service_type.filter(function(n){ return n != undefined }); //Filter service_type: Remove empty spaces from array elements
  this._filters.provider = this._filters.provider.filter(function(n){ return n != undefined }); //Filter provider: Remove empty spaces from array elements
  if(this._filters.order=='' || this._filters.order== undefined || this._filters.order== null){
    this._filters.order='creation_date';
  }
  
  let bwUrl = this.myUrl.substring(this.myUrl.indexOf("bworkspace") + "bworkspace".length, -1);
  this._filters.replace_string(); //Change "/" to "-"

  window.open(myGlobals.DOMAIN+bwUrl+
            "/ife"+
            ";name="+name+
            ";lastname="+lastname+
            ";search_type="+ this._filters.filter_by_bookings_or_files+
            //";id_bookings="+ this._filters.book_detail_id_bookings+ //Bookings 
            ";passenger_name="+ this._filters.passenger_name+
            ";reservation_code_locator="+record+
            ";will_auto_cancel="+ this._filters.will_auto_cancel+
            ";status="+ this._filters.status+
            ";service_type="+ this._filters.service_type+
            ";provider="+ this._filters.provider+
            ";agency_user="+ this._filters.agency_user+ 
            ";destination="+ this._filters.destination+
            ";date_created_from="+ this._filters.date_created_from+
            ";date_created_to="+ this._filters.date_created_to+
            ";date_travel_from="+ this._filters.date_travel_from+
            ";date_travel_to="+ this._filters.date_travel_to+
            ";order="+ this._filters.order+
            ";asc="+ this._filters.asc+
            ";number_of_page="+ this._filters.number_of_page);            
           
            this._filters.undo_replace_string();  //Undo "/" to "-" 
}


ngOnDestroy(){
  this.subscription.unsubscribe();
}

}//Close class Bworkspace



