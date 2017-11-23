-----------------------------
# Install:
* passport
* passport-local
* passport-local-mongoose
* express-session

------------------------------
## Auth Pt. 1 - Add User Model
* Install all packages
* Define User model

---------------------------------
## Auth Pt. 2 - Register 
* Configure Passport
* Add register routes
* Add register template

--------------------------------
## Auth Pt. 3 - Login
* Add login routes
* Add login template

-------------------------------
## Auth Pt. 4 - Logout/Navbar
* Add logout route
* Prevent user from adding a comment if not signed in 
 + from create new campground (both app.get() and app.post() ROUTES)
    * => because we just hide the form from user
    * => user can use Postman and submit form from POST ROUTE
* Add links to navbar

---------------------------------
## Auth Pt. 5 - Show/Hide Links
* Show/hide auth links correctly
