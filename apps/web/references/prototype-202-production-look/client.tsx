// PROTOTYPE — keeps every stylesheet in the client build; inline.ts drops this script.
import { render } from "./main";

document.getElementById("root")!.innerHTML = render();
