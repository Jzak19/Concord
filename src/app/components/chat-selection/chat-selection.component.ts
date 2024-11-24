import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { inject } from '@angular/core';

import { ChatListItemComponent } from '../subcomponents/chat-list-item/chat-list-item.component';

@Component({
  selector: 'app-chat-selection',
  standalone: true,
  imports: [ChatListItemComponent, CommonModule],
  templateUrl: './chat-selection.component.html',
  styleUrl: './chat-selection.component.scss'
})
export class ChatSelectionComponent implements OnInit {

  channels: any[] = [];

  firestore: Firestore;

  constructor() {
    this.firestore = inject(Firestore); // Inject Firestore instance
  }

  ngOnInit() {
    this.fetchChatNames();
  }

  async fetchChatNames() {
    try {
      const chatCollectionRef = collection(this.firestore, 'Chats');
      const snapshot = await getDocs(chatCollectionRef);
  
      this.channels = snapshot.docs.map((doc) => {
        const data = doc.data(); // Get document fields
  
        // Access the description field with bracket notation
        return {
          name: doc.id, // Document ID (name)
          description: data['description'] || 'No description available', // Bracket notation to access description
          img: data['img'] || ''
        };
      });
  
      console.log('Chat channels fetched:', this.channels);
    } catch (error) {
      console.error('Error fetching chat names:', error);
    }
  }

  isClicked = false;

  // Method to toggle the opacity on click
  onDivClick() {
    this.isClicked = !this.isClicked;
  }
  
}
