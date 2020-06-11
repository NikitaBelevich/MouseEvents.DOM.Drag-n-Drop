'use strict';

const dragField = document.querySelector('.drag-field');
const ball = dragField.querySelector('.ball');

ball.ondragstart = () => false; // отменяем браузерный Drag’n’Drop во избежании конфликта

ball.addEventListener('mousedown', dragNDrop);

function dragNDrop(event) {
    const ballCoordinates = ball.getBoundingClientRect();
    const shiftX = event.clientX - ballCoordinates.left;
    const shiftY = event.clientY - ballCoordinates.top;
    // (2) подготовить к перемещению:
    // разместить поверх остального содержимого и в абсолютных координатах
    ball.style.position = 'absolute';
    ball.style.zIndex = 1000;
    ball.style.cursor = '-webkit-grabbing';
    // переместим в body, чтобы мяч был точно не внутри position:relative
    document.body.append(ball);
    // и установим абсолютно спозиционированный мяч под курсор
    moveAt(event.pageX, event.pageY);

    // передвинуть мяч под координаты курсора
    // и сдвинуть на половину ширины/высоты для центрирования
    function moveAt(pageX, pageY) {
        ball.style.left = pageX - shiftX + 'px';
        ball.style.top = pageY - shiftY + 'px';
    }

    // потенциальная цель переноса, над которой мы пролетаем прямо сейчас
    let currentDroppable = null;
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
        
        ball.hidden = true;
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        ball.hidden = false;

        // если clientX/clientY за пределами окна, elementFromPoint вернёт null
        if (!elemBelow) return;

        // потенциальные цели переноса помечены классом droppable (может быть и другая логика)
        let droppableBelow = elemBelow.closest('.droppable');

        if (currentDroppable != droppableBelow) {
            // мы либо залетаем на цель, либо улетаем из неё
            // внимание: оба значения могут быть null
            //   currentDroppable=null,
            //     если мы были не над droppable до этого события (например, над пустым пространством)
            //   droppableBelow=null,
            //     если мы не над droppable именно сейчас, во время этого события

            if (currentDroppable) {
                // логика обработки процесса "вылета" из droppable (удаляем подсветку)
                leaveDroppable(currentDroppable);
            }
            currentDroppable = droppableBelow;
            if (currentDroppable) {
                // логика обработки процесса, когда мы "влетаем" в элемент droppable
                enterDroppable(currentDroppable);
            }
        }
    }

    // (3) перемещать по экрану
    document.addEventListener('mousemove', onMouseMove);

    // (4) положить мяч, удалить более ненужные обработчики событий
    ball.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        ball.onmouseup = null;
        ball.style.cursor = '-webkit-grab';
    };
}

// обработка захода в droppable
function enterDroppable(elem) {
    elem.classList.add('droppable-hover'); // добавляем стилевое оформление
}
// обработка ухода из droppable
function leaveDroppable(elem) {
    elem.classList.remove('droppable-hover'); // убираем стилевое оформление
}

/* Ещё одна деталь – событие mousemove отслеживается на document, а не на ball. С первого взгляда кажется, что мышь всегда над мячом и обработчик mousemove можно повесить на сам мяч, а не на документ.

Но, как мы помним, событие mousemove возникает хоть и часто, но не для каждого пикселя. Поэтому из-за быстрого движения указатель может спрыгнуть с мяча и оказаться где-нибудь в середине документа (или даже за пределами окна). */


// TODO Task 1 

const rangeField = document.querySelector('.range-field')
const sliderRange = document.querySelector('.slider-range');

sliderRange.ondragstart = () => false; // отменяем браузерный Drag’n’Drop во избежании конфликта

sliderRange.addEventListener('mousedown', function(event) {
    const fieldCoordinates = rangeField.getBoundingClientRect();
    const leftBorderRange = fieldCoordinates.left;

    const sliderRangeCoordinates = this.getBoundingClientRect();
    const shiftX = event.clientX - sliderRangeCoordinates.left; // координата для захвата элемента в любой точке и устренения перепрыгивания
    
    function onMouseMove(event) {
        let newLeft = event.clientX - shiftX - leftBorderRange;

        if (newLeft < 0) {
            newLeft = 0;
        } 
        let rightEdge = rangeField.offsetWidth - sliderRange.offsetWidth;
        
        if (newLeft > rightEdge) {
            newLeft = rightEdge;
        }
  
        sliderRange.style.left = newLeft  + 'px'; // позиционируем ползунок
    }

    // (3) перемещать по экрану
    document.addEventListener('mousemove', onMouseMove);
    // (4) положить мяч, удалить более ненужные обработчики событий
    document.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        sliderRange.onmouseup = null;
    };
});

// TODO Task 1 

// TODO Task 2

const containerField = document.querySelector('.task2 .container-drag-n-drop');

containerField.ondragstart = () => false;

document.addEventListener('mousedown', (event) => {
    const targetDragImg = event.target.closest('.draggable');
    if (!targetDragImg) return false; // если это элемент без класса draggable, т.е неперетаскиваемый, то выходим

    const elementsFieldCoordinates = targetDragImg.getBoundingClientRect(); // получим координаты элемента
    // вычисленные координаты захвата элемента, для того, чтобы элемент не центрировался относительно курсора при захвате
    const shiftX = event.clientX - elementsFieldCoordinates.left; 
    const shiftY = event.clientY - elementsFieldCoordinates.top;
    // координата до курсора минус координата У до нижней границы элемента
    const shiftYBottom = event.clientY - elementsFieldCoordinates.bottom;
    const widthWindow = document.documentElement.offsetWidth;
    const heightWindow = document.documentElement.clientHeight;

    // даём фиксированное позиционирование (относительно окна браузера)
    targetDragImg.style.position = 'fixed'; 
    targetDragImg.style.top = event.clientY - shiftY + 'px'; // начальная координата по Y
    // targetDragImg.style.zIndex = 1000;
    function onMouseMove(event) {
        const elementsFieldCoordinates = targetDragImg.getBoundingClientRect();
        const pageX = event.pageX;
        const pageY = event.pageY;
        const clientX = event.clientX;
        const clientY = event.clientY;

        // TODO обрабатываем координату X перетаскиваемого элемента
        let borderDraggingX = clientX - shiftX;
        if (borderDraggingX <= 5) { // левая граница окна для элемента
            borderDraggingX = 5;
        }
        // ширина окна без учёта ширины drag элемента
        let rightBorderWindow = document.documentElement.offsetWidth - targetDragImg.offsetWidth;
        if (borderDraggingX >= rightBorderWindow - 5) {
            borderDraggingX = rightBorderWindow - 5;
        }
        // TODO обрабатываем координату X перетаскиваемого элемента
        
        // TODO обрабатываем координату Y перетаскиваемого элемента
        let borderDraggingY = clientY - shiftY;
        // высота нашего экрана минус высота drag элемента
        let topBorderWindow = document.documentElement.clientHeight - targetDragImg.offsetHeight;
        // если верхняя граница элемента + отступ 5px выходит за пределы экрана вверх
        if (borderDraggingY <= 5) {
            // тогда фиксируем картинку сверху с небольшим отступом
            borderDraggingY = 5;
            // и прокручиваем документ вверх с тем учётом, что у нас прокрутка начнётся когда верхний край элемента достигнет верха окна
            window.scrollBy(0, clientY - shiftY);
        }
        // нижняя граница окна с учётом расстояние от захвата до нижней границы элемента
        let bottomBorderDraggingY = clientY - shiftYBottom;
        // когда нижний край элемента выходит на нижний край окна с учётом отступа, то элемент прижимаем к низу и даём небольшой отступ
        if (bottomBorderDraggingY >= heightWindow - 5) {
            borderDraggingY = (heightWindow - targetDragImg.offsetHeight) - 5;
            // прокручиваем вниз когда элемент выходит за нижнюю границу окна, вычтя высоту окна мы получим на сколько пикселей  элемент вышел вниз, на эти значения и прокручиваем страницу.
            window.scrollBy(0, bottomBorderDraggingY - heightWindow);
        }
        // TODO обрабатываем координату Y перетаскиваемого элемента

        // позиционируем наших героев и мяч
        targetDragImg.style.left = borderDraggingX + 'px';
        targetDragImg.style.top = borderDraggingY + 'px';
    }

    // перемещать по экрану
    document.addEventListener('mousemove', onMouseMove);
    // положить мяч, удалить более ненужные обработчики событий
    document.onmouseup = function () {
        // ставим элементу координаты которые у него есть + высота прокрутки, т.к теперь позиционируем абсолютно документу
        targetDragImg.style.top = parseInt(targetDragImg.style.top) + pageYOffset + 'px';
        targetDragImg.style.position = 'absolute';
        this.removeEventListener('mousemove', onMouseMove);
        this.onmouseup = null;
    };
});

// TODO Task 2