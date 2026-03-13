let currentIndex = 0;
const slider = document.getElementById("slider");
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;

document.querySelector(".next").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlider();
});

document.querySelector(".prev").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateSlider();
});

function updateSlider() {
  slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Like button click handler
document.querySelectorAll(".like-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("liked");
    btn.textContent = btn.classList.contains("liked") ? "💖 Liked" : "❤️ Like";
  });
});
