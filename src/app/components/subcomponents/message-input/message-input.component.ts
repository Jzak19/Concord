import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessagingService } from '../../../messaging.service';
import { Firestore, collection, addDoc, serverTimestamp  } from '@angular/fire/firestore';
import { UserService } from '../../../user-service.service';
import { User } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { Filter }  from 'bad-words';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent {

  filter = new Filter
  user: User | null = null; // Track the signed-in user
  chatMessage: string = '';
  currentChannel: string = "General"; // Current channel
  userUid: string | null = null; // Store user UID

  firestore: Firestore;
  

  constructor(private messagingService: MessagingService, public userService: UserService) {
    this.firestore = inject(Firestore); // Inject Firestore instance
  }

  username: string = ''; // Bind to the input field for the username

  async ngOnInit() {
    // Subscribe to the current selected channel
    this.messagingService.currentChannel$.subscribe((channelName) => {
      // Ensure we update currentChannel with a valid channel name
      if (channelName) {
        this.currentChannel = channelName;
      }
    });

    this.userService.user$.subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.userUid = this.user.uid;  // Store the UID when the user is available
      } else {
        this.userUid = null; // If no user is logged in, set UID to null
      }
    });

    const userInfo = await this.userService.getUserInfo();
    if (userInfo) {
      this.username = userInfo.username || ''; // Set to fetched username or empty string if not available
      
    }

    
  }

  async clearChatInput(): Promise<void> {

    if (this.filter.isProfane(this.chatMessage)){
      alert('Your message contains inappropriate language. Please revise your message.');
      this.chatMessage = ''; 
    } else {

      const info = await this.userService.getUserInfo()
      const username = info?.username
      const message = {
        senderID: this.userUid,  // Replace with dynamic username if needed
        messagetext: this.chatMessage,
        Username: username,
        Date: serverTimestamp()  // Store a timestamp
      };
      
      try {
        const messagesCollection = collection(this.firestore, 'Chats', this.currentChannel, 'messages'); // 'messages' is your Firestore collection
        console.log(messagesCollection)
        await addDoc(messagesCollection, message);  // Add the message to Firestore
        console.log('Message sent:', message);
        this.chatMessage = '';  // Clear input after sending
      } catch (error) {
        console.error('Error adding message to Firestore:', error);
      }

    }

   
  }
}