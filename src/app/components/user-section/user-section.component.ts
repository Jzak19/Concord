import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../user-service.service';
import { UserListItemComponent } from '../subcomponents/user-list-item/user-list-item.component';
@Component({
  selector: 'app-user-section',
  standalone: true,
  imports: [UserListItemComponent, CommonModule],
  templateUrl: './user-section.component.html',
  styleUrl: './user-section.component.scss'
})
export class UserSectionComponent {

  constructor(public userService: UserService){}

  users: any[] = [];

  ngOnInit(): void {
    // Subscribe to the real-time user list observable
    this.userService.users$.subscribe(
      (users) => {
        this.users = users; // Update the local user list
        console.log('User list in component updated:', this.users);
      },
      (error) => {
        console.error('Error receiving user list:', error);
      }
    );
  }

  
}
