import { Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, OnInit, NgZone , ViewChild , AfterViewInit , OnDestroy } from '@angular/core';
import { Widget } from '../../../core/widget/widget';
import { RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router } from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import { Idle, DEFAULT_INTERRUPTSOURCES } from 'ng2-idle/core'; //For timeout
import { DialogRef } from 'angular2-modal';
import { Observable } from 'rxjs/Observable';
import { CustomHttp } from '../../../services/http-wrapper';
import myGlobals = require('../../../../app');
import { ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { NgClass } from '@angular/common';
import { Modal, BS_MODAL_PROVIDERS as MODAL_P } from 'angular2-modal/plugins/bootstrap'; //Modal
import { Core } from '../../../core/core';
import { Location } from '@angular/common';
import { LoadingGif } from '../../../bworkspace/filedetail/loading_gif.service';
import { editTranslations } from './inline-translation-detail/edit_forms_translation_detail.service';
import { translationDetailService } from './translation-detail.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: '[translations-detail]',
    template: require('./translations-detail.html'),
    styles: [require('./translations-detail.scss')],
    directives: [ROUTER_DIRECTIVES,Widget]
  })
  
  export class TranslationsDetail {

	private subscription: Subscription;
 	templateTitle:any = '';
	host_domain:any;
  	constructor(public params: RouteParams, public _router : Router , public _translationDetailService : translationDetailService ,
  	 public _editTranslations : editTranslations , public location : Location) {
  	 	this.host_domain = myGlobals.host;
  	}

ngOnInit(){
 	this.templateTitle = this.params.get('n').replace(new RegExp(',', 'g'), '/');;
	this._editTranslations.get_languages_forms();
	this._editTranslations.get_translation_detail(this.params.get('t'));

	setTimeout(()=>{
		this.loadTranslations();
	} , 850);

	// this.subscription = this._translationDetailService.notifyObservable$.subscribe((res) => {
	// 	      myGlobals.alertTravtion(res);
	// 	setTimeout(()=>{
	//       this.templateTitle = res;
	// 	} ,1000 )
 //    });
}

_back(){
	 this._router.navigate(['/App', 'Translations', {
            cp: this.params.get('cp')
         }]);
}

loadTranslations() {
	for (var i = 0; i < this._editTranslations.list_translations.length; ++i) {
		for (var j = 0; j < this._editTranslations.list_translations[i].translations_for_language.length; ++j) {
			$('#lang'+this._editTranslations.list_translations[i].translations_for_language[j].code+ i ).val(this._editTranslations.list_translations[i].translations_for_language[j].name);
		}
	}
}

postTranslation(){
	for (var i = 0; i < this._editTranslations.list_translations.length; ++i) {
		this._editTranslations.list_translations[i].translations_for_language = [];
		for (var j = 0; j < this._editTranslations.languages.length; ++j) {
			if ( $('#lang'+this._editTranslations.languages[j].code+i).val() != "" ) {
				this._editTranslations.list_translations[i].translations_for_language.push( { 'code' : this._editTranslations.languages[j].code , 'name' : $('#lang'+this._editTranslations.languages[j].code+i).val()  });
			}
		}
		this._editTranslations.list_translations[i].name = this._editTranslations.list_translations[i].name;
		this._editTranslations.list_translations[i].code = this._editTranslations.list_translations[i].code;
	}
	this._editTranslations.post_translation_detail()
	.map(data => 
        {    
        	this.loadTranslations();
        })
    .subscribe();;

}

cancelTranslation(){
	this._router.navigateByUrl('/app/settings/translations;cp=1');
	// this._editTranslations.get_translation_detail(this.params.get('t'));
	// setTimeout(()=>{
	// 	this.loadTranslations();
	// } , 1000)
}

  }