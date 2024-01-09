class Task extends HTMLElement {
    static template = document.createElement('template')

    static get observedAttributes() { return ['disabled', 'size', 'task', 'at']}
    
    constructor() {
        super()
        this.attachShadow({mode: 'open'})
        this.shadowRoot.append(Task.template.content.cloneNode(true))

        this.input = this.shadowRoot.querySelector('input')
        let deleteIcon = this.shadowRoot.querySelector('slot[name="deleteIcon"]'),
            finishedTask = this.shadowRoot.querySelector('slot[name="finishedTask"]')

        this.input.onfocus = () => {this.setAttribute('focused', '')}
        this.input.onblur = () => {this.removeAttribute('focused')}

        deleteIcon.onclick = event => {
            event.stopPropagation()
            let e = new CustomEvent('deleteTask', {cancelable: true})
            this.dispatchEvent(e)
            if(!e.defaultPrevented) this.remove()
        }

        finishedTask.onclick = event => {
            event.stopPropagation()
            if (this.disabled) return;
            let e = new CustomEvent('finishedTask', {cancelable: true})
            if(!e.defaultPrevented) this.setAttribute('disabled', '')
            this.dispatchEvent(e)
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
            case 'disabled': this.input.disabled = newValue !== null; break;
            case 'size': this.input.size = newValue; break;
            case 'task': this.input.value = newValue; break;
            case 'at': this.input.value += ` at ${newValue}`; break;
        }
    }

    get disabled() { return this.hasAttribute('disabled')}
    get size() { return this.getAttribute('size')}
    get value() { return this.getAttribute('value')}
    get hidden() { return this.hasAttribute('hidden')}
    get task() { return this.getAttribute('task')}
    
    set disabled(value) {
        if (value) this.setAttribute('disabled', '')
        else this.removeAttribute('disabled')
    }
    set size(value) { this.setAttribute('size', value)}
    set value(text) { this.setAttribute('value', text)}
    set hidden(value) {
        if (value) this.setAttribute('hidden', '')
        else this.removeAttribute('hidden')
    }
    set task(text) { this.setAttribute('task', text)}
}

Task.template.innerHTML = `
<style>
    * {box-sizing: border-size;}
    :host {
        border: 1px solid black;
        border-radius: 5px;
        padding: 8px 10px ;
        text-align: center;
        font-weight: bolder;
        font-style: italic;
        font-family: Times New Roman;
        font-size: 1.2em;
    }
    :host([focused]) {box-shadow: 0 0 2px 2px #66C8EE}
    :host([disabled]) { opacity: 0.5 }
    :host([hidden]) { display: none}

    input {
        border-width: 0;
        outline: none;
        font: inherit;
        background: inherit;
    }
    slot {
        cursor: default;
        user-select: none;
    }
    div {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
    }
</style>
<div>
    <input type="text" id="taskname">
    <div>
        <slot name="finishedTask">\u{2705}</slot>
        <slot name="deleteIcon" >\u{1f4e4}</slot>
    </div>
</div>
`
customElements.define('todo-task', Task)
