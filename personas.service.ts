import { EventEmitter, Injectable } from "@angular/core";
import { loggingService } from "./loggingService.service";
import { Persona } from "./persona.model";

@Injectable()
export class personasServices{
    personas : Persona[]=
  [
    new Persona("juan","perez"), 
    new Persona("laura","juarez"), 
    new Persona("manuel ","zarate")
  
  ];
  saludar = new EventEmitter<number>();
  constructor( private loggingService: loggingService){}

  agregarPersona(persona: Persona){
    this.loggingService.enviarMensajeAConsola("agregada")
    this.personas.push( persona );
  }
}