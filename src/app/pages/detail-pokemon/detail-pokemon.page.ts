import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonImg,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonProgressBar,
} from "@ionic/angular/standalone";
import { sPokemon } from "../../services/spokemon";
import { IPokemon } from "../../interfaces/pokemon";
import { ActivatedRoute } from "@angular/router";
import { addIcons } from "ionicons";
import { closeOutline } from "ionicons/icons";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular/standalone";

@Component({
  selector: "app-detail-pokemon",
  templateUrl: "./detail-pokemon.page.html",
  styleUrls: ["./detail-pokemon.page.scss"],
  standalone: true,
  imports: [
    IonProgressBar,
    IonText,
    IonCol,
    IonRow,
    IonGrid,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonImg,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonFab,
    IonFabButton,
    IonIcon,
  ],
})
export class DetailPokemonPage implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private servicioPokemon: sPokemon = inject(sPokemon);
  private router: Router = inject(Router);
  private loadingController = inject(LoadingController);

  id!: number;
  pokemon!: IPokemon;

  constructor() {
    addIcons({
      closeOutline,
    });
  }

  goBack() {
    this.router.navigate(["/list-pokemons"]);
  }

  toNumber(value: any): number {
    return Number(value);
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      this.id = +idParam;
      console.log(`El ID es: ${this.id}`);
    }
  }

  ionViewWillEnter() {
    console.log(`ionViewWillEnter - El ID es: ${this.id}`);
    this.servicioPokemon.getPokemon(this.id).then((pokemon: IPokemon) => {
      this.pokemon = pokemon;
      console.log("Pokemon cargado:", this.pokemon);
    });
  }
}
