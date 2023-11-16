window.addEventListener('load', function () {
  const imgWrapper = document.querySelector('.link');
  imgWrapper.children[0].remove();
  const newImg = document.createElement('img');
  newImg.src =
    'https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2023-2-e3-proj-mov-t2-g3-comandas/assets/13721147/ee0b596b-c6fc-4145-abc9-b90293377a6c';
  newImg.width = 75;
  newImg.height = 75;
  imgWrapper.appendChild(newImg);
});
