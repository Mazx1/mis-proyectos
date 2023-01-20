import { Component } from '@angular/core';
import { Egreso } from './egreso/egreso.model';
import { EgresoServicio } from './egreso/egreso.servicio';
import { Ingreso } from './ingreso/ingreso.model';
import { IngresoServicio } from './ingreso/ingreso.servicio';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'presupuesto-app';
  ingresos:Ingreso[]=[];
  egresos:Egreso[]=[];

  constructor(private ingresoServicio:IngresoServicio,
              private engresoServicio:EgresoServicio){
                this.ingresos=ingresoServicio.ingresos;
                this.egresos=engresoServicio.egresos;
              }

   getIngresoTotal(){
    let ingresoTotal:number=0;
    this.ingresos.forEach(Ingreso=>{
      ingresoTotal+= Ingreso.valor;
    }
    );
    return ingresoTotal;
   }
   getEgresoTotal(){
    let egresoTotal:number=0;
    this.egresos.forEach(Egreso=>{
      egresoTotal += Egreso.valor;
    }
    );
    return egresoTotal;
   }

   getPorcentajeTotal(){
    return this.getEgresoTotal()/this.getIngresoTotal();

   }

   getPresupuestoTotal(){
    return this.getIngresoTotal() - this.getEgresoTotal();
   }
  

}
