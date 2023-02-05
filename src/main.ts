import { createApp } from "vue";
import "./css/style.css";
import App from "./App.vue";
import router from "./router/routes";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGear, faHouse, faGears, faChessQueen, faBorderAll } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faGear, faHouse, faGears, faChessQueen, faBorderAll);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.mount("#app");
