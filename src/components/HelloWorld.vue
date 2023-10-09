<template>
  <div class="calendar-container" id="calendar"></div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  mounted() {
    this.getCalendarDays();
  },
  methods: {
    getCalendarDays() {
      const calendarContainer = document.getElementById("calendar");

      function generateCalendar(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
          const calendarDay = document.createElement("div");
          calendarDay.classList.add("calendar-day");
          calendarDay.textContent = day;

          if (day === new Date().getDate() && month === new Date().getMonth()) {
            calendarDay.classList.add("current-day");
          }

          calendarContainer.appendChild(calendarDay);
        }
      }

      generateCalendar(2023, 8);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.calendar-navigation {
  background-color: #7baac7; /* Carolina Blue background color */
  padding: 10px;
}

.days-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-around;
}

.days-list li {
  color: #fff;
  font-weight: bold;
  font-size: 1.2em;
  padding: 5px 10px;
  background-color: #2980b9; /* Darker shade of Carolina Blue */
  border-radius: 5px;
}
</style>
