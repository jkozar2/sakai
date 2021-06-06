import { css, html, LitElement } from "../assets/lit-element/lit-element.js";
import { loadProperties } from "../sakai-i18n.js";

/**
 * We're extending LitElement here, so our markup will be in the shadow dom. Shadow dom is a double
 * edged sword. It gives us scoped markup which means we can relax about our ids and classnames, but
 * it doesn't work too well with things like jQuery dialogs or CKEditor which expect to be able to
 * put markup in the body, etc. Styles don't penetrate the shadow dom boundary, either. So cool
 * stuff like our sak-banner classes can't be applied unless you redefine them in the actual
 * component's static styles itself.
 */
class SakaiOpenApereo extends LitElement {

  /**
   * Return an object listing the reactive properties for this component. All of these are
   * observed by lit-element and will trigger a rerender of any part of the template referencing
   * them.
   */
  static get properties() {
    
    return {
      siteId: { attribute: "site-id", type: String },
      data: { attribute: false, type: Array },
    };
  }

  constructor() {

    super();

    // Load the openapereo i18n properties. It's asynchronous.
    loadProperties("openapereo").then(r => this.i18n = r);
  }

  /**
   * We use the setter for siteId, triggered by setting the site-id attribute, to load the data. The
   * response is mocked up in the story, using fetchMock. In Sakai we'll be using a Spring MVC
   * RestController to supply the data.
   */
  set siteId(value) {

    this._siteId = value;
    const url = `/sites/${value}/openapereo`;
    fetch(url, {
      credentials: "include"
    })
    .then(r => r.json())
    .then(data => this.data = data);
  }

  get siteId() { return this._siteId; }

  /**
   * We only want to update when our i18n strings have loaded asynchronously.
   */
  shouldUpdate() {
    return this.i18n;
  }

  /**
   * This will only be called when the i18n promise has resolved.
   */
  render() {

    return html`
      <h1>${this.i18n["welcome"]}</h1>
      ${this.data ? html`
      <table>
        <thead>
          <tr><td>Name</td><td>Weight</td><td>Lived</td></tr>
        </thead>
        <tbody>
        ${this.data.map(d => html`
          <tr><td>${d.name}</td><td>${d.weight}</td><td>${d.lived}</td></tr>
        `)}
        </tbody>
      </table>
      ` : ""}
    `;
  }

  /**
   * Return a style sheet to be used across all instances of this component. These rules only apply
   * to childer of the shadow root. They will not bleed out into surrounding markup.
   */
  static get styles() {

    return css`
      table, th, td {
        border: 1px black solid;
        border-collapse: collapse;
        padding: 6px;
      }

      thead {
        background-color: grey;
        color: white;
      }
    `;
  }
}

const tagName = "sakai-openapereo";
!customElements.get(tagName) && customElements.define(tagName, SakaiOpenApereo);
