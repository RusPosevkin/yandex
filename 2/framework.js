"use strict";
/**
 * @author Ruslan Posevkin
 */

(function(root, factory) {

    root.$fw = factory();

})(this, function() {

    var $fw = function(selector) {
        return new $fw.prototype.init(selector);
    };

    $fw.prototype = {
        constructor: $fw,
        length: 0,
        init: function(selector) {
            var elements;
            this.selector = selector;

            if (typeof selector === "string") {
                elements = document.querySelectorAll(this.selector);
            } else if (selector.length) {
                elements = document.querySelectorAll(selector[0]);
            } else {
                elements = [selector];
            }

            for (var i = 0; i < elements.length; i++) {
                this[i] = elements[i];
            }

            this.length = elements.length;
        }
    };

    $fw.prototype.init.prototype = $fw.prototype;

    /**
     * Iterate over a $fw object,
     * executing a function for each matched element.
     * @param {Function} callback
     */
    $fw.prototype.each = function (callback) {
        for (var i = 0; i < this.length; i++) {
            var item = this[i];
            var returns = callback.call(item, i);
            if (returns === false) {
                break;
            }
        }

        return this;
    };

    /**
     * Internal function for class list manipulation.
     * @param {String} action - Type of operation with class list.
     * @param {Object} self - Context.
     * @param {(String | String[])} name - Name of the class.
     * @param {Boolean} [condition] - Condition for 'toggle' operation.
     */
    $fw._classManipulation = function (action, self, name, condition) {
        var length = name && name.length;

        if (length) {
            self.each(function () {
                if (typeof name !== "string") {
                    for (var j = 0; j < length; j++) {
                        this.classList[action](name[j]);
                    }
                } else {
                    if (action === "toggle") {
                        this.classList[action](name, condition);
                    } else {
                        this.classList[action](name);
                    }
                }
            });
        } else {
            if (action !== "remove")  return;

            self.each(function () {
                this.className = "";
            });
        }
    };


    /**
     * Get list of classes for the set of matched elements.
     * @returns {Object[]} Array of classes list for matched elements.
     */
    $fw.prototype.getClassList = function () {
        var classList = [];

        this.each(function () {
            classList.push(this.classList);
        });

        return classList;
    };

    /**
     * Adds the specified class(es) to each element
     * in the set of matched elements.
     * @param {(String | String[])} name - Name of class(es).
     */
    $fw.prototype.addClass = function (name) {
        $fw._classManipulation("add", this, name);

        return this;
    };

    /**
     * Remove a single class, multiple classes, or all classes
     * from each element in the set of matched elements.
     * @param {(String | String[])} [name] - Name of class(es) need to be removed.
     * If name is omitted - all classes of each element
     * in the set of matched elements will be removed.
     */
    $fw.prototype.removeClass = function (name) {
        $fw._classManipulation("remove", this, name);

        return this;
    };

    /**
     * Add or remove one or more classes from each element
     * in the set of matched elements,
     * depending on either the class's presence
     * or the value of the condition argument.
     * @param {(String | String[])} name - Name of class(es).
     * @param {Boolean} [condition] - Condition for state of toggle.
     */
    $fw.prototype.toggleClass = function (name, condition) {
        $fw._classManipulation("toggle", this, name, condition);

        return this;
    };

    /**
     * Determine whether any of the matched elements are assigned the given class.
     * Will return true if the class is assigned to an element,
     * even if other classes also are.
     * @param {String} name - Name of the class.
     * @returns {Boolean}
     */
    $fw.prototype.hasClass = function (name) {
        var isHasClass = false;

        this.each(function () {
            for (var i = 0; i < this.classList.length; i++) {
                if (this.classList[i] !== name) continue;

                isHasClass = true;
                break;
            }
        });

        return isHasClass;
    };

    /**
     * Setter: Set the HTML contents of each element
     * in the set of matched elements.
     * @param {String} content - HTML layout that will be inserted.
     * @returns {String} Inserted HTML layout.
     *
     * Getter: Get the HTML contents of the first element
     * in the set of matched elements.
     * @returns {String} HTML layout of the first matched node.
     */
    $fw.prototype.html = function (content) {
        if (content !== undefined) {
            this.each(function () {
                this.innerHTML = content;
            });

            return content;
        }

        return this[0].innerHTML;
    };

    /**
     * Setter: Set the content of each element in the set of
     * matched elements to the specified text.
     * @param {String} value - text that will be inserted.
     *
     * Getter: Get the combined text contents of each element
     * in the set of matched elements.
     * @returns {String} Concatenated text from all matched elements.
     */
    $fw.prototype.text = function (value) {
        if (!value) {
            var text = "";
            this.each(function () {
                text += this.textContent;
            });

            return text;
        }

        return this.each(function () {
            this.textContent = value;
        });
    };

    return $fw;
});