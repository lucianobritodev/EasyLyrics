const form = document.querySelector("#lyrics-form");

form.addEventListener("submit", (el) => {
  el.preventDefault();
  doSubmit();
});

async function doSubmit() {
  let lyricsEl = document.querySelector("#lyrics");
  let artistRaw = document.querySelector("#artist").value;
  let songRaw = document.querySelector("#song").value;
  let artist = artistRaw.toLowerCase().trim().split(" ").join("-");
  let song = songRaw.toLowerCase().trim().split(" ").join("-");
  const key = '0baa17731bcd852efce9c8c9753e13f2';
  const vagalumeUrl = document.querySelector("#vagalumeUrl");
  const artistAndSong = document.querySelector("#artistAndSong");

  if (artist == '' || song == '') {
    return Swal.fire('Ops!', 'Algo deu errado. Por favor, preencha os campos corretamente!', 'error')
  }

  clearFields();
  document.querySelector("#loading").style.display = "block";

  try {
    const [ vagalumeJson, lyricsJson ] = await findLyrics(artist, song, key);
    
    document.querySelector("#loading").style.display = "none";
    
    if (vagalumeJson.type == 'aprox' || vagalumeJson.type == 'exact' || lyricsJson.lyrics) {
      if(vagalumeJson.type == 'aprox' || vagalumeJson.type == 'exact') {
        lyricsEl.innerHTML = vagalumeJson.mus[0].text;
        vagalumeUrl.href = vagalumeJson.mus[0].url;
        artistAndSong.innerHTML = artistRaw.toLowerCase() + " - " + songRaw.toLowerCase();
        document.querySelector("#vagalumeContainer").style.display = "block";
      } else if (lyricsJson.lyrics) {
        lyricsEl.innerHTML = lyricsJson.lyrics;
      }
    } else {
      throw new Error('No lyrics found!')
    }

  } catch (error) {
    lyricsEl.innerHTML = error.message;
  }
}

function clearFields() {
  document.querySelector("#lyrics").innerHTML = "";
  document.querySelector("#vagalumeContainer").style.display = "none";
}

async function findLyrics(artist, song, key) {
  const [ responseVagalume, responseLyrics ] = await Promise.all([
    fetch(`https://api.vagalume.com.br/search.php?art=${artist}&mus=${song}&limit=1&apikey=${key}`),
    fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`)
  ]);

  const vagalumeJson = await responseVagalume.json();
  const lyricsJson = await responseLyrics.json();

  return [ vagalumeJson, lyricsJson ];
}
/* <div class="clearfix"><div class="spinner-border float-end" role="status"><span class="visually-hidden"></span></div></div> */
