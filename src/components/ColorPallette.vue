<template>
  <div class="color-pallete">
    <div class="color-item">
      <div class="color normal-day"></div>
      <h2>Normal Days</h2>
    </div>
    <div class="color-item">
      <div class="color fertile-day"></div>
      <h2>Fertile days</h2>
    </div>
    <div class="color-item">
      <div class="color ovulation-day"></div>
      <h2>Ovulation day</h2>
    </div>
    <div class="color-item">
      <div class="color next-menstruation-day"></div>
      <h2>Next Menstruation</h2>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style scoped>
.color-pallete {
  display: flex;
  border-bottom: 2px solid white;
  border-top: 2px solid white;
  gap: 20px;
  max-width: 800px;
  margin: 32px auto 0 auto;
  width: 100%;
}

.color-item {
  display: flex;
  justify-items: center;
  align-content: center;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.color-item h2 {
  color: white;
  font-weight: 400;
}

.color {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid white;
}

.normal-day {
  background-color: #fed154;
}
.fertile-day {
  background-color: #fb627e;
}
.next-menstruation-day {
  background-color: #ff1f49;
}
.ovulation-day {
  background-color: #bd3951;
}

@media (max-width: 1024px) {
  .color-pallete {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 32px;
  }
  .color-item {
    justify-content: unset;
  }
}

@media (max-width: 800px) {
  .color-item h2 {
    font-size: 14px;
  }
  .color {
    width: 30px;
    height: 30px;
  }
}

@media (max-width: 390px) {
  .color-pallete {
    grid-template-columns: 1fr;
  }
}
</style>
