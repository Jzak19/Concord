import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Firestore, collection, getDocs, orderBy, query, onSnapshot, Unsubscribe, doc, updateDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core'; // Angular 14+ dependency injection

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  private currentChannelSubject = new BehaviorSubject<string | null>('General'); // I did this myself
  currentChannel$ = this.currentChannelSubject.asObservable();

  private messagesSubject = new BehaviorSubject<any[]>([]); // To hold real-time messages
  messages$ = this.messagesSubject.asObservable(); // Observable for components to subscribe to

  private firestore: Firestore = inject(Firestore); // Firestore injection

  private currentChannelListener: Unsubscribe | null = null;

  constructor() {}

  setCurrentChannel(channelName: string) {
    this.currentChannelSubject.next(channelName);
  }

  async getAllMessages() {
    // Wait for the current channel to be set
    const currentChannel = this.currentChannelSubject.getValue();
    if (!currentChannel) {
      console.error('No channel set.');
      return Promise.resolve([]); // Return empty array if no channel is set
    }

    const messagesRef = collection(this.firestore, 'Chats', currentChannel, 'messages');
    const orderedQuery = query(messagesRef, orderBy('Date')); // Order messages by 'Date'
  
    return getDocs(orderedQuery).then((snapshot) => {
      const messages: any[] = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        messages.push([data['messagetext'], data['Username'], data['senderID']]); // Format as [messageText, Username, senderID]
      });
      return messages; // Return the ordered messages array
    }).catch((error) => {
      console.error("Error fetching messages: ", error);
      return []; // Return an empty array if there's an error
    });
  }

  watchMessages() {
    // Subscribe to current channel changes and update the Firestore listener accordingly
    this.currentChannel$.subscribe((channelName) => {
      if (!channelName) {
        return; // If no channel is set, stop watching messages
      }

      // If there's a previous listener, unsubscribe from it
      if (this.currentChannelListener) {
        this.currentChannelListener();
      }

      const messagesRef = collection(this.firestore, 'Chats', channelName, 'messages');
      const orderedQuery = query(messagesRef, orderBy('Date')); // Order messages by 'Date'

      // Attach a new real-time listener to the new channel
      this.currentChannelListener = onSnapshot(orderedQuery, (snapshot) => {
        const messages: any[] = [];
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          messages.push([data['messagetext'], data['Username'], data['senderID']]); // Format as [messageText, Username, senderID]
        });
        this.messagesSubject.next(messages); // Update the BehaviorSubject with new data
      }, (error) => {
        console.error('Error listening to messages: ', error);
      });
    });
  }


  
}