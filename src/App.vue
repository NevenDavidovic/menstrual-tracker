<template>
  <div class="container-layout">
    <div class="current-month-title">
      <img
        :src="require('@/assets/img/chevronBack.png')"
        alt=""
        class="chevronBack"
        id="chevronBack"
        @click="showPreviousMonth"
        :class="{ hidden: !nextMonthBoolean }"
      />
      <p
        class="current-month"
        id="current-month"
        :class="{ hidden: nextMonthBoolean }"
      >
        {{ currentMonth }}
      </p>
      <p
        class="next-month"
        id="next-month"
        :class="{ hidden: !nextMonthBoolean }"
      >
        {{ nextMonth }}
      </p>
      <img
        :src="require('@/assets/img/chevronFron.png')"
        alt=""
        id="chevronFront"
        @click="showNextMonth"
        :class="{ hidden: nextMonthBoolean }"
      />
    </div>
    <div
      class="calendar-container box"
      id="calendar"
      :class="{ hidden: nextMonthBoolean }"
    ></div>

    <div
      class="calendar-container box"
      id="calendar1"
      :class="{ hidden: !nextMonthBoolean }"
    ></div>

    <div class="center-circle">
      <p class="day-of-month" id="day-of-month" v-if="getDaysPassed() === 1">
        Day 1
      </p>
      <p
        class="day-of-month"
        id="day-of-month"
        v-else-if="getDaysPassed() > 50"
      >
        --
      </p>
      <p class="day-of-month" id="day-of-month" v-else>
        Day {{ getDaysPassed() }}
      </p>

      <button class="log-period" id="log-p" v-on:click="openModalPeriod">
        Log Period
      </button>
    </div>
    <ColorPallette />

    <div class="information-menstruation-2">
      <div class="item-1">
        <h3>Period Length</h3>
        <p
          class="day-of-month"
          id="day-of-month"
          v-if="getDaysPassed() > 50"
        ></p>
        <p class="dateForPeriod" v-else>{{ getLastPeriodDay() }} days</p>
      </div>

      <div class="item-2">
        <h3>Next menstruation</h3>
        <span class="dateForPeriod">{{ dateForPeriodValue }}</span>
      </div>
    </div>

    <div class="information-boxes">
      <div class="information-menstruation box-info">
        <WeatherComponent />
      </div>
      <div class="statistics box-info">
        <img
          :src="require('@/assets/img/menstruation-data.png')"
          alt=""
          class="ovulation-image"
          id="btnOpenM"
          @click="openMenstruationInfo"
        />
        <h3>Menstruations</h3>
        <div class="menstruation-data-info">
          <p>
            <img
              :src="require('@/assets/img/backArrow.png')"
              alt=""
              class="back-arrow"
              id="backArrowM"
              @click="closeMenstruationInfo"
            />
            <br />
          </p>
          <p><b>Last Menstruations</b></p>
          <div
            v-for="(period, index) in arrayOfPeriods"
            :key="index"
            class="spremljene-menstruacije"
          >
            <p>{{ formatDate(period[0]) }}</p>

            <img
              :src="require('@/assets/img/trash-icon.png')"
              alt=""
              class="trashicon"
              style="border: none"
              @click="deletePeriod(period[0])"
            />
          </div>
        </div>
      </div>
      <div class="last-menstruations box-info">
        <img
          :src="require('@/assets/img/ovulation-fer-days.png')"
          alt=""
          class="menstruation-image"
          id="btnOvulationOpen"
          @click="showOvulation"
        />

        <h3>Ovulation and fertile days</h3>
        <div class="general-ovulation-info">
          <img
            :src="require('@/assets/img/backArrow.png')"
            alt=""
            class="back-arrow"
            id="backArrowOvulation"
            @click="closeOvulation"
          />
          <p>
            <b>Date of Ovulation:</b> <br />
            <span class="dateOfOvulation">{{ datumOvulacije }}</span>
          </p>
          <p><b>Fertile Days:</b></p>
          <ul class="fertile-days">
            <li v-for="(item, index) in fertileDaysArray" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div id="myModal" class="modal" v-if="modalShowVar">
    <div class="modal-content">
      <span class="close" @click="closeModalPeriod">&times;</span>
      <label for="datepicker">Select Date:</label>
      <input
        type="date"
        id="datepicker"
        class="date-of-period"
        v-model="thePeriodDay"
        required
      />
      <input
        type="number"
        id="datepicker"
        class="number-of days"
        v-model="numberOfDays"
        required
      />
      <button id="saveButton" @click="savePeriod" class="saveBtn">Save</button>
    </div>
  </div>
</template>

<script>
import WeatherComponent from "./components/WeatherComponent.vue";
import ColorPallette from "./components/ColorPallette.vue";
export default {
  name: "App",
  components: {
    WeatherComponent,
    ColorPallette,
  },
  data() {
    return {
      numberOfDays: 30,
      thePeriodDay: "",
      calculatorNumDays: null,
      calculatorDateOfPeriod: "",
      dateForPeriodValue: "",
      arrayOfPeriods: "",
      datumOvulacije: "",
      fertileDaysArray: [],
      firstFertileDayDate: "",
      lastFertileDayDate: "",
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      nextMonthBoolean: false,
      modalShowVar: false,
    };
  },
  computed: {
    nextMonth() {
      const currentDate = new Date();
      const nextMonthIndex = (currentDate.getMonth() + 1) % 12;
      return this.months[nextMonthIndex];
    },

    currentMonth() {
      const currentDate = new Date();
      return this.months[currentDate.getMonth()];
    },
    getDayOfMonth() {
      const d = new Date();
      this.dayOfMonth = d.getDate();
      return this.dayOfMonth; // Make sure to return the value
    },
  },
  mounted() {
    this.getCalendarDays();
    this.displayMenstrualDates();
    this.calculateExpectedPeriod();
    this.displayPeriodInfo();
  },

  methods: {
    formatDate(dateString) {
      const [year, month, day] = dateString.split("-");
      return `${day}.${month}.${year}`;
    },

    showPreviousMonth() {
      this.nextMonthBoolean = false;
    },

    showNextMonth() {
      this.nextMonthBoolean = true;
    },

    // današnji datum
    currentDate() {
      let todaysDate = newDate();
      let day = String(today.getDate()).padStart(2, "0"); // Get day and pad with leading zero if necessary
      let month = String(today.getMonth() + 1).padStart(2, "0"); // Get month (0-indexed) and pad with leading zero if necessary
      let year = String(today.getFullYear()).slice(-2); // Get last two digits of the year

      let formattedDate = `${day}.${month}.${year}`;
      return formattedDate;
    },
    //open Menstruation info

    openMenstruationInfo() {
      const infoMenstruation = document.getElementsByClassName(
        "menstruation-data-info"
      )[0];
      const imageOpenInfo = document.getElementById("btnOpenM");
      //backArrowM

      infoMenstruation.style.display = "block";
      imageOpenInfo.style.display = "none";
    },

    closeMenstruationInfo() {
      const infoMenstruation = document.getElementsByClassName(
        "menstruation-data-info"
      )[0];
      const imageOpenInfo = document.getElementById("btnOpenM");
      const arrowBackM = document.getElementById("backArrowM");

      infoMenstruation.style.display = "none";
      imageOpenInfo.style.display = "block";
    },

    // SHOW Ovulation info

    showOvulation() {
      const btnIconOvulationOpen = document.getElementById("btnOvulationOpen");
      const getInfoOvulation = document.getElementsByClassName(
        "general-ovulation-info"
      )[0];

      getInfoOvulation.style.display = "block";
      btnIconOvulationOpen.style.display = "none";
    },

    // close Ovulation info
    closeOvulation() {
      const closeOvulation = document.getElementById("backArrowOvulation");
      const btnIconOvulationOpen = document.getElementById("btnOvulationOpen");
      const getInfoOvulation = document.getElementsByClassName(
        "general-ovulation-info"
      )[0];

      getInfoOvulation.style.display = "none";
      btnIconOvulationOpen.style.display = "flex";
    },

    getDaysPassed() {
      function daysPassedSince(startDate) {
        const today = new Date();
        const start = new Date(startDate);
        const timeDiff = Math.abs(today - start);
        const daysPassed = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        return daysPassed;
      }
      let datumMenge = this.getLastPeriod();
      const startDate = datumMenge; // Change this to your specific start date
      let daysPassed = daysPassedSince(startDate);

      return daysPassed - 1;
    },

    displayPeriodInfo() {
      // getting the days of the month into the array
      const elements = document.getElementsByClassName("calendar-day");
      const arrayEl = Array.from(elements);
      // Now we will try to get the date of menstruation month and day
      let danasnjidatum = new Date();
      // mjesec i dan ovog mjeseca

      let formattedDate = `${
        danasnjidatum.getDate() < 10 ? "0" : ""
      }${danasnjidatum.getDate()}. ${
        danasnjidatum.getMonth() + 1 < 10 ? "0" : ""
      }${danasnjidatum.getMonth() + 1}. ${danasnjidatum.getFullYear()}.`;

      const circleDisplay = document.getElementsByClassName("center-circle")[0];
      const calendarDay = document.getElementsByClassName("calendar-day");

      if (danasnjidatum.toDateString() == this.dateForPeriodValue) {
        circleDisplay.style.backgroundColor = "#FF1F49";
      } else if (danasnjidatum.toDateString() == this.datumOvulacije) {
        circleDisplay.style.backgroundColor = "#BD3951";
      } else if (
        formattedDate == this.fertileDaysArray[0] ||
        formattedDate == this.fertileDaysArray[1] ||
        formattedDate == this.fertileDaysArray[2] ||
        formattedDate == this.fertileDaysArray[3] ||
        formattedDate == this.fertileDaysArray[4] ||
        formattedDate == this.fertileDaysArray[5]
      ) {
        circleDisplay.style.backgroundColor = "#FB627E";
      } else {
        circleDisplay.style.backgroundColor = "#FED154";
      }
    },
    calculateExpectedPeriod() {
      let datumMenge = this.getLastPeriod();
      console.log("datumMenge:", datumMenge);
      let daniTrajanjaMenge = this.getLastPeriodDay();

      let dateFormated = new Date(datumMenge);
      console.log("dani");
      console.log(daniTrajanjaMenge);

      function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      }
      function removeDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
      }
      //računanje predviđene slijedeće menstruacije
      this.dateForPeriodValue = addDays(datumMenge, daniTrajanjaMenge)
        .toString()
        .split(" ")
        .slice(0, 4)
        .join(" ");
      this.datumOvulacije = removeDays(this.dateForPeriodValue, 14)
        .toString()
        .split(" ")
        .slice(0, 4)
        .join(" ");

      for (let i = 18; i >= 12; i--) {
        if (i === 14) continue;
        let tempD = removeDays(this.dateForPeriodValue, i);
        this.fertileDaysArray.push(tempD.toLocaleDateString());
      }

      console.log(this.fertileDaysArray);
    },
    deletePeriod(primaryKey) {
      let arrayOfPeriods = JSON.parse(localStorage.getItem("arrayOfPeriods"));
      for (let i = 0; i < arrayOfPeriods.length; i++) {
        if (arrayOfPeriods[i][0] === primaryKey) {
          arrayOfPeriods.splice(i, 1);
          break;
        }
      }
      localStorage.setItem("arrayOfPeriods", JSON.stringify(arrayOfPeriods));
      this.displayMenstrualDates();
    },

    displayMenstrualDates() {
      let arrayTempM = JSON.parse(localStorage.getItem("arrayOfPeriods"));

      this.arrayOfPeriods = arrayTempM.reverse();
    },

    savePeriod() {
      const periodInfo = [this.thePeriodDay, this.numberOfDays];
      if (this.thePeriodDay == "" || this.numberOfDays == "") {
        alert("Error! You did not enter complete period info!");
        return;
      }

      this.fertileDaysArray = [];
      let arrayOfPeriods = JSON.parse(localStorage.getItem("arrayOfPeriods"));
      if (arrayOfPeriods == null) {
        arrayOfPeriods = [];
      }

      arrayOfPeriods.push(periodInfo);
      localStorage.setItem("arrayOfPeriods", JSON.stringify(arrayOfPeriods));

      const modalInput = document.getElementById("myModal");

      modalInput.style.display = "none";

      this.displayMenstrualDates();
      this.calculateExpectedPeriod();
      this.displayPeriodInfo();
    },
    getLastPeriodDay() {
      let arrayOfPeriods = JSON.parse(localStorage.getItem("arrayOfPeriods"));

      if (arrayOfPeriods && arrayOfPeriods.length > 0) {
        const lastPeriod = arrayOfPeriods[arrayOfPeriods.length - 1];

        return lastPeriod[1];
      }

      return null;
    },

    getLastPeriod() {
      let arrayOfPeriods = JSON.parse(localStorage.getItem("arrayOfPeriods"));

      if (arrayOfPeriods && arrayOfPeriods.length > 0) {
        const lastPeriod = arrayOfPeriods[arrayOfPeriods.length - 1];

        return lastPeriod[0];
      }

      return null;
    },

    openModalPeriod() {
      this.modalShowVar = true;
    },

    closeModalPeriod() {
      this.modalShowVar = false;
    },

    getCalendarDays() {
      const currentDate = new Date();
      const godina = currentDate.getFullYear();
      const mjesec = currentDate.getMonth() + 1; // Month is 0-indexed, so add 1
      const dan = currentDate.getDate();

      const calendarContainer = document.getElementById("calendar");

      function generateCalendar(containerId, monthOffset) {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + monthOffset);

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const calendarContainer = document.getElementById(containerId);

        for (let day = 1; day <= daysInMonth; day++) {
          const calendarDay = document.createElement("div");
          calendarDay.classList.add("calendar-day");
          calendarDay.textContent = `${day} (${
            dayNames[new Date(year, month, day).getDay()]
          })`;

          if (day === new Date().getDate() && monthOffset === 0) {
            calendarDay.classList.add("current-day");
          }

          calendarContainer.appendChild(calendarDay);
        }
      }

      generateCalendar("calendar", 0); // Generate current month's calendar
      generateCalendar("calendar1", 1); // Generate next month's calendar
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
  overflow: hidden;
}
.hidden {
  display: none !important;
}
.information-menstruation-2 {
  display: flex;
  max-width: 800px;
  margin: 0 auto;
  justify-items: center;
  justify-content: space-around;
  width: 100%;
}

.container-layout {
  background-image: url("/src/assets/img/pexels-codioful-6985003.jpg");
  background-color: #fcd4ca;

  width: 100%;
  height: max-content;
  display: flex;
  gap: 2em;
  flex-direction: column;
  align-content: center;
  padding: 2em 0 0 0;
}
.center-circle {
  background-image: url("./assets/img/flower.png");
  background-size: cover;
  border: 2px solid whitesmoke;
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 500px;
  height: 500px;

  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  justify-content: center;
}

.log-period {
  max-width: 200px;
  margin: 0 auto;
}

.information-boxes {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  max-width: 1440px;
  margin: 1em auto;
  justify-content: space-between;
}

.box-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  color: white;
  background-color: #fb627e;
  max-width: 300px;
  border-radius: 20px;
  padding: 20px;
  margin: 1em;
  box-shadow: #fb627e;
  border: 2px solid whitesmoke;
  text-align: center;
  height: fit-content;
  min-height: 220px;
  width: 200px;
}

.day-of-month {
  font-size: 70px;
  font-weight: 700;
  color: #fb627e;
  margin-bottom: 10px;
}
#calendar1,
.calendar-container {
  opacity: 0.8;
  max-width: 1440px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  width: 60%;
  justify-content: center;
  gap: 10px;
  margin: auto;
  margin-bottom: 2em;
  background-color: whitesmoke;
  justify-items: center;
  align-content: center;
  border-radius: 20px;
  padding: 10px;
}

.calendar-container {
  height: 400px;
}

.calendar-day {
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 19px;
  border-radius: 50%;
  cursor: pointer;
  padding: 5px;
  color: white;
  position: relative;
}

.current-day {
  border: 2px solid #fb627e; /* Carolina Blue outline for current day */
  color: white;
  background-color: #fb627e;
  animation: hueRotate ease-in-out 10s infinite;
}

.log-period {
  background-color: transparent;
  box-shadow: none;
  border: 2px solid #fb627e;
  padding: 10px 20px;
  border-radius: 20px;
  color: #fb627e;
  font-weight: 700;
  cursor: pointer;
}

.log-period:hover {
  background-color: orangered;
  color: #7baac7;
}

/* Modal Styles */
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
  padding-top: 60px;
}

.modal-content {
  background-color: #fefefe;
  margin: 5% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

/* Additional styling for input and button */
#datepicker {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}

#saveButton {
  background-color: #7baac7;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

#saveButton:hover {
  background-color: #254153;
}

.spremljene-menstruacije div p:first-child {
  text-align: center;
}
.fertile-days {
  color: white;

  padding: 5px;
}
.fertile-days,
.spremljene-menstruacije {
  list-style: none;
}
.spremljene-menstruacije p:nth-child(n + 6) {
  display: none;
}

.information-menstruation h3 {
  text-align: center;
}
.information-menstruation p {
  text-align: center;
  font-size: 28px;
  color: white;
}

.spremljene-menstruacije li:first-child {
  font-size: 20px;
  text-decoration: underline;
  color: #2c3e50;
}
.spremljene-menstruacije li {
  color: white;
  padding: 5px;
}
.dateOfOvulation {
  color: white;
}

.current-month-title {
  display: flex;
  background-color: #fb627e;
  color: white;
  height: 50px;
  text-align: center;
  justify-content: center;
  align-content: center;
  align-items: center;
  gap: 1em;
}

.current-month-title img {
  width: 20px;
  height: 20px;
}
.current-month-title p {
  font-size: 28px;
}

.menstruation-image,
.ovulation-image {
  width: 60%;
  margin: auto;
  cursor: pointer;
}

.back-arrow {
  width: 50px;
  cursor: pointer;
}
.menstruation-data-info {
  display: none;
}

.general-ovulation-info {
  display: none;
}

/*Media Queries*/
@media (max-width: 800px) {
  .center-circle {
    width: 400px;
    height: 400px;
  }
  .box,
  .box:before {
    border-radius: 0 !important;
  }
  .calendar-day {
    width: 38px;
    height: 38px;

    font-size: 14px;
  }
  .day-of-month {
    font-size: 28px;
  }
  .information-boxes {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  #calendar1,
  .calendar-container {
    width: 100%;
    border-radius: 0;
    overflow: hidden;
    padding: 0;
  }
  .container-layout {
    gap: 0;
  }
  .calendar-container {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .center-circle {
    width: 350px;
    height: 350px;
  }
  #calendar1,
  .calendar-container {
    gap: 2px;
  }
  .calendar-day {
    font-size: 12px;
  }
  .calendar-container {
    height: 250px;
  }
}

@media (max-width: 380px) {
  .center-circle {
    width: 320px;
    height: 320px;
  }
  #calendar1,
  .calendar-container {
    gap: 0px;
    border-radius: 0;
  }
  .center-circle {
    width: 280px;
    height: 280px;
  }
}

@media (max-width: 280px) {
  .center-circle {
    width: 200px;
    height: 200px;
  }
  .box-info {
    width: 150px;
    height: 1500px;
  }
  #calendar1,
  .calendar-container {
    grid-template-columns: repeat(6, 1fr);
  }
}

.dateForPeriod {
  font-size: 28px;
  margin: 0;
  color: white;
  text-shadow: 1px 1px 2px pink;
}
.information-menstruation p {
  margin: 0;
}
.information-menstruation {
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-content: center;
  align-items: center;
  align-content: center;
  gap: 1em;
}
.information-menstruation h3 {
  margin: 0;
}

.trashicon {
  width: 30px;
  height: 28px;
  cursor: pointer;
}
.spremljene-menstruacije {
  display: flex;
  justify-content: center;
  gap: 1em;
  align-items: center;
}

@keyframes hueRotate {
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}
.box {
  position: relative;
  border-radius: 21px;
}
.box:before {
  border-radius: 21px;
  position: absolute;
  content: "";
  width: calc(100% + 0px);
  height: calc(100% + 0px);
  top: 0;
  left: 0;
  border: 2px solid white;
  filter: blur(0);
  opacity: 1;
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1);
}

.box-inner {
  position: relative;
  width: 100%;
  height: 100%;
}
.box:before,
.box-inner {
  background-color: #2515d7;
  box-shadow: 2px 2px 12px 0 rgba(0, 0, 0, 0.58);
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='198'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='-10.959%25' y2='100%25'%3e%3cstop stop-color='%23fcc900' stop-opacity='.25' offset='0%25'/%3e%3cstop stop-color='%23fcc900' offset='100%25'/%3e%3c/linearGradient%3e%3c/defs%3e%3cpath fill='url(%23a)' fill-rule='evenodd' d='M.005 121C311 121 409.898-.25 811 0c400 0 500 121 789 121v77H0s.005-48 .005-77z'/%3e%3c/svg%3e"),
    url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='198'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='-10.959%25' y2='100%25'%3e%3cstop stop-color='%23fcc900' stop-opacity='.25' offset='0%25'/%3e%3cstop stop-color='%23fcc900' offset='100%25'/%3e%3c/linearGradient%3e%3c/defs%3e%3cpath fill='url(%23a)' fill-rule='evenodd' d='M.005 121C311 121 409.898-.25 811 0c400 0 500 121 789 121v77H0s.005-48 .005-77z'/%3e%3c/svg%3e"),
    url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='198'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='-10.959%25' y2='100%25'%3e%3cstop stop-color='%23fcc900' stop-opacity='.25' offset='0%25'/%3e%3cstop stop-color='%23fcc900' offset='100%25'/%3e%3c/linearGradient%3e%3c/defs%3e%3cpath fill='url(%23a)' fill-rule='evenodd' d='M.005 121C311 121 409.898-.25 811 0c400 0 500 121 789 121v77H0s.005-48 .005-77z'/%3e%3c/svg%3e");
  background-repeat: repeat-x;
  background-size: 1600px 50%;
  background-position: 0 130%, -50px 130%, 500px 130%;

  animation: 20s waves linear infinite forwards;
}

@keyframes waves {
  to {
    background-position: 1600px 130%, 3150px 130%, 5300px 130%;
  }
}
</style>
