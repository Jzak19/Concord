import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from './components/header/header.component';
import { UserSectionComponent } from './components/user-section/user-section.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { ChatSelectionComponent } from './components/chat-selection/chat-selection.component';
import { MessagingService } from './messaging.service';
import { MessageInputComponent } from './components/subcomponents/message-input/message-input.component';
import { UserService } from './user-service.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    ChatSelectionComponent,
    UserSectionComponent,
    ChatWindowComponent,
    MessageInputComponent,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Fixed typo: styleUrl -> styleUrls
})
export class AppComponent implements OnInit {
  title = 'angularApp';
  user: User | null = null; // Track the signed-in user
  userUid: string | null = null; // Store user UID

  constructor(public messagingService: MessagingService, public userService: UserService) {}

  ngOnInit(): void {
    // Subscribe to the user observable to get the current user
    this.userService.user$.subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.userUid = this.user.uid;  // Store the UID when the user is available
      } else {
        this.userUid = null; // If no user is logged in, set UID to null
        
      }
    });
  }


  // Method to sign in with Google
  signInWithGoogle() {
    this.userService.signInWithGoogle().catch((error) => {
      console.error('Error during sign-in:', error);
    });
  }

  // Method to sign out
  signOut() {
    
    this.userService.signOut().then(() => {
      console.log('Signed out successfully.');
    });
  }
}