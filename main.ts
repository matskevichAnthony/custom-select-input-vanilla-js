import './style.css';
import Select from './src/CustomInput';

interface Option {
	value: String;
}

interface Config {
	placeholder: string;
	data: Option[];
	forceInput: boolean;
	multiSelect: boolean;
}

const CONFIG_REGULAR_INPUT = {
	placeholder: 'стандарт нефорсированный',
	data: [
		{ value: 'Google' },
		{ value: 'Radium' },
		{ value: 'Yandex' },
		{ value: 'Meta' },
		{ value: 'Apple' },
	],
	forceInput: false,
	multiSelect: false,
};

const CONFIG_FORCE_INPUT = {
	placeholder: 'стандарт форсированный',
	data: [
		{ value: 'Google' },
		{ value: 'Radium' },
		{ value: 'Yandex' },
		{ value: 'Meta' },
		{ value: 'Apple' },
	],
	forceInput: true,
	multiSelect: false,
};

const CONFIG_REGULAR_MULTI = {
	placeholder: 'мульти нефорсированный',
	data: [
		{ value: 'Google' },
		{ value: 'Radium' },
		{ value: 'Yandex' },
		{ value: 'Meta' },
		{ value: 'Apple' },
	],
	forceInput: false,
	multiSelect: true,
};

const CONFIG_FORCE_MULTI = {
	placeholder: 'мульти форсированный',
	data: [
		{ value: 'Google' },
		{ value: 'Radium' },
		{ value: 'Yandex' },
		{ value: 'Meta' },
		{ value: 'Apple' },
	],
	forceInput: true,
	multiSelect: true,
};

const select = new Select('#myDropdown', CONFIG_REGULAR_INPUT);
const select2 = new Select('#dropdown', CONFIG_FORCE_INPUT);
const select3 = new Select('#myDropdown3', CONFIG_REGULAR_MULTI);
const select4 = new Select('#myDropdown4', CONFIG_FORCE_MULTI);

// window.addEventListener('click', () => {
// 	console.log(select.GetValue());
// });
