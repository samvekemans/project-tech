const img = document.querySelector('.img');
const oldButton = document.querySelector('#old-person');
const careButton = document.querySelector('#caregiver');

document.getElementById('pictureUser').addEventListener('change', (event) => {
  if (event.target.files.length !== 0) {
    const imgFile = event.target.files[0];
    const imgSrc = URL.createObjectURL(imgFile);
    img.src = imgSrc;
  }
});

function styleButton() {
  if (window.location.pathname === '/ouderen') {
    oldButton.style.backgroundColor = '#519188';
    oldButton.style.boxShadow = '0px 0px 5px #519188';
    oldButton.style.fontWeight = 'bold';
    oldButton.classList.add('selected');

    careButton.style.backgroundColor = 'white';
    careButton.style.boxShadow = 'none';
    careButton.style.fontWeight = 'normal';
  }
  if (window.location.pathname === '/zorgmedewerker') {
    careButton.style.backgroundColor = '#519188';
    careButton.style.boxShadow = '0px 0px 5px #519188';
    careButton.style.fontWeight = 'bold';
    careButton.classList.add('selected');

    oldButton.style.backgroundColor = 'white';
    oldButton.style.boxShadow = 'none';
    oldButton.style.fontWeight = 'normal';
  }
}

styleButton();
