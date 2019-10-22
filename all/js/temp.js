/* eslint-disable multiline-comment-style */

const $drawerToggle = '[data-toggle="drawer"]';
const $drawer = '[data-container="drawer"]';
const $drawerMenuToggle = '[data-toggle="drawer-menu"]';
const $drawerMenu = '[data-container="drawer-menu"]';
const $page = '[data-container="page"]';
const $notificationToggle = '[data-toggle="notifications"]';
const $notification = '[data-container="notificiations"]';
const $menuToggle = '[data-toggle="menu"]';
const $menu = '[data-container="menu"]';
const $searchToggle = '[data-toggle="search"]';
const $search = '[data-container="search"]';
const $profileToggle = '[data-toggle="profileToggle"]';
const $profile = '[data-container="profile"]';
const $tabs = '[data-toggle="tabs"]';
const $modalToggle = '[data-toggle="modal"]';
const $modal = '[data-container="modal"]';
const $toastToggle = '[data-toggle="toast"]';
const $toast = '[data-container="toast"]';
const $collapseToggle = '[data-toggle="collapse"]';
const $collapseToggleParent = '[data-toggle-parent="collapse"]';
const $collapse = '[data-container="collapse"]';
const $tooltip = '[data-tooltip="true"]';
const $tooltipContainer = '[data-tooltip-container="true"]';
const $toolbarToggle = '[data-toggle="toolbar"]';
const $toolbar = '[data-container="toolbar"]';
const $overlayContainer = '[data-container="overlay"]';

/**
 * Clears the active state of the provided elements
 *
 * @param     {object} e       Event
 * @param     {object} $el     The element with the state
 * @param     {object} $toggle The element that contorls the state
 */
const clearToggle = function (e, $el, $toggle) {
	const { target, } = e;

	if (
		!$(target).is($el) &&
		!$(target).parents().is($el) &&
		!$(target).is($toggle) &&
		!$(target).parents().is($toggle)
	) {
		$($el).each(function () {
			$(this).toggleClass('is-active', false);
		});
	}
};

/**
 * Returns clearence object for displaying content to avoid edges
 *
 * @param     {object} $target Element to test
 * @param     {number} x custom top offset
 * @param     {number} y custom left offset
 * @returns   {object} boolean for each edge of window and all dimensions and positions
 */
const edgeDetect = ($target, x, y) => {
	const $win = $(window);
	const tgt = {};

	if (!x) {
		x = $target.offset().left;
	}

	if (!y) {
		y = $target.offset().top;
	}

	tgt.l = x;
	tgt.t = y;
	tgt.w = $target.innerWidth();
	tgt.h = $target.innerHeight();
	tgt.b = (tgt.t + tgt.h);
	tgt.r = (tgt.l + tgt.w);

	tgt.tc = (tgt.t - tgt.h);
	tgt.lc = (tgt.l - tgt.w);
	tgt.rc = $win.width() - (tgt.l + tgt.w);
	tgt.bc = $win.height() - (tgt.t + tgt.h);

	tgt.top = tgt.tc > 0;
	tgt.left = tgt.lc > 0;
	tgt.right = tgt.rc > tgt.w;
	tgt.bottom = tgt.bc > tgt.lc;

	return tgt;
};

/**
 * Clears the active state of the provided tabs
 *
 * @todo      Look at refactoring into clearToggle
 * @param     {object} e      Event
 * @param     {object} $links The elements with the state
 * @constant  {object} $this
 * @constant  {object} $that
 */
const clearTabs = function (e, $links) {
	$($links).children().each(function () {
		const $this = $(this);
		const $that = $this.attr('href');

		$this.toggleClass('is-active', false);
		$($that).toggleClass('is-active', false);
	});
};

//---------------------------------------------

/**
 * Toggles the "is-active" class for the given element
 *
 * @this     {object}
 * @param     {object} target      element to apply toggle class on
 */

// const isActive = function (target) {
// 	this.click(e => {
// 		e.preventDefault();
// 		e.stopPropagation();
// 		target.toggleClass('is-active');
// 	});
// };

/**
 * Toggles the state for Modals
 *
 * @todo      Refactor to toggle function
 * @param     {object} e      Event
 */
$($modalToggle).click(e => {
	e.preventDefault();
	e.stopPropagation();
	$($modal).toggleClass('is-active');
});

/**
 * Toggles the state for Collapse
 *
 * @todo Refactor to toggle function
 * @param     {object} e      Event
 * @constant  {object} $this
 */
$($collapseToggle).click(function (e) {
	const $this = $(this);
	const $that = $this.parents($collapseToggleParent).next($collapse);
	const tip = $this.attr('data-toggle-tooltip');

	e.preventDefault();
	e.stopPropagation();

	$that.toggleClass('is-collapsed');
	$this.attr('data-toggle-tooltip', $this.attr('title'));
	$this.attr('title', tip);
	$this.toggleClass('is-collapsed');
	$($tooltipContainer).remove();
});

//---------------------------------------------

/**
 * Toggles the state for Toasts
 *
 * @todo      Refactor to toggle function
 * @param     {object} e      Event
 */
$($toastToggle).click(e => {
	e.preventDefault();
	e.stopPropagation();
	$($toast).toggleClass('is-active');
});

//---------------------------------------------

/**
 * Toggles the state for Editor Toolbar
 *
 * @todo      Refactor to toggle function
 * @param     {object} e      Event
 */
$($toolbarToggle).click(e => {
	e.preventDefault();
	e.stopPropagation();
	$($toolbar).toggleClass('is-active');
	$($overlayContainer).toggleClass('is-active');
});

//---------------------------------------------

/**
 * Toggles the state for Search
 *
 * @todo      Refactor to toggle function
 * @param     {object} e      Event
 */
$($searchToggle).click(e => {
	e.preventDefault();
	e.stopPropagation();
	$($search).toggleClass('is-active');
});

//---------------------------------------------

/**
 * Toggles the state for Profile
 *
 * @todo      Refactor to toggle function
 * @param     {object} e      Event
 */
$($profileToggle).click(e => {
	e.preventDefault();
	e.stopPropagation();
	$($profile).toggleClass('is-active');
	$($overlayContainer).toggleClass('is-active');
});

//---------------------------------------------

/**
 * Toggles the state for Drawer
 *
 * @todo      Refactor to toggle function
 * @param     {object} e      Event
 * @constant  {object} $that
 */
$($drawerToggle).click(e => {
	const $that = $($drawer);
	e.preventDefault();
	e.stopPropagation();
	$that.toggleClass('is-active');
	$($overlayContainer).toggleClass('is-active');
	$($page).attr('style', 'position: relative; transition: 0.35s ease-in-out; left: -' + $that.width() + 'px');
});

/**
 * Toggles the state for DrawerMenu
 *
 * @todo Refactor to toggle function
 * @param     {object} e      Event
 * @constant  {object} $this
 */
$($drawerMenuToggle).click(function (e) {
	const $this = $(this);
	e.preventDefault();
	e.stopPropagation();
	$this.next($drawerMenu).toggleClass('is-active');
});

//---------------------------------------------

/**
 * Toggles state for Tabs
 *
 * @constant  {object} $this
 * @constant  {object} $that
 * @event     Toggle#Tab
 * @event     Toggle#Content
 */
$($tabs).children().each(function () {
	const $this = $(this);
	const $that = $($this.attr('href'));

	$this.on({
		mouseup: e => {
			e.preventDefault();
			e.stopPropagation();
			clearTabs(e, $tabs);
			$this.toggleClass('is-active');
			$that.toggleClass('is-active');
		},
	});
});

//---------------------------------------------

/**
 * Handle state for Notification Menu
 *
 * @constant  {object} $this
 * @constant  {object} $that
 * @constant  {number} $targetOffset
 */
$($notificationToggle).click(e => {
	const $that = $($notification);

	e.preventDefault();
	e.stopPropagation();

	$that.toggleClass('is-active');
	$($overlayContainer).toggleClass('is-active');
});

//---------------------------------------------

/**
 * Handle animation direction for Menus
 *
 * @todo      Refactor into Menu toggle
 * @constant  {object} $this
 * @constant  {object} targetOffset
 */
$($menu).each(function () {
	const $this = $(this);
	const targetOffset = $this.offset();
	const $direction = $this.data('direction');
	if ($direction) {
		$this.css({ 'transform-origin': $direction, top: 'inherit', bottom: 0, });
	} else {
		if (targetOffset.left > $(window).width() / 2) {
			$this.css({ 'transform-origin': 'right top', right: 0, });
		} else {
			$this.css('transform-origin', 'left top');
		}
	}
});

/**
 * Handle state for Menus
 *
 * @todo      Refactor Menu into this
 * @param     {object} e      Event
 * @constant  {object} $this
 * @constant  {object} $that
 */
$($menuToggle).click(function (e) {
	const $this = $(this);
	const $that = $($menu);
	e.preventDefault();
	e.stopPropagation();
	$that.each(() => {
		$this.toggleClass('is-active', false);
	});
	$this.next($menu).toggleClass('is-active');
	if ($this.next($menu).hasClass('is-ative')) {
		if (!$($overlayContainer).hasClass('is-active')) {
			$($overlayContainer).toogleClass('is-active');
		}
	}
});

//---------------------------------------------

/**
 * Handles state and creation of Tool Tips
 *
 * @param     {object} e      Event
 * @constant  {object} $this
 * @constant  {object} $that
 * @constant  {string} tip
 * @constant  {object} link
 * @constant  {object} tipPos
 * @event     Toggle#ShowTip
 * @event     Toggle#HideTip
 */
$($tooltip).each(function () {
	const $this = $(this);
	let $that = {};
	$this.on({
		mouseenter: () => {
			$('body').append('<span class="c-tooltip" data-tooltip-container="true"></span>');
			$that = $($tooltipContainer);
			$that.append($this.attr('title'));

			const link = edgeDetect($this);
			const tip = edgeDetect($that);

			tip.t = (link.b + 6);
			tip.b = (tip.t + tip.h);
			tip.l = ((link.l + (link.w / 2)) - (tip.w / 2));

			if ((tip.b + 6) > $(window).height()) {
				tip.t = (link.t - tip.h - 12);
			}

			if ((tip.l + tip.w) > $(window).width()) {
				tip.l = ($(window).width() - 8 - tip.w);
			}

			if (tip.l < 8) {
				tip.l = 8;
			}

			$that.attr('style', 'left: ' + tip.l + 'px; top: ' + tip.t + 'px;');
			$that.toggleClass('is-active');
		},
		mouseleave: () => {
			$that.remove();
		},
	});
});

//----------------------------------------------

/**
 * Hide all elements on document load
 *
 * @constant  {object} $this
 * @constant  {object} $that
 * @event     Hide#Drawer
 * @event     Hide#Search
 * @event     Hide#NotificationMenu
 * @event     Hide#Menu
 * @event     Hide#Profile
 */
$(document).on({
	touchstart: e => {
		clearToggle(e, $search, $searchToggle);
	},
	mouseup: e => {
		clearToggle(e, $search, $searchToggle);
	},
});

$($overlayContainer).on({
	touchstart: e => {
		clearToggle(e, $drawer, $drawerToggle);
		clearToggle(e, $menu, $menuToggle);
		clearToggle(e, $profile, $profileToggle);
		clearToggle(e, $toolbar, $toolbarToggle);
		clearToggle(e, $notification, $notificationToggle);
		$($overlayContainer).toggleClass('is-active');
		$($page).removeAttr('style');
	},
	mouseup: e => {
		clearToggle(e, $drawer, $drawerToggle);
		clearToggle(e, $menu, $menuToggle);
		clearToggle(e, $profile, $profileToggle);
		clearToggle(e, $toolbar, $toolbarToggle);
		clearToggle(e, $notification, $notificationToggle);
		$($overlayContainer).toggleClass('is-active');
		$($page).removeAttr('style');
	},
});

//---------------------------------------------