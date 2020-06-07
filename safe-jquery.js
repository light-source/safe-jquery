import $ from 'jquery';

class SafeJquery {


    //////// constructor


    constructor() {
        this._errorCallback = null;
    }


    //////// static methods


    static IsUndefined(value) {
        return 'undefined' === typeof value;
    }

    static IsBool(value) {
        return 'boolean' === typeof value;
    }


    //////// setters


    setErrorCallback(errorCallback) {
        this._errorCallback = errorCallback;
    }


    //////// methods


    triggerError(element) {

        if ('function' !== typeof this._errorCallback) {
            return;
        }

        this._errorCallback(element);

    }


}

let _safeQuery = new SafeJquery();

$.extend($, {

    _onDocumentReady: callback => {

        if ('loading' !== document.readyState) {
            callback();
            return;
        }

        // new jquery syntax
        $(callback);

    },

    _onWindowLoad: callback => {

        if ('complete' === document.readyState) {
            callback();
            return;
        }

        $(window).on('load', callback);

    },

    _body: () => {
        return $('body');
    },

});

$.fn.extend({

    _domLength: function () {
        return $._body().find(this).length;
    },

    _isSingle: function (isRequire) {

        let isSingle = 1 === this.length;

        if (isRequire &&
            !isSingle) {
            _safeQuery.triggerError(this);
        }

        return isSingle;
    },

    _isNotEmpty: function (isRequire) {

        let isNotEmpty = !!this.length;

        if (!isNotEmpty &&
            isRequire) {
            _safeQuery.triggerError(this);
        }

        return isNotEmpty;
    },

    //// get = single, set = multiple

    _val: function (value = null, isRequire = true) {

        let isGetMode = null === value;
        let response = isGetMode ?
            '' :
            this;

        if ((isGetMode && !this._isSingle(isRequire)) ||
            (!isGetMode && !this._isNotEmpty(isRequire))) {
            return response;
        }

        let isInput = this.is('input') || this.is('textarea') || this.is('select') || this.is('option');
        let isCheckbox = this.is('input[type=checkbox]');

        if (!isInput) {
            _safeQuery.triggerError(this);
            return response;
        }

        if (isGetMode) {

            if (!isCheckbox) {

                response = this.val();
                // can be null (ex. select without options)
                response = null === response ? '' : response;
                response = response.toString().trim();

            } else {
                response = !!this._prop('checked');
            }

            return response;
        }

        if (!isCheckbox) {
            this.val(value.toString().trim());
        } else {
            let isChecked = !!value && '0' !== value;
            this._prop('checked', isChecked);
        }

        return response;
    },

    /*
    * unlike with std : work directly with html data- attributes
    *
    * Does not use jquery .data method, because it's only cache &
    * does not save new value to DOM - read documentation.
    * (else search by new/updated data attribute is doesn't available)
    * */

    _data: function (name, value = null, isRequire = true) {

        let isGetMode = null === value;
        name = 'data-' + name;
        let response = isGetMode ?
            '' :
            this;

        if ((isGetMode && !this._isSingle(isRequire)) ||
            (!isGetMode && !this._isNotEmpty(isRequire))) {
            return response;
        }

        if (isGetMode) {

            response = this.attr(name);

            if (Helper.IsUndefined(response)) {

                response = '';

                if (isRequire) {
                    _safeQuery.triggerError(this);
                }

            }

            return response.toString().trim();
        }

        this.attr(name, value.toString().trim());

        return response;
    },

    _html: function (html = null, isRequire = true) {

        let isGetMode = null === html;
        let response = isGetMode ?
            '' :
            this;

        if ((isGetMode && !this._isSingle(isRequire)) ||
            (!isGetMode && !this._isNotEmpty(isRequire))) {
            return response;
        }

        if (isGetMode) {
            return this.html().toString().trim();
        }


        this.html(html.toString().trim());

        return response;
    },

    _text: function (text = null, isRequire = true) {

        let isGetMode = null === text;
        let response = isGetMode ?
            '' :
            this;

        if ((isGetMode && !this._isSingle(isRequire)) ||
            (!isGetMode && !this._isNotEmpty(isRequire))) {
            return response;
        }

        if (isGetMode) {
            return this.text().toString().trim();
        }

        this.text(text.toString().trim());

        return response;
    },

    _attr: function (name, value = null, isRequire = true) {

        let isGetMode = null === value;
        let response = isGetMode ?
            '' :
            this;

        if ((isGetMode && !this._isSingle(isRequire)) ||
            (!isGetMode && !this._isNotEmpty(isRequire))) {
            return response;
        }

        if (isGetMode) {

            response = this.attr(name);

            if (SafeJquery.IsUndefined(response)) {

                response = '';

                if (isRequire) {
                    _safeQuery.triggerError(this);
                }

            }

            return response.toString().trim();
        }


        this.attr(name, value.toString().trim());

        return response;
    },

    _prop: function (name, value = null, isRequire = true) {

        let isGetMode = null === value;
        let response = isGetMode ?
            '' :
            this;

        if ((isGetMode && !this._isSingle(isRequire)) ||
            (!isGetMode && !this._isNotEmpty(isRequire))) {
            return response;
        }

        if (isGetMode) {

            response = this.prop(name);

            if (SafeJquery.IsUndefined(response)) {

                response = '';

                if (isRequire) {
                    _safeQuery.triggerError(this);
                }

            }

            return (SafeJquery.IsBool(response) ?
                response :
                response.toString().trim());
        }

        value = SafeJquery.IsBool(response) ?
            value :
            value.toString().trim();
        this.prop(name, value);

        return response;
    },

    // args = array

    _trigger: function (name, args = null, isRequire = true) {

        let response = this;

        if (!this._isNotEmpty(isRequire)) {
            return response;
        }

        if (null === args) {
            this.trigger(name);
        } else {
            this.trigger(name, args);
        }

        return response;
    },

    // unlike with std :  run browser form validation

    _submit: function (isRequire = true) {

        let response = this;

        if (!this._isNotEmpty(isRequire)) {
            return response;
        }

        if (!this.is('form')) {

            _safeQuery.triggerError(this);

            return response;
        }


        $('<input>')
            ._attr('type', 'submit')
            .css('display', 'none')
            .appendTo(this)
            .click()
            .remove();

        return response;
    },

    // unlike with std : check also self, not only children

    _find: function (selector) {

        let response = this.find(selector);

        return this.is(selector) ?
            response.add(this) :
            response;
    },

    //  unlike with std : require exists at least one element

    _on: function (name, callback) {

        let response = this;

        if (!this._isNotEmpty(true)) {
            return;
        }

        this.on(name, callback);

        return response;
    },

});

export default {
    setErrorCallback: (errorCallback) => {
        _safeQuery.setErrorCallback(errorCallback);
    },
};