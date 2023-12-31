import { Component, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Chart, ChartConfiguration, ChartData, ChartOptions, ChartType } from "chart.js";
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { forEach } from 'jszip';
import { DataService } from '../sevices/data.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {
  ville: any;
  villes: any=[]
  datas: any=[]
  reclamation: any
  produit: any;


  


  ngOnInit(): void {
    
    this.recProduit()
    this.getVilles()

   
    
    
    
  }
  constructor( private router: Router,private dataservice:DataService){}
  idUser = sessionStorage.getItem('user');
  is_admin:any = sessionStorage.getItem('is_admin');

  

  getVilles(){
    
    this.dataservice.getVille().subscribe(
      (data:any) => {
        this.ville=data

        


        this.getRecl(this.ville)
        //this.polarArea()
      
      }
      
    )
    

  }
  dVille:any=[]
  month:any=["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
  dMonth:any=[]

  test(){
    
    this.dataservice.getReclamation().subscribe(
      (data:any) => {
        this.doughnut(data)
        let i = 0
        this.month.forEach((m:any) => {
          let c=0
          
          
          data.forEach((element:any) => {
            //console.log(element.dateCreation);
            var d = new Date(element.dateCreation);
            var shortMonthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format;
            var shortName = shortMonthName(d);
            if (shortName==m) {
              c = c+1
            }

            //console.log(shortName);
          
            
          });
          this.dMonth[i]=c
          i=i+1
          
          //console.log("------------",this.dMonth);
          
        });
        this.lin(this.dMonth)
      })
  }
  recProduit(){
    this.dataservice.getReclamation().subscribe(
      (data:any) => {
        this.reclamation=data
      })
    this.dataservice.getProduit().subscribe(
      (data:any) => {
        this.produit=data
    })
      
  }
  pro:any=[]
  getRecl(v:any){
    
    //console.log("rec pro ",this.produit,this.reclamation);
      let i = 0
      this.produit.forEach((pr:any) => {
        let p = 0
        this.reclamation.forEach((r:any) => {
          if (pr.id==r.produitId) {
            
            p++
          }
        });
        this.produit[i].rec=p
        i++
      });
      for (let index = 0; index < 5; index++) {
        
        this.pro[index]=this.produit[index]
      }
      

      //console.log(i,"p ",this.pro);
      
      
      this.dataservice.getReclamation().subscribe(
        (data:any) => {
          let i = 0
          
          v.forEach((v:any) => {
            let c = 0
            data.forEach((r:any) => {
              if (v.id==r.villeId) {
                
                c++
              }
            });
            this.ville[i].x=c
            this.dVille[i]=c
            i++
          });
          
          
         
          this.bar(this.ville.map((res:any)=>res.x))
        },
        
        )
        this.test()
        
        this.vehecule()
      
      
    
  }
  vv:any=[]
  lab:any=['ff','rr','ff']
  bar(x:any){
    //console.log(this.ville.map((res:any)=>res.x));
   
    //console.log("++",x);
    
    const data = new Chart( 'bar',{
      type:'bar',
      data:{
      labels: this.ville.map((res:any)=>res.name),
      datasets: [{
        label: 'Nb de Reclamation ',
        data: x,
        backgroundColor: [
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      indexAxis: 'y',
    }
  })
  }


  
  Vehicule:any=[]

  vehecule(){
        this.dataservice.getVehicule().subscribe((data:any)=>{
          let i = 0
          this.ville.forEach((v:any) => {
            let c = 0
            data.forEach((veh:any) => {
              if (v.id==veh.ville.id) {
                
                c++
              }
            });
            
            this.ville[i].vx=c
            
            i++
            
            
          })
          
          
          this.radar()
        });
        
        
        
  }
  radar(){
    
    
    
    //console.log("fat",this.Vehicule);
    
    const data = {
      labels: this.ville.map((res:any)=>res.name),
      datasets: [{
        label: 'Véhicule par ville',
        data: this.ville.map((res:any)=>res.vx),
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      }/*, {
        label: 'My Second Dataset',
        data: [28, 48, 40, 19, 96, 27, 100],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      }*/]
    };
    const config = new Chart( 'radar', {
      type: 'radar',
      data: data,
      options: {
        elements: {
          line: {
            borderWidth: 3
          }
        }
      },
    })
  }

  /*polarArea(){
    const data =  {
      labels: [
        'Red',
        'Green',
        'Yellow',
        'Grey',
        'Blue'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [11, 16, 7, 3, 14],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)',
          'rgb(255, 205, 86)',
          'rgb(201, 203, 207)',
          'rgb(54, 162, 235)'
        ]
      }]
    };
    const config = new Chart( 'polarArea', {
      type: 'polarArea',
      data: data,
      options: {}
    })
  }*/

  lin(x:any){
    //console.log("//",x);
    
    const labels = this.month;
    const data = {
      labels: labels,
      datasets: [{
        label: 'Nb Reclamation',
        data: x,
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.3
      }]
    };
    const config = new Chart( 'line',{
      type: 'line',
      data: data,
    })
  }

  rec:any=[]
  statut:any=[
    'Traté',
    'En cours'
  ]
  doughnut(d:any){
    
     // console.log("dattaaaaa",d);
      let e = 0
      let t = 0
      d.forEach((item:any) => {
        //console.log(item);
        
        if (item.statut==0) {
          
          e = e + 1
        }else{
          t = t + 1
        }
      });
      this.rec[0]=e
      this.rec[1]=t
      

    const data = {
      labels: this.statut,
      datasets: [{
        label: 'My First Dataset',
        data: this.rec,
        backgroundColor: [
          
          'rgb(75, 192, 192)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    };
    const config = new Chart( 'doughnut',{
      type: 'doughnut',
      data: data,
    })
  }
  


  

  /** Based on the screen size, switch from standard to one column per row */
  /*cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 2, rows: 1 },
          { title: 'Card 2', cols: 2, rows: 1 },
          { title: 'Card 3', cols: 2, rows: 1 },
          { title: 'Card 4', cols: 2, rows: 1 },
          { title: 'Card 5', cols: 2, rows: 1 },
          { title: 'Card 6', cols: 2, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 1, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 1 },
        { title: 'Card 4', cols: 1, rows: 1 },
        { title: 'Card 5', cols: 1, rows: 1 },
        { title: 'Card 6', cols: 1, rows: 1 }
      ];
    })
  );*/
}
