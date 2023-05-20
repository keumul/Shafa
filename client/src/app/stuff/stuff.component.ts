import { Component, OnInit } from '@angular/core';
import { StuffService } from '../services/stuff.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { ShelfService } from '../services/shelf.service';
import { LabelService } from '../services/label.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

interface Stuff {
  id: number;
  name: string;
  labelId: number;
  user: User;
  shelf: Shelf;
  label?: Label;
  userId: number;
  shelfId: number;
  isAvailable: boolean;
}
interface Label {
  id: number;
  description: string;
  texture: string;
  color: string;
  size: string;
  price: number;
  brand: string;
}
interface Shelf{
  id: number
  name: string
}

interface User {
  id: number;
  userName: string;
}

@Component({
  selector: 'app-stuff',
  templateUrl: './stuff.component.html',
  styleUrls: ['./stuff.component.css']
})
export class StuffComponent implements OnInit {
  stuffs: Stuff[] = [];
  users: User[] = [];
  showCard: boolean = false;
  newLDescription: string = '';
  newTexture: string = '';
  newColor: string = '';
  newSize: number = 0;
  newPrice: number = 0;
  newBrand: string = '';
  newLable!: Label;

  constructor(private stuffService: StuffService,
              private userService: UserService,
              private authService: AuthService,
              private shelfService: ShelfService,
              private labelService:LabelService,
              private router: Router) {}
  ngOnInit() {
    this.currentUserId = this.authService.getCurrentUserId()?.id
         
    this.getAllStuffs();
    this.loadShelves();
  }


  currentUserId!: number;
  getAllStuffs() {
    this.stuffService.getAllStuffsByUser(this.currentUserId).subscribe(
      (data: any) => {
        this.stuffs = data.stuffs;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(
      (data: User[]) => {
        this.users = data;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  loadShelves() {
    this.shelfService.getAllShelves(this.currentUserId).subscribe((
      data: Shelf[]) => {
      this.shelves = data.map((shelf: any) => ({
        id: shelf?.id,
        name: shelf?.name
      }));      
    });
  }

    createStuff() {
      this.stuffService.createStuff({name: this.stuffName, 
                                    userId: this.currentUserId,
                                    shelfId: this.shelfId,
                                    isAvailable: true}).subscribe(
        (response: any) => {
          this.ngOnInit();
        },
        (error) => {
          console.error(error);
        }
      );
    }

    createLabel() {
      this.labelService.createLabel({
        id: this.newLable,
        description: this.newLDescription,
        texture: this.newTexture,
        color: this.newColor,
        size: this.newSize,
        price: this.newPrice,
        brand: this.newBrand}).subscribe(
        (response: any) => {
          this.newLable = response.label;
        this.stuffService.updateStuff(this.selectedStuff.id, {
        name: this.stuffName, 
        labelId: this.newLable.id,
        userId: this.currentUserId,
        shelfId: this.shelfId,
        isAvailable: true}).subscribe(() => {
          this.ngOnInit();
        })
        },
        (error) => {
          console.error(error);
        }
      );
      
    }

    updateStuff() {
      this.stuffService.updateStuff(this.selectedStuff.id, {name: this.stuffName, 
                                                  labelId: this.labelId,
                                                  userId: this.currentUserId,
                                                  shelfId: this.shelfId,
                                                  isAvailable: true}).subscribe(
        (response: any) => {
          this.ngOnInit();
          this.getAllStuffs();
        },
        (error) => {
          console.error(error);
        }
      );
    }

    updateLabel() {
      this.labelService.updateLabel(this.labelId, {description: this.selectedStuff.label!.description,
        texture: this.selectedStuff.label!.texture,
        color: this.selectedStuff.label!.color,
        size: this.selectedStuff.label!.size,
        price: this.selectedStuff.label!.price,
        brand: this.selectedStuff.label!.brand}).subscribe(
        (response: any) => {
          this.ngOnInit();
          this.getAllStuffs();
        },
        (error) => {
          console.error(error);
        }
      );
    }

  deleteStuff() {
    this.stuffService.deleteStuff(this.stuffId).subscribe(
      (response: { message: string }) => {
        this.getAllStuffs();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  deleteLabel() {
    this.labelService.deleteLabel(this.labelId).subscribe(
      (response: { message: string }) => {
        this.getAllStuffs();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  
  logout(){
    this.authService.logout()
    this.router.navigate(['login'])
  }

setStuffId(stuff: Stuff){
    this.selectedStuff = stuff;
    this.stuffId = this.selectedStuff?.id ?? 0;
    this.labelId = this.selectedStuff?.labelId ?? 0;
    this.stuffName = this.selectedStuff?.name ?? "";
    this.userId = this.selectedStuff?.user?.id ?? 0;
    this.shelfId = this.selectedStuff?.shelf?.id ?? 0;
}
  shelves?:Shelf[]
  selectedShelvesId!: number;
  selectedStuff!: Stuff;
  stuffForm = new FormControl();
  labelForm = new FormControl();
  newStuffName!: string;
  labels?: Label[];
  stuffId: number = this.selectedStuff?.id ?? 0;
  labelId: number = this.selectedStuff?.id ?? 0;
  stuffName: string = this.selectedStuff?.name ?? '';
  userId: number = this.selectedStuff?.user?.id ?? 0;
  shelfId: number = this.selectedStuff?.shelf?.id ?? 0;
}