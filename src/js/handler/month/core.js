/**
 * @fileoverview Module for calculate date by month view and mouse event object
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';
var util = global.tui.util,
    mfloor = Math.floor;

var common = require('../../common/common'),
    domutil = require('../../common/domutil'),
    domevent = require('../../common/domevent');

/**
 * Get high order function that can calc date in mouse point
 * @param {Month} monthView - month view
 * @returns {function} function return event data by mouse event object
 */
function getMousePosDate(monthView) {
    var weekColl = monthView.children,
        weeks = weekColl.sort(function(a, b) {
            return util.stamp(a) - util.stamp(b);
        }),
        weekCount = weekColl.length,
        days = weekColl.single().getRenderDateRange(),
        dayCount = days.length,
        relativeContainer = util.pick(monthView.vLayout.panels[1], 'container'),
        size = domutil.getSize(relativeContainer);

    /**
     * Get date related with mouse event object
     * @param {object} mouseEvent - click event data
     * @returns {object} data related with mouse event
     */
    function getDate(mouseEvent) {
        var pos = domevent.getMousePosition(mouseEvent, relativeContainer),
            x = mfloor(common.ratio(size[0], dayCount, pos[0])),
            y = mfloor(common.ratio(size[1], weekCount, pos[1])),
            weekdayView, date;

        weekdayView = util.pick(weeks, y);

        if (!weekdayView) {
            return;
        }

        date = util.pick(weekdayView.getRenderDateRange(), x);

        if (!date) {
            return;
        }

        return {
            x: x,
            y: y,
            sizeX: dayCount,
            sizeY: weekCount,
            date: date,
            weekdayView: weekdayView,
            triggerEvent: mouseEvent.type
        };
    }

    return getDate;
}

module.exports = getMousePosDate;
