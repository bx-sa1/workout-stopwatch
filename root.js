export default {
  data() {
    return {
      elapsed_time: 0,
      running: false,
      paused: false,
      times: [],
      current_time_index: -1,
      timelist_selected_index: -1,
      num_restarts: 0,
      interval_id: null,
    };
  },

  methods: {
    clock_start(event) {
      if (this.running) {
        this.paused = !this.paused;
      } else {
        if (this.times.length > 0) {
          this.running = true;
          this.elapsed_time = this.times[0];
          this.current_time_index = 0;
          this.interval_id = setInterval(() => {
            if (!this.paused) {
              this.elapsed_time--;
            }
          }, 1000)
        }
      }
    },

    clock_stop(event) {
      this.running = false;
      clearInterval(this.interval_id);
      this.elapsed_time = 0;
    },

    timelist_add(event) {
      var last = 0;
      if (this.times.length != 0) {
        last = this.times[this.times.length - 1];
      }
      this.times.push(++last);
    },

    timelist_remove(event) {
      this.times.splice(this.timelist_selected_index, 1)
    },

    timelist_select_row(event) {
      this.timelist_selected_index = event.target.parentNode.sectionRowIndex;
    },

    timelist_save_value(event) {
      this.times[this.timelist_selected_index] = event.target.textContent;
    }
  },

  computed: {
    getSecondsInHours() {
      return String(Math.floor(this.elapsed_time / 60 / 60 % 24)).padStart(2, '0');
    },

    getSecondsInMinutes() {
      return String(Math.floor(this.elapsed_time / 60 % 60)).padStart(2, '0');
    },

    getSeconds() {
      return String(Math.floor(this.elapsed_time % 60)).padStart(2, '0');
    }
  },

  watch: {
    elapsed_time(n, o) {
      if (o != 0 && n == 0) {
        var audio = new Audio('beep.wav');
        audio.play();
        if (this.times.length > 1 && this.current_time_index < this.times.length - 1) {
          this.elapsed_time = this.times[++this.current_time_index];
        } else if (this.auto_restart && this.current_time_index == this.times.length - 1) {
          this.current_time_index = 0;
          this.elapsed_time = this.times[0];
        } else {
          this.clock_stop();
        }
      }
    },

    current_time_index(n, o) {
      if (o >= 0 && o < this.$refs.timelist.length) this.$refs.timelist[o].style.background = "";
      if (n >= 0 && n < this.$refs.timelist.length) this.$refs.timelist[n].style.background = "gray";
    },

    timelist_selected_index(n, o) {
      if (o >= 0 && o < this.$refs.timelist.length) this.$refs.timelist[o].style.background = "";
      if (n >= 0 && n < this.$refs.timelist.length) this.$refs.timelist[n].style.background = "#d3d3d3";
    }
  }
}
