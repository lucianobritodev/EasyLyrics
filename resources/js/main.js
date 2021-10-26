const form = document.querySelector("#lyrics-form");

form.addEventListener("submit", (el) => {
  el.preventDefault();
  doSubmit();
});

async function doSubmit() {
  let lyricsEl = document.querySelector("#lyrics");
  let artist = document.querySelector("#artist").value.toLowerCase().trim().split(" ").join("-");
  let song = document.querySelector("#song").value.toLowerCase().trim().split(" ").join("-");

  if (artist == '' || song == '') {
    return Swal.fire('Ops!', 'Algo deu errado. Por favor, preencha os campos corretamente!', 'error')
  }

  clearFields();
  document.getElementById("loading").style.display = "block";

  try {
    const [ vagalumeJson, lyricsJson ] = await findLyrics(artist, song);
    
    document.getElementById("loading").style.display = "none";
    
    if (vagalumeJson.type == 'aprox' || vagalumeJson.type == 'exact' || lyricsJson.lyrics) {
      if(vagalumeJson.type == 'aprox' || vagalumeJson.type == 'exact') {
        lyricsEl.innerHTML = vagalumeJson.mus[0].text;
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
}

async function findLyrics(artist, song) {
  const [ responseVagalume, responseLyrics ] = await Promise.all([
    fetch(`https://api.vagalume.com.br/search.php?art=${artist}&mus=${song}&limit=1`),
    fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`)
  ]);

  const vagalumeJson = await responseVagalume.json();
  const lyricsJson = await responseLyrics.json();

  return [ vagalumeJson, lyricsJson ];
}
/* <div class="clearfix"><div class="spinner-border float-end" role="status"><span class="visually-hidden"></span></div></div> */
