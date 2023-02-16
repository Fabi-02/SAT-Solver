import { createApp } from "vue";
import "./css/style.css";
import App from "./App.vue";
import router from "./router/routes";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHouse, faGears, faBolt, faChessQueen, faBorderAll, faAlignJustify } from '@fortawesome/free-solid-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faHouse, faGears, faBolt, faChessQueen, faBorderAll, faAlignJustify, faSquare);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.mount("#app");
