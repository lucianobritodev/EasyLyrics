function findLyrics(artist, song) {
    return fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`);
}

const form = document.querySelector('#lyrics-form');

form.addEventListener('submit', el => {
    el.preventDefault();
    doSubmit();
})

async function doSubmit() {
    const lyricsEl = document.querySelector('#lyrics');
    let artist = document.querySelector('#artist').value.split(" ").join("-");
    let song = document.querySelector('#song').value;

    if (artist == '' || song == '') {
        return alert('Os campos não podem estar vazios!\n\nPor favor, digite o nome do artista e a música para realizarmos a busca.')
    }

    lyricsEl.innerHTML = '<div class="spinner-border text-darck" role="status"><span class="sr-only">Loading...</span></div>';

    //async await
    try {
        const lyricsResponse = await findLyrics(artist, song);
        const data = await lyricsResponse.json();
        if(data.lyrics && data) {
            lyricsEl.innerHTML = data.lyrics;
        } else {
            lyricsEl.innerHTML = data.error;
        }
    } catch (error) {
        console.log(error);
    }
}