import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, User, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, updateDoc, getDocs, collection, onSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private usersSubject = new BehaviorSubject<any[]>([]); // Tracks the list of users
  public users$ = this.usersSubject.asObservable(); // Observable for external components

  constructor(private auth: Auth, private firestore: Firestore) {
    // Listen for changes in the authentication state and update the user subject
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });

    this.subscribeToUsers(); // Initialize real-time subscription
    
  }


  users: any[] = [];

  // Method to sign in with Google
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      this.userSubject.next(user);

      // Add or update the user in Firestore and set Online status
      await this.addUserToFirestore(user);
      await this.updateUserOnlineStatus(user.uid, true); // Set user as Online
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error; // Re-throw the error for caller handling
    }
    
  }

  // Method to sign out
  async signOut() {
    try {
      const currentUser = this.userSubject.value;
      if (currentUser) {
        // Update Online status to false before signing out
        await this.updateUserOnlineStatus(currentUser.uid, false);
      }
      await this.auth.signOut();
      this.userSubject.next(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error; // Re-throw the error for caller handling
    }
  }

  // Method to get the user UID
  getUserUid() {
    const user = this.userSubject.value;
    return user ? user.uid : null;
  }

  async addUserToFirestore(user: User) {
    try {
      const userRef = doc(this.firestore, `Users/${user.uid}`);
      const userSnap = await getDoc(userRef);

      // Check if the user already exists in the Firestore database
      if (!userSnap.exists()) {
        // If not, create the new user document
        await setDoc(userRef, {
         
          Username: "Anonymous",
          profileImage: "",
          Online: false
        });
        console.log('New user added to Firestore:', user.uid);
      } else {
        console.log('User already exists in Firestore:', user.uid);
      }
    } catch (error) {
      console.error('Error adding user to Firestore:', error);
    }
  }

  private async updateUserOnlineStatus(uid: string, isOnline: boolean) {
    const userDocRef = doc(this.firestore, `Users/${uid}`);
    try {
      await updateDoc(userDocRef, { Online: isOnline });
    } catch (error) {
      console.error(`Error updating Online status for user ${uid}:`, error);
      throw error; // Re-throw for caller handling
    }
  }

  private subscribeToUsers() {
    const usersCollection = collection(this.firestore, 'Users'); // Reference to 'Users' collection

    // Listen for real-time updates
    onSnapshot(usersCollection, (snapshot) => {
      const users = snapshot.docs.map((doc) => {
        const data = doc.data(); // Get document fields
        return {
          id: doc.id, // Document ID
          name: data['Username'],
          status: data['Online'] || false,
          img: data['ProfileImage'] || '',
        };
      });

      this.usersSubject.next(users); // Update the BehaviorSubject with the latest user list
      console.log('Real-time users updated:', users);
    });
  }


  public async updateUserInfo(Username: string, img: string) {
    const uid = this.getUserUid()
    const userRef = doc(this.firestore, `Users/${uid}`)

    try {
      await updateDoc(userRef, { ProfileImage: img, Username: Username});
    } catch (error) {
      console.error(`Error updating Online status for user ${uid}:`, error);
      throw error; // Re-throw for caller handling
    }
  }

  public async getUserInfo() {
    const uid = this.getUserUid()
    const userRef = doc(this.firestore, `Users/${uid}`)

    try {
      const info = await getDoc(userRef)

      if (info.exists()){
        const data = info.data()

        const username = data['Username']
        const img = data['ProfileImage']
        return {username, img}
      } else {
        return null;
      }
    } catch (error) {
      console.log("Failed to fecth user info", error)
      return null
    }
  }

  async getCurrentUsername(){
    const uid = this.getUserUid()
    const userRef = doc(this.firestore, `Users/${uid}`)
    try {
      const info = await getDoc(userRef)

      if (info.exists()){
        const data = info.data()

        const username = data['Username']
        return {username}
      } else {
        return null;
      }
    } catch (error) {
      console.log("Failed to fecth user info", error)
      return null
    }
  }
}