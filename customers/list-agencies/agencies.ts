import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, OnInit, NgZone , ViewChild} from '@angular/core';
import {Widget} from '../../core/widget/widget';
import {RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import { Idle, DEFAULT_INTERRUPTSOURCES } from 'ng2-idle/core'; //For timeout
import { DialogRef } from 'angular2-modal';
import {Observable} from 'rxjs/Observable';
import {CustomHttp} from '../../services/http-wrapper';
import myGlobals = require('../../../app');
//import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NgClass} from '@angular/common';
import { Modal, BS_MODAL_PROVIDERS as MODAL_P } from 'angular2-modal/plugins/bootstrap'; //Modal
import {Core} from '../../core/core';
import { Location } from '@angular/common';
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';
import {filters} from '../filters'; //Model Backend
import {ModalFiltersAgencies} from '../modalfilters/modal_filters'; //modal_filters.ts
import {ModalFiltersServiceAgencies} from '../modalfilters/modalfilters.service'; //Service
import {DataPropertiesListAgencies} from './data_properties.service';
import {editAgencyDetail} from '../list-agencies/agency-detail/inline-agencies/edit_form_agencies.service'; //Inline Editing List Agencies
import {AgencyDetail} from '../list-agencies/agency-detail/agency-detail';
import {TitleService} from '../../core/navbar/titles.service';
import {myPagination} from '../../settings/pagination-mappings/pagination.subcomponent';
import {DataPagination} from '../../settings/pagination-mappings/data_pagination.service';
import { Subscription } from 'rxjs/Subscription';

declare var jQuery: any;
declare var $: any;
export var filter: string="";
import {host} from './../../../app';

//////////////////////
/// List Agencies ////
@Component({
  selector: '[agencies]',
  template: require('./agencies.html'),
  styles: [require('./agencies.scss')],
  directives: [ROUTER_DIRECTIVES, [Widget] , [myPagination]],
  providers: [MODAL_P, Modal, ModalFiltersAgencies, editAgencyDetail, AgencyDetail, DataPagination]
})

export class Agencies {

    //Title page
    title_page: any;
    checked = false; //Select All
    justchange: any; //just change icon to normal checkbox

    //Icons Enabled/Disabled Table External Providers
    show_icons_agencies = false;
    disabled_age = false; //It's enabled
    selected_ag= [];

    //Date-range and filter by Bookings or Files
    filter_by_agencies: string;
    date_created_from: string;
    date_created_to: string;
    /*date_travel_from: string;
    date_travel_to: string;*/

    //Modal Filters Travtion Search
    response_filters; //Response all Filters
    number_of_page: number; //filter parameter
    status: any[];
    name: string[];
    tax_number: any[];
    email: any[];
    phone_number: any[];
    city: any[];
    state: string[];
    country: string[];
    address: string[];
    zip: string[];
    has_bookings: any[];

    //Control width of screens
    view_port_width_list_agen = true;

    //Export to excel
    excel_string: string;
    myUrl : string;
    private subscription: Subscription;

    @ViewChild('pagination') myPag;

    constructor(
      public _data_pagination: DataPagination, 
      public pag: myPagination, 
      public http: Http, 
      public params: RouteParams, 
      public router: Router, 
      public _titleService: TitleService,
      public modal: Modal, 
      public load: LoadingGif, 
      viewContainer: ViewContainerRef, 
      public _loc: Location, 
      public _filter_service: ModalFiltersServiceAgencies,
      public _filters: filters, 
      private ngZone: NgZone, 
      public _modal_filters: ModalFiltersAgencies, 
      public _agency_detail: AgencyDetail,
      public _service: DataPropertiesListAgencies, 
      public _edit_agencies: editAgencyDetail, 
      public location: Location
  ) {

        //Modal Filters Agencies
        modal.defaultViewContainer = viewContainer;

        //Store imported Title in local title
        this.title_page = _titleService.title_page;
        this.changeMyTitle(); //Update Title

        //ReSize event
        window.onresize = (e) => {
            ngZone.run(() => {
                this.get_size();
            });
        };
    } //Close constructor

    changeMyTitle() {
        this._titleService.change('Agencies');
        console.log('User Title: ' + this._titleService.title_page);
    }

    ngOnInit(): void {
      if ( this.location.path() == '/app/customers/list-agencies') {
        this.restartFilter();
      }

      if (this.location.path().indexOf(";") != -1 ) {
          this.myUrl = this.location.path().slice(0,this.location.path().indexOf(";"));
      } else {
          this.myUrl = this.location.path();
      }

    /*if ( this.params.get('number_of_page')  && parseInt(this.params.get('number_of_page')) != 0 ) {
          var letter = this._service.search_map_agencies; //Store letter
          setTimeout(()=>{
              this._service.get_list_agencies({ page : this.params.get('number_of_page') })
              .map(data => 
              {    
                  this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
               //   this.pag.pagination_mappings({ event:'search', last_page: this._data_pagination.last_page, firstof_page:1 });
              })
                  .subscribe();
          } , 1000);
      } else {
          setTimeout(()=>{
            this._service.get_list_agencies({ page : 1})
            .map(data => 
            {  
                if ( data.total_page > 0 ) {
                  this._filter_service.showPaginationFilter = true;
                }
                setTimeout(()=>{
                  this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
             //   this.pag.pagination_mappings({ event:'search', last_page: this._data_pagination.last_page, firstof_page:1 });
                } , 250);
            })
                .subscribe(); //Call t
          } , 500);
      }
      */
        if ( !this.params.get('number_of_page') ) {
          setTimeout(()=>{
            this._service.get_list_agencies({ page : 1})
            .map(data => {  
                this._filter_service.showPaginationFilter = true;
                setTimeout(()=>{
                  if ( data.numbers_of_pages > 1 ) {
                      this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
                      //this.pag.pagination_mappings({ event:'search', last_page: this._data_pagination.last_page, firstof_page:1 });
                  } else {
                    this._filter_service.showPaginationFilter = false;
                  }
                } , 250);
            }).subscribe(); 
          } , 500);

        } else {
           setTimeout(()=>{
            this._service.get_list_agencies({ page : this.params.get('number_of_page')})
            .map(data => {  
              this._filter_service.showPaginationFilter = true;
              setTimeout(()=>{
                  if ( data.numbers_of_pages > 1 ) {
                      this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
                      //this.pag.pagination_mappings({ event:'search', last_page: this._data_pagination.last_page, firstof_page:1 });
                  } else {
                      this._filter_service.showPaginationFilter = false;
                  }
                } , 250);
            }).subscribe(); 
          } , 500);
        }

        // this.subscription = this._filter_service.notifyObservable$.subscribe((res) => {
        //    if ( res.total_page > 0 ) {
        //     this.myPag.pagination_mappings({ event:'search', _data_pagination: res });
        //   }  
        // });
  
       this.justchange = false;
        this.get_all_filters();
}


current_page_change(data){
      this._service.get_list_agencies( { page: data.selectedPage , type : data.type})
      .map(json_response =>
          this.myPag.pagination_mappings({
               event : 'select' ,
               _data_pagination : json_response
          })).subscribe(); 

    this.unselect_all();
    this._filters.number_of_page = data.selectedPage;
    var get_url = this._filters.create_url();
    this.location.go('/app/customers/list-agencies;'+ get_url);
   
    //this.location.go(this.myUrl+';cp='+data.selectedPage);
    //Acá ejecuta el request en forma de observable, primero hace get_mappings y sólo cuando termina de hacer ese método retorna para seguir haciendo lo que está dentro del .map que es el método pagination_mappings que está dentro del subcomponent   
}

restartFilter()  {
  this._modal_filters.refreshModalFilters();
  this.get_all_filters();
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


  //////////////////////////////////////////////
  /// Alocate div container of List Agencies ///
  if(viewport_width < 1200){
    this.view_port_width_list_agen = false;
  }else if(viewport_width > 1200) {
    this.view_port_width_list_agen = true;
  }
}

/////////////////////////////////////////////////////////////////////////////////////////
///                                      TRAVTION SEARCH                              ///
/////////////////////////////////////////////////////////////////////////////////////////
verify_filters(){
  console.log("EN FILLEEERSSSSS");
      /// Store parameters from URL ///
      var filter_by_agencies = this.params.get('search_type');
      var filter_status = this.params.get('status');
      var filter_name = this.params.get('name');
      var filter_tax_number = this.params.get('tax_number');
      var filter_email = this.params.get('email');
      var filter_phone_number = this.params.get('phone_number');
      var filter_city = this.params.get('city');
      var filter_state = this.params.get('state');
      var filter_country = this.params.get('country');
      var filter_address = this.params.get('address');
      var filter_zip = this.params.get('zip');
      var filter_has_bookings = this.params.get('has_bookings');
      var filter_created_from = this.params.get('date_created_from');
      var filter_created_to = this.params.get('date_created_to');
      var filter_order = this.params.get('order');
      this._filters.number_of_page = Number(this.params.get('number_of_page'));
      var boolean_asc;
      if(this.params.get('asc') != null){ //If params is not empty store boolean
         boolean_asc = (this.params.get('asc') === "true");
      }else if(this.params.get('asc') == null){ //If params is empty store true
         boolean_asc = true;
      }
      this._filters.asc = boolean_asc;
      //Ckeck if there is a parameter in URL
      if(filter_by_agencies !=null || filter_status !=null || filter_name !=null || filter_tax_number !=null ||
        filter_email !=null || filter_phone_number !=null || filter_city !=null || filter_state !=null ||
        filter_country !=null || filter_address !=null || filter_zip !=null || filter_has_bookings !=null ||
        filter_created_from !=null || filter_created_to !=null || filter_order !=null) {

          //Store parameters from url in model(filters.ts) properties
          this._filters.filter_by_agencies = filter_by_agencies;
          if(filter_status != ''){
            var filter_status_bool = (filter_status === "true");
            this._filters.status[0] = filter_status_bool;
            this._filter_service.filter_status_array[0] = filter_status_bool;
            console.log('STATUS88: ' + this._filter_service.filter_status_array);
          }
          if(filter_name != '') {
            this._filters.name = filter_name.toString().split(',');
            this._filter_service.filter_name_array = filter_name.toString().split(',');
          }
          if(filter_tax_number != '') {
            this._filters.tax_number=filter_tax_number.toString().split(',');
            this._filter_service.filter_tax_number_array=filter_tax_number.toString().split(',');
          }
          if(filter_email != '') {
            this._filters.email = filter_email.toString().split(',');
            this._filter_service.filter_email_array = filter_email.toString().split(',');
          }
          if(filter_phone_number != '') {
            this._filters.phone_number = filter_phone_number.toString().split(',');
            this._filter_service.filter_phone_number_array = filter_phone_number.toString().split(',');
         }
          if(filter_city != '') {
            this._filters.city = filter_city.toString().split(',');
            this._filter_service.filter_city_array = filter_city.toString().split(',');
          }
          if(filter_state != '') {
            this._filters.state = filter_state.toString().split(',');
            this._filter_service.filter_state_array = filter_state.toString().split(',');
          }
          if(filter_country != '') {
            this._filters.country = filter_country.toString().split(',');
            this._filter_service.filter_country_array= filter_country.toString().split(',');
          }
          if(filter_address != '') {
            this._filters.address = filter_address.toString().split(',');
            this._filter_service.filter_address_array = filter_address.toString().split(',');
          }
          if(filter_zip != '') {
            this._filters.zip = filter_zip.toString().split(',');
            this._filter_service.filter_zip_array = filter_zip.toString().split(',');
          }
          if(filter_has_bookings != ''){
            var filter_has_bookings_bool = (filter_has_bookings === "true");
            this._filters.has_bookings[0] = filter_has_bookings_bool;
            this._filter_service.filter_has_bookings_array[0] = filter_has_bookings_bool;
          }
          this._filters.date_created_from = filter_created_from;
          this._filters.date_created_to = filter_created_to;

          //Show other filters
          this.status = this._filters.status;
          this.name = this._filters.name;
          this.tax_number = this._filters.tax_number;
          this.email = this._filters.email;
          this.phone_number = this._filters.phone_number;
          this.city = this._filters.city;
          this.state = this._filters.state;
          this.country = this._filters.country;
          this.address = this._filters.address;
          this.zip = this._filters.zip;
          this.has_bookings = this._filters.has_bookings;
          this.date_created_from =  this._filters.date_created_from;
          this.date_created_to = this._filters.date_created_to; 
          // Fix NaN error
          if (String(this._filters.number_of_page).toLowerCase() == String(NaN).toLowerCase()) {
            this._filters.number_of_page = 1;
          }
          this.number_of_page = this._filters.number_of_page;
          this._filter_service.come_from_modal = false;
          this._modal_filters.search('no_filtering');
          /*this.search( //Call requets
            this._filters.filter_by_agencies, //Send search by Agencies to search method
            this._filters.date_created_from,
            this._filters.date_created_to,
            this._filters.order,
            this._filters.asc
          );
        } //Close if check*/
      /*else{ //Call request if first time and no params open List Agencies
         this.search('Agencies', '', '', '', '', 'creation_date', 'false');*/
      }

} //Close verify_filters method

///////////////////////////////////
/// Request Filters data ///
get_all_filters(){
  let url_get_filters = myGlobals.host+'/api/admin/customers/agency/get_filters';
  let headers = new Headers({ 'Content-Type': 'application/json' });

      this.http.get( url_get_filters, { headers: headers, withCredentials:true})
          .subscribe(
            response => {
              console.log('RESPUESTA ALL FILTERS:' + JSON.stringify(response.json()));
              this.response_filters = response.json().filters; //Local response
              this._filter_service.response_filters = this.response_filters; //Response for share to service(modalfilters.service.ts)

              this.verify_filters();
            }, error => {
          }
        );
  }

go_usersInAgency(idAgency, e, i) {
  e.preventDefault();
  this._filters.agency_detail_id_agencies = idAgency;
  //Create URL with params from model:(filter.ts)
  this._filters.replace_string(); //Change "/" to "-"

  this.router.navigate(['/App', 'AgencyDetail', {
      id: idAgency,
      status: this._filters.status,
      name: this._filters.name,
      tax_number: this._filters.tax_number,
      email: this._filters.email,
      phone_number: this._filters.phone_number,
      city: this._filters.city,
      state: this._filters.state,
      country: this._filters.country,
      address: this._filters.address,
      zip: this._filters.zip,
      has_bookings: this._filters.has_bookings,
      date_created_from:  this._filters.date_created_from,
      date_created_to: this._filters.date_created_to,
      order: this._filters.order,
      asc: this._filters.asc,
      number_of_page: this._filters.number_of_page,
      fromUserLink : 'y'
  }]);
  this._filters.undo_replace_string();  //Undo "/" to "-"
}

go_to_agency_detail(id_agency, event, i){
  this._filters.agency_detail_id_agencies = id_agency;

  switch (event.which) {
     case 1:
        event.preventDefault();
             
  //Create URL with params from model:(filter.ts)
  this._filters.replace_string(); //Change "/" to "-"

    this.router.navigate(['/App', 'AgencyDetail', {
        id: id_agency,
        status: this._filters.status,
        name: this._filters.name,
        tax_number: this._filters.tax_number,
        email: this._filters.email,
        phone_number: this._filters.phone_number,
        city: this._filters.city,
        state: this._filters.state,
        country: this._filters.country,
        address: this._filters.address,
        zip: this._filters.zip,
        has_bookings: this._filters.has_bookings,
        date_created_from:  this._filters.date_created_from,
        date_created_to: this._filters.date_created_to,
        order: this._filters.order,
        asc: this._filters.asc,
        number_of_page: this._filters.number_of_page,
        fromUserLink : 'n'
    }]);
    this._filters.undo_replace_string();  //Undo "/" to "-"

    break;
        case 2:
            event.preventDefault();
            $('#agency-opener' + i).attr("href", myGlobals.DOMAIN+this.currentLocation());
            $('#agency-opener' + i).trigger({
                type: 'mousedown',
                which: 3
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

////////////////////////////////////
///// FILTERS TRAVTION SEARCH //////
/// Open Modal from input Search ///
open_modal_filters_agencies(){
    this._filter_service.event_type = 'new';
    this.open_filters(ModalFiltersAgencies);
}

////////////////////////////
/// Open Filter By Modal ///
 open_filters(ModalFiltersAgencies){
      this.modal.alert()
      .size('propia')
      .isBlocking(true)
      .showClose(true)
      .keyboard(300)
      .component(ModalFiltersAgencies)
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
    this._filter_service[filter_pro].splice(i, 1);
    this._modal_filters.search('is_new_filtering'); //Call request with removed Pill filter
  }

////////////////////////////////////////////////
/// Icon Folder mouseover Table List Agencies ///
mouseover_icon_folder(i){
  /*var icon_agen = '#' + i + 'icon-agen';
  jQuery(icon_agen).show();*/
  var icon_agen = '#' + i + 'icon-agen';
  jQuery(icon_agen).addClass('hovered-folder-icon');
}

mouseleave_icon_folder(){
  /*jQuery('.fa-folder-open-o').hide();*/
  jQuery('.fa-folder-open-o').removeClass('hovered-folder-icon');
}

////////////////////////////////////////////////////
/// Select All (Checkbox) ///
select_all(){
    $('.check-table-agencies:checked').attr('checked', true);
    var inputs = jQuery('.check-table-agencies');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked");
        if(checked == false){
            $('#checkbox' + i).trigger('click');
        }
    }
}

////////////////////////////////////////////////////
/// Unselect All Checkboxs ///
unselect_all(){
    var inputs = jQuery('.check-table-agencies');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked");
        if(checked == true){
            $('#checkbox' + i).trigger('click');
        }
    }
}

////////////////////////////////////////////////////////////
/// Show icons Enabled/Disabled table External Providers ///
show_icons_list_agencies(){
  var inputs = jQuery('.check-table-agencies');
  var count_true = 0;
      for(var i=0; i<inputs.length; i++){
          var checked = $('#checkbox' + i).is(":checked");
          if(checked == true){
            count_true++; //Count checkbox checked
            this.show_icons_agencies = true;
          }
      }
      if(inputs.length == count_true){//If all inputs are check
          console.log('Estan todos seleccionados');
          this.show_icons_agencies = true;
      } else if(count_true == 0){ //If all inputs are unchecked
          console.log('Estan todos deseleccionados');
          this.show_icons_agencies = false;
      }
}

/////////////////////////////////////////////////
/// Select All: Change ckeckbox by icon-minus ///
change_to_minus(){
    var inputs = jQuery('.check-table-agencies');
    var count_true = 0;
        for(var i=0; i<inputs.length; i++){
            var checked = $('#checkbox' + i).is(":checked");
            if(checked == true){
              count_true++; //Count checkbox checked
            }
        }
        if(inputs.length == count_true){//If all inputs are check
            console.log('Estan todos seleccionados');
            this.justchange = true;
        } else if(count_true == 0){ //If all inputs are unchecked
            console.log('Estan todos deseleccionados');
            this.justchange= false;
        } else{ //If some input is unckeched
            this.justchange = 'minus';
        }
}

//////////////////////////////////////
/// Request export to excel //////////
export_to_excel(){
  let url = myGlobals.host+'/api/admin/customers/agency/export_to_excel';
    let body=JSON.stringify({ filters: JSON.stringify(this._filters) });
    console.log('Body del request del export_to_excel: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .subscribe(
        response => {
            this.excel_string = myGlobals.host+response.json().excel;
            var excel_name=response.json().excel_name;

            var uri = this.excel_string;
            window.open(uri, 'Download');
            
                console.log('Excel: '+this.excel_string);
        }, error => {}
    );
}

//////////////////////////////////////
/// Request icons enabled-disabled ///
enabled_disabled_toggles(id, status, selected_checkboxs){
    let url = myGlobals.host+'/api/admin/customers/agency/change_status';
    let body=JSON.stringify({ status: status, list_agencies_code: id });
    console.log('Body del request del enabled-disabled: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .map(
        resp => {
            this._service.get_list_agencies({page : this._service.current_page })
            .subscribe((json_response) => {
                console.log('Se habilita o inhabilita el checkbox')
            }, (err) => console.error(err),() =>
                this.caught_selected_inputs(selected_checkboxs));
                return this._service.list_id; //Send back response to the call of the method to use as event_type variable
        }, error => {}
    );
} //Close enabled_disabled_toggles

/////////////////////////////////////////////////////////////////////
/// Icons enabled-disables single of each checkboxes of the table ///
enabled_disabled_toogle(status, id){
    this._service.list_id = []; //Clean array
    this._service.list_id.push(id);
    var single_id = this._service.list_id;
    this._service.list_id = []; //Clean array
    var inputs = jQuery('.check-table-agencies');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked");
        if(checked == true){
            var id_content = $('#checkbox' + i).val();
            this._service.list_id.push(id_content);
        }
    }
    console.log('Array de id agencies: ' + this._service.list_id);
    this.enabled_disabled_toggles(single_id, status, this._service.list_id)
    .map(json_response =>
        console.log('Individual')).subscribe(); //Call request function
    this.justchange = false;
}

///////////////////////////////////////////////////
/// Enabled/disabled toogle multiple checkboxes ///
enabled_disabled_all(){
    this._service.toggle_status = !this._service.toggle_status; //If true change to false, If false change to true boolean
    var status = !this._service.toggle_status;
    this._service.list_id = []; //Clean array
    var inputs = jQuery('.check-table-agencies');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked");
        if(checked == true){
            var id_content = $('#checkbox' + i).val();
            this._service.list_id.push(id_content);
        }
    }
    console.log('Array de id Agencies' + this._service.list_id);
    var multiple_id = this._service.list_id;
    this.enabled_disabled_toggles(multiple_id, status, this._service.list_id)
    .map(json_response =>
        console.log('Todos')).subscribe(); //Call request function
    this.justchange = false;
} //Close enabled_disabled_all

////////////////////////////////////////////////////////////////////////////////
/// Verify all selected checkbox who were selected and restore the selection ///
 caught_selected_inputs(id){
    setTimeout(function(){
        var inputs = jQuery('.check-table-agencies');
        var id_content;
        for(var i=0; i<inputs.length; i++){
            id_content = $('#checkbox' + i).val();
            for(var x=0; x<id.length; x++){
                if(id_content == id[x]){
                    $('#checkbox' + i).trigger('click');
                    console.log('Checkbox número: #checkbox' + i);
                }
            }
        }
    }, 500)
} //Close caught_selected_inputs

edit_pill(pill, e, i){
  e.stopPropagation();
  this._filter_service.event_type = 'edit';
  this.open_filters(ModalFiltersAgencies);
  this._filter_service.edit_filter = pill; //Identify Pill is editing 
  this._filter_service.iteration = i;
}

//////////////////////////////////////////
/// OPEN AGENCY DETAIL WITH CTRL+CLICK ///
currentLocation(): string {
    console.log('/app/customers/list-agencies/agency-detail;id='+ this._filters.agency_detail_id_agencies+';' + this._filters.create_url());
    return '/app/customers/list-agencies/agency-detail;id='+ this._filters.agency_detail_id_agencies+';' + this._filters.create_url();
}

} //Close class Agencies
