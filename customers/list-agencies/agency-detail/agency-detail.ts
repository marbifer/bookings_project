import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, NgZone , AfterViewInit} from '@angular/core';
import {Widget} from '../../../core/widget/widget';
import {RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import { Idle, DEFAULT_INTERRUPTSOURCES } from 'ng2-idle/core'; //For timeout
import { DialogRef } from 'angular2-modal';
import {Observable} from 'rxjs/Observable';
import {CustomHttp} from '../../../services/http-wrapper';
//import {NKDatetime} from 'ng2-datetime/ng2-datetime'; //Datepicker
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NgClass} from '@angular/common';
import { Modal, BS_MODAL_PROVIDERS as MODAL_P } from 'angular2-modal/plugins/bootstrap'; //Modal
import {Core} from '../../../core/core';
import { Location } from '@angular/common';
import myGlobals = require('../../../../app');
import {LoadingGif} from '../../../bworkspace/filedetail/loading_gif.service';
import {RolloverAutocompletes} from '../../../customers/rollovers-dropdown.service';
import {DataPropertiesListAgencies} from '../../list-agencies/data_properties.service';
import {editAgencyDetail} from '../../list-agencies/agency-detail/inline-agencies/edit_form_agencies.service'; //Inline Editing Agency Detail
import {ModalFiltersServiceAgencies} from '../../modalfilters/modalfilters.service'; //Service
import {TitleService} from '../../../core/navbar/titles.service';
import {filters} from '../../filters'; //Filters Agencies
import {filtersUser} from "../../filtersUsers"; //Filters Users
import {filter as filters_book} from '../../../bworkspace/filter';
import {DataPagination} from '../../../settings/pagination-mappings/data_pagination.service';

declare var jQuery: any;
declare var $: any;
export var filter: string="";

@Component({
  selector: '[agency-detail]',
  template: require('./agency-detail.html'),
  //encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, [NgClass], /*NKDatetime,*/ [Widget]],
  styles: [require('./agency-detail.scss')],
  providers:[ MODAL_P, Modal]
})

export class AgencyDetail {

    current_url = this._loc.path(); //Current Url
    public elementRef;
    title_page: any; //Title page
    checked = false; //Select Checkbox

    id:any;

    //Date-range and filter by Bookings or Files
    filter_by_agencies: string;
    date_created_from: string;
    date_created_to: string;

    //Modal Filters Travtion Search
    response_filters; //Response all Filters
    number_of_page: number; //filter parameter
    status: string[];
    name: string[];
    tax_number: any[];
    email: any[];
    phone_number: any[];
    city: any[];
    state: string[];
    country: string[];
    address: string[];
    zip: string[];
    has_bookings: string[];

    //Control width of screens
    view_port_width_book = true;
    it_come_from: any; //Indicate if user comes from cliking agency name

    constructor( 
      public _data_pagination: DataPagination, 
      public http: Http, 
      public params: RouteParams, 
      public router: Router, 
      private ngZone: NgZone, 
      myElement: ElementRef,
      public modal: Modal, 
      viewContainer: ViewContainerRef, 
      public _edit_agencies: editAgencyDetail, 
      public _filter_service: ModalFiltersServiceAgencies,
      public _titleService: TitleService, 
      public _loc: Location, 
      public load: LoadingGif, 
      public _rol: RolloverAutocompletes, 
      public _filters: filters, 
      public fil_book: filters_book ,
      public _filter_user: filtersUser 
    ) { 
        //Store imported Title in local title
        this.title_page = _titleService.title_page;
        this.changeMyTitle(); //Update Title
        this.elementRef = myElement; //Autocomplete
    } //Close constructor

    changeMyTitle() {
        this._titleService.change('Agencies');
        console.log('User Title: ' + this._titleService.title_page);
    }

    ngOnInit() {
      this._edit_agencies.remove_message_city();

      /////////////////////////////////////////////
      /// Open component at the top of the page ///
      $('html, body').animate({
        scrollTop: $("#scrollToHere").offset().top
      }, 0);

        this.id = this.params.get('id'); //This is ID of agency(not id_user)
        console.log('params get id: ' + this.id);
        this.get_all_filters();
        
        //Subscribe All request Agency Detail service edit_form_agencies.service.ts
        this._edit_agencies.get_data_agency_detail(this.id).subscribe();
        this._edit_agencies.get_data_ext_providers(this.id).subscribe();
        this._edit_agencies.get_data_not_rules(this.id).subscribe();
        this._edit_agencies.get_data_price_rules(this.id).subscribe();
        this._edit_agencies.get_data_users(this.id, 0).map(json_response => this.hide_detail()).subscribe();
        this.it_come_from = this.params.get('list_come_from');

        const searchBox = document.getElementById('city');
        const searchLetters = Observable
          .fromEvent(searchBox, 'keyup');

        const debouncedInput = searchLetters.debounceTime(650);
        const subscribe = debouncedInput.subscribe((event: any ) => {
          this.filter_city_name(this._edit_agencies.relation_name, 'agency', '', event);
          // this._edit_agencies.filter_city_name_click(this._edit_agencies.relation_name, 'agency', '', event);
          // this.filter_city_name(this._edit_agencies.relation_name, 'agency', '', event)
        });
        this._edit_agencies.name = ''; //Clean typeName before load Data
    } //Close ngOnInit

ngAfterViewInit(){ 
  if ( this.params.get('fromUserLink') == 'y' ) {
    setTimeout(()=>{
     let goTo = $('#goUser').offset().top + 20;
      $("html, body").animate({scrollTop: goTo}, 1500, 'swing');
    }, 3150);
  }

   this._edit_agencies.empty_values(); //Clean inputs after click another open Agency Detail
}
    /////////////////////////////////////////////////////////////////////////////////////////
    ///                                      TRAVTION SEARCH                              ///
    /////////////////////////////////////////////////////////////////////////////////////////
    verify_filters(){
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
      var boolean_asc = (this.params.get('asc') === "true");
      this._filters.asc = boolean_asc;
      this._filters.asc = true; //Fix true as parameter

      //Ckeck if there is a parameter in URL
      if(filter_by_agencies !=null || filter_status !=null || filter_name !=null || filter_tax_number !=null ||
        filter_email !=null || filter_phone_number !=null || filter_city !=null || filter_state !=null ||
        filter_country !=null || filter_address !=null || filter_zip !=null || filter_has_bookings !=null ||
        filter_created_from !=null || filter_created_to !=null || filter_order !=null) {

          //Store parameters from url in model(filters.ts) properties
          this._filters.filter_by_agencies = filter_by_agencies;
          if(filter_status != '') {
            this._filters.status = filter_status.toString().split(',');
            this._filter_service.filter_status_array = filter_status.toString().split(',');
          }
          if(filter_name != '') {
            this._filters.name = filter_name.toString().split(',');
            this._filter_service.filter_name_array = filter_name.toString().split(',');
          }
          if(filter_tax_number != '') {
            this._filters.tax_number = filter_tax_number.toString().split(',');
            this._filter_service.filter_tax_number_array = filter_tax_number.toString().split(',');
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
            this._filter_service.filter_country_array = filter_country.toString().split(',');
          }
          if(filter_address != '') {
            this._filters.address = filter_address.toString().split(',');
            this._filter_service.filter_address_array = filter_address.toString().split(',');
          }
          if(filter_zip != '') {
            this._filters.zip = filter_zip.toString().split(',');
            this._filter_service.filter_zip_array = filter_zip.toString().split(',');
          }
          if(filter_has_bookings != '') {
            this._filters.has_bookings = filter_has_bookings.toString().split(',');
            this._filter_service.filter_has_bookings_array = filter_has_bookings.toString().split(',');
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
          this.number_of_page = this._data_pagination.current_page;
          //this.number_of_page = this._filters.number_of_page;
          this._filter_service.come_from_modal = false;

          //Store Data from Filters service to Filter object
          this._filters.name = this._filter_service.filter_name_array;
          this._filters.email = this._filter_service.filter_email_array;
          this._filters.phone_number = this._filter_service.filter_phone_number_array;
          this._filters.tax_number = this._filter_service.filter_tax_number_array;
          this._filters.address = this._filter_service.filter_address_array;
          this._filters.city = this._filter_service.filter_city_array;
          this._filters.state = this._filter_service.filter_state_array;
          this._filters.country = this._filter_service.filter_country_array;
          this._filters.zip = this._filter_service.filter_zip_array;
          this._filters.has_bookings = this._filter_service.filter_has_bookings_array;
          this._filters.status = this._filter_service.filter_status_array;
          this._filters.number_of_page = this.number_of_page;

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

    ////////////////////////////
    /// Request Filters data ///
    get_all_filters(){
        let url_get_filters = myGlobals.host+'/api/admin/customers/agency/get_filters';
        let headers = new Headers({ 'Content-Type': 'application/json' });

            this.http.get( url_get_filters, { headers: headers, withCredentials:true})
                .subscribe(
                    response => {
                    this.response_filters = response.json().filters; //Local response
                    this._filter_service.response_filters = this.response_filters; //Response for share to service(modalfilters.service.ts)
                    console.log('REQUEST ALL FILTERS:' + JSON.stringify(this.response_filters));
                    this.verify_filters();
                    }, error => {
                }
            );
    }

    //////////////////////////////////////////////////////////////////////////////////////
    /// Subscribe request NEW USER Agency Detail service edit_form_agencies.service.ts ///
    get_data_users_new(){
        this._edit_agencies.get_data_users_new().subscribe();
    }

    hide_detail(){
      for(var i=0; i<=this._edit_agencies.count_users_data_table; i++){
          this._edit_agencies.remove_class[i] = true;
      }
    }

    /////////////////////////////////////////////////////////
    /// Request Autocomplete inline City with event click ///
    filter_city_name_click(city_name, handlerEvent , i, e) {
        this._edit_agencies.filter_city_name_click(city_name, handlerEvent , i, e);
    }

    /////////////////////////////////////////////////////////
    /// Request Autocomplete inline City with event keyup ///
    filter_city_name(city_name, handlerEvent, i, e) {
        this._edit_agencies.filter_city_name(city_name, handlerEvent, i, e);
    }
    ///////////////////////////////////////////////////////
    /// Select First form Agency and search and Results ///
    select(item, code, handleEvent){
      this._edit_agencies.select(item, code, handleEvent);
    }
    remove_autocomplete(){
      this._edit_agencies.remove_autocomplete();
    }
    ////////////////////////////
    /// Select city form user///
    select_city_user(i, item, code){
        this._edit_agencies.select_city_user(i, item, code);
    }

    editing_language(){
        this._edit_agencies.editing_language();
    }

    // Select Language form user Exist
    select_language(language_name, language_code, i){
        this._edit_agencies.select_language(language_name, language_code, i);
    }

    // Select Language form New user
    select_language_new_user(language_name, language_code){
        this._edit_agencies.select_language_new_user(language_name, language_code);
    }

    //////////////////////////////////////////////////////////////////////
    /// Inline editing First form and Search and Results: Request SAVE ///
    save_agency_detail(send_mail){
        this._edit_agencies.save_agency_detail(send_mail);
    }
    ///////////////////////////////////////////////////////
    /// Button cancel First form and Search and Results ///
    cancel_edit_form_agency(i, name, name_legal, email, tax_number, phone_number, city_code, address, zip, license_number, cutoff_hotel_days, cutoff_attraction_days, cutoff_transfer_days, cutoff_car_days, cutoff_cruise_days, cutoff_flight_days, cutoff_package_days, cutoff_insurance_days, show_result_cutoff, how_handle_bookings_cutoff, status_avail_agency_cutoff, how_handle_available_bookings, credit, credit_used, credit_tolerance){
        this._edit_agencies.cancel_edit_form_agency(i, name, name_legal, email, tax_number, phone_number, city_code, address, zip, license_number, cutoff_hotel_days, cutoff_attraction_days, cutoff_transfer_days, cutoff_car_days, cutoff_cruise_days, cutoff_flight_days, cutoff_package_days, cutoff_insurance_days, show_result_cutoff, how_handle_bookings_cutoff, status_avail_agency_cutoff, how_handle_available_bookings, credit, credit_used, credit_tolerance);
    }

    //////////////////////////////////////////////////////////////////////////////////
    /// RADIO BUTTONS Request SAVE: Change State First form and Search and Results ///
    change_state_cutoff(status){
        this._edit_agencies.change_state_cutoff(status);
    }
    change_state_bookings(status){
        this._edit_agencies.change_state_bookings(status);
    }
    change_state_avaible_agency(status){
      this._edit_agencies.change_state_avaible_agency(status);
    }
    change_state_avaible_book(status){
      this._edit_agencies.change_state_avaible_book(status);
    }

    //////////////////////////////////////////////////////
    /// Request DELETE for SECTION: NOTIFICATION RULES ///
    delete_not_rules(code_not){
      this._edit_agencies.delete_not_rules(code_not);
    }
    //////////////////////////////////////////////////////
    /// Request DELETE for SECTION: NOTIFICATION RULES ///
    delete_price_rules(code_price){
      this._edit_agencies.delete_price_rules(code_price);
    }

    /////////////////////////////////////
    /// Request SAVE: Form USER EXIST ///
    save_form_users(send_mail, i){
        this._edit_agencies.save_form_users(send_mail, i);
    }

    ////////////////////////////////////
    /// Request SAVE: Form NEW USER ///
    save_form_new_user(send_mail){
        this._edit_agencies.save_form_new_user(send_mail);
    }

    /////////////////////////////////////////////////////////////////////
    /// RADIO BUTTONS Request SAVE: Change State TABLE USERS EXISTING ///
    change_state_is_admin(status, i){
        this._edit_agencies.change_state_is_admin(status, i);
    }
    change_state_is_comissionable(status, i){
        this._edit_agencies.change_state_is_comissionable(status, i);
    }
    change_state_user_access(status, i){
      this._edit_agencies.change_state_user_access(status, i);
    }

    ////////////////////////////////////////////////////////////////
    /// RADIO BUTTONS Request SAVE: Change State TABLE USERS NEW ///
    change_state_is_admin_new_user(status){
        this._edit_agencies.change_state_is_admin_new_user(status);
    }
    change_state_is_comissionable_new_user(status){
        this._edit_agencies.change_state_is_comissionable_new_user(status);
    }
    change_state_user_access_new_user(status){
      this._edit_agencies.change_state_user_access_new_user(status);
    }

    //////////////////////////////////////
    /// Checkboxs status USER EXISTING ///
    change_checkbox(i){
        this._edit_agencies.never_disable_data_form[i] = !this._edit_agencies.never_disable_data_form[i];
    }

    /////////////////////////////////
    /// Checkboxs status NEW USER ///
    change_checkbox_new(){
        this._edit_agencies.never_disable_new_user = !this._edit_agencies.never_disable_new_user;
        console.log(this._edit_agencies.never_disable_new_user);
    }

    /////////////////////////////////
    /// Checkboxs status NEW USER ///
    enabled_disabled_toggles(id, service, status, i, z, service_type_name){ //RECIBE
        this._edit_agencies.enabled_disabled_toggles(id, service, status, i, z, service_type_name); //LLAMADO- CALL
    }

    ///////////////////////////////////////////////////////////////
    /// Button cancel Section USERS EXIST ///
    cancel_edit_form_user(i, first_name, middle_name, last_name, email, office_phone, mobile_phone, address, city_code, zip, password, agency_code, is_admin, is_comissionable, user_access, never_disable, language){
        this._edit_agencies.cancel_edit_form_user(i, first_name, middle_name, last_name, email, office_phone, mobile_phone, address, city_code, zip, password, agency_code, is_admin, is_comissionable, user_access, never_disable, language);
        console.log('cancel_user: ' + i);
        this._edit_agencies.remove_class[i] = true;
    }

    ///////////////////////////////////////////////////////////////
    /// Button cancel Section NEW USER ///
    cancel_edit_form_new_user(first_name, middle_name, last_name, email, office_phone, mobile_phone, address, city_code, zip, password, agency_code, is_admin, is_comissionable, user_access, never_disable, language){
        this._edit_agencies.cancel_edit_form_new_user(first_name, middle_name, last_name, email, office_phone, mobile_phone, address, city_code, zip, password, agency_code, is_admin, is_comissionable, user_access, never_disable, language);
        //this._edit_agencies.remove_class[i] = true;
    }

    ///////////////////////////////////////////
    /// Get data Request Form: Users Exist  ///
    get_data_users_form(id, i){
        this._edit_agencies.get_data_users_form(id, i);
        //this.show_user_detail(i);
        this._edit_agencies.remove_class[i] = false;
    }
    show_user_detail(i){ // Esta función es sólo para hacer los radios buttons del form de user, agregar después al nuevo request
        this._edit_agencies.is_admin_data_form[i] = this._edit_agencies.user_detail[i].is_admin_data_form;
        this._edit_agencies.is_comissionable_data_form[i] = this._edit_agencies.user_detail[i].is_comissionable_data_form;
        this._edit_agencies.user_access_data_form[i] = this._edit_agencies.user_detail[i].user_access_data_form;
        this._edit_agencies.remove_class[i] = false;
    }
        

    //////////////////////////////////////////////////
    /////// Icon Ellipsis on Table List Users ///////
    showEllipsisIcon(i){
        var withEllipsis = '#' + i + 'ellipsisIcon';
        jQuery(withEllipsis).addClass('hovered-ellipsis-icon');
    }

    hideEllipsisIcon(){
        jQuery('#usersTable .ellipsis-wrapper').removeClass('open');
        jQuery('#usersTable .ellipsis').removeClass('focused-ellipsis-icon');
        jQuery('#usersTable .ellipsis').removeClass('hovered-ellipsis-icon');
    }

    focusEllipsis(i){
        var withEllipsis = '#' + i + 'ellipsisIcon';
        jQuery(withEllipsis).toggleClass('focused-ellipsis-icon');
    }

    removeOpenedEllipsis(i){
        var withEllipsis = '#' + i + 'ellipsisIcon';
        jQuery(withEllipsis).removeClass('focused-ellipsis-icon');
        jQuery('.ellipsis-wrapper').removeClass('open');
    }

    removeHoveredEllipsis(i){
        var withEllipsis = '#' + i + 'ellipsisIcon';
        jQuery(withEllipsis).removeClass('hovered-ellipsis-icon');
    }

    //////////////////////////////////////////////////////
    /// Method Blur for all First section: Form Agency ///
    blur_name(){
        //jQuery('#name').removeClass('border-errors');
        jQuery('#city').removeClass('border-errors');
        jQuery('#days-hotel, #attraction, #transfer, #car, #cruise, #flight, #package, #insurance').removeClass('border-errors');
        //jQuery('.first-name, .last-name, .credit-new, credit-used, .credit-tolerance').removeClass('border-errors'); //Table Exist Users
        //jQuery('.first-name-new, .last-name-new').removeClass('border-errors'); //Table New User
    }
    focus_name() {
        //jQuery('#name').removeClass('border-errors');
        //this._edit_agencies.message_name = '';
        //this._edit_agencies.field_error = [];
    }
    focus_email(){
        //this._edit_agencies.message_email = '';
        //this._edit_agencies.field_error = []; //Hide message error
    }
    focus_city(){
        jQuery('#city').removeClass('border-errors');
        this._edit_agencies.message_city = ''; //Hide message error
    }
    ///////////////////////////
    /// FOCUS CUT-OFFS DAYS ///
    focus_hotel(){
        jQuery('#days-hotel').removeClass('border-errors');
        this._edit_agencies.field_error_hotel = ''; //Hide message error field Hotel
        this._edit_agencies.message_cutoff_days_hotel = '';
    }
    focus_attrac(){
        jQuery('#attraction').removeClass('border-errors');
        this._edit_agencies.field_error_attrac = '';//Hide message error field Attraction
        this._edit_agencies.message_cutoff_days_attrac = '';
    }
    focus_transfer(){
        jQuery('#transfer').removeClass('border-errors');
        this._edit_agencies.field_error_transfer = ''; //Hide message error field Transfer
        this._edit_agencies.message_cutoff_days_transfer = '';
    }
    focus_car(){
        jQuery('#car').removeClass('border-errors');
        this._edit_agencies.field_error_car = ''; //Hide message error field Car
        this._edit_agencies.message_cutoff_days_car = '';
    }
    focus_cruise(){
        jQuery('#cruise').removeClass('border-errors');
        this._edit_agencies.field_error_cruise = ''; //Hide message error field Cruise
        this._edit_agencies.message_cutoff_days_cruise = '';
    }
    focus_flight(){
        jQuery('#flight').removeClass('border-errors');
        this._edit_agencies.field_error_flight = ''; //Hide message error field Flight
        this._edit_agencies.message_cutoff_days_flight = '';
    }
    focus_pack(){
        jQuery('#package').removeClass('border-errors');
        this._edit_agencies.field_error_pack = ''; //Hide message error field Package
        this._edit_agencies.message_cutoff_days_package = '';
    }
    focus_insurance(){
        jQuery('#insurance').removeClass('border-errors');
        this._edit_agencies.message_cutoff_days_insurance = '';
        this._edit_agencies.field_error_insurance = ''; //Hide message error field Insurance
    }
    ////////////////////////////
    /// FOCUS SECTION CREDIT ///
    focus_credit(){
        jQuery('#credit-new').removeClass('border-errors');
        this._edit_agencies.message_credit = ''; //Hide message error
    }
    focus_credit_used(){
        jQuery('#credit-used').removeClass('border-errors');
        this._edit_agencies.message_credit_used = ''; //Hide message error
    }
    focus_credit_tolerance(){
        jQuery('#credit-tolerance').removeClass('border-errors');
        this._edit_agencies.message_credit_tolerance = ''; //Hide message error
    }

    /////////////////////////////////////////////////
    /// Method Focus for all SECTION: Table Users ///
    focus_users(i) {
        /*jQuery('.first-name, .last-name').removeClass('border-errors'); //Table Users
        //Hide message errors
        this._edit_agencies.message_name = '';
        this._edit_agencies.field_error_first_name = '';
        this._edit_agencies.field_error_last_name = '';
        this._edit_agencies.field_error_email = '';*/
    }

    ////////////////////////////////////////////////////
    /// Method Focus for all SECTION: Table New User ///
    focus_new_user() {
        //jQuery('.first-name-new, .last-name-new, .password-new').removeClass('border-errors'); //Form New User
        //Hide message errors
        /*this._edit_agencies.message_last_name_new_user = '';
        this._edit_agencies.error_first_name_new_user = '';
        this._edit_agencies.error_last_name_new_user = '';
        this._edit_agencies.error_email_new_user = '';
        this._edit_agencies.error_password_new_user = '';*/
    }

    ////////////////////////////////////////////////////////////////////////////////
    /// Icon Pencil and Delete mouseover Table Not. Rules, Users and Price Rules ///
    mouseover_icons(i){
      jQuery(i).addClass('icon-pencil');
    }

    mouseleave_icons(){
      jQuery('.fa-pencil').removeClass('icon-pencil');
      jQuery('.fa-trash-o').removeClass('icon-pencil');
    }

    ///////////////////////////////////////////////////
    /// Button "Close" Agency Detail(List Agencies) ///
    close_agency_detail(){
        if(this.it_come_from == 'bw'){ //if comes from clicking agency name go to booking workspace         
          this.fil_book.replace_string(); //Change "/" to "-"
          var get_url = this.fil_book.create_url(); 
          //this.router.navigateByUrl('/app/bworkspace;'+ get_url);
          this._loc.go('/app/bworkspace;'+ get_url);
          window.location.reload();
          this.fil_book.undo_replace_string();  //Undo "/" to "-"               
        } else if(this.it_come_from == '' || this.it_come_from == undefined){ //Go to agency list
          console.log('number_of_page : ' + this._filters.number_of_page);
          //Go back to List Agencies with URL with params from model:(filters.ts)
          this._filters.replace_string(); //Change "/" to "-"
          var get_url = this._filters.create_url();
          //this.router.navigateByUrl('/app/customers/list-agencies;'+ get_url);
          console.log('/app/customers/list-agencies;' + get_url);
          this._loc.go('/app/customers/list-agencies;'+ get_url);
          window.location.reload();
          this._filters.undo_replace_string();  //Undo "/" to "-"
        } else if(this.it_come_from == 'users'){
          this._filter_user.replace_string(); //Change "/" to "-"
          var get_url = this._filter_user.create_url(); 
          this._filter_user.undo_replace_string();  //Undo "/" to "-"
          //this.router.navigateByUrl('/app/customers/list-users/users;'+ get_url);  
          this._loc.go('/app/customers/list-users/users;'+ get_url);
          window.location.reload();
        }
    }

    //////////////////////////////////////////////////
    /// Service Rollover Automcomplete or Dropdown ///
    mouseover_color_text(text){
        this._rol.mouseover_color_text(text);
    }
    mouseleave_color_text(text){
        this._rol.mouseleave_color_text(text);
    }

    /////////////////////////////////
    ///  NEW USER STATUS TOGGLES  ///
    enabled_disabled_toggles_users(status, id){ 
        this._edit_agencies.enabled_disabled_toggles_users(status, id); 
    }

    clean_field(){
      this._edit_agencies.clean_field();
    }

    /////////////////////////////////////////////////////////////////
    /// VALIDATION FIELD E-MAIL: FORM AGENCY, USERS AND NEW USERS ///
    keyup_field_email_agency(forms, i){
      this._edit_agencies.keyup_field_email_agency(forms, i);
    }

    ///////////////////////////////////////////////////
    /// VALIDATION SECTION CREDIT FIRST FORM AGENCY ///
    keyup_fields_credit(type){
      this._edit_agencies.keyup_fields_credit(type);
    }

} //Close class AgencyDetail
