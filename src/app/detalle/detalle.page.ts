import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProyectoVideojuego } from '../proyecto-videojuego';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false
})
export class DetallePage implements OnInit {
  id: string = "";
  documentTarea: any = {
    id: "",
    data: {} as ProyectoVideojuego
  };
  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, private router: Router) {
    this.documentTarea.data = {} as ProyectoVideojuego;
  }

  ngOnInit() {
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      console.log(idRecibido);
      this.id = idRecibido;

      this.firestoreService.consultarPorId("videojuegos", this.id).subscribe((resultado: any) => {
        if (resultado.payload.data() != null) {
          this.documentTarea.id = resultado.payload.id;
          this.documentTarea.data = resultado.payload.data();
          console.log(this.documentTarea.data.titulo);
        } else {
          this.documentTarea.data = {} as ProyectoVideojuego;
        }
      })
    } else {
      this.id = "";
    }
  }


  // TENGO QUE ARREGLAR ESTO
  clickBotonEditar(id: string, datos: any) {
    this.router.navigate(['/home']);


    this.firestoreService.actualizar("videojuegos", id, datos).then(() => {

      this.documentTarea.data = {} as ProyectoVideojuego;
      console.log('Videojuego modificado correctamente');

    })


  }
}
