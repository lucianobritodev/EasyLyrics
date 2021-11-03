const form = document.querySelector("#lyrics-form");

async function readKeys() {
  try {
    let data = await fetch("../../config.json")
    return data.json();
  } catch (e) {
    console.log(e.message);
    return null;
  }
}

form.addEventListener("submit", (el) => {
  el.preventDefault();
  doSubmit();
});

async function doSubmit() {
  const vagalumeUrl = document.querySelector("#vagalumeUrl");
  const artistAndSong = document.querySelector("#artistAndSong");
  const keys = await readKeys();

  let lyricsEl = document.querySelector("#lyrics");
  let artistRaw = document.querySelector("#artist").value;
  let songRaw = document.querySelector("#song").value;
  let artist = artistRaw.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(' ').join('-');
  let song = songRaw.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(' ').join('-');

  if (artist == '' || song == '') {
    return Swal.fire('Ops!', 'Algo deu errado. Por favor, preencha os campos corretamente!', 'error')
  }

  clearFields();
  document.querySelector("#loading").style.display = "block";

  try {
    const [ vagalumeJson, lyricsJson ] = await findLyrics(artist, song, keys);

    console.log("\nVagalume: \n" + vagalumeJson);
   // console.log("\nMusixmatch: \n" + musixmatchJson);
    console.log("\nLyrics: \n" + lyricsJson);
    
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
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "text/plain");

  let myInit = {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default'
  };
  
  let vagalumeRequest = new Request(`https://api.vagalume.com.br/search.php?art=${artist}&mus=${song}&limit=1&apikey=${keys[0].vagalumeApiKey}`, myInit);
  //let musixmatchRequest = new Request(`https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_artist=${artist}&q_track=${song}&apikey=${keys[1].musixmatchApiKey}&format=json`, myInit);
  let lyricsRequest = new Request(`https://api.lyrics.ovh/v1/${artist}/${song}`, myInit);

  const [ responseVagalume, responseLyrics ] = await Promise.all([
    fetch(vagalumeRequest),
    //fetch(musixmatchRequest),
    fetch(lyricsRequest)
  ]);

  const vagalumeJson = await responseVagalume.json();
  // const musixmatchJson = await responseMusixmatch.json(); responseMusixmatch,
  const lyricsJson = await responseLyrics.json();

  return [ vagalumeJson, lyricsJson ]; // musixmatchJson,
}

function titleCase(str) {
  let title = str.replace(/\w\S*/g, (str) => {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  })
  return title;
}
