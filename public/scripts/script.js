const pictureInput = document.getElementById('pictureUser');
const img = document.querySelector('.img');

pictureInput.addEventListener('change', (event) => {
  if(event.target.files.length !== 0){
    const imgFile = event.target.files[0]
    const imgSrc = URL.createObjectURL(imgFile);

    img.src = imgSrc
  }
});
