import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Pokemon } from '../../models/pokemon';
import { PokemonFilterData } from '../../models/pokemon-filter-data';
import { ApiService } from '../../services/api.service';
import { FilterService } from '../../services/filter.service';
import { TypeService } from '../../services/type.service';

export type PokemonContainer = {pokemon: Pokemon, isSelected: boolean};
export type TypeContainer = { type: string, isSelected: boolean};

@Component({
  selector: 'poke-filter-pokemon-tab',
  templateUrl: './filter-pokemon-tab.component.html'
})
export class FilterPokemonTabComponent implements OnInit {

  pokemonIds: number[];

  nameFilter: string = '';
  typeDataBinding: TypeContainer[] = [];

  querySubscription: Subscription;
  pokemonContainers: PokemonContainer[] = [];

  pokeFilterData: PokemonFilterData = {
    pokemonName: '',
    pokemonTypes: []
  };

  constructor(private apiService: ApiService,
              private filterService: FilterService,
              private typeService: TypeService) { }

  ngOnInit() {
    this.pokemonIds = this.filterService.pokemonIds;

    this.querySubscription = this.apiService.getAllPokemon()
      .map(pokemonList => {
        return pokemonList.map(pokemon => {
          return {
            pokemon: pokemon,
            isSelected: this.pokemonIds === null || this.pokemonIds.indexOf(pokemon.pokemonId) >= 0
          };
        })
      })
      .subscribe(
        pokemonContainers => this.pokemonContainers = pokemonContainers,
        error => this.pokemonContainers = []
      );

    this.typeDataBinding = this.typeService.types.map(type => {
      return { type, isSelected: false }
    });
  }

  ionViewDidLeave() {
    this.cancelRequests();
  }

  cancelRequests() {
    if (this.querySubscription && !this.querySubscription.closed) {
      this.querySubscription.unsubscribe();
    }
  }

  onNameInput() {
    this.nameFilterChanged();
  }

  onSearch() {
    // Triggered when the confirm button (e.g. enter) is pressed.
  }

  onCancel() {
    this.cancelRequests();
  }

  nameFilterChanged() {
    this.pokeFilterData.pokemonName = this.nameFilter;
  }

  typeFilterChanged() {
    this.pokeFilterData.pokemonTypes = [];
    for (let typeField of this.typeDataBinding) {
      if (typeField.isSelected) {
        this.pokeFilterData.pokemonTypes.push(typeField.type[0]);
      }
    }
  }

  selectAll() {
    for (let cont of this.pokemonContainers) {
      cont.isSelected = true;
    }
  }

  selectNone() {
    for (let cont of this.pokemonContainers) {
      cont.isSelected = false;
    }
  }

  applyFilters() {
    this.pokemonIds = [];

    for (let pokemonCon of this.pokemonContainers) {
      if (pokemonCon.isSelected) {
        this.pokemonIds.push(pokemonCon.pokemon.pokemonId);
      }
    }

    this.filterService.pokemonIds = this.pokemonIds;
  }

}
