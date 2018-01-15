import { Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, OnInit, NgZone, ViewChild, OnDestroy, Renderer } from '@angular/core';
import { Widget } from '../../core/widget/widget';
import { RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router } from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import { Idle, DEFAULT_INTERRUPTSOURCES } from 'ng2-idle/core'; //For timeout
import { DialogRef } from 'angular2-modal';
import { Observable } from 'rxjs/Observable';
import { CustomHttp } from '../../services/http-wrapper';
import myGlobals = require('../../../app');
import { ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { NgClass } from '@angular/common';
import { Modal, BS_MODAL_PROVIDERS as MODAL_P } from 'angular2-modal/plugins/bootstrap'; //Modal
import { Core } from '../../core/core';
import { Location } from '@angular/common';
import { LoadingGif } from '../../bworkspace/filedetail/loading_gif.service';
import { DataPropertiesInternalProviders } from './data_properties.service';
import { TitleService } from '../../core/navbar/titles.service';
import { editInternalProviders } from './inline-int-providers/edit_form_int_providers.service';
import { RolloverAutocompletes } from '../../customers/rollovers-dropdown.service';
import { Subscription } from 'rxjs/Subscription';
import { DataPropertiesPriceRules } from '../price-rules/data_properties.service';
import { myPagination } from './../pagination-mappings/pagination.subcomponent';
import { DataPagination } from './../pagination-mappings/data_pagination.service';
import { DomSanitizationService, SecurityContext, SafeHtml, BROWSER_SANITIZATION_PROVIDERS } from '@angular/platform-browser';

declare var jQuery: any;
declare var $: any;

///////////////////////////
/// Price Rules ////
@Component({
  selector: '[price-rules]',
  template: require('./internal-providers.html'),
  styles: [require('./internal-providers.scss')],
  directives: [ROUTER_DIRECTIVES, [Widget], [myPagination]],
  providers: [MODAL_P, Modal, DataPagination, editInternalProviders, BROWSER_SANITIZATION_PROVIDERS] 
})

export class InternalProviders {

    private subscription: Subscription;
    //Title page
    title_page: any;
    checked = false; //Select All
    justchange: any; //just change icon to normal checkbox

    //Icon Delete Table Mappings amenities
    show_icon = false;
    disabled_loc = false; //It's enabled
    selected_c = [];

    //Control width of screens
    view_port_width = true;

    showPagination: boolean = false;
    myUrl: string;
    messageOpacity  = 1;
    @ViewChild('pagination') myPag;
    @ViewChild('serviceType') _serviceType: ElementRef;
    clicky:any = [];
    searchBox = [];
    searchLetters = [];
    debouncedInput = [];
    subscribe = [];
    field_error_city = [];
    hideButton:any = [];
    hideCollapsable:any = [];
    htmlService_type:any = [];

    constructor(
        private _sanitizer: DomSanitizationService, 
        private renderer:Renderer, 
        public _servicePriceRules : DataPropertiesPriceRules, 
        public _editInternalProviders : editInternalProviders, 
        public _data_pagination: DataPagination, 
        public pag: myPagination, 
        public http: Http, 
        public params: RouteParams, 
        public router: Router, 
        public _titleService: TitleService,
        public modal: Modal, 
        public load: LoadingGif, 
        viewContainer: ViewContainerRef, 
        public location: Location, 
        private ngZone: NgZone,
        public _service: DataPropertiesInternalProviders,  
        public _rol: RolloverAutocompletes) {

        modal.defaultViewContainer = viewContainer; //Modal 

        //Store imported Title in local title
        this.title_page = _titleService.title_page;
        this.changeMyTitle(); //Update Title

        //ReSize event
        window.onresize = (e) => {
            ngZone.run(() => {
                /*this.get_size(); */
            });
        }; 
    } //Close constructor

    changeMyTitle() {
        this._titleService.change('Internal Providers');
        console.log('User Title: ' + this._titleService.title_page);
    }

ngOnInit(){

    /*if ( this.location.path() == '/app/settings/internal-providers') {
        this.restore_search();
    }*/

    if (this.location.path().indexOf(";") != -1 ) {
        this.myUrl = this.location.path().slice(0,this.location.path().indexOf(";"));
    } else {
        this.myUrl = this.location.path();
    }

    this.get_size();
    this.justchange = false;
    //////////////////////////////////////
    /// Animation to Search extensible ///
    var s = $('.circle-animate-search input'),
        t = $('.search-circle-lupa input'),
        u = $('.open-search'),
        f = $('form'),
        a = $('.after'),
        c = $('.search-circle-lupa'),
        m = $('.text-search p'),
        x = $('.text-search-animate p'),
        z = $('.sidebar');

    s.focus(function(e){
        e.preventDefault();
        if( f.hasClass('open') ) return;
        m.hide();
        c.hide();
        a.show();
        x.show(); 
        s.addClass('search-background');
        f.addClass('in');
        setTimeout(function(){
            f.addClass('open');
            f.removeClass('in');
        }, 800);
    });

    t.focus(function(e){
        e.preventDefault();
        if( f.hasClass('open') ) return;
        m.hide();
        c.hide();
        a.show();
        x.show(); 
        s.addClass('search-background');
        f.addClass('in');
        setTimeout(function(){
            f.addClass('open');
            f.removeClass('in');
        }, 800);
    });

    u.on('click', function(e){
        e.preventDefault();
        if( f.hasClass('open') ) return;
        m.hide();
        c.hide();
        a.show();
        x.show(); 
        s.addClass('search-background');
        f.addClass('in');
        setTimeout(function(){
            f.addClass('open');
            f.removeClass('in');
        }, 800);
    });

    a.on('click', function(e){
        e.preventDefault();
        if( !f.hasClass('open')) return;
        s.val('');
        f.addClass('close');
        f.removeClass('open');
        s.removeClass('search-background');
        m.fadeIn();
        x.fadeOut();
        c.fadeIn(50);
        a.hide(1);
        setTimeout(function(){
            f.removeClass('close');
        }, 0);
    })

    z.on('click', function(e){
        if( !f.hasClass('open')) return;
        s.val('');
        f.addClass('close');
        f.removeClass('open');
        s.removeClass('search-background');
        m.fadeIn();
        c.fadeIn();
        x.hide();
        a.hide();
        setTimeout(function(){
            f.removeClass('close');
        }, 0);
    })

    f.submit(function(e){
        e.preventDefault();
        m.html('Search for Internal Providers').addClass('show');
        x.html('Search for Internal Providers').addClass('show');
        f.addClass('explode');
        setTimeout(function(){
            s.val('');
            f.removeClass('explode');
            m.removeClass('show');
            x.removeClass('show');
        }, 0);
    })
    

    if ( this.params.get('cp') ) {
        var letter = this._service.search_internal_providers; //Store letter
        setTimeout(()=>{
            this._service.get_internal_providers(letter,{ page : this.params.get('cp') })
            .map(data => 
            {    
                 this.recursive_check_pagination(data);
                 this.hideGhostRows();
            })
                .subscribe();
        });
    } else {
        this.search_internal_providers();
    }

    
    $(document).mousedown((e) => {
        this.clicky = $(e.target);
        console.log($(e.target));
        if ( this.clicky[0].nodeName.toLowerCase() == 'li' || this.clicky[0].nodeName.toLowerCase() == 'a' ) {
        } else {
            this._editInternalProviders.filteredListCity = [];
        }
    });
    $(document).mouseup((e) => {
        this.clicky = null;
    });

    // this.subscription = this._editInternalProviders.notifyObservable.subscribe((res) => {
    //           myGlobals.alertTravtion('this');
    //     this.field_error_city[res] = true;
    //     });

    const searchBox = document.getElementById('searchBox');
    const searchLetters = Observable
      .fromEvent(searchBox, 'keyup');
      //.map(i => i);

    const debouncedInput = searchLetters.debounceTime(650);

    const subscribe = debouncedInput.subscribe(val => {
      this.search_internal_providers();
       setTimeout(()=>{
         this.messageOpacity = 1;
      } , 800);
    });

    //DISSAPEAR ON BACKSPACE
    searchLetters.subscribe((val : any) => {
        if (this._service._data_pagination.total_page == 0 ){
            if (val.which == 8){
                this.messageOpacity = 0;
            }
        }  
    });

    const searchBox1 = document.getElementById('city');
    const searchLetters1 = Observable
      .fromEvent(searchBox1, 'keyup');
    const debouncedInput1 = searchLetters1.debounceTime(650);
    const subscribe1 = debouncedInput1.subscribe((event: any ) => {
      this.filter_city_name(this._editInternalProviders.city_new, ''  , event);
    });

    // this.recursive_cityFunction();

    $("#new-pricerules-button").click(()=>{
        if ( $("#new-pricerules-button").hasClass("collapsed") ) {
            jQuery('#field-name').removeClass('border-errors');
            jQuery('#field-email').removeClass('border-errors');
            jQuery('#field-phone').removeClass('border-errors');
            this._editInternalProviders.updated_form_error_new = false;
            this._editInternalProviders.field_name_err_new = "";
        }
    })
} //Clolse ngOnInit



current_page_change(data){
        this._service.get_internal_providers(this._service.search_internal_providers, { page: data.selectedPage , type : data.type})
        .map(json_response =>
            this.myPag.pagination_mappings({
                 event : 'select' ,
                 _data_pagination : json_response
            }))
        .subscribe(); 

        this.unselect_all();
        this.location.go(this.myUrl+';cp='+data.selectedPage);
       //Acá ejecuta el request en forma de observable, primero hace get_mappings y sólo cuando termina de hacer ese método retorna para seguir haciendo lo que está dentro del .map que es el método pagination_mappings que está dentro del subcomponent   
}

search_cityFunction(id , i){
    if ( this._service.internal_provider != undefined ){ 
        this.searchBox[i] = document.getElementById('city'+this._service.internal_provider[i].id);
        this.searchLetters[i] = Observable
        .fromEvent(this.searchBox[i], 'keyup');

         this.debouncedInput[i] = this.searchLetters[i].debounceTime(650);
         this.subscribe[i] = this.debouncedInput[i].subscribe((event: any ) => {
         this.filter_city_name(this._editInternalProviders.city[id] , id , event);
        });
    } else {
        setTimeout(()=>{
            this.search_cityFunction( id , i );
        } , 1000);
    }
}

recursive_check_pagination(data ){
     this.showPagination = true;
     if ( this.myPag != undefined  ){
        if ( data.numbers_of_pages > 1 ) {
            this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
        } else {
           this.showPagination = false;
        }
    } else {
        setTimeout(()=>{
            this.recursive_check_pagination(data);
        }, 400);
    }
}

//////////////////////////////////////////////////////////
/// Method for alocate div container of Int. Providers ///
get_size(){
  var viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0); //width of viewport
  if(viewport_width < 1200){
    this.view_port_width = false;
  } else if(viewport_width > 1200) {
    this.view_port_width = true;
  }
}

//////////////////////////////////////////////////////////
/// Implementation for input Search Internal Providers /// 
search_internal_providers() {
    var setInverval_Variable;
    clearInterval(setInverval_Variable);
    setInverval_Variable = setInterval(this.search_function(), 500);
}

search_function() {
    //this._edit_cur.filteredListRelationships = []; //Reset filtered list
    //this._edit_cur.close_all(); //Try to close all opened previous boxes to start a new search
    var letter = this._service.search_internal_providers; //Store letter
    this._service.get_internal_providers(letter,{ page : 1})
    .map(data => 
    {
        this.recursive_check_pagination(data);
        this.hideGhostRows();
    }).subscribe(); //Call to request and call pagintation only after get the response.

         if (this.location.path().indexOf(";") != -1 ) {
            this.myUrl = this.location.path().slice(0,this.location.path().indexOf(";"));
        } else {
            this.myUrl = this.location.path();
        }

        if ( this.showPagination ) {
            this.location.go(this.myUrl+';cp='+1);
        }      
}

//Restore the search once the search is closed (Gonzalo)
restore_search(){
    this._service.search_internal_providers = '';
    var letter = this._service.search_internal_providers; //Store letter
    this.search_function();
    this.unselect_all();// Unselect all selected checboxes
}

hideGhostRows() { 
    for (var i = 0; i < this._service.internal_provider.length; ++i) {
        this.hideCollapsable[i] = false;
    }
}

cancel_edit_int_prov(id, i){
  jQuery('#field-name'+ id).removeClass('border-errors');
  this._editInternalProviders.field_name_err[id] = "";
  jQuery('#field-email'+ id).removeClass('border-errors');
  this._editInternalProviders.field_email_err[id] = "";
  jQuery('#field-phone'+ id).removeClass('border-errors');
  this._editInternalProviders.field_phone_err[id] = "";
  this._editInternalProviders.hideButton[id] = false;
  this._editInternalProviders.post_preload_internal_provider(id).subscribe()
  $("#edit_i_p"+id).click();
  this.hideCollapsable[i] = false;
}

preloadIntenal(id, i){
    // this._editInternalProviders.field_error_city = '';
    this.hideCollapsable[i] = true;
    this._editInternalProviders.hideButton[id] = true;
    this._editInternalProviders.post_preload_internal_provider(id).
    map( resp => {
        this.search_cityFunction( id , i );
        this._editInternalProviders.get_notification_rules(id ).subscribe();
        this._editInternalProviders.get_price_rules(id)
          .map( resp => { 
            this.htmlService_type[i] = "";
            for (var i = 0; i < resp.length; ++i) {
                if (  resp[i].service_type == "all") {
                    this.htmlService_type[i] =  '<div>All types</div>';
                } else {
                    for (var i = 0; i < resp.service_type.length; ++i) {
                    this.htmlService_type[i] +=  '&nbsp;<i class="fa fa-'+resp.service_type[i]+' dinamicIcons" aria-hidden="true" ></i>';
                    }
                    setTimeout(()=>{
                        $(".dinamicIcons").css({ 'color' : '#9f9f9f' , 'font-size' : '24px' });
                    } , 4000);
                }
            }
            // this._sanitizer.bypassSecurityTrustHtml(this.htmlService_type);
            // this.renderer.invokeElementMethod(this._serviceType.nativeElement , 'insertAdjacentHTML' ['beforeend', '<div><i class="fa fa-shield"></i></div>' ]);
        }).subscribe();
    }).subscribe();
}

save_internal_provider(ipid) {
    this._editInternalProviders.save_int_prov(ipid).subscribe();
}

save_internal_provider_new() {
    this._editInternalProviders.save_int_prov_new()
    .map( resp => {
        // setTimeout(()=>{
            // this.cancel_edit_int_prov_new();
        // } , 6500);
    }).subscribe();
}

cancel_edit_int_prov_new() {
  jQuery('#field-name').removeClass('border-errors');
  this._editInternalProviders.field_name_err = "";
  jQuery('#field-email').removeClass('border-errors');
  this._editInternalProviders.field_email_err = "";
  jQuery('#field-phone').removeClass('border-errors');
  this._editInternalProviders.name_new = "";
  this._editInternalProviders.address_new = "";
  this._editInternalProviders.city_new = "";
  this._editInternalProviders.zip_new = "";
  this._editInternalProviders.email_new = "";
  this._editInternalProviders.mobile_phone_new = "";
  this._editInternalProviders.legend_new = "";
  this._editInternalProviders.legend_hotel_new = "";
  this._editInternalProviders.legend_attraction_new = "";
  this._editInternalProviders.legend_transfer_new = "";
  this._editInternalProviders.legend_ife_new = "";
  this._editInternalProviders.legend_flight_new = "";
  this._editInternalProviders.legend_car_new = "";
  this._editInternalProviders.legend_package_new = "";
  this._editInternalProviders.legend_cruise_new = "";
  this._editInternalProviders.legend_insurance_new = "";
  this._editInternalProviders.voucher_payable_new = "";
  this._editInternalProviders.voucher_observations_new = "";
  this._editInternalProviders.voucher_emergency_contact_new = "";
  //error message
  this._editInternalProviders.field_name_err_new = "";
  $("#new-pricerules-button").click();
}

/// Request Autocomplete inline City with event ///
filter_city_name_click(city_name, i, e) {
    this._editInternalProviders.field_error_city[i] = ''; //Clean message
    this._editInternalProviders.filter_city_name_click(city_name,  i, e);
}

/////////////////////////////////////////////////////////
/// Request Autocomplete inline City with event keyup ///
filter_city_name(city_name, i, e) {
    this._editInternalProviders.filter_city_name(city_name, i, e);
}

select_city(i, item, code){
    this._editInternalProviders.select_city(i, item, code);
}

keyDownFunction(event) {
    if(event.keyCode == 13) {
         event.preventDefault();
    }
}

//////////////////////////////
/// Unselect All Checkboxs ///
unselect_all(){
    var inputs = jQuery('.check-table-ip');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == true){
            $('#checkbox' + i).trigger('click');
        }
    }
}

//////////////////////////////
/// Select All (Checkbox) ////
select_all(){
    $('.check-table-ip:checked').attr('checked', 'true');
    var inputs = jQuery('.check-table-ip');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == false){
            $('#checkbox' + i).trigger('click');
        }
    } 
}

////////////////////////////////
/// Icon Delete of the Title ///
deleteInternalProvidersAll(){
    var counter = 0;
    this._service.list_id = []; //Clean array
    var list_selected=[];
    var inputs = jQuery('.check-table-ip');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == true){
            counter++;
            var id_content = $('#checkbox' + i).val();
            this._service.list_id.push(id_content);
            list_selected.push(i);
        }
    }

    var pageForDelete;
    if (inputs.length == counter) {
        pageForDelete = this._service._data_pagination.current_page - 1;
    } else {
        pageForDelete = this._service._data_pagination.current_page;
    }
 
    let url = myGlobals.host+'/api/admin/settings/internal_provider/delete';
    let body=JSON.stringify({ list_providers_code: this._service.list_id });
    console.log('Body: Delete Price Rules: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    this.http.post( url, body, {headers: headers, withCredentials:true})
    .subscribe( 
        response => {
          this._service.get_internal_providers(this._service.internal_provider.search_internal_providers, { page: pageForDelete })
           .map(data => {    
              data.current_page = pageForDelete;
              if ( data.numbers_of_pages > 1 ) {
                 this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
              } else {
                 this.showPagination = false;
              }
           }).subscribe(); //Call request function and subscribe but not call another method after get a response.
          },
        (err) => {});

    this.location.go(this.myUrl+';cp='+pageForDelete);     
    this.justchange= false;
    this.show_icon = false;
}

deleteInterProv(id){
    this._service.list_id.push(id);

    let url = myGlobals.host+'/api/admin/settings/internal_provider/delete';
    let body=JSON.stringify({ list_providers_code: id });
    console.log('Body: Delete Price Rules: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    var pageForDelete;
    if (this._service.internal_provider.length == 1) {
        pageForDelete = this._service._data_pagination.current_page - 1;
    } else {
        pageForDelete = this._service._data_pagination.current_page;
    }

    this.http.post( url, body, {headers: headers, withCredentials:true})
    .subscribe( 
        response => {
          this._service.get_internal_providers(this._service.internal_provider.search_internal_providers, { page: pageForDelete })
           .map(data => {    
              data.current_page = pageForDelete;
              if ( data.numbers_of_pages > 1 ) {
                 this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
              } else {
                 this.showPagination = false;
              }
           }).subscribe(); //Call request function and subscribe but not call another method after get a response.
          },
        (err) => {});

    this.location.go(this.myUrl+';cp='+pageForDelete);     
    this.justchange= false;
    this.show_icon = false;
}
///////////////////////////////////////
//////// Request delete users ////////
deleteInternalProvider(id){
    this._service.list_id = []; //Clean array
    this._service.list_id.push(id);
    var single_id = this._service.list_id;
    this._service.list_id = []; //Clean array
    var inputs = jQuery('.check-table-ip');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked");
        if(checked == true){
            var id_content = $('#checkbox' + i).val();
            this._service.list_id.push(id_content);
        }
    }

    var pageForDelete;

    let url = myGlobals.host+'/api/admin/settings/internal_provider/delete';
    let body=JSON.stringify({ list_providers_code: id });
    console.log('Body: Delete Price Rules: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    this.http.post( url, body, {headers: headers, withCredentials:true})
    .subscribe( 
        response => {
          this._service.get_internal_providers(this._service.internal_provider.search_internal_providers, { page: pageForDelete })
           .map(data => {    
              data.current_page = pageForDelete;
              if ( data.numbers_of_pages > 1 ) {
                 this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
              } else {
                 this.showPagination = false;
              }
           }).subscribe(); //Call request function and subscribe but not call another method after get a response.
          },
        (err) => {});

    this.location.go(this.myUrl+';cp='+pageForDelete);   
    this.justchange= false;
    this.show_icon = false;
} //Close delete users*/

//////////////////////////////////////////////////
/// Show icon Delete table Mappings amenities ///
show_icon_internal_providers(){
    var inputs = jQuery('.check-table-ip');
    var count_true = 0;
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == true){
            count_true++; //Count checkbox checked
            this.show_icon = true;
        }
    } 
    if(inputs.length == count_true){//If all inputs are check
        console.log('Estan todos seleccionados');            
        this.show_icon = true;
    } else if(count_true == 0){ //If all inputs are unchecked
        console.log('Estan todos deseleccionados');           
        this.show_icon = false;
    }
}

/////////////////////////////////////////////////
/// Select All: Change ckeckbox by icon-minus ///
change_to_minus(){
    var inputs = jQuery('.check-table-ip');
    var count_true = 0;
        for(var i=0; i<inputs.length; i++){
            var checked = $('#checkbox' + i).is(":checked"); 
            if(checked == true){
              count_true++; //Count checkbox checked
            }
        } 
        if(inputs.length == count_true){//If all inputs are check
            console.log('Estan todos seleccionados');            
            this.justchange= true;
        } else if(count_true == 0){ //If all inputs are unchecked
            console.log('Estan todos deseleccionados');           
            this.justchange= false;
        } else{ //If some input is unckeched         
            this.justchange = 'minus';
        }
}

//////////////////////////////////////
/// Request icons enabled-disabled ///
enabled_disabled_toggles(id, status, selected_checkboxs){
    let url = myGlobals.host+'/api/admin/settings/internal_provider/change_status';
    let body=JSON.stringify({ status: status, list_providers_code: id });
    console.log('Body del request del enabled-disabled: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .map( response => {
            this._service.get_internal_providers(this._service.search_internal_providers, { page: this._service._data_pagination.current_page})
            .subscribe((json_response) => {
                console.log('Se habilita o inhabilita el checkbox')
            }, (err) => console.error(err),() =>
                this.caught_selected_inputs(selected_checkboxs));
                return this._service.list_id; //Send back response to the call of the method to use as event_type variable
        }, error => {}
    );
} //Close enabled_disabled_toggles

///////////////////////////////////////////////////
/// Enabled/disabled toogle multiple checkboxes ///
enabled_disabled_all(){
    this._service.toggle_status = !this._service.toggle_status; //If true change to false, If false change to true boolean
    var status = !this._service.toggle_status;
    this._service.list_id = []; //Clean array
    var inputs = jQuery('.check-table-ip');  
    var list_checked =[];  
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked");
        if(checked == true){
        	list_checked.push(i);
            console.log('VALOR DEL #'+i+': '+$('#checkbox' + i).val());
            var id_content = $('#checkbox' + i).val();
            this._service.list_id.push(id_content);
        }
    }
    console.log('Array de id price rules' + this._service.list_id);
    var multiple_id = this._service.list_id;
    this.enabled_disabled_toggles(multiple_id, status, list_checked)
    .map(json_response =>
        console.log('Todos')).subscribe(); //Call request function
    this.justchange = false;
} //Close enabled_disabled_all

/////////////////////////////////////////////////////////////////////
/// Icons enabled-disables single of each checkboxes of the table ///
enabled_disabled_toggle(status , id){
    this._service.list_id = []; //Clean array
    this._service.list_id.push(id);
    var single_id = this._service.list_id;
    this._service.list_id = []; //Clean array
    var list_checked=[];
    var inputs = jQuery('.check-table-ip');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked");
        if(checked == true){
        	list_checked.push(i);
            var id_content = $('#checkbox' + i).val();
            this._service.list_id.push(id_content);
        }
    }
    console.log('Array de id PINTERNAL: ' + this._service.list_id);
    this.enabled_disabled_toggles(single_id, status, list_checked)
    .map(json_response =>{
            console.log('Individual')}).subscribe(); //Call request function
    this.justchange = false;
}

////////////////////////////////////////////////////////////////////////////////
/// Verify all selected checkbox who were selected and restore the selection ///
caught_selected_inputs(id){
 	console.log('caught_selected_inputs' +id);
    setTimeout(function(){
        var inputs = jQuery('.check-table-ip');        
            for(var x=0; x<id.length; x++){
                $('#checkbox' + id[x]).trigger('click');
            }
    }, 500)
} //Close caught_selected_inputs

// //////////////////////////////////////////////////
// /////// Icon Ellipsis on Table List Users ///////
showEllipsisIcon(i){
    var withEllipsis = '#' + i + 'ellipsisIcon';
    jQuery(withEllipsis).show();
}

hideEllipsisDropdown(){
    jQuery('.prueba').removeClass('open');
    jQuery('.ellipsis-icon').removeClass('focused-ellipsis-icon');
}

focusEllipsis(i){
    var withEllipsis = '#' + i + 'ellipsisIcon';
    jQuery(withEllipsis).toggleClass('focused-ellipsis-icon');
}

//////////////////////////////////////////////////
/// Service Rollover Automcomplete or Dropdown ///
mouseover_color_text(text){
    this._rol.mouseover_color_text(text);
}
mouseleave_color_text(text){
    this._rol.mouseleave_color_text(text);
}

////////////////////////////////////////////////////////
/// VALIDATION FIELD E-MAIL: FORM USER AND NEW USERS ///
keyup_field_email_int_prov(values, ipid){
    this._editInternalProviders.keyup_field_email_int_prov(values, ipid);
}

remove_autocomplete(){
    this._editInternalProviders.remove_autocomplete();
}

/////////////////////////////////////////////
/// EVENT FOCUS: Form internal providers  ///
focus_int_prov(form, ipid){ //Dejo esto por las dudas si cambian de parecer
    //Form internal providers Exist/Edit
    /*if(form == 'int'){
        jQuery('#field-email' + ipid).removeClass('border-errors');
        this._editInternalProviders.validation_email_filter_keyup[ipid] = true; 
    } else if(form == 'int-new') {
        //Form NEW internal providers
        jQuery('#field-email').removeClass('border-errors');
        this._editInternalProviders.validation_email_filter_keyup_new = true; 
    }*/
}

blur_email(form, ipid){ //Dejo esto por las dudas si cambian de parecer
    /*if(form == 'int'){
        jQuery('#field-email' + ipid).removeClass('border-errors'); //Form internal providers Exist/Edit
    } else if(form == 'int-new') {
        jQuery('#field-email').removeClass('border-errors'); //Form NEW internal providers
    }*/
}

blur_city(intId) {
    this._editInternalProviders.field_error_city[intId] = '';
}

blur_city_new() {
    this._editInternalProviders.field_error_city_new = '';
}

deletePriceRule(id , intId ){
    this._service.list_id = []; //Clean array
    this._service.list_id.push(id);

    let url = myGlobals.host+'/api/admin/settings/price_rule/delete';
    let body=JSON.stringify({ list_price_rules_code: id });
    console.log('Body: Delete Price Rules: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    this.http.post( url, body, {headers: headers, withCredentials:true})
    .subscribe( 
        response => {

          this._editInternalProviders.get_price_rules(intId).subscribe();
        },
        (err) => {});

    var pageForInt;
    if ( this.params.get("cp") == undefined ) {
        pageForInt = 1;
    } else {
        pageForInt = this.params.get("cp");
    }
    this.location.go(this.myUrl+';cp='+pageForInt);  
}

goToPriceRules( priceName , code ){
    this.router.navigate(['/App', 'PriceRules', {
        pr_name : priceName,
        pr_code : code
    }]);
}

/////////////////////////////////////////////
/// Icons of the table for Ext. Providers ///
mouseover_icons(icons){
    var icon = 'i.' + icons;
    jQuery(icon).tooltip('show');
}
mouseleave_icons(icons){
    var icon = 'i.' + icons;
    jQuery(icon).tooltip('hide');
}

} // Close class Internal Providers