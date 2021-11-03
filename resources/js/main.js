const form = document.querySelector("#lyrics-form");
const vagalumeUrl = document.querySelector("#vagalumeUrl");
const artistAndSong = document.querySelector("#artistAndSong");
const keys = {
  vagalumeApiKey: "0baa17731bcd852efce9c8c9753e13f2",
  lyricsApiKey: ""
};

form.addEventListener("submit", (el) => {
  el.preventDefault();
  doSubmit();
});

async function doSubmit() {
  let lyricsEl = document.querySelector("#lyrics");
  let artistRaw = document.querySelector("#artist").value;
  let songRaw = document.querySelector("#song").value;
  let artist = artistRaw.trim()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .toLowerCase().split(' ')
                        .join('-');
  let song = songRaw.trim()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase()
                    .split(' ')
                    .join('-');

  if (artist == '' || song == '') {
    return Swal.fire(
      'Ops!',
      'Algo deu errado. Por favor, preencha os campos corretamente!',
      'error')
  }

  clearFields();
  document.querySelector("#loading").style.display = "block";

  try {
    const [ vagalumeJson, lyricsJson ] = await findLyrics(artist, song, keys);
    
    document.querySelector("#loading").style.display = "none";
    
    if (vagalumeJson.type == 'aprox' || vagalumeJson.type == 'exact' || lyricsJson.lyrics) {
      if(vagalumeJson.type == 'aprox' || vagalumeJson.type == 'exact') {
        lyricsEl.innerHTML = vagalumeJson.mus[0].text;
        vagalumeUrl.href = vagalumeJson.mus[0].url;
        artistAndSong.innerHTML = titleCase(artistRaw) + " - " + titleCase(songRaw);
        document.querySelector("#vagalumeContainer").style.display = "block";
      } else if (lyricsJson.lyrics) {
        lyricsEl.innerHTML = lyricsJson.lyrics;
      }
    } else {
      throw new Error('Canção não encontrada!')
    }

  } catch (error) {
    document.querySelector("#loading").style.display = "none";
    lyricsEl.innerHTML = "Ops! Algo deu errado. \n" + error.message;
  }
}

function clearFields() {
  document.querySelector("#lyrics").innerHTML = "";
  document.querySelector("#vagalumeContainer").style.display = "none";
}

async function findLyrics(artist, song, keys) {
  const [ responseVagalume, responseLyrics ] = await Promise.all([
    fetch(`https://api.vagalume.com.br/search.php?art=${artist}&mus=${song}&limit=1&apikey=${keys.vagalumeApiKey}`),
    fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`)
  ]);

  const vagalumeJson = await responseVagalume.json();
  const lyricsJson = await responseLyrics.json();

  return [ vagalumeJson, lyricsJson ];
}

function titleCase(str) {
  let title = str.replace(/\w\S*/g, (str) => {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  })
  return title;
}
