

// Spotify is created as an object  {}, so each function needs to be seperated by commas
const Spotify = {
  clientId: '089f45afb6e74d439887c399757d9bf8', // Insert client ID here.
  redirectUri: 'http://localhost:3000/', // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
  accessToken: null,
  userId:null,

  

  // check token has been extracted from the web
   getAccessToken() {
    if (this.accessToken) {
      return this.accessToken;
    }
  
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
  
    if (accessTokenMatch && expiresInMatch) {
      this.accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return this.accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${this.clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${this.redirectUri}`;
      window.location = accessUrl;
    }
  },

  // this function look up the user input in Spotify and return an array of song info objects
  async search(term) {
    try{
    const response =  await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });

    if(response.ok){
      const jsonResponse = await response.json()
      if(!jsonResponse.tracks){
        return []
      }
      return jsonResponse.tracks.items.map(track =>{
        return{
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri}
      })
    }} catch (error){
      console.log(error)
    }
  },

  async getUserId(){
    const headers = { Authorization: `Bearer ${this.accessToken}` };
    const reponse = await fetch('https://api.spotify.com/v1/me', {headers: headers})
    const jsonResponse = await reponse.json()
    this.userId = jsonResponse.id
  },

  // this function use the name parameter to create an empty playlist,
  // and then use the URIs of songs to append them to the playlist
  // URIs needs to be in an array
  async savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }
    try{
    const headers = { Authorization: `Bearer ${this.accessToken}` };
    
    // this call create an empty playlist and use the name parameter to name the plaulist
    const response2 =  await fetch(`https://api.spotify.com/v1/users/${this.userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: name})
      })
    
    // add the songs to the playlist by URI
    const jsonResponse2 = await response2.json()
    const playlistId = jsonResponse2.id
    return fetch(`https://api.spotify.com/v1/users/${this.userId}/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackUris})
        })
  } catch (error){
    console.log(error)
  }
  }
};

export default Spotify;
