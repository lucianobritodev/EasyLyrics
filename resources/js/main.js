function clearFields() {
    let lyricsEl = document.querySelector("#lyrics");
    let artist = document.querySelector("#artist").value.split(" ").join("-");
    let song = document.querySelector("#song").value;
    lyricsEl.innerHTML = "";
}

function findLyrics(artist, song) {
  return fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`);
}

const form = document.querySelector("#lyrics-form");

form.addEventListener("submit", (el) => {
  el.preventDefault();
  doSubmit();
});

async function doSubmit() {
  let lyricsEl = document.querySelector("#lyrics");
  let artist = document.querySelector("#artist").value.split(" ").join("-");
  let song = document.querySelector("#song").value;

  if (artist == '' || song == '') {
    return Swal.fire('Erro:', 'Os campos estão vazios! Por favor, preencha os campos.', 'error')
  }

  clearFields();
  document.getElementById("loading").style.display = "block";

  //async await
  try {
    const lyricsResponse = await findLyrics(artist, song);
    const data = await lyricsResponse.json();
    document.getElementById("loading").style.display = "none";
    if (data.lyrics && data) {
      lyricsEl.innerHTML = data.lyrics;
    } else {
      lyricsEl.innerHTML = data.error;
    }
  } catch (error) {
    console.log(error);
  }
}

/* <div class="clearfix"><div class="spinner-border float-end" role="status"><span class="visually-hidden"></span></div></div> */
