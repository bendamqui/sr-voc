import { Bar, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Bar,
  mixins: [reactiveProp],
  mounted() {
    this.renderChart(this.chartData, {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "Words by level",
        position: "left"
      },
      plugins: {
        colorschemes: {
          scheme: "tableau.Tableau20"
        }
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              precision: 0
            }
          }
        ]
      },
      responsive: true,
      maintainAspectRatio: false
    });
  }
};
