## ResponsiveForm

ResponsiveForm creates mobile responsive pop-up form for your website.

ResponsiveForm is an alternative to bootstrap's modal dialog. It lets you easily create a pop-up in your website that is both mobile responsive and user friendly. The responsiveForm UI is similar to opening a new screen in native iOS app which makes it intuitive and familiar to most users.

## Mobile Responsive Pop-up

Whenever you have a form with input inside a pop-up, you'll likely face UI issues in mobile devices as different devices handle input differently. iOS for example tries to focus and zoom in onto the input field which creates undesirable effects while you have a pop-up open. ResponsiveForm uses a different method to open a pop-up which eliminates all pop-up problems in mobile devices.

[See a demo of ResponsiveForm](https://rawgit.com/byronsingh/responsiveform/master/demo.html)

## Usage

To use ResponsiveForm, first enclose everything inside the HTML body with a div with class .responsiveform_viewport. This is required to adjust the size of webpage correctly while pop-up is open
```
<html>
<head>
 	...
</head>
<body>
		<div class="responsiveform_viewport">
			<div>
				Your webpage content here
			</div>
		</div>
</body>
</html>
```

Opening a new popup
```
$("#popup_form").responsiveform();
```

Create a new popup dynamically
```
$("<div>Hello World</div>").responsiveform();
```

Set default pop-up width in desktop
```
$("#popup_form").responsiveform({popup_width: 500});
```

Set pop-up title
```
$("#popup_form").responsiveform({header: "Awesome Title"});
```

Close pop-up
```
$(window).responsiveform_close();
```

Callback function
```
$("#popup_form").responsiveform({
	onClosed: function() {
		alert("Pop-up closed");
	}
});
```

Check out here for [more information and examples on ResponsivePopup](http://magicalrosebud.com/create-a-form-popup-that-is-mobile-responsive)