import { Component, OnInit } from '@angular/core';
import { CatalogComponent } from './catalog/catalog.component';
import { CartItem } from '../models/cartItem';
import { NavbarComponent } from './navbar/navbar.component';
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../services/sharing-data.service';
import Swal from 'sweetalert2';
import { ItemsState } from '../store/items.reducer';
import { Store } from '@ngrx/store';
import { add, total } from '../store/items.actions';
import { state } from '@angular/animations';

@Component({
  selector: 'cart-app',
  standalone: true,
  imports: [CatalogComponent, NavbarComponent, RouterOutlet],
  templateUrl: './cart-app.component.html'
})
export class CartAppComponent implements OnInit{

  items: CartItem[] = [];

  total: number = 0; 

  constructor(
    private store: Store<{items: ItemsState}>,
    private router: Router,
    private sharingDataService: SharingDataService
    ){
      this.store.select('items').subscribe(state => {
        this.items = state.items;
        this.total = state.total;
      })
    }
  
  ngOnInit(): void {    
    this.onDeleteCart();
    this.onAddCart();
  }

  onAddCart(): void{
    this.sharingDataService.productEventEmitter.subscribe(product => {
         
      this.store.dispatch(add({product}));
      this.store.dispatch(total());

      this.saveSession();        
      this.router.navigate(['/cart'], {
        state: {items: this.items, total: this.total}
      });
    
      Swal.fire({
        title: 'Shopinng Cart',
        text: 'Nuevo producto agregado al carro...!',
        icon: 'success'
      });
    });
  }

  onDeleteCart(): void{
    this.sharingDataService.idProductEventEmitter.subscribe(id => {
      console.log(id + ' se ha ejecutado el evento idProductEventEmitter');

      Swal.fire({
        title: "¿Esta Ud. seguro que quiere eliminar el item del carro de compras?",
        text: "Cuidado el item se eliminara permanentemente!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar...!"
      }).then((result) => {
        if (result.isConfirmed) {          
          
          this.saveSession();

          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate(['/cart'], {
              state: {items: this.items, total: this.total}
            })
          });

          Swal.fire({
            title: "Eliminado...!",
            text: "El item fue borrado del carro de compras con exito.",
            icon: "success"
          });
        }
      });      
    });    
  }

  saveSession(): void{
    sessionStorage.setItem('cart', JSON.stringify(this.items));
  }
}
