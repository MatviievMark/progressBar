document.addEventListener("DOMContentLoaded", () => {
    const stepsText = [];
    const progressText = document.getElementById("progress-text");
    const progressBarWhole = document.getElementById("progressBarWhole");
    const progressBar = document.getElementById("progress-bar");
    let currentStep = 1;
    let stepsData = [];

    const deselectStep = (stepNumber) => {
        const stepElement = document.querySelector(
            `.step[data-step-number="${stepNumber}"]`
        );
        if (stepElement) {
            stepElement.classList.remove("selected");
            stepElement.classList.add(
                "completed"
            ); /* Adds the "completed" class to the deselected step */
        }
    };

    const completeStep = (stepNumber) => {
        const selectedStep = document.querySelector(".step.selected");
        if (selectedStep) {
            const previousStepNumber = selectedStep.dataset.stepNumber;
            deselectStep(previousStepNumber);
        }

        const stepElement = document.querySelector(
            `.step[data-step-number="${stepNumber}"]`
        );
        if (stepElement) {
            stepElement.classList.add("selected");
            const progress = ((stepNumber - 1) / (stepsData.length - 1)) * 100;
            progressBar.style.setProperty("--progress", `${progress}%`);
            progressText.textContent = stepsText[stepNumber - 1];
            const rect = stepElement.getBoundingClientRect();
            const parentRect = progressBarWhole.getBoundingClientRect();
            const left = rect.left - parentRect.left + rect.width / 2;
            const textWidth = progressText.offsetWidth;

            if (stepNumber === 1) {
                progressText.style.left = `0px`;
                progressText.classList.add("text-start");
            } else if (stepNumber === stepsData.length) {
                progressText.style.left = `${left - textWidth}px`;
                progressText.classList.add("text-end");
            } else {
                progressText.style.left = `${left - textWidth / 2}px`;
            }
            progressText.style.animation = "none";
            setTimeout(() => {
                progressText.style.animation = "";
            }, 0);
        }
    };

    fetch("iphoneSteps.json")
        .then((response) => response.json())
        .then((data) => {
            stepsData = data;

            stepsData.forEach((step, index) => {
                const stepElement = document.createElement("div");
                stepElement.classList.add("step");
                stepElement.dataset.stepNumber = index + 1;
                stepsText.push(step.title);

                stepElement.addEventListener("click", () => {
                    currentStep = index + 1;
                    completeStep(currentStep);
                });

                progressBar.appendChild(stepElement);
            });

            completeStep(1);
        });

    document.addEventListener("keydown", (event) => {
        const keyName = event.key;

        if (keyName === "ArrowRight" && currentStep < stepsData.length) {
            currentStep++;
            completeStep(currentStep);
        } else if (keyName === "ArrowLeft" && currentStep > 1) {
            currentStep--;
            completeStep(currentStep);
        }
    });
});