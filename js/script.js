$(document).ready(function() {

  $('.add').click(function () {
    var newT = $('.newT').val();
    $("#columns").append("<li class='column' draggable='true'>"+newT+"</li>");
    $('.newT').val('');

    var dragSrcEl = null;

    function handleDragStart(e) {
      // Target (this) element is the source node.
      dragSrcEl = this;

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.outerHTML);

      this.classList.add('dragElem');
    }

    function handleDragOver(e) {
      if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
      }
      this.classList.add('over');

      e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.

      return false;
    }

    function handleDragEnter(e) {
      // this / e.target is the current hover target.
    }

    function handleDragLeave(e) {
      this.classList.remove('over'); // this / e.target is previous target element.
    }

    function handleDrop(e) {
      // this/e.target is current target element.

      if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
      }

      // Don't do anything if dropping the same column we're dragging.
      if (dragSrcEl != this) {
        // Set the source column's HTML to the HTML of the column we dropped on.
        //alert(this.outerHTML);
        //dragSrcEl.innerHTML = this.innerHTML;
        //this.innerHTML = e.dataTransfer.getData('text/html');
        this.parentNode.removeChild(dragSrcEl);
        var dropHTML = e.dataTransfer.getData('text/html');
        this.insertAdjacentHTML('beforebegin', dropHTML);
        var dropElem = this.previousSibling;
        addDnDHandlers(dropElem);

      }
      this.classList.remove('over');
      return false;
    }

    function handleDragEnd(e) {
      // this/e.target is the source node.
      this.classList.remove('over');

      /*[].forEach.call(cols, function (col) {
          col.classList.remove('over');
      });*/
    }

    function addDnDHandlers(elem) {
      elem.addEventListener('dragstart', handleDragStart, false);
      elem.addEventListener('dragenter', handleDragEnter, false)
      elem.addEventListener('dragover', handleDragOver, false);
      elem.addEventListener('dragleave', handleDragLeave, false);
      elem.addEventListener('drop', handleDrop, false);
      elem.addEventListener('dragend', handleDragEnd, false);

    }

    var cols = document.querySelectorAll('#columns .column');
    [].forEach.call(cols, addDnDHandlers);

  });

  // var firstChild = $('.columns li :first-child');
  //
  // $('#work').click(function() {
  //   $('.doing').append(firstChild);
  //
  // });

  var pomodoro = {
    started: false,
    minutes: 0,
    seconds: 0,
    fillerHeight: 0,
    fillerIncrement: 0,
    interval: null,
    minutesDom: null,
    secondsDom: null,
    fillerDom: null,
    init: function() {
      var self = this;
      this.minutesDom = document.querySelector('#minutes');
      this.secondsDom = document.querySelector('#seconds');
      this.fillerDom = document.querySelector('#filler');
      this.interval = setInterval(function() {
        self.intervalCallback.apply(self);
      }, 1000);
      document.querySelector('#work').onclick = function() {
        self.startWork.apply(self);
      };
      document.querySelector('#shortBreak').onclick = function() {
        self.startShortBreak.apply(self);
      };
      document.querySelector('#longBreak').onclick = function() {
        self.startLongBreak.apply(self);
      };
      document.querySelector('#stop').onclick = function() {
        self.stopTimer.apply(self);
      };
    },
    resetVariables: function(mins, secs, started) {
      this.minutes = mins;
      this.seconds = secs;
      this.started = started;
      this.fillerIncrement = 200 / (this.minutes * 60);
      this.fillerHeight = 0;
    },
    startWork: function() {
      this.resetVariables(25, 0, true);
    },
    startShortBreak: function() {
      this.resetVariables(5, 0, true);
    },
    startLongBreak: function() {
      this.resetVariables(15, 0, true);
    },
    stopTimer: function() {
      this.resetVariables(25, 0, false);
      this.updateDom();
    },
    toDoubleDigit: function(num) {
      if (num < 10) {
        return "0" + parseInt(num, 10);
      }
      return num;
    },
    updateDom: function() {
      this.minutesDom.innerHTML = this.toDoubleDigit(this.minutes);
      this.secondsDom.innerHTML = this.toDoubleDigit(this.seconds);
      this.fillerHeight = this.fillerHeight + this.fillerIncrement;
      this.fillerDom.style.height = this.fillerHeight + 'px';
    },
    intervalCallback: function() {
      if (!this.started) return false;
      if (this.seconds == 0) {
        if (this.minutes == 0) {
          this.timerComplete();
          return;
        }
        this.seconds = 59;
        this.minutes--;
      } else {
        this.seconds--;
      }
      this.updateDom();
    },
    timerComplete: function() {
      this.started = false;
      this.fillerHeight = 0;
    }
  };
  window.onload = function() {
    pomodoro.init();
  };




});
