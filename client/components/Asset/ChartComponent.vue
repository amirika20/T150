<script setup lang="ts">
import { onBeforeMount, reactive } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent, TitleComponent } from "echarts/components";
import ECharts from "vue-echarts";
import { fetchy } from "@/utils/fetchy";
const props = defineProps(["username"]);

// Register necessary echarts components
use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, TitleComponent]);

interface ChartData {
  xAxis: {
    type: string;
    data: string[];
  };
  yAxis: {
    type: string;
  };
  series: {
    data: number[];
    type: string;
    smooth: boolean;
  }[];
}

const state = reactive<{
  chartData: ChartData | null;
}>({
  chartData: null,
});

const filterDate = new Date("2024-06-20");

// Helper function to generate all dates between two dates
function generateDateRange(startDate: Date, endDate: Date): string[] {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

async function fetchData() {
  let response;
  try {
    response = await fetchy(`/api/workouts/daily/${props.username}`, "GET", {});
  } catch (_) {
    return;
  }
  if (response) {
    const filteredResponse = response
      .filter((entry: { date: string }) => new Date(entry.date) > filterDate)
      .sort((a: { date: string }, b: { date: string }) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const startDate = filterDate;
    const endDate = new Date();
    const allDates = generateDateRange(startDate, endDate);

    const dateToMeterMap = new Map<string, number>();
    filteredResponse.forEach((entry: { date: string; totalMeters: number }) => {
      dateToMeterMap.set(entry.date, entry.totalMeters);
    });

    const seriesData = allDates.map((date) => dateToMeterMap.get(date) || 0);

    state.chartData = {
      xAxis: {
        type: "category",
        data: allDates,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: seriesData,
          type: "line",
          smooth: false, // Ensure straight lines between points
        },
      ],
    };
  }
}

// Fetch data on component mount
onBeforeMount(async () => {
  await fetchData();
});
</script>

<template>
  <div class="chart-component">
    <v-chart :option="state.chartData" v-if="state.chartData !== null" style="width: 100%; height: 400px"></v-chart>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    "v-chart": ECharts,
  },
});
</script>

<style scoped>
.chart-component {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 20px;
  margin-top: 20px;
}
</style>
