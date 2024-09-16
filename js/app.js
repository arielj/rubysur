const intToTime = (int) => {
  const days = Math.floor(int / 86400000); // 1000 * 60 * 60 * 24
  const daysRest = int - days * 86400000;
  const hours = Math.floor(daysRest / 3600000); // 1000 * 60 * 60
  const hoursRest = daysRest - hours * 3600000;
  const minutes = Math.floor(hoursRest / 60000); // 1000 * 60
  const minutesRest = hoursRest - minutes * 60000;
  const seconds = Math.floor(minutesRest / 1000);

  const parts = [];
  if (days > 0) {
    parts.push(`${days} días`);
    parts.push(`${hours} hora${hours === 1 ? "" : "s"}`);
  } else if (hours > 0) {
    parts.push(`${hours} hora${hours === 1 ? "" : "s"}`);
    parts.push(`${minutes} minuto${minutes === 1 ? "" : "s"}`);
  } else {
    if (minutes > 0) parts.push(`${minutes} minuto${minutes === 1 ? "" : "s"}`);
    parts.push(`${seconds} segundo${seconds === 1 ? "" : "s"}`);
  }

  return parts.join(" y ");
};

const countdown = () => {
  const highlighted = document.querySelector("section.highlighted");
  if (!highlighted) return;

  const dateTime = highlighted.querySelector("time").getAttribute("datetime");
  const parsedDate = Date.parse(dateTime);
  const countdownDiv = highlighted.querySelector("div.countdown");

  const updateCountdown = () => {
    const now = new Date().getTime();
    const diff = parsedDate - now;

    if (diff < 0) {
      countdownDiv.innerText = "AHORA!";
      return;
    }

    const content = `Faltan: ${intToTime(diff)}!`;
    countdownDiv.innerText = content;

    let wait = 60000; // update cada minuto por defecto
    if (content.includes("segundo")) {
      wait = 1000; // update cada segundo si mostramos segundos
    }

    setTimeout(updateCountdown, wait);
  };

  updateCountdown();
};

const bindMeetupDialogButton = () => {
  window.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("details")) {
      // previene scroll chando el modal está abierto
      const scroll = window.scrollY;
      document.body.style.top = `-${scroll}px`;
      document.body.style.position = "fixed";

      const dialog = target.nextElementSibling;
      dialog.querySelector(".closeDialog").addEventListener("click", () => {
        dialog.close();
      });

      dialog.addEventListener("close", () => {
        // ajusta el scroll cuando se cierra el modal
        document.body.style.position = "static";
        window.scrollTo(0, scroll);
        dialog.querySelectorAll("iframe").forEach((iframe) => iframe.remove());
      });

      dialog.querySelectorAll(".talk").forEach((talkDiv) => {
        let iframe = talkDiv.querySelector("iframe");
        if (iframe) return;

        const youtubeEmbedURL = talkDiv.dataset.youtubeUrl;
        if (youtubeEmbedURL) {
          const iframe = document.createElement("IFRAME");
          iframe.setAttribute("width", "560");
          iframe.setAttribute("title", "YouTube Video Player");
          iframe.setAttribute("src", youtubeEmbedURL);
          iframe.setAttribute("frameborder", "0");
          iframe.setAttribute(
            "allow",
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          );
          iframe.setAttribute(
            "referrerpolicy",
            "strict-origin-when-cross-origin"
          );
          iframe.setAttribute("allowfullscreen", true);

          talkDiv.insertAdjacentElement("beforeend", iframe);
        }
      });

      dialog.showModal();
    }
  });
};

const bindAboutUsImages = () => {
  const section = document.querySelector("#about_us");
  const image = section.querySelector("img");
  const originalSrc = image.src;
  const originalAlt = image.alt;

  const resetImage = () => {
    image.src = originalSrc;
    image.alt = originalAlt;
  };

  const members = [...section.querySelectorAll("button")];

  // preload después de un rato para que no flasheen al cambiar de imagen
  const altURLs = [
    image.dataset.altUrl,
    ...members.map((button) => button.dataset.imageUrl),
  ];

  setTimeout(() => {
    altURLs.forEach((url) => {
      const preload = new Image();
      preload.src = url;
    });
  }, 5000);

  // cambio main on hover
  image.addEventListener("mouseenter", () => {
    image.src = image.dataset.altUrl;
  });
  image.addEventListener("mouseleave", resetImage);

  // cambio cada foto al hacer click en los nombres
  members.forEach((el) => {
    const setMember = () => {
      image.src = el.dataset.imageUrl;
      image.alt = el.dataset.imageAlt;
    };

    el.addEventListener("focus", setMember);
    el.addEventListener("blur", resetImage);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  countdown();
  bindMeetupDialogButton();
  bindAboutUsImages();
});
