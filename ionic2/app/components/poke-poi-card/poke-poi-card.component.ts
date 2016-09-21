import { Component, Input, ViewChild, OnInit, ElementRef, ChangeDetectorRef,
  animate, trigger, state, style, transition } from '@angular/core';
import { Events, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs';

import { PokePOI } from '../../models/poke-poi';
import { Pokemon } from '../../models/pokemon';
import { ApiService } from '../../services/api.service';
import { PokePOIBubbleComponent } from '../poke-poi-bubble/poke-poi-bubble.component';
import { PokeDetailPage } from '../../pages/poke-detail/poke-detail.page';

let Hammer = require('hammerjs');

@Component({
  template: require('./poke-poi-card.component.html'),
  styles: [require('./poke-poi-card.component.scss')],
  selector: 'poke-poi-card',
  directives: [PokePOIBubbleComponent],
  animations: [
    trigger('slide', [
      state('visible', style({transform: 'translateY(0)'})),
      state('hidden', style({transform: 'translateY(120%)'})),
      transition('visible <=> hidden', animate('300ms ease')),
    ])
  ]
})
export class PokePOICardComponent implements OnInit {

  @ViewChild('slideCard') slideCard: ElementRef;

  pokePOI: PokePOI;
  loadPokemon: Subscription;
  slideState: string = 'hidden';

  constructor(private navCtrl: NavController) {}

  ngOnInit(): any {
    let hammer = new Hammer(this.slideCard.nativeElement);
    hammer.on('swipedown swipeleft swiperight', this.hide.bind(this));
  }

  show(pokePOI: PokePOI) {
    this.pokePOI = pokePOI;
    this.slideState = 'visible';
  }

  hide() {
    this.slideState = 'hidden';
  }

  cancelRequests() {
    if (this.loadPokemon && !this.loadPokemon.isUnsubscribed) {
      this.loadPokemon.unsubscribe();
    }
  }

  getPOITypeBadgeLabel(): string {
    switch(this.pokePOI.getType()) {
      case 'prediction':
        return 'Pokemon Prediction';
      case 'sighting':
        return 'Pokemon Sighting';
      case 'mob':
        return 'Pokemon Mob';
    }
  }

  launchDirections() {
    // TODO
  }

  launchPokeDex() {
    this.navCtrl.push(PokeDetailPage, {pokemon: this.pokePOI.pokemon});
  }

}
