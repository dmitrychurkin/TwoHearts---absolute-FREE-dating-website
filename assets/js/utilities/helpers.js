/* eslint-disable no-undef */
/* eslint-disable eqeqeq */

const Helpers = {
  OFFLINE_GAP: 1800 * 1000,
  profileLocations: ['photo','diary'],
  quickClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  required: errorMess => val => (((val && val.trim()) || '').length > 0) || errorMess,
  email: errorMess => val => parasails.util.isValidEmailAddress(val) || errorMess,
  password: errorMess => val => (((val && val.trim()) || '').length >= 6) || errorMess,
  maxLength: (errorMess, maxChars) => val => (((val && val.trim()) || '').length <= maxChars) || errorMess,
  minLength: (errorMess, minChars) => val => (((val && val.trim()) || '').length >= minChars) || errorMess,
  getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  },
  setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires === 'number' && expires) {
      var d = new Date();
      d.setTime(d.getTime() + expires * 1000);
      expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + '=' + value;

    for (var propName in options) {
      updatedCookie += '; ' + propName;
      var propValue = options[propName];
      if (propValue !== true) {
        updatedCookie += '=' + propValue;
      }
    }

    document.cookie = updatedCookie;
  },

  // normally should be array min 2 items ['1988-06-22','лет','год','года']
  getFormatedAge(ageData) {
    const [ dateOfBirth ] = ageData;
    const age = this.getAge(dateOfBirth);
    return `${age} ${(ageData.length > 2) ? ageData[this._russianAge(age)] : ageData[1]}`;
  },

  zodiakFinder(dateOfBirth) {
    const arr = dateOfBirth.split('-');
    const month = +arr[1];
    const day = +arr[2];
    const Z = [undefined, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1];
    const LAST_DAY =['', 19, 18, 20, 20, 21, 21, 22, 22, 21, 22, 21, 20, 19];
    return (day > LAST_DAY[month]) ? Z[month*1 + 1] : Z[month];
  },

  getAge(dateOfBirth) {
    return new Date().getFullYear() - dateOfBirth.split('-')[0];
  },

  getActiveTabIndex() {
    const locationFlag = this.profileLocations.findIndex(v => window.location.pathname.endsWith(v));
    return ~locationFlag && (locationFlag + 1);
  },

  setActiveTabLocation(tabIndex) {
    const i = this.getActiveTabIndex();
    window.location = i == 0 ? `${window.location.pathname}/${this.profileLocations[tabIndex-1]}`
                      : `${window.location.pathname.split('/').slice(0,-1).join('/')}${this.profileLocations[tabIndex-1] ? ('/'+this.profileLocations[tabIndex-1]) : ''}`;
  },

  getOsFlag() {
    switch (bowser.osname) {
      case 'Android':
        return 1;
      case 'iOS':
      case 'macOS':
        return 0;
    }
    return 2;
  },

  b64toBlob(attachment, sliceSize= 512) {

    const { blobUri } = attachment;

    if (blobUri) {
      return;
    }

    const { data, type } = attachment;

    const byteCharacters = atob(data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type });
    attachment.blobUri = window.URL.createObjectURL(blob);
    return attachment.blobUri;
  },

  formatBytes(bytes, decimals) {
    if (bytes == 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },

  async loadSlickLib() {
    // Usage
    try {
      await Promise.all([
        this._loadFiles(['//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.css', '//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.min.css'], true),
        this._loadFiles('//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js')
      ]);
      delete this.loadSlickLib.delay;
      return true;
    }catch(err) {
      if (err && err.status != 200) {
        this.loadSlickLib.delay = this.loadSlickLib.delay ? (this.loadSlickLib.delay * 2) : 1000;
        setTimeout(() => this.loadSlickLib(), this.loadSlickLib.delay);
      }
    }

  },

  _loadFiles(resourceURI, css= false) {
    resourceURI = Array.isArray(resourceURI) ? resourceURI : [resourceURI];
    const promiseArray = [];
    const documentHead = document.getElementsByTagName('head')[0];
    for (const URL of resourceURI) {
      if (document.querySelector(css ? `[href="${URL}"]` : `[src="${URL}"]`)) {
        promiseArray.push(Promise.resolve());
      }else {
        promiseArray.push(
          new Promise((res, rej) => {
            const resourceEl = css ? document.createElement('link') : document.createElement('script');
            if (css) {
              resourceEl.href = URL;
              resourceEl.type = 'text/css';
              resourceEl.rel = 'stylesheet';
            }else {
              resourceEl.src = URL;
              resourceEl.type = 'text/javascript';
            }
            resourceEl.onload = res;
            resourceEl.onerror = e => {
              documentHead.removeChild(resourceEl);
              rej(e);
            };
            documentHead.appendChild(resourceEl);
          })
        );
      }
    }
    return Promise.all(promiseArray);
  },

  _russianAge(age) {
    let res; let count = age % 100;
    if (count >= 5 && count <= 20) {
      res = 1;
    } else {
      count = count % 10;
      if (count == 1) {
        res = 2;
      } else if (count >= 2 && count <= 4) {
        res = 3;
      } else {
        res = 1;
      }
    }
    return res;
  }

};

window.reCaptchaSuccess = function () {
  APP.$data.captchaChecked = true;
};
window.reCaptchaExpired = function () {
  APP.$data.captchaChecked = false;
};
