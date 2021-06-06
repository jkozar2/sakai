import { html } from 'lit-html';

// We need this directive to stop lit-html escaping our styles
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import fetchMock from "fetch-mock";

// It's easy to just use template strings to build stylesheets. Really though, it would be great if
// we could just load up our fully built sass sheet.
import { styles as sakaiStyles } from "../styles/sakai-styles.js";

// This is how we mock up i18n. You can copy these into the web components bundle at some point
// and they'll just work with the component deployed in Sakai.
import { openapereoI18n } from "./i18n/openapereo.js";

import { openapereoData } from "./data/openapereo.js";

// We need our component tag, this is how you trigger the definition of it.
import '../../js/openapereo/sakai-openapereo.js';

export default {
  title: 'Sakai OpenApereo',
  decorators: [storyFn => {

    // fetchMock will mock any request made using "fetch". The first mock is for sakai-i18n.js.
    fetchMock
      .get(/.*i18n.*openapereo$/, openapereoI18n, {overwriteRoutes: true})
      .get(/sites\/playpen\/openapereo$/, openapereoData, {overwriteRoutes: true})
      .get("*", 500, {overwriteRoutes: true});
    return storyFn();
  }],
};

export const BasicDisplay = () => {

  return html`
    ${unsafeHTML(sakaiStyles)}
    <sakai-openapereo site-id="playpen"></sakai-openapereo>
  `;
};
