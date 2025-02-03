import { Component } from '@angular/core';
import { ProyectoVideojuego } from '../proyecto-videojuego';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  videojuego: ProyectoVideojuego;

  arrayColeccionVideojuegos: any = [{
    id: "",
    data: {} as ProyectoVideojuego
  }];


  constructor(private firestoreService: FirestoreService, private router: Router) {
    //  Crear un videojuego vacío
    this.videojuego = {} as ProyectoVideojuego;
    this.obtenerListaVideojuegos();
    this.router = router;
  }

  clickBotonInsertar() {
    this.firestoreService.insertar('videojuegos', this.videojuego).then(() => {
      console.log('Videojuego insertado correctamente');
      this.videojuego = {} as ProyectoVideojuego;
    }, (error: any) => {
      console.error(error);
    });
  }


  obtenerListaVideojuegos() {
    this.firestoreService.consultar("videojuegos").subscribe((resultadoConsultaTareas) => {
      this.arrayColeccionVideojuegos = [];
      resultadoConsultaTareas.forEach((datosTarea: any) => {
        this.arrayColeccionVideojuegos.push({
          id: datosTarea.payload.doc.id,
          data: datosTarea.payload.doc.data()
        });
      })
    });
  }

  idVideojuegoSelec: string;

  selectVideojuego(idVideojuego) {
    console.log("Videojuego seleccionado: ");
    console.log(idVideojuego);

    this.idVideojuegoSelec = idVideojuego.id;
    this.videojuego.titulo = idVideojuego.data.titulo;
    this.videojuego.imagen = idVideojuego.data.imagen;
    this.videojuego.nota = idVideojuego.data.nota;
    this.videojuego.fecha_nac = idVideojuego.data.fecha_nac;
    this.videojuego.descripcion = idVideojuego.data.descripcion;
    this.videojuego.genero = idVideojuego.data.genero;


  }

  clicBotonBorrar(id: string) {
    this.firestoreService.eliminar("videojuegos", id).then(() => {
      this.obtenerListaVideojuegos();
      this.videojuego = {} as ProyectoVideojuego;
      console.log('Videojuego borrado correctamente');
    }).catch((error: any) => {
      console.error('Error al borrar el videojuego: ', error);
    });
  }


  clicBotonModificar(id: string, datos: any) {
    this.router.navigate(['/detalle', id]);



  }

  clicBotonEditar(id: string, datos: any) {



    this.firestoreService.actualizar("videojuegos", id, datos).then(() => {
      this.obtenerListaVideojuegos();
      this.videojuego = {} as ProyectoVideojuego;
      console.log('Videojuego modificado correctamente');
      this.router.navigate(['/home', id]);
    })
  }
}