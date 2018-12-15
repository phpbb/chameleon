'use strict';

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
const $tabs = '[data-toggle="tabs"]';

function clearToggle(e, $el, $toggle) {
	const target = e.target;

	if (
		!$(target).is($el) &&
		!$(target).parents().is($el) &&
		!$(target).is($toggle) &&
		!$(target).parents().is($toggle)
	) {
		$($el).each(() => {
			$(this).toggleClass('is-active', false);
		});
	}
}

function clearTabs(e, $links) {
	$($links).children().each(() => {
		const $this = $(this);
		const $that = $this.attr('href');

		$this.toggleClass('is-active', false);
		$($that).toggleClass('is-active', false);
	});
}

//---------------------------------------------

$($tabs).children().each(() => {
	const $this = $(this);
	const $that = $this.attr('href');

	$this.on({
		mouseup: e => {
			e.preventDefault();
			e.stopPropagation();
			clearTabs(e, $tabs);
			$this.toggleClass('is-active');
			$($that).toggleClass('is-active');
		}
	});
});

//---------------------------------------------

$($drawerToggle).click(e => {
	e.preventDefault();
	e.stopPropagation();
	$($drawer).toggleClass('is-active');
});

$($drawerMenuToggle).click(e => {
	e.preventDefault();
	e.stopPropagation();
	$(this).next($drawerMenu).toggleClass('is-active');
});

//---------------------------------------------

$($searchToggle).click(e => {
	e.preventDefault();
	e.stopPropagation();
	$($search).toggleClass('is-active');
});

//---------------------------------------------

$($notificationToggle).click(e => {
	e.preventDefault();
	e.stopPropagation();
	const $this = $(this);
	const $that = $($notification);
	const $targetOffset = $(window).width() - ($this.offset().left + $this.width());
	$that.toggleClass('is-active');
	$that.css('right', $targetOffset);
});

//---------------------------------------------

$($menu).each(() => {
	const $this = $(this);
	const $targetOffset = $this.offset();
	if ($targetOffset.left > $(window).width() / 2) {
		$this.css({'transform-origin': 'right top', right: '0'});
	} else {
		$this.css('transform-origin', 'left top');
	}
});

$($menuToggle).click(e => {
	const $this = $(this);
	const $that = $($menu);
	e.preventDefault();
	e.stopPropagation();
	$that.each(() => {
		$this.toggleClass('is-active', false);
	});
	$this.next($menu).toggleClass('is-active');
});

// Clear menus

$(document).on({
	touchstart: e => {
		clearToggle(e, $drawer, $drawerToggle);
		clearToggle(e, $search, $searchToggle);
		clearToggle(e, $notification, $notificationToggle);
		clearToggle(e, $menu, $menuToggle);
	},
	mouseup: e => {
		clearToggle(e, $drawer, $drawerToggle);
		clearToggle(e, $search, $searchToggle);
		clearToggle(e, $notification, $notificationToggle);
		clearToggle(e, $menu, $menuToggle);
	}
});
