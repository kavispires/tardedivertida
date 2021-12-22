class LocalStorage {
  private appName: string;
  notLoaded: boolean;
  store: PlainObject;

  constructor() {
    this.store = {};
    this.notLoaded = true;
    this.appName = 'tarde-divertida';

    this.init();
  }

  /**
   * Initialize local storage and get all values
   * @returns the store
   */
  init() {
    this.load();
    return this.get();
  }

  /**
   * Load local storage from the browser
   */
  load() {
    const localStorage: PlainObject = JSON.parse(window.localStorage.getItem(this.appName) ?? '');

    if (localStorage) {
      this.store = localStorage;
      this.notLoaded = false;
    }
  }

  /**
   * Get value by key or all values
   * @param key
   * @returns
   */
  get(key?: string) {
    if (this.notLoaded) {
      this.load();
    }

    if (key) {
      return this.store[key] || null;
    }
    return this.store;
  }

  /**
   * Set a property to local storage
   * To remove/unset a property, pass an object with the desired key and value null
   * @param value
   * @returns
   */
  set(value: string | PlainObject) {
    if (this.notLoaded) {
      this.load();
    }

    const type = typeof value;
    if (['string', 'object'].includes(type)) {
      console.error('localStorage set value must be a string or a key-value object');
      return;
    }

    // When value is a string, use as a property toggle
    if (typeof value === 'string') {
      this.store[value] = !this.store[value];
    } else {
      // Remove any null or undefined property
      Object.entries(value).forEach(([key, item]) => {
        if (item === null || item === undefined) {
          delete value[key];
        }
      });

      this.store = {
        ...this.store,
        ...value,
      };
    }

    this.save();
  }

  // Save the store to the browser local storage
  save() {
    if (this.notLoaded) {
      this.load();
    }

    window.localStorage.setItem(this.appName, JSON.stringify(this.store));
    this.load();
  }
}

export default new LocalStorage();
