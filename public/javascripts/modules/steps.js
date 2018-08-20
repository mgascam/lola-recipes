import { $ } from './bling';

function createStep(id) {
    const li = document.createElement('li');
    li.innerHTML = `<input type="text" id="step-${id}" value="" name="steps">`;
    return li;
}

function steps(steps) {
    if (!steps) return;
    const addStep = $('#add-step');
    const removeStep = $('#remove-step');
    addStep.on('click', function (e) {
        e.preventDefault();
        steps.append(createStep(steps.children.length + 1));
    });
    removeStep.on('click', function (e) {
        e.preventDefault();
        const elements = steps.children.length;
        if (elements <= 1) return;
        steps.removeChild(steps.children[elements - 1]);
    });
}


export default steps;
