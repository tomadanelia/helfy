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
  let activeIndex = 0;

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
      return (
        cards.length - (window.matchMedia("(max-width: 700px)").matches ? 2 : 1)
      );
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
    activeIndex = Math.min(activeIndex, lastIndex);
    const isFinalMobileReview =
      carousel.dataset.carousel === "reviews" &&
      window.matchMedia("(max-width: 700px)").matches &&
      activeIndex === lastIndex;
    const offset =
      carousel.dataset.carousel === "steps" && lastIndex === 0
        ? 0
        : isFinalMobileReview
          ? Math.max(0, track.scrollWidth - viewport.clientWidth)
          : Math.min(
              activeIndex * getStep(),
              Math.max(0, track.scrollWidth - viewport.clientWidth),
            );
    track.style.transform = `translateX(${-offset}px)`;
    dots.forEach((dot, index) => {
      const selected = index === activeIndex;
      dot.setAttribute("aria-current", String(selected));
      dot.hidden = index > lastIndex;
    });
    carousel.querySelectorAll("[data-direction]").forEach((button) => {
      button.disabled =
        (activeIndex === 0 && button.dataset.direction === "-1") ||
        (activeIndex === lastIndex && button.dataset.direction === "1");
    });
  }

  function moveTo(index) {
    activeIndex = Math.max(0, Math.min(index, maxIndex()));
    update();
  }

  carousel.querySelectorAll("[data-direction]").forEach((button) => {
    button.addEventListener("click", () =>
      moveTo(activeIndex + Number(button.dataset.direction)),
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
      if (Math.abs(delta) > 40) moveTo(activeIndex + (delta > 0 ? 1 : -1));
    },
    { passive: true },
  );

  window.addEventListener("resize", update);
  update();
});
