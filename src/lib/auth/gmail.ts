import { authStore } from './store';

const CLIENT_ID = 'ID';
const API_KEY = 'ID';
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

class GmailAuth {
  async initialize(): Promise<void> {
    try {
      // Load the Google API client library
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          gapi.load('client:auth2', async () => {
            try {
              await gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                scope: SCOPES.join(' '),
                discoveryDocs: [
                  'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'
                ]
              });

              // Check if user is already signed in
              const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
              if (isSignedIn) {
                await this.handleAuthSuccess();
              }

              // Listen for sign-in state changes
              gapi.auth2.getAuthInstance().isSignedIn.listen(async (isSignedIn) => {
                if (isSignedIn) {
                  await this.handleAuthSuccess();
                } else {
                  this.handleSignOut();
                }
              });

              resolve();
            } catch (error) {
              reject(error);
            }
          });
        };
        script.onerror = () => reject(new Error('Failed to load Google API client'));
        document.body.appendChild(script);
      });
    } catch (error) {
      console.error('Gmail auth initialization failed:', error);
      authStore.setState({ error: 'Failed to initialize Gmail authentication' });
    }
  }

  async signIn(): Promise<void> {
    try {
      const auth = gapi.auth2.getAuthInstance();
      const user = await auth.signIn({
        prompt: 'select_account'
      });
      await this.handleAuthSuccess(user);
    } catch (error) {
      console.error('Sign-in failed:', error);
      authStore.setState({ error: 'Failed to sign in with Google' });
    }
  }

  async signOut(): Promise<void> {
    try {
      await gapi.auth2.getAuthInstance().signOut();
      this.handleSignOut();
    } catch (error) {
      console.error('Sign-out failed:', error);
      authStore.setState({ error: 'Failed to sign out' });
    }
  }

  private async handleAuthSuccess(user = gapi.auth2.getAuthInstance().currentUser.get()): Promise<void> {
    try {
      const profile = user.getBasicProfile();
      const token = user.getAuthResponse().access_token;
      
      authStore.setState({
        isAuthenticated: true,
        user: {
          email: profile.getEmail(),
          name: profile.getName(),
          picture: profile.getImageUrl()
        },
        error: null
      });

      // Set the access token for future API calls
      gapi.client.setToken({ access_token: token });
    } catch (error) {
      console.error('Failed to handle auth success:', error);
      authStore.setState({ error: 'Failed to process authentication' });
    }
  }

  private handleSignOut(): void {
    authStore.setState({
      isAuthenticated: false,
      user: null,
      error: null
    });
  }
}

export const gmailAuth = new GmailAuth();