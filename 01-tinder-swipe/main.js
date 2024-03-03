const DECISION_THRESHOLD = 75; // Distancia que se debe mover el mouse para tomar una decisión
let isAnimating = false;
let pullDeltaX = 0; //Distancia que se ha movido el mouse

function startDrag(event) {
  if (isAnimating) return;

  // Guardar la posición inicial del mouse
  const actualCard = event.target.closest('article');
  if (!actualCard) return;

  const startX = event.pageX ?? event.touches[0].pageX; // Posición inicial del mouse

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);

  document.addEventListener('touchmove', onMove, { passive: true });
  document.addEventListener('touchend', onEnd, { passive: true });

  function onMove(event) {
    const currentX = event.pageX ?? event.touches[0].pageX; // Posición actual del mouse
    pullDeltaX = currentX - startX; // Distancia que se ha movido el mouse

    if (pullDeltaX === 0) return;

    isAnimating = true;
    const deg = pullDeltaX / 10; // Rotación de la tarjeta

    actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
    actualCard.style.cursor = 'grabbing';

    // Mostrar el botón de like o nope
    const opacity = Math.abs(pullDeltaX) / 100;
    const isRight = pullDeltaX > 0;

    const choceEl = isRight
      ? actualCard.querySelector('.choice.like')
      : actualCard.querySelector('.choice.nope');

    choceEl.style.opacity = opacity;
  }

  function onEnd(event) {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);

    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);

    //Desicion de si se queda o se va la tarjeta
    const decisionMade = Math.abs(pullDeltaX) > DECISION_THRESHOLD;
    if (decisionMade) {
      const goRight = pullDeltaX >= 0;
      const goLeft = !goRight;

      actualCard.classList.add(goRight ? 'go-right' : 'go-left');
      actualCard.addEventListener(
        'transitionend',
        () => {
          actualCard.remove();
        },
        { once: true }
      );
    } else {
      actualCard.classList.add('reset');
      actualCard.classList.remove('go-right', 'go-left');
      actualCard
        .querySelectorAll('.choice')
        .forEach((el) => (el.style.opacity = 0));
    }

    // Resetear valores
    actualCard.addEventListener('transitionend', () => {
      actualCard.removeAttribute('style');
      actualCard.classList.remove('reset');

      pullDeltaX = 0;
      isAnimating = false;
    });
  }
}

document.addEventListener('mousedown', startDrag);
document.addEventListener('touchstart', startDrag, { passive: true });
