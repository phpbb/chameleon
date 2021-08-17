
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
const $emojis = '[data-emoji-preview="emoji" ]';
const $emojiPreview = '[data-emoji-preview="container"]';
const $emojiFilter = '[data-emoji-filter="input"]';

/**
 * Clears the active state of the provided elements
 *
 * @param     {object} event_       Event
 * @param     {object} $el     The element with the state
 * @param     {object} $toggle The element that contorls the state
 */
const clearToggle = function (event_, $element, $toggle) {
	const { target } = event_;

	if (
		!$(target).is($element) &&
		!$(target).parents().is($element) &&
		!$(target).is($toggle) &&
		!$(target).parents().is($toggle)
	) {
		$($element).each(function () {
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

	tgt.left = x;
	tgt.top = y;
	tgt.width = $target.innerWidth();
	tgt.height = $target.innerHeight();
	tgt.bottom = (tgt.top + tgt.height);
	tgt.right = (tgt.left + tgt.width);

	tgt.coordTop = (tgt.top - tgt.height);
	tgt.coordLeft = (tgt.left - tgt.width);
	tgt.coordRight = $win.width() - (tgt.left + tgt.width);
	tgt.coordBottom = $win.height() - (tgt.top + tgt.height);

	tgt.isTop = tgt.coordTop > 0;
	tgt.isLeft = tgt.coordLeft > 0;
	tgt.isRight = tgt.coordRight > tgt.width;
	tgt.isBottom = tgt.coordBottom > tgt.coordLeft;

	return tgt;
};

/**
 * Clears the active state of the provided tabs
 *
 * @todo      Look at refactoring into clearToggle
 * @param     {object} event_      Event
 * @param     {object} $links The elements with the state
 * @constant  {object} $this
 * @constant  {object} $that
 */
const clearTabs = function (event_, $links) {
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
// 	this.click(event_ => {
// 		event_.preventDefault();
// 		event_.stopPropagation();
// 		target.toggleClass('is-active');
// 	});
// };

/**
 * Toggles the state for Modals
 *
 * @todo      Refactor to toggle function
 * @param     {object} event_      Event
 */
$($modalToggle).click(event_ => {
	event_.preventDefault();
	event_.stopPropagation();
	$($modal).toggleClass('is-active');
});

//---------------------------------------------

/**
 * Replaces emoji preview with selected emoji
 *
 * @todo      Refactor to toggle function
 * @param     {object} event_      	Event
 * @constant  {object} $this
 * @constant  {object} $emoji	stored emoji html
 * @constant  {object} $desc	stored updated emoji shortnames
 */
$($emojis).hover(event_ => {
	const $this = event_.target;
	const $emoji = $($this).children();
	const emojiLastClass = $emoji.attr('class').split(' ').pop();
	let $desc = $($this).attr('data-emoji-name');
	$desc = $($emojiPreview).children().last().text($desc);
	const newClass = $($emojiPreview).children().first().attr('class').split(' ').pop();

	$($emojiPreview).children().remove();
	$emoji.clone().removeClass(emojiLastClass).addClass(newClass).appendTo($emojiPreview);
	$($emojiPreview).append($desc);
});

//---------------------------------------------

/* eslint-disable no-negated-condition */

/**
 * Replaces emoji preview with selected emoji
 *
 * @todo      Refactor to toggle function
 * @constant  {object} query	value to filter
 */
$($emojiFilter).on('input', function () {
	const query = this.value;
	if (query !== '') {
		$('[data-emoji-preview="emoji"]:not([data-emoji-name*="' + query + '"])').hide();
	} else {
		$($emojis).show();
	}
});

/* eslint-enable no-negated-condition */

//---------------------------------------------

/**
 * Toggles the state for Collapse
 *
 * @todo Refactor to toggle function
 * @param     {object} event_      Event
 * @constant  {object} $this
 */
$($collapseToggle).click(function (event_) {
	const $this = $(this);
	const $that = $this.parents($collapseToggleParent).next($collapse);
	const tip = $this.attr('data-toggle-tooltip');

	event_.preventDefault();
	event_.stopPropagation();

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
 * @param     {object} event_      Event
 */
$($toastToggle).click(event_ => {
	event_.preventDefault();
	event_.stopPropagation();
	$($toast).toggleClass('is-active');
});

//---------------------------------------------

/**
 * Toggles the state for Editor Toolbar
 *
 * @todo      Refactor to toggle function
 * @param     {object} event_      Event
 */
$($toolbarToggle).click(event_ => {
	event_.preventDefault();
	event_.stopPropagation();
	$($toolbar).toggleClass('is-active');
});

//---------------------------------------------

/**
 * Toggles the state for Search
 *
 * @todo      Refactor to toggle function
 * @param     {object} event_      Event
 */
$($searchToggle).click(event_ => {
	event_.preventDefault();
	event_.stopPropagation();
	$($search).toggleClass('is-active');
});

//---------------------------------------------

/**
 * Toggles the state for Profile
 *
 * @todo      Refactor to toggle function
 * @param     {object} event_      Event
 */
$($profileToggle).click(event_ => {
	event_.preventDefault();
	event_.stopPropagation();
	$($profile).toggleClass('is-active');
});

//---------------------------------------------

/**
 * Toggles the state for Drawer
 *
 * @todo      Refactor to toggle function
 * @param     {object} event_      Event
 * @constant  {object} $that
 */
$($drawerToggle).click(event_ => {
	const $that = $($drawer);
	event_.preventDefault();
	event_.stopPropagation();
	$that.toggleClass('is-active');
	$($page).attr('style', 'position: relative; transition: 0.35s ease-in-out; left: -' + $that.width() + 'px');
});

/**
 * Toggles the state for DrawerMenu
 *
 * @todo Refactor to toggle function
 * @param     {object} event_      Event
 * @constant  {object} $this
 */
$($drawerMenuToggle).click(function (event_) {
	const $this = $(this);
	event_.preventDefault();
	event_.stopPropagation();
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
		mouseup: event_ => {
			event_.preventDefault();
			event_.stopPropagation();
			clearTabs(event_, $tabs);
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
$($notificationToggle).click(event_ => {
	const $that = $($notification);

	event_.preventDefault();
	event_.stopPropagation();

	$that.toggleClass('is-active');
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
		$this.css({ 'transform-origin': $direction, top: 'inherit', bottom: 0 });
	} else {
		if (targetOffset.left > $(window).width() / 2) {
			$this.css({ 'transform-origin': 'right top', right: 0 });
		} else {
			$this.css('transform-origin', 'left top');
		}
	}
});

/**
 * Handle state for Menus
 *
 * @todo      Refactor Menu into this
 * @param     {object} event_      Event
 * @constant  {object} $this
 * @constant  {object} $that
 */
$($menuToggle).click(function (event_) {
	const $this = $(this);
	const $that = $($menu);
	event_.preventDefault();
	event_.stopPropagation();
	$that.each(() => {
		$this.toggleClass('is-active', false);
	});
	$this.next($menu).toggleClass('is-active');
});

//---------------------------------------------

/**
 * Handles state and creation of Tool Tips
 *
 * @param     {object} event_      Event
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

			tip.top = (link.bottom + 6);
			tip.bottom = (tip.top + tip.height);
			tip.left = ((link.left + (link.width / 2)) - (tip.width / 2));

			if ((tip.bottom + 6) > $(window).height()) {
				tip.top = (link.top - tip.height - 12);
			}

			if ((tip.left + tip.width) > $(window).width()) {
				tip.left = ($(window).width() - 8 - tip.width);
			}

			if (tip.left < 8) {
				tip.left = 8;
			}

			$that.attr('style', 'left: ' + tip.left + 'px; top: ' + tip.top + 'px;');
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
$(document).on('touchstart mouseup', event_ => {
	clearToggle(event_, $search, $searchToggle);
	clearToggle(event_, $drawer, $drawerToggle);
	clearToggle(event_, $menu, $menuToggle);
	clearToggle(event_, $profile, $profileToggle);
	clearToggle(event_, $toolbar, $toolbarToggle);
	clearToggle(event_, $notification, $notificationToggle);
	$($page).removeAttr('style');
});

//---------------------------------------------
