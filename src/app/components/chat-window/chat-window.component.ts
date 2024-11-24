import { Component, AfterViewInit, ViewChild, ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageInputComponent } from '../subcomponents/message-input/message-input.component';
import { DisplayedMessageComponent } from '../subcomponents/displayed-message/displayed-message.component';
import { User } from '@angular/fire/auth';
import { UserService } from '../../user-service.service';
import { MessagingService } from '../../messaging.service';
import { FirestoreService } from '../../firestore-service.service';


@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [MessageInputComponent, DisplayedMessageComponent, CommonModule],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent implements AfterViewInit{

  @ViewChild('scrollAnchor') private scrollAnchor!: ElementRef;

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    // Scroll to the bottom after the view is updated
    this.scrollToBottom();
  }

  
  private scrollToBottom(): void {
    try {
      this.scrollAnchor.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } catch (err) {
      console.error('Scroll to view failed:', err);
    }
  }
  user: User | null = null; // Track the signed-in user
  userUID: string | null = null; // Store user UID
  currentChannel: string = "General"; // Current channel

  messagesList: any[] = []; 

  constructor(public userService: UserService, public messagingService: MessagingService, private firestoreService: FirestoreService) {}

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

    this.messagingService.currentChannel$.subscribe((channelName) => {
      // Ensure we update currentChannel with a valid channel name
      if (channelName) {
        this.currentChannel = channelName;
        this.loadMessages();
        
      }
    });
    this.messagingService.watchMessages();
    this.messagingService.messages$.subscribe((messages) => {
      this.messagesList = messages;
    });
    
    this.loadMessages();
    

  }
  loadMessages(): void {
    this.messagingService.getAllMessages().then((messages) => {
      this.messagesList = messages; // Update the messagesList array with fetched messages
      console.log(this.messagesList)
      this.scrollToBottom()

    });
  }
}
