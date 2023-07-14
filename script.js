let stepsText = [];
const stepsTextContainer = document.getElementById("progressTextContainer");

document.addEventListener("DOMContentLoaded", (event) => {
  let stepsData = [];

  fetch("iphoneSteps.json")
    .then((response) => response.json())
    .then((data) => {
      stepsData = data;

      const progressTextDiv = document.getElementById("progressTextContainer");

      stepsData.forEach((step, index) => {
        const progressBarWhole = document.getElementById("progressBarWhole");
        const progressBar = document.getElementById("progress-bar");
        const stepElement = document.createElement("div");
        stepElement.classList.add("step");
        stepElement.dataset.stepNumber = index + 1;
        stepsText.push(step.title);

        stepElement.addEventListener("click", () => {
          completeStep(index + 1);
          const progressText = document.getElementById("progress-text");
          const rect = stepElement.getBoundingClientRect();
          const parentRect = progressBarWhole.getBoundingClientRect(); // Get the position of the progressBarWhole container
          const left = rect.left - parentRect.left + rect.width / 2; // Calculate the position relative to the progressBarWhole container
          progressText.textContent = stepsText[index];
          progressText.classList.remove(
            "text-start",
            "text-center",
            "text-end"
          );

          progressText.style.right = "";

          // Force a reflow to ensure the width is updated
          void progressText.offsetWidth;

          const textWidth = progressText.offsetWidth; // Get the width of the text

          if (index === 0) {
            progressText.style.left = `0px`;
            progressText.classList.add("text-start");
          } else if (index === stepsData.length - 1) {
            progressText.style.right = `0px`; // Align to the right edge for the last point
            progressText.classList.add("text-end");
          } else {
            progressText.style.left = `${left - textWidth / 2}px`; // Subtract half the width of the text from the left position
          }
        });

        progressBar.appendChild(stepElement);
      });

      completeStep(1);
      document.getElementById("progress-text").textContent = stepsText[0];
    });

  function completeStep(stepNumber) {
    const stepElement = document.querySelector(
      `.step[data-step-number="${stepNumber}"]`
    );
    if (stepElement) {
      stepElement.classList.add("completed");

      // Update the width of the progress bar
      const progressBar = document.getElementById("progress-bar");
      const progress = ((stepNumber - 1) / (stepsData.length - 1)) * 100;
      progressBar.style.setProperty("--progress", `${progress}%`);
    }
  }
});

console.log(stepsText);
console.log(stepsTextContainer.offsetWidth);
