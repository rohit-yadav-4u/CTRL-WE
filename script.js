document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Enable Lenis smooth scrolling
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const stickySection = document.querySelector(".steps");
    const stickyHeight = window.innerHeight * 5; // or even 3 for a shorter pin
    const cards = document.querySelectorAll(".card:not(.empty)");
const counterContainer = document.querySelector(".slider-counter");
    const stepNumbers = document.querySelectorAll("h1");
    const totalCards = cards.length;

    ScrollTrigger.create({
        trigger: stickySection,
        start: "top top",
        end: `+=${stickyHeight}px`,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
            positionCards(self.progress);

            // Corrected: Clamp to valid index range
            let activeIndex = Math.floor(self.progress * (totalCards));
            activeIndex = Math.max(0, Math.min(totalCards, activeIndex));
            setStep(activeIndex);
        },
    });

    function getRadius() {
        return window.innerWidth < 900
            ? window.innerWidth * 7.5
            : window.innerWidth * 2.5;
    }

    const arcAngle = Math.PI * 0.4;
    const startAngle = Math.PI / 2 - arcAngle / 2  + Math.PI * 0.09; 

    function positionCards(progress = 0) {
        const radius = getRadius();
        const totalTravel = 1 + totalCards / 7.5;
        const adjustedProgress = (progress * totalTravel - 1) * 0.75;

        cards.forEach((card, i) => {
            const normalizedProgress = (totalCards - 1 - i) / totalCards;
            const cardProgress = normalizedProgress + adjustedProgress;
            const angle = startAngle + arcAngle * cardProgress ;

            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const rotation = (angle - Math.PI/2) *(180/Math.PI);

            gsap.set(card, {
                x: x,
                y: -y + radius,
                rotation: -rotation,
                transformOrigin: "center center"
            });
        });
    }

    positionCards(0);
    setStep(0); // Ensure the first step number is shown on load

    function setStep(index) {
        // Move the countContainer to show the correct number
        gsap.to(countContainer, {
            y: -index * stepNumbers[0].offsetHeight,
            duration: 0.3,
            ease: "power1.out",
            overwrite: true,
        });
    }

    window.addEventListener("resize", () => 
        positionCards(0));
});