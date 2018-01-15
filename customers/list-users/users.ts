import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, OnInit, NgZone, ViewChild , OnDestroy} from '@angular/core';
import {Widget } from '../../core/widget/widget';
import {RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {Idle, DEFAULT_INTERRUPTSOURCES} from 'ng2-idle/core'; //For timeout
import {DialogRef} from 'angular2-modal';
import {Observable} from 'rxjs/Observable';
import {CustomHttp} from '../../services/http-wrapper';
import myGlobals = require('../../../app');
import {NgClass} from '@angular/common';
import {Modal, BS_MODAL_PROVIDERS as MODAL_P} from 'angular2-modal/plugins/bootstrap'; //Modal
import {Core} from '../../core/core';
import {Location} from '@angular/common';
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';
import {filter} from "../../bworkspace/filter"; //Esto no va, es de los filtros del BW aTT: fERNANDA
import {filtersUser} from "../filtersUsers"; 
import {filters} from '../filters'; //Model Filters agencies list
import {RolloverAutocompletes} from '../../customers/rollovers-dropdown.service';
import {ModalFiltersUsers} from '../modalfiltersUsers/modal_filters'; //modal_filters.ts
import {DataPropertiesListUsers} from './data_properties.service';
import {editUserDetail} from '../list-users/user-detail/inline-user/edit_form_users.service'; //Inline Editing List Users
import {TitleService} from '../../core/navbar/titles.service';
import {myPagination} from '../../settings/pagination-mappings/pagination.subcomponent';
import {DataPagination} from '../../settings/pagination-mappings/data_pagination.service';
import {pathName} from '../../../app/core/sidebar/path_name.service'; 
import {ModalFiltersServiceUsers} from '../modalfiltersUsers/modalfilters.service'; //Service

declare var jQuery: any;
declare var $: any;

//////////////////
/// List Users ///
@Component({
  selector: '[users]',
  template: require('./users.html'),
  styles: [require('./users.scss')],
  directives: [ROUTER_DIRECTIVES, [Widget], [myPagination]],
  providers: [MODAL_P, Modal, ModalFiltersUsers, DataPagination, editUserDetail]
})

export class Users {

    //Title page
    public elementRef;
    title_page: any;
    checked = false; //Select All
    justchange: any; //just change icon to normal checkbox
    id:any;

    //Modal Filters Travtion Search
    response_filters; //Response all Filters
    number_of_page: number; //filter parameter
    status: any[];
    name: string[];
    surname: string[];
    agency: any[];
    email: any[];
    phone_number: any[];
    city: any[];
    state: string[];
    country: string[];
    address: string[];
    zip: string[];
    has_bookings: any[];
    order: any;

    //Control width of screens
    view_port_width_list_users = true;

    show_icons_users = false;
    disabled_age = false; //It's enabled
    selected_ag= [];

    //Export to excel
    excel_string: string;
    // General purpose
    myUrl : string;
    filterPend : boolean = true;
    @ViewChild('pagination') myPag;
    showPagination: boolean;
      searchBox = [];
      searchLetters = [];
      debouncedInput = [];
      subscribe = [];
      clicky:any;
    constructor(
     public _filter_service: ModalFiltersServiceUsers, 
     public _filters: filtersUser, 
     public _filters_agencies: filters, 
     // public _data_pagination: DataPagination,
     public pag: myPagination,
     public http: Http,
     public params: RouteParams,
     public router: Router, 
     public _titleService: TitleService,
     public modal: Modal, 
     public load: LoadingGif, 
     viewContainer: ViewContainerRef, 
     public location: Location, 
     myElement: ElementRef, 
     public _rol: RolloverAutocompletes, 
     // public _path_name: pathName, 
     private ngZone: NgZone, 
     public _modal_filters: ModalFiltersUsers, 
     public _service: DataPropertiesListUsers, 
     public _edit_users: editUserDetail, 
     public _b_filters: filter
     ) {
    modal.defaultViewContainer = viewContainer; //Modal
        ////////////////////////////////////////////////////////////
        /// Call ngOnInit again after click on sidebar item menu ///
        // this._path_name.reload_component.subscribe((name_of_item_menu) => {     
        //       alert(name_of_item_menu);
        //       this.ngOnInit();
        //       //this.showPagination = true;        
        // });  

        //Store imported Title in local title
        this.title_page = _titleService.title_page;
        this.changeMyTitle(); //Update Title
        this.elementRef = myElement; //Autocomplete

        //ReSize event
        window.onresize = (e) => {
            ngZone.run(() => {
                this.get_size();
            });
        };
    } //Close constructor

    changeMyTitle() {
        this._titleService.change('Users');
        console.log('User Title: ' + this._titleService.title_page);
    }

    ngOnInit(){
      this.recursive_hide();
      
      this.justchange = false; 
      this.justchange = false; 
      this._edit_users.remove_message_agency();
      this._edit_users.remove_message_city();
      this._edit_users.remove_autocomplete();

      if ( this.location.path() == '/app/customers/list-users/users') {
        this.restartFilter();
      } else {
        this.get_all_filters();   
      }

      if (this.location.path().indexOf(";") != -1 ) {
          this.myUrl = this.location.path().slice(0,this.location.path().indexOf(";"));
      } else {
          this.myUrl = this.location.path();
      }

        var filter_by_users = this.params.get('search_type');
        $('[data-toggle="tooltip"]').tooltip();
       if ( this.params.get('number_of_page') != 'NaN'  && this.params.get('number_of_page')  != 'undefined'
               && this.params.get('number_of_page') != '0'  && this.params.get('number_of_page') != 'null' ) {
          setTimeout(()=>{
            if ( this.params.get('number_of_page') != undefined ) {
              this.number_of_page = Number(this.params.get('number_of_page'));
            } else {
              this.number_of_page = 1;
            }
              this._service.get_list_users({ page : this.number_of_page })
              .map(data => {  
                      this._filter_service.showPaginationFilter = true;
                  setTimeout(()=>{
                    if ( data.numbers_of_pages > 1 ) {
                        this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
                    } else {
                      this._filter_service.showPaginationFilter = false;
                    }
                  } , 1500 );
                  // this.hide_detail();
                  //this.pag.pagination_mappings({ event:'search', last_page: this._data_pagination.last_page, firstof_page:1 });
              })
                  .subscribe();
          });
      } else {
            this._service.get_list_users({ page : 1 })
              .map(data => {
                      this._filter_service.showPaginationFilter = true;
                      // this.hide_detail();
                  setTimeout(()=>{
                    if ( data.numbers_of_pages > 1 ) {
                      this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
                    } else {
                        this._filter_service.showPaginationFilter = false;
                      }
                  } , 2000 );
              })
              .subscribe(); 
      }

        this.id = this.params.get('id'); //This is ID of agency(not id_user)
        console.log('params get id: ' + this.id);

        // this.get_all_filters();


        const searchBox1 = document.getElementById('city-user-new');
        const searchLetters1 = Observable
          .fromEvent(searchBox1, 'keyup');
        const debouncedInput1 = searchLetters1.debounceTime(650);
        const subscribe1 = debouncedInput1.subscribe((event: any ) => {
          this.filter_city_name(this._edit_users.relation_name_new_users, 'new-user', '', event);
          // this._edit_agencies.filter_city_name_click(this._edit_agencies.relation_name, 'agency', '', event);
          // this.filter_city_name(this._edit_agencies.relation_name, 'agency', '', event)
        });
        //Subscribe All request User Detail service edit_form_users.service.ts
        //this._edit_users.get_data_users(this.id, 0).map(json_response => this.hide_detail()).subscribe();  
   

        $(document).mousedown((e) => {
        this.clicky = $(e.target);
        console.log($(e.target));
            if ( this.clicky[0].nodeName.toLowerCase() == 'li' || this.clicky[0].nodeName.toLowerCase() == 'a' ) {
            } else {
                this._edit_users.filteredListCityUser = [];
            }
        });
        $(document).mouseup((e) => {
            this.clicky = null;
        });

    } //Close ngOnInit



current_page_change(data){
      this._service.get_list_users({ page: data.selectedPage , type : data.type})
        .map(json_response =>
            this.myPag.pagination_mappings({
                 event : 'select' ,
                 _data_pagination : json_response
            }))
        .subscribe(); 
      this.unselect_all();
      this._filters.number_of_page = data.selectedPage;
      var get_url = this._filters.create_url();
      this.location.go('/app/customers/list-users/users;'+ get_url);

      // this.location.go(this.myUrl+';cp='+data.selectedPage);
    //Acá ejecuta el request en forma de observable, primero hace get_mappings y sólo cuando termina de hacer ese método retorna para seguir haciendo lo que está dentro del .map que es el método pagination_mappings que está dentro del subcomponent   
}

recursive_hide() {
    if ( this._service.list_users != undefined ) { 
        this.hide_detail();
    } else {
        setTimeout(()=>{
            this.recursive_hide();
        }, 150);
    }
}

/// RESTAR FILTER ///
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
    this.view_port_width_list_users = true;
  }else if(viewport_width > 1200) {
    this.view_port_width_list_users = true;
  }
}


recursive_cityFunction(i){
   if ( this._service.list_users != undefined ){ 
        this.searchBox[i] = document.getElementById('city-user'+i);
        this.searchLetters[i] = Observable
        .fromEvent(this.searchBox[i], 'keyup');

         this.debouncedInput[i] = this.searchLetters[i].debounceTime(650);
         this.subscribe[i] = this.debouncedInput[i].subscribe((event: any ) => {
         this.filter_city_name(this._edit_users.relation_name_users[i] , 'users',i, event);
        });
    } else {
        setTimeout(()=>{
            this.recursive_cityFunction(i);
        } , 1000);
    }
}

blur_city(i) {
  jQuery('#city-user' + i).removeClass('border-errors');
  this._edit_users.field_city_user[i] = '';
}

blur_new_city(){
  jQuery('#city-user-new').removeClass('border-errors');
  this._edit_users.field_error_city = '';
}

/////////////////////////////////////////////////////////////////////////////////////////
///                                      TRAVTION SEARCH                              ///
/////////////////////////////////////////////////////////////////////////////////////////
verify_filters(){
      /// Store parameters from URL ///
      var filter_by_users = this.params.get('search_type');
      var filter_status = this.params.get('status');
      var filter_name = this.params.get('name');
      var filter_surname = this.params.get('surname');
      var filter_agency = this.params.get('agency');
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
      if(filter_by_users !=null || filter_status !=null || filter_name !=null || filter_agency !=null ||
        filter_email !=null || filter_phone_number !=null || filter_city !=null || filter_state !=null ||
        filter_country !=null || filter_address !=null || filter_zip !=null || filter_has_bookings !=null ||
        filter_created_from !=null || filter_created_to !=null || filter_order !=null) {

          //Store parameters from url in model(filters.ts) properties
          this._filters.filter_by_users = filter_by_users;
          if(filter_status != ''){
            // var filter_status_bool = (filter_status === "true");
            // this._filters.status[0] = filter_status_bool;
            // this._filter_service.filter_status_array[0] = filter_status_bool;
            // myGlobals.alertTravtion(this._filters.status[0]);
            this._filters.status[0] = filter_status.toString().split(',');
            this._filter_service.filter_status_array = filter_status.toString().split(',');
          }
          if(filter_name != '') {
            this._filters.name = filter_name.toString().split(',');
            this._filter_service.filter_name_array = filter_name.toString().split(',');
          }
          if(filter_surname != '') {
            this._filters.name = filter_surname.toString().split(',');
            this._filter_service.filter_surname_array = filter_surname.toString().split(',');
          }
          if(filter_agency != '') {
            this._filters.agency=filter_agency.toString().split(',');
            this._filter_service.filter_agency_array=filter_agency.toString().split(',');
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
          this.surname = this._filters.surname;
          this.agency = this._filters.agency;
          this.email = this._filters.email;
          this.phone_number = this._filters.phone_number;
          this.city = this._filters.city;
          this.state = this._filters.state;
          this.country = this._filters.country;
          this.address = this._filters.address;
          this.zip = this._filters.zip;
          this.has_bookings = this._filters.has_bookings;
          // this.date_created_from =  this._filters.date_created_from;
          // this.date_created_to = this._filters.date_created_to;
          this.number_of_page = this._filters.number_of_page;
          this._filter_service.come_from_modal = false;
          this._modal_filters.search('no_filtering');
      }

} //Close verify_filters method

///////////////////////////////////
/// Request Filters data ///
get_all_filters(){
  let url_get_filters = myGlobals.host+'/api/admin/customers/user/get_filters';
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

///////////////////////////////
/// FILTERS TRAVTION SEARCH ///
/// Open Modal input Search ///
open_modal_filters_users(){
    this._filter_service.event_type = 'new';
    this.open_filters(ModalFiltersUsers);
}

////////////////////////////
/// Open Filter By Modal ///
 open_filters(ModalFiltersUsers){
      this.modal.alert()
      .size('propia')
      .isBlocking(true)
      .showClose(true)
      .keyboard(300)
      .component(ModalFiltersUsers)
      .open().then(result => { result.result.then((result: any) => { alert(result) }, () => {}); });
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
    $('.pending i').css({'background-color':'#9f9f9f'});
    this._filter_service[filter_pro].splice(i, 1);
    this._modal_filters.search('is_new_filtering'); //Call request with removed Pill filter
  }

//////////////////////////////////////////////////
/////// Icon Ellipsis on Table List Users ///////
showEllipsisIcon(i){
    var withEllipsis = '#' + i + 'ellipsisIcon';
    /*jQuery(withEllipsis).show();*/
    jQuery(withEllipsis).addClass('hovered-ellipsis-icon');
}

/*hideEllipsisDropdown(i , e){
  var withEllipsis = '#' + i + 'ellipsisIcon';
  jQuery(withEllipsis).hide();
  if ( e.screenX != 0  ||  e.screenY  != 0 ) {
    jQuery('.prueba').removeClass('open');
    jQuery('.ellipsis-icon').removeClass('focused-ellipsis-icon');
  } else {
    jQuery(withEllipsis).css('display', 'inline-block')
    jQuery(withEllipsis).toggleClass('focused-ellipsis-icon');
    $(e.target)[0].children[10].childNodes[1].className = "ellipsis-wrapper open";
    // jQuery('.prueba').addClass('open');
    // this.showEllipsisIcon(i);
  }
}*/

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


////////////////////////////////////////////////////
////////////// Select All (Checkbox) //////////////
select_all(){
    $('.check-table-users:checked').attr('checked', true);
    var inputs = jQuery('.check-table-users');
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
    var inputs = jQuery('.check-table-users');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked");
        if(checked == true){
            $('#checkbox' + i).trigger('click');
        }
    }
}

////////////////////////////////////////////////////////////
/// Show icons Enabled/Disabled table External Providers ///
show_icons_list_users(){
    var inputs = jQuery('.check-table-users');
    var count_true = 0;
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked");
        if(checked == true){
            count_true++; //Count checkbox checked
            this.show_icons_users = true;
        }
    }
    if(inputs.length == count_true){//If all inputs are check
        console.log('Estan todos seleccionados');
        this.show_icons_users = true;
    } else if(count_true == 0){ //If all inputs are unchecked
        console.log('Estan todos deseleccionados');
        this.show_icons_users = false;
        this._service.general_toggle_status = 2;
    }
}

/////////////////////////////////////////////////
/// Select All: Change ckeckbox by icon-minus ///
change_to_minus(){
    var inputs = jQuery('.check-table-users');
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
  let url = myGlobals.host+'/api/admin/customers/user/export_to_excel';
    let body=JSON.stringify({ filters: JSON.stringify(this._service._filters) });
    console.log('Body del request del export_to_excel: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .subscribe(
        response => {
                this.excel_string = myGlobals.host+response.json().excel;
                var excel_name=response.json().excel_name;

                var uri = this.excel_string;
                window.open(uri);
               
                console.log('Excel: '+this.excel_string);
        }, error => {}
    );
}

//////////////////////////////////////
/// Request icons enabled-disabled ///
enabled_disabled_toggles(id, status, selected_checkboxs){
    let url = myGlobals.host+'/api/admin/customers/user/change_status';
    let body=JSON.stringify({ status: status, list_user_code: id });
    console.log('Body del request del enabled-disabled: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .map(
        response => {
            this._service.get_list_users({page : this._service.current_page})
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
enabled_disabled_toggle(status, id){
    var status;
    /*if (this._service.toggle_status == 1) {
        this._service.toggle_status = 2;
        status = 1;
    } else if (this._service.toggle_status == 2) {
        this._service.toggle_status = 3;
        status = 2;
    } else if(this._service.toggle_status == 3) {
        this._service.toggle_status = 1;
        status = 3;
    }*/
    /*if (this._service.toggle_status == 1) {
        this._service.toggle_status = 2;
        status = 2;
    } else if (this._service.toggle_status == 2) {
        this._service.toggle_status = 3;
        status = 3;
    } else if(this._service.toggle_status == 3) {
        this._service.toggle_status = 1;
        status = 1;
    }*/
    this._service.list_id = []; //Clean array
    this._service.list_id.push(id);
    var single_id = this._service.list_id;
    this._service.list_id = []; //Clean array
    var inputs = jQuery('.check-table-users');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked");
        if(checked == true){
            var id_content = $('#checkbox' + i).val();
            this._service.list_id.push(id_content);
        }
    }
    console.log('Array de id Users: ' + this._service.list_id);
    this.enabled_disabled_toggles(single_id, status, this._service.list_id)
    .map(json_response =>
        console.log('Individual')).subscribe(); //Call request function
    this.justchange = false;
}

///////////////////////////////////////////////////
/// Enabled/disabled toogle multiple checkboxes ///
enabled_disabled_all(){
    var status;
    if (this._service.general_toggle_status == 1) {
        this._service.general_toggle_status = 2;
        this._service.toggle_status = 2;
        //status = 1;
        status = 2;
    } else if (this._service.general_toggle_status == 2) {
        this._service.general_toggle_status = 3;
        this._service.toggle_status = 3;
        //status = 2;
        status = 3;
    } else if (this._service.general_toggle_status == 3) {
        this._service.general_toggle_status = 1;
        this._service.toggle_status = 1;
        //status = 3;
        status = 1;
    }
    this._service.list_id = []; //Clean array
    var inputs = jQuery('.check-table-users');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked");
        if(checked == true){
            var id_content = $('#checkbox' + i).val();
            this._service.list_id.push(id_content);
        }
    }
    console.log('Array de id Users' + this._service.list_id);
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
        var inputs = jQuery('.check-table-users');
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

///////////////////////////////////////
//////// Request delete users ////////
deleteUsers(id, selected_checkboxs){
    let url = myGlobals.host+'/api/admin/customers/user/delete';
    let body=JSON.stringify({ list_user_code: id });
    console.log('Body del request del delete users: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .map(
        response => {
            this._service.get_list_users({ page : this.number_of_page})
            .subscribe((json_response) => {
                console.log('Se habilita o inhabilita el checkbox')
            }, (err) => console.error(err),() =>
                this.caught_selected_inputs(selected_checkboxs));
                return this._service.list_id; //Send back response to the call of the method to use as event_type variable
        }, error => {}
    );
} //Close delete users

////////////////////////////////////////////////////////////////////
///////////////////////// Delete One User /////////////////////////
deleteUser(id){
    this._service.list_id = []; //Clean array
    this._service.list_id.push(id);
    var single_id = this._service.list_id;
    this._service.list_id = []; //Clean array
    var inputs = jQuery('.check-table-users');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked");
        if(checked == true){
            var id_content = $('#checkbox' + i).val();
            this._service.list_id.push(id_content);
        }
    }
    console.log('Array de id users: ' + this._service.list_id);
    this.deleteUsers(single_id, this._service.list_id)
    .map(json_response =>
        console.log('Individual')).subscribe(); //Call request function
    this.justchange = false;
}

///////////////////////////////////////////////////
//////////////// Delete All Users ////////////////
deleteUsersAll(){
    this._service.list_id = []; //Clean array
    var inputs = jQuery('.check-table-users');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked");
        if(checked == true){
            var id_content = $('#checkbox' + i).val();
            this._service.list_id.push(id_content);
        }
    }
    console.log('Array de id Users' + this._service.list_id);
    var multiple_id = this._service.list_id;
    this.deleteUsers(multiple_id, this._service.list_id)
    .map(json_response =>
        console.log('Todos')).subscribe(); //Call request function
    this.justchange = false;
    this.show_icons_users = false;
} //Close disableUsersAll

/////////////////////////////////////////////
/// Link User Bookings to filter Bookings ///
searchBookings(user){
    this._b_filters.filter_by_bookings_or_files = "Bookings";
    this._b_filters.number_of_page = 1;
    this._b_filters.passenger_name = [];
    this._b_filters.reservation_code_locator = [];
    this._b_filters.will_auto_cancel = [];
    this._b_filters.status = [];
    this._b_filters.service_type = [];
    this._b_filters.provider = [];
    this._b_filters.agency_user = user;
    this._b_filters.destination = [];
    var get_url = this._b_filters.create_url();
    // this.router.navigate(['/App', 'Bworkspace', get_url ]);
    window.location.href = '/#/app/bworkspace;' + get_url;
}

    //////////////////////////////////////////////////////////////////////////////////////
    /// Subscribe request NEW USER Agency Detail service edit_form_agencies.service.ts ///
    get_data_users_new(){
        this._edit_users.get_data_users_new().subscribe();
    }

    hide_detail(){
      for(var i=0; i<=this._service.count_users_data_table; i++){
          this._edit_users.remove_class[i] = true;
      }
    }

    /////////////////////////////////////////////////////////
    /// Request Autocomplete inline City with event click ///
    filter_city_name_click(city_name, handlerEvent , i, e) {
        this._edit_users.filter_city_name_click(city_name, handlerEvent , i, e);
    }

    /////////////////////////////////////////////////////////
    /// User detail: Request Autocomplete inline Agency with event click ///
    filter_agency_name_click(agency_name, handlerEvent , i, e) {
        this._edit_users.filter_agency_name_click(agency_name, handlerEvent , i, e);
    }

    /////////////////////////////////////////////////////////
    /// Request Autocomplete inline City with event keyup ///
    filter_city_name(city_name, handlerEvent, i, e) {
        this._edit_users.filter_city_name(city_name, handlerEvent, i, e);
    }

    ////////////////////////////////////////////////////////////////////////
    /// User detail: Request Autocomplete inline Agency with event keyup ///
    filter_agency_name(city_name, handlerEvent, i, e) {
        this._edit_users.filter_agency_name(city_name, handlerEvent, i, e);
    }

    //////////////////////////////////////////////////////////////
    /// User detail: Select autocomplete Agency for user exist ///
    select_agency(item, code, handleEvent){
      this._edit_users.select_agency(item, code, handleEvent);
    }
    remove_autocomplete(){
      this._edit_users.remove_autocomplete();
    }
    show_form_create_new_agency(i, user){
      this._edit_users.show_form_create_new_agency(i, user);
    }
    hide_form_create_new_agency(i, user){
      this._edit_users.hide_form_create_new_agency(i, user);
    }

    ////////////////////////////
    /// Select city form user///
    select_city_user(i, item, code){
        this._edit_users.select_city_user(i, item, code);
    }

    ///////////////////////////////
    /// Select Agency form user ///
    select_agency_user(i, item, code){
        this._edit_users.select_agency_user(i, item, code);
    }

    editing_language(){
        this._edit_users.editing_language();
    }

    // Select Language form user Exist
    select_language(language_name, language_code, i){
        this._edit_users.select_language(language_name, language_code, i);
    }

    // Select Language form New user
    select_language_new_user(language_name, language_code){
        this._edit_users.select_language_new_user(language_name, language_code);
    }
   
    /////////////////////////////////////
    /// Request SAVE: Form USER EXIST ///
    save_form_users(send_mail, i){
        this._edit_users.save_form_users(send_mail, i);
    }

    ////////////////////////////////////
    /// Request SAVE: Form NEW USER ///
    save_form_new_user(send_mail){
        this._edit_users.save_form_new_user(send_mail);
    }

    /////////////////////////////////////////////////////////////////////
    /// RADIO BUTTONS Request SAVE: Change State TABLE USERS EXISTING ///
    change_state_is_admin(status, i){
        this._edit_users.change_state_is_admin(status, i);
    }
    change_state_is_comissionable(status, i){
        this._edit_users.change_state_is_comissionable(status, i);
    }
    change_state_user_access(status, i){
      this._edit_users.change_state_user_access(status, i);
    }

    ////////////////////////////////////////////////////////////////
    /// RADIO BUTTONS Request SAVE: Change State TABLE USERS NEW ///
    change_state_is_admin_new_user(status){
        this._edit_users.change_state_is_admin_new_user(status);
    }
    change_state_is_comissionable_new_user(status){
        this._edit_users.change_state_is_comissionable_new_user(status);
    }
    change_state_user_access_new_user(status){
      this._edit_users.change_state_user_access_new_user(status);
    }

    ////////////////////////////////////////////////////////
    /// VALIDATION FIELD E-MAIL: FORM USER AND NEW USERS ///
    keyup_field_email_agency(forms, i){
      this._edit_users.keyup_field_email_agency(forms, i);
    }

    //////////////////////////////////////
    /// Checkboxs status USER EXISTING ///
    change_checkbox(i){
        this._edit_users.never_disable_data_form[i] = !this._edit_users.never_disable_data_form[i];
    }

    /////////////////////////////////
    /// Checkboxs status NEW USER ///
    change_checkbox_new(){
        this._edit_users.never_disable_new_user = !this._edit_users.never_disable_new_user;
        console.log(this._edit_users.never_disable_new_user);
    }

    ///////////////////////////////////////////////////////////////
    /// Button cancel Section USERS EXIST ///
    cancel_edit_form_user(i){
        this._edit_users.cancel_edit_form_user(i);
        console.log('cancel_user: ' + i);
        this._edit_users.remove_class[i] = true;
    }

    ///////////////////////////////////////////////////////////////
    /// Button cancel Section NEW USER ///
    cancel_edit_form_new_user(first_name, middle_name, last_name, email, office_phone, mobile_phone, address, city_code, zip, password, agency_code, is_admin, is_comissionable, user_access, never_disable, language){
        this._edit_users.cancel_edit_form_new_user(first_name, middle_name, last_name, email, office_phone, mobile_phone, address, city_code, zip, password, agency_code, is_admin, is_comissionable, user_access, never_disable, language);
        //this._edit_agencies.remove_class[i] = true;
    }

    ///////////////////////////////////////////
    /// Get data Request Form: Users Exist  ///
    get_data_users_form(id, i){
        this._edit_users.get_data_users_form(id, i)
        .map( resp => {
          this.recursive_cityFunction(i);
        }).subscribe();
        //this.show_user_detail(i);
        this._edit_users.remove_class[i] = false;
    }

    /////////////////////////////////////////
    /// OPEN ACTIVITY LOG WITH CTRL+CLICK ///
    currentLocation_act(id, i, title): string {
      console.log('/app/customers/list-users/user-activity-log;id=' + id +';name=' + title + ';cp=1');
      return '/app/customers/list-users/user-activity-log;id=' + id +';name=' + title + ';cp=1';
    }

    ////////////////////////////////////////////////////
    /// Go Activity Logs after click Option ellipsis ///
    go_to_activity_logs(id, i, name, lastname, event){
      var title = name + ' ' + lastname;

    switch (event.which) {
      case 1:
      event.preventDefault();

      this.router.navigate(['/App', 'UserActivityLog', {
        //list_come_from: 'bw',
        id: id,
        name: title,
        cp: 1
      }]);

      break;
        case 2:
            event.preventDefault();
            $('#activity-opener' + i).attr("href", myGlobals.DOMAIN+this.currentLocation_act(id, i, title));
            $('#activity-opener' + i).trigger({
                type: 'mousedown',
                which: 2
            });
            break;
        case 3:
            $('#activity-opener' + i).attr("href", myGlobals.DOMAIN+this.currentLocation_act(id, i, title));
            $('#activity-opener' + i).trigger({
                type: 'mousedown',
                which: 3
            });
            break;
        } //Close switch
    }

    show_user_detail(i){ //Esta función es sólo para hacer los radios buttons del form de user, agregar después al nuevo request
        this._edit_users.is_admin_data_form[i] = this._edit_users.user_detail[i].is_admin_data_form;
        this._edit_users.is_comissionable_data_form[i] = this._edit_users.user_detail[i].is_comissionable_data_form;
        this._edit_users.user_access_data_form[i] = this._edit_users.user_detail[i].user_access_data_form;
        this._edit_users.remove_class[i] = false;
    }

    //////////////////////////////////////////////////////
    /// Method Blur for all First section: Form Agency ///
    blur_name(){
        jQuery('#name').removeClass('border-errors');
        jQuery('#email').removeClass('border-errors');
        jQuery('.first-name, .last-name, .new-agency-name, .tax-number').removeClass('border-errors'); //Table Exist Users
        jQuery('.first-name-new, .last-name-new, .new-agency-name-new-user, .tax-number-new-user').removeClass('border-errors'); //Table New User
    }
    focus_name() {
        jQuery('#name').removeClass('border-errors');
        this._edit_users.message_name = '';
        this._edit_users.field_error = [];
    }
    focus_email(){
        jQuery('#email').removeClass('border-errors');
        this._edit_users.message_email = '';
        this._edit_users.field_error = []; //Hide message error
    }
    focus_city(){
        jQuery('#city').removeClass('border-errors');
        this._edit_users.message_city = '';
        this._edit_users.message_city = ''; //Hide message error
    }
   
    /////////////////////////////////////////////////
    /// Method Focus for all SECTION: Table Users ///
    focus_users(i) {
        jQuery('.first-name, .last-name, .new-agency-name, .tax-number').removeClass('border-errors'); //Table Users
        //Hide message errors
        this._edit_users.message_name = '';
        this._edit_users.field_error_first_name = '';
        this._edit_users.field_error_last_name = '';
        this._edit_users.field_error_email = ''; 
    }

    ////////////////////////////////////////////////////
    /// Method Focus for all SECTION: Table New User ///
    focus_new_user() {
        jQuery('.first-name-new, .last-name-new, .password-new, .new-agency-name-new-user, .tax-number-new-user').removeClass('border-errors'); //Form New User
        //Hide message errors
        this._edit_users.message_name_new_user = '';  
        this._edit_users.message_last_name_new_user = '';  
        this._edit_users.message_email_new_user = ''; 
        this._edit_users.message_pass_new_user = '';  
        this._edit_users.error_first_name_new_user = '';
        this._edit_users.error_last_name_new_user = '';
        this._edit_users.error_email_new_user = '';
        this._edit_users.error_password_new_user = '';
    }

    //////////////////////////////////////////////////
    /// Service Rollover Automcomplete or Dropdown ///
    mouseover_color_text(text){
        this._rol.mouseover_color_text(text);
    }
    mouseleave_color_text(text){
        this._rol.mouseleave_color_text(text);
    }

    edit_pill(pill, e, i){
      e.stopPropagation();
      this._filter_service.event_type = 'edit';
      this.open_filters(ModalFiltersUsers);
      this._filter_service.edit_filter = pill; //Identify Pill is editing 
      this._filter_service.iteration = i;
    }

    filterPendings(){
      if ( this.filterPend == true ) {
        this._modal_filters.save_status(3);
        this.filterPend = false;
        $('.pending i').css({'background-color':'#D81B60'});
      } else if (  this.filterPend == false ) {
        $("#closePending").click();
        $('.pending i').css({'background-color':'#9f9f9f'});
        this.filterPend = true;
      }
    }


    forgedSession(userCode) {
      this._edit_users.post_forgedSession(userCode)
      .map( data => {
        window.open('https'+data, '_blank');
      }).subscribe();
    }


  ////////////////////////////////////////////
  /// OPEN AGENCY DETAIL WITH CTRL + CLICK ///
  currentLocation(): string {
      console.log('/app/customers/list-agencies/agency-detail;list_come_from=right_click;id='+ this._filters_agencies.agency_detail_id_agencies+';' + this._filters_agencies.create_url());
      return '/app/customers/list-agencies/agency-detail;list_come_from=right_click;id='+ this._filters_agencies.agency_detail_id_agencies+';' + this._filters_agencies.create_url();
  }

  //////////////////////////////////////////////////////// 
  /// Go to agency detail after click agency name link ///
  go_to_agency_detail(id_agency, event, i){
  this._filters_agencies.agency_detail_id_agencies = id_agency;

  switch (event.which) {
     case 1:
        event.preventDefault();
             
  //Create URL with params from model:(filter.ts)
  this._filters_agencies.replace_string(); //Change "/" to "-"

    this.router.navigate(['/App', 'AgencyDetail', {
        list_come_from: 'users',
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
        number_of_page: this._filters_agencies.number_of_page
    }]);
    this._filters_agencies.undo_replace_string();  //Undo "/" to "-"

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

} //Close class Users