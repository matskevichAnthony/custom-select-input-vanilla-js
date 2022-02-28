import angleDown from './assets/angleDown.svg';
import angleUp from './assets/angleUp.svg';
import plusIcon from './assets/plusIcon.svg';

interface Option {
	value: String;
}

interface Config {
	placeholder: string;
	data: Option[];
	forceInput: boolean;
	multiSelect: boolean;
}

class Select {
	private $el: HTMLElement;
	private $input: HTMLInputElement;
	private $arrow!: HTMLElement;
	private $value!: HTMLInputElement;
	private $iconHolder!: HTMLElement;
	private $dropdown: HTMLElement;
	private $selectedValuesContainer: HTMLElement;
	private selector!: string;
	private selectedValue: string;
	private options: Config;
	private forceInput: boolean;
	private multiSelect: boolean;
	private selectedValues: string[];

	constructor(selector: string, options: Config) {
		// input selector
		this.$el = document.querySelector(selector)!;
		// options provided at the beginning
		this.options = options;
		// selected value
		this.selectedValue = '';
		//initial render
		this.render();
		// input selector
		this.$input = this.$el.querySelector('.myInput')!;
		//dropdown with options
		this.$dropdown = this.$el.querySelector('.options')!;
		// icon holder
		this.$iconHolder = this.$el.querySelector('.icon-holder')!;
		// force input
		this.forceInput = this.options.forceInput;
		// multi select
		this.multiSelect = this.options.multiSelect;
		//intialize current icon
		this.changeIcon(this.isOpen);
		//selected values
		this.selectedValues = [];
		//html selected options
		this.$selectedValuesContainer = this.$el.querySelector('.selected-items')!;
		// initialization
		this.setup();
	}

	private open(): void {
		this.$input.classList.add('show');
		this.$dropdown.classList.add('show');
		this.changeIcon(this.isOpen);
		window.addEventListener('click', this.forceSelect);
	}

	private close(): void {
		this.$dropdown.classList.remove('show');
		this.$input.classList.remove('show');
		this.changeIcon(this.isOpen);
		window.removeEventListener('click', this.forceSelect);
	}

	private errorInput(): void {
		this.$input.classList.add('error');
		this.resetInput();
	}

	private correctInput(): void {
		this.$input.classList.remove('error');
	}

	private findExistingOption(): HTMLElement {
		let div = this.$el.querySelector('.options')!;
		let li: HTMLElement[] = Array.from(div.querySelectorAll('.select-item'));
		const correctValue = li.find((item) => {
			return (
				item.textContent?.toLocaleUpperCase() ===
				this.selectedValue?.toUpperCase()
			);
		});

		return correctValue!;
	}
	// if 'forceInput' is set to true, then input is going to assure that the value is chosen from the options
	forceSelect(e: MouseEvent): void {
		if (this.forceInput) {
			if (e.target != this.$input) {
				const correctValue = this.findExistingOption();
				correctValue ? this.correctInput() : this.errorInput();
				this.close();
			}
		}
	}
	// check wether input is empty or not
	private isEmpty(): boolean {
		return this.$input.value.length === 0;
	}
	// remove element from the array of chosen elements
	private removeElement(target: HTMLElement): void {
		const filteredSelected = this.selectedValues.filter((item) => {
			return item != target.dataset.id;
		});
		this.$selectedValuesContainer.removeChild(target);
		this.selectedValues = filteredSelected;
	}

	private changeIcon(isOpen: boolean): void {
		if (this.multiSelect && !this.isEmpty()) {
			const icon = `<img src=${
				!this.isEmpty() ? plusIcon : angleUp
			} class="icon" data-type="add"/>`;
			this.$iconHolder.innerHTML = icon;
		} else {
			const icon = `<img src=${
				isOpen ? angleUp : angleDown
			} class="icon" data-type="arrow"/>`;
			this.$iconHolder.innerHTML = icon;
		}
	}
	// здесь должен быть метод, который будет делать запрос на сервер и получает варианты ответа
	private serverFilter() {
		//pseudo-code
		// make a request to the server
		// store options received from the server in an array
		// call method to render options
	}

	// filtering options while typing
	private filter(e: KeyboardEvent | MouseEvent): void {
		this.changeIcon(this.isOpen);
		const target = e.target as HTMLInputElement;
		// transform Diacritic string with special characters/symbols to a normal one
		let filter = this.$input.value
			.normalize('NFKD')
			.replace(/[^\w]/g, '')
			.toUpperCase();
		let div = this.$el.querySelector('.options')!;
		let li: HTMLElement[] = Array.from(div.querySelectorAll('.select-item'));
		for (let i = 0; i < li.length; i++) {
			let txtValue = li[i].textContent!;
			if (txtValue.toUpperCase().indexOf(filter) > -1) {
				li[i].style.display = '';
			} else {
				li[i].style.display = 'none';
			}
		}
		this.selectedValue = target.value;
	}
	private clickHandler(event: MouseEvent): void {
		const target = event.target as HTMLElement;
		const { type } = target.dataset;

		if (type === 'input' || type === 'select-container') {
			this.toggle();
		} else if (type === 'item') {
			const value = target.dataset.id!;
			this.correctInput();
			this.select(event, value);
		} else if (type === 'select-item') {
			this.removeElement(target);
		} else if (type === 'add') {
			if (this.forceInput) {
				this.forceSelect(event);
			} else {
				this.select(event, this.$input.value);
			}
		}
	}

	//renders selected options on top of the input
	private renderSelected(): void {
		this.$selectedValuesContainer.appendChild(
			getSelectedOptionTemplate(this.selectedValue),
		);
	}

	private validate(value: string): boolean {
		return this.selectedValues.includes(value);
	}

	private select(event: MouseEvent, value: string): void {
		this.selectedValue = value;
		if (this.multiSelect) {
			if (this.validate(this.selectedValue)) {
				alert(`Value ${this.selectedValue} is already selected`);
				this.$input.focus();
			} else {
				this.selectedValues.push(value);
				this.renderSelected();
				this.resetInput();
				this.filter(event);
				this.close();
			}
		} else {
			this.selectedValue = value;
			this.$value.value = this.selectedValue;
			this.forceSelect(event);
			this.close();
		}
	}

	private resetInput(): void {
		this.$input.value = '';
		this.selectedValue = '';
	}

	get isOpen(): boolean {
		return this.$dropdown.classList.contains('show');
	}

	private toggle(): void {
		this.isOpen ? this.close() : this.open();
	}

	GetValue(): string | string[] {
		if (this.multiSelect) {
			return this.selectedValues;
		} else {
			return this.selectedValue;
		}
	}

	// necessary settings to adjust funАctionality
	private setup(): void {
		this.clickHandler = this.clickHandler.bind(this);
		this.filter = this.filter.bind(this);
		this.forceSelect = this.forceSelect.bind(this);
		this.$el.addEventListener('click', this.clickHandler);
		this.$input.addEventListener('keyup', this.filter);
		this.$arrow = this.$el.querySelector('[data-type="arrow"]')!;
		this.$value = this.$el.querySelector('[data-type="input"]')!;
	}

	// renders component on the screen
	private render(): void {
		const { data, placeholder } = this.options;
		this.$el.classList.add('dropdown-content');
		this.$el.innerHTML = getTemplate(data, placeholder);
	}
}
// options render
const getSelectedOptionTemplate = (value: string) => {
	const optionNode = document.createElement('span');
	optionNode.classList.add('selected-item');
	optionNode.dataset.type = 'select-item';
	optionNode.dataset.id = value;
	optionNode.textContent = value + ' ✕';
	return optionNode;
};

// скорее всего будет переработан, нужен будет для отрисовки опций после получения ответа от сервера.
const getOptionsTemplate = (data: Option[]) => {
	const items = data.map((item) => {
		return `
        <li class="select-item" data-type="item" data-id=${item.value}>${item.value}</li>
        `;
	});
	return items;
};

const getTemplate = (data: Option[], placeholder: string) => {
	const defaultPlaceHolder = placeholder ?? 'Введите данные';
	const items = getOptionsTemplate(data);
	return `
	<div class="wrapper">
	<div class="selected-items">
	</div>
	<div class="input-wrapper">
     <input type="text" placeholder="${defaultPlaceHolder}" class="myInput" data-type="input"/>
     <div class='icon-holder'><img src=${angleUp} class="icon" data-type="arrow"/>
	 </div>
	 </div>
     <div class="options">
        ${items.join('')}
     </div>
	 </div>`;
};

export default Select;
