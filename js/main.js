"use strict";

document.querySelectorAll(".asset-image").forEach((image) => {
  image.addEventListener(
    "error",
    () => {
      image.classList.add("is-missing");
    },
    { once: true },
  );
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const viewport = carousel.querySelector(".carousel__viewport");
  const track = carousel.querySelector(".carousel__track");
  const cards = [...track.children];
  const dotsContainer = carousel.querySelector(".carousel-dots");
  const isInfiniteReviews = carousel.dataset.carousel === "reviews";
  let activeIndex = 0;
  let carouselPosition = cards.length;

  if (isInfiniteReviews) {
    cards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.append(clone);
    });
    [...cards].reverse().forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.prepend(clone);
    });
  }

  cards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Gehe zu Element ${index + 1}`);
    dot.addEventListener("click", () => moveTo(index));
    dotsContainer.append(dot);
  });

  const dots = [...dotsContainer.children];

  function getStep() {
    const trackStyle = window.getComputedStyle(track);
    return (
      cards[0].getBoundingClientRect().width +
      (parseFloat(trackStyle.columnGap) || 0)
    );
  }

  function maxIndex() {
    if (carousel.dataset.carousel === "reviews") {
      return cards.length - 1;
    }
    if (
      carousel.dataset.carousel === "steps" &&
      window.matchMedia("(min-width: 701px)").matches
    )
      return 0;
    return Math.max(
      0,
      cards.length - Math.floor((viewport.clientWidth + 1) / getStep()),
    );
  }

  function update() {
    const lastIndex = maxIndex();
    if (!isInfiniteReviews) activeIndex = Math.min(activeIndex, lastIndex);
    const offset = isInfiniteReviews
      ? carouselPosition * getStep()
      : carousel.dataset.carousel === "steps" && lastIndex === 0
        ? 0
        : Math.min(
            activeIndex * getStep(),
            Math.max(0, track.scrollWidth - viewport.clientWidth),
          );
    track.style.transform = `translateX(${-offset}px)`;
    dots.forEach((dot, index) => {
      const selected = index === activeIndex;
      dot.setAttribute("aria-current", String(selected));
      dot.hidden = !isInfiniteReviews && index > lastIndex;
    });
    carousel.querySelectorAll("[data-direction]").forEach((button) => {
      button.disabled =
        !isInfiniteReviews &&
        ((activeIndex === 0 && button.dataset.direction === "-1") ||
          (activeIndex === lastIndex && button.dataset.direction === "1"));
    });
  }

  function moveTo(index) {
    activeIndex = isInfiniteReviews
      ? Math.max(0, Math.min(index, cards.length - 1))
      : Math.max(0, Math.min(index, maxIndex()));
    if (isInfiniteReviews) carouselPosition = cards.length + activeIndex;
    update();
  }

  function moveBy(direction) {
    if (!isInfiniteReviews) {
      moveTo(activeIndex + direction);
      return;
    }
    carouselPosition += direction;
    activeIndex = (activeIndex + direction + cards.length) % cards.length;
    update();
  }

  if (isInfiniteReviews) {
    track.addEventListener("transitionend", (event) => {
      if (event.target !== track || event.propertyName !== "transform") return;
      if (carouselPosition >= cards.length * 2) {
        carouselPosition = cards.length;
      } else if (carouselPosition < cards.length) {
        carouselPosition = cards.length * 2 - 1;
      } else {
        return;
      }
      track.style.transition = "none";
      update();
      track.getBoundingClientRect();
      track.style.removeProperty("transition");
    });
  }

  carousel.querySelectorAll("[data-direction]").forEach((button) => {
    button.addEventListener("click", () =>
      moveBy(Number(button.dataset.direction)),
    );
  });

  let touchStartX = 0;
  viewport.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true },
  );
  viewport.addEventListener(
    "touchend",
    (event) => {
      const delta = touchStartX - event.changedTouches[0].clientX;
      if (Math.abs(delta) > 40) moveBy(delta > 0 ? 1 : -1);
    },
    { passive: true },
  );

  window.addEventListener("resize", update);
  update();
});
