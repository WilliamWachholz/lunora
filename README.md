# Lunora

Lunora is a demo e-commerce application specialized in products related to the moon.  
I have made it as part of my professional portfolio.   
It contains all the basics features of an e-commerce.  

## Flow
Create new login on Register menu  
View product list/details and add to cart  
Review cart and proceeed to checkout  
Inform all shippment and payment information  
Place order  
Click on user name and view newly created order in My Orders  

## Tech
Angular 20  
Bootstrap  
Font Awesome  
Typescript  
C#  
ASP. Net MVC  
.NET Core 8  
Entity Framework  
Swagger  
Docker  
SqlServer Express 16  
Postgresql 17  
GitHub for versioning and code repository  
Aiven to host Postrgre database  
Render to host Asp. net backend  
Vercel to host Angular frontend  
VSCode for all development  

## Info (for developers)

To setup database  
Create your database (Postgresql or SqlServer) on your server  
Change the ConnectionStrings.ActiveDatabase to switch between database type  
Configure ConnectionStrings.SqlServer or ConnectionStrings.Postgresql  
Execute migrations to create the metadata  
dotnet ef migrations initialcreate  
dotnet ef database update  

To deploy backend  
Render keep track of commit in the repository  

To deploy frontend  
ng build --configuration production  
vercel --prod  

To run backend on dev
dotnet run

To run frontend on dev  
ng run  

## Improvements (to-do)  
Implement payment processing  
Implement order processing  
Normalize shipping and address info in order entity  
Create category for products  
Create user roles   
Create admin page to manage users and products  
Order print in page confirmation  
Send order notifications by email  
Forgot your passowrd feature  

### Feel free to fork this project

### I do not own the rights for the images used in this project
