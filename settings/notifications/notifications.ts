import { Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, OnInit, NgZone , ViewChild , trigger, transition, style, animate } from '@angular/core';
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
import { DataPropertiesNotifications } from './data_properties.service';
import { TitleService } from '../../core/navbar/titles.service';
import { Subscription } from "rxjs";
import { pathName } from '../../core/sidebar/path_name.service'; //Service Unification All mappings (Listados simples)

// Pagination
import { myPagination } from '../pagination-mappings/pagination.subcomponent';
import { DataPagination } from '../pagination-mappings/data_pagination.service';

declare var jQuery: any;
declare var $: any;

//////////////////////////        
/// External Providers ///
@Component({
  selector: '[notifications]',
  template: require('./notifications.html'),
  styles: [require('./notifications.scss')],
  directives: [ROUTER_DIRECTIVES, [Widget],[myPagination]],
  providers: [MODAL_P, Modal, DataPagination] 
})

export class Notifications {

    //Title page
    title_page: any;
    checked = false; //Select All
    justchange: any; //just change icon to normal checkbox

    //Icons Enabled/Disabled Table External Providers
    show_icons_not = false;
    disabled_loc = false; //It's enabled
    selected_c = [];

    //Control width of screens
    view_port_width_not = true;

    showPagination : boolean = false;
    observ: Observable<string> = new Observable<string>(); //Observable source
    myUrl : string;
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
        public http: Http,
        public params: RouteParams,
        public router: Router,
        public _titleService: TitleService,
        public modal: Modal,
        public load: LoadingGif,
        viewContainer: ViewContainerRef,
        public location: Location,
        public _path_name: pathName,
        private ngZone: NgZone,
        public _service: DataPropertiesNotifications,
        public _data_pagination: DataPagination,
        public pag: myPagination
    ) {
        
        modal.defaultViewContainer = viewContainer; //Modal 

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
        this._titleService.change('Settings / Notifications');
        console.log('User Title: ' + this._titleService.title_page);
    }

    ngOnInit() { 


        if ( this.location.path() == '/app/settings/notifications') {
            this.restore_search();
        }

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
            m.html('Search For Notifications').addClass('show');
            x.html('Search For Notifications').addClass('show');
            f.addClass('explode');
            setTimeout(function(){
                s.val('');
                f.removeClass('explode');
                m.removeClass('show');
                x.removeClass('show');
            }, 0);
        })

        if ( this.params.get('cp') ) {
            var letter = this._service.search_notifications; //Store letter
            setTimeout(()=>{
                this._service.get_notifications(letter,{ page : this.params.get('cp') })
                .map(data => 
                {    
                    if ( data.numbers_of_pages > 1 ) {
                     this.recursive_check_pagination(data);
               }

                })
                    .subscribe();
            });
        } else {
            this.search_notifications();
        }

        //SEARCHBOX
        const searchBox = document.getElementById('searchBox');
        const searchLetters = Observable
        .fromEvent(searchBox, 'keyup');
        //.map(i => i);

        const debouncedInput = searchLetters.debounceTime(650);

        const subscribe = debouncedInput.subscribe(val => {
            this.search_notifications();
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


    } //Close NgOnInit
 
/////////////////////////////////////////////////////////
/// Method for alocate div container of Notifications ///
get_size(){
    var viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0); //width of viewport
    if(viewport_width < 1200){
        this.view_port_width_not = false;
    } else if(viewport_width > 1200) {
        this.view_port_width_not = true;
    }
}

current_page_change(data){
    this._service.get_notifications(data.letter, { page: data.selectedPage , type : data.type})
    .map(json_response =>
        this.myPag.pagination_mappings({
            event : 'select' ,
            _data_pagination : json_response,
            from : 'currencies',
            cp : data.selectedPage
        }))
    .subscribe(); 
  
    this.unselect_all();
    this.location.go(this.myUrl+';cp='+data.selectedPage);
    /*Acá ejecuta el request en forma de observable, primero hace get_administrators
    y sólo cuando termina de hacer ese método retorna para seguir haciendo lo que está dentro del .map
    que es el método pagination_mappings que está dentro del subcomponent*/
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
        }, 500);
    }
}

//////////////////////////////////////////////////////////
/// Implementation for input Search Mappings amenities /// 
search_notifications() {
    var setInverval_Variable;
    clearInterval(setInverval_Variable);
    setInverval_Variable = setInterval(this.search_function(), 500);
}

search_function() {
    var letter = this._service.search_notifications; //Store letter
    this._service.get_notifications(letter,{ page : 1})
    .map(data => 
    {
        if ( data.numbers_of_pages > 1 ) {
            this.recursive_check_pagination(data);
        }
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

/*
Restore the search once the search is closed (Gonzalo)
*/
restore_search(){
    this._service.search_notifications = '';
    var letter = this._service.search_notifications; //Store letter
    this.search_function();
    this.unselect_all();// Unselect all checboxes selected
}

////////////////////////////////////////////////////
/// Select All (Checkbox) ///
select_all(){
    $('.check-table-not:checked').attr('checked', true);
    var inputs = jQuery('.check-table-not');
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
    var inputs = jQuery('.check-table-not');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == true){
            $('#checkbox' + i).trigger('click');
        }
    } 
}

/////////////////////////////////////////////////
/// Select All: Change ckeckbox by icon-minus ///
change_to_minus(){ 
    var inputs = jQuery('.check-table-not');
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

/*///////////////////////////////////////////////////
/// Enabled/disabled toogle multiple checkboxes ///
enabled_disabled_all(){       
    this._service.toggle_status = !this._service.toggle_status; //If true change to false, If false change to true boolean
    var status = !this._service.toggle_status;
    this._service.list_id = []; //Clean array
    var inputs = jQuery('.check-table-not');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == true){
            var id_content = $('#checkbox' + i).val();
            this._service.list_id.push(id_content);
        }
    }
    console.log('Array de id providers' + this._service.list_id);
    var multiple_id=this._service.list_id;
    this.enabled_disabled_toggles(multiple_id, this._service.list_id, status)
    .map(json_response => 
        console.log('Todos')).subscribe(); //Call request function 
    this.justchange= false;
}

/////////////////////////////////////////////////////////////////////
/// Icons enabled-disables single of each checkboxes of the table ///
enabled_disabled_toogle(id, status){
    this._service.list_id = []; //Clean array
    this._service.list_id.push(id);
    var single_id= this._service.list_id;
    this._service.list_id = []; //Clean array
    var inputs = jQuery('.check-table-not');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == true){
            var id_content = $('#checkbox' + i).val();
            this._service.list_id.push(id_content);
        }
    }
    console.log('Array de id providers' + this._service.list_id);
    this.enabled_disabled_toggles(single_id, this._service.list_id, status)
    .map(json_response => 
        console.log('Individual')).subscribe(); //Call request function 
    this.justchange= false;
}

//////////////////////////////////////
/// Request icons enabled-disabled ///  
enabled_disabled_toggles(id, selected_checkboxs, status){   
    let url = myGlobals.host+'/api/admin/settings/external_provider/change_status';
    let body=JSON.stringify({ list_providers_code: id, status: status });
    console.log('Body del request del enabled-disabled: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    var letter = this._service.search_notifications; //Store letter
    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .map( 
        response => {           
            this._service.get_external_providers(letter,{ page : this._service.current_page })
            .subscribe((json_response) => {
                console.log('Se habilita o inhabilita el checkbox')
            }, (err) => console.error(err),() => 
                this.caught_selected_inputs(selected_checkboxs)); 
                return this._service.list_id; //Send back response to the call of the method to use as event_type variable     
        }, error => {}
    ); 
}*/

////////////////////////////////////////////////////////////////////////////////
/// Verify all selected checkbox who were selected and restore the selection ///
caught_selected_inputs(id){ 
    setTimeout(function(){
        var inputs = jQuery('.check-table-not');
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
}//Close caught_selected_inputs

////////////////////////////////////////////////////
/// Icon Edit mouseover Table External Providers ///
mouseover_icon_edit(i){ 
  var icon_edit = '#' + i + 'icon-edit';
  jQuery(icon_edit).addClass('color-edit');
}

mouseleave_icon_edit(){
  jQuery('.fa-pencil').removeClass('color-edit');
}

////////////////////////////////////////////////////////////
/// Show icons Enabled/Disabled table External Providers ///
show_icons_notifications(){
    var inputs = jQuery('.check-table-not');
    var count_true = 0;
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == true){
            count_true++; //Count checkbox checked
            this.show_icons_not = true;
        }
    } 
    if(inputs.length == count_true){//If all inputs are check
        console.log('Estan todos seleccionados');            
        this.show_icons_not = true;
    } else if(count_true == 0){ //If all inputs are unchecked
        console.log('Estan todos deseleccionados');           
        this.show_icons_not = false;
    }
}

keyDownFunction(event) {
    if(event.keyCode == 13) {
         event.preventDefault();
    }
}

/////////////////////////////////////////////
/// Icons of the table for Ext. Providers ///
mouseover_ext_providers(icons){
    var icon = 'i.' + icons;
    jQuery(icon).tooltip('show');
}
mouseleave_ext_providers(icons){
    var icon = 'i.' + icons;
    jQuery(icon).tooltip('hide');
}

} // Close class Notifications
