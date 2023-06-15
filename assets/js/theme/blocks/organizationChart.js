const organizationsCharts = document.querySelectorAll('.block-organization_chart');

class OrganizationChart {
    constructor (dom) {
        this.dom = dom;
        
        this.init();
        this.listen();
    }
    init() {
        this.content = this.dom.querySelector('.persons');
        this.persons = this.content.querySelectorAll('.person');
        this.classLongSummary = "is-column";
        this.personWithLargeSummary = this.content.querySelector('[data-column="true"]')
        if (!this.personWithLargeSummary) {
            return;
        }
    }
    listen() {
        this.content.classList.add(this.classLongSummary);
    }
}

organizationsCharts.forEach((dom) => {
    new OrganizationChart(dom);
});