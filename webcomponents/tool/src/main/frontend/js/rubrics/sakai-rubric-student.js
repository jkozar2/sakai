import { RubricsElement } from "./rubrics-element.js";
import { html } from "/webcomponents/assets/lit-element/lit-element.js";
import "./sakai-rubric-criterion-preview.js";
import "./sakai-rubric-criterion-student.js";
import "./sakai-rubric-student-comment.js";
import { SakaiRubricsLanguage } from "./sakai-rubrics-language.js";

class SakaiRubricStudent extends RubricsElement {

  constructor() {

    super();

    this.preview = false;

    this.options = {};
    SakaiRubricsLanguage.loadTranslations().then(result => this.i18nLoaded = result);
  }

  static get properties() {

    return {
      token: String,
      entityId: { attribute: "entity-id", type: String },
      toolId: { attribute: "tool-id", type: String },
      stateDetails: String,
      preview: Boolean,
      instructor: Boolean,
      evaluatedItemId: { attribute: "evaluated-item-id", type: String },
      rubric: { type: Object },
      rubricId: { attribute: "rubric-id", type: String },
      forcePreview: { attribute: "force-preview", type: Boolean },
    };
  }

  attributeChangedCallback(name, oldValue, newValue) {

    super.attributeChangedCallback(name, oldValue, newValue);

    if (this.token && this.toolId && this.entityId) {
      this.init();
    }
  }

  set token(newValue) {

    this._token = "Bearer " + newValue;
    if (this.preview && this.rubricId) {
      this.setRubric();
    }
  }

  get token() { return this._token; }

  set preview(newValue) {

    this._preview = newValue;
    if (this.token && this.rubricId) {
      this.setRubric();
    }
  }

  get preview() { return this._preview; }

  set rubricId(newValue) {

    this._rubricId = newValue;
    if (this._rubricId != null && this.token && this.preview) {
      this.setRubric();
    }
  }

  get rubricId() { return this._rubricId; }

  shouldUpdate(changedProperties) {
    return this.i18nLoaded && changedProperties.has("rubric") && (this.instructor || !this.options.hideStudentPreview);
  }

  render() {

    return html`
      <hr class="itemSeparator" />

      <h3>${this.rubric.title}</h3>
      ${this.instructor==='true' ? html`
        <div class="rubrics-tab-row">
          <a href="javascript:void(0);" id="rubric-grading-or-preview-button" class="rubrics-tab-button rubrics-tab-selected" @keypress=${this.openGradePreviewTab} @click=${this.openGradePreviewTab}><sr-lang key="grading_rubric">gradingrubric</sr-lang></a>
          <a href="javascript:void(0);" id="rubric-student-summary-button" class="rubrics-tab-button" @keypress=${this.makeStudentSummary} @click=${this.makeStudentSummary}><sr-lang key="student_summary">studentsummary</sr-lang></a>
          <a href="javascript:void(0);" id="rubric-criteria-summary-button" class="rubrics-tab-button" @keypress=${this.makeCriteriaSummary} @click=${this.makeCriteriaSummary}><sr-lang key="criteria_summary">criteriasummary</sr-lang></a>
        </div>
      ` : html``}
      <div id="rubric-grading-or-preview" class="rubric-tab-content rubrics-visible">
        ${this.preview || this.forcePreview ? html`
        <sakai-rubric-criterion-preview
          criteria="${JSON.stringify(this.rubric.criterions)}"
          .weighted=${this.rubric.weighted}
        ></sakai-rubric-criterion-preview>
        ` : html`
        <sakai-rubric-criterion-student
          criteria="${JSON.stringify(this.rubric.criterions)}"
          rubric-association="${JSON.stringify(this.association)}"
          evaluation-details="${JSON.stringify(this.evaluation.criterionOutcomes)}"
          ?preview="${this.preview}"
          entity-id="${this.entityId}"
          .weighted=${this.rubric.weighted}
        ></sakai-rubric-criterion-student>
      `}
      </div>
      <div id="rubric-student-summary" class="rubric-tab-content"></div>
      <div id="rubric-criteria-summary" class="rubric-tab-content"></div>
    `;
  }

  setRubric() {

    $.ajax({
      url: `/rubrics-service/rest/rubrics/${this.rubricId}?projection=inlineRubric`,
      headers: { "authorization": this.token },
      contentType: "application/json"
    }).done(data => this.rubric = data).fail((jqXHR, textStatus, errorThrown) => {
      console.log(textStatus);console.log(errorThrown);
    });
  }

  init() {

    // First, grab the tool association
    $.ajax({
      url: `/rubrics-service/rest/rubric-associations/search/by-tool-and-assignment?toolId=${this.toolId}&itemId=${this.entityId}`,
      headers: { "authorization": this.token }
    }).done(data => {

      if (data._embedded['rubric-associations'].length) {
        this.association = data._embedded['rubric-associations'][0];
        this.options = data._embedded['rubric-associations'][0].parameters;
        var rubricId = data._embedded['rubric-associations'][0].rubricId;

        // Now, get the rubric
        $.ajax({
          url: `/rubrics-service/rest/rubrics/${rubricId}?projection=inlineRubric`,
          headers: { "authorization": this.token },
          contentType: "application/json"
        }).done(rubric => {

          // Now, get the evaluation
          $.ajax({
            url: `/rubrics-service/rest/evaluations/search/by-tool-and-assignment-and-submission?toolId=${this.toolId}&itemId=${this.entityId}&evaluatedItemId=${this.evaluatedItemId}`,
            headers: { "authorization": this.token }
          }).done(data => {

            if (data._embedded.evaluations.length) {
              this.evaluation = data._embedded.evaluations[0];
              this.preview = false;
            } else {
              this.evaluation = { criterionOutcomes: [] };
              this.preview = true;
            }

            // Set the rubric, thus triggering a render
            this.rubric = rubric;
          }).fail((jqXHR, textStatus, error) => {
            console.log(textStatus);console.log(error);
          });
        }).fail((jqXHR, textStatus, error) => {
          console.log(textStatus);console.log(error);
        });

        if (this.options.hideStudentPreview == null) {
          this.options.hideStudentPreview = false;
        }
      }
    }).fail((jqXHR, textStatus, error) => {
      console.log(textStatus);console.log(error);
    });
  }

  openGradePreviewTab(e) {
    e.stopPropagation();
    this.openRubricsTab("rubric-grading-or-preview");
  }

  makeStudentSummary(e) {
    e.stopPropagation();
    this.makeASummary("student");
  }

  makeCriteriaSummary(e) {
    e.stopPropagation();
    this.makeASummary("criteria");
  }
}

customElements.define("sakai-rubric-student", SakaiRubricStudent);
