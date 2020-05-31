window.metric = {

  // array of event subscribers
  // {eventName: [object1, object2, ...], eventName2: [...], ...}
  _listeners: [],

  // advanced events
  _events: [],

  // data registration
  _registry: [],

  _allowed_var: [],

  // the debug state is responsible for displaying logs in console
  debug: false,

  _timeStart: new Date(),

  _getCurrentTime: function() {
    return new Date().getTime();
  },

  log: function(message) { // simplify log output
    if (!this.debug) {
      return;
    }

    let time = ((this._getCurrentTime() - this._timeStart.getTime()) /
        1000).toString();

    while (time.length < 6) {
      time = time + '0';
    }

    console.log('[Metric] - ' + time.slice(0, 5) + 'ms - ' + message);
  },

  set vars(vars) {
    if (!this._allowed_var.length) { // The list of allowed events can be set only once!
      this._allowed_var = vars;
    } else if (vars) {
      this.log('[Error] You can only set the list of variables once!');
    }
  },

  get vars() {
    return this._allowed_var;
  },

  var: function(name, entry) {

    if (!name) {
      this.log('[Error] A variable name cannot be empty!');
    }

    if (this._allowed_var.indexOf(name) === -1) {
      this.log('[Error] You can\'t work with a variable: ' + name +
          ' if it\'s not allowed!');
      return;
    }

    if (!entry) { // if there is no value, then we request it
      if (!this._registry.hasOwnProperty(name)) {
        this.log('[Warning] Variable  ' + name + ' empty!', true);
        return false;
      }
      return this._registry[name];
    }

    this._registry[name] = entry;

    if (Array.isArray(entry)) {
      entry.toString = function dogToString() {
        return 'an array of ' + entry.length + ' elements';
      };
    }

    this.log('Updated variable: ' + name + ' = ' + entry.toString());

    return self;
  },

  // the list of allowed events is taken at the start of the page.
  set events(events) {
    if (!this._events.length) {
      this._events = events;
    } else if (events) {
      this.log('[Error] The list of allowed events can be set only once.');
    }
  },

  get events() {
    return this._events;
  },

  // event subscription
  on: function(event, callback, name) {
    if (this._events.indexOf(event) === -1) {
      this.log('[Error] You cannot subscribe to the event: ' + event +
          ' if it is not allowed!');
      return;
    }

    if (this._listeners[event] === undefined) {
      this._listeners[event] = {};
      this._listeners[event].data = [];
    }
    this._listeners[event].data.push({
      name: name,
      callback: callback,
    });

    this.log('[' + name + ']' + ' subscribed to the event: ' + event);
  },

  // unsubscribing from an event
  off: function(event, callback) {
    this._listeners[event].data = this._listeners[event].data.filter(
        function(listener) {

          this.log('[' + name + ']' + ' unsubscribing to the event: ' + event);

          return listener !== callback;
        });
  },

  // Sending notifications about the event to subscribers.
  notify: function(event, data, delay) {

    delay = delay || 0;

    if (this._events.indexOf(event) === -1) {
      this.log('[Error] Event: ' + event +
          ' is not allowed, so the notification has not been sent!');
      return;
    }

    if (0 < delay) {
      this.log('[Success] Event registered: ' + event +
          (0 < delay ? ' with a delay of ' + delay + ' ms.' : ''));
    }

    setTimeout(function() {

      // I'm gonna have to check it out, too.
      if (this._listeners[event] === undefined ||
          this._listeners[event].data === undefined) {
        this.log('[Error] Event: ' + event + ' has no subscribers!');
        return;
      }
      this.log('[Alert] Event triggered: ' + event);

      this._listeners[event].data.forEach(function(cur_metric) {
        try {
          cur_metric.callback(data);
          this.log('[' + cur_metric.name + '] Event triggered: ' + event);
        } catch (error) {
          this.log('[Error] [' + cur_metric.name + '] in the event: ' + event +
              ' Error: ' + error);
        }
      }.bind(this));

    }.bind(this), delay);
  },
};
/* for example metric.on(event, function () { // action }, name ) */
