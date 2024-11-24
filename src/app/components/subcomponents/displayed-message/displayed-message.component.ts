import { Component, input, Input, output } from '@angular/core';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../user-service.service';

@Component({
  selector: 'app-displayed-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './displayed-message.component.html',
  styleUrl: './displayed-message.component.scss'
})
export class DisplayedMessageComponent {
  user: User | null = null; // Track the signed-in user
  userUID: string | null = null; // Store user UID

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    // Subscribe to the user observable to get the current user
    this.userService.user$.subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.userUID = this.user.uid;  // Store the UID when the user is available
      } else {
        this.userUID = null; // If no user is logged in, set UID to null
      }
    });

    this.example.emit("HEllo World")
  }

  // @Input() senderName!: string; // Channel name
  @Input() messageText!: string; // Channel description
  @Input() isCurrentUser: boolean = false;

  senderName = input.required<string>();
  example = output<string>();
}
