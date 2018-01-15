import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, NgZone, Input, ViewChild, ViewChildren, QueryList} from '@angular/core';
import {Widget } from '../../core/widget/widget';
import {RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {Idle, DEFAULT_INTERRUPTSOURCES} from 'ng2-idle/core'; //For timeout
import {DialogRef} from 'angular2-modal';
import {Observable} from 'rxjs/Observable';
import {CustomHttp} from '../../services/http-wrapper';
import {NKDatetime} from 'ng2-datetime/ng2-datetime'; //Datepicker
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NgClass} from '@angular/common';
import {Modal, BS_MODAL_PROVIDERS as MODAL_P} from 'angular2-modal/plugins/bootstrap'; //Modal
import {Core} from '../../core/core';
import {Location} from '@angular/common';
import myGlobals = require('../../../app');
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';
import {TitleService} from '../../core/navbar/titles.service';
import {editIfe} from './inline-ife/edit_inline_ife.service';
import {dropdownCurrency} from '../../components/dropdown_currency/dropdown_currency';
import {allAutocompletes} from '../../components/autocompletes/autocomplete';
import {allDatepicker} from '../../components/datepicker/datepicker';
import {RolloverAutocompletes} from '../../customers/rollovers-dropdown.service';
import {isNumeric} from 'rxjs/util/isNumeric';
import {filter} from '../filter';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: '[ife]',
  template: require('./ife.html'),
  directives: [ROUTER_DIRECTIVES, [NgClass], NKDatetime, [Widget], dropdownCurrency, allAutocompletes, allDatepicker],
  styles: [require('./ife.scss')],
  providers:[MODAL_P, Modal, allAutocompletes]
})

export class Ife {

    current_url = this._loc.path(); //Current url
    title_page: any; //Title page
    invoice: string;
    voucher: string;

    //Control width of screens
    view_port_width = true;
    fileOver: boolean = false;
    addImage: any;
    selectedPill:any = 1;
    currentStep = 1;
    status_type: any = 6; //STEP 2
    reservation_code_locator: any = '';
    name: any = '';

    //Dates Step 1
    date_step_1_general_Start:any;
    date_step_1_hotel_Start:any;
    date_step_1_transfer_Start:any;
    date_step_1_car_Start:any;
    date_step_1_insurance_Start:any;
    date_step_1_general_End:any;
    date_step_1_hotel_End:any;
    date_step_1_transfer_End:any;
    date_step_1_car_End:any;
    date_step_1_insurance_End:any;
    //STEP 1: Error message
    service_name_error: any;
    message_service_name: any;
    service_date_start: any; 
    message_service_date_start: any;
    service_date_end: any;
    message_service_date_end: any;
    service_address_hotel: any;
    message_address_hotel: any;
    service_hotel_room_type: any;
    message_hotel_room_type: any;
    service_transfer_from: any;
    message_transfer_from: any;
    service_transfer_to: any;
    message_transfer_to: any;
    service_car_rental_comp: any;
    message_car_rental_comp: any;
    service_insu_place_coverage: any;
    message_service_insu_place_coverage: any;
    service_insu_policy: any;
    message_insu_policy: any;
    error_description: any;
    message_description: any;

    //Step 2
    passenger_object = [];
    passanger_array = [1];
    counter = 1;
    hide_add_button = true;
    conf_number: any;
    pax_name = [];
    pax_name_header_collapse = [];
    surname = [];
    surname_header_collapse = [];
    document_type = [];
    document_type_header_collapse = [];
    age = [];
    age_header_collapse = [];
    birthday = [];
    birthday_header_collapse = [];
    identification_types: any; //Request Dropdown
    type_doc_name = []; //Request Dropdown
    type_doc_code = []; //Request Dropdown
    disabled_save = [];
    counter_disabled_save = 0;
    
    //Step 2: Message error Fields Passenger Name and Surname
    passenger_error: any;
    message_passenger: any;
    error_pax_name_indexer = [];
    error_pax_surname_indexer = [];

    //STEP 3
    is_default :any;
    currency_symbols: any; //Dropdown Provider Cost, Taxes and Client sale
    currency_code = 4; //Dropdown Provider Cost, Taxes and Client sale
    dropdown_symbol = '$'; //Dropdown Provider Cost, Taxes and Client sale
    currency_default_symbol = [];
    taxes: any = [];
    change_text = ['Taxes']; //Field Taxes
    store_change_text = ['Taxes']; //Field Edit Taxes
    taxes_array = [1];
    taxes_counter = 1;
    provider_cost: any = '';
    client_commission: any = '';
    net_rate: any = '';
    client_sale: any = '';
    selected_currency: any; //Fields net_rate, client_sale and client_commission
    prices: any;
    code_currency: any;
    remarks: any;
    warning_visible: boolean = false;
    taxes_object  = []; //Taxes object to send to backend

    //Step 3: Error Message fields: Provider Cost, Client Commission and Client Sale and Taxes
    error_data: any;
    field_error: any;
    general_error: any;
    provider_error: any;
    message_provider: any;
    provider_cost_error: any;
    message_provider_cost: any;
    provider_client_sale: any;
    message_client_sale: any;
    provider_client_comm: any;
    message_client_comm: any;    
    error_message: any;
    error_client_sale: any;
    error_prov_cost:any;
    error_client_comm:any;
    error_list: any;
    error_taxes_indexer = [];
    message_list: any;

    //Step 4
    status_type_step4: any = []; 
    policies_array = [];
    counter_policies = 0;
    hide_add_button_pol = false;
    policies: any = [];
    disabled_save_4 = [];

    //Date Range
    date_range_start: any = [];
    date_range_end: any = [];
    //Error message Date Range
    error_policy_date_start_indexer = [];
    error_policy_date_end_indexer = [];

    //Dropdown currency
    currency_selected: any = [];
    code_selected: any = [];
    cost_input: any = [];
    description_step4: any = [];
    validation_dropdown_currency = []; //Dropdown It Will Cost
    //Error message Dropdown currency
    error_policy_cost_indexer = [];
    //Error message Datepickers
    error_policy_date_start = [];
    error_policy_date_end = [];

    //General error message after Save
    exist_error_ife: any; 
    general_error_ife: any; 
    error_field_ife: any;

    constructor(
        public _editIfe: editIfe,
        public http: Http,
        public params: RouteParams,
        public router: Router,
        public modal: Modal,
        viewContainer: ViewContainerRef,
        public _loc: Location,
        public load: LoadingGif,
        private ngZone: NgZone,
        public _titleService: TitleService,
        public _rol: RolloverAutocompletes,
        private ElementRef: ElementRef,
        public _filters: filter
    ){
        //Store imported Title in local title
        this.title_page = _titleService.title_page;
        this.changeMyTitle(); //Update Title

        //ReSize event
        window.onresize = (e) => {
            ngZone.run(() => {
                this.get_size();
            });
        };
    }//Close Constructor

    /////////////////////////////////////////////
    /// Get Data properties from subcomponets ///
    @ViewChild('date_step_1_general') datepicker_step_1_general: allDatepicker;
    @ViewChild('date_step_1_hotel') datepicker_step_1_hotel: allDatepicker;
    @ViewChild('date_step_1_transfer') datepicker_step_1_transfer: allDatepicker;
    @ViewChild('date_step_1_car') datepicker_step_1_car: allDatepicker;
    @ViewChild('date_step_1_insurance') datepicker_step_1_insurance: allDatepicker;

    @ViewChild('get_function_from_subcomponent_prov') //Autocomplte Provider 
    private autocomplete_subcomponent_prov: allAutocompletes;
    @ViewChild('get_function_from_subcomponent_city') //Autocomplte City 
    private autocomplete_subcomponent_city: allAutocompletes;
    @ViewChild('get_dropdown_client_sale')
    private dropdown_client_sale: dropdownCurrency; //Field Client sale, Client Commission and Net Rate are the same
    @ViewChild('get_dropdown_provider_cost')
    private dropdown_provider_cost: dropdownCurrency;
    @ViewChildren('get_dropdown_taxes') dropdown_taxes: QueryList<dropdownCurrency>; //Step 3: Dropdown taxes
   
    @ViewChildren('get_dropdown_will_cost') dropdown_will_cost: QueryList<dropdownCurrency>; //Step 4: Field It will cost
    @ViewChildren('get_dropdown_will_cost', {read: ElementRef}) dropdown_will_cost_element: QueryList<ElementRef>;
    @ViewChildren('date_step_4') datepicker_step_4: QueryList<allDatepicker>;

    ngOnInit(){       
        
        ////////////////////////////////////
        /// Get Data from params for IFE ///
        this.reservation_code_locator = this.params.get('reservation_code_locator');
        this.name = this.params.get('name') +' '+ this.params.get('lastname');

      
        this._filters.filter_by_bookings_or_files = this.params.get('search_type');
        //record_locator: this.reservation_code_locator = this.params.get('reservation_code_locator');
        this._filters.passenger_name = this.params.get('passenger_name');
        this._filters.will_auto_cancel = this.params.get('will_auto_cancel');
        this._filters.status = this.params.get('status');
        this._filters.service_type = this.params.get('service_type');
        this._filters.provider = this.params.get('provider');
        this._filters.agency_user = this.params.get('agency_user'); 
        this._filters.destination = this.params.get('destination');
        this._filters.date_created_from = this.params.get('date_created_from');
        this._filters.date_created_to = this.params.get('date_created_to');
        this._filters.date_travel_from = this.params.get('date_travel_from');
        this._filters.date_travel_to = this.params.get('date_travel_to');
        this._filters.order = this.params.get('order');
        var boolean_asc;
        if(this.params.get('asc') != null){ //If params is not empty store boolean
            boolean_asc = (this.params.get('asc') === "true");
        }else if(this.params.get('asc') == null){ //If params is empty store true
            boolean_asc = true;
        }
        this._filters.asc = boolean_asc;
        this._filters.number_of_page = Number(this.params.get('number_of_page'));

        this.load.show_loading_gif();

        //Refresh page after click go back button in the Browser
        (<any>window).onhashchange = function() {
            window.location.reload();
        }

        this.get_size();

        /////////////////////////////////////////////
        /// Open component at the top of the page ///
        $('html, body').animate({
            scrollTop: $("#scrollToHere").offset().top
        }, 0);

        ///////////////////////////
        /// Step 2 and 4 config ///
        this.disabled_save[0] = true; //Enabled Icon Add step 2
        this.disabled_save_4[0] = true; //Enabled Icon Add step 4

        /////////////////////
        /// Step 4 config ///
        this.status_type_step4[0] = 1;

        jQuery('#finalStep').hide(); //Hide error Success an buttons step 5 Before Save

    } //Close ngOnInit

    changeMyTitle() {
        this._titleService.change('Booking Workspace');
    }

    ///////////////////////////////////////////////////////
    /// Method for alocate div container of File Detail ///
    get_size(){
        var viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0); //width of viewport
        if(viewport_width < 1200){
            this.view_port_width = false;
        }else if(viewport_width > 1200) {
            this.view_port_width = true;
        }
        this.load.hide_loading_gif();
    }

    ////////////////////////////////////////////////////////////////////////////
    /// Implementación hiper mala para wizard, solo para ilustrar By Gonzalo ///
    ////////////////////////////////////////////////////////////////////////////
    show_activate_step1_to_step2(number){ //Simplifico el código en una función para llamarla dónde la necesite By Fernanda
        this.currentStep = number;
        if (jQuery('#serviceStepButton').hasClass('active')) {
            jQuery('#serviceStepButton').removeClass('active');
            jQuery('#serviceStepButton').addClass('inactive');
        } else {
            jQuery('#serviceStepButton').removeClass('active');
        }
        //jQuery('#serviceStepButton').removeClass('active');
        if (jQuery('#passengerStepButton').hasClass('inactive')) {
            jQuery('#passengerStepButton').removeClass('inactive');
            jQuery('#passengerStepButton').addClass('active');
        } else {
            jQuery('#passengerStepButton').addClass('active');
        }
        //jQuery('#passengerStepButton').addClass('active');
        jQuery('#pricesStepButton').removeClass('active');
        jQuery('#policiesStepButton').removeClass('active');
        // jQuery('#servicestep').hide();
        // jQuery('#passengerStep').show();
        // jQuery('#pricesStep').hide();
        // jQuery('#policiesStep').hide();
        jQuery('.wizard-progress-bar .progress').removeClass('progress-step1');
        jQuery('.wizard-progress-bar .progress').addClass('progress-step2');
        jQuery('.wizard-progress-bar .progress').removeClass('progress-step3');
        jQuery('.wizard-progress-bar .progress').removeClass('progress-step4');
    }

    showServiceStep(number){
        if(this.exist_error_ife == false){
            //Inactive Stepsbuttons 
        } else {
            this.currentStep = number;

            if (jQuery('#serviceStepButton').hasClass('inactive')) {
                jQuery('#serviceStepButton').removeClass('inactive');
                jQuery('#serviceStepButton').addClass('active');
            } else {
                jQuery('#serviceStepButton').addClass('active');
            }
            //jQuery('#serviceStepButton').addClass('active');
            jQuery('#passengerStepButton').removeClass('active');
            jQuery('#pricesStepButton').removeClass('active');
            jQuery('#policiesStepButton').removeClass('active');
            // jQuery('#servicestep').show();
            // jQuery('#passengerStep').hide();
            // jQuery('#pricesStep').hide();
            // jQuery('#policiesStep').hide();
            jQuery('.wizard-progress-bar .progress').addClass('progress-step1');
            jQuery('.wizard-progress-bar .progress').removeClass('progress-step2');
            jQuery('.wizard-progress-bar .progress').removeClass('progress-step3');
            jQuery('.wizard-progress-bar .progress').removeClass('progress-step4');
        } //Close else
    }

    showPassengerStep(number){
        if(this.exist_error_ife == false ){
           //Inactive Stepsbuttons  
        } else {
            if(this.selectedPill == 1){
                if(this._editIfe.serviceName_general != undefined && this._editIfe.descriptionGeneral != undefined && this.datepicker_step_1_general.are_not_completes == false){
                    this.show_activate_step1_to_step2(number);
                }
            } else if(this.selectedPill == 2){
                if(this._editIfe.serviceName_hotel != undefined && this._editIfe.address_hotel != undefined && this._editIfe.room_type_hotel && this.datepicker_step_1_hotel.are_not_completes == false){
                    this.show_activate_step1_to_step2(number);
                }
            } else if(this.selectedPill == 4){
                if(this._editIfe.serviceName_transfer != undefined && this._editIfe.from_transfer != undefined && this._editIfe.to_transfer && this.datepicker_step_1_transfer.are_not_completes == false){
                    this.show_activate_step1_to_step2(number);
                }
            } else if(this.selectedPill == 5){
                if(this._editIfe.serviceName_car != undefined && this._editIfe.service_description_car != undefined && this.datepicker_step_1_car.are_not_completes == false){
                    this.show_activate_step1_to_step2(number);
                }
            } else if(this.selectedPill == 6){
                if(this._editIfe.serviceName_insurance != undefined && this._editIfe.place_coverage_insurance != undefined && this._editIfe.policy_detail_insurance != undefined && this.datepicker_step_1_insurance.are_not_completes == false){
                    this.show_activate_step1_to_step2(number);
                }
            } 
        }
    }

    showPricesStep(number){
        if(this.exist_error_ife == false){
            //Inactive Stepsbuttons 
        } else {
            if(this.pax_name_header_collapse[0] != undefined && this.pax_name_header_collapse[0] != '' && this.surname_header_collapse[0] != undefined && this.surname_header_collapse[0] != ''){
                this.currentStep = number;
                if (jQuery('#serviceStepButton').hasClass('active')) {
                    jQuery('#serviceStepButton').removeClass('active');
                    jQuery('#serviceStepButton').addClass('inactive');
                } else {
                    jQuery('#serviceStepButton').removeClass('active');
                }
                if (jQuery('#passengerStepButton').hasClass('active')) {
                    jQuery('#passengerStepButton').removeClass('active');
                    jQuery('#passengerStepButton').addClass('inactive');
                } else {
                    jQuery('#passengerStepButton').removeClass('active');
                }
                if (jQuery('#pricesStepButton').hasClass('inactive')) {
                    jQuery('#pricesStepButton').removeClass('inactive');
                    jQuery('#pricesStepButton').addClass('active');
                } else {
                    jQuery('#pricesStepButton').addClass('active');
                }
                /*jQuery('#serviceStepButton').removeClass('active');
                jQuery('#passengerStepButton').removeClass('active');
                jQuery('#pricesStepButton').addClass('active');*/
                jQuery('#policiesStepButton').removeClass('active');
                // jQuery('#servicestep').hide();
                // jQuery('#passengerStep').hide();
                // jQuery('#pricesStep').show();
                // jQuery('#policiesStep').hide();
                jQuery('.wizard-progress-bar .progress').removeClass('progress-step1');
                jQuery('.wizard-progress-bar .progress').removeClass('progress-step2');
                jQuery('.wizard-progress-bar .progress').addClass('progress-step3');
                jQuery('.wizard-progress-bar .progress').removeClass('progress-step4');
            }
        }
    }

    showPoliciesStep(number){
        if(this.exist_error_ife == false){
            //Inactive Stepsbuttons 
        } else {
            if(this.provider_cost != undefined && this.client_commission != undefined && this.net_rate != undefined && this.taxes[0] != undefined && this.client_sale != undefined && this.autocomplete_subcomponent_prov.relation_name != undefined){
                this.currentStep = number;
                if (jQuery('#serviceStepButton').hasClass('active')) {
                    jQuery('#serviceStepButton').removeClass('active');
                    jQuery('#serviceStepButton').addClass('inactive');
                } else {
                    jQuery('#serviceStepButton').removeClass('active');
                }
                if (jQuery('#passengerStepButton').hasClass('active')) {
                    jQuery('#passengerStepButton').removeClass('active');
                    jQuery('#passengerStepButton').addClass('inactive');
                } else {
                    jQuery('#passengerStepButton').removeClass('active');
                }
                if (jQuery('#pricesStepButton').hasClass('active')) {
                    jQuery('#pricesStepButton').removeClass('active');
                    jQuery('#pricesStepButton').addClass('inactive');
                } else {
                    jQuery('#pricesStepButton').removeClass('active');
                }
                if (jQuery('#policiesStepButton').hasClass('inactive')) {
                    jQuery('#policiesStepButton').removeClass('inactive');
                    jQuery('#policiesStepButton').addClass('active');
                } else {
                    jQuery('#policiesStepButton').addClass('active');
                }
                /*jQuery('#serviceStepButton').removeClass('active');
                jQuery('#passengerStepButton').removeClass('active');
                jQuery('#pricesStepButton').removeClass('active');
                jQuery('#policiesStepButton').addClass('active');*/
                // jQuery('#servicestep').hide();
                // jQuery('#passengerStep').hide();
                // jQuery('#pricesStep').hide();
                // jQuery('#policiesStep').show();
                jQuery('.wizard-progress-bar .progress').removeClass('progress-step1');
                jQuery('.wizard-progress-bar .progress').removeClass('progress-step2');
                jQuery('.wizard-progress-bar .progress').removeClass('progress-step3');
                jQuery('.wizard-progress-bar .progress').addClass('progress-step4');
            }
        }
    }

 backStep(){
     if(this.currentStep != 1) {
        this.currentStep -= 1;
    }
 }

// Step 1
dragover(e) {
    e.stopPropagation();
    e.preventDefault();
    this.fileOver = true;
    return false;
}

dragleave(){
    this.fileOver = false;
    return false;
}

onDrop(e) {
//     this.fileOver = false;
//     e.preventDefault();
//     console.log(e.dataTransfer.files[0]);

//      if ((/^image\/(gif|png|jpeg)$/i).test(e.dataTransfer.files[0].type)) {
//       var reader = new FileReader(e.dataTransfer.files[0]);

//       reader.readAsDataURL(e.dataTransfer.files[0]);

//       reader.onload = function(e) {
//         var data = e.target.result,
//             $img = $('<img />').attr('src', data).fadeIn();

//         $('#dropzone div').html($img);
//       };
//     } else {
//       var ext = e.dataTransfer.files[0].name.split('.').pop();

//       $('#dropzone div').html(ext);
//     }
}

changeListener($event, type) : void {
    this.readFile($event.target.files[0], function(e) {
        $('#imageContainer'+type).html( $('<img style="width:158px; height:158px;" />').attr('src', e.target.result));
    });
}

readFile(file, onLoadCallback){
    var reader = new FileReader();
    reader.onload = onLoadCallback;
    reader.readAsDataURL(file);
}

selectPill(selected){
    this.selectedPill = selected;
}

nextStep(){
    if(this.currentStep != 4) {
        if(this.currentStep == 1) {
            if(this.selectedPill == 1){
                if(this._editIfe.serviceName_general != undefined && this._editIfe.descriptionGeneral != undefined && this.datepicker_step_1_general.are_not_completes == false){
                    this.currentStep += 1;
                }
            } else if(this.selectedPill == 2){
                if(this._editIfe.serviceName_hotel != undefined && this._editIfe.address_hotel != undefined && this._editIfe.room_type_hotel && this.datepicker_step_1_hotel.are_not_completes == false){
                    this.currentStep += 1;
                }
            } else if(this.selectedPill == 4){
                if(this._editIfe.serviceName_transfer != undefined && this._editIfe.from_transfer != undefined && this._editIfe.to_transfer && this.datepicker_step_1_transfer.are_not_completes == false){
                    this.currentStep += 1;
                }
            } else if(this.selectedPill == 5){
                if(this._editIfe.serviceName_car != undefined && this._editIfe.service_description_car != undefined && this.datepicker_step_1_car.are_not_completes == false){
                    this.currentStep += 1;
                }
            } else if(this.selectedPill == 6){
                if(this._editIfe.serviceName_insurance != undefined && this._editIfe.place_coverage_insurance != undefined && this._editIfe.policy_detail_insurance != undefined && this.datepicker_step_1_insurance.are_not_completes == false){
                    this.currentStep += 1;
                }
            } 
        } else if(this.currentStep == 2) {
            if(this.pax_name_header_collapse[0] != undefined && this.pax_name_header_collapse[0] != '' && this.surname_header_collapse[0] != undefined && this.surname_header_collapse[0] != ''){
                this.currentStep += 1;
            }
        } else if(this.currentStep == 3){
            if(this.provider_cost != undefined && this.client_commission != undefined && this.net_rate != undefined && this.taxes[0] != undefined && this.client_sale != undefined && this.autocomplete_subcomponent_prov.relation_name != undefined){
                this.currentStep += 1;
            }
        }         
    }
}

cancelStep(){
    //STEP 1: Cancel fields Service Type "General" 
    this._editIfe.serviceName_general = undefined;
    this.message_service_name = undefined;
    this.message_description = undefined;
    this.datepicker_step_1_general.date_range_start = undefined;
    this.datepicker_step_1_general.date_range_end = undefined;
    this.datepicker_step_1_general.border_error_from = false;
    this.datepicker_step_1_general.border_error_to = false;
    this.message_service_date_start = undefined;
    this.message_service_date_end = undefined;
    this._editIfe.descriptionGeneral = undefined;
    this.datepicker_step_1_general.show_text();

    //STEP 1: Cancel fields Service Type "Hotel"
    this._editIfe.serviceName_hotel = undefined;
    this.datepicker_step_1_hotel.date_range_start = undefined;
    this.datepicker_step_1_hotel.date_range_end = undefined;
    this.datepicker_step_1_hotel.border_error_from = undefined;
    this.datepicker_step_1_hotel.border_error_to = undefined;
    this._editIfe.address_hotel = undefined;
    this.message_address_hotel = undefined;
    this._editIfe.room_type_hotel = undefined;
    this.message_hotel_room_type = undefined;
    this._editIfe.description_hotel = undefined;
    this.datepicker_step_1_hotel.show_text();

    //STEP 1: Cancel fields Service Type "Transfer"
    this._editIfe.serviceName_transfer = undefined;;
    this.datepicker_step_1_transfer.date_range_start = undefined;
    this.datepicker_step_1_transfer.date_range_end = undefined;
    this.datepicker_step_1_transfer.border_error_from = undefined;
    this.datepicker_step_1_transfer.border_error_to = undefined;
    this._editIfe.from_transfer = undefined;
    this.message_transfer_from = undefined;
    this._editIfe.to_transfer = undefined;
    this.message_transfer_to = undefined;
    this._editIfe.provided_by_transfer = undefined;
    this.autocomplete_subcomponent_city.relation_name = undefined;
    this.autocomplete_subcomponent_city.state_validate = true;
    this.autocomplete_subcomponent_city.exist_error = false;
    this.autocomplete_subcomponent_city.error_field = undefined;
    this.autocomplete_subcomponent_city.border_active = false;
    this._editIfe.pickUp_transfer = undefined;
    this._editIfe.dropOff_transfer = undefined;
    this.datepicker_step_1_transfer.show_text();

    //STEP 1: Cancel fields Service Type "Car"
    this._editIfe.serviceName_car = undefined;
    this.datepicker_step_1_car.date_range_start = undefined;
    this.datepicker_step_1_car.date_range_end = undefined;
    this.datepicker_step_1_car.border_error_from = undefined;
    this.datepicker_step_1_car.border_error_to = undefined;
    this._editIfe.car_details = undefined;
    this._editIfe.service_description_car = undefined;
    this.message_car_rental_comp = undefined;
    this._editIfe.car_insurance = undefined;
    this.datepicker_step_1_car.show_text();

    //STEP 1: Cancel fields Service Type "Insurance"
    this._editIfe.serviceName_insurance = undefined;
    this.datepicker_step_1_insurance.date_range_start = undefined;
    this.datepicker_step_1_insurance.date_range_end = undefined;
    this.datepicker_step_1_insurance.border_error_from = undefined;
    this.datepicker_step_1_insurance.border_error_to = undefined;
    this._editIfe.place_coverage_insurance = undefined;
    this.message_service_insu_place_coverage = undefined;
    this._editIfe.policy_detail_insurance = undefined;
    this.message_insu_policy = undefined;
    this._editIfe.service_description_insurance = undefined;
    this.datepicker_step_1_insurance.show_text();
}

selectPricipalPill(number){
    if(this.exist_error_ife == false){
        //Inactive Stepsbuttons 
    } else {
        this.currentStep = number;
    }    
}

//////////////////////////////////////////////////////// SPEP 2(FERNANDA) /////////////////////////////////////////////////////

    show_status(type){ //Store type of Status
        this.status_type = type;
    }

    add_new_passenger(){ //Add new Passenger Form
        this.counter_disabled_save = this.counter_disabled_save+1;
        this.passanger_array.push(this.counter+1);
        this.hide_add_button = true;
        this.disabled_save[this.counter_disabled_save] = true; //Disable icon Add
    }

    cancel_add_new_passenger(i){ //Remove from into Collapse
        var select = '#paxOneInfo' + i;
        $(select).collapse('toggle');
        jQuery('.passengerCross').tooltip('hide'); //Hide tooltip "Cancel"
        this.passanger_array.splice(i, 1);
        this.hide_add_button = false;
        this.pax_name_header_collapse.splice(i, 1);
        this.surname_header_collapse.splice(i, 1);
        this.document_type_header_collapse.splice(i, 1);
        this.age_header_collapse.splice(i, 1);
        this.birthday_header_collapse.splice(i, 1);
        this.pax_name.splice(i, 1);
        this.surname.splice(i, 1);
        this.document_type.splice(i, 1);
        this.age.splice(i, 1);
        this.birthday.splice(i, 1);
        this.type_doc_name[i] = 'ID TYPE';
        this.type_doc_code[i] = undefined;
    }

  hide_button_add(i){ //Hide Button Add after click Collapse
      this.hide_add_button = !this.hide_add_button;
  }

  save_add_new_passenger(i){
    if(this.age[i] > 2 || this.age[i] == undefined || this.age[i] == ''){ //Field birthday
      if(this.pax_name[i] != undefined && this.pax_name[i] != '' && this.surname[i] != undefined && this.surname[i] != ''){
        var select = '#paxOneInfo' + i;
        $(select).collapse('toggle');
        this.hide_add_button = false;
        this.pax_name_header_collapse[i] = this.pax_name[i];
        this.surname_header_collapse[i] = this.surname[i];
        this.document_type_header_collapse[i] = this.document_type[i];
        this.age_header_collapse[i] = this.age[i];
        this.birthday_header_collapse[i] = '';
        this.birthday[i] = '';
        this.make_object_for_passanger(i);
      } //Close second if
    } //Close first if
    else {
       if(this.birthday[i] != undefined && this.birthday[i] != ''){
        this.hide_add_button = false;
        var select = '#paxOneInfo' + i;
        $(select).collapse('toggle');
        this.pax_name_header_collapse[i] = this.pax_name[i];
        this.surname_header_collapse[i] = this.surname[i];
        this.document_type_header_collapse[i] = this.document_type[i];
        this.age_header_collapse[i] = this.age[i];
        this.birthday_header_collapse[i] = this.birthday[i];
        this.make_object_for_passanger(i);
      } //Close second if
    }
  }

    check_inputs(i){
      this.error_pax_name_indexer[i] = undefined; //Clean error
      this.error_pax_surname_indexer[i] = undefined; //Clean error
      if(this.pax_name[i] != undefined && this.surname[i] != undefined){
          this.disabled_save[i] = false;
      }
    }

    make_object_for_passanger(i){
        this.passenger_object[i] = {
            "code": this.type_doc_code[i],
            "passenger_type": "", //vacía porque no está en el wireframe
            "name_first": this.pax_name[i], 
            "name_last": this.surname[i],
            "document": "", //Ana me dice que se la mande vacía
            "birthdate": this.birthday[i],
            "nationality": "", //No está Nationality en el IFE así que lo mando vacío
            "age": this.age[i], //OJO debo mandar un entero
            "travel_document_type": this.type_doc_name[i],
            "travel_document_number": this.document_type[i] //Field ID Number
        };
    }

    ///////////////////////////////
    /// Age only numbers ///
    validateOnlyNumbers(i, e) { 
        var key = e.keyCode || e.charCode;
        if( key == 8  ){} else{this.age[i] =  Math.round(this.age[i]);} 
    }
   
    ///////////////////////////////////////////////////////
    /// Request data list Field Type Document(Dropdown) ///
    get_list_type_document(i) {
      let url = myGlobals.host+'/api/admin/identification_passenger_get';
      let headers = new Headers({ 'Content-Type': 'application/json' });

          this.http.get( url, {headers: headers, withCredentials:true})
            .subscribe(
              response => {
                console.log('RESPUESTA IFE(TYPE DOCUMENTS DROPDOWN): ' + JSON.stringify(response.json()));
                this.identification_types = response.json().identification_types;
              }, error => {}
          );
    }

  editing_type_doc(i){ //Click div
    jQuery('#typeDocs' + i).show();

    //Call request Dropdown List Type Document
    this.get_list_type_document(i);
  } // Close request get_list_type_document

  ////////////////////////////////////////////////////////////
  /// Section IFE: Select field Type Document for Dropdown ///
  select_type_doc(type_doc_name, type_doc_code, i){
      this.type_doc_name[i] = type_doc_name;
      console.log('Select type doc name: ' + this.type_doc_name[i]);
      this.type_doc_code[i] = type_doc_code;
      console.log('Select type doc code: ' + this.type_doc_code[i]);
      jQuery('#typeDocs' + i).hide();
  }

//////////////////////////////////////////////////////////////////// STEP 3(FERNANDA) ///////////////////////////////////////////////////
  
  ////////////////////////////////////////////////////////
  /// Notify autocomplete event to close autocompletes ///
  notify_event_to_autocomplete(){
    this.autocomplete_subcomponent_prov.notifyMe(); //Autocomplete Providers    
    this.autocomplete_subcomponent_city.notifyMe(); //Autocomplete Providers
  }

  ////////////////////////
  /// Field Edit Taxes ///
  edit_change_text(i){
    this.store_change_text[i] = this.change_text[i];
    jQuery('#editPrice' + i).show();
    jQuery('#currentPrice' + i).show();
    jQuery('#newPrice' + i).hide(); 
    this.save_taxes(i);
  }

  editPrice(i){
    jQuery('#editPrice' + i).hide();
    jQuery('#currentPrice' + i).hide();
    jQuery('#newPrice' + i).show();
  }

  cancel_edit_change_text(i){
    this.change_text[i] = this.store_change_text[i];
    jQuery('#editPrice' + i).show();
    jQuery('#currentPrice' + i).show();
    jQuery('#newPrice' + i).hide();  
  }

  ///////////////////////////////////////
  /// ICON ADD/PLUS: Create new Taxes ///
  add_new_tax(){
      this.taxes_counter++;
      this.taxes_array.push(this.taxes_counter);
      if(this.taxes_counter < 2){
          this.change_text[this.taxes_counter-1] = 'Taxes';
          this.store_change_text[this.taxes_counter-1] = 'Taxes';
      }else{
          this.change_text[this.taxes_counter-1] = 'Taxes ' + this.taxes_counter ;
          this.store_change_text[this.taxes_counter-1] = 'Taxes ' + this.taxes_counter ;
      }    
  }

  //////////////////////////////////////
  /// ICON DELETE: Remove new Taxes ///
  remove_new_tax(i){
      this.taxes_counter--;
      this.taxes_array.splice(i,1);
      this.taxes.splice(i,1); 
  }

    save_taxes(i){
        this.error_taxes_indexer[i] = undefined; //Clean error
        this.taxes_object[i] =  {
            "value": this.taxes[i], //Input value
            "currency": this.dropdown_taxes.toArray()[i].currency_code, //Code currency viewchild
            "name": this.store_change_text[i] //editadle de taxes
        }
    }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /// Request for Keyup event to Calculate Net rate on fields Providers Cost, Client commission and Client Sale ///
  calculate_net_rate() {
    ///////////////////////////
    /// Clean error message ///
    this.net_rate = undefined;  
    this.general_error = undefined;  
    this.error_prov_cost = undefined; 
    this.error_client_comm = undefined;
    this.error_client_sale = undefined;
    this.message_provider_cost = undefined; //Step 3 Field Provider Cost request Save
    this.message_client_sale = undefined; //Step 3 Field Client Sale request Save
    this.message_client_comm = undefined; //Step 3 Field Client Commission request Save
    jQuery('#net-rate').removeClass('border-errors');
    jQuery('#prov-cost').removeClass('border-errors');
    jQuery('#client-comm').removeClass('border-errors');
    jQuery('#client-sale').removeClass('border-errors');
                        
    let url = myGlobals.host+'/api/admin/ife/calculation_net_rate';
    let body = JSON.stringify({
        "prices":{
            provider_cost_currency: this.dropdown_provider_cost.currency_code, 
            provider_cost: this.provider_cost, 
            client_commision_currency: this.dropdown_client_sale.currency_code, 
            client_commision: this.client_commission,
            net_rate_currency: this.dropdown_client_sale.currency_code,
            net_rate: this.net_rate,
            client_sale_currency: this.dropdown_client_sale.currency_code,
            client_sale: this.client_sale
        }
    });

    let headers = new Headers({ 'Content-Type': 'application/json' });
    console.log('BODY CALCULATE NET RATE: ' + body);

      this.http.post(url, body, {headers: headers, withCredentials:true})
        .subscribe(
          response => {
            console.log('RESPUESTA (NET RATE CALCULATE): ' + JSON.stringify(response.json()));           
            /// Errors open ///
            this.error_data = response.json().error_data;
            
            if(this.error_data.exist_error == true){
                this.general_error = response.json().error_data.general_error;
                if(this.general_error != undefined && this.general_error != ''){
                    //jQuery('#net-rate').addClass('border-errors');
                }

                var error_field = response.json().error_data.error_field_list;
                console.log('error_field: ' + JSON.stringify(error_field));
                for(var x = 0; x<error_field.length; x++){
                    this.field_error = response.json().error_data.error_field_list[x].field;
                    this.error_message = response.json().error_data.error_field_list[x].message;
                    if(this.field_error == 'provider_cost'){
                        jQuery('#prov-cost').addClass('border-errors');
                        this.error_prov_cost = this.error_message;
                        console.log('MENSAJEEEEE provider_cost: ' + JSON.stringify(this.error_prov_cost));
                    }
                    if(this.field_error == 'client_commision'){
                        jQuery('#client-comm').addClass('border-errors');
                        this.error_client_comm = this.error_message;
                        console.log('MENSAJEEEEE client_commision: ' + JSON.stringify(this.error_client_comm));
                    }
                    if(this.field_error == 'client_sale'){
                        jQuery('#client-sale').addClass('border-errors');
                        this.error_client_sale = this.error_message;
                        console.log('MENSAJEEEEE client_sale: ' + JSON.stringify(this.error_client_sale));
                    }
                }
            } else {
                this.general_error = response.json().error_data.general_error;
            }/// Errors end ///

            ////////// Price open ///////////
            this.prices = response.json().prices;
            this.net_rate = this.prices.net_rate;
            /// Price end ///
          }, error => {}
      );
  } //Close request calculate_net_rate

  
  show_status_step4(type, i){ //Store type of Radio Buttons select
        this.status_type_step4[i] = type;
        if(type == 4){
            this.dropdown_will_cost_element.toArray()[i].nativeElement.classList.add('disabled-col');
            this.dropdown_will_cost_element.toArray()[i].nativeElement.querySelector('button').style.opacity = '0.4';
        }else{
            this.dropdown_will_cost_element.toArray()[i].nativeElement.classList.remove('disabled-col');
            this.dropdown_will_cost_element.toArray()[i].nativeElement.querySelector('button').style.opacity = '1';
        }
   }

  disable_input(e, i){
      if(this.status_type_step4[i] == 4){
           e.stopPropagation();
      }     
  }

  add_new_policy(){ //Add new Policy Form
    this.counter_policies = this.counter_policies + 1;
    this.policies_array.push(this.counter_policies);
    this.hide_add_button_pol = true;
    this.status_type_step4[this.counter_policies] = 1;
    this.disabled_save_4[this.counter_policies] = true;
  }

   hide_button_add_pol(i){ //Hide Button Add after click Collapse
      this.hide_add_button_pol = !this.hide_add_button_pol;
      this.datepicker_step_4.toArray()[i].empty_text();
  }

  save_add_new_policy(i){
      var date_from = this.datepicker_step_4.toArray()[i].date_range_start;
      var date_to = this.datepicker_step_4.toArray()[i].date_range_end;

      var selected_currency = this.dropdown_will_cost.toArray()[i].dropdown_symbol;
      var selected_currency_code = this.dropdown_will_cost.toArray()[i].currency_code;

      if(this.status_type_step4[i] == 4){ //only if payment
          if(date_from != undefined && date_to != undefined){ //if dates are selected enable add button
              $('#policyOneInfo'+i).collapse('toggle');
              this.hide_add_button_pol = false;
              this.date_range_start[i] = date_from;
              this.date_range_end[i] = date_to;
              this.currency_selected[i] = '';
              this.code_selected[i] = '';
              this.cost_input[i] = '';
              this.make_object_for_backend(i);
           }

      } else{
          if(date_from != undefined && date_to != undefined && selected_currency != undefined && this.cost_input[i] != undefined && this.cost_input[i] != '' && this.validation_dropdown_currency[i] != false){ //if dates are selected enable add button
              $('#policyOneInfo'+i).collapse('toggle');
              this.hide_add_button_pol = false;
              this.date_range_start[i] = date_from;
              this.date_range_end[i] = date_to;
              this.currency_selected[i] = selected_currency;
              this.code_selected[i] = selected_currency_code;
              this.make_object_for_backend(i);
           }
      }
  }

  make_object_for_backend(i){
    if(this.datepicker_step_4.toArray()[i].from == undefined){ //If date are undefined fill with empty string
          this.datepicker_step_4.toArray()[i].from = '';
    }
    if(this.datepicker_step_4.toArray()[i].to == undefined){
          this.datepicker_step_4.toArray()[i].to = '';
    }

    this.policies[i] = {
        "policy_type":this.status_type_step4[i],
        "date_start":this.datepicker_step_4.toArray()[i].from,
        "date_end":this.datepicker_step_4.toArray()[i].to,
        "cost_value":this.cost_input[i],
        "cost_currency":this.code_selected[i],
        "description":this.description_step4[i]
    }     
  }

  cancel_add_new_policy(i){ //Remove from into Collapse
    $('#policyOneInfo'+i).collapse('toggle');
    jQuery('.passenger-cross').tooltip('hide'); //Hide tooltip "Cancel"
    this.counter_policies = this.counter_policies -1;
    this.hide_add_button_pol = false;
    this.validation_dropdown_currency[i] = true;
    //this.datepicker_step_4.toArray()[i].reset_dates(i);
    //this.datepicker_step_4.toArray().splice(i, 1);
    //this.datepicker_step_4.toArray().splice(i, 1);
    this.status_type_step4.splice(i, 1);
    this.date_range_start.splice(i, 1);
    this.date_range_end.splice(i, 1);
    this.currency_selected.splice(i, 1);
    this.code_selected.splice(i, 1);
    this.cost_input.splice(i, 1);
    this.description_step4.splice(i, 1);
    this.policies_array.splice(i, 1);
  }


  /////////////////////////////////////////////////////////
  /// Validation: inputs section It Will Cost(Dropdown) ///
  keyup_field_cost(type, i){
    var inputs = jQuery('#new-cost' + i);
    let rate_regex = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/g;

    //Dropdown It Will Cost
    if(type == 'cost'){
      if(this.cost_input[i] != '' && (!rate_regex.test(this.cost_input[i]) || inputs.hasClass('ng-invalid'))) {
        this.validation_dropdown_currency[i] = false;
      }else {
        this.validation_dropdown_currency[i] = true; //Clean message
      }
    }  
    //verify if input are filled
    if(this.datepicker_step_4.toArray()[i].are_not_completes == false && this.cost_input[i] != undefined && this.cost_input[i] != ''){
          this.disabled_save_4[i] = false;
      } else {
          this.disabled_save_4[i] = true;
    }

    this.error_policy_cost_indexer[i] = undefined; //Clean error message from backend
  }

  ////////////////////////////////////////////
  /// Inline editing: Buttons Save, Cancel ///
  rollover_icons_save_cancel(editing){
    jQuery(editing).tooltip('show');
  }

  ///////////////////////////////////////////////////
  /// Notify event of Datepicker - Date selection ///
  notify_date_selection(are_not_completes, i){
      if(this.status_type_step4[i] == 4){ //Only is selected Radio Button Payment
          if(are_not_completes == false){
              this.disabled_save_4[i] = false;
          } else {
              this.disabled_save_4[i] = true;
          }
      } else { 
          if(are_not_completes == false && this.cost_input[i] != undefined && this.cost_input[i] != ''){
              this.disabled_save_4[i] = false;
          } else {
              this.disabled_save_4[i] = true;
          }
      }      
  }

  ///////////////////////////////////////////
  /// Clean error message Datepicker From ///
  notify_from_selection(are_not_completes, i){
       this.message_service_date_start = undefined;
  }

  /////////////////////////////////////////
  /// Clean error message Datepicker To ///
  notify_to_selection(are_not_completes, i){
       this.message_service_date_end = undefined;
  }

   notify_from_selection_step4(are_not_completes, i){
       this.error_policy_date_start[i] = undefined;
  }

  /////////////////////////////////////////
  /// Clean error message Datepicker To ///
  notify_to_selection_step4(are_not_completes, i){
       this.error_policy_date_end[i] = undefined;
  }

  hide_error(){ //STEP 1 Field Service Name 
      this.message_service_name = undefined;
  }

  hide_error_des(){ //STEP 1 Field Description
      this.message_description = undefined;
  }

  hide_error_room_type_hotel(){ //STEP 1 Field Room Type
      this.message_hotel_room_type = undefined;
  }

  hide_error_address_hotel(){ //STEP 1 Field Address
      this.message_address_hotel = undefined;
  }

  hide_error_trans_from(){ //STEP 1 Field From
      this.message_transfer_from = undefined;
  }

  hide_error_trans_to(){ //STEP 1 Field To
      this.message_transfer_to = undefined;
  }

  hide_error_car_rental_comp(){ //STEP 1 Field Car rental company
      this.message_car_rental_comp = undefined;
  }

  hide_error_insu_place_coverage(){ //STEP 1 Field Place of Coverage
      this.message_service_insu_place_coverage = undefined;
  }

  hide_error_insu_policy(){ //STEP 1 Field Insurance Policy Details
      this.message_insu_policy = undefined;
  }

  clean_error_message_prov(e){ //STEP 3 Autocomplete Internal Providers 
      this.message_provider = undefined;
  }

  ///////////////////////////////////////////////////// REQUEST SAVE IFE (FERNANDA) ////////////////////////////////////////////////

  save_new_ife(){
      //Step 1
      var name;
      var description;
      var city_or_address;
      var date_from_step1;
      var date_to_step1;
      if(this.selectedPill == 1){
          name = this._editIfe.serviceName_general;
          description = this._editIfe.descriptionGeneral;
          date_from_step1 = this.datepicker_step_1_general.from;
          date_to_step1 = this.datepicker_step_1_general.to;
      } else if(this.selectedPill == 2){
          name = this._editIfe.serviceName_hotel;      
          description = this._editIfe.description_hotel;
          city_or_address = this._editIfe.address_hotel;
          date_from_step1 = this.datepicker_step_1_hotel.from;
          date_to_step1 = this.datepicker_step_1_hotel.to;
      } else if(this.selectedPill == 4){
          name = this._editIfe.serviceName_transfer;
          description = '';
          city_or_address = this.autocomplete_subcomponent_city.select_code_auto;
          date_from_step1 = this.datepicker_step_1_transfer.from;
          date_to_step1 = this.datepicker_step_1_transfer.to;
      } else if(this.selectedPill == 5){
          name = this._editIfe.serviceName_car;
          description = this._editIfe.car_details; 
          date_from_step1 = this.datepicker_step_1_car.from;
          date_to_step1 = this.datepicker_step_1_car.to;
      } else if(this.selectedPill == 6){
          name = this._editIfe.serviceName_insurance;
          description = this._editIfe.service_description_insurance;
          date_from_step1 = this.datepicker_step_1_insurance.from;
          date_to_step1 = this.datepicker_step_1_insurance.to;
      }

      if(date_from_step1 == undefined){ // if date from step 1 is undefined fill with empty string
          date_from_step1 = '';
          
      }
      if(date_to_step1 == undefined){
          date_to_step1 = '';
      }
      
      this.load.show_loading_gif(); //Loading gif
      let url = myGlobals.host+'/api/admin/ife/create';

      let body = JSON.stringify({
          "ife": {
            "status": this.status_type, //Step 2 BOOKING STATUS
            "confirmation_number": this.conf_number, //Step 2
            "record_locator_file": this.reservation_code_locator, //ALL STEPS
            "remarks": this.remarks,  //Step 3
            "provider": this.autocomplete_subcomponent_prov.select_code_auto, //Step 3
            "service_data": { //Step 1
              "ife_type": this.selectedPill, 
              "image": "", //Mando la URL vacía hasta que no se defina cómo se va a mandar
              "service_name": name,
              "description": description, //car details or description
              "service_date_start": date_from_step1,
              "service_date_end": date_to_step1,
              "address_city": city_or_address, //code city or address
              "hotel_room_type": this._editIfe.room_type_hotel,
              "transfer_from": this._editIfe.from_transfer,
              "transfer_to": this._editIfe.to_transfer, 
              "transfer_provided_by": this._editIfe.provided_by_transfer,
              "transfer_pick_up": this._editIfe.pickUp_transfer,
              "transfer_drop_off": this._editIfe.dropOff_transfer,              
              "car_rental_company": this._editIfe.service_description_car,
              "car_insurance": this._editIfe.car_insurance,
              "insurance_place": this._editIfe.place_coverage_insurance,
              "insurance_policy": this._editIfe.policy_detail_insurance 
            },
            "passengers": this.passenger_object,
            "prices": {  //Step 3 VERIFICAR PORQUE ESTE UN ARRAY
              "taxes": this.taxes_object,
              "provider_cost_currency": this.dropdown_provider_cost.currency_code, //code viewchild
              "net_rate_currency": this.dropdown_client_sale.currency_code, //code viewchild
              "client_commision_currency": this.dropdown_client_sale.currency_code, //code viewchild
              "client_sale_currency": this.dropdown_client_sale.currency_code, //code viewchild
              "provider_cost": this.provider_cost,
              "net_rate": this.net_rate,
              "client_commision": this.client_commission,
              "client_sale": this.client_sale
            },
            "policies": this.policies
          }
        });

      console.log('body IFE: ' + body);
      let headers = new Headers({ 'Content-Type': 'application/json' });

        //if(this.state_validate_city_new_user == true || this.state_validate_agency_new_user == true){

          this.http.post(url, body, {headers: headers, withCredentials:true})
            .subscribe(
              response => {
                console.log('RESPONSE CREATE NEW IFE: ' + JSON.stringify(response.json()));
                this.load.hide_loading_gif(); //Remove loading gif
                this.exist_error_ife = response.json().error_data.exist_error;
                this.general_error_ife = response.json().error_data.general_error;
                this.error_field_ife = response.json().error_data.error_field_list;
                console.log('Error general: ' + JSON.stringify(this.general_error_ife));

                if(this.exist_error_ife == true){
                    for(var x=0; x<this.error_field_ife.length; x++){
                      this.service_name_error = response.json().error_data.error_field_list[x].field;
                      this.service_date_start = response.json().error_data.error_field_list[x].field;
                      this.service_date_end = response.json().error_data.error_field_list[x].field;
                      this.service_hotel_room_type = response.json().error_data.error_field_list[x].field;
                      this.service_address_hotel = response.json().error_data.error_field_list[x].field;
                      this.service_transfer_from = response.json().error_data.error_field_list[x].field;
                      this.service_transfer_to = response.json().error_data.error_field_list[x].field;
                      this.service_car_rental_comp = response.json().error_data.error_field_list[x].field;
                      this.service_insu_place_coverage = response.json().error_data.error_field_list[x].field;
                      this.service_insu_policy = response.json().error_data.error_field_list[x].field;
                      this.error_description = response.json().error_data.error_field_list[x].field;
                      this.passenger_error = response.json().error_data.error_field_list[x].field;
                      this.provider_error = response.json().error_data.error_field_list[x].field;
                      this.provider_cost_error = response.json().error_data.error_field_list[x].field;
                      this.provider_client_comm = response.json().error_data.error_field_list[x].field;
                      this.provider_client_comm = response.json().error_data.error_field_list[x].field;
                      this.error_list = response.json().error_data.error_field_list[x].field;
                      this.message_list = response.json().error_data.error_field_list[x].message;            

                      //STEP 1: Messages Error
                      if(this.service_name_error == 'service_name'){
                          this.message_service_name = response.json().error_data.error_field_list[x].message;
                      }

                      if(this.service_date_start == 'service_date_start'){
                          this.message_service_date_start = response.json().error_data.error_field_list[x].message;
                          //call subcomponent function to add error borders
                          this.datepicker_step_1_general.border_error_from = true;
                          this.datepicker_step_1_hotel.border_error_from = true;
                          this.datepicker_step_1_transfer.border_error_from = true;
                          this.datepicker_step_1_car.border_error_from = true;
                          this.datepicker_step_1_insurance.border_error_from = true;
                      }

                      if(this.service_date_end == 'service_date_end'){
                          this.message_service_date_end = response.json().error_data.error_field_list[x].message;
                          //call subcomponent function to add error borders
                          this.datepicker_step_1_general.border_error_to = true;
                          this.datepicker_step_1_hotel.border_error_to = true;
                          this.datepicker_step_1_transfer.border_error_to = true;
                          this.datepicker_step_1_car.border_error_to = true;
                          this.datepicker_step_1_insurance.border_error_to = true;
                      }

                      if(this.service_address_hotel == 'address_city'){
                          this.message_address_hotel = response.json().error_data.error_field_list[x].message;
                      }

                      if(this.service_hotel_room_type == 'hotel_room_type'){
                          this.message_hotel_room_type = response.json().error_data.error_field_list[x].message;
                      }

                      if(this.service_transfer_from == 'transfer_from'){
                          this.message_transfer_from = response.json().error_data.error_field_list[x].message;
                      }

                      if(this.service_transfer_to == 'transfer_to'){
                          this.message_transfer_to = response.json().error_data.error_field_list[x].message;
                      }

                      if(this.service_car_rental_comp == 'car_rental_company'){
                          this.message_car_rental_comp = response.json().error_data.error_field_list[x].message;
                      }

                      if(this.service_insu_place_coverage == 'insurance_place'){
                          this.message_service_insu_place_coverage = response.json().error_data.error_field_list[x].message;
                      }

                      if(this.service_insu_policy == 'insurance_policy'){
                          this.message_insu_policy = response.json().error_data.error_field_list[x].message;
                      }

                      if(this.error_description == 'description'){
                          this.message_description = response.json().error_data.error_field_list[x].message;            
                      } 

                      //STEP 2: Messages Error
                      if(this.passenger_error == 'passengers'){
                          this.message_passenger = response.json().error_data.error_field_list[x].message;
                      }

                      if(this.error_list.includes("-")){
                        if(this.error_list.includes("passenger_name_first")){
                            var indexer = this.error_list.match(/\d+/)[0];
                            indexer = parseInt(indexer);
                            this.error_pax_name_indexer[indexer] = this.message_list;                       
                        }  
                      }

                      if(this.error_list.includes("-")){
                        if(this.error_list.includes("passenger_name_last")){
                            var indexer = this.error_list.match(/\d+/)[0];
                            indexer = parseInt(indexer);
                            this.error_pax_surname_indexer[indexer] = this.message_list;                       
                        }  
                      } 

                      if(this.provider_error == 'provider'){
                          this.message_provider = response.json().error_data.error_field_list[x].message;
                          this.autocomplete_subcomponent_prov.border_active = true;
                      }

                      //ERRORS STEP 3: taxes an others errors
                      if(this.provider_cost_error == 'provider_cost'){
                          this.message_provider_cost = response.json().error_data.error_field_list[x].message;            
                      } 

                      if(this.provider_client_comm == 'client_commission'){
                          this.message_client_comm = response.json().error_data.error_field_list[x].message;            
                      } 

                      if(this.provider_client_sale == 'client_sale'){
                          this.message_client_sale = response.json().error_data.error_field_list[x].message;            
                      }

                      if(this.error_list.includes("-")){
                        if(this.error_list.includes("tax")){
                            var indexer = this.error_list.match(/\d+/)[0]; 
                            indexer = parseInt(indexer);
                            this.error_taxes_indexer[indexer] = this.message_list;                       
                        }  
                      
                        //ERRORS STEP 4: Policies                     
                        if(this.error_list.includes("policy_cost_value")){ //Error Dropdown currency
                            var indexer = this.error_list.match(/\d+/)[0]; 
                            indexer = parseInt(indexer);
                            this.error_policy_cost_indexer[indexer] = this.message_list;                       
                        }  
                                        
                        if(this.error_list.includes("policy_date_start")){ //Error Datepicker From
                            var indexer = this.error_list.match(/\d+/)[0]; 
                            indexer = parseInt(indexer);
                            this.error_policy_date_start[indexer] = this.message_list;   
                            this.datepicker_step_4.toArray()[indexer].border_error_from = true;
                                            
                        }                      
                      
                        if(this.error_list.includes("policy_date_end")){ //Error Datepicker To
                            var indexer = this.error_list.match(/\d+/)[0]; 
                            indexer = parseInt(indexer);
                            this.error_policy_date_end[indexer] = this.message_list;  
                            this.datepicker_step_4.toArray()[indexer].border_error_to = true;                       
                        }  
                      }  //Close if error_list.includes("-")                                                                            
                    } //Close for
                } else {
                    ///////////////////////////////////////////////////////////////////////
                    jQuery('#serviceStepButton').removeClass('active');
                    jQuery('#serviceStepButton').removeClass('inactive');
                    jQuery('#passengerStepButton').removeClass('active');
                    jQuery('#passengerStepButton').removeClass('inactive');
                    jQuery('#pricesStepButton').removeClass('active');
                    jQuery('#pricesStepButton').removeClass('inactive');
                    jQuery('#policiesStepButton').removeClass('active');
                    jQuery('#policiesStepButton').removeClass('inactive');
                    jQuery('.wizard-progress-bar .progress').removeClass('progress');
                    jQuery('.wizard-progress-bar .progress').removeClass('progress-step1');
                    jQuery('.wizard-progress-bar .progress').removeClass('progress-step2');
                    jQuery('.wizard-progress-bar .progress').removeClass('progress-step3');
                    jQuery('.wizard-progress-bar .progress').removeClass('progress-step4');
                    jQuery('#policiesStep').hide();
                    jQuery('#finalStep').show();
                }              
              }, error => {}
          );
  }

    /////////////////////////////////
    /// Button Create Another IFE ///
    create_another_ife(){
        //STEP 1: Cancel fields Service Type "General" 
        this.selectedPill = 1;
        this._editIfe.serviceName_general = undefined;
        this.message_service_name = undefined;
        this.message_description = undefined;
        this.datepicker_step_1_general.date_range_start = undefined;
        this.datepicker_step_1_general.date_range_end = undefined;
        this.datepicker_step_1_general.border_error_from = false;
        this.datepicker_step_1_general.border_error_to = false;
        this.message_service_date_start = undefined;
        this.message_service_date_end = undefined;
        this._editIfe.descriptionGeneral = undefined;
        this.datepicker_step_1_general.show_text();

        //STEP 1: Cancel fields Service Type "Hotel"
        this._editIfe.serviceName_hotel = undefined;
        this.datepicker_step_1_hotel.date_range_start = undefined;
        this.datepicker_step_1_hotel.date_range_end = undefined;
        this.datepicker_step_1_hotel.border_error_from = undefined;
        this.datepicker_step_1_hotel.border_error_to = undefined;
        this._editIfe.address_hotel = undefined;
        this.message_address_hotel = undefined;
        this._editIfe.room_type_hotel = undefined;
        this.message_hotel_room_type = undefined;
        this._editIfe.description_hotel = undefined;
        this.datepicker_step_1_hotel.show_text();

        //STEP 1: Cancel fields Service Type "Transfer"
        this._editIfe.serviceName_transfer = undefined;;
        this.datepicker_step_1_transfer.date_range_start = undefined;
        this.datepicker_step_1_transfer.date_range_end = undefined;
        this.datepicker_step_1_transfer.border_error_from = undefined;
        this.datepicker_step_1_transfer.border_error_to = undefined;
        this._editIfe.from_transfer = undefined;
        this.message_transfer_from = undefined;
        this._editIfe.to_transfer = undefined;
        this.message_transfer_to = undefined;
        this._editIfe.provided_by_transfer = undefined;
        this.autocomplete_subcomponent_city.relation_name = undefined;
        this.autocomplete_subcomponent_city.state_validate = true;
        this.autocomplete_subcomponent_city.exist_error = false;
        this.autocomplete_subcomponent_city.error_field = undefined;
        this.autocomplete_subcomponent_city.border_active = false;
        this._editIfe.pickUp_transfer = undefined;
        this._editIfe.dropOff_transfer = undefined;
        this.datepicker_step_1_transfer.show_text();

        //STEP 1: Cancel fields Service Type "Car"
        this._editIfe.serviceName_car = undefined;
        this.datepicker_step_1_car.date_range_start = undefined;
        this.datepicker_step_1_car.date_range_end = undefined;
        this.datepicker_step_1_car.border_error_from = undefined;
        this.datepicker_step_1_car.border_error_to = undefined;
        this._editIfe.car_details = undefined;
        this._editIfe.service_description_car = undefined;
        this.message_car_rental_comp = undefined;
        this._editIfe.car_insurance = undefined;
        this.datepicker_step_1_car.show_text();

        //STEP 1: Cancel fields Service Type "Insurance"
        this._editIfe.serviceName_insurance = undefined;
        this.datepicker_step_1_insurance.date_range_start = undefined;
        this.datepicker_step_1_insurance.date_range_end = undefined;
        this.datepicker_step_1_insurance.border_error_from = undefined;
        this.datepicker_step_1_insurance.border_error_to = undefined;
        this._editIfe.place_coverage_insurance = undefined;
        this.message_service_insu_place_coverage = undefined;
        this._editIfe.policy_detail_insurance = undefined;
        this.message_insu_policy = undefined;
        this._editIfe.service_description_insurance = undefined;
        this.datepicker_step_1_insurance.show_text();

        //STEP 2: Clean fields Booking Status(Passenger)
        this.status_type = 6;
        this.message_passenger = undefined;
        this.pax_name = [];
        this.pax_name_header_collapse = [];
        this.surname_header_collapse = [];
        this.age_header_collapse = [];
        this.birthday_header_collapse = [];
        this.error_pax_name_indexer = [];
        this.surname = [];
        this.error_pax_surname_indexer = [];
        this.type_doc_name = [];
        this.document_type = [];
        this.document_type_header_collapse = [];
        this.age = [];
        this.birthday = [];  
        
        //STEP 3: Clean fields Prices 
        this.general_error = undefined;
        this.provider_cost = undefined;
        this.message_provider_cost = undefined;
        this.dropdown_provider_cost.dropdown_symbol = '$';
        this.error_prov_cost = undefined;
        this.client_commission = undefined;
        this.message_client_comm = undefined;
        this.error_client_comm = undefined;
        this.net_rate = undefined;
        this.change_text = [];
        this.taxes = [];
        this.error_taxes_indexer = [];
        this.taxes_array = [1];
        this.taxes_counter = 1;
        this.dropdown_taxes.toArray()[0].dropdown_symbol = '$';
        this.dropdown_client_sale.dropdown_symbol = '$';
        this.client_sale = undefined;
        this.message_client_sale = undefined;
        this.error_client_sale = undefined;
        this.autocomplete_subcomponent_prov.relation_name = undefined;
        this.autocomplete_subcomponent_prov.state_validate = true;
        this.autocomplete_subcomponent_prov.exist_error = false;
        this.autocomplete_subcomponent_prov.error_field = undefined;
        this.autocomplete_subcomponent_prov.border_active = false;
        this.message_provider = undefined;
        this.remarks = undefined;

        //STEP 4: Clean fields Policies
        this.policies_array = [];
        this.counter_policies = 0;
        this.status_type_step4[0] = 1;
        this.error_policy_date_start = [];
        this.error_policy_date_end = [];
        this.validation_dropdown_currency[0] = true;
        this.error_policy_cost_indexer = [];
        this.cost_input = [];
        this.description_step4 = [];
        $('#policyOneInfo0').collapse('toggle');

        //After click Button "Create Another IFE"
        this.currentStep = 1;
        this.showServiceStep(1);
        jQuery('#finalStep').hide();
    }

    ///////////////////////////////
    /// Button Close after Save ///
    return_bw(){ 
        //Create URL with params from model:(filter.ts)
        this._filters.replace_string(); //Change "/" to "-"
        this.router.navigate(['/App', 'Bworkspace', { 
        search_type: this._filters.filter_by_bookings_or_files,
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

}//Close IFE class
