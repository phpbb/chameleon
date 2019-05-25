/* eslint-disable multiline-comment-style */

const $drawerToggle = '[data-toggle="drawer"]';
const $drawer = '[data-container="drawer"]';
const $drawerMenuToggle = '[data-toggle="drawer-menu"]';
const $drawerMenu = '[data-container="drawer-menu"]';
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
const $tooltip = '[data-tooltip="true"]';

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
});

//---------------------------------------------

/**
 * Toggles the state for Drawer
 *
 * @todo      Refactor to toggle function
 * @param     {object} e      Event
 */
$($drawerToggle).click(e => {
	e.preventDefault();
	e.stopPropagation();
	$($drawer).toggleClass('is-active');
});

/**
 * Toggles the state for DrawerMenu
 *
 * @todo Refactor to toggle function
 * @param     {object} e      Event
 */
$($drawerMenuToggle).click(function (e) {
	e.preventDefault();
	e.stopPropagation();
	$(this).next($drawerMenu).toggleClass('is-active');
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
$($notificationToggle).click(function (e) {
	e.preventDefault();
	e.stopPropagation();
	const $this = $(this);
	const $that = $($notification);
	const $targetOffset = $(window).width() - $this.offset().left - $this.width();
	$that.toggleClass('is-active');
	$that.css('right', $targetOffset);
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
	if (targetOffset.left > $(window).width() / 2) {
		$this.css({ 'transform-origin': 'right top', right: 0, });
	} else {
		$this.css('transform-origin', 'left top');
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
	const tip = $this.attr('title');
	let $that = {};
	$this.data('tip', tip);
	$this.on({
		mouseenter: () => {
			$this.attr('title', '');
			$('body').append('<span class="c-tooltip"></span>');
			$that = $('.c-tooltip');
			$that.append(tip);
			const link = $this.offset();
			const tipPos = $that.offset();
			tipPos.top = link.top + $this.innerHeight() + 6;
			if ((tipPos.top + $that.innerHeight() + 6) > ($(window).height() - 8)) {
				tipPos.top = link.top - $that.innerHeight() - 12;
			}

			tipPos.left = (link.left + ($this.innerWidth() / 2)) - ($that.innerWidth() / 2);
			if ((tipPos.left + $that.width()) > ($(window).width() - 8)) {
				tipPos.left = $(window).width() - 8 - $that.innerWidth();
			}

			$that.attr('style', 'left: ' + tipPos.left + 'px; top: ' + tipPos.top + 'px;');
			$that.toggleClass('is-active');
		},
		mouseleave: () => {
			$this.attr('title', tip);
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
		clearToggle(e, $drawer, $drawerToggle);
		clearToggle(e, $search, $searchToggle);
		clearToggle(e, $notification, $notificationToggle);
		clearToggle(e, $menu, $menuToggle);
		clearToggle(e, $profile, $profileToggle);
	},
	mouseup: e => {
		clearToggle(e, $drawer, $drawerToggle);
		clearToggle(e, $search, $searchToggle);
		clearToggle(e, $notification, $notificationToggle);
		clearToggle(e, $menu, $menuToggle);
		clearToggle(e, $profile, $profileToggle);
	},
});

//---------------------------------------------
