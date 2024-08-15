# Hostman - Your Ultimate DIY Image Hosting Solution

## What’s Hostman?

Welcome to Hostman, the open-source software that lets you take charge of your own image hosting game. Tired of getting those annoying blocks when you try to post images online? Hostman’s here to save the day. Self-host it on your VPS and pair it with apps like ShareX to upload and share your images without any fuss.

## Features

- **Image Hosting**: Upload images, get links, and share them wherever. It’s like magic but with more code.
- **Albums**: Group your pics into albums. Because why shouldn’t your images have a cool way to hang out together?
- **Favorites**: Mark your best images and find them easily later. No more digging through endless folders!
- **Embed Editor**: Customize how your images appear when embedded on platforms like Discord. Show off your stuff in style!
- **API Control**: Get full control over your image hosting with a nifty API. Flexibility and power at your fingertips.
- **Logs**: Keep track of all the shenanigans with detailed logs. Who’s uploading what? You’ll know.

## Routes to Remember

Here’s a quick rundown of the routes you’ll be using:

- `/` - The homepage where the magic begins.
- `/apidetails` - Check out your API key details. Because every superhero needs their gadgets.
- `/embedEditor` - Tweak how your images look when embedded. Make sure they shine!
- `/api` - The central hub for all your API needs. Where the real work happens.
- `/post` - Manage your image posts. Upload, edit, and keep things tidy.
- `/signup` - Create an account and start hosting like a pro. 
- `/login` - Log in to access your image kingdom.
- `/upload` - The place to upload your images. Get those files in here!
- `/account` - Manage your account settings. Personalize everything!
- `/logs` - View logs to see what’s happening behind the scenes. Because knowledge is power.
- `/albums` - Create and manage image albums. Organize your photo collection like a boss.
- `/favorites` - Access your favorite images quickly. Your top picks, all in one place.

## Dependencies

Hostman relies on a bunch of cool packages to do its thing:

- **bcrypt** & **bcryptjs**: For hashing passwords. No plain-text passwords here!
- **colors**: To make console output a bit more colorful and less boring.
- **connect-flash**: For flash messages. Because everyone loves a good surprise message.
- **connect-mongo**: To store sessions in MongoDB. Reliable and secure.
- **csurf**: For CSRF protection. Keeping things safe from sneaky attacks.
- **dotenv**: To manage environment variables. Easy peasy lemon squeezy.
- **ejs**: For rendering views. A bit of HTML with a sprinkle of JavaScript.
- **express**: The core framework. Fast and minimalist.
- **express-rate-limit**: To limit request rates. Protects against those pesky spammers.
- **express-session**: For handling sessions. Keeps track of logged-in users.
- **express-validator**: To validate inputs. Because bad data is the worst.
- **helmet**: For securing your app. Extra protection with a fancy name.
- **http-status-codes**: To handle HTTP status codes. Makes life easier.
- **mime-type**: To handle MIME types. Ensures your files are the right type.
- **mongoose**: For MongoDB. Schema and data management made easy.
- **multer**: For file uploads. Handles files like a pro.
- **nodemon**: To restart your server automatically. Developer’s best friend.
- **passport** & **passport-local**: For authentication. Secure and reliable login.
- **tailwindcss**: For styling. Makes your app look snazzy.
- **uuid**: For generating unique IDs. Ensures everything has its own identity.

## Scripts

Here are some handy scripts you can use:

- `dev`: Run `nodemon app.js` to start the app with automatic restarts. No more manual reboots!
- `build-css`: Run `npx tailwindcss -i base.css -o ./public/css/styles.css --watch` to build your Tailwind CSS. Keeps your styles fresh.

## How to Contribute

Found a bug or have a cool idea? Fork the repo, make your changes, and send a pull request. Let’s make Hostman even better together!

## License

MIT License. Feel free to use, modify, and share. Just give us a shoutout if you like it!

## Bugs & Issues

If you run into any issues or have questions, check out [our GitHub issues page](https://github.com/REGEX777/hostman/issues). We’re here to help!

## Homepage

For more info and updates, visit our [GitHub homepage](https://github.com/REGEX777/hostman#readme).

Thanks for checking out Hostman! Happy hosting!
