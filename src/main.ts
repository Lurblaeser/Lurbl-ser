import { createApp } from 'vue/dist/vue.esm-bundler.js';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import './index.css';
import App from './App.vue'
import {router} from './router'

// Components
import Toast from 'primevue/toast';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(PrimeVue);
app.use(ToastService);

app.component(Toast.name, Toast)
app.component(Splitter.name, Splitter)
app.component(SplitterPanel.name, SplitterPanel)

// Generic components
import SButton from './components/generic/SButton.vue';
app.component('SButton', SButton)

// Headless UI
import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Switch,
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem
} from '@headlessui/vue'
app.component('TabGroup', TabGroup)
app.component('TabList', TabList)
app.component('Tab', Tab)
app.component('TabPanels', TabPanels)
app.component('TabPanel', TabPanel)
app.component('Listbox', Listbox)
app.component('ListboxButton', ListboxButton)
app.component('ListboxOptions', ListboxOptions)
app.component('ListboxOption', ListboxOption)
app.component('Switch', Switch)
app.component('TransitionRoot', TransitionRoot)
app.component('TransitionChild', TransitionChild)
app.component('Dialog', Dialog)
app.component('DialogPanel', DialogPanel)
app.component('DialogTitle', DialogTitle)
app.component('DialogDescription', DialogDescription)
app.component('Menu', Menu)
app.component('MenuButton', MenuButton)
app.component('MenuItems', MenuItems)
app.component('MenuItem', MenuItem)

// Heroicons
//// Solid
import { CheckIcon, ChevronUpDownIcon, CodeBracketIcon, } from '@heroicons/vue/24/solid'
app.component('CheckIcon', CheckIcon)
app.component('ChevronUpDownIcon', ChevronUpDownIcon)
app.component('CodeBracketIcon', CodeBracketIcon)

//// Outline
import { PlusIcon, ArrowPathIcon, CogIcon, InformationCircleIcon, ArrowRightIcon, TrashIcon } from '@heroicons/vue/24/outline'
app.component('PlusIcon', PlusIcon)
app.component('TrashIcon', TrashIcon)
app.component('ArrowPathIcon', ArrowPathIcon)
app.component('CogIcon', CogIcon)
app.component('InformationCircleIcon', InformationCircleIcon)
app.component('ArrowRightIcon', ArrowRightIcon)

app.mount('#app')
