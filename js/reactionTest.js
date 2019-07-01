(function() {
    const $ = function(el) {
        return document.querySelector(el);
    }

    const testContainerEl = $(".test-container");
    const titleEl = $(".title");
    const descriptionEl = $(".description");
    const testDetailsEl = $(".test-details");
    const triesEl = $(".test-tries");
    const averageEl = $(".test-average");

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
            cycle: 1,
            attempts: options.attempts || 5,
            displayTimestamp: null,
            clickTimestamp: null,
            times: [],
            difference: function() {
                return this.clickTimestamp - this.displayTimestamp;
            },
            average: function() {
                return (this.times.reduce(function(total, time) {
                    return total += time;
                }, 0) / (this.times.length || 1)).toFixed(0);
            }
        };

        const render = function(view) {
            testContainerEl.classList = "test-container";
            testContainerEl.classList.add(view.backgroundClass);
            titleEl.textContent = view.title;
            triesEl.textContent = "Próby: " + status.cycle + " / " + status.attempts;
            averageEl.textContent = "Średnia: " + status.average() + "ms";
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
                    status.cycle++;
                }
            }

            if (status.cycle > status.attempts) {
                return alert("Koniec testu! Średnia: " + status.average());
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
        testDetailsEl.classList.remove("is-hidden");
        nextStep();
    }

    testContainerEl.addEventListener("click", begin);
})();