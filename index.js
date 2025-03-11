addListeners();

function addListeners() {
    const a = animaster();
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            a.fadeIn(block, 5000);
        });
    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            a.resetFadeIn(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            a.fadeOut(block, 5000);
        });
    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            a.resetFadeOut(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            a.move(block, 1000, {x: 100, y: 10});
        });
    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            a.resetMoveAndScale(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            a.scale(block, 1000, 1.25);
        });
    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            a.resetMoveAndScale(block);
        });
    let moveAndHideReset = {reset: () => {}}
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideReset = a.moveAndHide(block, 5000);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            moveAndHideReset.reset();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            a.showAndHide(block, 1000);
        });

    let heartStop = {stop: () => {}}
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
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

        play(element) {
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
                        setTimeout(() => this.move(element, item[1]), timer);
                        break;
                }
                timer += item[1];
            }
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
            this.move(element, duration * 2 / 5, {x: 100, y: 20});
            const b = setTimeout(() => this.fadeOut(element, duration * 3 / 5), duration * 2 / 5);
            return {reset: () => {
                this.resetMoveAndScale(element);
                this.resetFadeOut(element);
                clearTimeout(b);
            }}
        },
        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => this.fadeOut(element, duration / 3), duration * 2 / 3);
        },
        heartBeating(element) {
            let b = setInterval(() => {
                this.scale(element, 500, 1.4);
                setTimeout(() => this.scale(element, 500, 1), 500);
            }, 1000);
            return {stop: () => clearInterval(b)}
        }
    }
    anim._steps = [];
    return anim;
}

const customAnimation = animaster()
    .addMove(200, {x: 40, y: 40})
    .addScale(800, 1.3)
    .addMove(200, {x: 80, y: 0})
    .addScale(800, 1)
    .addMove(200, {x: 40, y: -40})
    .addScale(800, 0.7)
    .addMove(200, {x: 0, y: 0})
    .addScale(800, 1);
customAnimation.play(document.getElementById('fadeOutBlock'));