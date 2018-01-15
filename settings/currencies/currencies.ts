import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, OnInit, NgZone , ViewChild , OnDestroy } from '@angular/core';
import {Widget} from '../../core/widget/widget';
import {RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import { Idle, DEFAULT_INTERRUPTSOURCES } from 'ng2-idle/core'; //For timeout
import { DialogRef } from 'angular2-modal';
import {Observable} from 'rxjs/Observable';
import {CustomHttp} from '../../services/http-wrapper';
import myGlobals = require('../../../app');
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NgClass} from '@angular/common';
import { Modal, BS_MODAL_PROVIDERS as MODAL_P } from 'angular2-modal/plugins/bootstrap'; //Modal
import {Core} from '../../core/core';
import { Location } from '@angular/common';
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';
import {DataPropertiesCurrencies} from './data_properties.service';
import {editCurrencies} from './inlinediting/edit_currencies.service'; //Inline Editing Mappings amenities
import {TitleService} from '../../core/navbar/titles.service';

import {myPagination} from './../pagination-mappings/pagination.subcomponent';
import {DataPagination} from './../pagination-mappings/data_pagination.service';


declare var jQuery: any;
declare var $: any;

///////////////////////////
/// Currencies ////
@Component({
  selector: '[currencies]',
  template: require('./currencies.html'),
  styles: [require('./currencies.scss')],
  directives: [ROUTER_DIRECTIVES, [Widget] , [myPagination]],
  providers: [MODAL_P, Modal , DataPagination] 
})

export class Currencies {

    //Title page
    title_page: any;
    checked = false; //Select All
    justchange: any; //just change icon to normal checkbox

    //Icon Delete Table Mappings amenities
    show_icon_cur = false;
    disabled_loc = false; //It's enabled
    selected_c = [];

    //Control width of screens
    view_port_width_cur = true;

    //Save new rate
    rate_new: any;
    field_rate_new = [];
    validation_rate = [];
    validation_rate_save: any;
    disable_rates = false; //It's enabled
    rateValue:string = '';

    showPagination : boolean = true;
    myUrl : string;
    messageOpacity  = 1;
    @ViewChild('pagination') myPag;

    constructor(
    public _data_pagination: DataPagination, public pag: myPagination, public http: Http, public params: RouteParams, public router: Router, public _titleService: TitleService,
    public modal: Modal, public load: LoadingGif, viewContainer: ViewContainerRef, public location: Location, private ngZone: NgZone,
    public _currencies_service: DataPropertiesCurrencies, public _edit_cur: editCurrencies) {
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
        this._titleService.change('Currencies');
        console.log('User Title: ' + this._titleService.title_page);
    }




ngOnInit(){


    if ( this.location.path() == '/app/settings/currencies') {
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
            m.html('Search By Currencies').addClass('show');
            x.html('Search By Currencies').addClass('show');
            f.addClass('explode');
            setTimeout(function(){
                s.val('');
                f.removeClass('explode');
                m.removeClass('show');
                x.removeClass('show');
            }, 0);
        })
    
      if ( this.params.get('cp') ) {
        var letter = this._currencies_service.search_currencies; //Store letter
        this._currencies_service.get_currencies(letter,{ page : this.params.get('cp') })
        .map(data => 
        {    
            if ( data.numbers_of_pages > 1 ) {
                this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
            } else {
               this.showPagination = false;
            }
          //  this.myPag.pagination_mappings({ event:'search', _data_pagination: data , from: 'currencies' , cp : this.params.get('cp')  });
         //   this.pag.pagination_mappings({ event:'search', last_page: this._data_pagination.last_page, firstof_page:1 });
        })
            .subscribe();
    } else {
        this.search_currencies();
    }


    /*Search box*/
    const searchBox = document.getElementById('searchBox');
    const searchLetters = Observable
      .fromEvent(searchBox, 'keyup');
      //.map(i => i);

    const debouncedInput = searchLetters.debounceTime(650);

    const subscribe = debouncedInput.subscribe(val => {
      this.search_function();
       setTimeout(()=>{
         this.messageOpacity = 1;
      } , 800);
    });


    /*DISSAPEAR ON BACKSPACE*/
    searchLetters.subscribe((val : any) => {
        if (this._currencies_service._data_pagination.total_page == 0 ){
            if (val.which == 8){
                this.messageOpacity = 0;
            }
        }  
    });

} //Clolse ngOnInit


current_page_change(data){
        this._currencies_service.get_currencies(data.letter, { page: data.selectedPage , type : data.type})
        .map(json_response =>
            this.myPag.pagination_mappings({
                 event : 'select' ,
                 _data_pagination : json_response,
                 from : 'currencies',
                 cp : data.selectedPage
            }))
        .subscribe(); 
      
      this.unselect_all_currencies();
      this.location.go(this.myUrl+';cp='+data.selectedPage);   
    //Acá ejecuta el request en forma de observable, primero hace get_mappings y sólo cuando termina de hacer ese método retorna para seguir haciendo lo que está dentro del .map que es el método pagination_mappings que está dentro del subcomponent   
}

///////////////////////////////////////////////////////////////
/// Method for alocate div container of Mappings amenities ///
get_size(){
  var viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0); //width of viewport
  if(viewport_width < 1200){
    this.view_port_width_cur = false;
  } else if(viewport_width > 1200) {
    this.view_port_width_cur = true;
  }
}

//////////////////////////////////////////////////////////
/// Implementation for input Search Mappings amenities /// 
search_currencies() {
    var setInverval_Variable;
    clearInterval(setInverval_Variable);
    setInverval_Variable = setInterval(this.search_function(), 500);
}

search_function() {
    this._edit_cur.filteredListRelationships = []; //Reset filtered list
    this._edit_cur.close_all(); //Try to close all opened previous boxes to start a new search
    var letter = this._currencies_service.search_currencies; //Store letter
    this._currencies_service.get_currencies(letter,{ page : 1})
    .map(data => 
    {
         if ( data.numbers_of_pages > 1 ) {
            this.showPagination = true;
            this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
        } else {
           this.showPagination = false;
        }
      
     //   this.pag.pagination_mappings({ event:'search', last_page: this._data_pagination.last_page, firstof_page:1 });
    })
        .subscribe(); //Call to request and call pagintation only after get the response.
    
    
        if (this.location.path().indexOf(";") != -1 ) {
            this.myUrl = this.location.path().slice(0,this.location.path().indexOf(";"));
        } else {
            this.myUrl = this.location.path();
        }

        this.location.go(this.myUrl+';cp='+1);

}

/*
Restore the search once the search is closed (Gonzalo)
*/
restore_search(){
    this._currencies_service.search_currencies = '';
    var letter = this._currencies_service.search_currencies; //Store letter
    this.search_function();
    this.unselect_all_currencies();// Unselect all checboxes selected
}

////////////////////////////////////////////////////
/// Select All (Checkbox) ////
select_all_currencies(){
    $('.check-table-cur:checked').attr('checked', true);
    var inputs = jQuery('.check-table-cur');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == false){
            $('#checkbox' + i).trigger('click');
        }
    } 
}

////////////////////////////////////////////////////
/// Unselect All Checkboxs ///
unselect_all_currencies(){
    var inputs = jQuery('.check-table-cur');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == true){
            $('#checkbox' + i).trigger('click');
        }
    } 
}

/////////////////////////////////////////////////
/// Select All: Change ckeckbox by icon-minus ///
change_to_minus_currencies(){
    var inputs = jQuery('.check-table-cur');    
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

///////////////////////////////////////////////////
/// Enabled/disabled toogle multiple checkboxes ///
enabled_disabled_all(){   
    console.log('enabled_disabled_all.');    
    this._currencies_service.toggle_status = !this._currencies_service.toggle_status; //If true change to false, If false change to true boolean
    var status = !this._currencies_service.toggle_status;
    this._currencies_service.list_id = []; //Clean array
    var inputs = jQuery('.check-table-cur');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        console.log('check: '+i+' - estado :'+checked);
        if(checked == true){
            var id_content = $('#checkbox' + i).val();
            this._currencies_service.list_id.push(id_content);
        }
    }
    console.log('Array de id currencies' + this._currencies_service.list_id);
    var multiple_id=this._currencies_service.list_id;
    this.enabled_disabled_toggles(multiple_id, this._currencies_service.list_id, status)
    .map(json_response => 
        console.log('Todos')).subscribe(); //Call request function 
    this.justchange= false;
}

////////////////////////////////////////////////////////////////////
/// Icons enabled-disable single of each checkboxes of the table ///
enabled_disabled_toogle(id, status){
    this._currencies_service.list_id = []; //Clean array
    this._currencies_service.list_id.push(id);
    var single_id = this._currencies_service.list_id;
    this._currencies_service.list_id = []; //Clean array
    var inputs = jQuery('.check-table-cur');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == true){
            var id_content = $('#checkbox' + i).val();
            this._currencies_service.list_id.push(id_content);            
        }
    }
    console.log('Array de id currencies' + this._currencies_service.list_id);
    this.enabled_disabled_toggles(single_id, this._currencies_service.list_id, status)
    .map(json_response => 
        console.log('Individual')).subscribe(); //Call request function 
    this.justchange= false;
}

//////////////////////////////////////
/// Request icons enabled-disabled ///  
enabled_disabled_toggles(id, selected_checkboxs, status){   
    let url = myGlobals.host+'/api/admin/settings/currency/change_status';
    let body=JSON.stringify({ currencys_code: id, status: status });
    console.log('Body del request del enabled-disabled: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .map( 
        response => {           
            this._currencies_service.get_currencies(this._currencies_service.search_currencies, {page : this._currencies_service.current_page})
            .subscribe((json_response) => {
                console.log(response.json())
            }, (err) => console.error(err),() => 
                this.caught_selected_inputs(id, selected_checkboxs)); 
                return this._currencies_service.list_id; //Send back response to the call of the method to use as event_type variable     
        }, error => {}
    ); 
}

////////////////////////////////////////////////////
/// Icon Edit mouseover Table Mapping amenities ///
mouseover_icon_edit(i){ 
  var icon_edit = '#' + i + 'icon-edit';
  jQuery(icon_edit).addClass('color-edit');
}

mouseleave_icon_edit(){
  jQuery('.fa-pencil, .fa-plus').removeClass('color-edit');
}

//////////////////////////////////////////////////
/// Show icon Delete table Mappings amenities ///
show_icon_currencies(){
  var inputs = jQuery('.check-table-cur');
  var count_true = 0;
      for(var i=0; i<inputs.length; i++){
          var checked = $('#checkbox' + i).is(":checked"); 
          if(checked == true){
            count_true++; //Count checkbox checked
            this.show_icon_cur = true;
          }
      } 
      if(inputs.length == count_true){ //If all inputs are check
          console.log('Estan todos seleccionados');            
          this.show_icon_cur = true;
      } else if(count_true == 0){ //If all inputs are unchecked
          console.log('Estan todos deseleccionados');           
          this.show_icon_cur = false;
      }
}

///////////////////////////////////////////////////
/// Enabled/disabled toogle multiple checkboxes ///
retrieve_currencies_all(){
    console.log('retrieve_currencies_all.');
    this._currencies_service.list_id = []; //Clean array
    var inputs = jQuery('.check-table-cur');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        console.log('check: '+i+' - estado :'+checked);
        if(checked == true){
            var id_content = $('#checkbox' + i).val();
            this._currencies_service.list_id.push(id_content);
        }
    }
    console.log('Array de id currencies' + this._currencies_service.list_id);
    var multiple_id = this._currencies_service.list_id;
    this.retrieve_currencies(multiple_id, this._currencies_service.list_id)
    .map(json_response => 
        console.log('Todos')).subscribe(); //Call request function 
    this.justchange= false;
}

////////////////////////////////////////////////////////////////////
/// Icons enabled-disable single of each checkboxes of the table ///
retrieve_currency(id){
    this._currencies_service.list_id = []; //Clean array
    this._currencies_service.list_id.push(id);
    var single_id = this._currencies_service.list_id;
    this._currencies_service.list_id = []; //Clean array
    var inputs = jQuery('.check-table-cur');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == true){
            var id_content = $('#checkbox' + i).val();
            this._currencies_service.list_id.push(id_content);            
        }
    }
    console.log('Array de id currencies' + this._currencies_service.list_id);
    this.retrieve_currencies(single_id, this._currencies_service.list_id)
    .map(json_response => 
        console.log('Individual')).subscribe(); //Call request function 
    this.justchange = false;
}

//////////////////////////////////////
/// Request icons enabled-disabled ///  
retrieve_currencies(id, selected_checkboxs){
    let url = myGlobals.host+'/api/admin/settings/currency/rate_update';
    let body=JSON.stringify({ list_id: id });
    console.log('Body del request de retrieve: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .map( 
        response => {           
            this._currencies_service.get_currencies(this._currencies_service.search_currencies, { page : 1})
            .subscribe((json_response) => {
                console.log(response.json())
            }, (err) => console.error(err),() => 
                this.caught_selected_inputs(id, selected_checkboxs)); 
                return this._currencies_service.list_id; //Send back response to the call of the method to use as event_type variable     
        }, error => {}
    ); 
}

////////////////////////////////////////////////////////////////////////////////
/// Verify all selected checkbox who were selected and restore the selection ///
caught_selected_inputs(id,list_selected){ 
     console.log('Lista de seleccionados: ' + list_selected);
    setTimeout(function(){
        var inputs = jQuery('.check-table-cur');
        var id_content;    
        for(var i=0; i<inputs.length; i++){    
        id_content = $('#checkbox' + i).val();  
            for(var x=0; x<list_selected.length; x++){
                 if(list_selected[x] == id_content){
                    $('#checkbox' + i).trigger('click');
                    console.log('Checkbox número: #checkbox' + i);
                }
            }
        }     
    }, 500)
}//Close caught_selected_inputs

//////////////////////////////////////////////////////////
/// Verify all changed inputs with the new rate value ///
caught_changed_inputs(list_selected){
    console.log('Lista de rates seleccionados: ' + list_selected);
    setTimeout(function(){
        var inputs = jQuery('.new-rate');
        var id_content;
        for(var i=0; i<inputs.length; i++){
        id_content = $('#newRate' + i).attr('name');
            for(var x=0; x<list_selected.length; x++){
                 if(list_selected[x] == id_content){
                    let list_new_rate;
                    var new_rate = $('#newRate' + i).val();
                    console.log('New rate número: #newRate' + i);
                }
            }
        }
    }, 500)
}//Close caught_selected_inputs

keyup_field_rate(i){
    //let rate_regex = /(?:\d*\.)?\d+/;
    //let rate_regex = /^[0-9]{1,2}([,.][0-9]{1,2})?/;
    var inputs = jQuery('#newRate' + i);
    let rate_regex = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/g;
    if(this._currencies_service.new_rates[i] != '' && (!rate_regex.test(this._currencies_service.new_rates[i]) || inputs.hasClass('ng-invalid'))) {
        this.validation_rate[i] = false;
    } else {
        this.validation_rate[i] = true; //Clean message
        jQuery('#newRate' + i).removeClass('border-errors');
    }

    /////// Gonza te dejo esto para que lo entiendas :) ////////
    //Empieza a verifcar los validation_rate
    for(var x=0; x<this.validation_rate.length; x++){ //Recorre el largo de inputs
        if(this.validation_rate[x] == false){ //Si llega a haber un validation_rate en false pasa validation_rate_save en false
            this.validation_rate_save = false;
        }
    }
    var count_true = 0; 
    var count_empty = 0; 
    for(var x=0; x<this.validation_rate.length; x++){
        if(this.validation_rate[x] == true){ //Por cada uno que esté en true le suma 1 al contador
          count_true++;  
        }
        if(this.validation_rate[x] == undefined){ //Por cada uno que esté indefinido le suma 1 al contador
          count_empty++;  
        }
    }
    var total = count_empty +  count_true; //Suma Total del count_empty y count_true
    if(total == this.validation_rate.length){ //Si la suma total de count_empty y count_true es igual al largo de validation_rate, pasa la propiedad validation_rate_save a true
        this.validation_rate_save = true;
    }
    console.log('contador de inputs vacíos + los que estén en true: ' + total);
    console.log('Largo de validation: ' + this.validation_rate.length);
}

isInvalid(){
    var rate_with_error = jQuery('.btn-red-md');
    if(rate_with_error.hasClass('disabled-save')){
        return true;
    } else{
        return false;
    }
}

save_currency_all(){
    this._currencies_service.list_id = [];
    this._currencies_service.list_new_rate = [];
    this._currencies_service.new_rates = [];
    var inputs = jQuery('.new-rate');
    //let rate_regex = /(?:\d*\.)?\d+/;
    let rate_regex = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/g;
    for(var i=0; i<inputs.length; i++){
        var rate = $('#newRate' + i).val();
        if (rate != undefined) {
            rate = rate.replace(',', '.');
            if(inputs.hasClass('ng-invalid')) {
                this.validation_rate_save = false;
                this.validation_rate[i] = false;
                jQuery('#newRate' + i).addClass('border-errors');
            } else {
                this.validation_rate_save = true; //Clean message
                this.validation_rate[i] = true;
                jQuery('#newRate' + i).removeClass('border-errors');
            }
        }
        var id = $('#newRate' + i).attr('name');
        const list_new_rate = {code: id, name: rate};
        var object_rate = list_new_rate;
        this._currencies_service.list_id.push(id);
        this._currencies_service.new_rates.push(rate);
        this._currencies_service.list_new_rate.push(object_rate);
        console.log('input: ' + i + ' - valor ingresado: ' + rate + '. ID: ' + this._currencies_service.list_id);
        console.log('Objeto con id y rate: ' + JSON.stringify(list_new_rate));
    }
    console.log('Lista de rates de currencies: ' + this._currencies_service.new_rates);
    console.log('Lista de id de currencies: ' + this._currencies_service.list_id);
    console.log('Lista de objetos: ' + this._currencies_service.list_new_rate);
    this.save_currencies(object_rate)
    .map(json_response => 
        console.log('Individual')).subscribe(); //Call request function 
    this.justchange = false;
}

save_currencies(object_rate){
    let url = myGlobals.host+'/api/admin/settings/currency/new_rate_update';
    let body = JSON.stringify({
        list_id_rate: this._currencies_service.list_new_rate
    });
    
    console.log('Body del botón save: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post( url, body, {headers: headers, withCredentials:true})
        .map(
            response => {
                this._currencies_service.get_currencies(this._currencies_service.search_currencies, {page : 1})
                .subscribe((json_response) => {
                    console.log(response.json())
                    this.after_save_cur();
                },
                (err) => console.error(err),() => 
                    this.caught_changed_inputs(object_rate)); 
                    return this._currencies_service.rate_id; //Send back response to the call of the method to use as event_type variable
            }, error => {}
        );
};

after_save_cur(){
    var inputs = jQuery('.new-rate');
    for(var i=0; i<inputs.length; i++){
        var rate = $('#newRate' + i).val();
        this._currencies_service.new_rates = [];
        this._currencies_service.new_rates.push(rate);
    }
}

cancel_cur(){
    this.validation_rate = []; //Clean all border errors
    this._currencies_service.new_rates = []; //Clean all inputs

    /*var inputs = jQuery('.new-rate');
    inputs.removeClass('border-errors'); //Esto ya no va porque lo estás haciendo con el ngClass
    for(var i=0; i<inputs.length; i++){ //El for no es necesario
        var rate = $('#newRate' + i).val('');
        this._currencies_service.new_rates = [];
        this._currencies_service.new_rates.push(rate);
    }*/
}

keyDownFunction(event) {
    if(event.keyCode == 13) {
         event.preventDefault();
    }
}


// ngOnDestroy = () => {
//     if (this.myPag) {
//         this.myPag.destroy();
//      }
// }

} // Close class Currencies