document.addEventListener("DOMContentLoaded", () => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    gsap.registerPlugin(ScrollTrigger);

    const animatedIcons = document.querySelector(".animated-icons");
    const iconElements = document.querySelectorAll(".animated-icon");
    const textSegments = document.querySelectorAll(".text-segment");
    const placeholders = document.querySelectorAll(".placeholder-icon");
    const heroHeader = document.querySelector(".hero-header");
    const heroSection = document.querySelector(".hero");

    const textAnimationOrder = [];
    textSegments.forEach((segment, index) => {
        textAnimationOrder.push({ segment, originalIndex: index });
    });

    for (let i = textAnimationOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [textAnimationOrder[i], textAnimationOrder[j]] = [
            textAnimationOrder[j],
            textAnimationOrder[i],
        ];
    }

    const isMobile = window.innerWidth <= 1000;
    const headerIconSize = isMobile ? 30 : 60;
    const currentIconSize = iconElements[0].getBoundingClientRect().width;
    const exactScale = headerIconSize / currentIconSize;

    // Split all .text-segment elements into words
    const allWordSpans = [];
    document.querySelectorAll('.text-segment').forEach(segment => {
        const text = segment.textContent;
        segment.textContent = '';
        text.split(' ').forEach((word, idx, arr) => {
            const span = document.createElement('span');
            span.textContent = word + (idx < arr.length - 1 ? ' ' : '');
            span.style.opacity = 0;
            span.style.display = 'inline-block';
            span.style.transition = 'opacity 0.4s cubic-bezier(.87,0,.13,1)';
            segment.appendChild(span);
            allWordSpans.push(span);
        });
    });

    // Shuffle for random reveal order (optional, remove this block for sequential reveal)
    const shuffledWords = allWordSpans.slice();
    // If you want sequential reveal, comment out the shuffle below
    for (let i = shuffledWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
    }

    ScrollTrigger.create({
        trigger: ".hero",
        start: "top top",
        end: `+=${window.innerHeight * 8}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
            const progress = self.progress;

            // Hide animated icons if hero section is not visible (progress < 0 or > 1)
            if (progress < 0 || progress > 1) {
                gsap.set(animatedIcons, { display: "none" });
            } else {
                gsap.set(animatedIcons, { display: "flex" });
            }

            textSegments.forEach((segment) => {
                gsap.set(segment, { opacity: 0 });
            });

            if (progress <= 0.3) {
                const moveProgress = progress / 0.3;
                const containerMoveY = -window.innerHeight * 0.3 * moveProgress;

                if (progress <= 0.15) {
                    const headerProgress = progress / 0.15;
                    const headerMoveY = -50 * headerProgress;
                    const headerOpacity = 1 - headerProgress;

                    gsap.set(heroHeader, {
                        transform: `translate(-50%, calc(-50% + ${headerMoveY}px))`,
                        opacity: headerOpacity,
                    });
                } else {
                    gsap.set(heroHeader, {
                        transform: `translate(-50%, calc(-50% + -50px))`,
                        opacity: 0,
                    });
                }
                if (window.duplicateIcons) {
                    window.duplicateIcons.forEach((duplicate) => {
                        if (duplicate.parentNode) {
                            duplicate.parentNode.removeChild(duplicate);
                        }
                    });
                    window.duplicateIcons = null;
                }

                gsap.set(animatedIcons, {
                    x: 0,
                    y: containerMoveY,
                    scale: 1,
                    opacity: 1,
                });

                iconElements.forEach((icon, index) => {
                    const staggerDelay = index * 0.1;
                    const iconStart = staggerDelay;
                    const iconEnd = staggerDelay + 0.5;

                    const iconProgress = gsap.utils.mapRange(
                        iconStart,
                        iconEnd,
                        0,
                        1,
                        moveProgress
                    );

                    const clampedProgress = Math.max(
                        0,
                        Math.min(1, iconProgress)
                    );

                    const startOffset = -containerMoveY;
                    const individualY = startOffset * (1 - clampedProgress);

                    gsap.set(icon, {
                        x: 0,
                        y: individualY,
                    });
                });
            } else if (progress <= 0.6) {
                const scaleProgress = (progress - 0.3) / 0.3;

                gsap.set(heroHeader, {
                    transform: `translate(-50%, calc(-50% + -50px))`,
                    opacity: 0,
                });

                if (scaleProgress >= 0.5) {
                    heroSection.style.backgroundColor = "#e3e0d8";
                } else {
                    heroSection.style.backgroundColor = "#141414";
                }

                if (window.duplicateIcons) {
                    window.duplicateIcons.forEach((duplicate) => {
                        if (duplicate.parentNode) {
                            duplicate.parentNode.removeChild(duplicate);
                        }
                    });
                    window.duplicateIcons = null;
                }

                const targetCenterY = window.innerHeight / 2;
                const targetCenterX = window.innerWidth / 2;
                const containerRect = animatedIcons.getBoundingClientRect();
                const currentCenterX =
                    containerRect.left + containerRect.width / 2;
                const currentCenterY =
                    containerRect.top + containerRect.height / 2;
                const deltaX = (targetCenterX - currentCenterX) * scaleProgress;
                const deltaY = (targetCenterY - currentCenterY) * scaleProgress;
                const baseY = -window.innerHeight * 0.3;
                const currentScale = 1 + (exactScale - 1) * scaleProgress;

                gsap.set(animatedIcons, {
                    x: deltaX,
                    y: baseY + deltaY,
                    scale: currentScale,
                    opacity: 1,
                });

                iconElements.forEach((icon) => {
                    gsap.set(icon, { x: 0, y: 0 });
                });
            } else if (progress <= 0.75) {
                const moveProgress = (progress - 0.6) / 0.15;
                const scaleProgress = 1; // Add this line

                gsap.set(heroHeader, {
                    transform: `translate(-50%, calc(-50% + -50px))`,
                    opacity: 0,
                });

                heroSection.style.backgroundColor = "#e3e0d8";
                const targetCenterY = window.innerHeight / 2;
                const targetCenterX = window.innerWidth / 2;
                const containerRect = animatedIcons.getBoundingClientRect();
                const currentCenterX =
                    containerRect.left + containerRect.width / 2;
                const currentCenterY =
                    containerRect.top + containerRect.height / 2;
                const deltaX = targetCenterX - currentCenterX;
                const deltaY = targetCenterY - currentCenterY;
                const baseY = -window.innerHeight * 0.3;
                const currentScale = 1 + (exactScale - 1) * scaleProgress;

                gsap.set(animatedIcons, {
                    x: deltaX,
                    y: baseY + deltaY,
                    scale: exactScale,
                    opacity: 0,
                });

                iconElements.forEach((icon) => {
                    gsap.set(icon, { x: 0, y: 0 });
                });

                if (!window.duplicateIcons) {
                    window.duplicateIcons = [];
                    iconElements.forEach((icon, index) => {
                        const duplicate = icon.cloneNode(true);
                        duplicate.className = "duplicate-icon";
                        duplicate.style.position = "absolute";
                        duplicate.style.width = headerIconSize + "px";
                        duplicate.style.height = headerIconSize + "px";

                        document.body.appendChild(duplicate);
                        window.duplicateIcons.push(duplicate);
                    });
                }

                if (window.duplicateIcons) {
                    window.duplicateIcons.forEach((duplicate, index) => {
                        if (index < placeholders.length) {
                            const iconRect =
                                iconElements[index].getBoundingClientRect();
                            const startCenterX =
                                iconRect.left + iconRect.width / 2;
                            const startCenterY =
                                iconRect.top + iconRect.height / 2;
                            const startPageX =
                                startCenterX + window.pageXOffset;
                            const startPageY =
                                startCenterY + window.pageYOffset;

                            const targetRect =
                                placeholders[index].getBoundingClientRect();
                            const targetCenterX =
                                targetRect.left + targetRect.width / 2;
                            const targetCenterY =
                                targetRect.top + targetRect.height / 2;
                            const targetPageX =
                                targetCenterX + window.pageXOffset;
                            const targetPageY =
                                targetCenterY + window.pageYOffset;

                            const moveX = targetPageX - startPageX;
                            const moveY = targetPageY - startPageY;

                            let currentX = 0;
                            let currentY = 0;

                            if (moveProgress <= 0.5) {
                                const verticalProgress = moveProgress / 0.5;
                                currentY = moveY * verticalProgress;
                            } else {
                                const horizontalProgress =
                                    (moveProgress - 0.5) / 0.5;
                                currentY = moveY;
                                currentX = moveX * horizontalProgress;
                            }

                            const finalPageX = startPageX + currentX;
                            const finalPageY = startPageY + currentY;

                            duplicate.style.left =
                                finalPageX - headerIconSize / 2 + "px";
                            duplicate.style.top =
                                finalPageY - headerIconSize / 2 + "px";
                            duplicate.style.opacity = "1";
                            duplicate.style.display = "flex";
                        }
                    });
                }
            } else {
                gsap.set(heroHeader, {
                    transform: `translate(-50%, calc(-50% + -100px))`,
                    opacity: 0,
                });

                heroSection.style.backgroundColor = "#e3e0d8";


                gsap.set(animatedIcons, { opacity: 0});

                if (window.duplicateIcons) {
                    window.duplicateIcons.forEach((duplicate, index) => {
                        if (index < placeholders.length) {

                            const targetRect =
                                placeholders[index].getBoundingClientRect();
                            const targetCenterX =
                                targetRect.left + targetRect.width / 2;
                            const targetCenterY =
                                targetRect.top + targetRect.height / 2;
                            const targetPageX =
                                targetCenterX + window.pageXOffset;
                            const targetPageY =
                                targetCenterY + window.pageYOffset;

                            duplicate.style.left =
                                targetPageX - headerIconSize / 2 + "px";
                            duplicate.style.top =
                                targetPageY - headerIconSize / 2 + "px";  
                            duplicate.style.opacity = "1";
                            duplicate.style.display = "flex"; 
                        }
                    });
                }         

                textAnimationOrder.forEach(({ segment, originalIndex }, idx) => {
                    const segmentStart = 0.75 + idx * 0.03;
                    const segmentEnd = segmentStart + 0.015;

                    const segmentProgress = gsap.utils.mapRange(
                        segmentStart,
                        segmentEnd,
                        0,
                        1,
                        progress
                    );
                    const clampedProgress = Math.max(
                        0,
                        Math.min(1, segmentProgress)
                    );
                    gsap.set(segment, {
                        opacity: clampedProgress,
                    });
                });
            }

            // Reveal all words randomly based on scroll progress
            const wordStart = 0.8; // when reveal starts
            const wordEnd = 1.0;   // when reveal ends
            const wordProgress = gsap.utils.clamp(0, 1, (self.progress - wordStart) / (wordEnd - wordStart));
            const totalWords = shuffledWords.length;
            const revealWordCount = Math.floor(wordProgress * totalWords);

            shuffledWords.forEach((word, idx) => {
                word.style.opacity = idx < revealWordCount ? 1 : 0;
            });
        },
    });
});





