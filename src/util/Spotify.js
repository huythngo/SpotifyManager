const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const Spotify = {
  // retrieve access token from local storage
  getAccessTokenLS() {
    const expires = 0 + Number(localStorage.getItem("sm_expires"));
    if (new Date().getTime() > expires) {
      return "";
    }
    const token = localStorage.getItem("sm_token");
    return token;
  },
  setAccessTokenLS(token, expires_in) {
    localStorage.setItem("sm_token", token);
    localStorage.setItem("sm_expires", new Date().getTime() + expires_in);
  },
  getAccessToken() {
    let accessToken = Spotify.getAccessTokenLS();
    if (accessToken) {
      return accessToken;
    }
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");

      Spotify.setAccessTokenLS(accessToken, expiresIn * 1000);
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public user-read-private&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },
  searchUserProfile() {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse.display_name) {
          return {};
        }
        return {
          country: jsonResponse.country,
          name: jsonResponse.display_name,
          images: jsonResponse.images,
          uri: jsonResponse.uri,
          id: jsonResponse.id,
          external_urls: jsonResponse.external_urls,
        };
      });
  },
  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
          images: track.album.images,
        }));
      });
  },
  savePlaylist(name, trackUris) {
    const accessToken = Spotify.getAccessToken();
    console.log(accessToken);
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    return fetch("https://api.spotify.com/v1/me", { headers: headers })
      .then((response) => response.json())
      .then((jsonResponse) => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ name: name }),
        })
          .then((response) => response.json())
          .then((jsonResponse) => {
            const playlistId = jsonResponse.id;
            return fetch(
              `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
              {
                headers: headers,
                method: "POST",
                body: JSON.stringify({ uris: trackUris }),
              }
            );
          });
      });
  },
};

export default Spotify;
