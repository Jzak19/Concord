import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { UserService } from '../../user-service.service';
import { CommonModule } from '@angular/common';
import { Filter } from 'bad-words';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  filter = new Filter;
  firestore: Firestore;

  constructor(private auth: Auth,  public userService: UserService) {this.firestore = inject(Firestore)}

  

  async ngOnInit() {
    const userInfo = await this.userService.getUserInfo();
    if (userInfo) {
      this.username = userInfo.username || ''; // Set to fetched username or empty string if not available
      this.profileImage = userInfo.img || 'https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg'; // Set to fetched profile image or empty string if not available
    }
  }

  isModalOpen = false; // To control the modal visibility
  username: string = ''; // Bind to the input field for the username
  profileImage: string = ''; // Bind to the input field for the profile image URL

  // Function to open the modal
  openModal(): void {
    this.isModalOpen = true;
    console.log("open")
  }

  // Function to close the modal
  closeModal(): void {
    this.isModalOpen = false;
    console.log("closed")
  }

  updateInfo() {

    if (this.filter.isProfane(this.username)){
      alert('You thought I would miss this? Think again');
      this.username = 'I use naughty words'; 
    }

    this.userService.updateUserInfo(this.username, this.profileImage)
    this.isModalOpen = false;
  }
}
