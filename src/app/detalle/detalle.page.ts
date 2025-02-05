import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProyectoVideojuego } from '../proyecto-videojuego';
import { FirestoreService } from '../firestore.service';
import { AlertController } from '@ionic/angular';

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
  isNew: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private firestoreService: FirestoreService, 
    private router: Router,
    private alertController: AlertController
  ) {
    this.documentTarea.data = {} as ProyectoVideojuego;
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id === 'new') {
      this.isNew = true;
      this.documentTarea.data = {} as ProyectoVideojuego;
    } else {
      this.firestoreService.consultarPorId("videojuegos", this.id).subscribe((resultado: any) => {
        if (resultado.payload.data() != null) {
          this.documentTarea.id = resultado.payload.id;
          this.documentTarea.data = resultado.payload.data();
          console.log(this.documentTarea.data.titulo);
        } else {
          this.documentTarea.data = {} as ProyectoVideojuego;
        }
      })
    }
  }

  clickBotonGuardar() {
    if (this.isNew) {
      this.firestoreService.insertar('videojuegos', this.documentTarea.data).then(() => {
        console.log('Videojuego insertado correctamente');
        this.router.navigate(['/home']);
      }, (error: any) => {
        console.error(error);
      });
    } else {
      this.firestoreService.actualizar('videojuegos', this.id, this.documentTarea.data).then(() => {
        console.log('Videojuego modificado correctamente');
        this.router.navigate(['/home']);
      }, (error: any) => {
        console.error(error);
      });
    }
  }

  async clicBotonBorrar() {
    const alert = await this.alertController.create({
      header: 'Confirmar borrado',
      message: '¿Estás seguro de que deseas borrar este videojuego?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Borrado cancelado');
          }
        },
        {
          text: 'Borrar',
          handler: () => {
            this.firestoreService.eliminar('videojuegos', this.id).then(() => {
              console.log('Videojuego borrado correctamente');
              this.router.navigate(['/home']);
            }).catch((error: any) => {
              console.error('Error al borrar el videojuego: ', error);
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
