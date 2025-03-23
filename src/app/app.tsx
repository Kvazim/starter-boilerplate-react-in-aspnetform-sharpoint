import { spfi, SPBrowser } from "@pnp/sp";

import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/context-info";
import "@pnp/sp/site-users/web";

async function App() {
  const url = window.location.origin

  console.log(await spfi(url).using(SPBrowser()).web.currentUser())

  return (
    <h1>Hello World</h1>
  );
}

export default App;
