import React, { useState, useEffect } from 'react';
import './music.css';

const MusicApp = () => {
    const [searchInput, setSearchInput] = useState('');
    const [songResults, setSongResults] = useState([]);
    const [artistResults, setArtistResults] = useState([]);

    useEffect(() => {
        const fetchToken = async () => {
            const clientId = '5dc81369ea95430389aa7953b2793c5b';
            const clientSecret = 'ccaac2cc391e43ada0af050d0721e546';

            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
                },
                body: 'grant_type=client_credentials'
            });

            const data = await response.json();
            return data.access_token;
        };

        const searchSongs = async () => {
            const token = await fetchToken();
            const response = await fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=track,artist`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            const data = await response.json();
            setSongResults(data.tracks.items);
            setArtistResults(data.artists.items);
        };

        if (searchInput) {
            searchSongs();
        }
    }, [searchInput]);

    const handleAudioPlay = (audio) => {
        const activePlayer = document.getElementById(audio);
        const players = document.getElementsByTagName('audio');
        for (let i = 0; i < players.length; i++) {
            if (players[i] !== activePlayer && !players[i].paused) {
                players[i].pause();
            }
        }
    };

    return (
        <>
            <header>
                <div className="header">
                    <h1>Музыка</h1>
                    <div className="navigation">
                        <button onClick={() => window.location.href = 'index.html'} type="button">Домой</button>
                        <button onClick={() => window.location.href = 'music.html'} type="button">Главная</button>
                    </div>
                    <div className="search">
                        <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Поиск..." />
                    </div>
                </div>
            </header>

            <main>
                <div className="container">
                    <div className="search-results">
                        <h2>Результаты поиска артистов</h2>
                        <div className="artist-results">
                            {artistResults.map(artist => (
                                <div key={artist.id} className="artist-card" onClick={() => window.location.href = `artist.html?id=${artist.id}`}>
                                    <div className="artist-image-container">
                                        <img src={artist.images[0]?.url || 'placeholder_image_url'} alt={artist.name} />
                                    </div>
                                    <p>{artist.name}</p>
                                </div>
                            ))}
                        </div>
                        <h2>Результаты поиска песен</h2>
                        <div className="song-results">
                            {songResults.map(song => (
                                <div key={song.id} className="song-card">
                                    <img src={song.album.images[0].url} alt={song.name} />
                                    <p>{song.name}</p>
                                    <p>{song.artists[0].name}</p>
                                    <audio
                                        id={`audio-${song.id}`}
                                        src={song.preview_url}
                                        controls
                                        className="audio-player"
                                        onPlay={() => handleAudioPlay(`audio-${song.id}`)}
                                    ></audio>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <footer>
                <p>© 2024 Мой Гид. Все права защищены.</p>
            </footer>
        </>
    );
};

export default MusicApp;
