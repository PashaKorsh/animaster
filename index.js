addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            const a = animaster();
            a.fadeIn(block, 5000);
        });
    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            const a = animaster();
            a.resetFadeIn(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            const a = animaster();
            a.fadeOut(block, 5000);
        });
    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            const a = animaster();
            a.resetFadeOut(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            const a = animaster();
            a.move(block, 1000, {x: 100, y: 10});
        });
    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            const a = animaster();
            a.resetMoveAndScale(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            const a = animaster();
            a.scale(block, 1000, 1.25);
        });
    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            const a = animaster();
            a.resetMoveAndScale(block);
        });
    let moveAndHideReset = {reset: () => {}}
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            const a = animaster();
            moveAndHideReset = a.moveAndHide(block, 5000);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            moveAndHideReset.reset();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            const a = animaster();
            a.showAndHide(block, 1000);
        });

    let heartStop = {stop: () => {}}
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            const a = animaster();
            heartStop = a.heartBeating(block);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartStop.stop();
        });
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

function animaster() {
    const anim = {
        addMove(duration, params) {
            this._steps.push(['move', duration, params]);
            return this;
        },
        addScale(duration, params) {
            this._steps.push(['scale', duration, params]);
            return this;
        },
        addFadeIn(duration) {
            this._steps.push(['fadeIn', duration]);
            return this;
        },
        addFadeOut(duration) {
            this._steps.push(['fadeOut', duration]);
            return this;
        },
        addDelay(duration) {
            this._steps.push(['delay', duration]);
            return this;
        },
        play(element, cycled = false) {
            let flag = true;
            const executeSteps = () => {
                let timer = 0;
                for (const item of this._steps) {
                    switch (item[0]) {
                        case 'move':
                            setTimeout(() => this.move(element, item[1], item[2]), timer);
                            break;
                        case 'scale':
                            setTimeout(() => this.scale(element, item[1], item[2]), timer);
                            break;
                        case 'fadeIn':
                            setTimeout(() => this.fadeIn(element, item[1]), timer);
                            break;
                        case 'fadeOut':
                            setTimeout(() => this.fadeOut(element, item[1]), timer);
                            break;
                        case 'delay':
                            break;
                    }
                    timer += item[1];
                }

                if (cycled && flag) {
                    setTimeout(executeSteps, timer);
                }
            };
            executeSteps();
            return {stop: () => flag = false, reset: () => { this.resetMoveAndScale(element); this.resetFadeOut(element)} }
        },
        fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        resetFadeIn(element) {
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        resetFadeOut(element) {
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        resetMoveAndScale(element) {
            element.style.transitionDuration = null;
            element.style.transform = null;
        },
        moveAndHide(element, duration) {
            return this.addMove(duration * 2 / 5, {x: 100, y: 20})
                .addFadeOut(duration * 3 / 5)
                .play(element);
        },
        showAndHide(element, duration) {
            return this.addFadeIn(duration / 3)
                .addDelay(duration / 3)
                .addFadeOut(duration / 3)
                .play(element);
        },
        heartBeating(element) {
            return this.addScale(500, 1.4)
                .addScale(500, 1)
                .play(element, true);
        }
    }
    anim._steps = [];
    return anim;
}