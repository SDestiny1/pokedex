import { Injectable, inject } from "@angular/core";
import { IPokemon } from "../interfaces/pokemon";

import { CapacitorHttp, HttpResponse } from "@capacitor/core";
@Injectable({
  providedIn: "root",
})
export class sPokemon {
  private readonly URL_BASE = "https://pokeapi.co/api/v2/pokemon/";

  private nextUrl = `${this.URL_BASE}?limit=20&offset=0`;

  private processPokemon(pokemonData: any) {
    const pokemon: IPokemon = {
      id: pokemonData.id,
      name: pokemonData.name,
      type1: pokemonData.types[0].type.name,
      sprite: pokemonData.sprites.front_default,
      height: (pokemonData.height / 10).toString(),
      weight: (pokemonData.weight / 10).toString(),
      stats: pokemonData.stats.map((stat: any) => {
        return {
          base_stat: stat.base_stat,
          name: stat.stat.name,
        };
      }),
      abilities: pokemonData.abilities
        .filter((ability: any) => !ability.is_hidden)
        .map((ability: any) => ability.ability.name),
    };

    if (pokemonData.types[1]) {
      pokemon.type2 = pokemonData.types[1].type.name;
    }

    const hiddenAbility = pokemonData.abilities.find(
      (ability: any) => ability.is_hidden
    );
    if (hiddenAbility) {
      pokemon.hiddenAbility = hiddenAbility.ability.name;
    }
    return pokemon;
  }

  getPokemons() {
    if (this.nextUrl) {
      return CapacitorHttp.get({ url: this.nextUrl, params: {} }).then(
        async (response: HttpResponse) => {
          console.log("La respues es:");
          console.log(response);
          const pokemons: IPokemon[] = [];

          if (response.data) {
            const result: [] = response.data.results;
            this.nextUrl = response.data.next;
            const promises: Promise<HttpResponse>[] = [];

            result.forEach((result: any) => {
              const urlPokemon = result.url;
              promises.push(CapacitorHttp.get({ url: urlPokemon, params: {} }));
            });

            await Promise.all(promises).then((responses: any) => {
              const arrayResponses: [] = responses;

              arrayResponses.forEach((respoPokemon: any) => {
                const pokemon = this.processPokemon(respoPokemon.data);
                pokemons.push(pokemon);
              });
            });
          }
          return pokemons;
        }
      );
    }
    return null;
  }

  getPokemon(id: number) {
    const ruta = `${this.URL_BASE}${id}/`;
    return CapacitorHttp.get({ url: ruta, params: {} }).then(
      (resp: HttpResponse) => this.processPokemon(resp.data)
    );
  }
}

export class ListPokemonsPage {
  private pokemonService: sPokemon = inject(sPokemon);

  pokemons: IPokemon[] = [];
  constructor() {}
}
