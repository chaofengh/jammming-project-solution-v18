

// Spotify is created as an object  {}, so each function needs to be seperated by commas
const Spotify = {
  clientId: '', // Insert client ID here.
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
    const headers = { Authorization: `Bearer ${this.accessToken}`};
    
    // this call create an empty playlist and use the name parameter to name the playlist
    const response =  await fetch(`https://api.spotify.com/v1/users/${this.userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: name})
      })
    
    // add the songs to the playlist by URI
    const jsonResponse = await response.json()
    const playlistId = jsonResponse.id
    return fetch(`https://api.spotify.com/v1/users/${this.userId}/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackUris})
        })
  } catch (error){
    console.log(error)
  }
  },

  async getSavedPlaylist(){
    try{
    const headers = { Authorization: `Bearer ${this.accessToken}`};
    const response = await fetch(`https://api.spotify.com/v1/me/playlists`, {
      headers: headers
    })
    const jsonResponse = await response.json()
    return jsonResponse.items.map((playlist) =>{
      return {
        id: playlist.id,
        name: playlist.name
      }
    })}catch(error){
      console.log(error)
    }
  },
  async getsongs(playlist_id){
    try{
      const headers = { Authorization: `Bearer ${this.accessToken}`};
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,{headers:headers})
      const jsonResponse = await response.json()
      const items = jsonResponse.items.map((song)=>{
        return {
        id: song.track.id,
        name: song.track.name,
        artist: song.track.artists[0].name,
        album: song.track.album.name,
        uri: song.track.uri
        }
      })
      
      // remove duplicate
      // the filter function will return elements into an array for element that meet the condition
      // findIndex will return tbe index of the first element that meet the condition.
      // the the index of the duplicated element will not be reach because it findIndex return the first element, which will return false with item.index
      const uniqueItems = items.filter((item,index) =>{
        return items.findIndex((otheritem) => otheritem.id === item.id) ===index;
      })

      return uniqueItems

    }catch(error){
      console.log(error)
    }
  },

  // get the trackURIs needs to be an array
  async addToPlaylist(playlistId,trackURIs){ 
    const headers = { Authorization: `Bearer ${this.accessToken}`};
    try{
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,{
        headers: headers,
        method:'POST',
        body:JSON.stringify({uris: trackURIs})
      })
      const jsonResponse = await response.json()
      console.log(jsonResponse)
    }catch(error){
      console.log(error)
    }
  },

  async removeFromPlaylist(playlist_id,trackURIs){
    const headers = { Authorization: `Bearer ${this.accessToken}`};
    try{
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,{
        headers: headers,
        method: 'DELETE',
        body: JSON.stringify({tracks: trackURIs})
      })
      const jsonResponse = await response.json()
      console.log(jsonResponse)
  
    }catch(error){
      console.log(error)
    }
  }

};

export default Spotify;
