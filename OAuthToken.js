const googleAuthClient = new GoogleApiClient({
  accessToken: '497100645111-rctq2u1p0pm75aebk871k30dr92l2960.apps.googleusercontent.com'
});

// Beispiel: Profil-Informationen des Google-Users abfragen
async function getUserProfile() {
  try {
    const profile = await googleAuthClient.get('https://www.googleapis.com/oauth2/v2/userinfo');
    console.log('User Profile:', profile);
  } catch (err) {
    console.error('Fehler beim Profilabruf:', err);
  }
}