import { Component, OnInit } from '@angular/core';
import { loggingService } from './loggingService.service';
import { Persona } from './persona.model';
import { personasServices } from './personas.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'listado_Personas-app';
  saludo= "saludos desde angular"
  personas : Persona[];
  constructor(private loggingService: loggingService,
    private personasService: personasServices){}
  ngOnInit(): void {
    this.personas = this.personasService.personas;
  }

  personaAgregada(persona: Persona){
    // this.loggingService.enviaMensajeAConsola(" persona agragada desde el arreglo ");
   // this.personas.push( persona );
    this.personasService.agregarPersona(persona);
  }

}
