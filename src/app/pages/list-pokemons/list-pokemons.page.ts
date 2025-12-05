import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  LoadingController,
  IonImg,
  IonCard,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
} from "@ionic/angular/standalone";
import { inject } from "@angular/core";
import { sPokemon } from "../../services/spokemon";
import { IPokemon } from "../../interfaces/pokemon";
import { Router } from "@angular/router";
@Component({
  selector: "app-list-pokemons",
  templateUrl: "./list-pokemons.page.html",
  styleUrls: ["./list-pokemons.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonImg,
    IonCard,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
})
export class ListPokemonsPage {
  private pokemonService: sPokemon = inject(sPokemon);

  private loadingCtroller: LoadingController = inject(LoadingController);

  private router: Router = inject(Router);

  goToPage(pokemon: IPokemon) {
    this.router.navigate(["detail-pokemon", pokemon.id]);
  }

  pokemons: IPokemon[] = [];
  constructor() {}

  ionViewWillEnter() {
    this.getMorePokemons();
  }

  async getMorePokemons(event?: InfiniteScrollCustomEvent) {
    const promisePokemons = this.pokemonService.getPokemons();
    if (promisePokemons) {
      let loading: any = null;
      if (!event) {
        loading = await this.loadingCtroller.create({
          message: "Cargando....",
        });
        await loading.present();
      }
      promisePokemons
        .then((pokemons: IPokemon[]) => {
          this.pokemons = this.pokemons.concat(pokemons);
        })
        .catch((error) => console.log(error))
        .finally(() => {
          if (loading) {
            loading.dismiss();
          }
          if (event) {
            event.target.complete();
          }
        });
    }
  }
}
