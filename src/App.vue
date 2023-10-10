<template>
  <div class="container-layout">
    <div class="current-month-title"> <img :src="require('@/assets/img/chevronBack.png') " alt="" class="chevronBack" id="chevronBack" @click="showPreviousMonth"> <p class="current-month" id="current-month">{{ currentMonth }}</p> <p class="next-month" id="next-month">{{ nextMonth }}</p> <img :src="require('@/assets/img/chevronFron.png')" alt="" id="chevronFront"  @click="showNextMonth"></div>
    <div class="calendar-container" id="calendar">
      </div>

    <div class="calendar-container" id="calendar1"></div>
    <div class="center-circle">
      <p class="day-of-month" id="day-of-month" v-if="getDaysPassed() > 50">Enter Date</p>
      <p class="day-of-month" id="day-of-month" v-if="getDaysPassed() === 1">Day 1</p>
      <p class="day-of-month" id="day-of-month" v-if="getDaysPassed()<50">Day {{ getDaysPassed() }}</p>

      <button class="log-period" id="log-p"  v-on:click="openModalPeriod">
        Log Period
      </button>
    </div>
    <div class="information-boxes">
      <div class="information-menstruation box-info">
        <h3>Period Length</h3>
        <p class="day-of-month" id="day-of-month" v-if="getDaysPassed() > 50">--</p>
        <p v-else>{{ getLastPeriodDay() }} days</p>
        <br> <hr>
        <b>Next menstruation:</b> <br /><span class="dateForPeriod">{{
            dateForPeriodValue
          }}</span>
      </div>
      <div class="statistics box-info">

        <img :src="require('@/assets/img/menstruation-data.png')" alt="" class="ovulation-image" id="btnOpenM"  @click="openMenstruationInfo">
        <h3>Menstruations</h3>
        <div class="menstruation-data-info"><p>
          <img :src="require('@/assets/img/backArrow.png')" alt="" class="back-arrow" id="backArrowM" @click="closeMenstruationInfo">
          <br>
          
        </p>
        <p><b>Last Menstruations</b> </p>
        <p><ul class="spremljene-menstruacije">
          <li v-for="period in arrayOfPeriods" :key="period[0]">
            {{ formatDate(period[0]) }}
          </li>
        </ul></p></div>
        

        
      </div>
      <div class="last-menstruations box-info">
        <img :src="require('@/assets/img/ovulation-fer-days.png')" alt="" class="menstruation-image" id="btnOvulationOpen"  @click="showOvulation">
        
        
        
        <h3>Ovulation and fertile days</h3>
        <div class="general-ovulation-info" >
          
          <img :src="require('@/assets/img/backArrow.png')" alt="" class="back-arrow" id="backArrowOvulation" @click="closeOvulation">
          <p><b>Date of Ovulation:</b> <br /> <span class="dateOfOvulation">{{ datumOvulacije }}</span> </p>
        <p><b>Fertile Days:</b></p>
        <ul class="fertile-days">
          <li v-for="(item, index) in fertileDaysArray" :key="index">
            {{ item }}
          </li>
        </ul></div>
        
      </div>
    </div>
  </div>
  <div id="myModal" class="modal">
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


export default {
  name: "App",
  components: {
   
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

    };
  },
  computed: {
    nextMonth() {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const currentDate = new Date();
    const nextMonthIndex = (currentDate.getMonth() + 1) % 12;
    return months[nextMonthIndex];
  },


    currentMonth() {
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const currentDate = new Date();
      return months[currentDate.getMonth()];
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
    //this.getCalendarNextMonth();
    this.displayPeriodInfo();
  },

  methods: {

    formatDate(dateString) {
      const [year, month, day] = dateString.split('-');
      return `${day}.${month}.${year}`;
    },

      showPreviousMonth(){
        const chevronFront=document.getElementById("chevronFront");
        const currentMonth=document.getElementById("current-month");
        const nextMonth=document.getElementById("next-month");
        const chevronBack=document.getElementById("chevronBack")
        const containerNextMonth=document.getElementById("calendar1");
        const containerCurrentMonth=document.getElementById("calendar");

       

          chevronFront.style.display="block";
          currentMonth.style.display="grid";
          nextMonth.style.display="none";
          chevronBack.style.display="none";
          containerCurrentMonth.style.display="grid";
          containerNextMonth.style.display="none"

        


      },

    showNextMonth(){
      const chevronFront=document.getElementById("chevronFront");
      const currentMonth=document.getElementById("current-month");
      const nextMonth=document.getElementById("next-month");
      const chevronBack=document.getElementById("chevronBack")
      const containerNextMonth=document.getElementById("calendar1");
      const containerCurrentMonth=document.getElementById("calendar");

      
        chevronFront.style.display="none";
        currentMonth.style.display="none";
        nextMonth.style.display="flex";
        chevronBack.style.display="block";
        containerCurrentMonth.style.display="none";
        containerNextMonth.style.display="grid"
      

    },


    


    // današnji datum
    currentDate(){
      let todaysDate=newDate();
      let day = String(today.getDate()).padStart(2, '0'); // Get day and pad with leading zero if necessary
let month = String(today.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad with leading zero if necessary
let year = String(today.getFullYear()).slice(-2); // Get last two digits of the year

let formattedDate = `${day}.${month}.${year}`;
return formattedDate;

    },
    //open Menstruation info

    openMenstruationInfo(){

      const infoMenstruation=document.getElementsByClassName("menstruation-data-info")[0];
      const imageOpenInfo=document.getElementById("btnOpenM")
//backArrowM
      
        infoMenstruation.style.display="block";
        imageOpenInfo.style.display="none"
      


    },

closeMenstruationInfo(){
  const infoMenstruation=document.getElementsByClassName("menstruation-data-info")[0];
      const imageOpenInfo=document.getElementById("btnOpenM");
      const arrowBackM=document.getElementById("backArrowM");



  infoMenstruation.style.display="none";
  imageOpenInfo.style.display="block";





},

    // SHOW Ovulation info

    showOvulation(){

      const btnIconOvulationOpen=document.getElementById("btnOvulationOpen");
      const getInfoOvulation=document.getElementsByClassName("general-ovulation-info")[0];

    
      getInfoOvulation.style.display="block";
      btnIconOvulationOpen.style.display="none";
    






    },

// close Ovulation info
    closeOvulation(){
  const closeOvulation=document.getElementById("backArrowOvulation");
  const btnIconOvulationOpen=document.getElementById("btnOvulationOpen");
  const getInfoOvulation=document.getElementsByClassName("general-ovulation-info")[0];
  
 
    getInfoOvulation.style.display="none";
    btnIconOvulationOpen.style.display="flex";
    


  

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

      

      return daysPassed ;
    },

    displayPeriodInfo() {
      // getting the days of the month into the array
     const elements = document.getElementsByClassName('calendar-day');
      const arrayEl = Array.from(elements);
      // Now we will try to get the date of menstruation month and day
      let danasnjidatum = new Date();
      // mjesec i dan ovog mjeseca

      let formattedDate = `${danasnjidatum.getDate() < 10 ? '0' : ''}${danasnjidatum.getDate()}. ${danasnjidatum.getMonth() + 1 < 10 ? '0' : ''}${danasnjidatum.getMonth() + 1}. ${danasnjidatum.getFullYear()}.`;


      
      const circleDisplay = document.getElementsByClassName("center-circle")[0];
      const calendarDay = document.getElementsByClassName("calendar-day");
      
      console.log("Današnji datum",danasnjidatum.toDateString());
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

      console.log("Formated dan", formattedDate);
      console.log("prvi dan", this.fertileDaysArray[1]);
      console.log("prvi dan", this.fertileDaysArray[2]);
      console.log("prvi dan", this.fertileDaysArray[3]);
      console.log("prvi dan", this.fertileDaysArray[4]);
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

    displayMenstrualDates() {
      let arrayTempM = JSON.parse(localStorage.getItem("arrayOfPeriods"));

      this.arrayOfPeriods = arrayTempM.reverse();
      
    },

    savePeriod() {
      const periodInfo = [this.thePeriodDay, this.numberOfDays];
      console.log(this.thePeriodDay, this.numberOfDays);
      this.fertileDaysArray = [];
      let arrayOfPeriods = JSON.parse(localStorage.getItem("arrayOfPeriods"));
      if (arrayOfPeriods == null) {
        arrayOfPeriods = [];
        console.log("Empty array initialized");
      }

      arrayOfPeriods.push(periodInfo);
      localStorage.setItem("arrayOfPeriods", JSON.stringify(arrayOfPeriods));

      const modalInput = document.getElementById("myModal");

      modalInput.style.display = "none";

      console.log("SAVE PERIOD");
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
      const modalInput = document.getElementById("myModal");
      const logPeriod = document.getElementById("log-p");
      
        modalInput.style.display = "block";
      
    },

    closeModalPeriod() {
      const modalInput = document.getElementById("myModal");

      
        modalInput.style.display = "none";
      
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
    calendarDay.textContent = `${day} (${dayNames[new Date(year, month, day).getDay()]})`;

    if (day === (new Date()).getDate() && monthOffset === 0) {
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

.container-layout {
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
#calendar1,.calendar-container {
  max-width: 1440px;
  display: grid;
  grid-template-columns: repeat(7,1fr);
  width: 60%;
  justify-content: center;
  gap: 10px;
  margin: auto;
  margin-bottom: 2em;
  background-color: whitesmoke;
  height: fit-content;
  align-content: center;
  border-radius: 20px;
  padding: 10px;
}

.calendar-day {
  width: 50px;
  height: 50px;
  text-align: center;
  font-size:19px;
  border-radius: 50%;
  cursor: pointer;
  padding: 5px;
}

.current-day {
  border: 2px solid #fb627e; /* Carolina Blue outline for current day */
  color: white;
  background-color: #fb627e;
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
  display: none;
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

#calendar1 {
  display: none;
  
}
.spremljene-menstruacije ul li:first-child {
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
.spremljene-menstruacije li:nth-child(n + 6) {
  display: none;
}


.information-menstruation h3 {
  text-align: center;
}
.information-menstruation p {
  text-align: center;
  font-size: 40px;
  color: white;
}
.dateForPeriod {
  color: white;
}
.spremljene-menstruacije li:first-child{
  font-size: 20px;
  text-decoration: underline;
  color: #2c3e50;
}
.spremljene-menstruacije li{
  color: white;
  padding: 5px;
}
.dateOfOvulation{
  color: white;
}

.current-month-title{
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

.current-month-title img{
  width: 20px;
  height: 20px;
}
.current-month-title p{
  font-size: 28px;
}

.menstruation-image,.ovulation-image{
  width: 60%;
  margin: auto;
  cursor: pointer;
}

.back-arrow{
  width: 50px;
  cursor: pointer;
}
.menstruation-data-info{
display: none;
}

.general-ovulation-info{
display: none;
}

.chevronBack{
  display: none;
}

.next-month{
  display: none;
}


/*Media Queries*/
@media(max-width:800px){
  .center-circle{
    width: 400px;
    height: 400px;

  }
  .calendar-day{
    width: 30px;
    height: 30px;
    
    font-size: 14px;
  }
  .day-of-month{
    font-size: 32px;
  }
  .information-boxes{
    grid-template-columns: 1fr;
  }
}

@media(max-width:600px){
  #calendar1, .calendar-container{
    width: 100%;
    border-radius: 0;
    overflow: hidden;
  }
  .container-layout{
    gap:0;
  }
}

@media(max-width: 480px){
  .center-circle{
    width: 350px;
    height: 350px;
  }
  #calendar1, .calendar-container{
    gap:2px;
    
    
  }
  .calendar-day{
    font-size: 12px;
  }
}

@media(max-width:380px){
  .center-circle{
    width: 320px;
    height: 320px;

  }
  #calendar1, .calendar-container{
    gap:0px;
  border-radius: 0;  
 
  
  }
  .center-circle{
    width: 280px;
    height: 280px;
  }
  
}

@media(max-width:280px){
  .center-circle{
    width: 200px;
    height: 200px;
  }
  .box-info{
    width: 150px;
    height: 1500px;
  }
  #calendar1, .calendar-container{
   
  grid-template-columns: repeat(6,1fr);  
    
  }
}

.dateForPeriod{
  font-size: 32px;
}
.information-menstruation p{
  margin: 0;
}

.information-menstruation h3{
  margin: 0;
}

</style>
