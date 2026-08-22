(() => {
  "use strict";

  const targetImages = Array.from(
    document.querySelectorAll("main figure img")
  ).filter((image) => !image.closest("a"));

  if (targetImages.length === 0) {
    return;
  }

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.hidden = true;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "画像の拡大表示");

  const closeButton = document.createElement("button");
  closeButton.className = "lightbox__close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "拡大画像を閉じる");
  closeButton.textContent = "×";

  const expandedImage = document.createElement("img");
  expandedImage.className = "lightbox__image";
  expandedImage.alt = "";
  expandedImage.draggable = false;

  const caption = document.createElement("p");
  caption.className = "lightbox__caption";
  caption.id = "lightbox-caption";
  lightbox.setAttribute("aria-describedby", caption.id);

  lightbox.append(closeButton, expandedImage, caption);
  document.body.appendChild(lightbox);

  let lastFocusedImage = null;

  const getCaption = (image) => {
    const figureCaption = image
      .closest("figure")
      ?.querySelector("figcaption")
      ?.textContent
      ?.trim();

    return figureCaption || image.alt || "";
  };

  const openLightbox = (image) => {
    const captionText = getCaption(image);

    lastFocusedImage = image;
    expandedImage.src = image.currentSrc || image.src;
    expandedImage.alt = image.alt || "";
    caption.textContent = captionText;
    caption.hidden = captionText.length === 0;

    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus({ preventScroll: true });
  };

  const closeLightbox = () => {
    if (lightbox.hidden) {
      return;
    }

    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    expandedImage.removeAttribute("src");
    expandedImage.alt = "";
    caption.textContent = "";

    const imageToFocus = lastFocusedImage;
    lastFocusedImage = null;

    if (imageToFocus?.isConnected) {
      imageToFocus.focus({ preventScroll: true });
    }
  };

  targetImages.forEach((image) => {
    image.classList.add("lightbox-target");
    image.setAttribute("role", "button");
    image.setAttribute("tabindex", "0");
    image.setAttribute("aria-haspopup", "dialog");
    image.setAttribute(
      "aria-label",
      image.alt ? `${image.alt}を拡大表示` : "画像を拡大表示"
    );

    image.addEventListener("click", () => openLightbox(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
    } else if (event.key === "Tab") {
      event.preventDefault();
      closeButton.focus({ preventScroll: true });
    }
  });
})();
