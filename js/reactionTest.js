(function() {
    const testContainerEl = document.getElementsByClassName("test-container")[0];
    const titleEl = document.getElementsByClassName("title")[0];
    const descriptionEl = document.getElementsByClassName("description")[0];
    const begin = function(options) {
        const status = {
            currentStepIndex: 0,
            steps: [
                {
                    name: "pending",
                    title: "Przygotuj się na zmianę koloru...",
                    backgroundClass: "is-error",
                },
                {
                    name: "ready",
                    title: "Naciśnij!",
                    backgroundClass: "is-success",
                },
                {
                    name: "result",
                    title: "Czas reakcji: ",
                    backgroundClass: null,
                }
            ],
            attempts: 5 || options.attempts,
            displayTimestamp: null,
            clickTimestamp: null,
            times: [],
            difference: function() {
                return this.clickTimestamp - this.displayTimestamp;
            },
            average: function() {
                return this.times.reduce(function(total, time) {
                    return total += time;
                }) / this.times.length;
            }
        };

        const render = function(view) {
            testContainerEl.classList = "test-container";
            testContainerEl.classList.add(view.backgroundClass);
            titleEl.textContent = view.title;
            if (view.name === "ready") {
                status.displayTimestamp = Date.now();
            }

            if (view.name === "result") {
                descriptionEl.textContent = status.difference() + "ms";
            } else {
                descriptionEl.textContent = "";
            }
        }

        const nextStep = function() {
            const stepsHandler = function() {
                if (status.currentStepIndex < status.steps.length - 1) {
                    status.currentStepIndex++;
                } else {
                    status.currentStepIndex = 0;
                }
            }

            if (status.currentStepIndex === 0) {
                render(status.steps[status.currentStepIndex]);
                const delay = Math.random() * 4 + 1;
                return setTimeout(function() {
                    render(status.steps[status.currentStepIndex]);
                    stepsHandler();
                    return nextStep();
                }, delay * 1000);
            } else if (status.currentStepIndex === 1) {
                render(status.steps[status.currentStepIndex]);
                stepsHandler();
            } else {
                status.clickTimestamp = Date.now();
                status.times.push(status.difference());
                render(status.steps[status.currentStepIndex]);
                stepsHandler();
            }
        }

        testContainerEl.removeEventListener("click", begin);
        testContainerEl.addEventListener("click", nextStep);
        nextStep();
    }

    testContainerEl.addEventListener("click", begin);
})();